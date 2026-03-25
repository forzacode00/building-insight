import { useRef } from "react";
import { motion } from "framer-motion";
import { Shield, FileText } from "lucide-react";
import { useSimResult } from "@/lib/SimContext";

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

const insuranceRisks = [
  {
    type: "Vannskade — kondensering",
    cause: "Isvannstemperatur 6°C + utilstrekkelig dampisolasjon",
    probability: "Moderat",
    probColor: "🟡",
    probDetail: "Simulert kondensforekomst: 23 timer/år",
    cost: "NOK 80 000–250 000",
    costDetail: "Takflis, isolasjon, overflater",
    nsRef: "NS 3451:2022 kode 37",
  },
  {
    type: "Brannrisiko — elektrisk utstyr",
    cause: "SFP over TEK17-grense indikerer overbelastet motor/frekvensomformer",
    probability: "Forhøyet",
    probColor: "🟠",
    probDetail: "",
    cost: "NOK 200 000–500 000",
    costDetail: "Motorbytte, frekvensomformer, kabelarbeid",
    nsRef: "NS 3451:2022 kode 36",
  },
  {
    type: "Frostskade — rørbrudd",
    cause: "48 timer utetemperatur < −15°C + havari varmeanlegg",
    probability: "Lav",
    probColor: "🟢",
    probDetail: "DUT −21.8°C 3-døgns middel, god margin",
    cost: "NOK 500 000–2 000 000",
    costDetail: "Rørbrudd, vannskade, nedetid",
    nsRef: "NS 3451:2022 kode 32",
  },
];

const probBorderMap: Record<string, string> = {
  "🟡": "border-yellow-700/40",
  "🟠": "border-orange-700/40",
  "🟢": "border-green-700/40",
};

export function ResultsAvvik() {
  const r = useSimResult();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Risikorapport — Parkveien Kontorbygg</title>
<style>
  body { font-family: system-ui, sans-serif; padding: 40px; color: #1a1a2e; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  .subtitle { color: #666; font-size: 13px; margin-bottom: 24px; }
  .meta { font-size: 12px; color: #888; margin-bottom: 20px; }
  .card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 12px; }
  .card h3 { margin: 0 0 8px; font-size: 15px; }
  .card p { margin: 4px 0; font-size: 13px; color: #444; }
  .label { font-weight: 600; color: #1a1a2e; }
  .footer { margin-top: 32px; border-top: 1px solid #ddd; padding-top: 12px; font-size: 11px; color: #888; }
</style></head><body>
  <h1>🔒 Forsikringsrelevante risikoer</h1>
  <p class="subtitle">Parkveien Kontorbygg — VirtualHouse™</p>
  <p class="meta">Generert: ${new Date().toLocaleDateString("nb-NO")} kl. ${new Date().toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })}</p>
  ${insuranceRisks.map((risk, i) => `
    <div class="card">
      <h3>${i + 1}. ${risk.type}</h3>
      <p><span class="label">Årsak:</span> ${risk.cause}</p>
      <p><span class="label">Sannsynlighet:</span> ${risk.probColor} ${risk.probability}${risk.probDetail ? ` (${risk.probDetail})` : ""}</p>
      <p><span class="label">Estimert reparasjonskost:</span> ${risk.cost}</p>
      <p><span class="label">NS-referanse:</span> ${risk.nsRef}</p>
    </div>
  `).join("")}
  <div class="footer">VirtualHouse™ Investor Demo v1.0 — Denne rapporten er indikativ og erstatter ikke profesjonell risikovurdering.</div>
</body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <div>
      <div className="mb-4 rounded-xl bg-secondary/50 px-4 py-2 text-xs text-muted-foreground">
        Innreguleringstolerans ±10% (NS 6450)
      </div>
      {r.avvik.length === 0 ? (
        <div className="rounded-xl border border-vh-green/30 bg-vh-green/5 p-8 text-center">
          <p className="text-sm font-medium text-vh-green">Ingen avvik funnet — alle parametere innenfor krav</p>
        </div>
      ) : (
        <div className="space-y-3">
          {r.avvik.map((a) => (
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
      )}

      {/* Forsikringsrelevante risikoer */}
      <motion.div
        ref={printRef}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8"
      >
        <div className="mb-2 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Forsikringsrelevante risikoer</h2>
        </div>
        <p className="mb-5 text-sm text-muted-foreground">
          Avvik med potensial for materiell skade eller personskade
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          {insuranceRisks.map((risk, i) => (
            <div
              key={i}
              className={`rounded-xl border bg-card p-5 ${probBorderMap[risk.probColor] || "border-border"}`}
            >
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Risikotype
              </p>
              <h3 className="text-sm font-bold text-foreground">{risk.type}</h3>

              <div className="mt-3 space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Årsak: </span>
                  <span className="text-foreground">{risk.cause}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Sannsynlighet: </span>
                  <span className="text-foreground">
                    {risk.probColor} {risk.probability}
                  </span>
                  {risk.probDetail && (
                    <p className="mt-0.5 text-xs text-muted-foreground/70">({risk.probDetail})</p>
                  )}
                </div>
                <div>
                  <span className="text-muted-foreground">Est. reparasjonskost: </span>
                  <span className="font-semibold text-foreground">{risk.cost}</span>
                  <p className="mt-0.5 text-xs text-muted-foreground/70">{risk.costDetail}</p>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-secondary/50 px-3 py-1.5">
                <p className="text-[11px] text-muted-foreground">{risk.nsRef}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handlePrint}
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <FileText className="h-4 w-4" />
          Eksporter risikorapport (PDF-forberedelse)
        </button>
      </motion.div>
    </div>
  );
}
