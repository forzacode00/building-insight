import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, ArrowUp, TrendingDown } from "lucide-react";

const rows = [
  { param: "Netto energibehov", orig: "138 kWh/m²·år", opt: "110 kWh/m²·år", delta: "−20%", good: true },
  { param: "TEK17-krav", orig: "❌ Overskrider (115)", opt: "✅ Oppfyller", delta: "—", good: true, isBool: true },
  { param: "SFP-faktor", orig: "1.8 kW/(m³/s)", opt: "1.4 kW/(m³/s)", delta: "−22%", good: true },
  { param: "Timer >26°C sommer", orig: "87 timer", opt: "14 timer", delta: "−84%", good: true },
  { param: "Årlig energikostnad", orig: "NOK 1 104 000", opt: "NOK 836 000", delta: "−NOK 268 000", good: true },
  { param: "CO₂ scope 2", orig: "42 tonn/år", opt: "31 tonn/år", delta: "−26%", good: true },
  { param: "Gjenvinner virkningsgrad", orig: "76%", opt: "85%", delta: "+9 pp", good: true },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function Sammenligning() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-6 lg:p-8">
      <motion.div variants={item} className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Sammenligning</h1>
        <p className="text-sm text-muted-foreground">Opprinnelig design vs. optimalisert løsning</p>
      </motion.div>

      {/* Comparison table */}
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

      {/* Green banner */}
      <motion.div
        variants={item}
        className="rounded-xl border border-vh-green/30 bg-vh-green/10 p-6"
      >
        <div className="flex items-center gap-4">
          <TrendingDown className="h-8 w-8 text-vh-green" />
          <div>
            <p className="text-lg font-bold text-foreground">
              Estimert årlig besparelse:{" "}
              <motion.span
                className="text-vh-green font-mono tabular-nums"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6 }}
              >
                NOK 268 000
              </motion.span>
            </p>
            <p className="text-sm text-muted-foreground">
              Tilbakebetalingstid:{" "}
              <span className="font-semibold text-primary font-mono tabular-nums">3.3 år</span>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
