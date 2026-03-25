import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AppSidebar } from "./AppSidebar";

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="ml-64 flex-1 overflow-y-auto">
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
      <div className="fixed bottom-4 right-4 z-50 rounded-full bg-primary/10 border border-primary/20 px-3 py-1">
        <span className="text-[10px] font-medium text-primary/60">VirtualHouse™ Investor Demo</span>
      </div>
    </div>
  );
}
