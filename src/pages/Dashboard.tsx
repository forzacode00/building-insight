import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Building2, Zap, Shield, Activity, Network, TrendingUp, Clock,
  ChevronRight, ArrowRight, Cpu, Eye, BarChart3, FileText, Thermometer,
  Wind, Snowflake, Settings, AlertTriangle, CheckCircle2, Layers, Target,
  GitBranch, Radio, PieChart, Calendar, Gauge, Workflow,
} from "lucide-react";

/* ───── Data: Prosjektfaser med VH-rolle ───── */
const phases = [
  {
    id: "design",
    num: "01",
    title: "Prosjektering",
    subtitle: "Tidligfase & detaljprosjektering",
    period: "Mnd 1–8",
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    icon: FileText,
    vhRole: "Simuler & verifiser design",
    dataIn: ["Funksjonsbeskrivelse (NS 3451)", "Klimadata (NS-EN 12831)", "Dimensjonerende laster", "Systemvalg og komponentspesifikasjoner"],
    simOutputs: ["TEK17-samsvar verifisert", "Energiramme 116 kWh/m²·år", "Systemkonflikter identifisert (3)", "Optimalisert designforslag"],
    kpis: [
      { label: "Energiramme", value: "116", unit: "kWh/m²·år", status: "warning" },
      { label: "TEK17", value: "Oppfyller", unit: "krav: 115", status: "ok" },
      { label: "Designkonflikter", value: "3", unit: "identifisert", status: "warning" },
    ],
  },
  {
    id: "construction",
    num: "02",
    title: "Bygging",
    subtitle: "Utførelse & komponentverifisering",
    period: "Mnd 8–18",
    color: "from-indigo-500 to-indigo-600",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    text: "text-indigo-400",
    icon: Settings,
    vhRole: "Verifiser komponenter mot design",
    dataIn: ["Komponentdatablader", "FDV-dokumentasjon", "Testprotokoller (NS 6450)", "Innreguleringsdata"],
    simOutputs: ["Avvik fra designforutsetninger (2)", "Komponentkompatibilitet verifisert", "Oppdatert simuleringsmodell", "Prediksjon: reell ytelse vs. design"],
    kpis: [
      { label: "Verifiserte komp.", value: "42", unit: "av 48", status: "ok" },
      { label: "Avvik fra design", value: "2", unit: "krever tiltak", status: "warning" },
      { label: "FDV-dekningsgrad", value: "94%", unit: "", status: "ok" },
    ],
  },
  {
    id: "commissioning",
    num: "03",
    title: "Idriftsettelse",
    subtitle: "Funksjonstesting & overleveringskontroll",
    period: "Mnd 18–20",
    color: "from-amber-500 to-amber-600",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    icon: CheckCircle2,
    vhRole: "Virtuell idriftsettelse før fysisk",
    dataIn: ["SD-anlegg punktliste (BACnet)", "Innreguleringsprotokoll", "Funksjonstestresultater", "Overleveringsdokumentasjon (NS 6450)"],
    simOutputs: ["5 av 10 punkter godkjent", "Settpunktlogikk verifisert", "Samtidig varme/kjøle-drift flagget", "Komplett overleveringsrapport generert"],
    kpis: [
      { label: "Overleveringsstatus", value: "5/10", unit: "godkjent", status: "warning" },
      { label: "BACnet-punkter", value: "847", unit: "verifisert", status: "ok" },
      { label: "Alvorlige avvik", value: "1", unit: "kritisk", status: "critical" },
    ],
  },
  {
    id: "operations",
    num: "04",
    title: "Drift",
    subtitle: "Kontinuerlig overvåking & optimalisering",
    period: "År 1–10",
    color: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    icon: Activity,
    vhRole: "Overvåk, optimaliser, prediker",
    dataIn: ["SD Live-data (hvert 60. sek)", "Energimålinger", "Leietakerklager", "Vedlikeholdslogg"],
    simOutputs: ["Anomali: +7.5% energi vs. normal", "Rotårsak: ventil sone 3B", "Prediksjon: K2 feiler om 4 mnd", "Besparelse: 34 000 kr/år identifisert"],
    kpis: [
      { label: "Energi vs. normal", value: "+7.5%", unit: "over snitt", status: "warning" },
      { label: "Aktive alarmer", value: "2", unit: "krever tiltak", status: "warning" },
      { label: "Besparelse i år", value: "34k", unit: "NOK identifisert", status: "ok" },
    ],
  },
  {
    id: "aftermarket",
    num: "05",
    title: "Ettermarked",
    subtitle: "Portefølje, ESG & prediktiv vedlikehold",
    period: "År 2–25+",
    color: "from-violet-500 to-violet-600",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    text: "text-violet-400",
    icon: TrendingUp,
    vhRole: "Langsiktig verdi & porteføljeinnsikt",
    dataIn: ["Historisk driftsdata (kumulativt)", "Porteføljedata på tvers av bygg", "ESG-rapporteringskrav (EU Taxonomy)", "Komponentaldring og servicehistorikk"],
    simOutputs: ["10-års prediktiv energianalyse", "Komponentbytte-plan (K2: uke 16)", "ESG-rapport for bankdialog", "Benchmarking mot portefølje"],
    kpis: [
      { label: "Predikert besparelse", value: "2.1M", unit: "NOK over 10 år", status: "ok" },
      { label: "CO₂-reduksjon", value: "-14%", unit: "vs. baseline", status: "ok" },
      { label: "Komponentrisiko", value: "K2", unit: "bytte uke 16", status: "warning" },
    ],
  },
];

/* ───── Statusfarger ───── */
function statusColor(s: string) {
  if (s === "ok") return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  if (s === "warning") return "text-amber-400 bg-amber-500/10 border-amber-500/20";
  return "text-red-400 bg-red-500/10 border-red-500/20";
}

/* ───── Main Dashboard ───── */
export default function Dashboard() {
  const [activePhase, setActivePhase] = useState("design");
  const active = phases.find(p => p.id === activePhase)!;
  const navigate = useNavigate();

  // Auto-rotate disabled for stable screenshots
  // Enable for live demo: uncomment below
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setActivePhase(prev => {
  //       const idx = phases.findIndex(p => p.id === prev);
  //       return phases[(idx + 1) % phases.length].id;
  //     });
  //   }, 8000);
  //   return () => clearInterval(timer);
  // }, []);

  return (
    <div className="h-[calc(100vh-theme(spacing.8))] flex flex-col bg-background text-foreground overflow-hidden">
      {/* Header */}
      <header className="border-b border-border/20 px-6 py-2 shrink-0">
        <div className="flex items-center justify-between max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <span className="text-xs font-bold tracking-tight">VirtualHouse</span>
              <span className="text-[9px] text-muted-foreground/40 ml-1.5 font-mono">PLATFORM VISION</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-muted-foreground/30 font-mono">PARKVEIEN KONTORBYGG · 6 000 m² · OSLO</span>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-medium text-emerald-400">LIVE</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-3 flex-1 flex flex-col overflow-hidden">
        {/* Title */}
        <div className="mb-3 shrink-0">
          <h1 className="text-lg font-bold tracking-tight">
            Simuler byggets fremtid — <span className="bg-gradient-to-r from-primary via-blue-400 to-primary/60 bg-clip-text text-transparent">gjennom hele levetiden</span>
          </h1>
          <p className="text-xs text-muted-foreground/60">Fysikkbasert simulering som følger bygget fra prosjektering til 25+ års drift.</p>
        </div>

        {/* Phase timeline bar */}
        <div className="mb-3 shrink-0">
          <div className="flex gap-1">
            {phases.map((phase, i) => (
              <button
                key={phase.id}
                onClick={() => setActivePhase(phase.id)}
                className={`relative flex-1 rounded-lg border px-3 py-2 transition-all duration-300 ${
                  activePhase === phase.id
                    ? `${phase.border} ${phase.bg} shadow-lg`
                    : "border-border/10 hover:border-border/30"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold font-mono ${activePhase === phase.id ? phase.text : 'text-muted-foreground/40'}`}>{phase.num}</span>
                  <span className={`text-xs font-semibold ${activePhase === phase.id ? 'text-foreground' : 'text-muted-foreground/60'}`}>{phase.title}</span>
                </div>
                <p className={`text-[10px] ${activePhase === phase.id ? 'text-muted-foreground/70' : 'text-muted-foreground/30'}`}>{phase.period}</p>
                {activePhase === phase.id && (
                  <motion.div
                    layoutId="phase-indicator"
                    className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r ${phase.color}`}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="mt-1 flex items-center gap-1 px-2">
            <div className="h-px flex-1 bg-gradient-to-r from-blue-500/40 via-amber-500/40 to-emerald-500/40" />
            <span className="text-[9px] text-muted-foreground/50 font-mono px-2">DATAFANGST → SIMULERING → VERIFISERING</span>
            <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/40 via-violet-500/40 to-violet-500/20" />
          </div>
        </div>

        {/* Main content: 3-column layout */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePhase}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-12 gap-3 flex-1 min-h-0"
          >
            {/* Left: Data inn */}
            <div className="col-span-3">
              <div className={`rounded-xl border ${active.border} ${active.bg} p-3 h-full`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`h-6 w-6 rounded-md bg-background/50 flex items-center justify-center`}>
                    <active.icon className={`h-3.5 w-3.5 ${active.text}`} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-foreground">{active.title}</p>
                    <p className="text-[8px] text-muted-foreground/50">{active.subtitle}</p>
                  </div>
                </div>

                <p className="text-[9px] font-semibold text-muted-foreground/40 uppercase tracking-wider mb-2">Data inn</p>
                <div className="space-y-1">
                  {active.dataIn.map((d, i) => (
                    <motion.div
                      key={d}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-1.5"
                    >
                      <ChevronRight className={`h-2.5 w-2.5 ${active.text} shrink-0 mt-0.5`} />
                      <span className="text-[10px] text-foreground/70 leading-tight">{d}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-3 pt-2 border-t border-border/10">
                  <p className="text-[8px] text-muted-foreground/30">VirtualHouse-rolle:</p>
                  <p className={`text-[10px] font-semibold ${active.text} mt-0.5`}>{active.vhRole}</p>
                </div>
              </div>
            </div>

            {/* Center: Simulation engine */}
            <div className="col-span-6 flex flex-col gap-3">
              {/* Sim engine header */}
              <div className="rounded-xl border border-primary/20 bg-gradient-to-b from-primary/[0.06] to-transparent p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-primary/15 flex items-center justify-center">
                      <Cpu className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-foreground">VirtualHouse Simuleringsmotor</p>
                      <p className="text-[8px] text-muted-foreground/50">Fysikkbasert · 8 760 timer · AI-optimalisert</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Radio className="h-2.5 w-2.5 text-primary animate-pulse" />
                    <span className="text-[8px] font-mono text-primary">AKTIV</span>
                  </div>
                </div>

                {/* Sim flow visualization */}
                <div className="flex items-center justify-between gap-1">
                  {[
                    { icon: FileText, label: "Data", sub: "Parametere" },
                    { icon: Layers, label: "Modell", sub: "Fysikk-DNA" },
                    { icon: Gauge, label: "Simuler", sub: "8 760 timer" },
                    { icon: Eye, label: "Verifiser", sub: "Design vs. virk." },
                    { icon: Target, label: "Prediker", sub: "Se fremtiden" },
                  ].map((step, i, arr) => (
                    <div key={step.label} className="flex items-center gap-1 flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center mb-0.5">
                          <step.icon className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <p className="text-[10px] font-semibold text-foreground/90">{step.label}</p>
                        <p className="text-[8px] text-muted-foreground/60">{step.sub}</p>
                      </div>
                      {i < arr.length - 1 && (
                        <ArrowRight className="h-2.5 w-2.5 text-primary/30 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulation outputs */}
              <div className="rounded-xl border border-border/15 bg-card/20 p-3 flex-1">
                <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider mb-2">Simuleringsresultater — {active.title}</p>
                <div className="grid grid-cols-2 gap-1.5 mb-3">
                  {active.simOutputs.map((output, i) => (
                    <motion.div
                      key={output}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.06 }}
                      className="rounded-lg bg-background/40 border border-border/10 px-2.5 py-1.5"
                    >
                      <div className="flex items-start gap-1.5">
                        <Zap className={`h-2.5 w-2.5 ${active.text} shrink-0 mt-0.5`} />
                        <span className="text-[10px] text-foreground/70 leading-tight">{output}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-3 gap-2">
                  {active.kpis.map((kpi) => (
                    <div key={kpi.label} className={`rounded-lg border px-2.5 py-2 ${statusColor(kpi.status)}`}>
                      <p className="text-[9px] font-medium opacity-70 mb-0.5">{kpi.label}</p>
                      <p className="text-base font-bold font-mono tabular-nums">{kpi.value}</p>
                      <p className="text-[9px] opacity-50">{kpi.unit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Vision / prediction */}
            <div className="col-span-3">
              <div className="rounded-xl border border-border/15 bg-card/10 p-3 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded-md bg-emerald-500/10 flex items-center justify-center">
                    <Eye className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-foreground">Se fremtiden</p>
                    <p className="text-[8px] text-muted-foreground/50">Prediktiv innsikt</p>
                  </div>
                </div>

                <div className="space-y-1.5 flex-1">
                  {[
                    { q: "Turtemp økes til 55°C?", a: "COP faller 3.6→2.9. +69k kr/år.", color: "text-amber-400" },
                    { q: "K2 kompressor holder sommeren?", a: "Nei. Feil innen 4 mnd.", color: "text-red-400" },
                    { q: "Utvendig solavskjerming?", a: "Kjølebehov -35%. ROI: 14 mnd.", color: "text-emerald-400" },
                    { q: "TEK17-samsvar?", a: "Oppfyller, margin 1 kWh/m²·år.", color: "text-blue-400" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="rounded-lg bg-background/30 border border-border/10 p-2"
                    >
                      <p className="text-[10px] font-medium text-foreground/80 mb-0.5">«{item.q}»</p>
                      <p className={`text-[10px] font-semibold ${item.color}`}>{item.a}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-border/10">
                  <div className="rounded-lg bg-primary/5 border border-primary/15 p-2 text-center">
                    <p className="text-[10px] text-primary font-medium">Beregnet av fysikkmotoren.</p>
                    <p className="text-[8px] text-muted-foreground/50">Verifisert simulering.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom bar */}
        <div className="mt-3 rounded-xl border border-border/10 bg-card/5 px-4 py-2 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {[
                { label: "Datapunkter", value: "847", icon: Network },
                { label: "Simuleringer", value: "24", icon: Cpu },
                { label: "Avvik", value: "12", icon: AlertTriangle },
                { label: "Besparelse", value: "2.1M NOK", icon: TrendingUp },
                { label: "CO₂", value: "-14%", icon: Snowflake },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-1.5">
                  <stat.icon className="h-3 w-3 text-muted-foreground/30" />
                  <div>
                    <p className="text-[9px] text-muted-foreground/60">{stat.label}</p>
                    <p className="text-xs font-bold font-mono tabular-nums text-foreground">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-right">
              <p className="text-[9px] text-muted-foreground/50 font-mono">SIMULATION + OPERATIONS + OPTIMIZATION</p>
              <p className="text-[10px] font-semibold text-primary">= an operative platform.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
