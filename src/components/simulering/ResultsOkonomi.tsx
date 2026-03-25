import { TrendingDown } from "lucide-react";
import { useSimResult, useOptimizedResult } from "@/lib/SimContext";

export function ResultsOkonomi() {
  const r = useSimResult();
  const opt = useOptimizedResult();

  const savings = r.annualCostNOK - opt.annualCostNOK;
  const investment = Math.round(savings * 3.3); // approx payback-based
  const payback = savings > 0 ? (investment / savings).toFixed(1) : "—";
  const co2Reduction = Math.round((1 - opt.co2Tonnes / r.co2Tonnes) * 100);

  const rows = [
    { label: "Energikostnad", value: `${r.annualCostNOK.toLocaleString("nb-NO")} kr/år` },
    { label: "Energipris", value: "1.33 kr/kWh" },
    { label: "Besparelse ved tiltak", value: `${savings.toLocaleString("nb-NO")} kr/år` },
    { label: "Investering (tiltak)", value: `${investment.toLocaleString("nb-NO")} kr` },
    { label: "Payback", value: `${payback} år` },
  ];

  return (
    <div>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground">Energikostnad</p>
          <p className="mt-1 text-4xl font-bold font-mono tabular-nums text-foreground">
            {r.annualCostNOK.toLocaleString("nb-NO")} <span className="text-sm font-normal font-sans text-muted-foreground">kr/år</span>
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground">Besparelse ved tiltak</p>
          <p className="mt-1 text-4xl font-bold font-mono tabular-nums text-vh-green">
            {savings.toLocaleString("nb-NO")} <span className="text-sm font-normal font-sans text-muted-foreground">kr/år</span>
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground">Payback</p>
          <p className="mt-1 text-4xl font-bold font-mono tabular-nums text-primary">
            {payback} <span className="text-sm font-normal font-sans text-muted-foreground">år</span>
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h4 className="mb-4 text-sm font-semibold text-foreground">Økonomisk oversikt</h4>
        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-2.5">
              <span className="text-sm text-muted-foreground">{row.label}</span>
              <span className="text-sm font-semibold font-mono tabular-nums text-foreground">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-vh-green/30 bg-vh-green/5 p-5">
        <div className="flex items-center gap-3">
          <TrendingDown className="h-6 w-6 text-vh-green" />
          <div>
            <p className="text-sm font-semibold text-foreground">CO₂-reduksjon</p>
            <p className="text-4xl font-bold font-mono tabular-nums text-vh-green">
              {r.co2Tonnes} → {opt.co2Tonnes}{" "}
              <span className="text-sm font-normal font-sans text-muted-foreground">
                tonn/år — scope 2 (−{co2Reduction}%)
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
