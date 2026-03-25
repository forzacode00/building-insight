import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle, Zap, Network, ClipboardList, TrendingUp, Clock, ChevronRight, Upload, Play } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";
import { useNavigate } from "react-router-dom";
import { useSimResult } from "@/lib/SimContext";

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

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return value;
}

function getEnergimerke(kwhM2: number): string {
  if (kwhM2 > 150) return "D";
  if (kwhM2 > 130) return "C";
  if (kwhM2 > 100) return "B";
  return "A";
}

const DAY_LABELS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

export default function Driftsmorgen() {
  const navigate = useNavigate();
  const r = useSimResult();

  const dailyAvg = Math.round((r.totalEnergyKwhM2 * 6000) / 365);
  const normalDaily = Math.round(dailyAvg * 0.93);
  const deltaPct = normalDaily > 0 ? (((dailyAvg - normalDaily) / normalDaily) * 100).toFixed(1) : "0.0";

  const energimerke = getEnergimerke(r.totalEnergyKwhM2);

  // Build sparkline from monthlyKwh — convert monthly kWh/m² to approximate daily kWh
  const energiData = useMemo(() => {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // Pick 7 representative days from recent months
    const recentMonths = r.monthlyKwh.slice(0, 7);
    return recentMonths.map((mKwh, i) => ({
      dag: DAY_LABELS[i],
      kwh: Math.round((mKwh * 6000) / daysInMonth[i % 12]),
    }));
  }, [r.monthlyKwh]);

  const kwhValue = useCountUp(dailyAvg, 1400);
  const pctValue = useCountUp(Math.round(parseFloat(deltaPct) * 10), 1200);

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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            God morgen! Parkveien Kontorbygg
          </h1>
          <p className="text-sm text-muted-foreground">
            Tirsdag 25. mars 2026, kl. 07:32
          </p>
        </div>
      </motion.div>

      {/* CTA Card */}
      <motion.div variants={item} className="mb-8">
        <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 p-6">
          <h2 className="text-lg font-bold text-foreground mb-1">Prøv VirtualHouse-simulatoren</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Se hvordan VirtualHouse bygger og simulerer det tekniske systemet automatisk.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/datainput")}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Upload className="h-4 w-4" />
              Last opp funksjonsbeskrivelse
            </button>
            <button
              onClick={() => navigate("/simulering", { state: { startBuild: true } })}
              className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
            >
              <Play className="h-4 w-4" />
              Se demo-simulering
            </button>
          </div>
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
              <span className="text-sm font-bold text-vh-yellow">Romtemperatur overskredet — Sone 4.etg sør</span>
            </div>
            <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
              Maks 26.4°C kl. 03:12. Settpunkt natt: 19°C. Sannsynlig årsak: soloppvarming fra sørfasade + kjøling av etter kl. 22:00.
            </p>
            <button
              onClick={() => navigate("/simulering", { state: { activeTab: "avvik" } })}
              className="inline-flex items-center gap-1 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
            >
              Undersøk <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Red alert */}
          <div className="rounded-xl border-l-4 border-vh-red bg-card p-5">
            <div className="mb-2 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-vh-red" />
              <span className="text-sm font-bold text-vh-red">SFP over TEK17-grense — AHU-3</span>
            </div>
            <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
              Målt SFP 1.82 kW/(m³/s), krav ≤ 1.5. Mulig årsak: tilsmusset filter eller feil på frekvensomformer.
            </p>
            <button
              onClick={() => navigate("/simulering", { state: { activeTab: "avvik" } })}
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
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex flex-wrap items-end gap-6">
            <div>
              <p className="text-sm text-muted-foreground">I går</p>
              <p className="text-5xl font-bold text-foreground font-mono tabular-nums">
                {kwhValue.toLocaleString("no-NO")} <span className="text-base font-normal font-sans text-muted-foreground">kWh</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Normal (30-dagers snitt)</p>
              <p className="text-xl font-semibold text-muted-foreground font-mono tabular-nums">{normalDaily.toLocaleString("no-NO")} kWh</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-vh-red/15 px-3 py-1">
              <TrendingUp className="h-4 w-4 text-vh-red" />
              <span className="text-sm font-bold text-vh-red font-mono tabular-nums">+{(pctValue / 10).toFixed(1)}% over normalt</span>
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
                <ReferenceLine y={normalDaily} stroke="hsl(0, 84%, 60%)" strokeDasharray="4 4" label={{ value: "Normal", fill: "hsl(0, 84%, 60%)", fontSize: 10, position: "right" }} />
                <Area type="monotone" dataKey="kwh" stroke="hsl(213, 52%, 63%)" fill="url(#energiGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-vh-yellow/30 bg-vh-yellow/10 px-3 py-1.5">
            <span className="text-sm font-medium text-vh-yellow">Energimerke {energimerke} — {Math.round(r.totalEnergyKwhM2)} kWh/m²·år</span>
            <span className="text-xs text-muted-foreground">(TEK17-krav: 115)</span>
          </div>
        </div>
      </motion.section>

      {/* Inneklima-status */}
      <InneklimaSection />

      {/* Tid spart */}
      <motion.section variants={item} className="mb-8">
        <div className="rounded-xl border border-border bg-card p-5">
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
            { icon: Zap, label: "Simuler endring", path: "/simulering", color: "text-vh-yellow", glow: "shadow-[0_0_20px_rgba(234,179,8,0.1)]" },
            { icon: Network, label: "Se nettverkskart", path: "/nettverkskart", color: "text-primary", glow: "shadow-[0_0_20px_rgba(59,130,246,0.1)]" },
            { icon: ClipboardList, label: "Åpne avviksrapport", path: "/simulering", state: { activeTab: "avvik" }, color: "text-vh-green", glow: "shadow-[0_0_20px_rgba(34,197,94,0.1)]" },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path, { state: (action as any).state })}
              className="group flex items-center gap-3 rounded-xl border border-border bg-card p-5 text-left transition-all hover:bg-secondary hover:vh-glow-blue"
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary ${action.glow}`}>
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
            <div key={i} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
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

/* ─── Inneklima-status ─── */

type ComplaintType = "For varmt" | "For kaldt" | "Dårlig luft" | "Trekk" | "Støy";

interface InneklimaEntry {
  time: string;
  zone: string;
  type: ComplaintType;
  status: { color: string; text: string };
}

const ZONES = ["2. etg nord", "2. etg sør", "3. etg", "4. etg nord", "4. etg sør", "5. etg"];
const COMPLAINT_TYPES: { type: ComplaintType; dotColor: string }[] = [
  { type: "For varmt", dotColor: "bg-red-400" },
  { type: "For kaldt", dotColor: "bg-blue-400" },
  { type: "Dårlig luft", dotColor: "bg-yellow-400" },
  { type: "Trekk", dotColor: "bg-green-400" },
  { type: "Støy", dotColor: "bg-purple-400" },
];

const COMPLAINT_DOT_MAP: Record<ComplaintType, string> = {
  "For varmt": "bg-red-400",
  "For kaldt": "bg-blue-400",
  "Dårlig luft": "bg-yellow-400",
  "Trekk": "bg-green-400",
  "Støy": "bg-purple-400",
};

function resolveStatus(zone: string, type: ComplaintType): InneklimaEntry["status"] {
  if (zone === "4. etg sør" && type === "For varmt")
    return { color: "text-emerald-400", text: "Bekreftet: SD-data viser 23.4°C (over 22°C-grense) ✓" };
  if (zone === "3. etg" && type === "Dårlig luft")
    return { color: "text-emerald-400", text: "CO₂: 680 ppm (under 800 ppm-grense) ✓" };
  if (zone === "2. etg nord" && type === "For kaldt")
    return { color: "text-emerald-400", text: "Bekreftet: SD-data viser 19.2°C (under 21°C-grense) ✓" };
  if (type === "Støy")
    return { color: "text-yellow-400", text: "Ingen SD-data for lydnivå" };
  return { color: "text-yellow-400", text: "Ingen SD-data for sone" };
}

const INITIAL_ENTRIES: InneklimaEntry[] = [
  { time: "08:14", zone: "4. etg sør", type: "For varmt", status: { color: "text-emerald-400", text: "Bekreftet: SD-data viser 23.4°C (over 22°C-grense) ✓" } },
  { time: "07:55", zone: "3. etg", type: "Dårlig luft", status: { color: "text-emerald-400", text: "CO₂: 680 ppm (under 800 ppm-grense) ✓" } },
];

function InneklimaSection() {
  const [entries, setEntries] = useState<InneklimaEntry[]>(INITIAL_ENTRIES);
  const [zone, setZone] = useState(ZONES[0]);
  const [complaint, setComplaint] = useState<ComplaintType>(COMPLAINT_TYPES[0].type);

  const handleSubmit = () => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const entry: InneklimaEntry = { time, zone, type: complaint, status: resolveStatus(zone, complaint) };
    setEntries((prev) => [entry, ...prev].slice(0, 5));
  };

  return (
    <motion.section variants={item} className="mb-8">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
        🏢 Inneklima-status — Leietakerrapporter
      </h2>

      {/* Del A — Innmeldingsskjema */}
      <div className="mb-4 flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
        <div className="flex-1 min-w-[140px]">
          <label className="mb-1 block text-xs text-muted-foreground">Etasje/sone</label>
          <select
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground"
          >
            {ZONES.map((z) => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="mb-1 block text-xs text-muted-foreground">Type klage</label>
          <select
            value={complaint}
            onChange={(e) => setComplaint(e.target.value as ComplaintType)}
            className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground"
          >
            {COMPLAINT_TYPES.map((c) => <option key={c.type} value={c.type}>{c.type}</option>)}
          </select>
        </div>
        <button
          onClick={handleSubmit}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
        >
          + Meld inn
        </button>
      </div>

      {/* Del B — Logg */}
      <div className="space-y-2">
        {entries.map((e, i) => (
          <div key={`${e.time}-${i}`} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
            <span className="mt-0.5 shrink-0 rounded-md bg-secondary px-2 py-0.5 text-xs font-mono text-muted-foreground">
              kl. {e.time}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground flex items-center gap-2">
                {e.zone} —
                <span className="inline-flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${COMPLAINT_DOT_MAP[e.type]}`} />
                  {e.type}
                </span>
              </p>
              <p className={`mt-0.5 text-xs ${e.status.color}`}>
                {e.status.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[11px] text-muted-foreground/70">
        Innmeldinger lagres lokalt. Kontakt driftsansvarlig for tiltak.
      </p>
    </motion.section>
  );
}
