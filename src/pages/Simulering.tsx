import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Thermometer, AlertTriangle, DollarSign, CheckCircle2 } from "lucide-react";
import { PIDDiagram } from "@/components/simulering/PIDDiagram";
import { SimControls } from "@/components/simulering/SimControls";
import { ResultsEnergi } from "@/components/simulering/ResultsEnergi";
import { ResultsKomfort } from "@/components/simulering/ResultsKomfort";
import { ResultsAvvik } from "@/components/simulering/ResultsAvvik";
import { ResultsOkonomi } from "@/components/simulering/ResultsOkonomi";
import { SimTimeline } from "@/components/simulering/SimTimeline";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

type BuildPhase = "building" | "ready" | "running" | "done";

function BuildingHealthScore() {
  const score = 72;
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const strokeColor = score >= 85 ? "#22C55E" : score >= 60 ? "#EAB308" : "#EF4444";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center">
            <div className="relative h-[120px] w-[120px]">
              <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
                <circle cx="60" cy="60" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
                <motion.circle
                  cx="60" cy="60" r={radius} fill="none"
                  stroke={strokeColor} strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-foreground font-mono tabular-nums">{score}</span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
            </div>
            <span className="mt-1 text-xs text-muted-foreground">Bygningshelse</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Basert på energieffektivitet, komfort, systemtilstand og avviksstatus</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function Simulering() {
  const [buildPhase, setBuildPhase] = useState<BuildPhase>("building");
  const [buildStep, setBuildStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState("energi");
  const avvikRef = useRef<HTMLDivElement>(null);

  // Build-up auto-advance
  useEffect(() => {
    if (buildPhase !== "building") return;
    const interval = setInterval(() => {
      setBuildStep((s) => {
        if (s >= 40) {
          clearInterval(interval);
          setBuildPhase("ready");
          return 40;
        }
        return s + 1;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [buildPhase]);

  // Simulation progress
  useEffect(() => {
    if (!isRunning) return;
    setShowResults(false);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          setShowResults(true);
          setBuildPhase("done");
          return 100;
        }
        return p + 2;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [isRunning]);

  const currentHour = Math.round((progress / 100) * 8760);

  const handleAvvikClick = (nr: number) => {
    setActiveTab("avvik");
    setTimeout(() => {
      avvikRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleStart = () => {
    setIsRunning(true);
    setBuildPhase("running");
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-6 lg:p-8">
      <motion.div variants={item} className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Simulering — Parkveien Kontorbygg</h1>
          <p className="text-sm text-muted-foreground">Helårssimulering med 8 760 timer</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            {["Varme", "Kjøling", "Luft", "Elkraft"].map((f) => (
              <span key={f} className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                {f}
              </span>
            ))}
          </div>
          {buildPhase !== "building" && <BuildingHealthScore />}
        </div>
      </motion.div>

      {/* Building phase — full width P&ID */}
      {buildPhase === "building" && (
        <motion.div variants={item} className="mb-6">
          {buildStep < 5 && (
            <motion.div
              className="flex items-center justify-center rounded-xl border border-border bg-card p-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-center">
                <motion.div
                  className="mx-auto mb-4 h-8 w-8 rounded-full border-2 border-primary border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="text-sm font-medium text-foreground">Bygger systemmodell fra funksjonsbeskrivelse...</p>
                <p className="mt-1 text-xs text-muted-foreground">Leser dokumentstruktur og identifiserer tekniske systemer</p>
              </div>
            </motion.div>
          )}
          {buildStep >= 5 && (
            <PIDDiagram buildStep={buildStep} />
          )}
          {buildStep >= 40 && (
            <motion.div
              className="mt-4 flex items-center gap-2 rounded-lg border border-vh-green/30 bg-vh-green/10 px-4 py-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CheckCircle2 className="h-4 w-4 text-vh-green" />
              <span className="text-sm font-medium text-vh-green">
                Systemmodell komplett — 7 systemer, 42 komponenter, 156 datapunkter
              </span>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Ready / Running / Done — grid layout with controls */}
      {buildPhase !== "building" && (
        <motion.div variants={item} className="mb-6 grid gap-6 xl:grid-cols-5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="xl:col-span-3">
            <PIDDiagram buildStep={999} />
          </div>
          <div className="xl:col-span-2">
            {buildPhase === "ready" && !isRunning && progress === 0 ? (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-4 text-sm font-semibold text-foreground">Simuleringsoppsett</h3>
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-secondary/50 px-3 py-2">
                    <p className="text-xs text-muted-foreground">Scenario</p>
                    <select className="mt-1 w-full rounded border border-border bg-card px-2 py-1 text-sm text-foreground">
                      <option>Normal drift</option>
                      <option>DUT vinter (-21.8°C)</option>
                      <option>Dim. sommer (28°C)</option>
                      <option>Feil: Gjenvinner ute av drift</option>
                    </select>
                  </div>
                  <div className="rounded-lg bg-secondary/50 px-3 py-2">
                    <p className="text-xs text-muted-foreground">Klima</p>
                    <p className="mt-1 text-sm font-medium text-foreground">Oslo</p>
                  </div>
                </div>
                <motion.button
                  onClick={handleStart}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  animate={{ boxShadow: ["0 0 0 0 hsl(var(--primary) / 0)", "0 0 0 8px hsl(var(--primary) / 0.15)", "0 0 0 0 hsl(var(--primary) / 0)"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  ▶ Kjør simulering (8 760 timer)
                </motion.button>
              </div>
            ) : (
              <SimControls
                isRunning={isRunning}
                progress={progress}
                currentHour={currentHour}
                onStart={handleStart}
              />
            )}
          </div>
        </motion.div>
      )}

      {/* Results */}
      {showResults && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="mb-6">
            <SimTimeline onAvvikClick={handleAvvikClick} />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 bg-secondary">
              <TabsTrigger value="energi" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Zap className="mr-1.5 h-3.5 w-3.5" /> Energi
              </TabsTrigger>
              <TabsTrigger value="komfort" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Thermometer className="mr-1.5 h-3.5 w-3.5" /> Komfort
              </TabsTrigger>
              <TabsTrigger value="avvik" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <AlertTriangle className="mr-1.5 h-3.5 w-3.5" /> Avvik
              </TabsTrigger>
              <TabsTrigger value="okonomi" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <DollarSign className="mr-1.5 h-3.5 w-3.5" /> Økonomi
              </TabsTrigger>
            </TabsList>
            <TabsContent value="energi"><ResultsEnergi /></TabsContent>
            <TabsContent value="komfort"><ResultsKomfort /></TabsContent>
            <TabsContent value="avvik"><div ref={avvikRef}><ResultsAvvik /></div></TabsContent>
            <TabsContent value="okonomi"><ResultsOkonomi /></TabsContent>
          </Tabs>
        </motion.div>
      )}
    </motion.div>
  );
}
