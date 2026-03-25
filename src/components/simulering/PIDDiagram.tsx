import { motion } from "framer-motion";

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
                  <div className="relative h-0.5 w-6 bg-vh-green/20 overflow-hidden">
                    <motion.div
                      className="absolute top-0 left-0 h-full w-2 rounded-full bg-vh-green"
                      animate={{ x: [0, 16, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "linear", delay: i * 0.15 }}
                    />
                  </div>
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
    <div className={`rounded-xl border ${borderClass} px-3 py-2 text-center`}>
      <p className={`text-xs font-semibold ${textClass}`}>{label}</p>
      <p className="text-[10px] text-muted-foreground font-mono tabular-nums">{temp}</p>
    </div>
  );
}

function PipeArrow({ color }: { color: string }) {
  const bgClass = color === "red" ? "bg-vh-red/20" : color === "blue" ? "bg-vh-blue/20" : "bg-vh-green/20";
  const dotClass = color === "red" ? "bg-vh-red" : color === "blue" ? "bg-vh-blue" : "bg-vh-green";
  return (
    <div className={`relative h-0.5 w-8 ${bgClass} overflow-hidden`}>
      <motion.div
        className={`absolute top-[-1px] left-0 h-1 w-1 rounded-full ${dotClass}`}
        animate={{ x: [0, 28, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </div>
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
      <span className="text-[9px] text-muted-foreground font-mono tabular-nums">{temp}</span>
    </div>
  );
}
