import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
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
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { useSimInput, useSimResult } from "@/lib/SimContext";
import { runSimulation } from "@/lib/simulationEngine";
import { ResponsiveContainer, BarChart, Bar, XAxis } from "recharts";
import IsometricBuilding from "@/components/IsometricBuilding";

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
          <a href="#faser" className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors">Leveranser</a>
          {hasResult && (
            <span className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
              result.healthScore >= 80 ? "bg-vh-green/15 text-vh-green" : result.healthScore >= 60 ? "bg-vh-yellow/15 text-vh-yellow" : "bg-destructive/15 text-destructive"
            }`}>
              Score: {result.healthScore}
            </span>
          )}
          <a href="mailto:post@virtualhouse.no" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Book demo <ArrowRight className="h-3.5 w-3.5" />
          </a>
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
        <TheFlipSection />
        <SimulatorSection />
        <FAQSection />
        <CTASection />
      </div>
    </TooltipProvider>
  );
}

/* ═══════ Hero Building (video background + isometric scan overlay) ═══════ */
function HeroBuilding() {
  const [videoError, setVideoError] = useState(false);
  const [revealProgress, setRevealProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);

  useEffect(() => {
    const REVEAL_DURATION = 2400; // ms
    const HOLD_DURATION = 4000; // ms after scan completes before restarting
    let raf: number;
    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now;
      const elapsed = now - start;
      const totalCycle = REVEAL_DURATION + HOLD_DURATION;
      const cycleElapsed = elapsed % totalCycle;

      if (cycleElapsed < REVEAL_DURATION) {
        const p = Math.min(cycleElapsed / REVEAL_DURATION, 1);
        setRevealProgress(p);
        setScanComplete(p >= 1);
      } else {
        setRevealProgress(1);
        setScanComplete(true);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative w-full max-w-[640px] rounded-xl overflow-hidden border border-border bg-background/50">
      {/* Video / image background layer */}
      <div className="relative w-full" style={{ aspectRatio: "16/10" }}>
        {!videoError ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/vh_hero_frame.png"
            onError={() => setVideoError(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          >
            <source src="/vh_hero_video.mp4" type="video/mp4" />
          </video>
        ) : (
          <img src="/vh_hero_frame.png" alt="VirtualHouse building scan" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        )}

        {/* Isometric building scan overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <IsometricBuilding
            heatingTemp={55}
            sfpValue={1.8}
            recoveryEff={0.82}
            coolingKw={300}
            revealProgress={revealProgress}
            className="w-full max-w-[420px] drop-shadow-[0_0_30px_hsl(var(--primary)/0.15)]"
          />
        </div>

        {/* Scan-line effect */}
        {!scanComplete && (
          <motion.div
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
            style={{ top: `${(1 - revealProgress) * 100}%` }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/30 pointer-events-none" />

      {/* Bottom badges — fade in after scan completes */}
      <AnimatePresence>
        {scanComplete && (
          <motion.div
            className="absolute bottom-3 left-3 right-3 flex items-center justify-between"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4 }}
          >
            <span className="rounded-lg bg-card/90 border border-destructive/30 px-2.5 py-1 text-xs font-mono font-bold text-destructive">
              3 dimensjoneringskonflikter
            </span>
            <span className="rounded-lg bg-card/90 border border-border px-2.5 py-1 text-xs font-mono font-bold text-primary">
              Energisentral simulert
            </span>
          </motion.div>
        )}
      </AnimatePresence>
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
          Energisentral-simulering · Fra prosjektering til drift
        </p>

        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl leading-[1.1]">
          Vet du om energisentralen din
          <br />
          <span className="text-primary">faktisk vil fungere — før du bygger den?</span>
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-lg text-muted-foreground">
          VirtualHouse simulerer samspillet mellom varmepumper, kjølemaskiner, akkumuleringstanker og automasjon — og avdekker feil i dimensjonering og systemdesign før de koster deg.
        </p>
      </FadeIn>

      {/* Product visual + CTA */}
      <FadeIn delay={0.3} className="z-10 mt-10 w-full max-w-2xl text-center">
        <HeroBuilding />

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" onClick={() => {
            document.getElementById('faser')?.scrollIntoView({ behavior: 'smooth' });
          }} className="gap-2 px-8 py-5 text-base font-bold">
            Se hvordan det fungerer
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
          <p className="text-5xl font-extrabold font-mono tabular-nums text-destructive">70 000</p>
          <p className="mt-2 text-sm text-muted-foreground">kr per utrykning til teknisk feil i bygg</p>
        </div>
        <div>
          <p className="text-5xl font-extrabold font-mono tabular-nums text-destructive">6–18 mnd</p>
          <p className="mt-2 text-sm text-muted-foreground">forsinkelse når feil oppdages under idriftsettelse — timer i simulator</p>
        </div>
      </FadeIn>
      <FadeIn className="mt-10 text-center">
        <p className="text-base text-muted-foreground max-w-xl mx-auto">
          VirtualHouse løser dette ved å ta energisentralen gjennom 7 faser — slik at feilene oppdages i simulator, ikke på byggeplassen.
        </p>
      </FadeIn>
    </section>
  );
}

/* ═══════ SECTION 3 — 7-fase tidslinje ═══════ */
function TheFlipSection() {
  const phases = [
    { num: 1, name: "Rammebetingelser", desc: "Kartlegger klima, bruksmønstre og energibehov før systemdesign starter", value: "Databasert dimensjoneringsgrunnlag — ikke magefølelse" },
    { num: 2, name: "Design", desc: "Systemvalg og dimensjonering — varmepumper, brønner, tanker, automatikk", value: "Unngå feildimensjonert brønn eller underdimensjonert akkumulering" },
    { num: 3, name: "Designvalidering", desc: "Simulerer samspill mellom komponenter og automasjon før bestilling", value: "Verifisert ytelse og robusthet — før bygging" },
    { num: 4, name: "Designoptimalisering", desc: "Sammenligner alternativer med KPIer for driftskostnad og slitasje", value: "Ett års simulert drift på timer — ikke år med trial-and-error" },
    { num: 5, name: "Bordtest", desc: "Tverrfaglig gjennomgang med simulatoren som felles referanse", value: "Færre møter, dypere forankring på tvers av fag" },
    { num: 6, name: "Virtuell idriftsettelse", desc: "BAS kobles til simulator — automasjon ferdig utviklet før fysisk idriftsettelse", value: "Alarmer, skjermbilder og automatikk testet før nøkkelen leveres" },
    { num: 7, name: "Virtuell driftsoptimalisering", desc: "Feilsøk, optimaliser og tren driftspersonell — uten risiko", value: "Komplett testdekning for hele operasjonsområdet" },
  ];

  return (
    <Section className="py-24" id="faser">
      <FadeIn className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Fra første strek til daglig drift</h2>
        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">VirtualHouse følger prosjektet gjennom 7 faser — fra rammebetingelser til virtuell driftsoptimalisering.</p>
      </FadeIn>

      <div className="mx-auto w-full max-w-2xl">
        {phases.map((phase, i) => (
          <FadeIn key={phase.num} delay={i * 0.08} className="relative">
            {/* Connector line */}
            {i < phases.length - 1 && (
              <div className="absolute left-[19px] top-[44px] bottom-0 w-px bg-border" />
            )}
            <div className="flex gap-4 pb-8">
              {/* Phase number dot */}
              <div className={`flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                phase.num <= 4 ? "bg-primary/15 text-primary" : phase.num <= 5 ? "bg-vh-yellow/15 text-vh-yellow" : "bg-vh-green/15 text-vh-green"
              }`}>
                {phase.num}
              </div>
              {/* Content */}
              <div className="pt-1">
                <h3 className="text-base font-bold text-foreground">{phase.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{phase.desc}</p>
                <p className="mt-1.5 text-xs text-primary font-medium">{phase.value}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Mid-funnel CTA */}
      <FadeIn delay={0.6} className="mt-4 text-center">
        <p className="text-sm text-muted-foreground mb-3">De fleste kontakter oss mellom fase 2 og 4. Hvor er ditt prosjekt?</p>
        <a href="mailto:post@virtualhouse.no" className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-5 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors">
          Book en samtale
          <ArrowRight className="h-4 w-4" />
        </a>
      </FadeIn>
    </Section>
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
      label: "Termisk komfort §13-4",
      value: `${r.hoursAbove26} timer >26°C`,
      limit: "≤ 50 t",
      pass: r.hoursAbove26 <= 50,
    },
  ];

  const climateChecks = [
    {
      label: "CO₂ (snitt)",
      value: `${r.avgCO2ppm} ppm`,
      limit: "≤ 1000",
      pass: r.avgCO2ppm <= 1000,
    },
    {
      label: "RF vinter",
      value: `${r.avgRHwinter}%`,
      limit: "≥ 20%",
      pass: r.avgRHwinter >= 20,
    },
  ];

  const allChecks = [...checks, ...climateChecks];
  const passCount = allChecks.filter(c => c.pass).length;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">TEK17 & Inneklima</p>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${passCount === allChecks.length ? "bg-vh-green/15 text-vh-green" : "bg-destructive/15 text-destructive"}`}>
          {passCount}/{allChecks.length} bestått
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
      {/* Inneklima (NS-EN 16798) */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Inneklima (NS-EN 16798)</p>
        <div className="space-y-2">
          {climateChecks.map((c, i) => (
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
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Se hva som skjer uten riktig energisentral-design</h2>
        <p className="mt-3 text-muted-foreground">En forenklet beregning av bygningsenergibehov. VirtualHouse-analysen går dypere — den simulerer selve energisentralen.</p>
        <div className="mt-4 mx-auto max-w-xl rounded-lg border border-vh-yellow/30 bg-vh-yellow/5 px-4 py-3">
          <p className="text-xs text-muted-foreground"><span className="font-bold text-vh-yellow">⚠ Smaksprove</span> — denne simulatoren beregner bygningsenergibehov (ISO 13790). VirtualHouse sin faktiske analyse simulerer energisentralen: varmepumper, akkumuleringstanker, energibrønner og BAS-automasjon i samspill.</p>
        </div>
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

            {/* Right: live-reactive building */}
            <div className="flex items-center justify-center order-first md:order-last">
              <IsometricBuilding
                heatingTemp={input.heatingTurRetur[0]}
                sfpValue={input.sfpDesign}
                recoveryEff={input.heatRecoveryEff}
                coolingKw={input.installedCooling}
                className="w-full max-w-[380px]"
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
        <div className="mx-auto mt-8 w-full max-w-4xl">

          {/* ═══ Group 1: Immediate feedback ═══ */}
          <div className="space-y-4">
            {/* Report header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-primary/30 bg-primary/5 p-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">Prediktiv simuleringsrapport</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {input.bra === 6000 ? "Kontor" : input.bra === 8000 ? "Skole" : "Sykehus"} · {input.bra.toLocaleString("nb-NO")} m² · {input.location.charAt(0).toUpperCase() + input.location.slice(1)} · Smakprøve: bygningsenergibehov
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

            {/* System Vitals Bar */}
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
          </div>

          {/* ═══ Group 2: Year comparison ═══ */}
          <div className="border-t border-border/50 pt-8 mt-8 space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="rounded-xl border border-border bg-card/50 p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">År 1 vs År 2 (med slitasje)</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 pr-4 text-xs font-medium text-muted-foreground">Metrikk</th>
                        <th className="text-right py-2 px-4 text-xs font-medium text-vh-green">År 1</th>
                        <th className="text-right py-2 px-4 text-xs font-medium text-vh-yellow">År 2</th>
                        <th className="text-right py-2 pl-4 text-xs font-medium text-muted-foreground">Δ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          label: "Energibehov",
                          v1: `${Math.round(result.totalEnergyKwhM2)} kWh/m²`,
                          v2: `${Math.round(year2Result.totalEnergyKwhM2)} kWh/m²`,
                          delta: Math.round(year2Result.totalEnergyKwhM2 - result.totalEnergyKwhM2),
                          unit: "kWh/m²",
                          worse: year2Result.totalEnergyKwhM2 > result.totalEnergyKwhM2,
                        },
                        {
                          label: "Kostnad",
                          v1: `${Math.round(result.annualCostNOK / 1000)}k NOK`,
                          v2: `${Math.round(year2Result.annualCostNOK / 1000)}k NOK`,
                          delta: Math.round((year2Result.annualCostNOK - result.annualCostNOK) / 1000),
                          unit: "k",
                          worse: year2Result.annualCostNOK > result.annualCostNOK,
                        },
                        {
                          label: "Timer >26°C",
                          v1: `${result.hoursAbove26}`,
                          v2: `${year2Result.hoursAbove26}`,
                          delta: year2Result.hoursAbove26 - result.hoursAbove26,
                          unit: "",
                          worse: year2Result.hoursAbove26 > result.hoursAbove26,
                        },
                        {
                          label: "Energimerke",
                          v1: result.totalEnergyKwhM2 > 150 ? "D" : result.totalEnergyKwhM2 > 130 ? "C" : result.totalEnergyKwhM2 > 100 ? "B" : "A",
                          v2: year2Result.totalEnergyKwhM2 > 150 ? "D" : year2Result.totalEnergyKwhM2 > 130 ? "C" : year2Result.totalEnergyKwhM2 > 100 ? "B" : "A",
                          delta: 0,
                          unit: "",
                          worse: year2Result.totalEnergyKwhM2 > result.totalEnergyKwhM2,
                          isDelta: false,
                        },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-border/30 last:border-0">
                          <td className="py-2.5 pr-4 text-foreground font-medium">{row.label}</td>
                          <td className="py-2.5 px-4 text-right font-mono tabular-nums text-foreground">{row.v1}</td>
                          <td className="py-2.5 px-4 text-right font-mono tabular-nums text-foreground">{row.v2}</td>
                          <td className={`py-2.5 pl-4 text-right font-mono tabular-nums font-bold ${
                            row.worse ? "text-destructive" : "text-vh-green"
                          }`}>
                            {"isDelta" in row && row.isDelta === false
                              ? (row.v1 !== row.v2 ? "↓" : "—")
                              : `${row.delta > 0 ? "+" : ""}${row.delta}${row.unit}`
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ═══ Group 3: Compliance ═══ */}
          <div className="border-t border-border/50 pt-8 mt-8 space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                <HealthScoreGauge score={result.healthScore} />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
                <TEK17ReportCard result={result} />
              </motion.div>
            </div>
          </div>

          {/* ═══ Group 4: Time ═══ */}
          <div className="border-t border-border/50 pt-8 mt-8 space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="rounded-xl border border-transparent bg-card/50 p-5">
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

          </div>

          {/* ═══ Group 5: Problems ═══ */}
          <div className="border-t border-border/50 pt-8 mt-8 space-y-4">
            {result.avvik.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <AvvikPreview avvik={result.avvik} />
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
              <SystemConflicts result={result} />
            </motion.div>

            {/* Inline CTA — aha → handling */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }} className="pt-4">
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">VirtualHouse-analysen simulerer energisentralen din — varmepumper, brønner, tanker og automasjon i samspill — ikke bare bygningens energibehov.</p>
                <a href="mailto:post@virtualhouse.no" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-base font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
                  Book en demo
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </div>

        </div>
      )}
    </Section>
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

/* ═══════ FAQ / Objection Handling ═══════ */
function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    {
      q: "Hva skiller VirtualHouse fra SIMIEN eller IDA-ICE?",
      a: "SIMIEN beregner bygningens energibehov. VirtualHouse simulerer energisentralen — varmepumper, akkumuleringstanker, energibrønner og BAS-automasjon. Det er to ulike disipliner: SIMIEN svarer på 'hvor mye energi trenger bygget', VirtualHouse svarer på 'vil energisentralen faktisk klare å levere det, og til hvilken kostnad'.",
    },
    {
      q: "Hva koster det?",
      a: "Prisen settes etter prosjektets omfang og varighet — en enkeltvalidering koster fundamentalt annerledes enn løpende driftsoptimalisering over et år. Det vi kan si: for et bygg med energikostnader på 1–5 MNOK/år er typisk besparelse 10–20%, noe som gir tilbakebetalingstid under tolv måneder. Book en demo, så lager vi et konkret tilbud basert på ditt prosjekt.",
    },
    {
      q: "Kan jeg bruke dette på et reelt prosjekt?",
      a: "Ja. VirtualHouse brukes allerede i reelle byggeprosjekter. Vi samarbeider med prosjekteringsgruppen om å legge energisentraldesignet inn i simulatoren, validerer dimensjonering og samspill mellom komponenter, og leverer rapport med simuleringsresultater og konklusjoner.",
    },
    {
      q: "Hva er virtuell idriftsettelse?",
      a: "BAS-systemet (bygningsautomasjonen) kobles til simulatoren før fysisk idriftsettelse. Dere kan utvikle og teste skjermbilder, alarmer, feilhåndtering og automatikk uten å risikere faktiske driftsforstyrrelser. Resultatet: automasjon som er ferdig testet når nøkkelen leveres.",
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
  const segments = ["VVS-rådgivere", "Totalentreprenører", "Rådgivende ingeniører", "Eiendomsforvaltere", "Offentlige byggherrer"];
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
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Smakprøve-simulering — {buildingLabel} {input.bra.toLocaleString("nb-NO")} m²</p>
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
              <p className="text-xs text-muted-foreground">Potensiell besparelse avdekket i full energisentral-analyse:</p>
              <p className="text-lg font-bold text-primary mt-1">
                NOK {savingsLow.toLocaleString("nb-NO")} – {savingsHigh.toLocaleString("nb-NO")} / år — bekreft i demo
              </p>
            </div>
          </FadeIn>
        );
      })()}

      <FadeIn className="text-center max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          Vet du hva som skjer i energisentralen din under en kuldeperiode i februar?
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-lg text-muted-foreground">
          VirtualHouse simulerer energisentralen din — varmepumper, brønner, akkumuleringstanker og automasjon — slik at du vet det fungerer <span className="font-bold text-foreground">før det bygges</span>.
        </p>
        <div className="mt-10">
          <a href="mailto:post@virtualhouse.no" className="inline-flex items-center gap-3 rounded-md bg-primary px-10 py-4 text-lg font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
            Book en demo
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Eller prøv den forenklede simulatoren over · Enterprise?{" "}
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
