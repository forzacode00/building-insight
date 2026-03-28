import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  FileText,
  Home,
  CheckCircle2,
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
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useSimInput, useSimResult } from "@/lib/SimContext";

/* ───────── helpers ───────── */
function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`relative min-h-screen flex flex-col items-center justify-center px-6 py-24 ${className}`}>{children}</section>;
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const buildingTypes = [
  { id: "kontor", label: "Kontor", icon: Building2, bra: 6000 },
  { id: "skole", label: "Skole", icon: GraduationCap, bra: 8000 },
  { id: "sykehus", label: "Sykehus", icon: HeartPulse, bra: 12000 },
] as const;

/* ───────── STORY PAGE ───────── */
export default function Story() {
  return (
    <TooltipProvider>
      <div className="w-full bg-background text-foreground overflow-x-hidden">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <SimulatorSection />
        <AdvancedSection />
        <CTASection />
      </div>
    </TooltipProvider>
  );
}

/* ═══════ SECTION 1 — Hero ═══════ */
function HeroSection() {
  return (
    <Section className="relative overflow-hidden">
      {/* subtle radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,hsl(213_52%_63%/0.08),transparent)]" />

      <FadeIn className="z-10 max-w-3xl text-center">
        <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
          Test bygget ditt
          <br />
          <span className="text-primary">— før du bygger det</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          VirtualHouse simulerer tekniske anlegg digitalt, slik at du vet de fungerer før du bruker en krone.
        </p>
      </FadeIn>

      {/* animated icon flow */}
      <FadeIn delay={0.5} className="z-10 mt-16 flex items-center gap-6">
        <motion.div
          className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <FileText className="h-9 w-9 text-muted-foreground" />
        </motion.div>
        <motion.div className="h-px w-12 bg-primary/40" animate={{ scaleX: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
        <motion.div
          className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-primary bg-primary/10 vh-glow-blue"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.4 }}
        >
          <Home className="h-10 w-10 text-primary" />
        </motion.div>
        <motion.div className="h-px w-12 bg-primary/40" animate={{ scaleX: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} />
        <motion.div
          className="flex h-20 w-20 items-center justify-center rounded-2xl border border-vh-green/40 bg-vh-green/10"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.8 }}
        >
          <CheckCircle2 className="h-9 w-9 text-vh-green" />
        </motion.div>
      </FadeIn>

      {/* scroll indicator */}
      <motion.div
        className="absolute bottom-10 flex flex-col items-center gap-2 text-muted-foreground"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs">Scroll for å se hvordan</span>
        <ChevronDown className="h-5 w-5" />
      </motion.div>
    </Section>
  );
}

/* ═══════ SECTION 2 — Problem ═══════ */
function ProblemSection() {
  const stats = [
    { value: "30%", text: "av VVS-anlegg fungerer ikke som planlagt" },
    { value: "15–25%", text: "gjennomsnittlig merkostnad ved feil" },
    { value: "6–12 mnd", text: "typisk tid for feilretting etter overlevering" },
  ];

  return (
    <Section>
      <FadeIn className="mb-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Slik gjøres det i dag</h2>
        <p className="mt-3 text-muted-foreground">Den tradisjonelle prosessen er risikabel og dyr.</p>
      </FadeIn>

      <div className="mx-auto grid w-full max-w-5xl gap-12 md:grid-cols-2">
        {/* left — timeline boxes */}
        <div className="flex flex-col items-center gap-4">
          {[
            {
              title: "Prosjektering",
              desc: "Ingeniører designer VVS-systemet. Tegninger, beregninger, funksjonsbeskrivelser.",
              time: "3–6 måneder",
              color: "border-vh-green/40 bg-vh-green/5",
              textColor: "text-vh-green",
              delay: 0,
            },
            {
              title: "Bygging",
              desc: "Systemet bygges fysisk. 12–18 måneder. 20–80 MNOK.",
              time: "12–18 måneder",
              color: "border-border bg-secondary/80",
              textColor: "text-foreground",
              delay: 0.2,
              scary: true,
            },
            {
              title: "Testing",
              desc: "Fungerer det? Først NÅ kan vi teste. 30% av anlegg har feil ved overlevering.",
              time: "???",
              color: "border-destructive/40 bg-destructive/5",
              textColor: "text-destructive",
              delay: 0.4,
            },
          ].map((box) => (
            <FadeIn key={box.title} delay={box.delay} className="w-full">
              <div className={`rounded-xl border p-6 ${box.color} ${box.scary ? "scale-105 shadow-lg" : ""}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-bold ${box.textColor}`}>{box.title}</h3>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">{box.time}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{box.desc}</p>
              </div>
              {box.title !== "Testing" && (
                <div className="mx-auto my-1 h-6 w-px bg-border" />
              )}
            </FadeIn>
          ))}
        </div>

        {/* right — stats */}
        <div className="flex flex-col justify-center gap-6">
          {stats.map((s, i) => (
            <FadeIn key={i} delay={0.3 + i * 0.15}>
              <div className="flex items-start gap-4">
                <span className="text-3xl font-extrabold font-mono tabular-nums text-destructive">{s.value}</span>
                <p className="pt-1 text-sm text-muted-foreground">{s.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ═══════ SECTION 3 — Solution ═══════ */
function SolutionSection() {
  return (
    <Section>
      <FadeIn className="mb-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Hva om du kunne hoppe over?</h2>
        <p className="mt-3 text-muted-foreground">VirtualHouse erstatter den dyre byggefasen med en digital simulering.</p>
      </FadeIn>

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4">
        {[
          {
            title: "Prosjektering",
            desc: "Samme grundige design — men nå med digital tvilling.",
            time: "3–6 måneder",
            color: "border-vh-green/40 bg-vh-green/5",
            textColor: "text-vh-green",
            delay: 0,
          },
          {
            title: "VirtualHouse Simulering",
            desc: "3 minutter. 0 kroner i byggekostnad. Full digital test.",
            time: "3 minutter",
            color: "border-primary/60 bg-primary/10 vh-glow-blue",
            textColor: "text-primary",
            delay: 0.25,
          },
          {
            title: "Verifisert resultat",
            desc: "Du VET at det fungerer. Før første spiker.",
            time: "✅ Bekreftet",
            color: "border-vh-green/40 bg-vh-green/5",
            textColor: "text-vh-green",
            delay: 0.5,
          },
        ].map((box) => (
          <FadeIn key={box.title} delay={box.delay} className="w-full">
            <div className={`rounded-xl border p-6 ${box.color}`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-bold ${box.textColor}`}>{box.title}</h3>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">{box.time}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{box.desc}</p>
            </div>
            {box.title !== "Verifisert resultat" && (
              <div className="mx-auto my-1 h-6 w-px bg-primary/30" />
            )}
          </FadeIn>
        ))}

        <FadeIn delay={0.7} className="mt-6 text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/5 px-5 py-2">
            <span className="text-sm text-muted-foreground line-through">18 måneder</span>
            <ArrowRight className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-primary">3 minutter</span>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}

/* ═══════ SECTION 4 — Interactive Simulator ═══════ */
function SimulatorSection() {
  const navigate = useNavigate();
  const { input, updateInput } = useSimInput();
  const result = useSimResult();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleSelectType = (type: typeof buildingTypes[number]) => {
    setSelectedType(type.id);
    updateInput("bra", type.bra);
    setShowResults(false);
  };

  const handleSimulate = () => setShowResults(true);

  return (
    <Section>
      <FadeIn className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Prøv selv</h2>
        <p className="mt-3 text-muted-foreground">Velg en bygningstype og juster parametere.</p>
      </FadeIn>

      {/* building type cards */}
      <FadeIn className="mx-auto mb-10 grid w-full max-w-2xl grid-cols-3 gap-4">
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

      {/* sliders */}
      {selectedType && (
        <FadeIn className="mx-auto w-full max-w-2xl">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <SliderField
                icon={<Thermometer className="h-4 w-4 text-vh-red" />}
                label="Radiatortemperatur"
                tooltip="Turtemperatur varme"
                value={input.heatingTurRetur[0]}
                min={40} max={70} step={1} unit="°C"
                onChange={(v) => updateInput("heatingTurRetur", [v, input.heatingTurRetur[1]])}
              />
              <SliderField
                icon={<Wind className="h-4 w-4 text-vh-blue" />}
                label="Ventilasjonskraft"
                tooltip="SFP kW/(m³/s)"
                value={input.sfpDesign}
                min={0.8} max={2.5} step={0.1} unit="SFP"
                onChange={(v) => updateInput("sfpDesign", v)}
              />
              <SliderField
                icon={<RefreshCw className="h-4 w-4 text-vh-green" />}
                label="Gjenvinning av varme"
                tooltip="Gjenvinner virkningsgrad"
                value={Math.round(input.heatRecoveryEff * 100)}
                min={50} max={95} step={1} unit="%"
                onChange={(v) => updateInput("heatRecoveryEff", v / 100)}
              />
              <SliderField
                icon={<Snowflake className="h-4 w-4 text-primary" />}
                label="Kjølekapasitet"
                tooltip="Installert kjøleeffekt"
                value={input.installedCooling}
                min={100} max={600} step={10} unit="kW"
                onChange={(v) => updateInput("installedCooling", v)}
              />
            </div>

            <div className="mt-8 flex justify-center">
              <Button size="lg" onClick={handleSimulate} className="gap-2 px-8 text-base">
                <Zap className="h-5 w-5" />
                Simuler 2 år
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </FadeIn>
      )}

      {/* results */}
      {showResults && (
        <FadeIn className="mx-auto mt-8 w-full max-w-2xl">
          <SimResults result={result} />
        </FadeIn>
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
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
      />
    </div>
  );
}

function SimResults({ result: r }: { result: ReturnType<typeof useSimResult> }) {
  const getEnergimerke = (v: number) => (v > 150 ? "D" : v > 130 ? "C" : v > 100 ? "B" : "A");
  const merke = getEnergimerke(r.totalEnergyKwhM2);
  const merkeColor = merke === "A" ? "text-vh-green" : merke === "B" ? "text-vh-green" : merke === "C" ? "text-vh-yellow" : "text-destructive";

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-border bg-card p-5 text-center">
        <p className="text-xs text-muted-foreground">Energibehov</p>
        <p className="mt-1 text-3xl font-bold font-mono tabular-nums">{Math.round(r.totalEnergyKwhM2)}</p>
        <p className="text-xs text-muted-foreground">kWh/m²·år</p>
        <span className={`mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-bold ${r.exceedsTEK17 ? "bg-destructive/15 text-destructive" : "bg-vh-green/15 text-vh-green"}`}>
          {r.exceedsTEK17 ? "Over TEK17" : "Under TEK17 ✅"}
        </span>
      </div>
      <div className="rounded-xl border border-border bg-card p-5 text-center">
        <p className="text-xs text-muted-foreground">Komfort</p>
        <p className="mt-1 text-3xl font-bold font-mono tabular-nums">{r.hoursAbove26}</p>
        <p className="text-xs text-muted-foreground">timer over 26°C</p>
        <span className={`mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-bold ${r.hoursAbove26 > 50 ? "bg-vh-yellow/15 text-vh-yellow" : "bg-vh-green/15 text-vh-green"}`}>
          {r.hoursAbove26 > 50 ? "Overtemperatur" : "OK ✅"}
        </span>
      </div>
      <div className="rounded-xl border border-border bg-card p-5 text-center">
        <p className="text-xs text-muted-foreground">Energimerke</p>
        <p className={`mt-1 text-5xl font-extrabold ${merkeColor}`}>{merke}</p>
        <span className={`mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-bold ${merke <= "B" ? "bg-vh-green/15 text-vh-green" : "bg-vh-yellow/15 text-vh-yellow"}`}>
          {merke <= "B" ? "Grønt lån-kvalifisert ✅" : "Krever forbedring"}
        </span>
      </div>
    </div>
  );
}

/* ═══════ SECTION 5 — Advanced insights ═══════ */
function AdvancedSection() {
  const { input, updateInput } = useSimInput();
  const result = useSimResult();
  const [toggles, setToggles] = useState({ seasons: false, wear: false, simultaneous: false });

  const baseEff = 0.82;
  const baseSfp = 1.5;

  const handleToggle = (key: keyof typeof toggles) => {
    const next = { ...toggles, [key]: !toggles[key] };
    setToggles(next);

    if (key === "wear") {
      if (!next.wear) {
        updateInput("heatRecoveryEff", baseEff);
        updateInput("sfpDesign", baseSfp);
      } else {
        updateInput("heatRecoveryEff", baseEff * 0.94);
        updateInput("sfpDesign", baseSfp * 1.15);
      }
    }
  };

  return (
    <Section>
      <FadeIn className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Det virkelige blir interessant...</h2>
        <p className="mt-3 text-muted-foreground">Men hva skjer når vi legger til virkeligheten?</p>
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
              toggles[t.key]
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/40"
            }`}
          >
            {toggles[t.key] ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
            {t.label}
          </button>
        ))}
      </FadeIn>

      <FadeIn className="mx-auto w-full max-w-2xl space-y-4">
        <SimResults result={result} />

        {toggles.simultaneous && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="rounded-xl border border-destructive/30 bg-destructive/5 p-5"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm font-semibold text-destructive">Samtidig varme og kjøling</p>
                <p className="text-xs text-muted-foreground">
                  Systemet varmer og kjøler samtidig i mellomsesongen. Estimert sløsing:{" "}
                  <span className="font-bold text-destructive">NOK 42 000/år</span>.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {toggles.wear && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="rounded-xl border border-vh-yellow/30 bg-vh-yellow/5 p-5"
          >
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

/* ═══════ SECTION 6 — CTA ═══════ */
function CTASection() {
  const navigate = useNavigate();

  const logos = ["Skanska", "Veidekke", "AF Gruppen", "Multiconsult", "Norconsult", "Sweco"];

  return (
    <Section>
      <FadeIn className="text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Klar for å teste ditt eget prosjekt?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Last opp en funksjonsbeskrivelse eller kontakt oss for en demo.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button size="lg" onClick={() => navigate("/simulator")} className="gap-2 px-8 text-base">
            Last opp funksjonsbeskrivelse
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={() => window.location.href = "mailto:kontakt@virtualhouse.no"} className="px-8 text-base">
            Kontakt oss
          </Button>
        </div>
      </FadeIn>

      <FadeIn delay={0.3} className="mt-20">
        <p className="mb-4 text-center text-xs text-muted-foreground">Brukt av ledende aktører i norsk bygg- og eiendom</p>
        <div className="flex flex-wrap justify-center gap-4">
          {logos.map((name) => (
            <div key={name} className="rounded-lg border border-border bg-card px-5 py-2.5">
              <span className="text-sm font-medium text-muted-foreground">{name}</span>
            </div>
          ))}
        </div>
      </FadeIn>

      <div className="mt-16 text-center text-xs text-muted-foreground/50">
        VirtualHouse™ Investor Demo — v1.0
      </div>
    </Section>
  );
}
