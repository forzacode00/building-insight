import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Thermometer,
  Wind,
  Snowflake,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useSimInput, useSimResult } from "@/lib/SimContext";
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

/* ───────── STORY PAGE ───────── */
/* ═══════ STICKY NAV ═══════ */
function SiteNav() {
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
          <a href="https://virtualhouse.no" target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Få tilgang <ArrowRight className="h-3.5 w-3.5" />
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
        <PlatformPreview />
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
          Plattform for energisentral-simulering
        </p>

        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl leading-[1.1]">
          Energisentralen din, simulert
          <br />
          <span className="text-primary">fra funksjonsbeskrivelse til idriftsatt</span>
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-lg text-muted-foreground">
          Last opp prosjekteringen. Plattformen konfigurerer simulatoren. Du avdekker feilene — før de koster deg.
        </p>
        <p className="mx-auto mt-3 text-sm text-muted-foreground/70">
          Fysikkmotor tilgjengelig nå · AI-konfigurering i beta
        </p>
      </FadeIn>

      {/* Product visual + CTA */}
      <FadeIn delay={0.3} className="z-10 mt-10 w-full max-w-2xl text-center">
        <HeroBuilding />

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" onClick={() => {
            document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth' });
          }} className="gap-2 px-8 py-5 text-base font-bold">
            Kjør simulering
            <ArrowRight className="h-5 w-5" />
          </Button>
          <a href="mailto:post@virtualhouse.no?subject=AI-demo%20VirtualHouse" className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors">
            Book AI-demo
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
          VirtualHouse er plattformen som lar deg simulere, validere og idriftsette energisentralen digitalt — før noe fysisk bygges.
        </p>
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
      aiStatus: "Beta",
    },
    {
      phase: "Validering",
      color: "text-primary",
      bg: "bg-primary/10",
      core: "Sammenlign scenarier, optimaliser KPIer, del resultater med prosjektteamet — alle ser samme data.",
      ai: "AI genererer avviksrapport med prioriterte anbefalinger",
      aiStatus: "Beta",
    },
    {
      phase: "Idriftsettelse",
      color: "text-vh-yellow",
      bg: "bg-vh-yellow/10",
      core: "Koble BAS til simulatoren. Test automasjon, alarmer og skjermbilder — før fysisk idriftsettelse.",
      ai: "Spør simulatoren med naturlig språk: \"hva skjer om VP-1 stopper i februar?\"",
      aiStatus: "Kommer",
    },
    {
      phase: "Drift",
      color: "text-vh-green",
      bg: "bg-vh-green/10",
      core: "Feilsøk hendelser, kjør hva-skjer-hvis-scenarier, tren driftspersonell — raskere enn sanntid.",
      ai: "AI-agent foreslår optimaliseringer og validerer mot fysikkmotoren før anbefaling",
      aiStatus: "Kommer",
    },
  ];

  return (
    <Section className="py-24" id="faser">
      <FadeIn className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Én plattform, hele livsløpet</h2>
        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">Fysikkmotoren simulerer korrekt. AI-en stiller spørsmålene du ikke visste du burde stille.</p>
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
                <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  item.aiStatus === "Beta" ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
                }`}>{item.aiStatus}</span>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.5} className="mt-8 text-center">
        <p className="text-xs text-muted-foreground mb-3">Vi har fysikkmotoren. Nå bygger vi intelligensen rundt den.</p>
      </FadeIn>
    </Section>
  );
}


/* ═══════ SECTION 4 — Platform Preview ═══════ */
function PlatformPreview() {
  return (
    <Section className="py-24" id="simulator">
      <FadeIn className="mb-10 text-center max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">Plattformen</p>
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Dette er ikke en kalkulator. Det er en plattform.
        </h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          VirtualHouse simulerer energisentralen din — varmepumper, energibrønner, akkumulatorer og BAS — i samspill, over hele livssyklusen. AI optimaliserer. Fysikk verifiserer.
        </p>
      </FadeIn>

      {/* Mock dashboard */}
      <FadeIn delay={0.15} className="mx-auto w-full max-w-4xl">
        <div className="rounded-xl border border-border bg-card/50 overflow-hidden">
          {/* Dashboard header */}
          <div className="border-b border-border px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-vh-green animate-pulse" />
              <span className="text-sm font-bold text-foreground">Parkveien Kontorbygg — Energisentral</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">Live · Oppdatert 12:04</span>
          </div>

          {/* Dashboard body */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {/* P&ID diagram area */}
            <div className="md:col-span-2 bg-background p-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Systemskjema (P&ID)</p>
              <div className="rounded-lg bg-secondary/30 border border-border p-4 h-48 flex items-center justify-center relative overflow-hidden">
                {/* Stylized P&ID nodes */}
                <div className="flex items-center gap-6 text-xs">
                  <div className="flex flex-col items-center gap-1">
                    <div className="h-12 w-12 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                      <Thermometer className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-muted-foreground">VP-1</span>
                    <span className="font-mono text-foreground text-[10px]">200 kW</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="h-px w-12 bg-primary/40" />
                    <span className="text-[8px] text-primary">55/35°C</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="h-12 w-12 rounded-lg bg-vh-yellow/15 border border-vh-yellow/30 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-vh-yellow" />
                    </div>
                    <span className="text-muted-foreground">Akk.tank</span>
                    <span className="font-mono text-foreground text-[10px]">2000 L</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="h-px w-12 bg-primary/40" />
                    <span className="text-[8px] text-primary">→</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="h-12 w-12 rounded-lg bg-vh-green/15 border border-vh-green/30 flex items-center justify-center">
                      <Wind className="h-5 w-5 text-vh-green" />
                    </div>
                    <span className="text-muted-foreground">Brønn</span>
                    <span className="font-mono text-foreground text-[10px]">8×200m</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="h-px w-12 bg-primary/40" />
                    <span className="text-[8px] text-primary">→</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="h-12 w-12 rounded-lg bg-destructive/15 border border-destructive/30 flex items-center justify-center">
                      <Snowflake className="h-5 w-5 text-destructive" />
                    </div>
                    <span className="text-muted-foreground">Kjøling</span>
                    <span className="font-mono text-foreground text-[10px]">150 kW</span>
                  </div>
                </div>
                {/* AI alert overlay */}
                <div className="absolute top-3 right-3 rounded-md bg-primary/10 border border-primary/30 px-2.5 py-1.5 flex items-center gap-2">
                  <Zap className="h-3 w-3 text-primary" />
                  <span className="text-[10px] text-primary font-medium">AI: turtemp senket 02:14 → −340 kWh</span>
                </div>
              </div>
            </div>

            {/* Metrics sidebar */}
            <div className="bg-background p-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Sanntidsmetrikker</p>
              <div className="space-y-3">
                {[
                  { label: "COP", value: "3.8", status: "ok" },
                  { label: "Effekt", value: "142 kW", status: "ok" },
                  { label: "Brønntemp", value: "6.2°C", status: "warn" },
                  { label: "SFP", value: "1.4", status: "ok" },
                  { label: "Timer >26°C", value: "0", status: "ok" },
                ].map((m) => (
                  <div key={m.label} className="flex items-center justify-between rounded-lg bg-secondary/30 px-3 py-2">
                    <span className="text-xs text-muted-foreground">{m.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-bold tabular-nums text-foreground">{m.value}</span>
                      <div className={`h-2 w-2 rounded-full ${m.status === "ok" ? "bg-vh-green" : "bg-vh-yellow"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Four phases */}
      <FadeIn delay={0.3} className="mt-10 mx-auto w-full max-w-4xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { phase: "Design", desc: "Simuler før spaden settes i jorda", color: "text-primary" },
            { phase: "Bygg", desc: "Verifiser mot P&ID under installasjon", color: "text-primary" },
            { phase: "Drift", desc: "AI optimaliserer daglig", color: "text-vh-green" },
            { phase: "Rapporter", desc: "ESG og energimerking automatisk", color: "text-vh-green" },
          ].map((p) => (
            <div key={p.phase} className="rounded-lg border border-border bg-card/50 p-4 text-center">
              <p className={`text-sm font-bold ${p.color}`}>{p.phase}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* Impact + Traction */}
      <FadeIn delay={0.4} className="mt-10 mx-auto w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Impact numbers */}
          <div className="flex items-center justify-center gap-8">
            {[
              { value: "20–30%", label: "lavere CAPEX" },
              { value: "20–30%", label: "lavere energikost" },
              { value: "~4 mnd", label: "tilbakebetaling" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-extrabold font-mono tabular-nums text-primary">{s.value}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Traction */}
          <div className="rounded-xl border border-border bg-card/50 p-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Brukt av nordiske ledere</p>
            <div className="flex flex-wrap gap-2">
              {["Skanska", "Veidekke", "Statsbygg", "OBOS", "Advansia", "Bravida", "Multiconsult", "Norconsult"].map((name) => (
                <span key={name} className="rounded-full bg-secondary/70 px-3 py-1 text-xs font-medium text-foreground">{name}</span>
              ))}
            </div>
            <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
              <span><span className="font-bold text-foreground">20+</span> enterprise-kunder</span>
              <span><span className="font-bold text-foreground">0%</span> churn</span>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* CTA */}
      <FadeIn delay={0.5} className="mt-10 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="mailto:post@virtualhouse.no?subject=Demo%20VirtualHouse" className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3 text-base font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
            Se en demo
            <ArrowRight className="h-4 w-4" />
          </a>
          <a href="https://virtualhouse.no" target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors">
            Logg inn
          </a>
        </div>
      </FadeIn>
    </Section>
  );
}

/* ═══════ FAQ / Objection Handling ═══════ */
function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
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
function CTASection() {
  const result = useSimResult();
  const { input } = useSimInput();
  const segments = ["VVS-rådgivere", "Totalentreprenører", "Rådgivende ingeniører", "Driftsorganisasjoner", "Byggherrer"];
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
              <p className="text-xs text-muted-foreground">Estimert besparelse ved full energisentral-analyse:</p>
              <p className="text-lg font-bold text-primary mt-1">
                NOK {savingsLow.toLocaleString("nb-NO")} – {savingsHigh.toLocaleString("nb-NO")} / år
              </p>
            </div>
          </FadeIn>
        );
      })()}

      <FadeIn className="text-center max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          Operativsystemet for energisentralen din
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-lg text-muted-foreground">
          Fysikkmotor + AI i én plattform — fra prosjektering til driftsoptimalisering. <span className="font-bold text-foreground">Du laster opp, plattformen simulerer, du beslutter.</span>
        </p>
        <div className="mt-10">
          <a href="https://virtualhouse.no" target="_blank" rel="noopener" className="inline-flex items-center gap-3 rounded-md bg-primary px-10 py-4 text-lg font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
            Få tilgang til plattformen
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Eller <a href="#simulator" className="font-medium text-primary underline underline-offset-4">prøv smakprøven</a> · Enterprise?{" "}
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
