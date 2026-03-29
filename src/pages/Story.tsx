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
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ───────── STORY PAGE ───────── */
/* ═══════ STICKY NAV ═══════ */
function SiteNav() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <span className="text-sm font-bold tracking-tight">VirtualHouse</span>
        <div className="flex items-center gap-3 sm:gap-5">
          <button onClick={() => document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth' })} className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors">Utforsk</button>
          <button onClick={() => navigate('/simulator/priser')} className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors">Priser</button>
          <button onClick={() => navigate('/simulator')} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Prøv gratis <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default function Story() {
  const navigate = useNavigate();
  return (
    <TooltipProvider>
      <div className="w-full bg-background text-foreground overflow-x-hidden">
        <SiteNav />
        <HeroSection />
        <PainBandSection />
        <PlatformPreview navigate={navigate} />
        <TheFlipSection />
        <FAQSection />
        <CTASection navigate={navigate} />
      </div>
    </TooltipProvider>
  );
}

/* ═══════ SECTION 1 — Hero (Story Hook) ═══════ */
function HeroSection() {
  const navigate = useNavigate();
  return (
    <Section className="min-h-[90vh] py-16 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,hsl(213_52%_63%/0.06),transparent)]" />

      {/* === THE HOOK: A story everyone in the industry recognizes === */}
      <FadeIn className="z-10 max-w-2xl text-center">
        <p className="mb-6 text-sm font-semibold uppercase tracking-widest text-primary">
          VirtualHouse
        </p>

        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl leading-[1.1]">
          Hva skjer i bygget ditt
          <br />
          <span className="text-primary">når du ikke ser?</span>
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-lg text-muted-foreground">
          VirtualHouse simulerer alle tekniske systemer i bygget ditt — varmepumper, ventilasjon og kjøling — og viser deg konsekvensene før de inntreffer.
        </p>
      </FadeIn>

      {/* CTA */}
      <FadeIn delay={0.3} className="z-10 mt-8 w-full max-w-2xl text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" onClick={() => {
            navigate('/simulator');
          }} className="gap-2 px-8 py-5 text-base font-bold">
            Start gratis — ingen kortinfo
            <ArrowRight className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <button onClick={() => document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors">
              Utforsk scenarioene
            </button>
            <a href="mailto:post@virtualhouse.no?subject=Demo%20VirtualHouse" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors">
              Book demo
            </a>
          </div>
        </div>
      </FadeIn>

      {/* Product Preview — Mini Dashboard Mockup */}
      <FadeIn delay={0.5} className="z-10 mt-10 w-full max-w-4xl">
        <p className="text-center text-xs text-muted-foreground/60 mb-2">Slik ser VirtualHouse ut på et reelt kontorbygg:</p>
        <div className="mx-auto rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm p-1 shadow-2xl shadow-primary/5">
          <div className="rounded-lg bg-card/80 p-4 sm:p-5">
            {/* Mini header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-vh-green animate-pulse" />
                <span className="text-xs font-medium text-muted-foreground">Parkveien Kontorbygg — Live</span>
              </div>
              <span className="text-[10px] text-muted-foreground/60 font-mono">VirtualHouse™</span>
            </div>
            {/* 4 KPI cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Energiforbruk", value: "116", unit: "kWh/m²·år", color: "text-primary", icon: Zap },
                { label: "TEK17-status", value: "Oppfyller", unit: "krav: 115", color: "text-vh-green", icon: BarChart3 },
                { label: "Aktive avvik", value: "3", unit: "krever tiltak", color: "text-vh-yellow", icon: SlidersHorizontal },
                { label: "Systemkoblinger", value: "42", unit: "datapunkter", color: "text-primary", icon: Network },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-lg bg-secondary/30 border border-border/40 px-3 py-2.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <kpi.icon className="h-3 w-3 text-muted-foreground/60" />
                    <span className="text-[10px] text-muted-foreground">{kpi.label}</span>
                  </div>
                  <p className={`text-lg font-bold font-mono tabular-nums ${kpi.color}`}>{kpi.value}</p>
                  <p className="text-[10px] text-muted-foreground/60">{kpi.unit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-center text-[10px] text-muted-foreground/40 mt-2">116 kWh/m²·år = energimerke B · TEK17-krav: 115 · 3 avvik krever tiltak i dag</p>
      </FadeIn>

      {/* Social proof */}
      <FadeIn delay={0.7} className="z-10 mt-6">
        <p className="text-center text-xs text-muted-foreground/70 italic max-w-md mx-auto">
          «Det eneste verktøyet som kobler tegningene til faktisk SD-data og viser konsekvensene før bygget står.»
          <span className="not-italic font-medium text-muted-foreground ml-1">— Prosjektleder, norsk totalentreprenør</span>
        </p>
      </FadeIn>

      <motion.div
        className="absolute bottom-4 sm:bottom-8 z-10 flex flex-col items-center gap-2 text-muted-foreground"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs">Scroll for å se hvordan</span>
        <ChevronDown className="h-5 w-5" />
      </motion.div>
    </Section>
  );
}

/* ═══════ SECTION 2 — Pain Band (compact) ═══════ */
function PainBandSection() {
  return (
    <section className="relative w-full px-6 py-16 flex flex-col items-center">
      {/* 3 smertestats i rad */}
      <FadeIn className="mx-auto mb-4 grid w-full max-w-3xl grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div>
          <p className="text-5xl font-extrabold font-mono tabular-nums text-destructive">30%</p>
          <p className="mt-2 text-sm text-muted-foreground">av norske næringsbygg har konflikter mellom varme, kjøling og ventilasjon</p>
        </div>
        <div>
          <p className="text-5xl font-extrabold font-mono tabular-nums text-destructive">70 000</p>
          <p className="mt-2 text-sm text-muted-foreground">kr per utrykning til teknisk feil i bygg</p>
        </div>
        <div>
          <p className="text-5xl font-extrabold font-mono tabular-nums text-destructive">6–18 mnd</p>
          <p className="mt-2 text-sm text-muted-foreground">kortere tid å oppdage feil — med simulator vs. manuell gjennomgang</p>
        </div>
      </FadeIn>
    </section>
  );
}

/* ═══════ SECTION 3 — Livsløpstidslinje med AI ═══════ */
function TheFlipSection() {
  const lifecycle = [
    {
      phase: "Prosjektering",
      color: "text-primary",
      bg: "bg-primary/10",
      core: "Konfigurer energisentralen — varmepumper, brønner, tanker, automatikk. Kjør simulering og se avvik umiddelbart.",
      ai: "Last opp FBD i PDF → AI konfigurerer simulatoren automatisk",
    },
    {
      phase: "Validering",
      color: "text-primary",
      bg: "bg-primary/10",
      core: "Sammenlign scenarier, optimaliser KPIer, del resultater med prosjektteamet — alle ser samme data.",
      ai: "AI genererer avviksrapport med prioriterte anbefalinger",
    },
    {
      phase: "Idriftsettelse",
      color: "text-vh-yellow",
      bg: "bg-vh-yellow/10",
      core: "Koble byggets styringssystem til VirtualHouse. Test automasjon, alarmer og skjermbilder — før fysisk idriftsettelse.",
      ai: "Spør simulatoren med naturlig språk: \"hva skjer om varmepumpen stopper i februar?\"",
    },
    {
      phase: "Drift",
      color: "text-vh-green",
      bg: "bg-vh-green/10",
      core: "Feilsøk hendelser, kjør hva-skjer-hvis-scenarier, tren driftspersonell — raskere enn sanntid.",
      ai: "AI-agent foreslår optimaliseringer og validerer mot fysikkmotoren før anbefaling",
    },
  ];

  return (
    <Section className="py-24" id="faser">
      <FadeIn className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Hvordan det fungerer</h2>
        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">Fysikkmotoren simulerer energisentralen din gjennom fire faser — fra prosjektering til daglig drift.</p>
      </FadeIn>

      <div className="mx-auto w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {lifecycle.map((item, i) => (
          <FadeIn key={item.phase} delay={i * 0.1}>
            <div className={`rounded-xl border border-border p-5 h-full flex flex-col`}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${item.bg} ${item.color} text-xs font-bold`}>{i + 1}</span>
                <h3 className={`text-base font-bold ${item.color}`}>{item.phase}</h3>
              </div>
              <p className="text-sm text-muted-foreground flex-1">{item.core}</p>
              <div className="mt-3 rounded-lg bg-secondary/50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  <p className="text-xs text-foreground">{item.ai}</p>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>


    </Section>
  );
}


/* ═══════ SECTION 4 — "Hva skjer når..." Scenarios ═══════ */
const scenarios = [
  {
    id: "settpunkt",
    icon: Thermometer,
    color: "text-primary",
    bg: "bg-primary/10",
    borderColor: "border-primary/30",
    who: "Driftssjef",
    question: "Hva skjer om jeg skrur opp turtemperaturen nå?",
    steps: [
      { time: "Du spør", event: "Turtemperaturen skal fra 45°C til 55°C — leietaker klager på kulde.", consequence: "VH beregner hva økningen faktisk koster." },
      { time: "VH svarer", event: "COP faller fra 3,6 til 2,9. Effektforbruk stiger 34%.", consequence: "+69 000 kr/år i strøm." },
      { time: "VH foreslår", event: "Hev til 49°C og juster pumpetrinn — samme romtemperatur, 60% lavere kostnad.", consequence: "" },
    ],
    how: "VH har en fysikkmodell av energisentralen din — varmepumpe, rørnett, akkumuleringstank. Når du endrer ett settpunkt, beregner modellen ringvirkningene gjennom hele systemet på sekunder. Samme beregning i virkeligheten tar måneder og koster driftsforstyrrelser.",
    vhSolution: "Du tok en informert beslutning på 30 sekunder.",
    vhResult: "38 000 kr spart per år — uten at noen fryser.",
  },
  {
    id: "kaldt",
    icon: Snowflake,
    color: "text-vh-yellow",
    bg: "bg-vh-yellow/10",
    borderColor: "border-vh-yellow/30",
    who: "Driftssjef, etter klage",
    question: "Det er for kaldt i 3. etasje — kan du finne ut hvorfor?",
    steps: [
      { time: "Klagen", event: "Leietaker i 3. etasje melder om 19°C på morgenen. Settpunkt er 22°C.", consequence: "Du vet ikke hva som er galt." },
      { time: "VH analyserer", event: "Går gjennom data time for time den siste uken for sone 3B.", consequence: "Finner: ventilen leverer 40% av beregnet vannmengde." },
      { time: "Rotårsak", event: "Ventilen har stått feil stilt siden forrige service. VH peker på nøyaktig hvilken.", consequence: "" },
    ],
    how: "VH er koblet til byggets SD-anlegg og leser temperatur- og strømningsdata kontinuerlig. Fordi VH vet hvordan systemet SKAL oppføre seg (fra fysikkmodellen), kan den sammenligne med hva som FAKTISK skjer — og peke på nøyaktig hvor avviket oppstår.",
    vhSolution: "Problemet løses samme dag. Ingen tekniker trenger å gå alle etasjene.",
    vhResult: "VH pekte direkte på årsaken — én ventil i sone 3B.",
  },
  {
    id: "andre",
    icon: Wind,
    color: "text-vh-green",
    bg: "bg-vh-green/10",
    borderColor: "border-vh-green/30",
    who: "Driftssjef, oppfølging",
    question: "Kan dette ha skjedd andre steder i bygget?",
    steps: [
      { time: "Du lurer", event: "Ventilproblemet i 3. etasje er løst. Men hva med resten?", consequence: "" },
      { time: "VH sjekker", event: "Kjører tverranalyse: lav vannmengde relativt til settpunkt i alle soner.", consequence: "Finner to til: 1. etasje øst og 5. etasje vest." },
      { time: "Rangert", event: "Begge er på vei mot samme problem — men har ikke utløst klager ennå.", consequence: "" },
    ],
    how: "Når VH finner et avvik étt sted, kan den kjøre samme sjekk på ALLE soner i bygget automatisk. Fysikkmodellen vet hva normal drift ser ut som for hver sone — så den fanger opp mønstre før de blir klager.",
    vhSolution: "To leietakerklager forhindret før de oppstod.",
    vhResult: "25 000 kr i akuttutrykninger og kompensasjon unngått.",
  },
  {
    id: "feile",
    icon: Zap,
    color: "text-destructive",
    bg: "bg-destructive/10",
    borderColor: "border-destructive/30",
    who: "Eiendomssjef, morgenmøte",
    question: "Er det noen komponenter som kommer til å feile snart?",
    steps: [
      { time: "Morgenmøte", event: "Eiendomssjef spør: hva er status på de kritiske komponentene?", consequence: "" },
      { time: "VH svarer", event: "Kompressor K2: 4 200 starter på 18 måneder. Kjøler dårligere enn for 6 mnd siden.", consequence: "Flagget: forventet feil innen 4–6 måneder." },
      { time: "Anbefaling", event: "Foreslår servicevindu i uke 16 — før sommerbelastningen.", consequence: "" },
    ],
    how: "VH tracker driftshistorikk for hver komponent — antall starter, driftstimer, ytelse under last. Fysikkmodellen vet hva normal aldring ser ut som. Når en komponent avviker fra forventet kurve, flagger VH den — med årsak, forventet gjenstående levetid og anbefalt tidspunkt for service.",
    vhSolution: "Planlagt bytte: 45 000 kr. Akutthavari i sommer: 180 000 kr + 3 dager uten kjøling.",
    vhResult: "Du valgte planlagt. Bygget merket ingenting.",
  },
];

function PlatformPreview({ navigate }: { navigate: (path: string) => void }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = scenarios.find(s => s.id === activeId);

  return (
    <Section className="py-24" id="simulator">
      <FadeIn className="mb-10 text-center max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">Spør VirtualHouse</p>
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Ekte spørsmål. Ekte svar.</h2>
        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">Fire situasjoner der noen trenger et svar — og VirtualHouse leverer det.</p>
      </FadeIn>

      {/* Scenario cards */}
      <div className="mx-auto w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {scenarios.map((s) => (
          <FadeIn key={s.id}>
            <button
              onClick={() => setActiveId(activeId === s.id ? null : s.id)}
              className={`w-full text-left rounded-xl border p-5 transition-all duration-200 ${
                activeId === s.id
                  ? `${s.borderColor} ${s.bg}`
                  : "border-border bg-card/50 hover:border-primary/20"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 h-10 w-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground mb-1">{s.who}</p>
                  <p className="text-sm font-semibold text-foreground leading-snug">«{s.question}»</p>
                </div>
              </div>
            </button>
          </FadeIn>
        ))}
      </div>

      {/* Expanded scenario detail */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mx-auto w-full max-w-4xl"
          >
            <div className={`rounded-xl border ${active.borderColor} overflow-hidden`}>
              {/* Timeline steps */}
              <div className="p-6 space-y-0">
                {active.steps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.3 }}
                    className="relative flex gap-4 pb-6"
                  >
                    {/* Timeline connector */}
                    {i < active.steps.length && (
                      <div className="absolute left-[15px] top-[28px] bottom-0 w-px bg-border" />
                    )}
                    <div className="flex-shrink-0 z-10">
                      <div className="h-8 w-8 rounded-full bg-destructive/15 border border-destructive/30 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-destructive">{i + 1}</span>
                      </div>
                    </div>
                    <div className="pt-0.5">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{step.time}</p>
                      <p className="text-sm text-foreground mt-1">{step.event}</p>
                      <p className="text-sm font-semibold text-destructive mt-1">{step.consequence}</p>
                    </div>
                  </motion.div>
                ))}

                {/* How VH does it — the mechanism */}
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: active.steps.length * 0.15, duration: 0.3 }}
                  className="relative flex gap-4 py-3"
                >
                  <div className="flex-shrink-0 z-10">
                    <div className="h-8 w-8 rounded-full bg-secondary border border-border flex items-center justify-center">
                      <span className="text-[10px] font-bold text-muted-foreground">?</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-secondary/30 border border-border p-4 flex-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Hvordan VH klarer dette</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{active.how}</p>
                  </div>
                </motion.div>

                {/* VH Solution — green resolution */}
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (active.steps.length + 1) * 0.15, duration: 0.3 }}
                  className="relative flex gap-4 pt-2"
                >
                  <div className="flex-shrink-0 z-10">
                    <div className="h-8 w-8 rounded-full bg-vh-green/15 border border-vh-green/30 flex items-center justify-center">
                      <Zap className="h-4 w-4 text-vh-green" />
                    </div>
                  </div>
                  <div className="rounded-lg bg-vh-green/5 border border-vh-green/20 p-4 flex-1">
                    <p className="text-xs font-bold text-vh-green uppercase tracking-wider mb-1">Resultat</p>
                    <p className="text-sm text-foreground">{active.vhSolution}</p>
                    <p className="text-sm font-bold text-vh-green mt-2">{active.vhResult}</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Traction + CTA */}
      <FadeIn delay={0.3} className="mt-12 mx-auto w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card/50 p-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Brukt av nordiske ledere</p>
            <div className="flex flex-wrap gap-2">
              {["Skanska", "Veidekke", "Statsbygg", "OBOS", "Multiconsult", "Norconsult"].map((n) => (
                <span key={n} className="rounded-full bg-secondary/70 px-3 py-1 text-xs font-medium text-foreground">{n}</span>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground"><span className="font-bold text-foreground">20+</span> enterprise-kunder · <span className="font-bold text-foreground">0%</span> churn</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-3">
            <button onClick={() => navigate('/simulator')} className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3 text-base font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
              Åpne plattformen <ArrowRight className="h-4 w-4" />
            </button>
            <p className="text-xs text-muted-foreground">Se Parkveien Kontorbygg live i plattformen</p>
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}

/* ═══════ FAQ / Objection Handling ═══════ */
function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
    {
      q: "Hva skiller VirtualHouse fra SIMIEN eller IDA-ICE?",
      a: "SIMIEN beregner bygningens energibehov. VirtualHouse er en plattform som simulerer selve energisentralen — varmepumper, akkumuleringstanker, energibrønner og BAS-automasjon i samspill. SIMIEN svarer på 'hvor mye energi trenger bygget'. VirtualHouse svarer på 'vil energisentralen faktisk klare å levere det'.",
    },
    {
      q: "Hva gjør AI-en i VirtualHouse?",
      a: "Fysikkmotoren gir riktige svar. AI-en gjør plattformen enklere å bruke: last opp en funksjonsbeskrivelse i PDF, og AI konfigurerer simulatoren automatisk. Etter simulering genererer AI avviksrapport med prioriterte anbefalinger. Fysikkmotoren er tilgjengelig nå — AI-funksjonene er i beta.",
    },
    {
      q: "Kan jeg bruke plattformen selv?",
      a: "Ja. Du eller prosjekteringsteamet legger energisentraldesignet inn i VirtualHouse. Plattformen simulerer dimensjonering og samspill — og genererer rapport med avvik, KPIer og konklusjoner. Onboarding er inkludert.",
    },
    {
      q: "Hva koster det?",
      a: "VirtualHouse lisensieres per prosjekt eller som årsabonnement. For et bygg med energikostnader på 1–5 MNOK/år er typisk besparelse 10–20% — tilbakebetalingstid under tolv måneder. Enterprise-prising for portefølje.",
    },
  ];

  return (
    <Section className="py-20">
      <FadeIn className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Vanlige spørsmål</h2>
      </FadeIn>
      <FadeIn className="mx-auto w-full max-w-2xl space-y-2">
        {faqs.map((faq, i) => (
          <button
            key={i}
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full text-left rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">{faq.q}</span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open === i ? "rotate-180" : ""}`} />
            </div>
            <AnimatePresence>
              {open === i && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 text-sm text-muted-foreground leading-relaxed overflow-hidden"
                >
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

/* ═══════ SECTION 6 — CTA (urgent, specific) ═══════ */
function CTASection({ navigate }: { navigate: (path: string) => void }) {
  const segments = ["VVS-rådgivere", "Totalentreprenører", "Rådgivende ingeniører", "Driftsorganisasjoner", "Byggherrer"];

  return (
    <Section className="py-24">
      <FadeIn className="text-center max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          Hvert bygg har en historie
          <br />
          som ennå ikke er skrevet
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-lg text-muted-foreground">
          Kuldegrep. Brønndegenerering. Strømtopper ingen ser. <span className="font-bold text-foreground">VirtualHouse skriver den historien før den skjer — så du kan endre utfallet.</span>
        </p>
        <div className="mt-10">
          <button onClick={() => navigate('/simulator')} className="inline-flex items-center gap-3 rounded-md bg-primary px-10 py-4 text-lg font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
            Åpne plattformen
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Spørsmål?{" "}
          <a href="mailto:post@virtualhouse.no" className="font-medium text-primary underline underline-offset-4">
            post@virtualhouse.no
          </a>
        </p>
      </FadeIn>

      <FadeIn delay={0.3} className="mt-16">
        <p className="mb-6 text-center text-sm text-muted-foreground">Bygget for ingeniørteam i:</p>
        <div className="flex flex-wrap justify-center gap-4">
          {segments.map((name) => (
            <span key={name} className="rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm font-medium text-foreground">
              {name}
            </span>
          ))}
        </div>
      </FadeIn>
      <footer className="mt-16 w-full border-t border-border pt-8 pb-4">
        <div className="mx-auto max-w-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span className="font-bold text-foreground">VirtualHouse</span>
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
