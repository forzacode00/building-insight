import { useId } from "react";
import { motion } from "framer-motion";

function lerpColor(a: string, b: string, t: number): string {
  const parse = (hex: string) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const bv = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${bv})`;
}

interface IsometricBuildingProps {
  heatingTemp?: number;
  sfpValue?: number;
  recoveryEff?: number;
  coolingKw?: number;
  revealProgress?: number;
  className?: string;
}

// Isometric helpers
const ISO_LEFT_WALL = "M100,120 L100,340 L250,380 L250,160 Z";
const ISO_RIGHT_WALL = "M250,160 L250,380 L430,300 L430,80 Z";
const ISO_ROOF = "M100,120 L250,160 L430,80 L280,40 Z";

// Floor Y positions (isometric, on right wall cutaway)
const FLOORS = [
  { y: 160, label: "3rd" },
  { y: 230, label: "2nd" },
  { y: 300, label: "1st" },
];
const BASEMENT_Y = 340;

// Heating pipe path (vertical on left side, basement to roof)
const HEATING_MAIN_PATH = "M140,340 L140,130";

// Ventilation duct paths per floor (horizontal along ceiling)
const ventDuctSupply = (y: number) => `M260,${y + 10} L420,${y - 25}`;
const ventDuctExhaust = (y: number) => `M260,${y + 18} L420,${y - 17}`;

export default function IsometricBuilding({
  heatingTemp = 55,
  sfpValue = 1.5,
  recoveryEff = 0.8,
  coolingKw = 300,
  revealProgress,
  className = "",
}: IsometricBuildingProps) {
  const tempT = Math.max(0, Math.min(1, (heatingTemp - 40) / 30));
  const heatingColor = lerpColor("#93c5fd", "#dc2626", tempT);
  const recoveryColor = lerpColor("#3b82f6", "#22c55e", Math.max(0, Math.min(1, (recoveryEff - 0.5) / 0.45)));
  const coolingOpacity = 0.1 + 0.5 * Math.max(0, Math.min(1, (coolingKw - 100) / 500));
  const ventDuration = 3 - 1.8 * Math.max(0, Math.min(1, (sfpValue - 0.8) / 1.7));
  const ventParticles = Math.min(Math.round(sfpValue), 2); // capped for mobile perf

  const uid = useId().replace(/:/g, "");
  const clipActive = revealProgress !== undefined && revealProgress < 1;
  // Bottom-up reveal: clip starts from basement, grows upward
  const clipY = revealProgress !== undefined ? 380 * (1 - revealProgress) : 0;

  return (
    <div className={`w-full max-w-[500px] ${className}`}>
      <svg viewBox="0 0 500 380" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {clipActive && (
            <clipPath id={`revealClip-${uid}`}>
              <rect x="0" y={clipY} width="500" height="380" />
            </clipPath>
          )}
          <filter id={`glowHeat-${uid}`}>
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={heatingColor} floodOpacity="0.6" />
          </filter>
          <filter id={`glowVent-${uid}`}>
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#3b82f6" floodOpacity="0.5" />
          </filter>
          <filter id={`glowCool-${uid}`}>
            <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#60a5fa" floodOpacity="0.5" />
          </filter>
        </defs>

        <g clipPath={clipActive ? `url(#revealClip-${uid})` : undefined}>
          {/* === BUILDING SHELL === */}
          {/* Left wall */}
          <path d={ISO_LEFT_WALL} fill="hsl(var(--primary))" fillOpacity="0.18" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeOpacity="0.5" />
          {/* Roof */}
          <path d={ISO_ROOF} fill="hsl(var(--primary))" fillOpacity="0.14" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeOpacity="0.5" />
          {/* Right wall outline (cutaway — dashed) */}
          <path d={ISO_RIGHT_WALL} fill="hsl(var(--primary))" fillOpacity="0.06" stroke="hsl(var(--primary))" strokeWidth="1.2" strokeOpacity="0.4" strokeDasharray="4 4" />

          {/* Floor lines inside cutaway */}
          {FLOORS.map((f, i) => (
            <line key={i} x1="250" y1={f.y + 70} x2="430" y2={f.y + 70 - 40} stroke="hsl(var(--border))" strokeWidth="0.8" />
          ))}
          {/* Room divider walls (vertical in isometric) */}
          {FLOORS.map((f, i) => (
            <line key={`div-${i}`} x1="340" y1={f.y + 5} x2="340" y2={f.y + 65} stroke="hsl(var(--border))" strokeWidth="0.6" strokeDasharray="3 3" />
          ))}

          {/* Basement (darker) */}
          <polygon points="250,340 250,380 430,300 430,260" fill="hsl(var(--primary))" fillOpacity="0.04" stroke="hsl(var(--border))" strokeWidth="0.8" />
          <line x1="250" y1="340" x2="430" y2="260" stroke="hsl(var(--border))" strokeWidth="1" />

          {/* === HEATING SYSTEM === */}
          {/* Main vertical pipe */}
          <path d={HEATING_MAIN_PATH} stroke={heatingColor} strokeWidth="3" fill="none" filter={`url(#glowHeat-${uid})`} strokeLinecap="round" />
          {/* Horizontal branches + radiators per floor */}
          {FLOORS.map((f, i) => {
            const pipeY = f.y + 50;
            return (
              <g key={`heat-${i}`}>
                <line x1="140" y1={pipeY} x2="230" y2={pipeY} stroke={heatingColor} strokeWidth="2" filter={`url(#glowHeat-${uid})`} />
                {/* Radiator */}
                <rect x="215" y={pipeY - 8} width="16" height="16" rx="2" fill={heatingColor} fillOpacity="0.7" stroke={heatingColor} strokeWidth="0.5" />
              </g>
            );
          })}
          {/* Heating particles */}
          {[0, 1].map((i) => (
            <motion.circle
              key={`hp-${i}`}
              r={3}
              fill={heatingColor}
              filter={`url(#glowHeat-${uid})`}
              style={{
                offsetPath: `path('${HEATING_MAIN_PATH}')`,
                offsetRotate: "0deg" as any,
              }}
              animate={{ offsetDistance: ["0%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
            />
          ))}

          {/* === VENTILATION SYSTEM === */}
          {FLOORS.map((f, i) => (
            <g key={`vent-${i}`}>
              {/* Supply duct */}
              <path d={ventDuctSupply(f.y)} stroke="#3b82f6" strokeWidth="2" strokeDasharray="6 3" fill="none" filter={`url(#glowVent-${uid})`} />
              {/* Exhaust duct */}
              <path d={ventDuctExhaust(f.y)} stroke="#64748b" strokeWidth="1.5" strokeDasharray="6 3" fill="none" />
              {/* Vent particles */}
              {Array.from({ length: Math.min(ventParticles, 5) }).map((_, pi) => (
                <motion.circle
                  key={`vp-${i}-${pi}`}
                  r={2}
                  fill="#3b82f6"
                  filter={`url(#glowVent-${uid})`}
                  style={{
                    offsetPath: `path('${ventDuctSupply(f.y)}')`,
                    offsetRotate: "0deg" as any,
                  }}
                  animate={{ offsetDistance: ["0%", "100%"] }}
                  transition={{ duration: ventDuration, repeat: Infinity, ease: "linear", delay: pi * (ventDuration / Math.max(ventParticles, 1)) }}
                />
              ))}
            </g>
          ))}

          {/* Heat recovery unit in basement */}
          <rect x="270" y="305" width="40" height="30" rx="3" fill={recoveryColor} fillOpacity="0.3" stroke={recoveryColor} strokeWidth="1.5" />
          {/* Cross pattern inside */}
          <line x1="270" y1="305" x2="310" y2="335" stroke={recoveryColor} strokeWidth="1" strokeOpacity="0.6" />
          <line x1="310" y1="305" x2="270" y2="335" stroke={recoveryColor} strokeWidth="1" strokeOpacity="0.6" />

          {/* === COOLING SYSTEM === */}
          {FLOORS.map((f, i) => (
            <g key={`cool-${i}`}>
              {/* Left room baffle */}
              <rect x="275" y={f.y + 5} width="30" height="6" rx="2" fill="#60a5fa" fillOpacity={coolingOpacity} filter={`url(#glowCool-${uid})`} />
              {/* Right room baffle */}
              <rect x="365" y={f.y - 10} width="30" height="6" rx="2" fill="#60a5fa" fillOpacity={coolingOpacity} filter={`url(#glowCool-${uid})`} />
            </g>
          ))}

          {/* Cooling machine in basement */}
          <rect x="360" y="270" width="35" height="25" rx="3" fill="#60a5fa" fillOpacity="0.2" stroke="#60a5fa" strokeWidth="1" />
          <text x="377" y="286" textAnchor="middle" fontSize="8" fill="#60a5fa" fillOpacity="0.7" fontFamily="monospace">CU</text>
        </g>
      </svg>
    </div>
  );
}
