import { TrendingUp, Info } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";

const monthlyData = [
  { mnd: "Jan", kwh: 16 }, { mnd: "Feb", kwh: 14 }, { mnd: "Mar", kwh: 12 },
  { mnd: "Apr", kwh: 9 }, { mnd: "Mai", kwh: 7 }, { mnd: "Jun", kwh: 8 },
  { mnd: "Jul", kwh: 9 }, { mnd: "Aug", kwh: 8 }, { mnd: "Sep", kwh: 9 },
  { mnd: "Okt", kwh: 12 }, { mnd: "Nov", kwh: 15 }, { mnd: "Des", kwh: 19 },
];

const breakdown = [
  { label: "Oppvarming", value: 52, color: "bg-vh-red" },
  { label: "Vifter/pumper", value: 28, color: "bg-vh-purple" },
  { label: "Belysning", value: 18, color: "bg-vh-yellow" },
  { label: "Kjøling", value: 15, color: "bg-vh-blue" },
  { label: "Utstyr", value: 20, color: "bg-muted-foreground" },
  { label: "VV", value: 5, color: "bg-primary" },
];

export function ResultsEnergi() {
  return (
    <div>
      {/* KPI cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <KPI label="Totalt" value="138" unit="kWh/m²·år" badge="Over TEK17" badgeColor="bg-vh-red/15 text-vh-red" note="±12% konfidens" />
        <KPI label="TEK17 krav" value="115" unit="kWh/m²·år" />
        <KPI label="Energikostnad" value="1,104,000" unit="NOK/år" />
        <KPI label="CO₂-utslipp" value="42" unit="tonn/år" />
      </div>

      {/* Breakdown */}
      <div className="mb-6 rounded-xl border border-border bg-card p-5">
        <h4 className="mb-3 text-sm font-semibold text-foreground">Energifordeling</h4>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {breakdown.map((b) => (
            <div key={b.label} className="flex items-center gap-3 rounded-lg bg-secondary/50 px-3 py-2">
              <div className={`h-3 w-3 shrink-0 rounded-full ${b.color}`} />
              <div>
                <p className="text-xs text-muted-foreground">{b.label}</p>
                <p className="text-sm font-bold text-foreground">{b.value} <span className="font-normal text-muted-foreground">kWh/m²·år</span></p>
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
              <ReferenceLine y={9.6} stroke="hsl(0, 84%, 60%)" strokeDasharray="4 4" label={{ value: "TEK17", fill: "hsl(0, 84%, 60%)", fontSize: 10, position: "right" }} />
              <Bar dataKey="kwh" fill="hsl(213, 52%, 63%)" radius={[4, 4, 0, 0]} />
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

function KPI({ label, value, unit, badge, badgeColor, note }: {
  label: string; value: string; unit: string; badge?: string; badgeColor?: string; note?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value} <span className="text-sm font-normal text-muted-foreground">{unit}</span></p>
      {badge && (
        <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeColor}`}>
          {badge}
        </span>
      )}
      {note && <p className="mt-1 text-[10px] text-muted-foreground">{note}</p>}
    </div>
  );
}
