import { TrendingDown } from "lucide-react";

const rows = [
  { label: "Energikostnad", value: "1,104,000 kr/år" },
  { label: "Energipris", value: "1.33 kr/kWh" },
  { label: "Besparelse ved tiltak", value: "268,000 kr/år" },
  { label: "Investering (tiltak)", value: "890,000 kr" },
  { label: "Payback", value: "3.3 år" },
];

export function ResultsOkonomi() {
  return (
    <div>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Energikostnad</p>
          <p className="mt-1 text-2xl font-bold text-foreground">1,104,000 <span className="text-sm font-normal text-muted-foreground">kr/år</span></p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Besparelse ved tiltak</p>
          <p className="mt-1 text-2xl font-bold text-vh-green">268,000 <span className="text-sm font-normal text-muted-foreground">kr/år</span></p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Payback</p>
          <p className="mt-1 text-2xl font-bold text-primary">3.3 <span className="text-sm font-normal text-muted-foreground">år</span></p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h4 className="mb-4 text-sm font-semibold text-foreground">Økonomisk oversikt</h4>
        <div className="space-y-2">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-2.5">
              <span className="text-sm text-muted-foreground">{r.label}</span>
              <span className="text-sm font-semibold text-foreground">{r.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-vh-green/30 bg-vh-green/5 p-5">
        <div className="flex items-center gap-3">
          <TrendingDown className="h-6 w-6 text-vh-green" />
          <div>
            <p className="text-sm font-semibold text-foreground">CO₂-reduksjon</p>
            <p className="text-2xl font-bold text-vh-green">42 → 31 tonn <span className="text-sm font-normal text-muted-foreground">(-26%)</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
