import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sun,
  Building2,
  ClipboardList,
  Zap,
  BarChart3,
  Network,
  SlidersHorizontal,
  PieChart,
  Lock,
  Home,
  CheckCircle2,
  ArrowLeft,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navItems = [
  { icon: Sun, label: "Driftsmorgen", path: "/simulator", badge: null },
  { icon: Building2, label: "Prosjekt", path: "/simulator/prosjekt", badge: null },
  { icon: ClipboardList, label: "Datainput", path: "/simulator/datainput", badge: null },
  { icon: Zap, label: "Simulering", path: "/simulator/simulering", badge: null },
  { icon: BarChart3, label: "Sammenligning", path: "/simulator/sammenligning", badge: null },
  { icon: Network, label: "Nettverkskart", path: "/simulator/nettverkskart", badge: "NY" },
  { icon: SlidersHorizontal, label: "Live-data & Hva-om", path: "/simulator/sd-live", badge: "NY" },
  
  { icon: DollarSign, label: "Priser", path: "/simulator/priser", badge: null },
  { icon: PieChart, label: "Portefølje", path: "/simulator/portefolje", badge: "locked" },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-background">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
          <Home className="h-5 w-5 text-primary" />
        </div>
        <span className="text-lg font-bold tracking-tight text-foreground">
          VirtualHouse
        </span>
      </div>

      {/* Project info */}
      <div className="mx-4 mb-4 rounded-lg border border-border bg-secondary/50 px-4 py-3">
        <p className="text-sm font-semibold text-foreground">Parkveien Kontorbygg</p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-vh-green" />
          <span className="text-xs text-vh-green font-medium">Simulering fullført</span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isLocked = item.badge === "locked";

          return (
            <div key={item.path} className="relative">
            <button
              onClick={() => !isLocked && navigate(item.path)}
              disabled={isLocked}
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/15 text-primary"
                  : isLocked
                    ? "cursor-not-allowed text-muted-foreground/40"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-primary"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
              {item.badge === "NY" && (
                <span className="ml-auto rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                  NY
                </span>
              )}
              {isLocked && (
                <Lock className="ml-auto h-3.5 w-3.5" />
              )}
            </button>
            {isLocked && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block z-50">
                <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground shadow-lg whitespace-nowrap">
                  Tilgjengelig med Portfolio-plan — <span className="text-primary font-medium">se Priser</span>
                </div>
              </div>
            )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-4 py-4 space-y-2">
        <button
          onClick={() => navigate('/')}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Tilbake til virtualhouse.no
        </button>
        <p className="text-[10px] text-muted-foreground/50 px-3">Demo · Parkveien Kontorbygg</p>
      </div>
    </aside>
  );
}
