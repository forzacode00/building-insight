import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause } from "lucide-react";
import { PIDDiagram } from "@/components/simulering/PIDDiagram";
import { SimControls } from "@/components/simulering/SimControls";
import { ResultsEnergi } from "@/components/simulering/ResultsEnergi";
import { ResultsKomfort } from "@/components/simulering/ResultsKomfort";
import { ResultsAvvik } from "@/components/simulering/ResultsAvvik";
import { ResultsOkonomi } from "@/components/simulering/ResultsOkonomi";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function Simulering() {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(true);

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

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-6 lg:p-8">
      <motion.div variants={item} className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Simulering — Parkveien Kontorbygg</h1>
          <p className="text-sm text-muted-foreground">Helårssimulering med 8 760 timer</p>
        </div>
        <div className="flex gap-2">
          {["Varme", "Kjøling", "Luft", "Elkraft"].map((f) => (
            <span key={f} className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
              {f}
            </span>
          ))}
        </div>
      </motion.div>

      {/* P&ID + Controls */}
      <motion.div variants={item} className="mb-6 grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <PIDDiagram />
        </div>
        <div className="xl:col-span-3">
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
          <Tabs defaultValue="energi" className="w-full">
            <TabsList className="mb-4 bg-secondary">
              <TabsTrigger value="energi" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">⚡ Energi</TabsTrigger>
              <TabsTrigger value="komfort" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">🌡️ Komfort</TabsTrigger>
              <TabsTrigger value="avvik" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">⚠️ Avvik</TabsTrigger>
              <TabsTrigger value="okonomi" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">💰 Økonomi</TabsTrigger>
            </TabsList>
            <TabsContent value="energi"><ResultsEnergi /></TabsContent>
            <TabsContent value="komfort"><ResultsKomfort /></TabsContent>
            <TabsContent value="avvik"><ResultsAvvik /></TabsContent>
            <TabsContent value="okonomi"><ResultsOkonomi /></TabsContent>
          </Tabs>
        </motion.div>
      )}
    </motion.div>
  );
}
