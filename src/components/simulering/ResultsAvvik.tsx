const avvik = [
  {
    nr: 1,
    system: "36 Luftbehandling",
    severity: "critical" as const,
    title: "SFP overskrider TEK17",
    description: "Simulert SFP 1.8 kW/(m³/s) overskrider TEK17-krav ≤1.5 for kontorbygning. Skyldes høyt trykktap i kanalnett og F7-filter.",
    tiltak: "Optimaliser kanaldimensjoner. Vurder EC-motorer. Redusert trykktap gir SFP ~1.4.",
  },
  {
    nr: 2,
    system: "32/36 Energi",
    severity: "critical" as const,
    title: "Energiramme overskredet",
    description: "Totalt netto energibehov 138 kWh/m²·år overskrider TEK17-ramme 115 kWh/m²·år med 20%.",
    tiltak: "Øk gjenvinner-virkningsgrad til 85%, reduser SFP, installer behovsstyrt belysning. Estimert reduksjon: 28 kWh/m²·år.",
  },
  {
    nr: 3,
    system: "37 Kjøling",
    severity: "warning" as const,
    title: "Overtemperatur sommer",
    description: "87 timer >26°C i sør-vendte kontorer. Kjølebafler underdimensjonert for solbelastning.",
    tiltak: "Øk kjølebafel-kapasitet sør-fasade med 25%, eller installer utvendig solavskjerming.",
  },
  {
    nr: 4,
    system: "32 Varme",
    severity: "warning" as const,
    title: "Pumpe overdimensjonert",
    description: "Hovedpumpe kjører 73% av driftstiden under 40% kapasitet. Unødvendig høyt pumpeforbruk.",
    tiltak: "Bytt til frekvensstyrte pumper med trykkregulering. Estimert besparelse: 4 200 kWh/år.",
  },
  {
    nr: 5,
    system: "36 Luft",
    severity: "ok" as const,
    title: "Gjenvinner underyter",
    description: "Faktisk temperaturvirkningsgrad 76% vs. prosjektert 82%. Normal degradering, men bør overvåkes.",
    tiltak: "Rengjør gjenvinnerrotor. Kontroller tettinger. Planlegg utskifting innen 2 år.",
  },
];

function StatusBadge({ severity }: { severity: "critical" | "warning" | "ok" }) {
  if (severity === "critical") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-red-800/50 bg-red-950/50 px-2.5 py-1 text-xs font-semibold text-red-400">
        <span className="h-2 w-2 rounded-full bg-red-400" />
        Høy
      </span>
    );
  }
  if (severity === "warning") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-yellow-800/50 bg-yellow-950/50 px-2.5 py-1 text-xs font-semibold text-yellow-400">
        <span className="h-2 w-2 rounded-full bg-yellow-400" />
        Medium
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-green-800/50 bg-green-950/50 px-2.5 py-1 text-xs font-semibold text-green-400">
      <span className="h-2 w-2 rounded-full bg-green-400" />
      Lav
    </span>
  );
}

export function ResultsAvvik() {
  return (
    <div>
      <div className="mb-4 rounded-xl bg-secondary/50 px-4 py-2 text-xs text-muted-foreground">
        Innreguleringstolerans ±10% (NS 6450)
      </div>
      <div className="space-y-3">
        {avvik.map((a) => (
          <div key={a.nr} className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                {a.system}
              </span>
              <StatusBadge severity={a.severity} />
            </div>
            <h3 className="text-sm font-bold text-foreground">{a.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{a.description}</p>
            <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5">
              <p className="text-sm text-primary">{a.tiltak}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
