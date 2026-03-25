import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Wifi, Play, X, Undo2, Radio, FileText, ClipboardCheck, Upload, Plug } from "lucide-react";
import { useSimInput, useSimResult } from "@/lib/SimContext";
import { runSimulation, type SimResult, type SimInput } from "@/lib/simulationEngine";

function StatusBadge({ status, note }: { status: "ok" | "warning" | "critical"; note: string }) {
  if (status === "critical") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-red-800/50 bg-red-950/50 px-2.5 py-1 text-xs font-semibold text-red-400">
        <span className="h-2 w-2 rounded-full bg-red-400" />
        {note}
      </span>
    );
  }
  if (status === "warning") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-yellow-800/50 bg-yellow-950/50 px-2.5 py-1 text-xs font-semibold text-yellow-400">
        <span className="h-2 w-2 rounded-full bg-yellow-400" />
        {note}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-green-800/50 bg-green-950/50 px-2.5 py-1 text-xs font-semibold text-green-400">
      <span className="h-2 w-2 rounded-full bg-green-400" />
      {note}
    </span>
  );
}

function getObjColor(obj: string) {
  if (obj.includes("AI:")) return "text-blue-400";
  if (obj.includes("AV:")) return "text-purple-400";
  if (obj.includes("BI:")) return "text-yellow-400";
  if (obj.includes("BO:")) return "text-red-400";
  return "text-vh-purple";
}

const bacnetLines = [
  { time: "12:14:00", obj: "BACnet/AI:1001", desc: "Romtemp kontor 4.etg sør", val: "23.4°C" },
  { time: "12:14:00", obj: "BACnet/AI:1002", desc: "Romtemp kontor 4.etg nord", val: "21.8°C" },
  { time: "12:14:00", obj: "BACnet/AI:2001", desc: "Tillufttemp AHU-1", val: "19.2°C" },
  { time: "12:14:01", obj: "BACnet/AI:3001", desc: "Turtemp radiator", val: "48.2°C" },
  { time: "12:14:01", obj: "BACnet/AI:3002", desc: "Returtemp radiator", val: "35.1°C" },
  { time: "12:14:01", obj: "BACnet/AI:4001", desc: "Isvannstemperatur tur", val: "6.8°C" },
  { time: "12:14:01", obj: "BACnet/AV:5001", desc: "Romtemp settpunkt 4.etg sør", val: "21.0°C" },
  { time: "12:14:02", obj: "BACnet/AV:5010", desc: "Tillufttemp settpunkt AHU-1", val: "19.0°C" },
  { time: "12:14:02", obj: "BACnet/AV:5011", desc: "CO₂ settpunkt kontor", val: "800 ppm" },
  { time: "12:14:02", obj: "BACnet/BI:6001", desc: "Kjølemaskin 1 driftstatus", val: "PÅ" },
  { time: "12:14:02", obj: "BACnet/BO:6002", desc: "Kjølemaskin 1 startkommando", val: "PÅ" },
  { time: "12:14:02", obj: "BACnet/AI:7001", desc: "COP kjølemaskin 1", val: "4.2" },
  { time: "12:14:03", obj: "BACnet/AI:7002", desc: "SFP AHU-1", val: "1.78" },
  { time: "12:14:03", obj: "BACnet/AI:7003", desc: "CO₂ kontor 4.etg", val: "680 ppm" },
  { time: "12:14:03", obj: "BACnet/AI:7004", desc: "VAV-spjeld 4.etg sør", val: "72%" },
];

const liveTable = [
  { param: "Turtemp radiator", design: "55°C", live: "48.2°C", avvik: "−6.8°C", status: "ok" as const, note: "Værkompensert" },
  { param: "Returtemp radiator", design: "40°C", live: "35.1°C", avvik: "−4.9°C", status: "ok" as const, note: "OK" },
  { param: "Tillufttemp AHU-1", design: "19°C", live: "19.2°C", avvik: "+0.2°C", status: "ok" as const, note: "Innenfor ±10%" },
  { param: "SFP AHU-1", design: "1.5", live: "1.78", avvik: "+0.28", status: "critical" as const, note: "Over TEK17" },
  { param: "Romtemp 4.etg sør", design: "21°C", live: "23.4°C", avvik: "+2.4°C", status: "warning" as const, note: "Over settpunkt" },
  { param: "Romtemp 4.etg nord", design: "21°C", live: "21.8°C", avvik: "+0.8°C", status: "ok" as const, note: "Innenfor" },
  { param: "VAV-spjeld 4.etg sør", design: "Behovsstyrt", live: "72%", avvik: "—", status: "warning" as const, note: "Høy last" },
  { param: "Kjølemaskin COP", design: "4.5", live: "4.2", avvik: "−0.3", status: "ok" as const, note: "Normalt" },
  { param: "CO₂ kontor 4.etg", design: "800 ppm", live: "680 ppm", avvik: "−120", status: "ok" as const, note: "Under settpunkt" },
  { param: "Fjernvarme retur", design: "40°C", live: "35.1°C", avvik: "−4.9°C", status: "ok" as const, note: "Bra for fjernvarme" },
];

type WhatIfParam = "setpointHeating" | "sfpDesign" | "heatRecoveryEff";

const whatIfOptions: { key: WhatIfParam; label: string; bacnet: string; unit: string; min: number; max: number; step: number; format: (v: number) => string }[] = [
  { key: "setpointHeating", label: "Romtemperatur settpunkt", bacnet: "BACnet/AV:5001", unit: "°C", min: 18, max: 26, step: 0.5, format: (v) => `${v.toFixed(1)}°C` },
  { key: "sfpDesign", label: "SFP-faktor", bacnet: "BACnet/AV:7002", unit: "kW/(m³/s)", min: 0.8, max: 2.5, step: 0.1, format: (v) => `${v.toFixed(1)}` },
  { key: "heatRecoveryEff", label: "Gjenvinner virkningsgrad", bacnet: "BACnet/AV:5020", unit: "%", min: 0.5, max: 0.95, step: 0.01, format: (v) => `${Math.round(v * 100)}%` },
];

function fmtNOK(n: number) { return `NOK ${Math.round(n).toLocaleString("nb-NO")}`; }
function delta(a: number, b: number) {
  const d = b - a;
  const pct = a !== 0 ? Math.round((d / a) * 100) : 0;
  return `${d >= 0 ? "+" : ""}${pct}%`;
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function SDLive() {
  const { input } = useSimInput();
  const origResult = useSimResult();

  const [visibleLines, setVisibleLines] = useState(0);
  const [selectedParam, setSelectedParam] = useState<WhatIfParam>("setpointHeating");
  const [sliderValue, setSliderValue] = useState(22.5);
  const [simState, setSimState] = useState<"idle" | "loading" | "done">("idle");
  const [modResult, setModResult] = useState<SimResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [sent, setSent] = useState(false);
  const [undoTimer, setUndoTimer] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);

  const paramConfig = useMemo(() => whatIfOptions.find((o) => o.key === selectedParam)!, [selectedParam]);

  // Reset slider when param changes
  useEffect(() => {
    const cfg = whatIfOptions.find((o) => o.key === selectedParam)!;
    const currentVal = selectedParam === "heatRecoveryEff"
      ? input[selectedParam]
      : input[selectedParam] as number;
    // Start slider slightly offset from current for demo appeal
    const offset = selectedParam === "setpointHeating" ? 1.5
      : selectedParam === "sfpDesign" ? -0.3
      : 0.05;
    setSliderValue(Math.min(cfg.max, Math.max(cfg.min, currentVal + offset)));
    setSimState("idle");
    setModResult(null);
  }, [selectedParam, input]);

  useEffect(() => {
    if (visibleLines >= bacnetLines.length) {
      const timeout = setTimeout(() => setVisibleLines(0), 2000);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(() => setVisibleLines((v) => v + 1), 800);
    return () => clearTimeout(timeout);
  }, [visibleLines]);

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [visibleLines]);

  useEffect(() => {
    if (!sent) return;
    setUndoTimer(900);
    const interval = setInterval(() => setUndoTimer((t) => Math.max(0, t - 1)), 1);
    return () => clearInterval(interval);
  }, [sent]);

  const runSim = () => {
    setSimState("loading");
    setTimeout(() => {
      const modified: SimInput = { ...input, [selectedParam]: sliderValue };
      setModResult(runSimulation(modified));
      setSimState("done");
    }, 1500);
  };

  const currentValue = paramConfig.format(input[selectedParam] as number);

  const consequences = useMemo(() => {
    if (!modResult) return [];
    const items: { text: string; indent: number; delay: number }[] = [];
    let d = 0;
    items.push({ text: `${paramConfig.label}: ${currentValue} → ${paramConfig.format(sliderValue)}`, indent: 0, delay: d });
    d += 0.3;
    items.push({ text: `Oppvarming: ${origResult.heatingKwhM2.toFixed(0)} → ${modResult.heatingKwhM2.toFixed(0)} kWh/m²·år (${delta(origResult.heatingKwhM2, modResult.heatingKwhM2)})`, indent: 1, delay: d });
    d += 0.3;
    items.push({ text: `Kjøling: ${origResult.coolingKwhM2.toFixed(0)} → ${modResult.coolingKwhM2.toFixed(0)} kWh/m²·år (${delta(origResult.coolingKwhM2, modResult.coolingKwhM2)})`, indent: 1, delay: d });
    d += 0.3;
    items.push({ text: `Vifter: ${origResult.fansKwhM2.toFixed(0)} → ${modResult.fansKwhM2.toFixed(0)} kWh/m²·år (${delta(origResult.fansKwhM2, modResult.fansKwhM2)})`, indent: 1, delay: d });
    d += 0.3;
    items.push({ text: `Totalt energibehov: ${Math.round(origResult.totalEnergyKwhM2)} → ${Math.round(modResult.totalEnergyKwhM2)} kWh/m²·år (${delta(origResult.totalEnergyKwhM2, modResult.totalEnergyKwhM2)})`, indent: 1, delay: d });
    d += 0.3;
    const costDelta = modResult.annualCostNOK - origResult.annualCostNOK;
    items.push({ text: `Energikostnad: ${fmtNOK(origResult.annualCostNOK)} → ${fmtNOK(modResult.annualCostNOK)} (${costDelta >= 0 ? "+" : ""}${fmtNOK(costDelta)}/år)`, indent: 1, delay: d });
    d += 0.3;
    items.push({ text: `Komfort: ${origResult.hoursAbove26} → ${modResult.hoursAbove26} timer >26°C`, indent: 1, delay: d });
    d += 0.3;
    items.push({ text: `Bygningshelse: ${origResult.healthScore} → ${modResult.healthScore}/100`, indent: 1, delay: d });
    return items;
  }, [modResult, origResult, paramConfig, currentValue, sliderValue]);

  const costDelta = modResult ? modResult.annualCostNOK - origResult.annualCostNOK : 0;
  const co2Delta = modResult ? modResult.co2Tonnes - origResult.co2Tonnes : 0;
  const isWithinCapacity = modResult ? modResult.totalEnergyKwhM2 < 200 : true; // reasonable upper bound

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-6 lg:p-8">
      <motion.div variants={item} className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">SD Live & What-If</h1>
        <p className="text-sm text-muted-foreground">Koble til SD-anlegget, les live verdier, simuler endringer</p>
      </motion.div>

      {/* Connection panel */}
      <motion.div variants={item} className="mb-6 rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Wifi className="h-5 w-5 text-vh-green" />
            <div>
              <p className="text-sm font-semibold text-foreground">Niagara / BACnet IP</p>
              <p className="text-xs text-muted-foreground">Sist synkronisert: 25.03.2026 kl. 12:14</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {["BACnet/IP", "BACnet/SC", "Modbus TCP", "KNX"].map((p) => (
              <span key={p} className="rounded-full bg-vh-green/15 px-2.5 py-1 text-[10px] font-bold text-vh-green">
                {p} ✅
              </span>
            ))}
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
              OPC UA (planlagt)
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="font-mono tabular-nums">847 datapunkter</span>
            <span>Intervall: 60 sek</span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-vh-green animate-pulse" />
              Tilkoblet
            </span>
          </div>
        </div>
      </motion.div>

      {/* BACnet live feed */}
      <motion.div variants={item} className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-vh-red animate-pulse" />
            <span className="rounded bg-vh-red/20 px-2 py-0.5 text-[10px] font-bold text-vh-red uppercase tracking-wider">LIVE</span>
            <span className="text-sm font-semibold text-foreground">BACnet Feed</span>
          </div>
          <span className="text-xs text-muted-foreground font-mono tabular-nums">847 datapunkter · 60s intervall</span>
        </div>
        <div
          ref={feedRef}
          className="h-48 overflow-y-auto rounded-xl border border-border bg-[hsl(220,40%,7%)] p-4 font-mono text-xs"
        >
          {bacnetLines.slice(0, visibleLines).map((line, i) => (
            <motion.div
              key={`${line.obj}-${i}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-3 py-0.5"
            >
              <span className="w-6 text-right text-muted-foreground/40 select-none">{i + 1}</span>
              <span className="text-muted-foreground">{line.time}</span>
              <span className={getObjColor(line.obj)}>{line.obj}</span>
              <span className="flex-1 text-foreground/70">{line.desc}</span>
              <span className="ml-auto font-semibold text-primary font-mono tabular-nums text-right min-w-[80px]">{line.val}</span>
            </motion.div>
          ))}
          <span className="inline-block h-3 w-1.5 animate-pulse bg-primary" />
        </div>
      </motion.div>

      {/* BACnet punktliste verifisering */}
      <BACnetPunktliste />

      {/* Live vs Design table */}
      <motion.div variants={item} className="mb-6">
        <h3 className="mb-2 text-sm font-semibold text-foreground">Design vs. SD Live</h3>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Parameter</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Designverdi</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">SD live</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Avvik</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {liveTable.map((r) => {
                const rowBg = r.status === "critical" ? "bg-vh-red/5" : r.status === "warning" ? "bg-vh-yellow/5" : "";
                return (
                  <tr key={r.param} className={`border-b border-border ${rowBg}`}>
                    <td className="px-4 py-2.5 font-medium text-foreground">{r.param}</td>
                    <td className="px-4 py-2.5 font-mono tabular-nums text-muted-foreground">{r.design}</td>
                    <td className="px-4 py-2.5 font-semibold font-mono tabular-nums text-foreground">{r.live}</td>
                    <td className="px-4 py-2.5 font-mono tabular-nums text-muted-foreground">{r.avvik}</td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={r.status} note={r.note} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* What-If section */}
      <motion.div variants={item} className="mb-6 rounded-xl border border-primary/30 bg-card p-5">
        <h3 className="mb-4 text-lg font-semibold text-foreground">What-If simulering</h3>
        <p className="mb-4 text-sm text-muted-foreground">Simuler endring før den sendes til SD-anlegget</p>

        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-secondary/50 px-4 py-3">
            <p className="text-xs text-muted-foreground">Velg parameter</p>
            <select
              value={selectedParam}
              onChange={(e) => setSelectedParam(e.target.value as WhatIfParam)}
              className="mt-1 w-full rounded border border-border bg-card px-2 py-1.5 text-sm text-foreground"
            >
              {whatIfOptions.map((o) => (
                <option key={o.key} value={o.key}>{o.label} ({o.bacnet})</option>
              ))}
            </select>
          </div>
          <div className="rounded-xl bg-secondary/50 px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Nåværende: {currentValue}</p>
              <p className="text-sm font-bold font-mono tabular-nums text-primary">{paramConfig.format(sliderValue)}</p>
            </div>
            <input
              type="range"
              min={paramConfig.min}
              max={paramConfig.max}
              step={paramConfig.step}
              value={sliderValue}
              onChange={(e) => setSliderValue(parseFloat(e.target.value))}
              className="mt-2 w-full accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>{paramConfig.format(paramConfig.min)}</span>
              <span>{paramConfig.format(paramConfig.max)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={runSim}
          disabled={simState === "loading"}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          <Play className="h-4 w-4" />
          {simState === "loading" ? "Simulerer..." : "Simuler konsekvens"}
        </button>

        {/* Consequence chain */}
        <AnimatePresence>
          {simState === "done" && modResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
              <div className="mb-4 space-y-1 rounded-xl bg-[hsl(220,40%,7%)] p-4 font-mono text-sm">
                {consequences.map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: c.delay * 0.4, duration: 0.3 }}
                    style={{ paddingLeft: c.indent * 24 }}
                    className="py-0.5"
                  >
                    <span className="text-muted-foreground">{c.indent > 0 ? "├──→ " : ""}</span>
                    <span className={c.indent === 0 ? "font-bold text-primary" : "text-foreground/80"}>{c.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Summary */}
              <div className="mb-4 grid gap-3 sm:grid-cols-4">
                <SummaryCard
                  label="Energikostnad"
                  value={`${costDelta >= 0 ? "+" : ""}${fmtNOK(costDelta)}/år`}
                  color={costDelta > 0 ? "text-vh-yellow" : "text-vh-green"}
                />
                <SummaryCard
                  label="Komfort"
                  value={`${origResult.hoursAbove26}→${modResult.hoursAbove26} timer`}
                  color={modResult.hoursAbove26 < origResult.hoursAbove26 ? "text-vh-green" : modResult.hoursAbove26 > origResult.hoursAbove26 ? "text-vh-yellow" : "text-muted-foreground"}
                />
                <SummaryCard
                  label="CO₂"
                  value={`${co2Delta >= 0 ? "+" : ""}${co2Delta.toFixed(1)} tonn/år`}
                  color={co2Delta > 0 ? "text-vh-yellow" : "text-vh-green"}
                />
                <SummaryCard
                  label="Fysisk trygt"
                  value={isWithinCapacity ? "✅ Innenfor kapasitet" : "⚠ Over kapasitet"}
                  color={isWithinCapacity ? "text-vh-green" : "text-vh-red"}
                />
              </div>

              <div className={`mb-4 rounded-xl border px-4 py-2.5 text-sm ${
                costDelta <= 0
                  ? "border-vh-green/30 bg-vh-green/10 text-vh-green"
                  : modResult.hoursAbove26 < origResult.hoursAbove26
                    ? "border-vh-yellow/30 bg-vh-yellow/10 text-vh-yellow"
                    : "border-vh-red/30 bg-vh-red/10 text-vh-red"
              }`}>
                {costDelta <= 0
                  ? `Anbefaling: Besparelse ${fmtNOK(Math.abs(costDelta))}/år, helsescore ${origResult.healthScore}→${modResult.healthScore}`
                  : modResult.hoursAbove26 < origResult.hoursAbove26
                    ? "Anbefaling: Moderat merkostnad, vesentlig komfortforbedring"
                    : "Advarsel: Økte kostnader uten komfortgevinst"
                }
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setSimState("idle"); setModResult(null); }}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
                >
                  <X className="h-4 w-4" /> Forkast
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-vh-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-vh-green/90"
                >
                  <CheckCircle2 className="h-4 w-4" /> Godkjenn og send til SD
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Undo banner */}
      <AnimatePresence>
        {sent && undoTimer > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mb-6 flex items-center justify-between rounded-xl border border-vh-green/30 bg-vh-green/10 px-5 py-3"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-vh-green" />
              <span className="text-sm text-foreground">
                Endring sendt — {paramConfig.bacnet} oppdatert til {paramConfig.format(sliderValue)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono tabular-nums text-muted-foreground">
                {Math.floor(undoTimer / 60)}:{String(undoTimer % 60).padStart(2, "0")} gjenstår
              </span>
              <button
                onClick={() => { setSent(false); setSimState("idle"); setModResult(null); }}
                className="inline-flex items-center gap-1 rounded-xl bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/80"
              >
                <Undo2 className="h-3 w-3" /> Angre
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl"
            >
              <h3 className="mb-4 text-lg font-bold text-foreground">Bekreft endring til SD-anlegg</h3>
              <div className="mb-4 space-y-2 text-sm">
                <ModalRow label="Parameter" value={paramConfig.label} />
                <ModalRow label="Endring" value={`${currentValue} → ${paramConfig.format(sliderValue)}`} />
                <ModalRow label="BACnet" value={paramConfig.bacnet} />
                <ModalRow label="BACnet prioritet" value="8 (Manual Operator)" />
                <ModalRow label="Overordnet av" value="Prioritet 1–7 (Safety, Fire)" />
              </div>
              <div className="mb-4 space-y-1">
                <ConfirmCheck text="Simulert konsekvens verifisert" />
                <ConfirmCheck text="Fysiske grenser sjekket" />
                <ConfirmCheck text="BACnet Priority Array respektert" />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-border bg-secondary py-2.5 text-sm font-medium text-foreground hover:bg-secondary/80"
                >
                  Avbryt
                </button>
                <button
                  onClick={() => { setShowModal(false); setSent(true); setSimState("idle"); setModResult(null); }}
                  className="flex-1 rounded-xl bg-vh-green py-2.5 text-sm font-semibold text-white hover:bg-vh-green/90"
                >
                  Bekreft og send →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overleveringssjekkliste */}
      <OverleveringSjekkliste />
    </motion.div>
  );
}

function SummaryCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-5">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className={`text-sm font-bold font-mono tabular-nums ${color}`}>{value}</p>
    </div>
  );
}

function ModalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between rounded-xl bg-secondary/50 px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground font-mono tabular-nums">{value}</span>
    </div>
  );
}

function ConfirmCheck({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-vh-green">
      <CheckCircle2 className="h-3.5 w-3.5" />
      <span>{text}</span>
    </div>
  );
}

/* ─── Overleveringssjekkliste ─── */

interface ChecklistRow {
  nr: number;
  system: string;
  parameter: string;
  design: string;
  measured: string;
  deviation: string;
  status: "ok" | "warning" | "critical";
  statusText: string;
  checked: boolean;
}

const INITIAL_CHECKLIST: ChecklistRow[] = [
  { nr: 1, system: "Varme (32)", parameter: "Turtemp radiator", design: "55°C", measured: "48.2°C", deviation: "−6.8°C", status: "ok", statusText: "Værkompensert", checked: true },
  { nr: 2, system: "Varme (32)", parameter: "Returtemp radiator", design: "40°C", measured: "35.1°C", deviation: "−4.9°C", status: "ok", statusText: "OK", checked: true },
  { nr: 3, system: "Luft (36)", parameter: "Tillufttemp AHU-1", design: "19°C", measured: "19.2°C", deviation: "+0.2°C", status: "ok", statusText: "Innenfor", checked: true },
  { nr: 4, system: "Luft (36)", parameter: "SFP AHU-1", design: "1.5", measured: "1.78", deviation: "+0.28", status: "critical", statusText: "Over TEK17", checked: false },
  { nr: 5, system: "Komfort", parameter: "Romtemp 4.etg sør", design: "21°C", measured: "23.4°C", deviation: "+2.4°C", status: "warning", statusText: "Over settpunkt", checked: false },
  { nr: 6, system: "Kjøling (37)", parameter: "Isvannstemperatur", design: "6°C", measured: "6.8°C", deviation: "+0.8°C", status: "ok", statusText: "OK", checked: true },
  { nr: 7, system: "Luft (36)", parameter: "CO₂ kontor 4.etg", design: "800 ppm", measured: "680 ppm", deviation: "−120", status: "ok", statusText: "Under grense", checked: true },
  { nr: 8, system: "Kjøling (35)", parameter: "COP kjølemaskin", design: "4.5", measured: "4.2", deviation: "−0.3", status: "ok", statusText: "Normalt", checked: true },
  { nr: 9, system: "Varme (32)", parameter: "Fjernvarme retur", design: "40°C", measured: "35.1°C", deviation: "−4.9°C", status: "ok", statusText: "OK", checked: true },
  { nr: 10, system: "Luft (36)", parameter: "VAV 4.etg sør", design: "Behovsstyrt", measured: "72%", deviation: "—", status: "warning", statusText: "Høy last", checked: false },
];

function OverleveringSjekkliste() {
  const [rows, setRows] = useState<ChecklistRow[]>(INITIAL_CHECKLIST);

  const toggleCheck = (nr: number) => {
    setRows((prev) => prev.map((r) => (r.nr === nr ? { ...r, checked: !r.checked } : r)));
  };

  const approved = rows.filter((r) => r.checked).length;
  const warnings = rows.filter((r) => r.status === "warning" && !r.checked).length;
  const critical = rows.filter((r) => r.status === "critical" && !r.checked).length;
  const pct = Math.round((approved / rows.length) * 100);

  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Overleveringsdokument — Parkveien Kontorbygg</title>
<style>
  body { font-family: system-ui, sans-serif; padding: 40px; color: #1a1a2e; font-size: 13px; }
  h1 { font-size: 20px; margin-bottom: 2px; }
  .sub { color: #666; font-size: 12px; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  th, td { border: 1px solid #ddd; padding: 6px 10px; text-align: left; }
  th { background: #f5f5f5; font-size: 11px; text-transform: uppercase; }
  .critical { background: #fef2f2; }
  .warning { background: #fefce8; }
  .footer { margin-top: 24px; border-top: 1px solid #ddd; padding-top: 10px; font-size: 10px; color: #888; }
</style></head><body>
  <h1>✅ Overleveringsdokument</h1>
  <p class="sub">Parkveien Kontorbygg — NS 6450:2016 innreguleringskontroll<br/>Generert: ${new Date().toLocaleDateString("nb-NO")} kl. ${new Date().toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })}</p>
  <p><strong>${approved} av ${rows.length}</strong> punkter godkjent (${pct}%)</p>
  <table>
    <tr><th>#</th><th>System</th><th>Parameter</th><th>Design</th><th>Målt</th><th>Avvik</th><th>Status</th><th>Kvittert</th></tr>
    ${rows.map((r) => `<tr class="${r.status === "critical" ? "critical" : r.status === "warning" && !r.checked ? "warning" : ""}">
      <td>${r.nr}</td><td>${r.system}</td><td>${r.parameter}</td><td>${r.design}</td><td>${r.measured}</td><td>${r.deviation}</td><td>${r.statusText}</td><td>${r.checked ? "☑" : "☐"}</td>
    </tr>`).join("")}
  </table>
  <div class="footer">VirtualHouse™ Investor Demo v1.0 — NS 6450:2016 innreguleringskontroll</div>
</body></html>`);
    win.document.close();
    win.print();
  };

  const rowBg = (r: ChecklistRow) => {
    if (r.status === "critical" && !r.checked) return "bg-red-950/30";
    if (r.status === "warning" && !r.checked) return "bg-yellow-950/20";
    return "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-6"
    >
      <div className="mb-2 flex items-center gap-2">
        <ClipboardCheck className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Overleveringsstatus — Parkveien Kontorbygg</h2>
      </div>
      <p className="mb-5 text-sm text-muted-foreground">NS 6450:2016 innreguleringskontroll</p>

      {/* Progress */}
      <div className="mb-4 rounded-xl border border-border bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            {approved} av {rows.length} punkter godkjent
          </span>
          <span className="text-sm font-mono tabular-nums text-muted-foreground">{pct}%</span>
        </div>
        <div className="mb-3 h-3 w-full overflow-hidden rounded-full bg-secondary">
          <motion.div
            className="h-full rounded-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-green-800/50 bg-green-950/50 px-2.5 py-1 text-xs font-semibold text-green-400">
            ✅ {approved} Godkjent
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-yellow-800/50 bg-yellow-950/50 px-2.5 py-1 text-xs font-semibold text-yellow-400">
            ⚠️ {warnings} Avvik
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-red-800/50 bg-red-950/50 px-2.5 py-1 text-xs font-semibold text-red-400">
            ❌ {critical} Kritisk
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">#</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">System</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Parameter</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Design</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Målt</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Avvik</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Status</th>
              <th className="px-3 py-2.5 text-center text-xs font-semibold text-muted-foreground">Kvittert</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.nr} className={`border-b border-border/50 transition-colors ${rowBg(r)}`}>
                <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{r.nr}</td>
                <td className="px-3 py-2 text-foreground">{r.system}</td>
                <td className="px-3 py-2 font-medium text-foreground">{r.parameter}</td>
                <td className="px-3 py-2 font-mono tabular-nums text-muted-foreground">{r.design}</td>
                <td className="px-3 py-2 font-mono tabular-nums text-foreground">{r.measured}</td>
                <td className="px-3 py-2 font-mono tabular-nums text-foreground">{r.deviation}</td>
                <td className="px-3 py-2">
                  {r.status === "critical" ? (
                    <span className="text-xs font-semibold text-red-400">❌ {r.statusText}</span>
                  ) : r.status === "warning" ? (
                    <span className="text-xs font-semibold text-yellow-400">⚠️ {r.statusText}</span>
                  ) : (
                    <span className="text-xs font-semibold text-green-400">✅ {r.statusText}</span>
                  )}
                </td>
                <td className="px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={r.checked}
                    onChange={() => toggleCheck(r.nr)}
                    className="h-4 w-4 rounded border-border accent-emerald-500 cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handlePrint}
        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
      >
        <FileText className="h-4 w-4" />
        Generer overleveringsdokument
      </button>
    </motion.div>
  );
}
