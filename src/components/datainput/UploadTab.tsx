import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Upload, CheckCircle2, AlertTriangle, Loader2, FileText } from "lucide-react";

const parseResults = [
  { kode: "30", param: "Dim. radiator tur/retur", verdi: "55/40°C", side: "s.6, Dim.kriterier", status: "ok" },
  { kode: "30", param: "Dim. ventilasjon tur/retur", verdi: "55/35°C", side: "s.6", status: "ok" },
  { kode: "30", param: "DUT vinter", verdi: "-21.8°C", side: "s.9, Klimakrav", status: "ok" },
  { kode: "30", param: "Sommertemp", verdi: "28°C / 50% RF", side: "s.9", status: "ok" },
  { kode: "30", param: "Lydklasse", verdi: "C (NS 8175)", side: "s.7", status: "ok" },
  { kode: "31", param: "Maks ventetid VV", verdi: "10 sek", side: "s.11", status: "ok" },
  { kode: "32", param: "Varmekilde", verdi: "Fjernvarme", side: "s.12", status: "ok" },
  { kode: "32", param: "Regulering", verdi: "Mengderegulert", side: "s.13", status: "ok" },
  { kode: "32", param: "Pumper", verdi: "Doble (Grundfos Magna)", side: "s.13", status: "ok" },
  { kode: "32", param: "Installert varmeeffekt", verdi: "—", side: "Ikke funnet", status: "warning" },
  { kode: "36", param: "SFP-faktor", verdi: "—", side: "Ikke funnet", status: "warning" },
  { kode: "36", param: "Gjenvinner virkningsgrad", verdi: "—", side: "Ikke funnet", status: "warning" },
  { kode: "37", param: "Kjøledistribusjon", verdi: "Kjølebafler + isvann", side: "s.4", status: "ok" },
  { kode: "33", param: "Sprinkler", verdi: "Fullsprinklet", side: "s.4", status: "ok" },
];

export function UploadTab() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"idle" | "parsing" | "done">("idle");
  const [parseStep, setParseStep] = useState(0);

  const steps = [
    "Leser dokument...",
    "Identifiserer NS 3451-koder...",
    "Henter ut parametere...",
  ];

  const handleUpload = () => {
    setPhase("parsing");
    setParseStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= steps.length) {
        clearInterval(interval);
        setTimeout(() => setPhase("done"), 700);
      } else {
        setParseStep(step);
      }
    }, 700);
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleUpload}
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card py-16 transition-colors hover:border-primary/50"
          >
            <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-semibold text-foreground">Last opp funksjonsbeskrivelse</p>
            <p className="mt-1 text-sm text-muted-foreground">PDF, DOCX, XLS — klikk for demo</p>
          </motion.div>
        )}

        {phase === "parsing" && (
          <motion.div
            key="parsing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center rounded-xl bg-card py-16"
          >
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
            <p className="text-lg font-semibold text-foreground">{steps[parseStep]}</p>
            <div className="mt-4 flex gap-2">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-12 rounded-full transition-colors ${i <= parseStep ? "bg-primary" : "bg-secondary"}`}
                />
              ))}
            </div>
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-4 flex items-center gap-3 rounded-lg bg-vh-green/10 px-4 py-3">
              <FileText className="h-5 w-5 text-vh-green" />
              <div>
                <p className="text-sm font-semibold text-foreground">Funksjonsbeskrivelse_Parkveien.pdf</p>
                <p className="text-xs text-muted-foreground">14 parametere identifisert — 3 krever manuell input</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">NS-kode</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Parameter</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Funnet verdi</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Side/avsnitt</th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {parseResults.map((r, i) => (
                    <tr
                      key={i}
                      className={`border-b border-border ${r.status === "warning" ? "bg-vh-yellow/5" : ""}`}
                    >
                      <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{r.kode}</td>
                      <td className="px-4 py-2.5 font-medium text-foreground">{r.param}</td>
                      <td className="px-4 py-2.5">
                        {r.status === "warning" ? (
                          <input
                            className="w-full rounded border border-vh-yellow/40 bg-vh-yellow/10 px-2 py-1 text-sm text-foreground placeholder:text-muted-foreground"
                            placeholder="Legg inn verdi..."
                            defaultValue=""
                          />
                        ) : (
                          <span className="text-foreground">{r.verdi}</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">{r.side}</td>
                      <td className="px-4 py-2.5">
                        {r.status === "ok" ? (
                          <span className="inline-flex items-center gap-1 text-vh-green">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Godkjent
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-vh-yellow">
                            <AlertTriangle className="h-3.5 w-3.5" /> Manuell input
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => navigate("/simulator/simulering", { state: { startBuild: true } })}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Godkjenn alle parametere og start simulering →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
