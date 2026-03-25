import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, CheckCircle2, AlertTriangle, ChevronRight, Loader2, PenLine } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManualInput } from "@/components/datainput/ManualInput";
import { UploadTab } from "@/components/datainput/UploadTab";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function Datainput() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-6 lg:p-8">
      <motion.div variants={item} className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Datainput</h1>
        <p className="text-sm text-muted-foreground">Legg inn tekniske parametere eller last opp funksjonsbeskrivelse</p>
      </motion.div>

      <motion.div variants={item}>
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="mb-6 bg-secondary">
            <TabsTrigger value="manual" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <PenLine className="mr-1.5 h-3.5 w-3.5" /> Manuell input
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Upload className="mr-1.5 h-3.5 w-3.5" /> Last opp funksjonsbeskrivelse
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual">
            <ManualInput />
          </TabsContent>
          <TabsContent value="upload">
            <UploadTab />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
