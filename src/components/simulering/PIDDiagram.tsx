import { motion } from "framer-motion";

const pipes = [
  { id: "fjernvarme", label: "Fjernvarmesentral", x: 40, y: 30, color: "var(--vh-red)" },
  { id: "samlestokk", label: "Samlestokk", x: 200, y: 30, color: "var(--vh-red)" },
  { id: "radiator", label: "Radiatorkurs", x: 360, y: 10, color: "var(--vh-red)" },
  { id: "gulvvarme", label: "Gulvvarme", x: 360, y: 35, color: "var(--vh-red)" },
  { id: "varmebatteri", label: "Varmebatteri AHU", x: 360, y: 60, color: "var(--vh-red)" },
  { id: "aerotemp", label: "Aerotempere", x: 360, y: 85, color: "var(--vh-red)" },
  { id: "kjolem", label: "Kjølemaskin", x: 40, y: 130, color: "var(--vh-blue)" },
  { id: "isvann", label: "Isvann", x: 200, y: 130, color: "var(--vh-blue)" },
  { id: "bafler", label: "Kjølebafler", x: 360, y: 120, color: "var(--vh-blue)" },
  { id: "isvannahu", label: "Isvannsbatteri AHU", x: 360, y: 145, color: "var(--vh-blue)" },
  { id: "ahu", label: "AHU", x: 40, y: 220, color: "var(--vh-green)" },
];

const connections = [
  { from: "fjernvarme", to: "samlestokk" },
  { from: "samlestokk", to: "radiator" },
  { from: "samlestokk", to: "gulvvarme" },
  { from: "samlestokk", to: "varmebatteri" },
  { from: "samlestokk", to: "aerotemp" },
  { from: "kjolem", to: "isvann" },
  { from: "isvann", to: "bafler" },
  { from: "isvann", to: "isvannahu" },
];

export function PIDDiagram() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">P&ID Flytdiagram</h3>
      <div className="relative">
        {/* Varme section */}
        <div className="mb-4">
          <p className="mb-2 text-xs font-medium text-vh-red">Varmesystem</p>
          <div className="flex items-center gap-2">
            <PipeNode label="Fjernvarme-sentral" color="red" temp="80°C" />
            <PipeArrow color="red" />
            <PipeNode label="Samlestokk" color="red" temp="55°C" />
            <div className="flex flex-col gap-1 ml-2">
              <PipeBranch label="Radiatorer (65%)" color="red" temp="55/40°C" />
              <PipeBranch label="Gulvvarme (10%)" color="red" temp="35/28°C" />
              <PipeBranch label="Varmebatteri AHU (20%)" color="red" temp="55/35°C" />
              <PipeBranch label="Luftporter (5%)" color="red" temp="55/40°C" />
            </div>
          </div>
        </div>

        {/* Kjøle section */}
        <div className="mb-4">
          <p className="mb-2 text-xs font-medium text-vh-blue">Kjølesystem</p>
          <div className="flex items-center gap-2">
            <PipeNode label="Kjølemaskin 400kW" color="blue" temp="COP 4.5" />
            <PipeArrow color="blue" />
            <PipeNode label="Isvann" color="blue" temp="6/12°C" />
            <div className="flex flex-col gap-1 ml-2">
              <PipeBranch label="180 Kjølebafler" color="blue" temp="600W/stk" />
              <PipeBranch label="Isvannsbatteri AHU" color="blue" temp="6/12°C" />
            </div>
          </div>
        </div>

        {/* AHU section */}
        <div>
          <p className="mb-2 text-xs font-medium text-vh-green">Luftbehandling (AHU)</p>
          <div className="flex flex-wrap items-center gap-1.5">
            {["Filter F7", "Gjenvinner 82%", "Varmebatteri", "Kjølebatteri", "Vifte", "Kanalnett", "VAV", "Rom"].map((step, i) => (
              <div key={step} className="flex items-center gap-1.5">
                <div className="rounded-md border border-vh-green/30 bg-vh-green/10 px-2 py-1">
                  <span className="text-[10px] font-medium text-vh-green">{step}</span>
                </div>
                {i < 7 && (
                  <motion.div
                    className="h-0.5 w-4 bg-vh-green/50"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">Tilluft: 42,000 m³/h | Avtrekk: 40,500 m³/h | SFP: 1.5 kW/(m³/s)</p>
        </div>
      </div>
    </div>
  );
}

function PipeNode({ label, color, temp }: { label: string; color: string; temp: string }) {
  const borderClass = color === "red" ? "border-vh-red/40 bg-vh-red/10" : color === "blue" ? "border-vh-blue/40 bg-vh-blue/10" : "border-vh-green/40 bg-vh-green/10";
  const textClass = color === "red" ? "text-vh-red" : color === "blue" ? "text-vh-blue" : "text-vh-green";
  return (
    <div className={`rounded-lg border ${borderClass} px-3 py-2 text-center`}>
      <p className={`text-xs font-semibold ${textClass}`}>{label}</p>
      <p className="text-[10px] text-muted-foreground">{temp}</p>
    </div>
  );
}

function PipeArrow({ color }: { color: string }) {
  const bgClass = color === "red" ? "bg-vh-red/50" : color === "blue" ? "bg-vh-blue/50" : "bg-vh-green/50";
  return (
    <motion.div
      className={`h-0.5 w-8 ${bgClass}`}
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.2, repeat: Infinity }}
    />
  );
}

function PipeBranch({ label, color, temp }: { label: string; color: string; temp: string }) {
  const textClass = color === "red" ? "text-vh-red" : color === "blue" ? "text-vh-blue" : "text-vh-green";
  const dotClass = color === "red" ? "bg-vh-red" : color === "blue" ? "bg-vh-blue" : "bg-vh-green";
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={`h-1.5 w-1.5 rounded-full ${dotClass}`}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <span className={`text-[10px] font-medium ${textClass}`}>{label}</span>
      <span className="text-[9px] text-muted-foreground">{temp}</span>
    </div>
  );
}
