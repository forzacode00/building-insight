import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Wifi, Play, X, Undo2, Radio } from "lucide-react";

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

const consequences = [
  { text: "Settpunkt +1.5°C", indent: 0, delay: 0 },
  { text: "Radiator aktuator: 45% → 62% (+17 pp)", indent: 1, delay: 0.3 },
  { text: "Pumpeforbruk: +8%", indent: 1, delay: 0.6 },
  { text: "Fjernvarme retur: 35.1→37.4°C (+2.3°C)", indent: 1, delay: 0.9 },
  { text: "Fjernvarme effektivitet: −3%", indent: 2, delay: 1.2 },
  { text: "Kjølebehov 4.etg sør: −15%", indent: 1, delay: 1.5 },
  { text: "Kjølemaskin driftstimer: −4%", indent: 2, delay: 1.8 },
  { text: "Elkraft besparelse: +2 100 kWh/år", indent: 3, delay: 2.1 },
  { text: "Energikostnad: +12 400/år varme, −5 800/år kjøling", indent: 1, delay: 2.4 },
  { text: "Netto: +NOK 6 600/år", indent: 2, delay: 2.7 },
  { text: "Komfort: Timer >24°C: 87→34 (−61%)", indent: 1, delay: 3.0 },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function SDLive() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [sliderValue, setSliderValue] = useState(22.5);
  const [simState, setSimState] = useState<"idle" | "loading" | "done">("idle");
  const [showModal, setShowModal] = useState(false);
  const [sent, setSent] = useState(false);
  const [undoTimer, setUndoTimer] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);

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
    setTimeout(() => setSimState("done"), 2000);
  };

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
        {/* Feed header */}
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
            <select className="mt-1 w-full rounded border border-border bg-card px-2 py-1.5 text-sm text-foreground">
              <option>Romtemperatur settpunkt 4.etg sør (BACnet/AV:5001)</option>
              <option>Tillufttemp settpunkt AHU-1 (BACnet/AV:5010)</option>
              <option>CO₂ settpunkt kontor (BACnet/AV:5011)</option>
            </select>
          </div>
          <div className="rounded-xl bg-secondary/50 px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Nåværende: 21.0°C</p>
              <p className="text-sm font-bold font-mono tabular-nums text-primary">{sliderValue.toFixed(1)}°C</p>
            </div>
            <input
              type="range"
              min="18"
              max="26"
              step="0.5"
              value={sliderValue}
              onChange={(e) => setSliderValue(parseFloat(e.target.value))}
              className="mt-2 w-full accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>18°C</span><span>26°C</span>
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
          {simState === "done" && (
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
                <SummaryCard label="Energikostnad" value="+NOK 6 600/år" color="text-vh-yellow" />
                <SummaryCard label="Komfort" value="87→34 timer (−61%)" color="text-vh-green" />
                <SummaryCard label="CO₂" value="+0.4 tonn/år" color="text-vh-yellow" />
                <SummaryCard label="Fysisk trygt" value="✅ Innenfor kapasitet" color="text-vh-green" />
              </div>

              <div className="mb-4 rounded-xl border border-vh-yellow/30 bg-vh-yellow/10 px-4 py-2.5 text-sm text-vh-yellow">
                Anbefaling: Moderat merkostnad, vesentlig komfortforbedring
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSimState("idle")}
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
                Endring sendt — BACnet AV:5001 oppdatert til {sliderValue.toFixed(1)}°C
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono tabular-nums text-muted-foreground">
                {Math.floor(undoTimer / 60)}:{String(undoTimer % 60).padStart(2, "0")} gjenstår
              </span>
              <button
                onClick={() => { setSent(false); setSimState("idle"); }}
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
                <ModalRow label="Parameter" value="Romtemp settpunkt 4.etg sør" />
                <ModalRow label="Endring" value={`21.0°C → ${sliderValue.toFixed(1)}°C`} />
                <ModalRow label="BACnet" value="AV:5001" />
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
                  onClick={() => { setShowModal(false); setSent(true); setSimState("idle"); }}
                  className="flex-1 rounded-xl bg-vh-green py-2.5 text-sm font-semibold text-white hover:bg-vh-green/90"
                >
                  Bekreft og send →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
