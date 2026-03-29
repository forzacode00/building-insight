import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, BarChart3, PiggyBank, Zap, ArrowRight, X, Building2 } from "lucide-react";

interface OnboardingModalProps {
  onDismiss: () => void;
  onNavigate: (path: string) => void;
}

export function OnboardingModal({ onDismiss, onNavigate }: OnboardingModalProps) {
  const [step, setStep] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
    >
      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="relative px-6 pt-6 pb-4">
                <button onClick={onDismiss} className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                  <X className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Velkommen til VirtualHouse</h2>
                    <p className="text-xs text-muted-foreground">Demo — Parkveien Kontorbygg, Oslo</p>
                  </div>
                </div>

                <div className="rounded-xl bg-secondary/30 border border-border/50 p-4 mb-4">
                  <p className="text-sm text-foreground leading-relaxed">
                    Du ser nå et <span className="font-semibold">demo-bygg</span> — et 6 000 m² kontorbygg i Oslo, simulert over hele 2025.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    Alt du ser er basert på ekte tekniske data. VirtualHouse har simulert hvert teknisk system — varmepumper, ventilasjon, kjøling — time for time gjennom hele året.
                  </p>
                </div>

                <p className="text-sm font-medium text-foreground mb-3">Hva vil du se først?</p>
              </div>

              {/* Quick-start options */}
              <div className="px-6 pb-4 space-y-2">
                {[
                  { icon: Sun, label: "Morgenbriefing", desc: "Hva skjedde i bygget i natt?", path: "/simulator", color: "text-vh-yellow" },
                  { icon: Zap, label: "Simuleringsresultater", desc: "Se P&ID og teknisk analyse", path: "/simulator/simulering", color: "text-primary" },
                  { icon: PiggyBank, label: "Hva kan vi spare?", desc: "Se besparingsestimat og ROI", path: "/simulator/sammenligning", color: "text-vh-green" },
                  { icon: BarChart3, label: "Vis meg alt", desc: "Teknisk gjennomgang for ingeniører", path: "/simulator/prosjekt", color: "text-primary" },
                ].map((opt) => (
                  <button
                    key={opt.path}
                    onClick={() => { onDismiss(); onNavigate(opt.path); }}
                    className="flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left transition-all hover:border-primary/30 hover:bg-secondary/50"
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary`}>
                      <opt.icon className={`h-4 w-4 ${opt.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{opt.label}</p>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground/40" />
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-border px-6 py-3 flex items-center justify-between bg-secondary/20">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                >
                  Vis meg en rask guide først
                </button>
                <button
                  onClick={onDismiss}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Hopp over
                </button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="guide"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              <h3 className="text-base font-semibold text-foreground mb-4">Slik fungerer VirtualHouse</h3>

              <div className="space-y-4 mb-6">
                {[
                  { num: 1, title: "Beskriv bygget", desc: "Legg inn tekniske data — eller last opp funksjonsbeskrivelse som PDF. VirtualHouse konfigurerer seg automatisk.", time: "30 min" },
                  { num: 2, title: "VH simulerer", desc: "Fysikkmotoren beregner hvert system time for time: energi, temperatur, luftmengder, trykk. 8 760 timer — under 60 sekunder.", time: "< 1 min" },
                  { num: 3, title: "Se resultater", desc: "Avvik, besparelser og anbefalinger. Sammenlign scenarier, generer rapport, del med team.", time: "5 min" },
                  { num: 4, title: "Koble til live-data", desc: "Din SD-leverandør kobler byggets styringssystem til VH — typisk 2-4 timer. Du trenger ingen IT-kompetanse.", time: "Valgfritt" },
                ].map((s) => (
                  <div key={s.num} className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                      {s.num}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <p className="text-sm font-medium text-foreground">{s.title}</p>
                        <span className="text-[10px] text-muted-foreground/60 font-mono">{s.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button onClick={() => setStep(0)} className="flex-1 rounded-lg border border-border bg-secondary py-2.5 text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors">
                  ← Tilbake
                </button>
                <button onClick={onDismiss} className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                  Utforsk demoen →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
