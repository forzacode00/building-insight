import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  ChevronDown, Thermometer, Snowflake, ArrowRight, Zap, Network, Shield,
  TrendingUp, Cpu, Building2, Wrench, Leaf, CheckCircle2, Activity, Anchor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";

/* ───── helpers ───── */
function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`relative flex flex-col items-center justify-center px-6 ${className}`}>{children}</section>;
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-4">{children}</p>;
}

/* ───── NAV ───── */
function SiteNav() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "border-b border-border/40 bg-background/90 backdrop-blur-xl shadow-sm" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-bold tracking-tight">VirtualHouse</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-5">
          <button onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })} className="hidden md:block text-[13px] text-muted-foreground/70 hover:text-foreground transition-colors">Teknologi</button>
          <button onClick={() => document.getElementById('scenarios')?.scrollIntoView({ behavior: 'smooth' })} className="hidden md:block text-[13px] text-muted-foreground/70 hover:text-foreground transition-colors">Scenarioer</button>
          <button onClick={() => navigate('/simulator/priser')} className="hidden sm:block text-[13px] text-muted-foreground/70 hover:text-foreground transition-colors">Priser</button>
          <button onClick={() => navigate('/simulator')} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30">
            Prøv gratis <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ───── MAIN ───── */
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
    <Section className="min-h-[94vh] py-24 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_-10%,hsl(213_60%_60%/0.07),transparent)]" />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/[0.02] blur-[120px]" />

      <FadeIn className="z-10 max-w-3xl text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[11px] font-semibold tracking-wide text-primary">Building Performance, Verified.</span>
        </motion.div>

        <h1 className="text-[2.75rem] font-extrabold tracking-tight md:text-6xl lg:text-7xl leading-[1.05]">
          Se fremtiden til
          <br />
          bygget ditt{" "}
          <span className="bg-gradient-to-r from-primary via-blue-400 to-primary/60 bg-clip-text text-transparent">før det er bygget</span>
        </h1>

        <p className="mx-auto mt-7 max-w-xl text-[15px] text-muted-foreground/80 leading-relaxed sm:text-[17px]">
          Fysiknøyaktig simulering av varmepumper, ventilasjon og kjøling — AI-optimalisert og levert som SaaS. Finn feil, vis besparelser, verifiser ytelse.
        </p>
      </FadeIn>

      <FadeIn delay={0.15} className="z-10 mt-9 flex flex-col sm:flex-row items-center gap-3">
        <Button size="lg" onClick={() => navigate('/simulator')} className="gap-2.5 px-8 py-6 text-[15px] font-bold rounded-full shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all">
          Start gratis demo
          <ArrowRight className="h-4 w-4" />
        </Button>
        <a href="mailto:post@virtualhouse.no?subject=Demo%20VirtualHouse" className="text-[13px] text-muted-foreground/60 hover:text-foreground transition-colors">
          eller book en gjennomgang →
        </a>
      </FadeIn>

      {/* Product preview */}
      <FadeIn delay={0.3} className="z-10 mt-14 w-full max-w-4xl">
        <div className="relative">
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/20 via-primary/5 to-transparent" />
          <div className="relative rounded-2xl border border-border/30 bg-card/40 backdrop-blur-sm p-1.5 shadow-2xl shadow-black/30">
            <div className="rounded-xl bg-card/90 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full bg-vh-green animate-pulse" />
                  <span className="text-[13px] font-medium text-muted-foreground/70">Parkveien Kontorbygg — Live simulering</span>
                </div>
                <span className="text-[10px] text-muted-foreground/30 font-mono tracking-wider">VIRTUALHOUSE™</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Energiforbruk", value: "116", unit: "kWh/m²·år", color: "text-primary", icon: Zap },
                  { label: "TEK17-status", value: "Oppfyller", unit: "krav: 115", color: "text-vh-green", icon: Shield },
                  { label: "Identifiserte avvik", value: "3", unit: "krever tiltak", color: "text-vh-yellow", icon: Activity },
                  { label: "Systemkoblinger", value: "42", unit: "datapunkter", color: "text-primary", icon: Network },
                ].map((kpi) => (
                  <div key={kpi.label} className="rounded-xl bg-background/50 border border-border/20 px-4 py-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <kpi.icon className="h-3 w-3 text-muted-foreground/40" />
                      <span className="text-[10px] text-muted-foreground/60">{kpi.label}</span>
                    </div>
                    <p className={`text-xl font-bold font-mono tabular-nums ${kpi.color}`}>{kpi.value}</p>
                    <p className="text-[10px] text-muted-foreground/40 mt-0.5">{kpi.unit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-[10px] text-muted-foreground/25 mt-3">Ekte simuleringsdata fra demo-bygg · 6 000 m² · Oslo</p>
      </FadeIn>

      <motion.div className="absolute bottom-8 z-10" animate={{ y: [0, 6, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
        <ChevronDown className="h-5 w-5 text-muted-foreground/20" />
      </motion.div>
    </Section>
  );
}

/* ═══════ TRUST BAR ═══════ */
function TrustBar() {
  return (
    <section className="w-full border-y border-border/20 py-5">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-8 overflow-x-auto">
            {["Skanska", "Veidekke", "Statsbygg", "OBOS", "Multiconsult", "Norconsult", "Bravida"].map((n) => (
              <span key={n} className="text-[11px] font-semibold text-muted-foreground/25 whitespace-nowrap tracking-wide uppercase">{n}</span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-muted-foreground/40"><span className="font-bold text-muted-foreground/70">20+</span> kunder</span>
            <span className="h-3 w-px bg-border/30" />
            <span className="text-muted-foreground/40"><span className="font-bold text-muted-foreground/70">0%</span> churn</span>
            <span className="h-3 w-px bg-border/30" />
            <span className="text-muted-foreground/40"><span className="font-bold text-muted-foreground/70">150k+</span> snitt NOK</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════ WHY NOW ═══════ */
function WhyNowSection() {
  const drivers = [
    { icon: Leaf, title: "ESG-krav hardner", desc: "EU Taxonomy og CSRD krever dokumentert, verifiserbar energiytelse — ikke estimater.", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { icon: TrendingUp, title: "Energiprissjokk", desc: "Europeiske energikostnader har strukturelt endret seg. Hver 1% spart er verdt mer.", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    { icon: Cpu, title: "AI trenger sannhet", desc: "AI uten fysikkverifisering optimaliserer feil ting. VirtualHouse er sannhetsankeret.", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  ];

  return (
    <Section className="py-24">
      <FadeIn className="mb-12 text-center max-w-2xl">
        <SectionLabel>Hvorfor nå</SectionLabel>
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Tre krefter skaper uunngåelig etterspørsel</h2>
      </FadeIn>
      <div className="mx-auto w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4">
        {drivers.map((d, i) => (
          <FadeIn key={d.title} delay={i * 0.08}>
            <div className={`rounded-2xl border p-6 h-full ${d.bg}`}>
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-background/50 mb-4`}>
                <d.icon className={`h-5 w-5 ${d.color}`} />
              </div>
              <h3 className="text-[15px] font-bold text-foreground mb-2">{d.title}</h3>
              <p className="text-[13px] text-muted-foreground/70 leading-relaxed">{d.desc}</p>
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
    <section className="w-full py-20 border-y border-border/10">
      <div className="mx-auto max-w-4xl px-6">
        <FadeIn className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { value: "20–30%", desc: "Lavere investeringskostnad gjennom riktig dimensjonering", color: "from-primary to-blue-400" },
            { value: "20–30%", desc: "Lavere årlige energikostnader og direkte CO₂-kutt", color: "from-emerald-400 to-teal-500" },
            { value: "20%", desc: "Lavere driftskostnader med kalibrert drift", color: "from-amber-400 to-orange-500" },
          ].map((s) => (
            <div key={s.desc}>
              <p className={`text-5xl font-extrabold font-mono tabular-nums bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.value}</p>
              <p className="mt-3 text-[13px] text-muted-foreground/60 leading-relaxed max-w-[200px] mx-auto">{s.desc}</p>
            </div>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}

/* ═══════ DIFFERENTIATOR ═══════ */
function DifferentiatorSection() {
  return (
    <Section className="py-24" id="how">
      <FadeIn className="mb-12 text-center max-w-2xl">
        <SectionLabel>Teknologien</SectionLabel>
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">AI optimaliserer. Fysikk verifiserer.<br />Vi gjør begge.</h2>
        <p className="mt-4 text-[15px] text-muted-foreground/60">Den første plattformen som kombinerer fysiknøyaktig simulering med operasjonell intelligens.</p>
      </FadeIn>

      <div className="mx-auto w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Tradisjonell rådgivning", items: ["Statisk beregning, kun i prosjekteringsfasen", "Ikke koblet til faktisk drift", "Manuell, 4–8 ukers leveranse"], highlight: false },
          { title: "VirtualHouse", items: ["Fysikkbasert modell av systemets DNA", "Validerer design mot faktisk ytelse", "Identifiserer rotårsaker, ikke symptomer"], highlight: true },
          { title: "Ren AI-optimalisering", items: ["Gjetter basert på historiske data", "Optimaliserer uten fysisk verifisering", "Lav nøyaktighet uten fysikk-forankring"], highlight: false },
        ].map((col) => (
          <FadeIn key={col.title}>
            <div className={`rounded-2xl border p-6 h-full transition-all ${
              col.highlight
                ? "border-primary/30 bg-gradient-to-b from-primary/10 to-primary/[0.02] shadow-lg shadow-primary/10"
                : "border-border/20 bg-card/20"
            }`}>
              <h3 className={`text-sm font-bold mb-4 ${col.highlight ? 'text-primary' : 'text-muted-foreground/50'}`}>{col.title}</h3>
              <ul className="space-y-3">
                {col.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13px]">
                    {col.highlight ? <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> : <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/20 shrink-0 mt-2" />}
                    <span className={col.highlight ? "text-foreground/80" : "text-muted-foreground/40"}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.2} className="mt-6 mx-auto max-w-4xl">
        <div className="flex items-start gap-4 rounded-2xl border border-border/15 bg-card/10 px-6 py-5">
          <Anchor className="h-5 w-5 text-primary/50 shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-semibold text-foreground/80">Bevist teknologi fra offshore</p>
            <p className="text-[12px] text-muted-foreground/50 mt-1 leading-relaxed">20+ år med fysikkbasert simulering fra offshore- og maritim industri — nå tilpasset verdens største aktivaklasse.</p>
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}

/* ═══════ SCENARIOS ═══════ */
const scenarios = [
  { id: "settpunkt", icon: Thermometer, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", who: "Driftssjef", question: "Hva skjer om jeg skrur opp turtemperaturen?", steps: [{ t: "Du spør", e: "Turtemp fra 45°C til 55°C — leietaker klager på kulde.", c: "VH beregner kostnaden." }, { t: "VH svarer", e: "COP faller 3,6→2,9. Effektforbruk +34%.", c: "+69 000 kr/år." }, { t: "VH foreslår", e: "Hev til 49°C + juster pumpetrinn = 60% lavere kostnad.", c: "" }], how: "Fysikkmodellen beregner ringvirkninger gjennom hele systemet på sekunder.", result: "38 000 kr spart/år" },
  { id: "kaldt", icon: Snowflake, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", who: "Driftssjef, etter klage", question: "For kaldt i 3. etasje — hvorfor?", steps: [{ t: "Klagen", e: "19°C om morgenen. Settpunkt 22°C.", c: "" }, { t: "VH analyserer", e: "Ventilen leverer 40% av beregnet vannmengde.", c: "" }, { t: "Rotårsak", e: "Ventil feil stilt siden forrige service. Sone 3B.", c: "" }], how: "VH sammenligner SKAL-tilstand (fysikkmodell) med ER-tilstand (live data).", result: "Løst samme dag" },
  { id: "feile", icon: Zap, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", who: "Eiendomssjef", question: "Kommer noe til å feile snart?", steps: [{ t: "Morgenmøte", e: "Status på kritiske komponenter?", c: "" }, { t: "VH svarer", e: "Kompressor K2: 4 200 starter, ytelse synker.", c: "Feil innen 4–6 mnd." }, { t: "Anbefaling", e: "Service uke 16 — før sommerbelastning.", c: "" }], how: "VH tracker driftshistorikk og flagger avvik fra forventet aldringskurve.", result: "Spart 135 000 kr vs. havari" },
];

function ScenarioSection({ navigate }: { navigate: (p: string) => void }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = scenarios.find(s => s.id === activeId);

  return (
    <Section className="py-24" id="scenarios">
      <FadeIn className="mb-12 text-center max-w-3xl">
        <SectionLabel>Se det i praksis</SectionLabel>
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ekte spørsmål. Verifiserte svar.</h2>
      </FadeIn>

      <div className="mx-auto w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {scenarios.map((s) => (
          <FadeIn key={s.id}>
            <button onClick={() => setActiveId(activeId === s.id ? null : s.id)} className={`w-full text-left rounded-2xl border p-5 transition-all duration-200 ${activeId === s.id ? `${s.border} ${s.bg}` : "border-border/20 hover:border-border/40"}`}>
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 h-10 w-10 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center`}>
                  <s.icon className={`h-4.5 w-4.5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground/40 mb-1">{s.who}</p>
                  <p className="text-[13px] font-semibold text-foreground leading-snug">«{s.question}»</p>
                </div>
              </div>
            </button>
          </FadeIn>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {active && (
          <motion.div key={active.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mx-auto w-full max-w-4xl">
            <div className={`rounded-2xl border ${active.border} ${active.bg} overflow-hidden`}>
              <div className="p-6 space-y-0">
                {active.steps.map((step, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="relative flex gap-4 pb-5">
                    {i < active.steps.length - 1 && <div className="absolute left-[15px] top-[28px] bottom-0 w-px bg-border/20" />}
                    <div className="flex-shrink-0 z-10">
                      <div className="h-8 w-8 rounded-full bg-background/60 border border-border/30 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-[10px] font-bold text-muted-foreground/60">{i + 1}</span>
                      </div>
                    </div>
                    <div className="pt-0.5">
                      <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-wider">{step.t}</p>
                      <p className="text-[13px] text-foreground/80 mt-1">{step.e}</p>
                      {step.c && <p className="text-[13px] font-semibold text-red-400 mt-1">{step.c}</p>}
                    </div>
                  </motion.div>
                ))}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="flex gap-4 pt-2">
                  <div className="flex-shrink-0 z-10">
                    <div className="h-8 w-8 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    </div>
                  </div>
                  <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/15 p-4 flex-1">
                    <p className="text-[11px] text-muted-foreground/50 mb-1">{active.how}</p>
                    <p className="text-[14px] font-bold text-emerald-400">{active.result}</p>
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
    { num: "01", title: "Prosjektering", desc: "Simuler systemer før bygging. Bevis ytelse og eliminer designfeil.", tag: "Vinn prosjekter", color: "text-blue-400", tagBg: "bg-blue-500/10 text-blue-400" },
    { num: "02", title: "Virtuell idriftsettelse", desc: "Stresstesting digitalt før overlevering. Sikre at alt fungerer sammen.", tag: "Null feil", color: "text-blue-400", tagBg: "bg-blue-500/10 text-blue-400" },
    { num: "03", title: "Drift", desc: "Koble til live data. Finn skjulte tap og verifiser ytelse.", tag: "Umiddelbar ROI", color: "text-emerald-400", tagBg: "bg-emerald-500/10 text-emerald-400" },
    { num: "04", title: "Optimaliser", desc: "AI-optimalisering med proaktive alarmer og 10 års prediktiv analyse.", tag: "Kontinuerlig verdi", color: "text-amber-400", tagBg: "bg-amber-500/10 text-amber-400" },
  ];

  return (
    <section className="w-full py-24 border-y border-border/10">
      <div className="mx-auto max-w-5xl px-6">
        <FadeIn className="mb-12 text-center">
          <SectionLabel>Full livssyklus</SectionLabel>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Én plattform. Fire faser.</h2>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {phases.map((p, i) => (
            <FadeIn key={p.num} delay={i * 0.06}>
              <div className="rounded-2xl border border-border/15 bg-card/10 p-5 h-full flex flex-col group hover:border-border/30 transition-colors">
                <span className={`text-3xl font-extrabold ${p.color} opacity-20 group-hover:opacity-40 transition-opacity`}>{p.num}</span>
                <h3 className="text-[14px] font-bold text-foreground mt-1 mb-2">{p.title}</h3>
                <p className="text-[12px] text-muted-foreground/50 flex-1 leading-relaxed">{p.desc}</p>
                <span className={`mt-3 self-start rounded-full px-2.5 py-1 text-[10px] font-semibold ${p.tagBg}`}>{p.tag}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════ PERSONA ═══════ */
function PersonaSection({ navigate }: { navigate: (p: string) => void }) {
  return (
    <Section className="py-24">
      <FadeIn className="mb-12 text-center">
        <SectionLabel>For ditt team</SectionLabel>
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Hvem er du?</h2>
      </FadeIn>
      <div className="mx-auto w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Wrench, title: "VVS-rådgiver", desc: "Verifiser prosjekterte verdier, sammenlign scenarier, generer rapport. Spar 4–8 uker.", cta: "Se simulering", path: "/simulator/simulering" },
          { icon: Building2, title: "Eiendomsforvalter", desc: "Overvåk energiytelse, finn rotårsaker, kutt kostnad 20–30%. ROI fra dag én.", cta: "Se driftsmorgen", path: "/simulator" },
          { icon: Leaf, title: "ESG-ansvarlig", desc: "Dokumenter CO₂-kutt for EU Taxonomy, verifiser energimerke, generer bankrapport.", cta: "Se ESG-rapport", path: "/simulator/sammenligning" },
        ].map((p) => (
          <FadeIn key={p.title}>
            <div className="rounded-2xl border border-border/15 bg-card/10 p-6 flex flex-col h-full group hover:border-border/30 transition-colors">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mb-4">
                <p.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-[15px] font-bold text-foreground mb-2">{p.title}</h3>
              <p className="text-[12px] text-muted-foreground/50 leading-relaxed flex-1">{p.desc}</p>
              <button onClick={() => navigate(p.path)} className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-primary/70 hover:text-primary transition-colors group-hover:text-primary">
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
    { q: "Hva skiller VirtualHouse fra SIMIEN eller IDA-ICE?", a: "SIMIEN beregner energibehov. VirtualHouse simulerer selve energisentralen — varmepumper, tanker, brønner og automasjon i samspill. SIMIEN svarer 'hvor mye energi'. Vi svarer 'vil systemet faktisk klare å levere det'." },
    { q: "Hva gjør AI-en?", a: "Fysikkmotoren gir riktige svar. AI gjør plattformen enklere: last opp funksjonsbeskrivelse som PDF → AI konfigurerer simulatoren. Etter simulering genererer AI avviksrapport med prioriterte anbefalinger." },
    { q: "Trenger jeg IT-kompetanse?", a: "Nei. Din SD-leverandør kobler styringssystemet til VirtualHouse — typisk 2–4 timer. Du bruker plattformen i nettleseren." },
    { q: "Hva koster det vs. en konsulent?", a: "En VVS-konsulentanalyse koster xxx kr og tar 4–8 uker. VirtualHouse gjør tilsvarende på minutter, oppdatert daglig. Gratisplan med tokens inkludert." },
  ];

  return (
    <Section className="py-20">
      <FadeIn className="mb-10 text-center"><h2 className="text-2xl font-bold tracking-tight md:text-3xl">Vanlige spørsmål</h2></FadeIn>
      <FadeIn className="mx-auto w-full max-w-2xl space-y-2">
        {faqs.map((faq, i) => (
          <button key={i} onClick={() => setOpen(open === i ? null : i)} className="w-full text-left rounded-2xl border border-border/15 p-5 transition-colors hover:border-border/30">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-semibold text-foreground/90">{faq.q}</span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground/30 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`} />
            </div>
            <AnimatePresence>
              {open === i && (
                <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="mt-3 text-[13px] text-muted-foreground/60 leading-relaxed overflow-hidden">
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
    <Section className="py-28">
      <FadeIn className="text-center max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight md:text-5xl leading-tight">
          Building Performance,
          <br />
          <span className="bg-gradient-to-r from-primary via-blue-400 to-primary/60 bg-clip-text text-transparent">Verified.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-md text-[15px] text-muted-foreground/50">
          Fysiknøyaktig simulering. AI-optimalisert. Levert som SaaS.
        </p>
        <div className="mt-10">
          <Button size="lg" onClick={() => navigate('/simulator')} className="gap-2.5 px-10 py-6 text-[16px] font-bold rounded-full shadow-xl shadow-primary/25">
            Start gratis demo
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
        <p className="mt-5 text-[13px] text-muted-foreground/40">
          <a href="mailto:post@virtualhouse.no" className="text-primary/60 hover:text-primary underline underline-offset-4 transition-colors">post@virtualhouse.no</a>
        </p>
      </FadeIn>

      <footer className="mt-24 w-full border-t border-border/10 pt-8 pb-4">
        <div className="mx-auto max-w-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground/30">
          <span className="font-semibold text-muted-foreground/50">VirtualHouse</span>
          <div className="flex gap-6">
            <a href="mailto:post@virtualhouse.no" className="hover:text-muted-foreground/60 transition-colors">post@virtualhouse.no</a>
            <a href="https://virtualhouse.no" target="_blank" rel="noopener" className="hover:text-muted-foreground/60 transition-colors">virtualhouse.no</a>
          </div>
          <span>© {new Date().getFullYear()} VirtualHouse AS</span>
        </div>
      </footer>
    </Section>
  );
}
