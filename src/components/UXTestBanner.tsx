import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, X, Send, Star, ChevronRight, CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useFeedback } from "@/lib/FeedbackContext";

/* ───── Page-specific UX prompts ───── */
const pagePrompts: Record<string, string[]> = {
  "/": [
    "Forstår du hva VirtualHouse gjør innen 10 sekunder?",
    "Ville du klikket videre til plattformen? Hvorfor/hvorfor ikke?",
    "Er scenarioene troverdige for din hverdag?",
  ],
  "/simulator": [
    "Er dashboardet oversiktlig nok til å bruke daglig?",
    "Savner du noe informasjon i driftsmorgen-visningen?",
    "Er prioriteringen av hendelser tydelig?",
  ],
  "/simulator/prosjekt": [
    "Er det intuitivt å velge NS 3451-systemer?",
    "Forstår du klimaskall-simulatoren?",
    "Mangler det noen parametere du ville forventet?",
  ],
  "/simulator/datainput": [
    "Er parameterlisten oversiktlig?",
    "Vet du hvilke verdier som bør endres?",
    "Er funksjonsbeskrivelse-opplastingen troverdig?",
  ],
  "/simulator/simulering": [
    "Forstår du P&ID-diagrammet?",
    "Er det tydelig hva simuleringen beregner?",
    "Ville du stolt på resultatene?",
  ],
  "/simulator/sammenligning": [
    "Er tabellen lett å lese?",
    "Er besparelses-estimatet troverdig?",
    "Forstår du Enova-vurderingen?",
  ],
  "/simulator/nettverkskart": [
    "Forstår du hva kunnskapsgrafen viser?",
    "Er det nyttig å se avhengigheter mellom systemer?",
    "Er fargekodingen intuitiv?",
  ],
  "/simulator/sd-live": [
    "Forstår du BACnet-feeden?",
    "Er What-If-funksjonen nyttig for deg?",
    "Ville du brukt overleveringssjekklisten?",
  ],
  "/simulator/priser": [
    "Er prismodellen forståelig?",
    "Er ROI-kalkulatoren overbevisende?",
    "Ville du valgt en plan basert på denne informasjonen?",
  ],
};

function getPageName(pathname: string): string {
  if (pathname === "/") return "Landingsside";
  const map: Record<string, string> = {
    "/simulator": "Driftsmorgen",
    "/simulator/prosjekt": "Prosjekt",
    "/simulator/datainput": "Datainput",
    "/simulator/simulering": "Simulering",
    "/simulator/sammenligning": "Sammenligning",
    "/simulator/nettverkskart": "Nettverkskart",
    "/simulator/sd-live": "SD Live",
    "/simulator/priser": "Priser",
  };
  return map[pathname] || pathname;
}

/* ───── UX Test Mode Toggle ───── */
export function UXTestToggle() {
  const [testMode, setTestMode] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [copied, setCopied] = useState(false);

  const inviteUrl = typeof window !== "undefined"
    ? `${window.location.origin}${window.location.pathname}#/?ux_test=1`
    : "";

  const handleCopy = () => {
    navigator.clipboard?.writeText(inviteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <>
      {/* Toggle in admin area */}
      <div className="fixed bottom-14 right-3 z-40 flex flex-col gap-1.5 sm:bottom-32 sm:right-4">
        <motion.button
          onClick={() => setShowInvite(true)}
          className="flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-[11px] shadow-lg shadow-black/20 transition-colors hover:bg-secondary sm:h-11 sm:px-4 sm:text-xs"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          data-testid="ux-invite-button"
        >
          <Users className="h-4 w-4 text-vh-green" />
          <span className="text-xs font-medium text-foreground">Inviter testere</span>
        </motion.button>

        {testMode && (
          <motion.button
            onClick={() => setTestMode(false)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex h-8 items-center gap-1.5 rounded-full border border-vh-green/30 bg-vh-green/10 px-3 text-[10px] font-medium text-vh-green"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-vh-green animate-pulse" />
            UX-test aktiv
            <X className="h-3 w-3 ml-1" />
          </motion.button>
        )}
      </div>

      {/* Invite modal */}
      <AnimatePresence>
        {showInvite && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowInvite(false)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl"
            >
              <div className="border-b border-border px-6 py-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-vh-green/15">
                    <Users className="h-5 w-5 text-vh-green" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Inviter testbrukere</h2>
                    <p className="text-sm text-muted-foreground">Samle strukturert UX-feedback fra ekte brukere</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-5 space-y-5">
                {/* Invite link */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">Delingslenke</label>
                  <div className="flex gap-2">
                    <div className="flex-1 rounded-lg border border-border bg-secondary/30 px-3 py-2.5 text-sm text-muted-foreground font-mono truncate">
                      {inviteUrl}
                    </div>
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
                    >
                      {copied ? <CheckCircle2 className="h-4 w-4 text-vh-green" /> : <Copy className="h-4 w-4" />}
                      {copied ? "Kopiert" : "Kopier"}
                    </button>
                  </div>
                </div>

                {/* What testers see */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">Hva testbrukere ser</label>
                  <div className="rounded-xl border border-border bg-secondary/20 p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">1</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">Feedback-knapp på hver side</p>
                        <p className="text-xs text-muted-foreground">Type, prioritet og beskrivelse</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">2</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">UX-spørsmål tilpasset hver side</p>
                        <p className="text-xs text-muted-foreground">3 spesifikke spørsmål per side som guider tilbakemeldingene</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">3</span>
                      <div>
                        <p className="text-sm font-medium text-foreground">Svar samles i feedback-innboksen</p>
                        <p className="text-xs text-muted-foreground">Du ser alt i admin-panelet med status-sporing</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick-activate */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Aktiver UX-modus nå</p>
                    <p className="text-xs text-muted-foreground">Vis UX-spørsmål på alle sider</p>
                  </div>
                  <button
                    onClick={() => { setTestMode(true); setShowInvite(false); }}
                    className="inline-flex items-center gap-2 rounded-lg bg-vh-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-vh-green/90"
                  >
                    Aktiver
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* UX prompts bar — shown when test mode is active */}
      {testMode && <UXPromptBar />}
    </>
  );
}

/* ───── UX Prompt Bar (bottom of page) ───── */
function UXPromptBar() {
  const location = useLocation();
  const { addFeedback } = useFeedback();
  const [activePrompt, setActivePrompt] = useState<number | null>(null);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState<Set<number>>(new Set());
  const [rating, setRating] = useState(0);

  const prompts = pagePrompts[location.pathname] || pagePrompts["/"] || [];
  const pageName = getPageName(location.pathname);

  const handleSubmit = (promptIdx: number) => {
    if (!answer.trim() && rating === 0) return;
    addFeedback({
      page: pageName,
      type: "forslag",
      priority: "middels",
      message: `[UX-test] ${prompts[promptIdx]}\n\nScore: ${rating}/5\nSvar: ${answer.trim()}`,
    });
    setSubmitted((s) => new Set(s).add(promptIdx));
    setActivePrompt(null);
    setAnswer("");
    setRating(0);
  };

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-vh-green/20 bg-card/95 backdrop-blur-md"
    >
      <div className="mx-auto max-w-5xl px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-vh-green animate-pulse" />
          <span className="text-[10px] font-semibold text-vh-green uppercase tracking-wider">UX-test — {pageName}</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {prompts.map((prompt, i) => {
            const isDone = submitted.has(i);
            const isActive = activePrompt === i;

            return (
              <button
                key={i}
                onClick={() => !isDone && setActivePrompt(isActive ? null : i)}
                disabled={isDone}
                className={`flex-shrink-0 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                  isDone
                    ? "border-vh-green/30 bg-vh-green/10 text-vh-green"
                    : isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {isDone ? (
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Besvart</span>
                ) : (
                  prompt
                )}
              </button>
            );
          })}
        </div>

        {/* Answer panel */}
        <AnimatePresence>
          {activePrompt !== null && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex gap-3 items-end">
                {/* Star rating */}
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setRating(n)}
                      className="p-0.5"
                    >
                      <Star
                        className={`h-5 w-5 transition-colors ${
                          n <= rating ? "text-vh-yellow fill-vh-yellow" : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Text input */}
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(activePrompt)}
                  placeholder="Din tilbakemelding..."
                  className="flex-1 rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                  autoFocus
                />

                <button
                  onClick={() => handleSubmit(activePrompt)}
                  disabled={!answer.trim() && rating === 0}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
