import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  FileText,
  ChevronDown,
  Building2,
  GraduationCap,
  HeartPulse,
  Thermometer,
  Wind,
  RefreshCw,
  Snowflake,
  ArrowRight,
  AlertTriangle,
  Zap,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  TrendingDown,
  Share2,
  Copy,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { useSimInput, useSimResult } from "@/lib/SimContext";
import { runSimulation } from "@/lib/simulationEngine";
import { ResponsiveContainer, BarChart, Bar, XAxis } from "recharts";
import IsometricBuilding from "@/components/IsometricBuilding";
import LiveSystemDiagram from "@/components/LiveSystemDiagram";
import TimelinePlayer from "@/components/TimelinePlayer";

/* ───────── helpers ───────── */
function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return <section id={id} className={`relative flex flex-col items-center justify-center px-6 ${className}`}>{children}</section>;
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Des"];

const buildingTypes = [
  { id: "kontor", label: "Kontor", icon: Building2, bra: 6000 },
  { id: "skole", label: "Skole", icon: GraduationCap, bra: 8000 },
  { id: "sykehus", label: "Sykehus", icon: HeartPulse, bra: 12000 },
] as const;

/* ───────── STORY PAGE ───────── */
/* ═══════ STICKY NAV ═══════ */
function SiteNav() {
  const navigate = useNavigate();
  const result = useSimResult();
  const hasResult = result.totalEnergyKwhM2 > 0;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <span className="text-sm font-bold tracking-tight">VirtualHouse</span>
        <div className="flex items-center gap-4 sm:gap-6">
          <a href="#simulator" className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors">Simulator</a>
          {hasResult && (
            <span className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
              result.healthScore >= 80 ? "bg-vh-green/15 text-vh-green" : result.healthScore >= 60 ? "bg-vh-yellow/15 text-vh-yellow" : "bg-destructive/15 text-destructive"
            }`}>
              Score: {result.healthScore}
            </span>
          )}
          <Button size="sm" variant="default" className="gap-1.5 text-xs" onClick={() => navigate("/simulator")}>
            Prøv gratis <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default function Story() {
  return (
    <TooltipProvider>
      <div className="w-full bg-background text-foreground overflow-x-hidden">
        <SiteNav />
        <HeroSection />
        <PainBandSection />
        {/* Trust bar */}
        <section className="w-full border-y border-border bg-card/50 py-6 px-6">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">Bygget for norsk byggbransje</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 opacity-50">
            {["Totalentreprenører", "Rådgivende ingeniører", "Byggherrer", "Eiendomsforvaltere", "Kommuner"].map(s => (
              <span key={s} className="text-xs font-medium text-muted-foreground">{s}</span>
            ))}
          </div>
        </section>
        <TheFlipSection />
        <SimulatorSection />
        <AdvancedSection />
        <FAQSection />
        <CTASection />
      </div>
    </TooltipProvider>
  );
}

/* ═══════ Hero Building (video + isometric fallback) ═══════ */
function HeroBuilding() {
  const [videoError, setVideoError] = useState(false);

  return (
    <div className="relative w-full max-w-[640px] rounded-xl overflow-hidden border border-border">
      {!videoError ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/vh_hero_frame.png"
          onError={() => setVideoError(true)}
          className="w-full h-auto"
        >
          <source src="/vh_hero_video.mp4" type="video/mp4" />
        </video>
      ) : (
        <img src="/vh_hero_frame.png" alt="VirtualHouse building scan" className="w-full h-auto" />
      )}
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
      {/* Bottom badges */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <span className="rounded-lg bg-card/90 border border-destructive/30 px-2.5 py-1 text-xs font-mono font-bold text-destructive">
          5 fremtidige avvik
        </span>
        <span className="rounded-lg bg-card/90 border border-border px-2.5 py-1 text-xs font-mono font-bold text-primary">
          17 520 timer simulert
        </span>
      </div>
    </div>
  );
}

/* ═══════ SECTION 1 — Hero (Story Hook) ═══════ */
function HeroSection() {
  return (
    <Section className="min-h-screen py-20 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,hsl(213_52%_63%/0.06),transparent)]" />

      {/* === THE HOOK: A story everyone in the industry recognizes === */}
      <FadeIn className="z-10 max-w-2xl text-center">
        <p className="mb-6 text-sm font-semibold uppercase tracking-widest text-primary">
          Tverrfaglig systemsimulering — prediktiv kvalitetssikring
        </p>

        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl leading-[1.1]">
          Se fremtidens avvik
          <br />
          <span className="text-primary">før bygget står</span>
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-lg text-muted-foreground">
          VirtualHouse simulerer samspillet mellom varme, ventilasjon og kjøling — og forutser feil som koster millioner å rette etter overlevering.
        </p>
      </FadeIn>

      {/* Product visual + CTA */}
      <FadeIn delay={0.3} className="z-10 mt-10 w-full max-w-2xl text-center">
        <HeroBuilding />

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" onClick={() => {
            document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth' });
          }} className="gap-2 px-8 py-5 text-base font-bold">
            Test ditt bygg nå
            <ArrowRight className="h-5 w-5" />
          </Button>
          <a href="mailto:post@virtualhouse.no" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors">
            Book en demo →
          </a>
        </div>
      </FadeIn>

      <motion.div
        className="absolute bottom-4 sm:bottom-10 z-10 flex flex-col items-center gap-2 text-muted-foreground"
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
          <p className="text-5xl font-extrabold font-mono tabular-nums text-destructive"><AnimatedNumber value={30} />%</p>
          <p className="mt-2 text-sm text-muted-foreground">av tekniske anlegg har konflikter mellom systemer</p>
        </div>
        <div>
          <p className="text-5xl font-extrabold font-mono tabular-nums text-destructive">15–25%</p>
          <p className="mt-2 text-sm text-muted-foreground">gjennomsnittlig merkostnad ved feil</p>
        </div>
        <div>
          <p className="text-5xl font-extrabold font-mono tabular-nums text-destructive">6–12 mnd</p>
          <p className="mt-2 text-sm text-muted-foreground">typisk tid for feilretting etter overlevering</p>
        </div>
      </FadeIn>
      {/* Visual: system conflict illustration */}
      <FadeIn delay={0.1} className="mx-auto mb-6 w-full max-w-2xl">
        <div className="rounded-xl overflow-hidden border border-border">
          <img src="/vh_conflict.png" alt="Systemkonflikt: varme og kjøling kolliderer" className="w-full h-auto" loading="lazy" />
        </div>
        <p className="mt-3 text-center text-sm text-primary font-semibold">VirtualHouse oppdager systemkonflikter før de koster millioner</p>
      </FadeIn>

      {/* Kompakt timeline — vertikal, én kolonne */}
      <FadeIn delay={0.2} className="mx-auto flex w-full max-w-lg flex-col items-center gap-0">
        <div className="w-full rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-vh-green">Prosjektering</h3>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">3–6 mnd</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Varme, ventilasjon, kjøling og automasjon prosjekteres — ofte av ulike rådgivere.</p>
        </div>
        <div className="mx-auto my-1 h-6 w-px bg-border" />
        <motion.div
          className="w-full rounded-xl border-2 border-destructive/40 bg-secondary/90 p-6 relative overflow-hidden"
          animate={{ boxShadow: ["0 0 20px -5px hsl(0, 84%, 60%, 0.2)", "0 0 40px -5px hsl(0, 84%, 60%, 0.4)", "0 0 20px -5px hsl(0, 84%, 60%, 0.2)"] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-foreground">Bygging</h3>
            <span className="rounded-full bg-destructive/15 px-3 py-1 text-xs font-bold text-destructive">12–18 mnd · 20–80 MNOK</span>
          </div>
          <p className="text-sm text-muted-foreground">...og du vet fortsatt ikke om det fungerer.</p>
        </motion.div>
        <div className="mx-auto my-1 h-6 w-px bg-border" />
        <div className="w-full rounded-xl border border-destructive/40 bg-destructive/5 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-destructive">Testing</h3>
            <span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-bold text-destructive">???</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Fungerer det? Først NÅ kan vi teste.</p>
        </div>
      </FadeIn>
    </section>
  );
}

/* ═══════ SECTION 3 — The Flip (visual transformation) ═══════ */
function TheFlipSection() {
  const transformRef = useRef<HTMLDivElement>(null);
  const inView = useInView(transformRef, { once: true, margin: "-100px" });
  const [timeText, setTimeText] = useState("12–18 mnd");

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setTimeText("3 minutter"), 800);
      return () => clearTimeout(timer);
    }
  }, [inView]);

  return (
    <Section className="min-h-screen py-24">
      <FadeIn className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Hva om du kunne se fremtiden?</h2>
        <p className="mt-3 text-muted-foreground">VirtualHouse simulerer samspillet mellom alle tekniske systemer — og forutser konflikter før de oppstår.</p>
      </FadeIn>

      {/* Process flow visual */}
      <FadeIn className="mx-auto mb-12 w-full max-w-3xl">
        <div className="rounded-xl overflow-hidden border border-border">
          <img src="/vh_process_flow.png" alt="Prosjektering → VirtualHouse → Verifisert" className="w-full h-auto" loading="lazy" />
        </div>
      </FadeIn>

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 mb-14">
        <FadeIn delay={0} className="w-full">
          <div className="rounded-xl border p-6 border-vh-green/40 bg-vh-green/5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-vh-green">Prosjektering</h3>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">3–6 måneder</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Samme grundige design — men nå med digital tvilling.</p>
          </div>
          <div className="mx-auto my-1 h-6 w-px bg-primary/30" />
        </FadeIn>

        <FadeIn delay={0.25} className="w-full">
          <motion.div
            ref={transformRef}
            className="rounded-xl border p-6"
            initial={{ borderColor: "hsl(218, 26%, 18%)", backgroundColor: "hsl(220, 20%, 14%)" }}
            animate={inView ? { borderColor: "hsl(213, 52%, 63%)", backgroundColor: "hsl(213, 52%, 63%, 0.1)" } : {}}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between">
              <motion.h3 className="text-lg font-bold" initial={{ color: "hsl(215, 20%, 55%)" }} animate={inView ? { color: "hsl(213, 52%, 63%)" } : {}} transition={{ duration: 1.2 }}>
                VirtualHouse Simulering
              </motion.h3>
              <motion.span className="rounded-full px-3 py-1 text-xs font-bold" initial={{ backgroundColor: "hsl(220, 20%, 20%)", color: "hsl(215, 20%, 55%)" }} animate={inView ? { backgroundColor: "hsl(213, 52%, 63%, 0.2)", color: "hsl(213, 52%, 63%)" } : {}} transition={{ duration: 0.8, delay: 0.6 }}>
                {timeText}
              </motion.span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">3 minutter. Alle systemer simulert sammen — slik de faktisk opererer.</p>
          </motion.div>
          <div className="mx-auto my-1 h-6 w-px bg-primary/30" />
        </FadeIn>

        <FadeIn delay={0.5} className="w-full">
          <div className="rounded-xl border p-6 border-vh-green/40 bg-vh-green/5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-vh-green">Verifisert resultat</h3>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">✅ Bekreftet</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Du VET at det fungerer. Før første spiker.</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.7} className="mt-6 text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/5 px-5 py-2">
            <span className="text-sm text-muted-foreground line-through">18 måneder</span>
            <ArrowRight className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-primary">3 minutter</span>
          </div>
        </FadeIn>
      </div>

      {/* How it works — 3-step visual */}
      <FadeIn delay={0.9} className="w-full">
        <p className="mb-6 text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest">Slik fungerer det</p>
        <HowItWorks />
      </FadeIn>
    </Section>
  );
}

/* ═══════ How It Works — 3-step visual process (DXC Input→Model→Output) ═══════ */
function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const steps = [
    {
      num: "01",
      title: "Last opp",
      desc: "Funksjonsbeskrivelse, systemskjema, eller manuell input",
      icon: <FileText className="h-6 w-6" />,
      color: "text-primary",
      items: ["PDF-dokument", "VVS-parametre", "Bygningsdata"],
    },
    {
      num: "02",
      title: "Simuler",
      desc: "ISO 13790-basert motor kjører 17 520 timer på sekunder",
      icon: <Zap className="h-6 w-6" />,
      color: "text-primary",
      items: ["Tverrfaglig analyse", "Systemsamspill", "24-mnd prognose"],
    },
    {
      num: "03",
      title: "Forutse",
      desc: "Fremtidige avvik, TEK17-sjekk, og konkrete tiltak",
      icon: <AlertTriangle className="h-6 w-6" />,
      color: "text-destructive",
      items: ["Avviksrapport", "Health Score", "Systemkonflikter"],
    },
  ];

  return (
    <div ref={ref} className="mx-auto max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.2, duration: 0.4 }}
            className="rounded-xl border border-border bg-card p-5 relative"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">{s.num}</span>
              <h3 className="text-base font-bold text-foreground">{s.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{s.desc}</p>
            <div className="space-y-1.5">
              {s.items.map((item, j) => (
                <div key={j} className="flex items-center gap-2 text-[10px]">
                  <span className={`h-1 w-1 rounded-full ${i === 2 ? "bg-destructive" : "bg-primary"}`} />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
            {/* Arrow to next step */}
            {i < 2 && (
              <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                <ArrowRight className="h-5 w-5 text-primary/40" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}


/* ═══════ Simulation Reveal Animation ═══════ */
function SimReveal({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [currentHour, setCurrentHour] = useState(0);
  const totalHours = 17520;
  const doneTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const duration = 2000;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(elapsed / duration, 1);
      setProgress(pct * 100);
      setCurrentHour(Math.round(pct * totalHours));
      if (pct < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        doneTimer.current = setTimeout(onDone, 200);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); clearTimeout(doneTimer.current); };
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto w-full max-w-2xl rounded-xl border border-primary/30 bg-card p-8 text-center"
    >
      <motion.div
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="mx-auto mb-6 w-16 h-16 rounded-xl border-2 border-primary bg-primary/10 flex items-center justify-center"
      >
        <Zap className="h-7 w-7 text-primary" />
      </motion.div>
      <p className="text-sm font-semibold text-foreground mb-2">Simulerer...</p>
      <p className="text-xs text-muted-foreground font-mono tabular-nums mb-4">
        time {currentHour.toLocaleString("nb-NO")} av {totalHours.toLocaleString("nb-NO")} (2 år)
      </p>
      <Progress value={progress} className="h-2" />
    </motion.div>
  );
}

/* ═══════ Animated counter ═══════ */
function AnimatedNumber({ value, duration = 800 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    setDisplay(0);
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const pct = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(pct * value));
      if (pct < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{display}</>;
}

/* ═══════ Health Score Gauge (DXC-inspired) ═══════ */
function HealthScoreGauge({ score }: { score: number }) {
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#ef4444";
  const textColor = score >= 80 ? "text-vh-green" : score >= 60 ? "text-vh-yellow" : "text-destructive";
  const label = score >= 80 ? "Godt dimensjonert" : score >= 60 ? "Forbedringspotensial" : "Kritiske avvik";
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="rounded-xl border border-border bg-card p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground text-center mb-6">Building Health Score</p>
      <div className="flex flex-col items-center">
        <div className="relative">
          <svg width="140" height="140" viewBox="0 0 140 140">
            {/* Background track */}
            <circle cx="70" cy="70" r="54" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
            {/* Colored arc */}
            <circle
              cx="70" cy="70" r="54" fill="none"
              stroke={color}
              strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 70 70)"
              style={{ filter: `drop-shadow(0 0 8px ${color}80)`, transition: 'stroke-dashoffset 0.8s ease-out' }}
            />
            {/* Inner glow circle */}
            <circle cx="70" cy="70" r="44" fill={`${color}08`} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-extrabold font-mono tabular-nums ${textColor}`}>{score}</span>
            <span className="text-[10px] text-muted-foreground">/100</span>
          </div>
        </div>
        <p className={`mt-4 text-base font-bold ${textColor}`}>{label}</p>
        <p className="mt-1 text-xs text-muted-foreground text-center max-w-[240px]">Basert på energi, komfort, TEK17 og systemvirkningsgrader</p>
      </div>
    </div>
  );
}

/* ═══════ Timeline Player Section (interactive time-travel) ═══════ */
function TimelinePlayerSection({ result, year2Result, input }: {
  result: ReturnType<typeof useSimResult>;
  year2Result: ReturnType<typeof useSimResult>;
  input: ReturnType<typeof useSimInput>["input"];
}) {
  const [timeMonth, setTimeMonth] = useState(0);

  // Interpolate building parameters based on timeline position
  const degradationT = Math.max(0, Math.min(1, (timeMonth - 12) / 12)); // 0 in year 1, 0→1 in year 2
  const liveTemp = input.heatingTurRetur[0] + degradationT * 5; // temp drifts up
  const liveSfp = input.sfpDesign * (1 + degradationT * 0.15);
  const liveRecovery = input.heatRecoveryEff * (1 - degradationT * 0.06);
  const liveCooling = input.installedCooling;

  // Generate events from simulation
  const events: Array<{ month: number; type: "critical" | "warning" | "info"; label: string }> = [];
  if (result.exceedsTEK17) events.push({ month: 0, type: "critical", label: "Over TEK17-ramme" });
  if (result.sfpActual > 1.5) events.push({ month: 1, type: "critical", label: `SFP ${result.sfpActual.toFixed(1)}` });
  if (result.hoursAbove26 > 30) {
    [5, 6, 7].forEach(m => events.push({ month: m, type: "warning", label: "Overtemperatur" }));
  }
  events.push({ month: 12, type: "info", label: "Gjenvinner -6%" });
  events.push({ month: 14, type: "warning", label: "SFP +15%" });
  if (year2Result.exceedsTEK17 && !result.exceedsTEK17) {
    events.push({ month: 18, type: "critical", label: "År 2: Over TEK17" });
  }

  return (
    <div className="space-y-4">
      <TimelinePlayer
        events={events}
        totalMonths={24}
        onMonthChange={setTimeMonth}
      />
      {/* Live building state at current timeline position */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2 text-center">Bygningsstatus måned {Math.round(timeMonth)}</p>
          <IsometricBuilding
            heatingTemp={liveTemp}
            sfpValue={liveSfp}
            recoveryEff={liveRecovery}
            coolingKw={liveCooling}
            className="w-full max-w-[280px] mx-auto"
          />
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2 text-center">Systemstatus måned {Math.round(timeMonth)}</p>
          <LiveSystemDiagram
            heatingTemp={liveTemp}
            sfpValue={liveSfp}
            recoveryEff={liveRecovery}
            coolingKw={liveCooling}
            className="w-full max-w-[320px] mx-auto"
          />
        </div>
      </div>
    </div>
  );
}

/* ═══════ Simulation Timeline (DXC-inspired) ═══════ */
function SimTimeline({ result, year2Result }: { result: ReturnType<typeof useSimResult>; year2Result: ReturnType<typeof useSimResult> }) {
  // Generate timeline events from simulation data
  const events: Array<{ month: number; type: "critical" | "warning" | "info"; label: string }> = [];

  // Find months where overheating occurs (summer)
  result.monthlyKwh.forEach((_, i) => {
    if (i >= 5 && i <= 8 && result.hoursAbove26 > 30) {
      events.push({ month: i, type: "warning", label: "Overtemperatur" });
    }
  });

  // TEK17 exceedance
  if (result.exceedsTEK17) {
    events.push({ month: 0, type: "critical", label: "Over TEK17-ramme" });
  }
  // SFP exceedance
  if (result.sfpActual > 1.5) {
    events.push({ month: 1, type: "critical", label: `SFP ${result.sfpActual.toFixed(1)}` });
  }
  // Year 2 degradation
  events.push({ month: 12, type: "info", label: "Gjenvinner -6%" });
  events.push({ month: 14, type: "warning", label: `SFP +15%` });
  if (year2Result.exceedsTEK17 && !result.exceedsTEK17) {
    events.push({ month: 18, type: "critical", label: "År 2: Over TEK17" });
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Prediktiv tidslinje — 24 måneders fremtidssimulering</p>

      {/* Timeline bar */}
      <div className="relative">
        {/* Track */}
        <div className="h-2 rounded-full bg-secondary w-full" />
        {/* Year 1 progress */}
        <div className="absolute top-0 left-0 h-2 rounded-l-full bg-primary/40 w-1/2" />
        {/* Year 2 progress (degraded) */}
        <div className="absolute top-0 left-1/2 h-2 rounded-r-full bg-vh-yellow/30 w-1/2" />

        {/* Event markers */}
        {events.map((e, i) => (
          <div
            key={i}
            className="absolute -top-1"
            style={{ left: `${(e.month / 24) * 100}%` }}
          >
            <div className={`h-4 w-4 rounded-full border-2 border-card ${
              e.type === "critical" ? "bg-destructive" : e.type === "warning" ? "bg-vh-yellow" : "bg-primary"
            }`} style={{ filter: e.type === "critical" ? "drop-shadow(0 0 4px hsl(0, 84%, 60%))" : undefined }} />
          </div>
        ))}

        {/* Year labels */}
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-muted-foreground">År 1</span>
          <span className="text-[10px] text-muted-foreground">|År 2</span>
          <span className="text-[10px] text-muted-foreground">24 mnd</span>
        </div>
      </div>

      {/* Event list */}
      <div className="mt-4 flex flex-wrap gap-2">
        {events.map((e, i) => (
          <span key={i} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
            e.type === "critical" ? "bg-destructive/10 text-destructive" :
            e.type === "warning" ? "bg-vh-yellow/10 text-vh-yellow" :
            "bg-primary/10 text-primary"
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${
              e.type === "critical" ? "bg-destructive" : e.type === "warning" ? "bg-vh-yellow" : "bg-primary"
            }`} />
            mnd {e.month + 1}: {e.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════ TEK17 Report Card ═══════ */
function TEK17ReportCard({ result: r }: { result: ReturnType<typeof useSimResult> }) {
  const checks = [
    {
      label: "Energiramme §14-2",
      value: `${Math.round(r.totalEnergyKwhM2)} kWh/m²·år`,
      limit: `≤ ${r.tek17Limit}`,
      pass: !r.exceedsTEK17,
    },
    {
      label: "SFP ventilasjon",
      value: `${r.sfpActual.toFixed(1)} kW/(m³/s)`,
      limit: "≤ 1.5",
      pass: r.sfpActual <= 1.5,
    },
    {
      label: "Varmegjenvinning",
      value: `${Math.round(r.heatRecoveryActual * 100)}%`,
      limit: "≥ 80%",
      pass: r.heatRecoveryActual >= 0.80,
    },
    {
      label: "Overtemperatur",
      value: `${r.hoursAbove26} timer >26°C`,
      limit: "≤ 50 t",
      pass: r.hoursAbove26 <= 50,
    },
  ];

  const passCount = checks.filter(c => c.pass).length;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">TEK17 Compliance</p>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${passCount === checks.length ? "bg-vh-green/15 text-vh-green" : "bg-destructive/15 text-destructive"}`}>
          {passCount}/{checks.length} bestått
        </span>
      </div>
      <div className="space-y-2">
        {checks.map((c, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg bg-secondary/30 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className={`text-sm ${c.pass ? "text-vh-green" : "text-destructive"}`}>
                {c.pass ? "✓" : "✗"}
              </span>
              <span className="text-sm text-foreground">{c.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono tabular-nums text-muted-foreground">{c.limit}</span>
              <span className={`text-xs font-mono tabular-nums font-bold ${c.pass ? "text-vh-green" : "text-destructive"}`}>{c.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════ Avvik Preview ═══════ */
function AvvikPreview({ avvik }: { avvik: Array<{ nr: number; system: string; severity: string; title: string; description: string }> }) {
  const navigate = useNavigate();
  const shown = avvik.slice(0, 2);
  const remaining = avvik.length - 2;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Prediktiv avviksrapport</p>
        <span className="rounded-full bg-destructive/15 px-2.5 py-0.5 text-xs font-bold text-destructive">
          {avvik.length} avvik funnet
        </span>
      </div>
      <div className="space-y-3">
        {shown.map((a, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3">
            <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
              a.severity === "critical" ? "bg-destructive" : a.severity === "warning" ? "bg-vh-yellow" : "bg-vh-green"
            }`} />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-muted-foreground">{a.system}</span>
                <span className={`text-[10px] font-bold uppercase ${
                  a.severity === "critical" ? "text-destructive" : a.severity === "warning" ? "text-vh-yellow" : "text-vh-green"
                }`}>{a.severity}</span>
              </div>
              <p className="text-sm font-semibold text-foreground mt-0.5">{a.title}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.description}</p>
            </div>
          </div>
        ))}
      </div>
      {remaining > 0 && (
        <button
          onClick={() => navigate("/simulator/simulering")}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
        >
          Se alle {avvik.length} forutsette avvik i full rapport
          <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/* ═══════ System Conflicts (cross-disciplinary) ═══════ */
function SystemConflicts({ result }: { result: ReturnType<typeof useSimResult> }) {
  const { input } = useSimInput();
  const conflicts: Array<{ systems: [string, string]; issue: string; impact: string; severity: "critical" | "warning" }> = [];

  // Simultaneous heating + cooling
  if (result.coolingKwhM2 > 5 && result.heatingKwhM2 > 20) {
    conflicts.push({
      systems: ["32 Varme", "37 Kjøling"],
      issue: "Samtidig oppvarming og kjøling i mellomsesongen",
      impact: `Estimert energitap: ${Math.round(Math.min(result.coolingKwhM2, result.heatingKwhM2) * 0.3)} kWh/m²·år`,
      severity: "critical",
    });
  }
  // SFP + heat recovery conflict
  if (result.sfpActual > 1.5 && result.heatRecoveryActual < 0.80) {
    conflicts.push({
      systems: ["36 Ventilasjon", "36 Gjenvinner"],
      issue: "Høy vifteeffekt kompenserer for lav varmegjenvinning",
      impact: `SFP ${result.sfpActual.toFixed(1)} + gjenvinner ${Math.round(result.heatRecoveryActual * 100)}% = dobbel energilekkasje`,
      severity: "critical",
    });
  }
  // Overheating + underdimensioned cooling
  if (result.hoursAbove26 > 50) {
    conflicts.push({
      systems: ["37 Kjøling", "32 Internlast"],
      issue: "Kjølekapasitet dekker ikke intern- og solbelastning",
      impact: `${result.hoursAbove26} timer overtemperatur — redusert produktivitet og klager`,
      severity: "warning",
    });
  }
  // Low recovery + cold climate
  if (result.heatRecoveryActual < 0.75) {
    conflicts.push({
      systems: ["36 Gjenvinner", "32 Varme"],
      issue: "Lav gjenvinning tvinger varmesystemet til å kompensere",
      impact: `${Math.round((input.heatRecoveryEff - result.heatRecoveryActual) * 100)}% tap i gjenvinner = ${Math.round(result.heatingKwhM2 * 0.15)} kWh/m² ekstra oppvarming`,
      severity: "warning",
    });
  }

  if (conflicts.length === 0) return null;

  return (
    <div className="rounded-xl border border-primary/30 bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Systemkonflikter oppdaget</p>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
          {conflicts.length} kryssvirkninger
        </span>
      </div>
      <div className="space-y-3">
        {conflicts.map((c, i) => (
          <div key={i} className="rounded-lg border border-border bg-secondary/20 p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className={`h-2 w-2 rounded-full ${c.severity === "critical" ? "bg-destructive" : "bg-vh-yellow"}`} />
              <span className="text-[10px] font-mono text-primary">{c.systems[0]}</span>
              <span className="text-[10px] text-muted-foreground">×</span>
              <span className="text-[10px] font-mono text-primary">{c.systems[1]}</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{c.issue}</p>
            <p className="text-xs text-muted-foreground mt-1">{c.impact}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[10px] text-muted-foreground text-center">
        Konflikter mellom systemer er den vanligste årsaken til at bygg ikke fungerer som planlagt. VirtualHouse simulerer samspillet — ikke bare de individuelle systemene.
      </p>
    </div>
  );
}

/* ═══════ Share Results ═══════ */
function ShareResults({ result, input }: { result: ReturnType<typeof useSimResult>; input: ReturnType<typeof useSimInput>["input"] }) {
  const [copied, setCopied] = useState(false);
  const buildingLabel = input.bra === 6000 ? "Kontor" : input.bra === 8000 ? "Skole" : input.bra === 12000 ? "Sykehus" : "Bygg";

  const handleShare = async () => {
    const text = `VirtualHouse simulering — ${buildingLabel} ${input.bra.toLocaleString("nb-NO")} m²

Building Health Score: ${result.healthScore}/100
Energibehov: ${Math.round(result.totalEnergyKwhM2)} kWh/m²·år
TEK17: ${result.exceedsTEK17 ? "IKKE BESTÅTT" : "Bestått"}
Avvik funnet: ${result.avvik.length}
Årskostnad: NOK ${Math.round(result.annualCostNOK).toLocaleString("nb-NO")}

Kjør din egen simulering: https://virtualhouse.no`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <button
      onClick={handleShare}
      className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
    >
      {copied ? (
        <><Copy className="h-4 w-4 text-vh-green" /> Kopiert til utklippstavlen</>
      ) : (
        <><Share2 className="h-4 w-4" /> Del simuleringsresultatene</>
      )}
    </button>
  );
}

/* ═══════ SECTION 4 — Interactive Simulator ═══════ */
function SimulatorSection() {
  const navigate = useNavigate();
  const { input, updateInput } = useSimInput();
  const result = useSimResult();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [simState, setSimState] = useState<"idle" | "simulating" | "done">("idle");

  const year2Result = useMemo(() => {
    return runSimulation({
      ...input,
      // År 2: ytterligere slitasje på gjenvinner og COP.
      // SFP beholdes uendret — motoren legger allerede til 15% degradering.
      heatRecoveryEff: input.heatRecoveryEff * 0.94,  // 6% ekstra degradering fra år 1
      sfpDesign: input.sfpDesign,                      // IKKE dobbeldegrader
      cop: input.cop * 0.95,                           // 5% COP-tap fra slitasje
    });
  }, [input]);

  const handleSelectType = (type: typeof buildingTypes[number]) => {
    setSelectedType(type.id);
    updateInput("bra", type.bra);
    setSimState("idle");
  };

  const handleSimulate = () => setSimState("simulating");
  const handleRevealDone = useCallback(() => setSimState("done"), []);

  return (
    <Section className="min-h-screen py-24" id="simulator">
      <FadeIn className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Kjør en simulering på ditt eget bygg</h2>
        <p className="mt-3 text-muted-foreground">3 steg. 3 minutter. Se fremtidige avvik før de oppstår.</p>
      </FadeIn>

      {/* Progress stepper */}
      <FadeIn className="mx-auto mb-8 flex items-center justify-center gap-2 text-xs font-medium">
        {["Velg bygg", "Juster parametere", "Se resultater"].map((label, i) => {
          const step = !selectedType ? 0 : simState === "done" ? 2 : selectedType ? 1 : 0;
          const isActive = i <= step;
          return (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}>{i + 1}</div>
              <span className={isActive ? "text-foreground" : "text-muted-foreground"}>{label}</span>
              {i < 2 && <div className={`h-px w-8 ${isActive ? "bg-primary" : "bg-border"}`} />}
            </div>
          );
        })}
      </FadeIn>

      {/* Location selector */}
      <FadeIn className="mx-auto mb-4 flex items-center justify-center gap-2">
        <span className="text-xs text-muted-foreground">Klimasone:</span>
        {(["oslo", "bergen", "trondheim"] as const).map((loc) => (
          <button
            key={loc}
            onClick={() => updateInput("location", loc)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              input.location === loc ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {loc.charAt(0).toUpperCase() + loc.slice(1)}
          </button>
        ))}
      </FadeIn>

      {/* building type cards */}
      <FadeIn className="mx-auto mb-10 grid w-full max-w-2xl grid-cols-1 sm:grid-cols-3 gap-4">
        {buildingTypes.map((bt) => (
          <button
            key={bt.id}
            onClick={() => handleSelectType(bt)}
            className={`group flex flex-col items-center gap-3 rounded-xl border p-6 transition-all ${
              selectedType === bt.id
                ? "border-primary bg-primary/10 vh-glow-blue"
                : "border-border bg-card hover:border-primary/40"
            }`}
          >
            <bt.icon className={`h-8 w-8 ${selectedType === bt.id ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
            <span className="text-sm font-semibold">{bt.label}</span>
            <span className="text-xs text-muted-foreground">{bt.bra.toLocaleString("nb-NO")} m²</span>
          </button>
        ))}
      </FadeIn>

      {/* sliders + live building */}
      {selectedType && (
        <FadeIn className="mx-auto w-full max-w-4xl">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Left: sliders */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <SliderField icon={<Thermometer className="h-4 w-4 text-destructive" />} label="Radiatortemperatur" tooltip="Vanntemperatur til radiatorer. Høyere = mer energi til oppvarming, men også høyere tap." value={input.heatingTurRetur[0]} min={40} max={70} step={1} unit="°C" onChange={(v) => updateInput("heatingTurRetur", [v, input.heatingTurRetur[1]])} />
                <div>
                  <SliderField icon={<Wind className="h-4 w-4 text-primary" />} label="Ventilasjonskraft" tooltip="Spesifikk vifteeffekt — hvor mye strøm viftene bruker for å flytte luften. Lavere = bedre." value={input.sfpDesign} min={0.8} max={2.5} step={0.1} unit="SFP" onChange={(v) => updateInput("sfpDesign", v)} />
                  <p className={`mt-1 text-[10px] font-mono ${input.sfpDesign * 1.15 > 1.5 ? "text-destructive" : "text-vh-green"}`}>
                    Reell SFP: {(input.sfpDesign * 1.15).toFixed(1)} kW/(m³/s) {input.sfpDesign * 1.15 > 1.5 ? "— Over TEK17" : "✔"}
                  </p>
                </div>
                <SliderField icon={<RefreshCw className="h-4 w-4 text-vh-green" />} label="Gjenvinning av varme" tooltip="Hvor mye varme som gjenvinnes fra avtrekksluften. Høyere = mindre oppvarmingsbehov. TEK17 krever ≥80%." value={Math.round(input.heatRecoveryEff * 100)} min={50} max={95} step={1} unit="%" onChange={(v) => updateInput("heatRecoveryEff", v / 100)} />
                <SliderField icon={<Snowflake className="h-4 w-4 text-primary" />} label="Kjølekapasitet" tooltip="Total kjølekapasitet i bygget. Må dekke sol- og internbelastning for å unngå overtemperatur." value={input.installedCooling} min={100} max={600} step={10} unit="kW" onChange={(v) => updateInput("installedCooling", v)} />
              </div>
              <div className="mt-8 flex justify-center">
                <Button size="lg" onClick={handleSimulate} className="gap-2 px-8 text-base" disabled={simState === "simulating"}>
                  <Zap className="h-5 w-5" />
                  Simuler 2 år
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Right: live-reactive visualizations */}
            <div className="flex flex-col items-center justify-center gap-4 order-first md:order-last">
              <IsometricBuilding
                heatingTemp={input.heatingTurRetur[0]}
                sfpValue={input.sfpDesign}
                recoveryEff={input.heatRecoveryEff}
                coolingKw={input.installedCooling}
                className="w-full max-w-[360px]"
              />
              <LiveSystemDiagram
                heatingTemp={input.heatingTurRetur[0]}
                sfpValue={input.sfpDesign}
                recoveryEff={input.heatRecoveryEff}
                coolingKw={input.installedCooling}
                className="max-w-[400px]"
              />
            </div>
          </div>
        </FadeIn>
      )}

      {/* Simulation reveal */}
      {simState === "simulating" && (
        <div className="mt-8">
          <SimReveal onDone={handleRevealDone} />
        </div>
      )}

      {/* results — Year 1 vs Year 2 with staggered reveal */}
      {simState === "done" && (
        <div className="mx-auto mt-8 w-full max-w-4xl space-y-6">
          {/* Report header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-primary/30 bg-primary/5 p-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">Prediktiv simuleringsrapport</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {input.bra === 6000 ? "Kontor" : input.bra === 8000 ? "Skole" : "Sykehus"} · {input.bra.toLocaleString("nb-NO")} m² · {input.location.charAt(0).toUpperCase() + input.location.slice(1)} · 17 520 timer simulert
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                  result.healthScore >= 80 ? "bg-vh-green/15 text-vh-green" : result.healthScore >= 60 ? "bg-vh-yellow/15 text-vh-yellow" : "bg-destructive/15 text-destructive"
                }`}>Score: {result.healthScore}/100</span>
                <span className="rounded-full bg-destructive/15 px-3 py-1 text-xs font-bold text-destructive">{result.avvik.length} avvik</span>
              </div>
            </div>
          </motion.div>

          {/* System Vitals Bar (DXC-inspired) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="rounded-xl border border-border bg-card p-3">
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {[
                  { label: "SFP", value: result.sfpActual.toFixed(1), unit: "kW/(m³/s)", warn: result.sfpActual > 1.5 },
                  { label: "GGV", value: `${Math.round(result.heatRecoveryActual * 100)}`, unit: "%", warn: result.heatRecoveryActual < 0.76 },
                  { label: "CO₂", value: `${result.avgCO2ppm}`, unit: "ppm", warn: result.avgCO2ppm > 800 },
                  { label: "RF", value: `${result.avgRHwinter}`, unit: "%", warn: result.avgRHwinter < 20 },
                  { label: ">26°C", value: `${result.hoursAbove26}`, unit: "timer", warn: result.hoursAbove26 > 50 },
                  { label: "CO₂e", value: `${result.co2Tonnes}`, unit: "tonn/år", warn: false },
                ].map((v, i) => (
                  <div key={i} className="text-center">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">{v.label}</p>
                    <p className={`text-lg font-extrabold font-mono tabular-nums ${v.warn ? "text-destructive" : "text-foreground"}`}>{v.value}</p>
                    <p className="text-[8px] text-muted-foreground">{v.unit}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0 }}>
              <h3 className="mb-3 text-center text-sm font-bold text-vh-green">År 1</h3>
              <SimResults result={result} animate />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
              <h3 className="mb-3 text-center text-sm font-bold text-vh-yellow">År 2 <span className="font-normal text-muted-foreground">(med slitasje)</span></h3>
              <SimResults result={year2Result} />
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.8 }}>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="mb-2 text-xs font-semibold text-muted-foreground text-center">Endring År 1 → År 2</p>
              <div className="flex flex-wrap justify-center gap-4">
                <DeltaChip label="Energi" v1={result.totalEnergyKwhM2} v2={year2Result.totalEnergyKwhM2} unit="kWh/m²" />
                <DeltaChip label="Kostnad" v1={result.annualCostNOK} v2={year2Result.annualCostNOK} unit="NOK" />
                <DeltaChip label="Timer >26°C" v1={result.hoursAbove26} v2={year2Result.hoursAbove26} unit="t" />
              </div>
            </div>
          </motion.div>

          {/* Indoor Climate Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.9 }}>
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Inneklima (NS-EN 16798)</p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className={`text-2xl font-extrabold font-mono tabular-nums ${result.avgCO2ppm > 800 ? "text-vh-yellow" : "text-vh-green"}`}>{result.avgCO2ppm}</p>
                  <p className="text-[10px] text-muted-foreground">CO₂ ppm snitt</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{result.avgCO2ppm <= 800 ? "Kategori II ✔" : "Over anbefalt"}</p>
                </div>
                <div>
                  <p className={`text-2xl font-extrabold font-mono tabular-nums ${result.hoursAbove26 > 50 ? "text-destructive" : "text-vh-green"}`}>{result.hoursAbove26}</p>
                  <p className="text-[10px] text-muted-foreground">timer over 26°C</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{result.hoursAbove26 <= 50 ? "Innenfor krav" : "Overtemperatur"}</p>
                </div>
                <div>
                  <p className={`text-2xl font-extrabold font-mono tabular-nums ${result.avgRHwinter < 20 ? "text-vh-yellow" : "text-vh-green"}`}>{result.avgRHwinter}%</p>
                  <p className="text-[10px] text-muted-foreground">RF vinter</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{result.avgRHwinter >= 20 ? "Akseptabelt" : "Tørr luft"}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 24-month energy curve */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.95 }}>
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">24-måneders energiprognose (år 1 + år 2 med slitasje)</p>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    ...result.monthlyKwh.map((v, i) => ({ mnd: MONTH_LABELS[i], yr1: Math.round(v), yr2: 0 })),
                    ...year2Result.monthlyKwh.map((v, i) => ({ mnd: MONTH_LABELS[i] + "\u2019", yr1: 0, yr2: Math.round(v) })),
                  ]}>
                    <XAxis dataKey="mnd" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 7 }} axisLine={false} tickLine={false} interval={1} />
                    <Bar dataKey="yr1" fill="hsl(213, 52%, 63%)" radius={[2, 2, 0, 0]} name="År 1" />
                    <Bar dataKey="yr2" fill="hsl(38, 92%, 55%)" radius={[2, 2, 0, 0]} name="År 2" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-[9px] text-muted-foreground"><span className="h-2 w-2 rounded-sm bg-primary" />År 1</span>
                <span className="flex items-center gap-1.5 text-[9px] text-muted-foreground"><span className="h-2 w-2 rounded-sm" style={{background: "hsl(38, 92%, 55%)"}} />År 2 (slitasje)</span>
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground text-center">
                År 2 viser {Math.round(((year2Result.totalEnergyKwhM2 - result.totalEnergyKwhM2) / result.totalEnergyKwhM2) * 100)}% økning grunnet slitasje på gjenvinner (-6%) og ventilasjon (+15% SFP)
              </p>
            </div>
          </motion.div>

          {/* Building Health Score */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 1.0 }}>
            <HealthScoreGauge score={result.healthScore} />
          </motion.div>

          {/* Interactive Timeline Player */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 1.05 }}>
            <TimelinePlayerSection result={result} year2Result={year2Result} input={input} />
          </motion.div>

          {/* TEK17 Report Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 1.1 }}>
            <TEK17ReportCard result={result} />
          </motion.div>

          {/* Avvik preview */}
          {result.avvik.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 1.2 }}>
              <AvvikPreview avvik={result.avvik} />
            </motion.div>
          )}

          {/* System Conflicts */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 1.35 }}>
            <SystemConflicts result={result} />
          </motion.div>

          {/* Share results */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 1.4 }}>
            <ShareResults result={result} input={input} />
          </motion.div>
        </div>
      )}
    </Section>
  );
}

function DeltaChip({ label, v1, v2, unit }: { label: string; v1: number; v2: number; unit: string }) {
  const delta = v2 - v1;
  const isWorse = delta > 0;
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs">
      <span className="text-muted-foreground">{label}</span>
      {isWorse ? <TrendingUp className="h-3 w-3 text-destructive" /> : <TrendingDown className="h-3 w-3 text-vh-green" />}
      <span className={`font-mono font-bold tabular-nums ${isWorse ? "text-destructive" : "text-vh-green"}`}>
        {delta > 0 ? "+" : ""}{Math.round(delta)} {unit}
      </span>
    </div>
  );
}

function SliderField({
  icon, label, tooltip, value, min, max, step, unit, onChange,
}: {
  icon: React.ReactNode; label: string; tooltip: string;
  value: number; min: number; max: number; step: number; unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 cursor-help">
              {icon}
              <span className="text-sm font-medium">{label}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
        <span className="text-sm font-mono font-bold tabular-nums text-primary">
          {typeof value === "number" && value % 1 !== 0 ? value.toFixed(1) : value} {unit}
        </span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v)} />
    </div>
  );
}

function MiniBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-20 text-right text-muted-foreground">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${(value / max) * 100}%` }} />
      </div>
      <span className="w-8 font-mono tabular-nums text-muted-foreground">{Math.round(value)}</span>
    </div>
  );
}

function SimResults({ result: r, animate }: { result: ReturnType<typeof useSimResult>; animate?: boolean }) {
  const getEnergimerke = (v: number) => (v > 150 ? "D" : v > 130 ? "C" : v > 100 ? "B" : "A");
  const merke = getEnergimerke(r.totalEnergyKwhM2);
  const merkeColor = merke === "A" ? "text-vh-green" : merke === "B" ? "text-vh-green" : merke === "C" ? "text-vh-yellow" : "text-destructive";

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[
        <div key="energy" className={`rounded-xl border bg-card p-5 text-center ${r.exceedsTEK17 ? "border-destructive" : "border-border"}`}>
          <p className="text-xs text-muted-foreground">Energibehov</p>
          <p className="mt-1 text-3xl font-bold font-mono tabular-nums">
            {animate ? <AnimatedNumber value={Math.round(r.totalEnergyKwhM2)} /> : Math.round(r.totalEnergyKwhM2)}
          </p>
          <p className="text-xs text-muted-foreground">kWh/m²·år</p>
          <span className={`mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-bold ${r.exceedsTEK17 ? "bg-destructive/15 text-destructive" : "bg-vh-green/15 text-vh-green"}`}>
            {r.exceedsTEK17 ? "Over TEK17" : "Under TEK17 ✅"}
          </span>
        </div>,
        <div key="comfort" className="rounded-xl border border-border bg-card p-5 text-center">
          <p className="text-xs text-muted-foreground">Komfort</p>
          <p className="mt-1 text-3xl font-bold font-mono tabular-nums">{r.hoursAbove26}</p>
          <p className="text-xs text-muted-foreground">timer over 26°C</p>
          <span className={`mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-bold ${r.hoursAbove26 > 50 ? "bg-vh-yellow/15 text-vh-yellow" : "bg-vh-green/15 text-vh-green"}`}>
            {r.hoursAbove26 > 50 ? "Overtemperatur" : "OK ✅"}
          </span>
        </div>,
        <div key="merke" className="rounded-xl border border-border bg-card p-5 text-center">
          <p className="text-xs text-muted-foreground">Energimerke</p>
          <p className={`mt-1 text-5xl font-extrabold ${merkeColor}`}>{merke}</p>
          <span className={`mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-bold ${merke <= "B" ? "bg-vh-green/15 text-vh-green" : "bg-vh-yellow/15 text-vh-yellow"}`}>
            {merke <= "B" ? "Grønt lån ✅" : "Krever forbedring"}
          </span>
        </div>,
        <div key="breakdown" className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs text-muted-foreground text-center mb-3">Energifordeling</p>
          <div className="space-y-1.5">
            <MiniBar label="Oppvarming" value={r.heatingKwhM2} max={r.totalEnergyKwhM2} color="bg-destructive" />
            <MiniBar label="Vifter" value={r.fansKwhM2} max={r.totalEnergyKwhM2} color="bg-vh-purple" />
            <MiniBar label="Kjøling" value={r.coolingKwhM2} max={r.totalEnergyKwhM2} color="bg-primary" />
            <MiniBar label="Annet" value={r.lightingKwhM2 + r.equipmentKwhM2 + r.dhwKwhM2} max={r.totalEnergyKwhM2} color="bg-muted-foreground" />
          </div>
        </div>,
      ].map((card, i) => (
        animate ? (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2, duration: 0.4 }}>
            {card}
          </motion.div>
        ) : <div key={i}>{card}</div>
      ))}
    </div>
  );
}

/* ═══════ SECTION 5 — Advanced insights ═══════ */
function AdvancedSection() {
  const { input, updateInput } = useSimInput();
  const result = useSimResult();
  const [toggles, setToggles] = useState({ seasons: false, wear: false, simultaneous: false });

  // Lagre brukerens opprinnelige verdier (ikke hardkodet)
  const baseEffRef = useRef(input.heatRecoveryEff);
  const baseSfpRef = useRef(input.sfpDesign);

  const handleToggle = (key: keyof typeof toggles) => {
    const next = { ...toggles, [key]: !toggles[key] };
    setToggles(next);
    if (key === "wear") {
      if (!next.wear) {
        updateInput("heatRecoveryEff", baseEffRef.current);
        updateInput("sfpDesign", baseSfpRef.current);
      } else {
        updateInput("heatRecoveryEff", baseEffRef.current * 0.94);
        updateInput("sfpDesign", baseSfpRef.current * 1.15);
      }
    }
  };

  const monthlyData = result.monthlyKwh.map((v, i) => ({ mnd: MONTH_LABELS[i], kwh: Math.round(v) }));

  return (
    <Section className="py-20" id="avvik">
      <FadeIn className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Men bygget ditt lever ikke i et laboratorium</h2>
        <p className="mt-3 text-muted-foreground">Simuleringen viser ideelle forhold. Virkeligheten bringer slitasje, årstider og uforutsette belastninger — se hva som skjer når vi simulerer det også.</p>
      </FadeIn>

      <FadeIn className="mx-auto mb-8 flex flex-wrap justify-center gap-3">
        {([
          { key: "seasons" as const, label: "Årstidsvariasjoner" },
          { key: "wear" as const, label: "Slitasje over 2 år" },
          { key: "simultaneous" as const, label: "Samtidig varme/kjøle" },
        ]).map((t) => (
          <button
            key={t.key}
            onClick={() => handleToggle(t.key)}
            className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${
              toggles[t.key] ? "border-primary bg-primary/15 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/40"
            }`}
          >
            {toggles[t.key] ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
            {t.label}
          </button>
        ))}
      </FadeIn>

      {/* Live system visualizations showing toggle effects */}
      <FadeIn className="mx-auto mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
        <IsometricBuilding
          heatingTemp={toggles.wear ? 70 : input.heatingTurRetur[0]}
          sfpValue={toggles.wear ? input.sfpDesign * 1.15 : input.sfpDesign}
          recoveryEff={toggles.wear ? input.heatRecoveryEff * 0.94 : input.heatRecoveryEff}
          coolingKw={toggles.simultaneous ? input.installedCooling * 1.5 : input.installedCooling}
          className="w-full"
        />
        <LiveSystemDiagram
          heatingTemp={toggles.wear ? 70 : input.heatingTurRetur[0]}
          sfpValue={toggles.wear ? input.sfpDesign * 1.15 : input.sfpDesign}
          recoveryEff={toggles.wear ? input.heatRecoveryEff * 0.94 : input.heatRecoveryEff}
          coolingKw={toggles.simultaneous ? input.installedCooling * 1.5 : input.installedCooling}
        />
      </FadeIn>

      <FadeIn className="mx-auto w-full max-w-2xl space-y-4">
        <SimResults result={result} />

        {toggles.seasons && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-xl border border-border bg-card p-5">
            <p className="mb-3 text-sm font-semibold text-foreground">Månedlig energifordeling</p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis dataKey="mnd" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Bar dataKey="kwh" fill="hsl(213, 52%, 63%)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Vintermånedene bruker opptil 3× mer energi enn sommeren — drevet av oppvarmingsbehov.</p>
          </motion.div>
        )}

        {toggles.simultaneous && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm font-semibold text-destructive">Samtidig varme og kjøling</p>
                <p className="text-xs text-muted-foreground">
                  Systemet varmer og kjøler samtidig i mellomsesongen. Estimert sløsing:{" "}
                  <span className="font-bold text-destructive">NOK {Math.round(Math.min(result.coolingKwhM2, result.heatingKwhM2) * input.bra * 1.33 * 0.15).toLocaleString("nb-NO")}/år</span>.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {toggles.wear && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-xl border border-vh-yellow/30 bg-vh-yellow/5 p-5">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-vh-yellow" />
              <div>
                <p className="text-sm font-semibold text-vh-yellow">Slitasje-effekt</p>
                <p className="text-xs text-muted-foreground">
                  Gjenvinner virkningsgrad redusert med 6%. SFP økt med 15%. Energibehovet stiger tilsvarende.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </FadeIn>
    </Section>
  );
}

/* ═══════ FAQ / Objection Handling ═══════ */
function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    {
      q: "Hvor nøyaktig er simuleringen?",
      a: "Motoren er basert på ISO 13790 forenklet timesmetode med 8 760 timers klimadata (1991–2020 normaler). For tidligfase kvalitetssikring gir dette typisk ±10–20% avvik fra fullskala IDA-ICE/SIMIEN. Formålet er å fange systemkonflikter og dimensjoneringsfeil tidlig — ikke å erstatte den formelle NS 3031-beregningen.",
    },
    {
      q: "Kan jeg bruke dette på et reelt prosjekt?",
      a: "Ja. Last opp en funksjonsbeskrivelse i PDF eller bruk manuell input. VirtualHouse analyserer systemoppbygning, dimensjonering og regulering — og genererer en avviksrapport med NS 3451-koder som kan legges rett inn i prosjektets kvalitetssystem.",
    },
    {
      q: "Hva skiller VirtualHouse fra SIMIEN eller IDA-ICE?",
      a: "SIMIEN og IDA-ICE er detaljerte energisimuleringsprogram for NS 3031-beregninger. VirtualHouse er et kvalitetssikringsverktøy som kjører på minutter, ikke uker. Vi erstatter ikke energiberegningen — vi fanger feil før den starter.",
    },
    {
      q: "Hva koster det?",
      a: "Fra 4 900 kr/mnd for Verify-pakken (enkeltprosjekt). Optimize-pakken med parameterstudie og ESG-rapport er 12 900 kr/mnd. Enterprise-avtaler for portefolio — kontakt oss.",
    },
    {
      q: "Trenger jeg teknisk kompetanse for å bruke det?",
      a: "Grunnleggende VVS-forståelse er en fordel, men ikke et krav. Simulatoren veileder deg gjennom parametrene, og resultatene presenteres med klare anbefalt/ikke-anbefalt-indikatorer.",
    },
    {
      q: "Hvilke standarder og referanser brukes?",
      a: "Beregningsmetode: ISO 13790 forenklet timesmetode. Klimadata: met.no 1991–2020 normaler. Energiramme: TEK17 §14-2. SFP-krav: TEK17 §14-2. Inneklima: NS-EN 16798-1:2019. Systemklassifisering: NS 3451:2022. CO₂-faktor: NVE 2024 (norsk nett). Alle beregninger med 8 760 timers oppløsning.",
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
function CTASection() {
  const navigate = useNavigate();
  const result = useSimResult();
  const { input } = useSimInput();
  const segments = ["Totalentreprenører", "Rådgivende ingeniører", "Eiendomsforvaltere", "Byggherrer", "FM-selskaper"];
  const hasResult = result.totalEnergyKwhM2 > 0;
  const buildingLabel = input.bra === 6000 ? "Kontor" : input.bra === 8000 ? "Skole" : input.bra === 12000 ? "Sykehus" : "Bygg";

  return (
    <Section className="py-24">
      {/* Personalized summary — only if simulation has been run */}
      {hasResult && (() => {
        const savingsLow = Math.round(result.annualCostNOK * 0.15);
        const savingsHigh = Math.round(result.annualCostNOK * 0.25);
        return (
          <FadeIn className="mx-auto mb-10 w-full max-w-lg rounded-xl border border-primary/30 bg-primary/5 px-6 py-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Din simulering — {buildingLabel} {input.bra.toLocaleString("nb-NO")} m²</p>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-2xl font-extrabold font-mono tabular-nums text-foreground">{Math.round(result.totalEnergyKwhM2)}</p>
                <p className="text-[10px] text-muted-foreground">kWh/m²·år</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold font-mono tabular-nums text-foreground">{result.healthScore}</p>
                <p className="text-[10px] text-muted-foreground">Health Score</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold font-mono tabular-nums text-destructive">{result.avvik.length}</p>
                <p className="text-[10px] text-muted-foreground">avvik funnet</p>
              </div>
            </div>
            <div className="rounded-lg bg-primary/10 px-4 py-3">
              <p className="text-xs text-muted-foreground">Estimert besparelse med VirtualHouse-optimalisering:</p>
              <p className="text-lg font-bold text-primary mt-1">
                NOK {savingsLow.toLocaleString("nb-NO")} – {savingsHigh.toLocaleString("nb-NO")} / år
              </p>
            </div>
          </FadeIn>
        );
      })()}

      {/* Before/After visual */}
      <FadeIn className="mx-auto mb-10 w-full max-w-2xl">
        <div className="rounded-xl overflow-hidden border border-border">
          <img src="/vh_before_after.png" alt="Uten simulering vs med VirtualHouse" className="w-full h-auto" loading="lazy" />
        </div>
      </FadeIn>

      <FadeIn className="text-center max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          Hvert bygg har fremtidige avvik. Spørsmålet er om du finner dem nå — eller etter overlevering
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-lg text-muted-foreground">
          VirtualHouse har allerede funnet feil verdt <span className="font-bold text-foreground">NOK 12.4 millioner</span> i norske næringsbygg. Hva skjuler seg i ditt?
        </p>
        <div className="mt-10">
          <Button size="lg" onClick={() => navigate("/simulator")} className="w-full sm:w-auto gap-3 px-10 py-6 text-lg font-bold">
            Test ditt prosjekt gratis
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Fra <span className="font-bold text-foreground">4 900 kr/mnd</span> · Enterprise eller storvolum?{" "}
          <a href="mailto:post@virtualhouse.no" className="font-medium text-primary underline underline-offset-4">
            Kontakt oss
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
