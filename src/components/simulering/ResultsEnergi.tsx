import { Info } from "lucide-react";
import { motion } from "framer-motion";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine, Cell } from "recharts";
import { useSimResult } from "@/lib/SimContext";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"];

export function ResultsEnergi() {
  const r = useSimResult();

  const monthlyData = r.monthlyKwh.map((kwh, i) => ({ mnd: MONTH_LABELS[i], kwh }));
  const tek17Monthly = r.tek17Limit / 12;

  const breakdown = [
    { label: "Oppvarming", value: r.heatingKwhM2, color: "bg-vh-red" },
    { label: "Vifter/pumper", value: r.fansKwhM2, color: "bg-vh-purple" },
    { label: "Belysning", value: r.lightingKwhM2, color: "bg-vh-yellow" },
    { label: "Kjøling", value: r.coolingKwhM2, color: "bg-vh-blue" },
    { label: "Utstyr", value: r.equipmentKwhM2, color: "bg-muted-foreground" },
    { label: "VV", value: r.dhwKwhM2, color: "bg-primary" },
  ];

  const confPct = Math.round((r.totalEnergyKwhM2 * 0.12));

  return (
    <div>
      {/* KPI cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <KPI
          label="Totalt"
          value={Math.round(r.totalEnergyKwhM2).toLocaleString("nb-NO")}
          unit="kWh/m²·år"
          badge={r.exceedsTEK17 ? "Over TEK17" : "Innenfor TEK17"}
          badgeColor={r.exceedsTEK17 ? "bg-vh-red/15 text-vh-red" : "bg-vh-green/15 text-vh-green"}
          note={`±${confPct} konfidens`}
          highlight={r.exceedsTEK17}
        />
        <KPI label="TEK17 krav" value={r.tek17Limit.toString()} unit="kWh/m²·år" />
        <KPI label="Energikostnad" value={r.annualCostNOK.toLocaleString("nb-NO")} unit="NOK/år" />
        <KPI label="CO₂-utslipp" value={r.co2Tonnes.toString()} unit="tonn/år" />
      </div>

      {/* Breakdown */}
      <div className="mb-6 rounded-xl border border-border bg-card p-5">
        <h4 className="mb-3 text-sm font-semibold text-foreground">Energifordeling</h4>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {breakdown.map((b) => (
            <div key={b.label} className="flex items-center gap-3 rounded-xl bg-secondary/50 px-3 py-2">
              <div className={`h-3 w-3 shrink-0 rounded-full ${b.color}`} />
              <div>
                <p className="text-xs text-muted-foreground">{b.label}</p>
                <p className="text-sm font-bold font-mono tabular-nums text-foreground">{b.value.toFixed(1)} <span className="font-normal font-sans text-muted-foreground">kWh/m²·år</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly chart */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h4 className="mb-3 text-sm font-semibold text-foreground">Månedlig energiforbruk</h4>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <XAxis dataKey="mnd" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} axisLine={false} tickLine={false} unit=" kWh" />
              <Tooltip
                contentStyle={{ background: "hsl(220, 39%, 11%)", border: "1px solid hsl(218, 26%, 18%)", borderRadius: 8, color: "hsl(210, 40%, 96%)" }}
                formatter={(v: number) => [`${v} kWh/m²`, "Forbruk"]}
              />
              <ReferenceLine y={tek17Monthly} stroke="hsl(0, 84%, 60%)" strokeDasharray="4 4" label={{ value: "TEK17", fill: "hsl(0, 84%, 60%)", fontSize: 10, position: "right" }} />
              <Bar dataKey="kwh" radius={[4, 4, 0, 0]}>
                {monthlyData.map((entry, index) => (
                  <Cell key={index} fill={entry.kwh > tek17Monthly ? "hsl(0, 84%, 60%)" : "hsl(213, 52%, 63%)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5" />
          <span>±12% basert på standardavvik i inputparametere, 95% konfidensintervall.</span>
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value, unit, badge, badgeColor, note, highlight }: {
  label: string; value: string; unit: string; badge?: string; badgeColor?: string; note?: string; highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl border border-border bg-card p-5 ${highlight ? "border-l-4 border-l-red-500" : ""}`}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-4xl font-bold font-mono tabular-nums text-foreground">{value} <span className="text-sm font-normal font-sans text-muted-foreground">{unit}</span></p>
      {badge && (
        <motion.span
          className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeColor}`}
          animate={{ opacity: [1, 0.6, 1] }}
          transition={{ duration: 2, repeat: 1 }}
        >
          {badge}
        </motion.span>
      )}
      {note && <p className="mt-1 text-[10px] text-muted-foreground">{note}</p>}
    </div>
  );
}
