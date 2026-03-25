import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";

const plans = [
  {
    name: "Verify",
    price: "4 900",
    desc: "Verifiser prosjekterte verdier mot faktisk drift",
    features: ["Datainput", "Simulering", "Sammenligning", "Avviksrapport"],
    cta: "Kom i gang",
    highlight: false,
  },
  {
    name: "Optimize",
    price: "12 900",
    desc: "Full simulering + SD-integrasjon + What-If",
    features: ["Alt i Verify", "Knowledge Graph", "SD Live", "What-If", "Konsekvensanalyse", "Skriv til SD"],
    cta: "Start gratis prøveperiode",
    highlight: true,
    badge: "Mest populær",
  },
  {
    name: "Portfolio",
    price: "8 900",
    priceNote: "per bygg (min 5)",
    desc: "For eiendomsforvaltere med flere bygg",
    features: ["Alt i Optimize", "Portefølje", "Benchmarking", "ESG-rapportering"],
    cta: "Kontakt oss",
    highlight: false,
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function Priser() {
  const [bra, setBra] = useState(6000);
  const [energiKost, setEnergiKost] = useState(184);

  const roi = useMemo(() => {
    const total = bra * energiKost;
    const savLow = total * 0.15;
    const savHigh = total * 0.25;
    const abb = 12900 * 12;
    return {
      total,
      savLow: Math.round(savLow),
      savHigh: Math.round(savHigh),
      abb,
      roiLow: Math.round(savLow - abb),
      roiHigh: Math.round(savHigh - abb),
    };
  }, [bra, energiKost]);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-6 lg:p-8">
      <motion.div variants={item} className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">Velg din plan</h1>
        <p className="mt-2 text-muted-foreground">Skalér fra verifisering til full porteføljestyring</p>
      </motion.div>

      {/* Tagline */}
      <motion.div variants={item} className="mb-8 text-center">
        <p className="text-lg font-medium text-muted-foreground italic">
          «Crash test for bygninger» — verifiser at tekniske systemer fungerer før de bygges
        </p>
      </motion.div>

      {/* Pricing cards */}
      <motion.div variants={item} className="mb-8 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl border p-6 transition-all ${
              plan.highlight
                ? "border-primary bg-card shadow-lg shadow-primary/10"
                : "border-border bg-card"
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground">
                <Star className="mr-1 inline h-3 w-3" />
                {plan.badge}
              </div>
            )}
            <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-foreground font-mono tabular-nums">{plan.price}</span>
              <span className="text-sm text-muted-foreground">kr/mnd</span>
            </div>
            {plan.priceNote && <p className="text-xs text-muted-foreground">{plan.priceNote}</p>}
            <p className="mt-3 text-sm text-muted-foreground">{plan.desc}</p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="h-4 w-4 shrink-0 text-vh-green" /> {f}
                </li>
              ))}
            </ul>
            <button
              className={`mt-6 w-full rounded-lg py-2.5 text-sm font-semibold transition-colors ${
                plan.highlight
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border border-border bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </motion.div>

      {/* Social proof */}
      <motion.div variants={item} className="mb-12 text-center">
        <p className="mb-4 text-sm font-medium text-muted-foreground">
          Brukt av ledende aktører i norsk byggebransje
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          {["Skanska", "Veidekke", "Statsbygg", "OBOS", "Multiconsult", "Norconsult", "Advansia", "Bravida"].map(name => (
            <span key={name} className="text-lg font-bold text-muted-foreground/40 tracking-wide uppercase">
              {name}
            </span>
          ))}
        </div>
      </motion.div>

      {/* ROI Calculator */}
      <motion.div variants={item} className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-bold text-foreground">ROI-kalkulator</h3>
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs text-muted-foreground">BRA (m²)</label>
            <input
              type="number"
              value={bra}
              onChange={(e) => setBra(Number(e.target.value) || 0)}
              className="mt-1 w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground font-mono tabular-nums"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Energikostnad (kr/m²·år)</label>
            <input
              type="number"
              value={energiKost}
              onChange={(e) => setEnergiKost(Number(e.target.value) || 0)}
              className="mt-1 w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground font-mono tabular-nums"
            />
          </div>
        </div>
        <div className="space-y-2">
          <ROIRow label="Årlig energikostnad" value={`NOK ${roi.total.toLocaleString("no-NO")}`} />
          <ROIRow label="Besparelse 15–25%" value={`${roi.savLow.toLocaleString("no-NO")} – ${roi.savHigh.toLocaleString("no-NO")} kr/år`} />
          <ROIRow label="Abonnement Optimize" value={`${roi.abb.toLocaleString("no-NO")} kr/år`} />
          <div className="flex items-center justify-between rounded-lg bg-vh-green/10 border border-vh-green/30 px-4 py-3">
            <span className="text-sm font-semibold text-foreground">Netto ROI</span>
            <span className="text-sm font-bold text-vh-green font-mono tabular-nums">
              {roi.roiLow.toLocaleString("no-NO")} – {roi.roiHigh.toLocaleString("no-NO")} kr/år
            </span>
          </div>
        </div>
        {roi.roiLow > 0 && (
          <p className="mt-3 text-center text-sm font-semibold text-vh-green">
            ✅ Positiv ROI fra dag én
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

function ROIRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-2.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground font-mono tabular-nums">{value}</span>
    </div>
  );
}
