import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AppSidebar } from "./AppSidebar";
import { OnboardingModal } from "./OnboardingModal";
import { HelpCircle } from "lucide-react";

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showContextBar, setShowContextBar] = useState(true);

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="ml-64 flex-1 overflow-y-auto">
        {/* Context bar — explains where you are */}
        {showContextBar && (
          <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/95 backdrop-blur-sm px-6 py-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-vh-green animate-pulse" />
              <span>Du er i <span className="font-medium text-foreground">demo-modus</span> — Parkveien Kontorbygg, 6 000 m², Oslo</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowOnboarding(true)}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <HelpCircle className="h-3 w-3" />
                Guide
              </button>
              <button
                onClick={() => setShowContextBar(false)}
                className="text-[10px] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              >
                Skjul
              </button>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="hidden sm:block fixed bottom-4 right-4 z-50 rounded-full bg-primary/10 border border-primary/20 px-3 py-1">
        <span className="text-[10px] font-medium text-primary/60">VirtualHouse™ v0.9.4 · Investor Demo</span>
      </div>

      {/* Onboarding modal */}
      <AnimatePresence>
        {showOnboarding && (
          <OnboardingModal
            onDismiss={() => setShowOnboarding(false)}
            onNavigate={(path) => navigate(path)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
