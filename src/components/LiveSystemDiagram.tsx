import { useId, useMemo } from "react";
import { motion } from "framer-motion";

interface LiveSystemDiagramProps {
  heatingTemp: number;      // 40-70°C
  sfpValue: number;         // 0.8-2.5
  recoveryEff: number;      // 0.5-0.95
  coolingKw: number;        // 100-600
  className?: string;
}

function lerpColor(a: string, b: string, t: number): string {
  const p = (h: string) => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
  const [r1,g1,b1] = p(a), [r2,g2,b2] = p(b);
  return `rgb(${Math.round(r1+(r2-r1)*t)},${Math.round(g1+(g2-g1)*t)},${Math.round(b1+(b2-b1)*t)})`;
}

// Animated particle following a path
function FlowDot({ pathD, color, duration, delay, uid }: { pathD: string; color: string; duration: number; delay: number; uid: string }) {
  return (
    <motion.circle
      r={3}
      fill={color}
      style={{
        offsetPath: `path('${pathD}')`,
        offsetRotate: "0deg" as any,
        filter: `drop-shadow(0 0 3px ${color})`,
      }}
      animate={{ offsetDistance: ["0%", "100%"] }}
      transition={{ duration, repeat: Infinity, ease: "linear", delay }}
    />
  );
}

export default function LiveSystemDiagram({
  heatingTemp = 55,
  sfpValue = 1.5,
  recoveryEff = 0.8,
  coolingKw = 300,
  className = "",
}: LiveSystemDiagramProps) {
  const uid = useId().replace(/:/g, "");
  
  const tempT = Math.max(0, Math.min(1, (heatingTemp - 40) / 30));
  const heatColor = lerpColor("#60a5fa", "#dc2626", tempT);
  const returnColor = lerpColor("#93c5fd", "#f87171", tempT * 0.6);
  const recoveryT = Math.max(0, Math.min(1, (recoveryEff - 0.5) / 0.45));
  const recoveryColor = lerpColor("#60a5fa", "#22c55e", recoveryT);
  const coolT = Math.max(0, Math.min(1, (coolingKw - 100) / 500));
  const coolColor = lerpColor("#93c5fd", "#3b82f6", coolT);
  const ventSpeed = 3 - 1.5 * Math.max(0, Math.min(1, (sfpValue - 0.8) / 1.7));
  
  // Detect simultaneous heating + cooling
  const simultaneous = coolingKw > 200 && heatingTemp > 55;
  
  // SVG Paths for systems
  const HEAT_SUPPLY = "M 40 240 L 40 160 L 160 160 L 160 80 L 360 80 L 360 120";
  const HEAT_RETURN = "M 360 140 L 360 100 L 180 100 L 180 180 L 60 180 L 60 240";
  const VENT_SUPPLY = "M 40 40 L 160 40 L 160 60 L 240 60";
  const VENT_EXHAUST = "M 320 60 L 400 60 L 400 40 L 520 40";
  const COOL_SUPPLY = "M 520 240 L 520 160 L 400 160 L 400 80";
  const COOL_RETURN = "M 380 80 L 380 140 L 500 140 L 500 240";

  return (
    <div className={`w-full ${className}`}>
      <svg viewBox="0 0 560 280" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id={`gH-${uid}`}><feDropShadow dx="0" dy="0" stdDeviation="2" floodColor={heatColor} floodOpacity="0.5" /></filter>
          <filter id={`gC-${uid}`}><feDropShadow dx="0" dy="0" stdDeviation="2" floodColor={coolColor} floodOpacity="0.5" /></filter>
          <filter id={`gV-${uid}`}><feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#3b82f6" floodOpacity="0.4" /></filter>
        </defs>

        {/* ═══ BACKGROUND GRID ═══ */}
        <rect width="560" height="280" fill="none" />
        <g opacity="0.04">
          {Array.from({length: 28}).map((_, i) => <line key={`gv${i}`} x1={i*20} y1="0" x2={i*20} y2="280" stroke="currentColor" strokeWidth="0.5" />)}
          {Array.from({length: 14}).map((_, i) => <line key={`gh${i}`} x1="0" y1={i*20} x2="560" y2={i*20} stroke="currentColor" strokeWidth="0.5" />)}
        </g>

        {/* ═══ BUILDING OUTLINE ═══ */}
        <rect x="140" y="40" width="280" height="200" rx="4" fill="none" stroke="hsl(var(--border))" strokeWidth="1.5" strokeDasharray="6 3" />
        <text x="280" y="32" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="10" fontWeight="600">BYGNING</text>

        {/* ═══ ROOMS ═══ */}
        <rect x="160" y="60" width="100" height="80" rx="3" fill="hsl(var(--primary))" fillOpacity="0.04" stroke="hsl(var(--border))" strokeWidth="0.5" />
        <text x="210" y="105" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">Sone A</text>
        <rect x="300" y="60" width="100" height="80" rx="3" fill="hsl(var(--primary))" fillOpacity="0.04" stroke="hsl(var(--border))" strokeWidth="0.5" />
        <text x="350" y="105" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">Sone B</text>

        {/* Room temperature indicators */}
        <rect x="165" y="115" width="34" height="14" rx="3" fill={simultaneous ? "#7c3aed20" : `${heatColor}15`} />
        <text x="182" y="125" textAnchor="middle" fill={simultaneous ? "#a78bfa" : heatColor} fontSize="8" fontWeight="700" fontFamily="monospace">
          {simultaneous ? "⚠" : `${Math.round(19 + tempT * 4)}°C`}
        </text>
        <rect x="305" y="115" width="34" height="14" rx="3" fill={`${coolColor}15`} />
        <text x="322" y="125" textAnchor="middle" fill={coolColor} fontSize="8" fontWeight="700" fontFamily="monospace">
          {Math.round(22 - coolT * 2)}°C
        </text>

        {/* ═══ HEATING SYSTEM ═══ */}
        {/* Source */}
        <rect x="10" y="220" width="60" height="40" rx="6" fill={`${heatColor}15`} stroke={heatColor} strokeWidth="1.5" />
        <text x="40" y="238" textAnchor="middle" fill={heatColor} fontSize="7" fontWeight="600">Fjernvarme</text>
        <text x="40" y="250" textAnchor="middle" fill={heatColor} fontSize="9" fontWeight="700" fontFamily="monospace">{heatingTemp}°C</text>

        {/* Supply pipe */}
        <path d={HEAT_SUPPLY} fill="none" stroke={heatColor} strokeWidth="2.5" strokeLinecap="round" filter={`url(#gH-${uid})`} />
        {/* Return pipe */}
        <path d={HEAT_RETURN} fill="none" stroke={returnColor} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3" />

        {/* Radiator in Sone A */}
        <rect x="170" y="130" width="20" height="8" rx="2" fill={heatColor} fillOpacity="0.6" />
        <rect x="172" y="130" width="3" height="8" rx="1" fill={heatColor} />
        <rect x="178" y="130" width="3" height="8" rx="1" fill={heatColor} />
        <rect x="184" y="130" width="3" height="8" rx="1" fill={heatColor} />

        {/* Heat particles */}
        <FlowDot pathD={HEAT_SUPPLY} color={heatColor} duration={2.5} delay={0} uid={uid} />
        <FlowDot pathD={HEAT_SUPPLY} color={heatColor} duration={2.5} delay={1.25} uid={uid} />

        {/* ═══ VENTILATION SYSTEM ═══ */}
        {/* AHU / Aggregat */}
        <rect x="240" y="46" width="80" height="28" rx="4" fill={`${recoveryColor}15`} stroke={recoveryColor} strokeWidth="1.5" />
        <text x="280" y="57" textAnchor="middle" fill={recoveryColor} fontSize="7" fontWeight="600">Aggregat</text>
        <text x="280" y="68" textAnchor="middle" fill={recoveryColor} fontSize="8" fontWeight="700" fontFamily="monospace">{Math.round(recoveryEff * 100)}% ggv</text>

        {/* Supply air intake */}
        <rect x="10" y="28" width="50" height="24" rx="4" fill="hsl(var(--primary))" fillOpacity="0.06" stroke="#3b82f6" strokeWidth="1" />
        <text x="35" y="44" textAnchor="middle" fill="#3b82f6" fontSize="7" fontWeight="500">Tilluft</text>

        {/* Supply duct */}
        <path d={VENT_SUPPLY} fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6 3" filter={`url(#gV-${uid})`} />
        {/* Exhaust duct */}
        <path d={VENT_EXHAUST} fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="6 3" />

        {/* Exhaust outlet */}
        <rect x="520" y="28" width="30" height="24" rx="4" fill="hsl(var(--primary))" fillOpacity="0.04" stroke="#64748b" strokeWidth="1" />
        <text x="535" y="44" textAnchor="middle" fill="#64748b" fontSize="7">Avkast</text>

        {/* SFP indicator */}
        <rect x="80" y="28" width="60" height="24" rx="4" fill={sfpValue > 1.3 ? "#ef444415" : "#22c55e15"} stroke={sfpValue > 1.3 ? "#ef4444" : "#22c55e"} strokeWidth="1" />
        <text x="110" y="38" textAnchor="middle" fill={sfpValue > 1.3 ? "#ef4444" : "#22c55e"} fontSize="6" fontWeight="500">SFP</text>
        <text x="110" y="48" textAnchor="middle" fill={sfpValue > 1.3 ? "#ef4444" : "#22c55e"} fontSize="9" fontWeight="700" fontFamily="monospace">{sfpValue.toFixed(1)}</text>

        {/* Vent particles */}
        <FlowDot pathD={VENT_SUPPLY} color="#3b82f6" duration={ventSpeed} delay={0} uid={uid} />
        <FlowDot pathD={VENT_EXHAUST} color="#64748b" duration={ventSpeed + 0.5} delay={0.3} uid={uid} />

        {/* ═══ COOLING SYSTEM ═══ */}
        {/* Chiller */}
        <rect x="490" y="220" width="60" height="40" rx="6" fill={`${coolColor}15`} stroke={coolColor} strokeWidth="1.5" />
        <text x="520" y="238" textAnchor="middle" fill={coolColor} fontSize="7" fontWeight="600">Kjølemaskin</text>
        <text x="520" y="250" textAnchor="middle" fill={coolColor} fontSize="9" fontWeight="700" fontFamily="monospace">{coolingKw} kW</text>

        {/* Supply pipe */}
        <path d={COOL_SUPPLY} fill="none" stroke={coolColor} strokeWidth="2" strokeLinecap="round" filter={`url(#gC-${uid})`} />
        {/* Return pipe */}
        <path d={COOL_RETURN} fill="none" stroke={coolColor} strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.5" />

        {/* Cooling baffle in Sone B */}
        <rect x="310" y="62" width="30" height="5" rx="1.5" fill={coolColor} fillOpacity={0.3 + coolT * 0.5} />

        {/* Cool particles */}
        <FlowDot pathD={COOL_SUPPLY} color={coolColor} duration={2} delay={0} uid={uid} />

        {/* ═══ SIMULTANEOUS HEATING+COOLING WARNING ═══ */}
        {simultaneous && (
          <g>
            <motion.rect
              x="220" y="155" width="120" height="24" rx="4"
              fill="#7c3aed" fillOpacity={0.15}
              stroke="#7c3aed" strokeWidth="1"
              animate={{ fillOpacity: [0.1, 0.25, 0.1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <text x="280" y="171" textAnchor="middle" fill="#a78bfa" fontSize="8" fontWeight="700">
              ⚠ Samtidig varme + kjøling
            </text>
          </g>
        )}

        {/* ═══ LABELS ═══ */}
        <text x="40" y="215" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="7" fontWeight="600">32 VARME</text>
        <text x="280" y="15" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="7" fontWeight="600">36 VENTILASJON</text>
        <text x="520" y="215" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="7" fontWeight="600">37 KJØLING</text>
      </svg>
    </div>
  );
}
