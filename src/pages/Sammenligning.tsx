import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowDown, ArrowUp, Building2, ChevronDown } from "lucide-react";
import { useSimResult, useOptimizedResult } from "@/lib/SimContext";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

function fmt(n: number) {
  return Math.round(n).toLocaleString("nb-NO");
}

export default function Sammenligning() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const r = useSimResult();
  const opt = useOptimizedResult();

  const savings = r.annualCostNOK - opt.annualCostNOK;
  const energyReductionPct = Math.round(((r.totalEnergyKwhM2 - opt.totalEnergyKwhM2) / r.totalEnergyKwhM2) * 100);

  const rows = [
    {
      param: "Netto energibehov",
      orig: `${Math.round(r.totalEnergyKwhM2)} kWh/m²·år`,
      opt: `${Math.round(opt.totalEnergyKwhM2)} kWh/m²·år`,
      delta: `−${Math.round(((r.totalEnergyKwhM2 - opt.totalEnergyKwhM2) / r.totalEnergyKwhM2) * 100)}%`,
      good: true,
      origPct: 100,
      optPct: Math.round((opt.totalEnergyKwhM2 / r.totalEnergyKwhM2) * 100),
    },
    {
      param: "TEK17-krav",
      orig: r.exceedsTEK17 ? "❌ Overskrider (115)" : "✅ Oppfyller",
      opt: opt.exceedsTEK17 ? "❌ Overskrider (115)" : "✅ Oppfyller",
      delta: "—",
      good: !opt.exceedsTEK17,
      isBool: true,
    },
    {
      param: "SFP-faktor",
      orig: `${r.sfpActual.toFixed(1)} kW/(m³/s)`,
      opt: `${opt.sfpActual.toFixed(1)} kW/(m³/s)`,
      delta: `−${Math.round(((r.sfpActual - opt.sfpActual) / r.sfpActual) * 100)}%`,
      good: true,
      origPct: 100,
      optPct: Math.round((opt.sfpActual / r.sfpActual) * 100),
    },
    {
      param: "Timer >26°C sommer",
      orig: `${r.hoursAbove26} timer`,
      opt: `${opt.hoursAbove26} timer`,
      delta: r.hoursAbove26 > 0 ? `−${Math.round(((r.hoursAbove26 - opt.hoursAbove26) / r.hoursAbove26) * 100)}%` : "0%",
      good: true,
      origPct: 100,
      optPct: r.hoursAbove26 > 0 ? Math.round((opt.hoursAbove26 / r.hoursAbove26) * 100) : 100,
    },
    {
      param: "Årlig energikostnad",
      orig: `NOK ${fmt(r.annualCostNOK)}`,
      opt: `NOK ${fmt(opt.annualCostNOK)}`,
      delta: `−NOK ${fmt(savings)}`,
      good: true,
      origPct: 100,
      optPct: Math.round((opt.annualCostNOK / r.annualCostNOK) * 100),
    },
    {
      param: "CO₂ scope 2",
      orig: `${r.co2Tonnes} tonn/år`,
      opt: `${opt.co2Tonnes} tonn/år`,
      delta: `−${Math.round(((r.co2Tonnes - opt.co2Tonnes) / r.co2Tonnes) * 100)}%`,
      good: true,
      origPct: 100,
      optPct: Math.round((opt.co2Tonnes / r.co2Tonnes) * 100),
    },
    {
      param: "Gjenvinner virkningsgrad",
      orig: `${Math.round(r.heatRecoveryActual * 100)}%`,
      opt: `${Math.round(opt.heatRecoveryActual * 100)}%`,
      delta: `+${Math.round((opt.heatRecoveryActual - r.heatRecoveryActual) * 100)} pp`,
      good: true,
      origPct: Math.round(r.heatRecoveryActual * 100),
      optPct: Math.round(opt.heatRecoveryActual * 100),
    },
  ];

  const investment = Math.round(savings * 3.3);
  const payback = savings > 0 ? (investment / savings).toFixed(1) : "—";

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-6 lg:p-8">
      <motion.div variants={item} className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Sammenligning</h1>
        <p className="text-sm text-muted-foreground">Opprinnelig design vs. optimalisert løsning</p>
      </motion.div>

      <motion.div variants={item} ref={ref} className="mb-6 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-5 py-3.5 text-left font-semibold text-muted-foreground">Parameter</th>
              <th className="px-5 py-3.5 text-left font-semibold text-muted-foreground">Opprinnelig</th>
              <th className="px-5 py-3.5 text-left font-semibold text-muted-foreground">Optimalisert</th>
              <th className="px-5 py-3.5 text-left font-semibold text-muted-foreground">Delta</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <motion.tr
                key={r.param}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="border-b border-border"
              >
                <td className="px-5 py-3.5 font-medium text-foreground">{r.param}</td>
                <td className="px-5 py-3.5 font-mono tabular-nums text-muted-foreground">{r.orig}</td>
                <td className="px-5 py-3.5 font-semibold font-mono tabular-nums text-vh-green">{r.opt}</td>
                <td className="px-5 py-3.5">
                  {r.delta !== "—" ? (
                    <span className="inline-flex items-center gap-1 font-semibold font-mono tabular-nums text-vh-green">
                      {r.good ? <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUp className="h-3.5 w-3.5 text-vh-red" />}
                      {r.delta}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <motion.div variants={item} className="mb-6 rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">Visuell sammenligning</h3>
        <div className="space-y-3">
          {rows.filter((r) => !(r as any).isBool && r.origPct !== undefined).map((r, i) => (
            <div key={r.param} className="flex items-center gap-3">
              <span className="w-48 text-xs text-muted-foreground truncate">{r.param}</span>
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="w-16 text-[10px] text-muted-foreground text-right">Opprinnelig</span>
                  <div className="flex-1 h-3 rounded-full bg-secondary/50 overflow-hidden">
                    <motion.div className="h-full rounded-full bg-muted-foreground/30" initial={{ width: 0 }} animate={inView ? { width: `${r.origPct}%` } : {}} transition={{ delay: i * 0.1 + 0.3, duration: 0.6 }} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-16 text-[10px] text-vh-green text-right">Optimalisert</span>
                  <div className="flex-1 h-3 rounded-full bg-secondary/50 overflow-hidden">
                    <motion.div className="h-full rounded-full bg-vh-green/60" initial={{ width: 0 }} animate={inView ? { width: `${r.optPct}%` } : {}} transition={{ delay: i * 0.1 + 0.5, duration: 0.6 }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item} className="rounded-xl bg-gradient-to-r from-green-950/60 to-emerald-950/40 border border-green-700/40 p-8">
        <div className="text-center">
          <p className="text-sm uppercase tracking-wider text-green-300/70 mb-2">Estimert årlig besparelse</p>
          <motion.p className="text-5xl font-bold font-mono tabular-nums text-green-400" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.6 }}>
            NOK {fmt(savings)}
          </motion.p>
          <p className="mt-2 text-lg text-muted-foreground">
            Tilbakebetalingstid: <span className="font-semibold text-primary font-mono tabular-nums">{payback} år</span>
          </p>
        </div>
      </motion.div>

      {/* Enova-støttevurdering */}
      <EnovaSection energyReduction={energyReductionPct} savings={savings} />
    </motion.div>
  );
}
