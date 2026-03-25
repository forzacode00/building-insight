import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Building2, MapPin, Calendar, Ruler, Award, ChevronDown, ChevronRight, CheckSquare, Square, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const buildingInfo = [
  { icon: Building2, label: "Bygningstype", value: "Kontorbygning" },
  { icon: MapPin, label: "Sted", value: "Oslo" },
  { icon: Ruler, label: "BTA / BRA", value: "7 200 / 6 000 m²" },
  { icon: Building2, label: "Etasjer", value: "9 (U1 + plan 1-8)" },
  { icon: Calendar, label: "Byggeår", value: "2024 (rehabilitering)" },
  { icon: Award, label: "Energimerke", value: "C" },
];

const systemTree = [
  { code: "31", name: "Sanitærinstallasjoner", checked: true, children: ["311 Kaldt vann", "312 Varmt vann / VVC", "313 Avløp og spillvann"] },
  { code: "32", name: "Varmeinstallasjoner", checked: true, children: ["321 Ledningsnett", "324 Armaturer", "325 Utstyr (radiatorer, pumper)"] },
  { code: "33", name: "Brannslokking", checked: true, children: ["331 Manuell", "332 Sprinkler", "333 Vanntåke"] },
  { code: "35", name: "Varmepumpe/kulde", checked: true, children: ["351 Kjølerom", "353 Isvann", "354 Varmepumper"] },
  { code: "36", name: "Luftbehandling", checked: true, children: ["361 Kanalnett", "364 Luftfordeling", "365 Aggregat (AHU)"] },
  { code: "37", name: "Komfortkjøling", checked: true, children: ["371 Ledningsnett", "374 Armaturer", "375 Kjølebafler"] },
  { code: "38", name: "Vannbehandling", checked: false, children: [] },
  { code: "41", name: "Basisinstallasjoner elkraft", checked: false, children: [] },
  { code: "44", name: "Lys", checked: false, children: ["441 Innvendig", "443 Nødlys"] },
  { code: "56", name: "SD-anlegg", checked: true, children: ["561 Sentral driftskontroll", "562 Undersentraler", "563 Feltinstrumentering"] },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function Prosjekt() {
  const navigate = useNavigate();
  const [systems, setSystems] = useState(systemTree);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleCheck = (code: string) => {
    setSystems((prev) => prev.map((s) => (s.code === code ? { ...s, checked: !s.checked } : s)));
  };

  const toggleExpand = (code: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  };

  const checkedCount = systems.filter((s) => s.checked).length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-6 lg:p-8">
      <motion.div variants={item} className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Prosjekt — Parkveien Kontorbygg</h1>
        <p className="text-sm text-muted-foreground">Bygningsinformasjon og NS 3451:2022 systemvalg</p>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-5">
        {/* Building info — left 40% */}
        <motion.div variants={item} className="xl:col-span-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Bygningsinformasjon</h2>
            <div className="space-y-4">
              {buildingInfo.map((info) => (
                <div key={info.label} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <info.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{info.label}</p>
                    <p className="text-sm font-semibold text-foreground">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-secondary/50 p-4">
              <p className="text-xs text-muted-foreground mb-1">Prosjektbeskrivelse</p>
              <p className="text-sm text-foreground leading-relaxed">
                Totalrehabilitering av eksisterende kontorbygning med nytt VVS-anlegg.
                Bygningen har fjernvarme, kjølebafler, VAV-ventilasjon og BACnet SD-anlegg.
                Prosjektet inkluderer energioptimalisering mot TEK17.
              </p>
            </div>
          </div>
        </motion.div>

        {/* NS 3451 system tree — right 60% */}
        <motion.div variants={item} className="xl:col-span-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 text-lg font-semibold text-foreground">NS 3451:2022 — Systemvalg</h2>
            <p className="mb-4 text-xs text-muted-foreground">Velg hvilke tekniske systemer som skal inkluderes i simuleringsmodellen</p>

            <div className="space-y-1">
              {systems.map((sys) => {
                const isExpanded = expanded.has(sys.code);
                const hasChildren = sys.children.length > 0;

                return (
                  <div key={sys.code}>
                    <div
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                        sys.checked ? "bg-primary/5" : "hover:bg-secondary/50"
                      }`}
                    >
                      <button onClick={() => toggleCheck(sys.code)} className="shrink-0">
                        {sys.checked ? (
                          <CheckSquare className="h-5 w-5 text-primary" />
                        ) : (
                          <Square className="h-5 w-5 text-muted-foreground/40" />
                        )}
                      </button>

                      <span className="shrink-0 rounded-md bg-secondary px-2 py-0.5 text-xs font-bold font-mono tabular-nums text-muted-foreground">
                        {sys.code}
                      </span>

                      <span className={`flex-1 text-sm font-medium ${sys.checked ? "text-foreground" : "text-muted-foreground"}`}>
                        {sys.name}
                      </span>

                      {hasChildren && (
                        <button onClick={() => toggleExpand(sys.code)} className="shrink-0 rounded p-1 hover:bg-secondary">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      )}
                    </div>

                    {isExpanded && hasChildren && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="ml-12 space-y-0.5 overflow-hidden pb-1"
                      >
                        {sys.children.map((child) => (
                          <div key={child} className="rounded-md px-3 py-1.5 text-xs text-muted-foreground">
                            {child}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground font-mono tabular-nums">{checkedCount}</span> systemer valgt
              </span>
              <button
                onClick={() => navigate("/datainput")}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Konfigurer valgte systemer
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
