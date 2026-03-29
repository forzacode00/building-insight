import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, X, ChevronDown, MessageSquare, Clock, Tag } from "lucide-react";
import { useFeedback, type FeedbackItem } from "@/lib/FeedbackContext";

const statusColors: Record<FeedbackItem["status"], string> = {
  "ny": "bg-primary/15 text-primary border-primary/30",
  "under vurdering": "bg-vh-yellow/15 text-vh-yellow border-vh-yellow/30",
  "implementert": "bg-vh-green/15 text-vh-green border-vh-green/30",
  "avvist": "bg-secondary text-muted-foreground border-border",
};

const typeEmoji: Record<FeedbackItem["type"], string> = {
  forslag: "💡",
  feil: "🐛",
  annet: "💬",
};

const priorityLabel: Record<FeedbackItem["priority"], { text: string; color: string }> = {
  lav: { text: "Lav", color: "text-muted-foreground" },
  middels: { text: "Middels", color: "text-vh-yellow" },
  "høy": { text: "Høy", color: "text-vh-red" },
};

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Akkurat nå";
  if (minutes < 60) return `${minutes} min siden`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}t siden`;
  return `${Math.floor(hours / 24)}d siden`;
}

export function FeedbackAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, updateStatus, unreadCount } = useFeedback();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <>
      {/* Admin toggle — only visible when there are items */}
      {items.length > 0 && (
        <motion.button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 left-4 z-40 flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4 shadow-lg shadow-black/20 transition-colors hover:bg-secondary"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          data-testid="feedback-admin-button"
        >
          <ClipboardList className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-foreground">Feedback ({items.length})</span>
          {unreadCount > 0 && (
            <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-vh-red px-1 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </motion.button>
      )}

      {/* Slide-over panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="fixed left-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-r border-border bg-card shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                  <h2 className="text-base font-semibold text-foreground">Feedback-innboks</h2>
                  <p className="text-xs text-muted-foreground">{items.length} tilbakemeldinger · {unreadCount} nye</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-6">
                    <MessageSquare className="h-10 w-10 text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">Ingen tilbakemeldinger ennå</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {items.map((item) => (
                      <div key={item.id} className="px-5 py-4">
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{typeEmoji[item.type]}</span>
                            <span className="text-xs font-medium text-muted-foreground">{item.page}</span>
                            <span className={`text-[10px] font-bold ${priorityLabel[item.priority].color}`}>
                              {priorityLabel[item.priority].text}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60">
                            <Clock className="h-3 w-3" />
                            {timeAgo(item.timestamp)}
                          </div>
                        </div>

                        {/* Message */}
                        <p className="text-sm text-foreground leading-relaxed mb-3">{item.message}</p>

                        {/* Status controls */}
                        <div className="flex items-center gap-2">
                          {(["ny", "under vurdering", "implementert", "avvist"] as FeedbackItem["status"][]).map((s) => (
                            <button
                              key={s}
                              onClick={() => updateStatus(item.id, s)}
                              className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition-all ${
                                item.status === s
                                  ? statusColors[s]
                                  : "border-transparent bg-secondary/50 text-muted-foreground/50 hover:bg-secondary hover:text-muted-foreground"
                              }`}
                            >
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
