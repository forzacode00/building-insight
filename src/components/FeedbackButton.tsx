import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquarePlus, X, Send, ChevronDown, CheckCircle2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useFeedback, type FeedbackItem } from "@/lib/FeedbackContext";

const typeOptions: { value: FeedbackItem["type"]; label: string; emoji: string }[] = [
  { value: "forslag", label: "Forslag til endring", emoji: "💡" },
  { value: "feil", label: "Noe fungerer ikke", emoji: "🐛" },
  { value: "annet", label: "Annet", emoji: "💬" },
];

const priorityOptions: { value: FeedbackItem["priority"]; label: string; color: string }[] = [
  { value: "lav", label: "Lav", color: "bg-secondary text-muted-foreground" },
  { value: "middels", label: "Middels", color: "bg-vh-yellow/20 text-vh-yellow" },
  { value: "høy", label: "Høy", color: "bg-vh-red/20 text-vh-red" },
];

function getPageName(pathname: string): string {
  if (pathname === "/") return "Landingsside";
  const map: Record<string, string> = {
    "/simulator": "Driftsmorgen",
    "/simulator/prosjekt": "Prosjekt",
    "/simulator/datainput": "Datainput",
    "/simulator/simulering": "Simulering",
    "/simulator/sammenligning": "Sammenligning",
    "/simulator/nettverkskart": "Nettverkskart",
    "/simulator/sd-live": "SD Live & What-If",
    "/simulator/priser": "Priser",
  };
  return map[pathname] || pathname;
}

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [type, setType] = useState<FeedbackItem["type"]>("forslag");
  const [priority, setPriority] = useState<FeedbackItem["priority"]>("middels");
  const [message, setMessage] = useState("");

  const location = useLocation();
  const { addFeedback, unreadCount } = useFeedback();

  const handleSubmit = () => {
    if (!message.trim()) return;
    addFeedback({
      page: getPageName(location.pathname),
      type,
      priority,
      message: message.trim(),
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
      setMessage("");
      setType("forslag");
      setPriority("middels");
    }, 1800);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4 shadow-lg shadow-black/20 transition-colors hover:bg-secondary"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        data-testid="feedback-button"
      >
        <MessageSquarePlus className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium text-foreground">Feedback</span>
        {unreadCount > 0 && (
          <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {unreadCount}
          </span>
        )}
      </motion.button>

      {/* Modal overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4"
            onClick={() => !submitted && setIsOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl"
            >
              {/* Success state */}
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 px-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <CheckCircle2 className="h-12 w-12 text-vh-green" />
                  </motion.div>
                  <p className="mt-4 text-lg font-semibold text-foreground">Takk for tilbakemeldingen</p>
                  <p className="mt-1 text-sm text-muted-foreground">Vi ser på det snarest.</p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-border px-5 py-4">
                    <div>
                      <h2 className="text-base font-semibold text-foreground">Send tilbakemelding</h2>
                      <p className="text-xs text-muted-foreground">
                        Side: <span className="font-medium text-foreground">{getPageName(location.pathname)}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="space-y-4 px-5 py-4">
                    {/* Type */}
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Type</label>
                      <div className="flex gap-2">
                        {typeOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setType(opt.value)}
                            className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                              type === opt.value
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/30"
                            }`}
                          >
                            <span className="mr-1">{opt.emoji}</span> {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Prioritet</label>
                      <div className="flex gap-2">
                        {priorityOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setPriority(opt.value)}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                              priority === opt.value
                                ? `${opt.color} ring-1 ring-current`
                                : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Beskrivelse</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Beskriv forslaget eller problemet..."
                        rows={4}
                        className="w-full resize-none rounded-lg border border-border bg-secondary/30 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        data-testid="feedback-message"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-border px-5 py-3">
                    <p className="text-[10px] text-muted-foreground/50">Feedback lagres internt</p>
                    <button
                      onClick={handleSubmit}
                      disabled={!message.trim()}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
                      data-testid="feedback-submit"
                    >
                      <Send className="h-3.5 w-3.5" />
                      Send
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
