import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Check, Star, Building2, FileText } from "lucide-react";
import { useSimResult, useOptimizedResult } from "@/lib/SimContext";

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
    desc: "Full simulering + SD-integrasjon + AI-drevet What-If",
    features: ["Alt i Verify", "Knowledge Graph", "SD Live", "AI-drevet What-If", "AI konsekvensanalyse", "Skriv til SD"],
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

      {/* Tagline + context */}
      <motion.div variants={item} className="mb-8 text-center">
        <p className="text-lg font-medium text-muted-foreground italic">
          «Crash test for bygninger» — verifiser at tekniske systemer fungerer før de bygges
        </p>
        <p className="mt-3 text-sm text-muted-foreground/70 max-w-lg mx-auto">
          En typisk VVS-konsulentanalyse koster 150 000–400 000 kr og tar 4–8 uker. VirtualHouse gjør tilsvarende på minutter — oppdatert daglig.
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

      {/* Social proof + traction */}
      <motion.div variants={item} className="mb-12">
        <div className="rounded-xl border border-border/40 bg-secondary/10 p-6">
          <p className="mb-4 text-center text-sm font-medium text-muted-foreground">
            Brukt av ledende aktører i norsk byggebransje
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            {["Skanska", "Veidekke", "Statsbygg", "OBOS", "Multiconsult", "Norconsult", "Advansia", "Bravida"].map(name => (
              <span key={name} className="text-sm font-bold text-muted-foreground/30 tracking-wide uppercase">
                {name}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground/60 border-t border-border/30 pt-4">
            <span><span className="font-bold text-foreground/80 text-sm">20+</span> enterprise-kunder</span>
            <span className="h-3 w-px bg-border" />
            <span><span className="font-bold text-foreground/80 text-sm">0%</span> enterprise churn</span>
            <span className="h-3 w-px bg-border" />
            <span><span className="font-bold text-foreground/80 text-sm">150k+</span> snitt årskontrakt NOK</span>
          </div>
        </div>

        {/* Enterprise pricing note */}
        <div className="mt-4 rounded-lg bg-secondary/20 border border-border/30 px-5 py-3 text-center">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Enterprise og setup-prising:</span> For større prosjekter tilbyr vi tilpasset setup (NOK 150–300k) + årlig SaaS-lisens (NOK 50–500k per bygg). <a href="mailto:post@virtualhouse.no" className="text-primary underline underline-offset-2">Kontakt oss for tilbud</a>
          </p>
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

      {/* ESG-finansieringsrapport */}
      <ESGSection />
    </motion.div>
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
  const merkeNow = energyNow > 130 ? "C" : energyNow > 100 ? "B" : "A";
  const merkeOpt = energyOpt > 130 ? "C" : energyOpt > 100 ? "B (estimert)" : "A (estimert)";

  const bankRows = [
    { bank: "DNB", krav: "Energimerke A/B", now: merkeNow, after: merkeOpt, nowOk: merkeNow <= "B", afterOk: !merkeOpt.startsWith("C") },
    { bank: "Danske Bank", krav: "EPC A (etter 2020)", now: merkeNow, after: merkeOpt, nowOk: merkeNow === "A", afterOk: merkeOpt.startsWith("A") },
    { bank: "KLP Bank", krav: "≤TEK17-krav (115)", now: String(energyNow), after: String(energyOpt), nowOk: energyNow <= 115, afterOk: energyOpt <= 115 },
    { bank: "EU-taksonomi", krav: "≤70 kWh/m²·år", now: String(energyNow), after: String(energyOpt), nowOk: energyNow <= 70, afterOk: energyOpt <= 70 },
  ];

  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    const today = new Date().toLocaleDateString("nb-NO");
    win.document.write(`<!DOCTYPE html><html><head><title>ESG-finansieringsrapport</title>
<style>
  body{font-family:system-ui,sans-serif;padding:40px;color:#1a1a2e;font-size:13px}
  h1{font-size:20px;margin-bottom:4px}
  .sub{color:#666;font-size:12px;margin-bottom:20px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px}
  .card{border:1px solid #ddd;border-radius:8px;padding:14px}
  .card h3{margin:0 0 6px;font-size:14px}
  .card .val{font-size:22px;font-weight:700;margin-bottom:4px}
  .card .note{font-size:11px;color:#666}
  .red{color:#dc2626} .yellow{color:#ca8a04} .green{color:#16a34a}
  table{width:100%;border-collapse:collapse;margin-top:16px}
  th,td{border:1px solid #ddd;padding:6px 10px;text-align:left;font-size:12px}
  th{background:#f5f5f5;font-size:10px;text-transform:uppercase}
  .footer{margin-top:24px;border-top:1px solid #ddd;padding-top:10px;font-size:10px;color:#888}
</style></head><body>
  <h1>🏦 ESG-finansieringsrapport</h1>
  <p class="sub">Parkveien Kontorbygg — VirtualHouse™ — ${today}</p>
  <div class="grid">
    <div class="card"><h3>Nåværende</h3>
      <p class="val ${energyNow > 115 ? "red" : "green"}">${energyNow} kWh/m²·år</p>
      <p class="val ${co2Now > 50 ? "red" : "yellow"}">${co2Now} tonn CO₂/år (${co2m2Now} kg/m²)</p>
      <p class="val yellow">Energimerke ${merkeNow}</p>
    </div>
    <div class="card"><h3>Etter optimalisering</h3>
      <p class="val ${energyOpt > 115 ? "yellow" : "green"}">${energyOpt} kWh/m²·år</p>
      <p class="val green">${co2Opt} tonn CO₂/år (${co2m2Opt} kg/m²)</p>
      <p class="val green">Energimerke ${merkeOpt}</p>
    </div>
  </div>
  <h3>Bankkrav-sjekkliste</h3>
  <table>
    <tr><th>Bank</th><th>Grønt lån-krav</th><th>Nåværende</th><th>Etter tiltak</th><th>Status</th></tr>
    ${bankRows.map(b => `<tr><td>${b.bank}</td><td>${b.krav}</td><td>${b.now}</td><td>${b.after}</td><td>${!b.nowOk && b.afterOk ? "⚠️→✅" : b.nowOk ? "✅" : "❌→❌"}</td></tr>`).join("")}
  </table>
  <div class="footer">VirtualHouse™ — Basert på simuleringer. Faktisk energimerke må bekreftes av akkreditert energirådgiver.</div>
</body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <motion.div variants={item} className="mx-auto mt-8 max-w-5xl">
      <div className="mb-2 flex items-center gap-2">
        <Building2 className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">ESG-finansieringsrapport</h2>
      </div>
      <p className="mb-5 text-sm text-muted-foreground">For grønn lånesøknad og EU-taksonomi-vurdering</p>

      {/* Scorecard */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        {/* Nåværende */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Nåværende ESG-status</h3>
          <div className="space-y-3">
            <div className="rounded-lg bg-red-950/30 border border-red-800/40 p-3">
              <p className="text-xl font-bold font-mono tabular-nums text-red-400">{energyNow} kWh/m²·år</p>
              <p className="text-xs text-red-400/80">Over TEK17 (115). Over EU-taksonomi (70).</p>
            </div>
            <div className="rounded-lg bg-yellow-950/20 border border-yellow-800/40 p-3">
              <p className="text-xl font-bold font-mono tabular-nums text-yellow-400">{co2Now} tonn/år = {co2m2Now} kg CO₂/m²·år</p>
              <p className="text-xs text-yellow-400/80">Under EPC D-grense</p>
            </div>
            <div className="rounded-lg bg-yellow-950/20 border border-yellow-800/40 p-3">
              <p className="text-xl font-bold text-yellow-400">Energimerke {merkeNow}</p>
              <p className="text-xs text-yellow-400/80">Kvalifiserer ikke for grønt lån (krever A/B)</p>
            </div>
          </div>
        </div>

        {/* Etter optimalisering */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Etter optimalisering</h3>
          <div className="space-y-3">
            <div className={`rounded-lg p-3 border ${energyOpt <= 115 ? "bg-emerald-950/20 border-emerald-800/40" : "bg-yellow-950/20 border-yellow-800/40"}`}>
              <p className={`text-xl font-bold font-mono tabular-nums ${energyOpt <= 115 ? "text-emerald-400" : "text-yellow-400"}`}>{energyOpt} kWh/m²·år</p>
              <p className={`text-xs ${energyOpt <= 115 ? "text-emerald-400/80" : "text-yellow-400/80"}`}>
                {energyOpt <= 115 ? "Under TEK17 ✅." : "Over TEK17."} {energyOpt <= 70 ? "Under taksonomi ✅." : "Fremdeles over taksonomi (70)."}
              </p>
            </div>
            <div className="rounded-lg bg-emerald-950/20 border border-emerald-800/40 p-3">
              <p className="text-xl font-bold font-mono tabular-nums text-emerald-400">{co2Opt} tonn/år = {co2m2Opt} kg CO₂/m²·år</p>
              <p className="text-xs text-emerald-400/80">Redusert fra {co2Now} tonn</p>
            </div>
            <div className="rounded-lg bg-emerald-950/20 border border-emerald-800/40 p-3">
              <p className="text-xl font-bold text-emerald-400">Energimerke {merkeOpt}</p>
              <p className="text-xs text-emerald-400/80">Kvalifiserer for grønt lån ✅</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bankkrav-sjekkliste */}
      <div className="mb-4 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Bank</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Grønt lån-krav</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Nåværende</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Etter tiltak</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {bankRows.map((b) => (
              <tr key={b.bank} className="border-b border-border/50">
                <td className="px-4 py-2.5 font-medium text-foreground">{b.bank}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{b.krav}</td>
                <td className="px-4 py-2.5 font-mono tabular-nums text-foreground">{b.now}</td>
                <td className="px-4 py-2.5 font-mono tabular-nums text-foreground">{b.after}</td>
                <td className="px-4 py-2.5 text-sm font-semibold">
                  {!b.nowOk && b.afterOk ? (
                    <span className="text-emerald-400">⚠️→✅</span>
                  ) : b.nowOk && b.afterOk ? (
                    <span className="text-emerald-400">✅</span>
                  ) : (
                    <span className="text-red-400">❌→❌</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground/70">
          Basert på simuleringer. Faktisk energimerke må bekreftes av akkreditert energirådgiver.
        </p>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <FileText className="h-4 w-4" />
          Generer ESG-rapport for bankdialog
        </button>
      </div>
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
