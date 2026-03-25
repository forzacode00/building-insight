import { motion } from "framer-motion";
import { Flame, Snowflake } from "lucide-react";

export function PIDDiagram() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">P&ID Flytdiagram</h3>
      <div className="relative space-y-6">
        {/* Varme section */}
        <div>
          <p className="mb-3 text-xs font-medium text-vh-red">Varmesystem</p>
          <div className="flex items-start gap-3">
            <EquipmentNode icon="fjernvarme" label="Fjernvarme-sentral" color="red" temp="80°C" />
            <PipeArrow color="red" />
            <EquipmentNode icon="samlestokk" label="Samlestokk" color="red" temp="55°C" />
            <PipeArrow color="red" />
            <div className="flex flex-col gap-2">
              <BranchRow icon="radiator" label="Radiatorer (65%)" color="red" temp="55/40°C" />
              <BranchRow icon="gulvvarme" label="Gulvvarme (10%)" color="red" temp="35/28°C" />
              <BranchRow icon="varmebatteri" label="Varmebatteri AHU (20%)" color="red" temp="55/35°C" />
              <BranchRow icon="pumpe" label="Luftporter (5%)" color="red" temp="55/40°C" />
            </div>
          </div>
          {/* Return flow */}
          <div className="mt-1 flex items-center gap-3 pl-2">
            <span className="text-[9px] text-muted-foreground font-mono tabular-nums italic">Retur →</span>
            <ReturnPipe color="red" />
            <span className="text-[9px] text-muted-foreground font-mono tabular-nums">40°C</span>
            <ReturnPipe color="red" />
            <span className="text-[9px] text-muted-foreground font-mono tabular-nums">35°C</span>
          </div>
        </div>

        {/* Kjøle section */}
        <div>
          <p className="mb-3 text-xs font-medium text-vh-blue">Kjølesystem</p>
          <div className="flex items-start gap-3">
            <EquipmentNode icon="kjølemaskin" label="Kjølemaskin 400kW" color="blue" temp="COP 4.5" />
            <PipeArrow color="blue" />
            <EquipmentNode icon="isvannstank" label="Isvann" color="blue" temp="6/12°C" />
            <PipeArrow color="blue" />
            <div className="flex flex-col gap-2">
              <BranchRow icon="kjølebafel" label="180 Kjølebafler" color="blue" temp="600W/stk" />
              <BranchRow icon="kjølebatteri" label="Isvannsbatteri AHU" color="blue" temp="6/12°C" />
            </div>
          </div>
          <div className="mt-1 flex items-center gap-3 pl-2">
            <span className="text-[9px] text-muted-foreground font-mono tabular-nums italic">Retur →</span>
            <ReturnPipe color="blue" />
            <span className="text-[9px] text-muted-foreground font-mono tabular-nums">12°C</span>
          </div>
        </div>

        {/* AHU section — horizontal housing */}
        <div>
          <p className="mb-3 text-xs font-medium text-vh-green">Luftbehandling (AHU)</p>
          <div className="rounded-xl border border-vh-green/30 bg-vh-green/5 px-3 py-3">
            <div className="flex items-center gap-0">
              {[
                { label: "Filter F7", icon: "filter" },
                { label: "Gjenvinner 82%", icon: "gjenvinner" },
                { label: "Varmebatteri", icon: "varmebatteri" },
                { label: "Kjølebatteri", icon: "kjølebatteri" },
                { label: "Vifte", icon: "vifte" },
                { label: "Kanalnett", icon: "kanal" },
                { label: "VAV", icon: "vav" },
                { label: "Rom", icon: "rom" },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex items-center">
                  <div className="flex flex-col items-center px-2 py-1">
                    <AHUIcon type={step.icon} />
                    <span className="mt-1 text-[9px] font-medium text-vh-green whitespace-nowrap">{step.label}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="relative h-1 w-8 bg-vh-green/20 overflow-hidden rounded-full">
                      <motion.div
                        className="absolute top-0 left-0 h-full w-2 rounded-full bg-vh-green"
                        animate={{ x: [0, 24, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "linear", delay: i * 0.15 }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground font-mono tabular-nums">
            Tilluft: 42 000 m³/h | Avtrekk: 40 500 m³/h | SFP: 1.5 kW/(m³/s)
          </p>
        </div>
      </div>
    </div>
  );
}

/* === SVG Equipment Icons === */

function EquipmentIcon({ type, color }: { type: string; color: string }) {
  const stroke = color === "red" ? "hsl(var(--vh-red))" : color === "blue" ? "hsl(var(--vh-blue))" : "hsl(var(--vh-green))";
  const fill = color === "red" ? "hsl(var(--vh-red) / 0.15)" : color === "blue" ? "hsl(var(--vh-blue) / 0.15)" : "hsl(var(--vh-green) / 0.15)";

  switch (type) {
    case "fjernvarme":
      return (
        <div className="flex items-center justify-center h-10 w-10">
          <div className={`rounded-lg border p-1.5 ${color === "red" ? "border-vh-red/40 bg-vh-red/10" : ""}`}>
            <Flame className="h-5 w-5 text-vh-red" />
          </div>
        </div>
      );
    case "kjølemaskin":
      return (
        <div className="flex items-center justify-center h-10 w-10">
          <div className="rounded-lg border border-vh-blue/40 bg-vh-blue/10 p-1.5">
            <Snowflake className="h-5 w-5 text-vh-blue" />
          </div>
        </div>
      );
    case "samlestokk":
      return (
        <svg width="40" height="24" viewBox="0 0 40 24" className="mx-auto">
          <rect x="2" y="4" width="36" height="16" rx="8" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <line x1="12" y1="8" x2="12" y2="16" stroke={stroke} strokeWidth="1" opacity="0.5" />
          <line x1="20" y1="8" x2="20" y2="16" stroke={stroke} strokeWidth="1" opacity="0.5" />
          <line x1="28" y1="8" x2="28" y2="16" stroke={stroke} strokeWidth="1" opacity="0.5" />
        </svg>
      );
    case "isvannstank":
      return (
        <svg width="28" height="36" viewBox="0 0 28 36" className="mx-auto">
          <rect x="2" y="2" width="24" height="32" rx="6" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <line x1="8" y1="12" x2="20" y2="12" stroke={stroke} strokeWidth="1" opacity="0.4" />
          <line x1="8" y1="20" x2="20" y2="20" stroke={stroke} strokeWidth="1" opacity="0.4" />
        </svg>
      );
    case "radiator":
      return (
        <svg width="28" height="22" viewBox="0 0 28 22">
          <rect x="1" y="1" width="26" height="20" rx="2" fill={fill} stroke={stroke} strokeWidth="1.2" />
          {[6, 10, 14, 18, 22].map(x => (
            <line key={x} x1={x} y1="4" x2={x} y2="18" stroke={stroke} strokeWidth="1" opacity="0.6" />
          ))}
        </svg>
      );
    case "gulvvarme":
      return (
        <svg width="28" height="20" viewBox="0 0 28 20">
          {[5, 10, 15].map((y, i) => (
            <path key={i} d={`M4,${y} Q10,${y - 3} 14,${y} Q18,${y + 3} 24,${y}`} fill="none" stroke={stroke} strokeWidth="1.2" />
          ))}
        </svg>
      );
    case "pumpe":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill={fill} stroke={stroke} strokeWidth="1.2" />
          <polygon points="10,6 18,12 10,18" fill={stroke} opacity="0.6" />
        </svg>
      );
    case "kjølebafel":
      return (
        <svg width="32" height="20" viewBox="0 0 32 20">
          <rect x="1" y="1" width="30" height="8" rx="2" fill={fill} stroke={stroke} strokeWidth="1.2" />
          {[8, 16, 24].map(x => (
            <path key={x} d={`M${x},9 L${x},18`} stroke={stroke} strokeWidth="1" opacity="0.5" strokeDasharray="2,2" />
          ))}
        </svg>
      );
    default:
      return null;
  }
}

function AHUIcon({ type }: { type: string }) {
  const stroke = "hsl(var(--vh-green))";
  const fill = "hsl(var(--vh-green) / 0.15)";

  switch (type) {
    case "filter":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="3" fill={fill} stroke={stroke} strokeWidth="1" />
          {[7, 12, 17].map(y => (
            <line key={y} x1="5" y1={y} x2="19" y2={y} stroke={stroke} strokeWidth="1" opacity="0.5" />
          ))}
        </svg>
      );
    case "gjenvinner":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" fill={fill} stroke={stroke} strokeWidth="1" />
          <path d="M12,5 A7,7 0 0,1 19,12" fill="none" stroke={stroke} strokeWidth="1.5" />
          <polygon points="18,10 20,12 17,13" fill={stroke} />
        </svg>
      );
    case "varmebatteri":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="3" fill="hsl(var(--vh-red) / 0.15)" stroke="hsl(var(--vh-red))" strokeWidth="1" />
          <polyline points="6,8 10,16 14,8 18,16" fill="none" stroke="hsl(var(--vh-red))" strokeWidth="1.5" />
        </svg>
      );
    case "kjølebatteri":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="3" fill="hsl(var(--vh-blue) / 0.15)" stroke="hsl(var(--vh-blue))" strokeWidth="1" />
          <polyline points="6,8 10,16 14,8 18,16" fill="none" stroke="hsl(var(--vh-blue))" strokeWidth="1.5" />
        </svg>
      );
    case "vifte":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" fill={fill} stroke={stroke} strokeWidth="1" />
          <circle cx="12" cy="12" r="2" fill={stroke} />
          {[0, 90, 180, 270].map(angle => (
            <ellipse key={angle} cx="12" cy="6" rx="3" ry="5" fill={stroke} opacity="0.3"
              transform={`rotate(${angle}, 12, 12)`} />
          ))}
        </svg>
      );
    case "kanal":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <rect x="2" y="7" width="20" height="10" rx="2" fill={fill} stroke={stroke} strokeWidth="1" />
          <line x1="8" y1="7" x2="8" y2="17" stroke={stroke} strokeWidth="0.5" opacity="0.3" />
          <line x1="16" y1="7" x2="16" y2="17" stroke={stroke} strokeWidth="0.5" opacity="0.3" />
        </svg>
      );
    case "vav":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="3" fill={fill} stroke={stroke} strokeWidth="1" />
          <polygon points="7,7 12,12 7,17" fill={stroke} opacity="0.4" />
          <polygon points="17,7 12,12 17,17" fill={stroke} opacity="0.4" />
        </svg>
      );
    case "rom":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="14" rx="2" fill={fill} stroke={stroke} strokeWidth="1" />
          <rect x="10" y="12" width="4" height="7" rx="1" fill={stroke} opacity="0.3" />
        </svg>
      );
    default:
      return null;
  }
}

function EquipmentNode({ icon, label, color, temp }: { icon: string; label: string; color: string; temp: string }) {
  const borderClass = color === "red" ? "border-vh-red/30 bg-vh-red/5" : color === "blue" ? "border-vh-blue/30 bg-vh-blue/5" : "border-vh-green/30 bg-vh-green/5";
  const textClass = color === "red" ? "text-vh-red" : color === "blue" ? "text-vh-blue" : "text-vh-green";
  return (
    <div className={`flex flex-col items-center gap-1 rounded-xl border ${borderClass} px-3 py-2`}>
      <EquipmentIcon type={icon} color={color} />
      <p className={`text-[10px] font-semibold ${textClass} text-center leading-tight`}>{label}</p>
      <p className="text-[9px] text-muted-foreground font-mono tabular-nums">{temp}</p>
    </div>
  );
}

function PipeArrow({ color }: { color: string }) {
  const bgClass = color === "red" ? "bg-vh-red/20" : color === "blue" ? "bg-vh-blue/20" : "bg-vh-green/20";
  const dotClass = color === "red" ? "bg-vh-red" : color === "blue" ? "bg-vh-blue" : "bg-vh-green";
  return (
    <div className="flex items-center self-center">
      <div className={`relative h-1 w-10 ${bgClass} overflow-hidden rounded-full`}>
        <motion.div
          className={`absolute top-[-1px] left-0 h-2 w-2 rounded-full ${dotClass}`}
          animate={{ x: [0, 32, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <div className={`h-0 w-0 border-y-[4px] border-y-transparent ${color === "red" ? "border-l-[6px] border-l-vh-red/60" : color === "blue" ? "border-l-[6px] border-l-vh-blue/60" : "border-l-[6px] border-l-vh-green/60"}`} />
    </div>
  );
}

function ReturnPipe({ color }: { color: string }) {
  const bgClass = color === "red" ? "bg-vh-red/15" : color === "blue" ? "bg-vh-blue/15" : "bg-vh-green/15";
  const dotClass = color === "red" ? "bg-vh-red/60" : color === "blue" ? "bg-vh-blue/60" : "bg-vh-green/60";
  return (
    <div className={`relative h-0.5 w-12 ${bgClass} overflow-hidden rounded-full`} style={{ borderTop: '1px dashed' }}>
      <motion.div
        className={`absolute top-[-2px] left-0 h-1.5 w-1.5 rounded-full ${dotClass}`}
        animate={{ x: [40, 0, 40] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

function BranchRow({ icon, label, color, temp }: { icon: string; label: string; color: string; temp: string }) {
  const textClass = color === "red" ? "text-vh-red" : color === "blue" ? "text-vh-blue" : "text-vh-green";
  const dotClass = color === "red" ? "bg-vh-red" : color === "blue" ? "bg-vh-blue" : "bg-vh-green";
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={`h-2 w-2 rounded-full ${dotClass}`}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <div className="h-5 w-5 flex-shrink-0">
        <EquipmentIcon type={icon} color={color} />
      </div>
      <span className={`text-[10px] font-medium ${textClass}`}>{label}</span>
      <span className="text-[9px] text-muted-foreground font-mono tabular-nums">{temp}</span>
    </div>
  );
}
