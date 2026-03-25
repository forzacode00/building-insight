import { CheckCircle2, AlertTriangle } from "lucide-react";
import { useSimResult } from "@/lib/SimContext";

export function ResultsKomfort() {
  const r = useSimResult();

  const metrics = [
    {
      label: "Timer >26°C sommer",
      value: `${r.hoursAbove26} timer`,
      status: r.hoursAbove26 > 50 ? "warning" as const : "ok" as const,
      detail: r.hoursAbove26 > 50
        ? "Overskrider kategori II (NS-EN 16798-1) for sørvendte soner"
        : "Innenfor akseptabelt nivå",
    },
    {
      label: "Timer <19°C vinter",
      value: `${r.hoursBelow19} timer`,
      status: r.hoursBelow19 > 50 ? "warning" as const : "ok" as const,
      detail: r.hoursBelow19 > 50 ? "For mange timer under komfortgrense" : "Innenfor akseptabelt nivå",
    },
    {
      label: "CO₂ gjennomsnitt",
      value: `${r.avgCO2ppm} ppm`,
      status: r.avgCO2ppm > 800 ? "warning" as const : "ok" as const,
      detail: r.avgCO2ppm <= 800 ? "Under settpunkt 800 ppm" : "Over settpunkt 800 ppm",
    },
    {
      label: "RF vinter",
      value: `${r.avgRHwinter}%`,
      status: r.avgRHwinter < 20 ? "warning" as const : "ok" as const,
      detail: r.avgRHwinter < 20 ? "Under anbefalt 20%" : "Innenfor anbefalt nivå",
    },
  ];

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
