import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Thermometer, AlertTriangle, DollarSign } from "lucide-react";
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

function BuildingHealthScore() {
  const score = 72;
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 85 ? "hsl(var(--vh-green))" : score >= 60 ? "hsl(var(--vh-yellow))" : "hsl(var(--vh-red))";
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
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(true);
  const [activeTab, setActiveTab] = useState("energi");
  const avvikRef = useRef<HTMLDivElement>(null);

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
          <BuildingHealthScore />
        </div>
      </motion.div>

      {/* P&ID + Controls */}
      <motion.div variants={item} className="mb-6 grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <PIDDiagram />
        </div>
        <div className="xl:col-span-2">
          <SimControls
            isRunning={isRunning}
            progress={progress}
            currentHour={currentHour}
            onStart={() => setIsRunning(true)}
          />
        </div>
      </motion.div>

      {/* Results */}
      {showResults && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {/* Timeline */}
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
