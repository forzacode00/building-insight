const avvik = [
  {
    severity: "critical" as const,
    title: "SFP 1.8 overskrider TEK17 ≤1.5",
    tiltak: "Tiltak: EC-motorer, kanaldimensjoner",
  },
  {
    severity: "critical" as const,
    title: "Energiramme 138 overskrider 115 kWh/m²·år",
    tiltak: "Tiltak: gjenvinner 85%, SFP, belysning",
  },
  {
    severity: "warning" as const,
    title: "87 timer >26°C sørvendte soner",
    tiltak: "Tiltak: øk kjølebafler 25% eller solavskjerming",
  },
  {
    severity: "warning" as const,
    title: "Pumpe overdimensjonert — 73% av tid <40%",
    tiltak: "Tiltak: frekvensregulering, 4 200 kWh/år besparelse",
  },
  {
    severity: "ok" as const,
    title: "Gjenvinner 76% vs 82% prosjektert",
    tiltak: "Tiltak: rengjøring, planlegg utskifting",
  },
];

export function ResultsAvvik() {
  return (
    <div>
      <div className="mb-4 rounded-lg bg-secondary/50 px-4 py-2 text-xs text-muted-foreground">
        Innreguleringstolerans ±10% (NS 6450)
      </div>
      <div className="space-y-3">
        {avvik.map((a, i) => {
          const dot = a.severity === "critical" ? "bg-vh-red" : a.severity === "warning" ? "bg-vh-yellow" : "bg-vh-green";
          const icon = a.severity === "critical" ? "🔴" : a.severity === "warning" ? "🟡" : "🟢";
          return (
            <div key={i} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start gap-3">
                <span className="text-lg">{icon}</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{a.title}</p>
                  <p className="mt-1 text-sm text-primary">{a.tiltak}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
