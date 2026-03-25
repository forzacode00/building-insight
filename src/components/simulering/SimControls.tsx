import { Play, Pause } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  isRunning: boolean;
  progress: number;
  currentHour: number;
  onStart: () => void;
}

export function SimControls({ isRunning, progress, currentHour, onStart }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Simuleringsoppsett</h3>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-secondary/50 px-3 py-2">
          <p className="text-xs text-muted-foreground">Scenario</p>
          <select className="mt-1 w-full rounded border border-border bg-card px-2 py-1 text-sm text-foreground">
            <option>Normal drift</option>
            <option>DUT vinter (-21.8°C)</option>
            <option>Dim. sommer (28°C)</option>
            <option>Feil: Gjenvinner ute av drift</option>
          </select>
        </div>
        <div className="rounded-lg bg-secondary/50 px-3 py-2">
          <p className="text-xs text-muted-foreground">Klima</p>
          <p className="mt-1 text-sm font-medium text-foreground">Oslo</p>
        </div>
      </div>

      <button
        onClick={onStart}
        disabled={isRunning}
        className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        {isRunning ? "Simulerer..." : "▶ Kjør simulering (8 760 timer)"}
      </button>

      {(isRunning || progress > 0) && (
        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Simulerer time {currentHour.toLocaleString("no-NO")} av 8 760</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-primary"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Live mini gauges */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <MiniGauge label="Romtemp" value="21.3°C" target="21°C" status="ok" />
            <MiniGauge label="Effekt" value="187 kW" target="280 kW" status="ok" />
            <MiniGauge label="SFP" value="1.82" target="≤1.5" status="critical" />
          </div>
        </div>
      )}
    </div>
  );
}

function MiniGauge({ label, value, target, status }: { label: string; value: string; target: string; status: "ok" | "warning" | "critical" }) {
  const borderColor = status === "ok" ? "border-vh-green/40" : status === "warning" ? "border-vh-yellow/40" : "border-vh-red/40";
  const valueColor = status === "ok" ? "text-vh-green" : status === "warning" ? "text-vh-yellow" : "text-vh-red";
  return (
    <div className={`rounded-lg border ${borderColor} bg-secondary/30 p-3 text-center`}>
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className={`text-lg font-bold ${valueColor}`}>{value}</p>
      <p className="text-[10px] text-muted-foreground">Mål: {target}</p>
    </div>
  );
}
