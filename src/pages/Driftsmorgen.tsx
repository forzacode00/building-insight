import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle, Zap, Network, ClipboardList, TrendingUp, Clock, ChevronRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";

const energiData = [
  { dag: "Man", kwh: 2180 },
  { dag: "Tir", kwh: 2290 },
  { dag: "Ons", kwh: 2150 },
  { dag: "Tor", kwh: 2200 },
  { dag: "Fre", kwh: 2100 },
  { dag: "Lør", kwh: 1400 },
  { dag: "Søn", kwh: 2340 },
];

const historikk = [
  { dato: "12. mars", beskrivelse: "Redusert turtemp 55→50°C", resultat: "Besparelse: NOK 34,000/år" },
  { dato: "28. feb", beskrivelse: "Optimalisert VAV-styring", resultat: "SFP redusert til 1.4" },
  { dato: "14. feb", beskrivelse: "Førstegangs simulering", resultat: "5 avvik identifisert" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Driftsmorgen() {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-screen p-6 lg:p-8"
    >
      {/* Top greeting */}
      <motion.div variants={item} className="mb-8 flex items-center gap-3">
        <span className="text-3xl">☀️</span>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            God morgen! Parkveien Kontorbygg
          </h1>
          <p className="text-sm text-muted-foreground">
            Tirsdag 25. mars 2026, kl. 07:32
          </p>
        </div>
      </motion.div>

      {/* Nattlige hendelser */}
      <motion.section variants={item} className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Nattlige hendelser</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Yellow alert */}
          <div className="rounded-xl border-l-4 border-vh-yellow bg-card p-5">
            <div className="mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-vh-yellow" />
              <span className="text-sm font-bold text-vh-yellow">⚠️ Romtemperatur overskredet — Sone 4.etg sør</span>
            </div>
            <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
              Maks 26.4°C kl. 03:12. Settpunkt natt: 19°C. Sannsynlig årsak: soloppvarming fra sørfasade + kjøling av etter kl. 22:00.
            </p>
            <button
              onClick={() => navigate("/simulering")}
              className="inline-flex items-center gap-1 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
            >
              Undersøk <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Red alert */}
          <div className="rounded-xl border-l-4 border-vh-red bg-card p-5">
            <div className="mb-2 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-vh-red" />
              <span className="text-sm font-bold text-vh-red">🔴 SFP over TEK17-grense — AHU-3</span>
            </div>
            <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
              Målt SFP 1.82 kW/(m³/s), krav ≤ 1.5. Mulig årsak: tilsmusset filter eller feil på frekvensomformer.
            </p>
            <button
              onClick={() => navigate("/simulering")}
              className="inline-flex items-center gap-1 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
            >
              Undersøk <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.section>

      {/* Energistatus */}
      <motion.section variants={item} className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Energistatus i går</h2>
        <div className="rounded-xl bg-card p-5">
          <div className="mb-4 flex flex-wrap items-end gap-6">
            <div>
              <p className="text-sm text-muted-foreground">I går</p>
              <p className="text-3xl font-bold text-foreground">2,340 <span className="text-base font-normal text-muted-foreground">kWh</span></p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Normal (30-dagers snitt)</p>
              <p className="text-xl font-semibold text-muted-foreground">2,180 kWh</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-vh-red/15 px-3 py-1">
              <TrendingUp className="h-4 w-4 text-vh-red" />
              <span className="text-sm font-bold text-vh-red">+7.3% over normalt</span>
            </div>
          </div>

          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energiData}>
                <defs>
                  <linearGradient id="energiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(213, 52%, 63%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(213, 52%, 63%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="dag" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: "hsl(220, 39%, 11%)", border: "1px solid hsl(218, 26%, 18%)", borderRadius: 8, color: "hsl(210, 40%, 96%)" }}
                  labelStyle={{ color: "hsl(215, 20%, 55%)" }}
                  formatter={(v: number) => [`${v} kWh`, "Forbruk"]}
                />
                <Area type="monotone" dataKey="kwh" stroke="hsl(213, 52%, 63%)" fill="url(#energiGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-vh-yellow/30 bg-vh-yellow/10 px-3 py-1.5">
            <span className="text-sm font-medium text-vh-yellow">Energimerke C — 138 kWh/m²·år</span>
            <span className="text-xs text-muted-foreground">(TEK17-krav: 115)</span>
          </div>
        </div>
      </motion.section>

      {/* Tid spart */}
      <motion.section variants={item} className="mb-8">
        <div className="rounded-xl bg-card p-5">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">Analysetid i dag: <span className="text-primary">3 min</span> med VirtualHouse</p>
              <p className="text-sm text-muted-foreground">Manuell ITB-gjennomgang: ~3 uker</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Hurtighandlinger */}
      <motion.section variants={item} className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Hurtighandlinger</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { icon: Zap, label: "Simuler endring", path: "/simulering", color: "text-vh-yellow" },
            { icon: Network, label: "Se nettverkskart", path: "/nettverkskart", color: "text-primary" },
            { icon: ClipboardList, label: "Åpne avviksrapport", path: "/datainput", color: "text-vh-green" },
          ].map((action) => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className="group flex items-center gap-3 rounded-xl bg-card p-4 text-left transition-all hover:bg-secondary hover:vh-glow-blue"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <action.icon className={`h-5 w-5 ${action.color}`} />
              </div>
              <span className="text-sm font-semibold text-foreground">{action.label}</span>
              <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          ))}
        </div>
      </motion.section>

      {/* Prosjekthistorikk */}
      <motion.section variants={item}>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Prosjekthistorikk</h2>
        <div className="space-y-3">
          {historikk.map((entry, i) => (
            <div key={i} className="flex items-start gap-4 rounded-xl bg-card p-4">
              <span className="mt-0.5 shrink-0 rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                {entry.dato}
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{entry.beskrivelse}</p>
                <p className="text-sm text-primary">{entry.resultat}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
