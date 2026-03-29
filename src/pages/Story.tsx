import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Thermometer,
  Wind,
  Snowflake,
  ArrowRight,
  Zap,
  BarChart3,
  Network,
  SlidersHorizontal,
  Shield,
  TrendingUp,
  Globe,
  Cpu,
  Building2,
  Wrench,
  PiggyBank,
  Leaf,
  CheckCircle2,
  Users,
  Activity,
  Anchor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";

/* ───────── helpers ───────── */
function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`relative flex flex-col items-center justify-center px-6 ${className}`}>{children}</section>;
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ───────── NAV ───────── */
function SiteNav() {
  const navigate = useNavigate();
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15">
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-bold tracking-tight">VirtualHouse</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-5">
          <button onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })} className="hidden sm:block text-xs text-muted-foreground hover:text-foreground transition-colors">Slik fungerer det</button>
          <button onClick={() => document.getElementById('scenarios')?.scrollIntoView({ behavior: 'smooth' })} className="hidden sm:block text-xs text-muted-foreground hover:text-foreground transition-colors">Scenarioer</button>
          <button onClick={() => navigate('/simulator/priser')} className="hidden sm:block text-xs text-muted-foreground hover:text-foreground transition-colors">Priser</button>
          <button onClick={() => navigate('/simulator')} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Prøv gratis <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ───────── MAIN ───────── */
export default function Story() {
  const navigate = useNavigate();
  return (
    <TooltipProvider>
      <div className="w-full bg-background text-foreground overflow-x-hidden">
        <SiteNav />
        <HeroSection navigate={navigate} />
        <TrustBar />
        <WhyNowSection />
        <ImpactSection />
        <DifferentiatorSection />
        <ScenarioSection navigate={navigate} />
        <LifecycleSection />
        <PersonaSection navigate={navigate} />
        <FAQSection />
        <CTASection navigate={navigate} />
      </div>
    </TooltipProvider>
  );
}

/* ═══════ HERO ═══════ */
function HeroSection({ navigate }: { navigate: (p: string) => void }) {
  return (
    <Section className="min-h-[92vh] py-20 relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(213_52%_63%/0.08),transparent)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

      <FadeIn className="z-10 max-w-3xl text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-primary">Building Performance, Verified.</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl leading-[1.08]">
          Se fremtiden til bygget ditt
          <br />
          <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">før det er bygget</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground leading-relaxed sm:text-lg">
          Fysiknøyaktig simulering av varmepumper, ventilasjon og kjøling — AI-optimalisert og levert som SaaS. VirtualHouse finner feil, viser besparelser og verifiserer ytelse gjennom hele byggets levetid.
        </p>
      </FadeIn>

      {/* CTAs */}
      <FadeIn delay={0.2} className="z-10 mt-8 flex flex-col sm:flex-row items-center gap-3">
        <Button size="lg" onClick={() => navigate('/simulator')} className="gap-2 px-8 py-5 text-base font-bold shadow-lg shadow-primary/20">
          Start gratis demo
          <ArrowRight className="h-5 w-5" />
        </Button>
        <a href="mailto:post@virtualhouse.no?subject=Demo%20VirtualHouse" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors">
          Book en gjennomgang →
        </a>
      </FadeIn>

      {/* Product preview */}
      <FadeIn delay={0.4} className="z-10 mt-12 w-full max-w-4xl">
        <div className="mx-auto rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm p-1.5 shadow-2xl shadow-black/20">
          <div className="rounded-lg bg-card/90 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-vh-green animate-pulse" />
                <span className="text-xs font-medium text-muted-foreground">Parkveien Kontorbygg — Live simulering</span>
              </div>
              <span className="text-[10px] text-muted-foreground/40 font-mono">VirtualHouse™</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Energiforbruk", value: "116", unit: "kWh/m²·år", color: "text-primary", icon: Zap },
                { label: "TEK17-status", value: "Oppfyller", unit: "krav: 115", color: "text-vh-green", icon: Shield },
                { label: "Identifiserte avvik", value: "3", unit: "krever tiltak", color: "text-vh-yellow", icon: Activity },
                { label: "Systemkoblinger", value: "42", unit: "datapunkter", color: "text-primary", icon: Network },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-lg bg-secondary/30 border border-border/30 px-3 py-2.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <kpi.icon className="h-3 w-3 text-muted-foreground/50" />
                    <span className="text-[10px] text-muted-foreground">{kpi.label}</span>
                  </div>
                  <p className={`text-lg font-bold font-mono tabular-nums ${kpi.color}`}>{kpi.value}</p>
                  <p className="text-[10px] text-muted-foreground/50">{kpi.unit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-center text-[10px] text-muted-foreground/30 mt-2">Ekte simuleringsdata fra demo-bygg · 6 000 m² · Oslo</p>
      </FadeIn>

      <motion.div className="absolute bottom-6 z-10" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <ChevronDown className="h-5 w-5 text-muted-foreground/30" />
      </motion.div>
    </Section>
  );
}

/* ═══════ TRUST BAR ═══════ */
function TrustBar() {
  return (
    <section className="w-full border-y border-border/30 py-6 bg-secondary/10">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 overflow-x-auto">
            {["Skanska", "Veidekke", "Statsbygg", "OBOS", "Multiconsult", "Norconsult", "Bravida"].map((n) => (
              <span key={n} className="text-xs font-medium text-muted-foreground/40 whitespace-nowrap">{n}</span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground/60">
            <span><span className="font-bold text-foreground/80">20+</span> enterprise-kunder</span>
            <span className="h-3 w-px bg-border" />
            <span><span className="font-bold text-foreground/80">0%</span> churn</span>
            <span className="h-3 w-px bg-border" />
            <span><span className="font-bold text-foreground/80">150k+</span> snitt årskontrakt</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════ WHY NOW ═══════ */
function WhyNowSection() {
  const drivers = [
    { icon: Leaf, title: "ESG-krav hardner", desc: "EU Taxonomy og CSRD krever dokumentert, verifiserbar energiytelse — ikke estimater. Eiendomseiere må bevise dataen sin.", color: "text-vh-green" },
    { icon: TrendingUp, title: "Energiprissjokk", desc: "Europeiske energikostnader har strukturelt endret seg. Hver 1% spart energi er nå verdt betydelig mer for bunnlinjen.", color: "text-vh-yellow" },
    { icon: Cpu, title: "AI trenger sannhet", desc: "AI-verktøy uten fysikkverifisering optimaliserer feil ting. VirtualHouse er sannhetsankeret — 'the truth anchor'.", color: "text-primary" },
  ];

  return (
    <Section className="py-20" id="why-now">
      <FadeIn className="mb-10 text-center max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Hvorfor nå</p>
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Tre krefter skaper uunngåelig etterspørsel</h2>
      </FadeIn>
      <div className="mx-auto w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4">
        {drivers.map((d, i) => (
          <FadeIn key={d.title} delay={i * 0.1}>
            <div className="rounded-xl border border-border/50 bg-card/30 p-6 h-full">
              <d.icon className={`h-5 w-5 ${d.color} mb-3`} />
              <h3 className="text-sm font-bold text-foreground mb-2">{d.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{d.desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}

/* ═══════ IMPACT ═══════ */
function ImpactSection() {
  return (
    <Section className="py-20">
      <FadeIn className="mx-auto grid w-full max-w-4xl grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        {[
          { value: "20–30%", desc: "Lavere investeringskostnad gjennom riktig dimensjonering", color: "text-primary" },
          { value: "20–30%", desc: "Lavere årlige energikostnader og direkte CO₂-reduksjon", color: "text-vh-green" },
          { value: "20%", desc: "Lavere driftskostnader når bygget opereres på kalibrert basis", color: "text-vh-yellow" },
        ].map((s) => (
          <div key={s.desc}>
            <p className={`text-5xl font-extrabold font-mono tabular-nums ${s.color}`}>{s.value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </FadeIn>
    </Section>
  );
}

/* ═══════ DIFFERENTIATOR ═══════ */
function DifferentiatorSection() {
  return (
    <Section className="py-20" id="how">
      <FadeIn className="mb-10 text-center max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Teknologien</p>
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">AI optimaliserer. Fysikk verifiserer. Vi gjør begge.</h2>
        <p className="mt-3 text-muted-foreground">VirtualHouse er den første plattformen som kombinerer fysiknøyaktig simulering med operasjonell intelligens.</p>
      </FadeIn>

      <div className="mx-auto w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Tradisjonell rådgivning", items: ["Statisk beregning, kun i prosjekteringsfasen", "Ikke koblet til faktisk drift", "Manuell, 4–8 ukers leveranse"], color: "border-border/30", textColor: "text-muted-foreground/60" },
          { title: "VirtualHouse", items: ["Fysikkbasert modell av systemets DNA", "Validerer design mot faktisk ytelse", "Identifiserer rotårsaker, ikke bare symptomer"], color: "border-primary/40 bg-primary/5", textColor: "text-primary", highlight: true },
          { title: "Ren AI-optimalisering", items: ["Gjetter basert på historiske data", "Optimaliserer uten å vite om systemet er fysisk riktig", "Lav nøyaktighet uten fysikk-forankring"], color: "border-border/30", textColor: "text-muted-foreground/60" },
        ].map((col) => (
          <FadeIn key={col.title}>
            <div className={`rounded-xl border p-5 h-full ${col.color}`}>
              <h3 className={`text-sm font-bold mb-3 ${col.highlight ? 'text-primary' : 'text-foreground/70'}`}>{col.title}</h3>
              <ul className="space-y-2">
                {col.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    {col.highlight ? <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" /> : <span className="h-1 w-1 rounded-full bg-muted-foreground/30 shrink-0 mt-1.5" />}
                    <span className={col.textColor}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Offshore heritage */}
      <FadeIn delay={0.3} className="mt-8 mx-auto max-w-4xl">
        <div className="flex items-start gap-3 rounded-xl border border-border/30 bg-secondary/20 px-5 py-4">
          <Anchor className="h-5 w-5 text-primary/60 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-foreground">Bevist teknologi fra offshore</p>
            <p className="text-xs text-muted-foreground mt-1">20+ år med fysikkbasert simulering fra offshore- og maritim industri — nå tilpasset verdens største aktivaklasse. Dette er ikke en software-feature, det er tiår med domenekompetanse.</p>
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}

/* ═══════ SCENARIOS ═══════ */
const scenarios = [
  {
    id: "settpunkt", icon: Thermometer, color: "text-primary", bg: "bg-primary/10", borderColor: "border-primary/30",
    who: "Driftssjef", question: "Hva skjer om jeg skrur opp turtemperaturen nå?",
    steps: [
      { time: "Du spør", event: "Turtemperaturen skal fra 45°C til 55°C — leietaker klager på kulde.", consequence: "VH beregner hva økningen faktisk koster." },
      { time: "VH svarer", event: "COP faller fra 3,6 til 2,9. Effektforbruk stiger 34%.", consequence: "+69 000 kr/år i strøm." },
      { time: "VH foreslår", event: "Hev til 49°C og juster pumpetrinn — samme romtemperatur, 60% lavere kostnad.", consequence: "" },
    ],
    how: "VH har en fysikkmodell av energisentralen — varmepumpe, rørnett, akkumuleringstank. Når du endrer ett settpunkt, beregner modellen ringvirkningene gjennom hele systemet på sekunder.",
    vhResult: "38 000 kr spart per år — uten at noen fryser.",
  },
  {
    id: "kaldt", icon: Snowflake, color: "text-vh-yellow", bg: "bg-vh-yellow/10", borderColor: "border-vh-yellow/30",
    who: "Driftssjef, etter klage", question: "Det er for kaldt i 3. etasje — kan du finne ut hvorfor?",
    steps: [
      { time: "Klagen", event: "Leietaker i 3. etasje melder 19°C. Settpunkt er 22°C.", consequence: "Du vet ikke hva som er galt." },
      { time: "VH analyserer", event: "Ventilen leverer 40% av beregnet vannmengde.", consequence: "Feil stilt siden forrige service." },
      { time: "Rotårsak", event: "VH peker på nøyaktig hvilken ventil i sone 3B.", consequence: "" },
    ],
    how: "VH vet hvordan systemet SKAL oppføre seg (fra fysikkmodellen) og sammenligner med hva som FAKTISK skjer — og peker på nøyaktig hvor avviket oppstår.",
    vhResult: "Problemet løst samme dag. Én ventil i sone 3B.",
  },
  {
    id: "feile", icon: Zap, color: "text-destructive", bg: "bg-destructive/10", borderColor: "border-destructive/30",
    who: "Eiendomssjef, morgenmøte", question: "Er det noen komponenter som kommer til å feile snart?",
    steps: [
      { time: "Morgenmøte", event: "Eiendomssjef spør: status på kritiske komponenter?", consequence: "" },
      { time: "VH svarer", event: "Kompressor K2: 4 200 starter på 18 mnd. Kjøler dårligere.", consequence: "Forventet feil innen 4–6 måneder." },
      { time: "Anbefaling", event: "Servicevindu i uke 16 — før sommerbelastningen.", consequence: "" },
    ],
    how: "VH tracker driftshistorikk for hver komponent — starter, driftstimer, ytelse. Når en komponent avviker fra forventet kurve, flagger VH den med årsak og anbefalt tidspunkt.",
    vhResult: "Planlagt bytte: 45 000 kr. Akutthavari: 180 000 kr.",
  },
];

function ScenarioSection({ navigate }: { navigate: (p: string) => void }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = scenarios.find(s => s.id === activeId);

  return (
    <Section className="py-24" id="scenarios">
      <FadeIn className="mb-10 text-center max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Se det i praksis</p>
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ekte spørsmål. Verifiserte svar.</h2>
        <p className="mt-3 text-muted-foreground">Tre situasjoner der noen trenger et svar — og VirtualHouse leverer det med fysikkverifisert nøyaktighet.</p>
      </FadeIn>

      <div className="mx-auto w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {scenarios.map((s) => (
          <FadeIn key={s.id}>
            <button
              onClick={() => setActiveId(activeId === s.id ? null : s.id)}
              className={`w-full text-left rounded-xl border p-5 transition-all duration-200 ${activeId === s.id ? `${s.borderColor} ${s.bg}` : "border-border/40 bg-card/30 hover:border-primary/20"}`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 h-9 w-9 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground/60 mb-1">{s.who}</p>
                  <p className="text-sm font-semibold text-foreground leading-snug">«{s.question}»</p>
                </div>
              </div>
            </button>
          </FadeIn>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {active && (
          <motion.div key={active.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="mx-auto w-full max-w-4xl">
            <div className={`rounded-xl border ${active.borderColor} overflow-hidden`}>
              <div className="p-6 space-y-0">
                {active.steps.map((step, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }} className="relative flex gap-4 pb-5">
                    {i < active.steps.length && <div className="absolute left-[15px] top-[28px] bottom-0 w-px bg-border/50" />}
                    <div className="flex-shrink-0 z-10">
                      <div className="h-8 w-8 rounded-full bg-secondary border border-border/50 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-muted-foreground">{i + 1}</span>
                      </div>
                    </div>
                    <div className="pt-0.5">
                      <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">{step.time}</p>
                      <p className="text-sm text-foreground mt-1">{step.event}</p>
                      {step.consequence && <p className="text-sm font-semibold text-destructive mt-1">{step.consequence}</p>}
                    </div>
                  </motion.div>
                ))}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex gap-4 pt-2">
                  <div className="flex-shrink-0 z-10">
                    <div className="h-8 w-8 rounded-full bg-vh-green/15 border border-vh-green/30 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-vh-green" />
                    </div>
                  </div>
                  <div className="rounded-lg bg-vh-green/5 border border-vh-green/20 p-4 flex-1">
                    <p className="text-xs text-muted-foreground mb-1">{active.how}</p>
                    <p className="text-sm font-bold text-vh-green">{active.vhResult}</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

/* ═══════ LIFECYCLE ═══════ */
function LifecycleSection() {
  const phases = [
    { num: "01", title: "Prosjektering", desc: "Simuler HVAC-systemer før bygging. Bevis ytelse, garanter samsvar, eliminer kostbare designfeil.", tag: "Vinn prosjekter & de-risk", color: "text-primary" },
    { num: "02", title: "Virtuell idriftsettelse", desc: "Stresstesting og optimalisering digitalt før fysisk overlevering — sikre at systemer fungerer sammen.", tag: "Null overleveringsfeil", color: "text-primary" },
    { num: "03", title: "Drift & overvåking", desc: "Koble til live styringssystem-data. Finn skjulte energitap, verifiser ytelse mot simuleringen.", tag: "Umiddelbare besparelser", color: "text-vh-green" },
    { num: "04", title: "Optimaliser & prediker", desc: "AI-optimalisering med proaktiv alarmdeteksjon og opptil 10 års prediktiv analyse.", tag: "Kontinuerlig ROI", color: "text-vh-yellow" },
  ];

  return (
    <Section className="py-20">
      <FadeIn className="mb-10 text-center max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Full livssyklus</p>
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Én plattform. Fire faser. Komplett kontroll.</h2>
      </FadeIn>
      <div className="mx-auto w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {phases.map((p, i) => (
          <FadeIn key={p.num} delay={i * 0.08}>
            <div className="rounded-xl border border-border/40 bg-card/30 p-5 h-full flex flex-col">
              <span className={`text-2xl font-extrabold ${p.color} opacity-30`}>{p.num}</span>
              <h3 className="text-sm font-bold text-foreground mt-1 mb-2">{p.title}</h3>
              <p className="text-xs text-muted-foreground flex-1 leading-relaxed">{p.desc}</p>
              <span className={`mt-3 inline-block rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium ${p.color}`}>{p.tag}</span>
            </div>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}

/* ═══════ PERSONA ═══════ */
function PersonaSection({ navigate }: { navigate: (p: string) => void }) {
  return (
    <Section className="py-20">
      <FadeIn className="mb-10 text-center max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">For ditt team</p>
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Hvem er du?</h2>
      </FadeIn>
      <div className="mx-auto w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Wrench, title: "VVS-rådgiver", desc: "Verifiser prosjekterte verdier, sammenlign scenarier, generer avviksrapport. Spar 4–8 uker per prosjekt.", cta: "Se simulering", path: "/simulator/simulering" },
          { icon: Building2, title: "Eiendomsforvalter", desc: "Overvåk energiytelse, finn rotårsaker til klager, kutt energikostnad 20–30%. ROI fra dag én.", cta: "Se driftsmorgen", path: "/simulator" },
          { icon: Leaf, title: "ESG-ansvarlig", desc: "Dokumenter CO₂-reduksjon for EU Taxonomy, verifiser energimerke, generer ESG-rapport for bankdialog.", cta: "Se Enova-vurdering", path: "/simulator/sammenligning" },
        ].map((p) => (
          <FadeIn key={p.title}>
            <div className="rounded-xl border border-border/40 bg-card/30 p-6 flex flex-col h-full">
              <p.icon className="h-5 w-5 text-primary mb-3" />
              <h3 className="text-sm font-bold text-foreground mb-2">{p.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">{p.desc}</p>
              <button onClick={() => navigate(p.path)} className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                {p.cta} <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}

/* ═══════ FAQ ═══════ */
function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
    { q: "Hva skiller VirtualHouse fra SIMIEN eller IDA-ICE?", a: "SIMIEN beregner bygningens energibehov. VirtualHouse simulerer selve energisentralen — varmepumper, tanker, brønner og automasjon i samspill. SIMIEN svarer 'hvor mye energi'. VirtualHouse svarer 'vil systemet faktisk klare å levere det'." },
    { q: "Hva gjør AI-en i VirtualHouse?", a: "Fysikkmotoren gir riktige svar. AI-en gjør plattformen enklere: last opp funksjonsbeskrivelse som PDF, og AI konfigurerer simulatoren. Etter simulering genererer AI avviksrapport med prioriterte anbefalinger." },
    { q: "Trenger jeg IT-kompetanse?", a: "Nei. Din SD-leverandør kobler styringssystemet til VirtualHouse — typisk 2–4 timer. Du bruker plattformen i nettleseren. Ingen installasjon." },
    { q: "Hva koster det vs. en konsulent?", a: "En VVS-konsulentanalyse koster 150 000–400 000 kr og tar 4–8 uker. VirtualHouse gjør tilsvarende på minutter, oppdatert daglig, fra 4 900 kr/mnd." },
  ];

  return (
    <Section className="py-20">
      <FadeIn className="mb-10 text-center"><h2 className="text-3xl font-bold tracking-tight">Vanlige spørsmål</h2></FadeIn>
      <FadeIn className="mx-auto w-full max-w-2xl space-y-2">
        {faqs.map((faq, i) => (
          <button key={i} onClick={() => setOpen(open === i ? null : i)} className="w-full text-left rounded-xl border border-border/40 bg-card/30 p-4 transition-colors hover:border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">{faq.q}</span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open === i ? "rotate-180" : ""}`} />
            </div>
            <AnimatePresence>
              {open === i && (
                <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="mt-3 text-sm text-muted-foreground leading-relaxed overflow-hidden">
                  {faq.a}
                </motion.p>
              )}
            </AnimatePresence>
          </button>
        ))}
      </FadeIn>
    </Section>
  );
}

/* ═══════ CTA ═══════ */
function CTASection({ navigate }: { navigate: (p: string) => void }) {
  return (
    <Section className="py-24">
      <FadeIn className="text-center max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          Building Performance,
          <br />
          <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">Verified.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-muted-foreground">
          Fysiknøyaktig simulering. AI-optimalisert. Levert som SaaS. Driftsoperativsystemet for energieffektive bygg.
        </p>
        <div className="mt-10">
          <Button size="lg" onClick={() => navigate('/simulator')} className="gap-2 px-10 py-5 text-lg font-bold shadow-lg shadow-primary/20">
            Start gratis demo
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Spørsmål? <a href="mailto:post@virtualhouse.no" className="font-medium text-primary underline underline-offset-4">post@virtualhouse.no</a>
        </p>
      </FadeIn>

      <footer className="mt-20 w-full border-t border-border/30 pt-8 pb-4">
        <div className="mx-auto max-w-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/60">
          <span className="font-bold text-foreground/60">VirtualHouse</span>
          <div className="flex gap-6">
            <a href="mailto:post@virtualhouse.no" className="hover:text-foreground transition-colors">post@virtualhouse.no</a>
            <a href="https://virtualhouse.no" target="_blank" rel="noopener" className="hover:text-foreground transition-colors">virtualhouse.no</a>
          </div>
          <span>© {new Date().getFullYear()} VirtualHouse AS</span>
        </div>
      </footer>
    </Section>
  );
}
