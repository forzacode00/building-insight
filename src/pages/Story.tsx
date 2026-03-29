import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Thermometer,
  Wind,
  Snowflake,
  ArrowRight,
  Zap,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

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
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <span className="text-sm font-bold tracking-tight">VirtualHouse</span>
        <div className="flex items-center gap-4 sm:gap-6">
          <a href="#simulator" className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors">Plattform</a>
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

      {/* CTA */}
      <FadeIn delay={0.3} className="z-10 mt-10 w-full max-w-2xl text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href="mailto:post@virtualhouse.no?subject=Demo%20VirtualHouse" className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-4 text-base font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
            Book demo
            <ArrowRight className="h-5 w-5" />
          </a>
          <Button size="lg" variant="outline" onClick={() => {
            document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth' });
          }} className="gap-2 px-6 py-4 text-sm">
            Se plattformen
          </Button>
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
          <p className="text-5xl font-extrabold font-mono tabular-nums text-destructive">30%</p>
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


/* ═══════ SECTION 4 — Interactive Energy Plant Demo ═══════ */
function PlatformPreview() {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [vpKw, setVpKw] = useState(200);
  const [tankL, setTankL] = useState(2000);
  const [wellCount, setWellCount] = useState(8);
  const [turTemp, setTurTemp] = useState(45);
  const [freeCool, setFreeCool] = useState(true);
  const [simProgress, setSimProgress] = useState(0);

  // Derived simulation results based on inputs
  const tankRatio = tankL / vpKw; // optimal ~10
  const scop = Math.round((4.8 - turTemp * 0.035) * 10) / 10;
  const maskinstart = Math.round(3800 - tankRatio * 200 + (turTemp - 45) * 30);
  const wellTemp10yr = Math.round((8.2 - (vpKw / (wellCount * 250)) * 5 - (freeCool ? 0 : 1.8)) * 10) / 10;
  const extraKwh = Math.round((55 - turTemp) * vpKw * 4.5);
  const freeKwhSaved = freeCool ? 38000 : 0;
  const annualElKwh = Math.round(480000 / scop + 72000 - freeKwhSaved);
  const annualCostKr = Math.round(annualElKwh * 1.5);

  // Avvik detection
  const avvik = [];
  if (tankRatio < 8) avvik.push({ title: "Underdimensjonert akkumuleringstank", desc: `${Math.round(tankRatio)} l/kW — anbefalt ≥10 l/kW. Gir ${maskinstart > 3000 ? maskinstart : "for mange"} maskinstart/år og forkorter kompressorlevetid.`, cost: Math.round((maskinstart - 1850) * 40), fix: `Øk tank til ${vpKw * 10} liter` });
  if (turTemp > 50) avvik.push({ title: "For høy turtemperatur", desc: `${turTemp}°C fast settpunkt i stedet for kurvestyrt 35–45°C. SCOP synker fra 3,6 til ${scop}.`, cost: Math.round((turTemp - 45) * vpKw * 6.75), fix: "Implementer utetemperaturkompensert varmekurve" });
  if (!freeCool) avvik.push({ title: "Frikjøling deaktivert", desc: "Kompressoren kjører kjøling mai–sept selv om brønntemperaturen tillater fri kjøling. Gir +38 000 kWh/år.", cost: 57000, fix: "Aktiver frikjøling med settpunkt ΔT > 2K" });
  if (wellTemp10yr < 4) avvik.push({ title: "Termisk drift i brønnfelt", desc: `Brønntemperatur når ${wellTemp10yr}°C innen år 10. VP kan ikke levere nominell effekt ved kaldeste perioder.`, cost: 0, fix: `Legg til ${Math.ceil((4 - wellTemp10yr) / 0.8)} ekstra brønner eller aktiver kjølegjenvinning` });
  if (avvik.length === 0) avvik.push({ title: "Ingen kritiske avvik", desc: "Energisentralen er godt dimensjonert. Alle KPIer er innenfor anbefalte grenser.", cost: 0, fix: "" });

  const totalSavings = avvik.reduce((s, a) => s + a.cost, 0);

  const handleSimulate = useCallback(() => {
    setStep(1);
    setSimProgress(0);
    const start = performance.now();
    const duration = 2500;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setSimProgress(Math.round(p * 100));
      if (p < 1) requestAnimationFrame(tick);
      else setStep(2);
    };
    requestAnimationFrame(tick);
  }, []);

  return (
    <Section className="py-24" id="simulator">
      <FadeIn className="mb-8 text-center max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">Prøv selv</p>
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Simuler en energisentral</h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Parkveien Kontorbygg, 6 000 m², Oslo. Juster parametrene og se hva VirtualHouse avdekker.</p>
      </FadeIn>

      {/* Step indicator */}
      <div className="mx-auto mb-8 flex items-center justify-center gap-2 text-xs font-medium">
        {["Konfigurer", "Simuler", "Resultater", "AI-anbefalinger"].map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${i <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>{i + 1}</div>
            <span className={`hidden sm:inline ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
            {i < 3 && <div className="hidden sm:block w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-xl border border-border bg-card/50 overflow-hidden">
          {/* Dashboard header */}
          <div className="border-b border-border px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${step >= 2 ? "bg-vh-green" : step === 1 ? "bg-vh-yellow animate-pulse" : "bg-muted-foreground"}`} />
              <span className="text-sm font-bold text-foreground">Parkveien Kontorbygg — Energisentral</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">{step === 0 ? "Konfigurasjon" : step === 1 ? `Simulerer... ${simProgress}%` : step === 2 ? `${avvik.length} avvik funnet` : "AI-analyse"}</span>
          </div>

          {/* STEP 0: Configuration */}
          {step === 0 && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Sliders */}
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between mb-2"><span className="text-sm font-medium flex items-center gap-2"><Thermometer className="h-4 w-4 text-primary" />Varmepumpe</span><span className="text-sm font-mono font-bold text-primary">{vpKw} kW</span></div>
                    <Slider value={[vpKw]} min={80} max={500} step={10} onValueChange={([v]) => { setVpKw(v); setTankL(v * 10); }} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2"><span className="text-sm font-medium flex items-center gap-2"><Zap className="h-4 w-4 text-vh-yellow" />Akkumuleringstank</span><span className="text-sm font-mono font-bold text-vh-yellow">{tankL.toLocaleString("nb-NO")} L</span></div>
                    <Slider value={[tankL]} min={500} max={8000} step={100} onValueChange={([v]) => setTankL(v)} />
                    <p className="text-[10px] text-muted-foreground mt-1">{Math.round(tankL / vpKw)} l/kW — {tankL / vpKw >= 10 ? <span className="text-vh-green">✓ anbefalt</span> : <span className="text-destructive">under anbefalt (≥10)</span>}</p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2"><span className="text-sm font-medium flex items-center gap-2"><Wind className="h-4 w-4 text-vh-green" />Energibrønner</span><span className="text-sm font-mono font-bold text-vh-green">{wellCount} × 250 m</span></div>
                    <Slider value={[wellCount]} min={4} max={16} step={1} onValueChange={([v]) => setWellCount(v)} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2"><span className="text-sm font-medium">Turtemperatur varme</span><span className="text-sm font-mono font-bold">{turTemp}°C</span></div>
                    <Slider value={[turTemp]} min={35} max={60} step={1} onValueChange={([v]) => setTurTemp(v)} />
                    <p className="text-[10px] text-muted-foreground mt-1">Estimert SCOP: {scop} — {turTemp <= 45 ? <span className="text-vh-green">✓ lavtemperatur</span> : <span className="text-vh-yellow">høyere = lavere COP</span>}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2"><Snowflake className="h-4 w-4 text-primary" />Frikjøling (passiv)</span>
                    <button onClick={() => setFreeCool(!freeCool)} className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${freeCool ? "bg-vh-green/15 text-vh-green" : "bg-destructive/15 text-destructive"}`}>
                      {freeCool ? "Aktivert" : "Deaktivert"}
                    </button>
                  </div>
                </div>
                {/* Right: P&ID preview */}
                <div className="rounded-lg bg-secondary/30 border border-border p-4 flex flex-col items-center justify-center gap-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Systemskjema</p>
                  <div className="flex items-center gap-4 text-xs">
                    {[
                      { icon: Thermometer, label: "VP-1", value: `${vpKw} kW`, color: "text-primary", bg: "bg-primary/15" },
                      { icon: Zap, label: "Tank", value: `${(tankL/1000).toFixed(1)}k L`, color: "text-vh-yellow", bg: "bg-vh-yellow/15" },
                      { icon: Wind, label: "Brønn", value: `${wellCount}×250`, color: "text-vh-green", bg: "bg-vh-green/15" },
                      { icon: Snowflake, label: freeCool ? "FriKjøl" : "Komp.", value: freeCool ? "Passiv" : "Aktiv", color: freeCool ? "text-vh-green" : "text-destructive", bg: freeCool ? "bg-vh-green/15" : "bg-destructive/15" },
                    ].map((n, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className={`h-10 w-10 rounded-lg ${n.bg} flex items-center justify-center`}><n.icon className={`h-4 w-4 ${n.color}`} /></div>
                        <span className="text-muted-foreground text-[10px]">{n.label}</span>
                        <span className={`font-mono text-[10px] font-bold ${n.color}`}>{n.value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">Tur: {turTemp}°C · SCOP: {scop} · Maskinstart: ~{maskinstart}/år</p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Button size="lg" onClick={handleSimulate} className="gap-2 px-10 py-5 text-base font-bold">
                  <Zap className="h-5 w-5" /> Simuler 10 års drift
                </Button>
              </div>
            </div>
          )}

          {/* STEP 1: Simulating */}
          {step === 1 && (
            <div className="p-10 text-center">
              <p className="text-lg font-bold text-foreground mb-2">Simulerer {(wellCount * 250 * 8760).toLocaleString("nb-NO")} timer drift...</p>
              <p className="text-sm text-muted-foreground mb-6">Varmepumpe, brønnfelt, akkumulering og automasjon i samspill</p>
              <div className="mx-auto max-w-md"><Progress value={simProgress} className="h-2" /></div>
              <p className="mt-3 text-xs font-mono text-muted-foreground">År {Math.min(10, Math.ceil(simProgress / 10))} av 10 · {simProgress}%</p>
            </div>
          )}

          {/* STEP 2: Results + Avvik */}
          {step === 2 && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Key metrics */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Simuleringsresultater — 10 år</p>
                  <div className="space-y-2">
                    {[
                      { label: "SCOP varme", value: scop.toString(), ok: scop >= 3.2 },
                      { label: "Maskinstart/år", value: maskinstart.toLocaleString("nb-NO"), ok: maskinstart < 2500 },
                      { label: "Brønntemp år 10", value: `${wellTemp10yr}°C`, ok: wellTemp10yr >= 4 },
                      { label: "Elforbruk/år", value: `${Math.round(annualElKwh / 1000)} MWh`, ok: annualElKwh < 220000 },
                      { label: "Årskostnad energi", value: `${Math.round(annualCostKr / 1000).toLocaleString("nb-NO")}k kr`, ok: annualCostKr < 300000 },
                    ].map((m) => (
                      <div key={m.label} className="flex items-center justify-between rounded-lg bg-secondary/30 px-3 py-2">
                        <span className="text-xs text-muted-foreground">{m.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono font-bold tabular-nums text-foreground">{m.value}</span>
                          <div className={`h-2 w-2 rounded-full ${m.ok ? "bg-vh-green" : "bg-destructive"}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Avvik */}
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Avvik avdekket</p>
                  <div className="space-y-2">
                    {avvik.map((a, i) => (
                      <div key={i} className={`rounded-lg p-3 ${a.cost > 0 ? "bg-destructive/5 border border-destructive/20" : "bg-vh-green/5 border border-vh-green/20"}`}>
                        <div className="flex items-start gap-2">
                          {a.cost > 0 ? <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" /> : <CheckCircle2 className="h-4 w-4 text-vh-green flex-shrink-0 mt-0.5" />}
                          <div>
                            <p className="text-sm font-bold text-foreground">{a.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
                            {a.cost > 0 && <p className="text-xs font-bold text-destructive mt-1">Kostnad: ~{a.cost.toLocaleString("nb-NO")} kr/år</p>}
                            {a.fix && <p className="text-xs text-primary mt-0.5">→ {a.fix}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {totalSavings > 0 && (
                    <div className="mt-3 rounded-lg bg-primary/10 px-3 py-2 text-center">
                      <p className="text-xs text-muted-foreground">Totalt besparelsespotensial:</p>
                      <p className="text-lg font-bold text-primary">{totalSavings.toLocaleString("nb-NO")} kr/år</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 text-center">
                <Button size="lg" onClick={() => setStep(3)} className="gap-2 px-8 py-4 text-base font-bold">
                  <Zap className="h-4 w-4" /> Se AI-anbefalinger
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: AI Recommendations */}
          {step === 3 && (
            <div className="p-6">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-primary mb-4">AI-analyse</p>
              <div className="space-y-3">
                {[
                  { title: "Dynamisk varmekurve med værvarsling", desc: `Settpunktjustering i SD-anlegget gir øyeblikkelig SCOP-forbedring. AI-agenten anbefaler turtemperatur basert på 72-timers værvarsling.`, saving: "60–70 000 kr/år", payback: "Under 1 måned", status: "Beta" },
                  { title: "Prediktiv frikjølingsstyring", desc: "Kombinert aktivering av frikjøling og prediksjon basert på byggets termiske treghet og solinnfall. Forlenger brønnfeltets levetid med 8–12 år.", saving: "55 000 kr/år", payback: "0 kr investering", status: "Beta" },
                  { title: "Kompressorbelastnings-optimalisering", desc: `Overvåker maskinstart kontinuerlig og varsler ved overskridelse. Anbefaler trinnvis oppstart for å redusere slitasje.`, saving: "NNV +420k over 15 år", payback: "~80 000 kr investering", status: "Kommer" },
                ].map((rec, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2, duration: 0.4 }} className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="h-4 w-4 text-primary" />
                          <span className="text-sm font-bold text-foreground">{rec.title}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${rec.status === "Beta" ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>{rec.status}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{rec.desc}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-vh-green">{rec.saving}</p>
                        <p className="text-[10px] text-muted-foreground">{rec.payback}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              {/* Traction + Final CTA */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <a href="mailto:post@virtualhouse.no?subject=Demo%20VirtualHouse" className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3 text-base font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
                    Book en full demo <ArrowRight className="h-4 w-4" />
                  </a>
                  <button onClick={() => { setStep(0); }} className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors">
                    Kjør ny simulering med andre parametre
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
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
  const segments = ["VVS-rådgivere", "Totalentreprenører", "Rådgivende ingeniører", "Driftsorganisasjoner", "Byggherrer"];

  return (
    <Section className="py-24">
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
          Enterprise eller portefølje?{" "}
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
