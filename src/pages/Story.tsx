import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Thermometer,
  Wind,
  Snowflake,
  ArrowRight,
  Zap,
  Clock,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";

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
        <PlatformPreview />
        <TheFlipSection />
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
          VirtualHouse
        </p>

        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl leading-[1.1]">
          Hva skjer i bygget ditt
          <br />
          <span className="text-primary">når du ikke ser?</span>
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-lg text-muted-foreground">
          Kuldeperioder. Brønndegenerering. Sprøtt dyre strømtopper midt på natten. VirtualHouse simulerer energisentralen din og viser deg konsekvensene — før de inntreffer.
        </p>
      </FadeIn>

      {/* CTA */}
      <FadeIn delay={0.3} className="z-10 mt-10 w-full max-w-2xl text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" onClick={() => {
            document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth' });
          }} className="gap-2 px-8 py-5 text-base font-bold">
            Utforsk scenarioene
            <ArrowRight className="h-5 w-5" />
          </Button>
          <a href="mailto:post@virtualhouse.no?subject=Demo%20VirtualHouse" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors">
            Eller book en demo →
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
                <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  item.aiStatus === "Beta" ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
                }`}>{item.aiStatus}</span>
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
    id: "kulde",
    icon: Snowflake,
    color: "text-primary",
    bg: "bg-primary/10",
    borderColor: "border-primary/30",
    question: "Det er −15°C i februar. Varmepumpen klarer ikke å følge med.",
    steps: [
      { time: "Dag 1, kl. 06:00", event: "Utetemperaturen faller til −15°C. Varmepumpen går på maks.", consequence: "Strømtopp: +340 kr denne timen." },
      { time: "Dag 2", event: "Effektbehovet overstiger kapasiteten. El-patronen starter som backup.", consequence: "4× så dyr varme. Ingen varslet deg." },
      { time: "Dag 5", event: "Leietakerne klager. Innetemperaturen har sunket 2°C.", consequence: "Risiko: kontraktsbrudd på komfortleveranse." },
    ],
    vhSolution: "AI-en forutså kuldegrepen 36 timer i forveien og forhåndsladde akkumulatortanken i lavprisperioden.",
    vhResult: "Du betalte det samme. Ingen merket noe.",
  },
  {
    id: "bronn",
    icon: Wind,
    color: "text-vh-yellow",
    bg: "bg-vh-yellow/10",
    borderColor: "border-vh-yellow/30",
    question: "Etter 8 år synker brønntemperaturen. Ingen har fortalt deg det.",
    steps: [
      { time: "År 0", event: "Brønnen leverer 7°C. Varmepumpen er effektiv. COP er 4,2.", consequence: "Alt virker. Du er fornøyd." },
      { time: "År 3", event: "Brønntemperaturen er nede i 5°C. Kompressoren jobber hardere.", consequence: "Strømforbruk opp 8%. Ingen merker det." },
      { time: "År 6", event: "3,5°C. Kompressoren starter oftere. Levetiden forkortes.", consequence: "Estimert tap: 400 000 kr i for tidlig utskifting." },
      { time: "År 8", event: "Kapasitetssvikt. Bygget trenger en ny varmekilde.", consequence: "Investering: 2,8–3,4 millioner kr." },
    ],
    vhSolution: "Trenden ble oppdaget i år 1. Tiltak kostet 80 000 kr.",
    vhResult: "Du sparte 3 millioner og 7 år med uvitenhet.",
  },
  {
    id: "natt",
    icon: Zap,
    color: "text-vh-green",
    bg: "bg-vh-green/10",
    borderColor: "border-vh-green/30",
    question: "Klokken er 02:14. AI-en jobber. Du sover.",
    steps: [
      { time: "02:14", event: "Strømprisen faller til 12 øre/kWh. AI-en ser det.", consequence: "Turtemperaturen senkes 3°C. Bygget akkumulerer billig varme." },
      { time: "05:30", event: "Prisspike forventes kl. 07:00. AI-en avslutter oppladingen.", consequence: "Du sover fortsatt. Ingen alarmer." },
      { time: "07:00", event: "Pristopp. Bygget driftes på lagret varme.", consequence: "Strømkostnad denne morgenen: −62%." },
    ],
    vhSolution: "Dette skjer 12–18 netter per måned, automatisk.",
    vhResult: "Estimert besparelse: 180 000–260 000 kr/år.",
  },
  {
    id: "esg",
    icon: Leaf,
    color: "text-primary",
    bg: "bg-primary/10",
    borderColor: "border-primary/30",
    question: "Styret spør om byggets klimaavtrykk. Du har ingen svar.",
    steps: [
      { time: "Q1", event: "EU Taksonomi-rapportering krever energidata per time, per kilde.", consequence: "Uten logging: du kan ikke dokumentere." },
      { time: "Q2", event: "Leietaker med bærekraftsmål ber om energiattest.", consequence: "Risiko: tap av leietaker ved kontraktsfornyelse." },
      { time: "Q4", event: "Refinansiering. Banken spør om GRESB-score.", consequence: "Manglende data = 0,15% ekstra rente." },
    ],
    vhSolution: "Alle data logges automatisk, time for time, med kilde og temperatur.",
    vhResult: "Rapport genereres på 4 sekunder.",
  },
];

function PlatformPreview() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = scenarios.find(s => s.id === activeId);

  return (
    <Section className="py-24" id="simulator">
      <FadeIn className="mb-10 text-center max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">Utforsk</p>
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Hva skjer når...</h2>
        <p className="mt-3 text-muted-foreground max-w-lg mx-auto">Fire scenarioer. Fire konsekvenser du aldri hadde sett uten simulering.</p>
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
                <p className="text-sm font-semibold text-foreground leading-snug">{s.question}</p>
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

                {/* VH Solution — green resolution */}
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: active.steps.length * 0.15, duration: 0.3 }}
                  className="relative flex gap-4 pt-2"
                >
                  <div className="flex-shrink-0 z-10">
                    <div className="h-8 w-8 rounded-full bg-vh-green/15 border border-vh-green/30 flex items-center justify-center">
                      <Zap className="h-4 w-4 text-vh-green" />
                    </div>
                  </div>
                  <div className="rounded-lg bg-vh-green/5 border border-vh-green/20 p-4 flex-1">
                    <p className="text-xs font-bold text-vh-green uppercase tracking-wider mb-1">Med VirtualHouse</p>
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
            <a href="mailto:post@virtualhouse.no?subject=Demo%20VirtualHouse" className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3 text-base font-bold text-primary-foreground hover:bg-primary/90 transition-colors">
              Se dette på ditt bygg <ArrowRight className="h-4 w-4" />
            </a>
            <p className="text-xs text-muted-foreground">Fysikkmotor nå · AI-funksjoner i beta</p>
          </div>
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
