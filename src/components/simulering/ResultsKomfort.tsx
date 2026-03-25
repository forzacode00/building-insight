import { CheckCircle2, AlertTriangle } from "lucide-react";

const metrics = [
  { label: "Timer >26°C sommer", value: "87 timer", status: "warning" as const, detail: "Overskrider kategori II (NS-EN 16798-1) for sørvendte soner" },
  { label: "Timer <19°C vinter", value: "12 timer", status: "ok" as const, detail: "Innenfor akseptabelt nivå" },
  { label: "CO₂ gjennomsnitt", value: "720 ppm", status: "ok" as const, detail: "Under settpunkt 800 ppm" },
  { label: "RF vinter", value: "18%", status: "warning" as const, detail: "Under anbefalt 20%" },
];

export function ResultsKomfort() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {metrics.map((m) => (
        <div
          key={m.label}
          className={`rounded-xl border p-5 ${
            m.status === "ok" ? "border-vh-green/30 bg-vh-green/5" : "border-vh-yellow/30 bg-vh-yellow/5"
          }`}
        >
          <div className="mb-2 flex items-center gap-2">
            {m.status === "ok" ? (
              <CheckCircle2 className="h-5 w-5 text-vh-green" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-vh-yellow" />
            )}
            <span className="text-sm font-semibold text-foreground">{m.label}</span>
          </div>
          <p className={`text-4xl font-bold font-mono tabular-nums ${m.status === "ok" ? "text-vh-green" : "text-vh-yellow"}`}>
            {m.value}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{m.detail}</p>
        </div>
      ))}
    </div>
  );
}
