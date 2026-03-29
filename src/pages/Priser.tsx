import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Star, Zap, Building2, TrendingUp, Calculator, ChevronDown, Coins, ArrowRight, Info } from "lucide-react";
import { useSimResult, useOptimizedResult } from "@/lib/SimContext";
import { DemoBanner } from "@/components/DemoBanner";

/* ───── Token costs per action ───── */
const tokenCosts = [
  { action: "Helårssimulering (8 760 timer)", tokens: 100, desc: "Én komplett simulering av ett bygg" },
  { action: "Scenariosammenligning", tokens: 25, desc: "Sammenlign to scenarier mot hverandre" },
  { action: "What-If-analyse", tokens: 10, desc: "Simuler én parameterendring" },
  { action: "Avviksrapport (PDF)", tokens: 15, desc: "Generer og last ned rapport" },
  { action: "TEK17-samsvarsrapport", tokens: 15, desc: "Komplett samsvarsdokument" },
  { action: "ESG-rapport", tokens: 20, desc: "EU Taxonomy og bankdialog" },
  { action: "SD Live — daglig synk", tokens: 2, desc: "Per dag med live-data" },
  { action: "AI-konsekvensanalyse", tokens: 20, desc: "AI vurderer endring mot fysikkmotor" },
];

/* ───── Plans ───── */
const plans = [
  {
    name: "Starter",
    price: "0",
    priceLabel: "Gratis",
    tokens: 200,
    tokenLabel: "200 tokens inkludert",
    desc: "Prøv VirtualHouse på ett bygg. Perfekt for å evaluere plattformen.",
    features: ["Datainput + simulering", "Sammenligning", "Avviksrapport", "Gyldig i 30 dager"],
    cta: "Kom i gang gratis",
    highlight: false,
    color: "border-border/50",
  },
  {
    name: "Professional",
    price: "4 900",
    priceLabel: "kr/mnd",
    tokens: 500,
    tokenLabel: "500 tokens/mnd inkludert",
    desc: "For rådgivere og driftsteam som jobber med 1–3 bygg.",
    features: ["Alt i Starter", "Knowledge Graph", "SD Live-integrasjon", "What-If-analyser", "AI-konsekvensanalyse", "Ubegrenset brukere"],
    cta: "Start 14-dagers prøveperiode",
    highlight: true,
    badge: "Mest populær",
    color: "border-primary/40",
  },
  {
    name: "Enterprise",
    price: "Tilpasset",
    priceLabel: "",
    tokens: null,
    tokenLabel: "Ubegrenset tokens",
    desc: "For eiendomsforvaltere med portefølje. Volumprising.",
    features: ["Alt i Professional", "Portefølje-dashboard", "Benchmarking på tvers", "ESG-rapportering", "API-tilgang", "Dedikert support"],
    cta: "Kontakt salg",
    highlight: false,
    color: "border-border/50",
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function Priser() {
  const [bra, setBra] = useState(6000);
  const [energiKost, setEnergiKost] = useState(184);
  const [showTokens, setShowTokens] = useState(false);

  const roi = useMemo(() => {
    const total = bra * energiKost;
    const savLow = total * 0.15;
    const savHigh = total * 0.25;
    const abb = 4900 * 12;
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
      {/* Header */}
      <motion.div variants={item} className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-foreground">Enkel, forutsigbar prising</h1>
        <p className="mt-2 text-muted-foreground">Betal for det du bruker. Hver plan inkluderer simuleringstokens — kjøp flere når du trenger det.</p>
        <DemoBanner />
      </motion.div>

      {/* Context */}
      <motion.div variants={item} className="mb-8 text-center">
        <p className="text-sm text-muted-foreground/60 max-w-lg mx-auto">
          En typisk VVS-konsulentanalyse koster 150 000–400 000 kr og tar 4–8 uker. VirtualHouse gjør tilsvarende på minutter.
        </p>
      </motion.div>

      {/* Pricing cards */}
      <motion.div variants={item} className="mb-10 grid gap-5 lg:grid-cols-3 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl border p-6 transition-all flex flex-col ${plan.color} ${
              plan.highlight ? "bg-primary/5 shadow-lg shadow-primary/10" : "bg-card/30"
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-primary-foreground">
                  <Star className="h-3 w-3" /> {plan.badge}
                </span>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                {plan.price === "0" ? (
                  <span className="text-3xl font-extrabold text-vh-green font-mono">{plan.priceLabel}</span>
                ) : plan.price === "Tilpasset" ? (
                  <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                ) : (
                  <>
                    <span className="text-3xl font-extrabold text-foreground font-mono tabular-nums">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.priceLabel}</span>
                  </>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{plan.desc}</p>
            </div>

            {/* Token badge */}
            <div className={`mb-4 rounded-lg px-3 py-2 flex items-center gap-2 ${
              plan.tokens === null ? "bg-primary/10 border border-primary/20" :
              plan.tokens >= 500 ? "bg-primary/10 border border-primary/20" :
              "bg-secondary/50 border border-border/30"
            }`}>
              <Coins className={`h-4 w-4 ${plan.tokens === null ? "text-primary" : plan.tokens >= 500 ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-xs font-semibold ${plan.tokens === null ? "text-primary" : plan.tokens >= 500 ? "text-primary" : "text-foreground"}`}>
                {plan.tokenLabel}
              </span>
            </div>

            {/* Features */}
            <ul className="space-y-2 flex-1 mb-5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs">
                  <Check className="h-3.5 w-3.5 text-vh-green shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button className={`w-full rounded-lg py-2.5 text-sm font-semibold transition-colors ${
              plan.highlight
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}>
              {plan.cta}
            </button>
          </div>
        ))}
      </motion.div>

      {/* Token pricing table */}
      <motion.div variants={item} className="mb-10 max-w-3xl mx-auto">
        <button
          onClick={() => setShowTokens(!showTokens)}
          className="w-full flex items-center justify-between rounded-xl border border-border/40 bg-card/30 px-5 py-4 text-left transition-colors hover:bg-secondary/20"
        >
          <div className="flex items-center gap-3">
            <Coins className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">Hva koster tokens?</p>
              <p className="text-xs text-muted-foreground">Se hva hver handling koster i tokens, og kjøp ekstra ved behov</p>
            </div>
          </div>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${showTokens ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {showTokens && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-3 rounded-xl border border-border/40 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/30 bg-secondary/20">
                      <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs">Handling</th>
                      <th className="px-4 py-3 text-right font-semibold text-muted-foreground text-xs">Tokens</th>
                      <th className="px-4 py-3 text-left font-semibold text-muted-foreground text-xs hidden sm:table-cell">Beskrivelse</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokenCosts.map((t, i) => (
                      <tr key={t.action} className={`border-b border-border/20 ${i % 2 === 0 ? "" : "bg-secondary/5"}`}>
                        <td className="px-4 py-2.5 font-medium text-foreground text-xs">{t.action}</td>
                        <td className="px-4 py-2.5 text-right">
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary font-mono tabular-nums">
                            {t.tokens}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground hidden sm:table-cell">{t.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="border-t border-border/30 bg-secondary/10 px-4 py-3 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Trenger du flere tokens? Ekstra pakker fra <span className="font-bold text-foreground">kr 490</span> for 100 tokens.
                  </p>
                  <p className="text-[10px] text-muted-foreground/50">Ubrukte tokens ruller over til neste måned</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Example: What 500 tokens gets you */}
      <motion.div variants={item} className="mb-10 max-w-3xl mx-auto">
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Hva får du for 500 tokens/mnd? (Professional-planen)</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: "3", label: "Helårssimuleringer", sub: "300 tokens" },
              { value: "4", label: "What-If-analyser", sub: "40 tokens" },
              { value: "2", label: "Avviksrapporter", sub: "30 tokens" },
              { value: "30", label: "Dager SD Live", sub: "60 tokens" },
            ].map((ex) => (
              <div key={ex.label} className="rounded-lg bg-card/50 border border-border/30 px-3 py-2.5 text-center">
                <p className="text-2xl font-extrabold text-primary font-mono tabular-nums">{ex.value}</p>
                <p className="text-[10px] font-medium text-foreground">{ex.label}</p>
                <p className="text-[9px] text-muted-foreground/50">{ex.sub}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-muted-foreground/50 text-center">= 430 tokens brukt · 70 tokens til overs → ruller over</p>
        </div>
      </motion.div>

      {/* Social proof + traction */}
      <motion.div variants={item} className="mb-10 max-w-3xl mx-auto">
        <div className="rounded-xl border border-border/30 bg-secondary/10 p-5">
          <div className="flex flex-wrap justify-center gap-5 mb-3">
            {["Skanska", "Veidekke", "Statsbygg", "OBOS", "Multiconsult", "Norconsult", "Bravida"].map(name => (
              <span key={name} className="text-xs font-bold text-muted-foreground/25 tracking-wide uppercase">{name}</span>
            ))}
          </div>
          <div className="flex items-center justify-center gap-5 text-[11px] text-muted-foreground/50 border-t border-border/20 pt-3">
            <span><span className="font-bold text-foreground/70">20+</span> enterprise-kunder</span>
            <span className="h-3 w-px bg-border/30" />
            <span><span className="font-bold text-foreground/70">0%</span> churn</span>
            <span className="h-3 w-px bg-border/30" />
            <span><span className="font-bold text-foreground/70">150k+</span> snitt årskontrakt</span>
          </div>
        </div>
      </motion.div>

      {/* ROI Calculator */}
      <motion.div variants={item} className="mb-10 mx-auto max-w-2xl rounded-2xl border border-border/40 bg-card/30 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">ROI-kalkulator</h3>
        </div>
        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs text-muted-foreground">BRA (m²)</label>
            <input
              type="number"
              value={bra}
              onChange={(e) => setBra(Number(e.target.value) || 0)}
              className="mt-1 w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm text-foreground font-mono tabular-nums focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Energikostnad (kr/m²·år)</label>
            <input
              type="number"
              value={energiKost}
              onChange={(e) => setEnergiKost(Number(e.target.value) || 0)}
              className="mt-1 w-full rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm text-foreground font-mono tabular-nums focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div className="space-y-2">
          <ROIRow label="Årlig energikostnad" value={`NOK ${roi.total.toLocaleString("no-NO")}`} />
          <ROIRow label="Besparelse 15–25%" value={`${roi.savLow.toLocaleString("no-NO")} – ${roi.savHigh.toLocaleString("no-NO")} kr/år`} />
          <ROIRow label="VirtualHouse Professional" value={`${roi.abb.toLocaleString("no-NO")} kr/år`} />
          <div className="flex items-center justify-between rounded-lg bg-vh-green/10 border border-vh-green/30 px-4 py-3">
            <span className="text-sm font-semibold text-foreground">Netto ROI</span>
            <span className="text-sm font-bold text-vh-green font-mono tabular-nums">
              {roi.roiLow.toLocaleString("no-NO")} – {roi.roiHigh.toLocaleString("no-NO")} kr/år
            </span>
          </div>
        </div>
        {roi.roiLow > 0 && (
          <p className="mt-3 text-center text-sm font-semibold text-vh-green">Positiv ROI fra dag én</p>
        )}
      </motion.div>

      {/* ESG-finansieringsrapport */}
      <ESGSection />

      {/* Enterprise note */}
      <motion.div variants={item} className="mb-8 max-w-2xl mx-auto">
        <div className="rounded-lg bg-secondary/20 border border-border/30 px-5 py-3 text-center">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Enterprise og tilpasset setup:</span> For større prosjekter med behov for dedikert onboarding, API-integrasjon eller volumprising — <a href="mailto:post@virtualhouse.no" className="text-primary underline underline-offset-2">kontakt oss</a>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ROIRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-secondary/20 px-4 py-2.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground font-mono tabular-nums">{value}</span>
    </div>
  );
}

/* ─── ESG-finansieringsrapport ─── */
function ESGSection() {
  const r = useSimResult();
  const opt = useOptimizedResult();

  const co2Now = r.co2Tonnes;
  const co2Opt = opt.co2Tonnes;
  const co2m2Now = ((co2Now * 1000) / 6000).toFixed(1);
  const co2m2Opt = ((co2Opt * 1000) / 6000).toFixed(1);
  const energyNow = Math.round(r.totalEnergyKwhM2);
  const energyOpt = Math.round(opt.totalEnergyKwhM2);

  const energyDelta = energyOpt - energyNow;
  const co2Delta = co2Opt - co2Now;

  const bankTable = [
    { bank: "DNB", krav: "Energimerke A/B", now: "B", after: "B (estimert)", ok: true },
    { bank: "Danske Bank", krav: "EPC A (etter 2020)", now: "B", after: "B (estimert)", ok: false },
    { bank: "KLP Bank", krav: `≤TEK17-krav (115)`, now: String(energyNow), after: String(energyOpt), ok: energyOpt <= 115 },
    { bank: "EU-taksonomi", krav: "≤70 kWh/m²·år", now: String(energyNow), after: String(energyOpt), ok: energyOpt <= 70 },
  ];

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
      className="mb-10 mx-auto max-w-3xl"
    >
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">ESG-finansieringsrapport</h2>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">For grønn lånesøknad og EU-taksonomivurdering.</p>

      <div className="grid gap-4 sm:grid-cols-2 mb-4">
        <div className="rounded-xl border border-border/40 bg-card/30 p-4">
          <p className="text-xs text-muted-foreground mb-2">Nåværende ESG-status</p>
          <div className="space-y-2">
            <div className="rounded-lg bg-vh-red/10 border border-vh-red/20 px-3 py-2">
              <span className="text-sm font-bold text-vh-red font-mono">{energyNow} kWh/m²·år</span>
              <p className="text-[10px] text-muted-foreground">Over TEK17 ({115}). Over EU-taksonomi (70).</p>
            </div>
            <div className="rounded-lg bg-vh-yellow/10 border border-vh-yellow/20 px-3 py-2">
              <span className="text-sm font-bold text-vh-yellow font-mono">{co2Now.toFixed(1)} tonn/år = {co2m2Now} kg CO₂/m²·år</span>
              <p className="text-[10px] text-muted-foreground">Under EPC D-grense</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border/40 bg-card/30 p-4">
          <p className="text-xs text-muted-foreground mb-2">Etter optimalisering</p>
          <div className="space-y-2">
            <div className={`rounded-lg px-3 py-2 ${energyOpt <= 115 ? "bg-vh-green/10 border border-vh-green/20" : "bg-vh-yellow/10 border border-vh-yellow/20"}`}>
              <span className={`text-sm font-bold font-mono ${energyOpt <= 115 ? "text-vh-green" : "text-vh-yellow"}`}>{energyOpt} kWh/m²·år</span>
              <p className="text-[10px] text-muted-foreground">{energyOpt <= 115 ? "Under TEK17 ✓" : "Fremdeles over TEK17"}. Fremdeles over taksonomi (70).</p>
            </div>
            <div className="rounded-lg bg-vh-green/10 border border-vh-green/20 px-3 py-2">
              <span className="text-sm font-bold text-vh-green font-mono">{co2Opt.toFixed(1)} tonn/år = {co2m2Opt} kg CO₂/m²·år</span>
              <p className="text-[10px] text-muted-foreground">Redusert fra {co2Now.toFixed(1)} tonn</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bank table */}
      <div className="overflow-hidden rounded-xl border border-border/40">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30 bg-secondary/20">
              <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground text-xs">Bank</th>
              <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground text-xs">Grønt lån-krav</th>
              <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground text-xs">Nåværende</th>
              <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground text-xs">Etter tiltak</th>
              <th className="px-4 py-2.5 text-left font-semibold text-muted-foreground text-xs">Status</th>
            </tr>
          </thead>
          <tbody>
            {bankTable.map((row) => (
              <tr key={row.bank} className="border-b border-border/20">
                <td className="px-4 py-2.5 font-medium text-foreground text-xs">{row.bank}</td>
                <td className="px-4 py-2.5 text-muted-foreground text-xs">{row.krav}</td>
                <td className="px-4 py-2.5 font-mono tabular-nums text-xs">{row.now}</td>
                <td className="px-4 py-2.5 font-mono tabular-nums text-xs">{row.after}</td>
                <td className="px-4 py-2.5">
                  {row.ok ? (
                    <span className="text-vh-green text-xs font-medium">✓</span>
                  ) : (
                    <span className="text-vh-red text-xs font-medium">✕</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[10px] text-muted-foreground/40">Basert på simuleringer. Faktisk energimerke må bekreftes av akkreditert energirådgiver.</p>
    </motion.div>
  );
}
