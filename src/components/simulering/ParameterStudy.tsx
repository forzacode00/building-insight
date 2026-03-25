import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Play, Download, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import { useSimInput } from "@/lib/SimContext";
import { runSimulation, type SimInput, type SimResult } from "@/lib/simulationEngine";

type InputParam = {
  key: string;
  label: string;
  unit: string;
  defaultRange: [number, number];
  defaultStep: number;
  toInput: (base: SimInput, val: number) => SimInput;
  currentValue: (input: SimInput) => number;
};

type OutputParam = {
  key: string;
  label: string;
  unit: string;
  extract: (r: SimResult) => number;
  tek17Limit?: number;
};

const INPUT_PARAMS: InputParam[] = [
  {
    key: "heatRecoveryEff", label: "Gjenvinner virkningsgrad", unit: "%",
    defaultRange: [50, 95], defaultStep: 5,
    toInput: (b, v) => ({ ...b, heatRecoveryEff: v / 100 }),
    currentValue: (i) => Math.round(i.heatRecoveryEff * 100),
  },
  {
    key: "sfpDesign", label: "SFP-faktor", unit: "kW/(m³/s)",
    defaultRange: [0.8, 2.4], defaultStep: 0.2,
    toInput: (b, v) => ({ ...b, sfpDesign: v }),
    currentValue: (i) => i.sfpDesign,
  },
  {
    key: "heatingTur", label: "Turtemperatur varme", unit: "°C",
    defaultRange: [40, 70], defaultStep: 5,
    toInput: (b, v) => ({ ...b, heatingTurRetur: [v, b.heatingTurRetur[1]] as [number, number] }),
    currentValue: (i) => i.heatingTurRetur[0],
  },
  {
    key: "co2Setpoint", label: "CO₂-settpunkt", unit: "ppm",
    defaultRange: [600, 1000], defaultStep: 50,
    toInput: (b, v) => {
      const factor = 800 / v;
      return { ...b, airflowSupply: Math.round(b.airflowSupply * factor) };
    },
    currentValue: () => 800,
  },
  {
    key: "installedCooling", label: "Installert kjøleeffekt", unit: "kW",
    defaultRange: [200, 600], defaultStep: 50,
    toInput: (b, v) => ({ ...b, installedCooling: v }),
    currentValue: (i) => i.installedCooling,
  },
];

const OUTPUT_PARAMS: OutputParam[] = [
  { key: "totalEnergy", label: "Netto energibehov", unit: "kWh/m²·år", extract: (r) => r.totalEnergyKwhM2, tek17Limit: 115 },
  { key: "sfpActual", label: "SFP AHU", unit: "kW/(m³/s)", extract: (r) => r.sfpActual, tek17Limit: 1.5 },
  { key: "hoursAbove26", label: "Timer >26°C sommer", unit: "timer", extract: (r) => r.hoursAbove26, tek17Limit: 50 },
  { key: "annualCost", label: "Energikostnad", unit: "kr/år", extract: (r) => r.annualCostNOK },
  { key: "co2", label: "CO₂ scope 2", unit: "tonn/år", extract: (r) => r.co2Tonnes },
];

type DataPoint = { x: number; y: number; label: string };

export function ParameterStudy() {
  const { input } = useSimInput();
  const [selectedInput, setSelectedInput] = useState(INPUT_PARAMS[0].key);
  const [selectedOutput, setSelectedOutput] = useState(OUTPUT_PARAMS[0].key);
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [step, setStep] = useState<string>("");
  const [studyData, setStudyData] = useState<DataPoint[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const inputParam = INPUT_PARAMS.find((p) => p.key === selectedInput)!;
  const outputParam = OUTPUT_PARAMS.find((p) => p.key === selectedOutput)!;

  const currentDesignValue = inputParam.currentValue(input);

  const effectiveFrom = from !== "" ? parseFloat(from) : inputParam.defaultRange[0];
  const effectiveTo = to !== "" ? parseFloat(to) : inputParam.defaultRange[1];
  const effectiveStep = step !== "" ? parseFloat(step) : inputParam.defaultStep;

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      const points: DataPoint[] = [];
      for (let v = effectiveFrom; v <= effectiveTo + 0.001; v += effectiveStep) {
        const rounded = Math.round(v * 100) / 100;
        const modified = inputParam.toInput(input, rounded);
        const result = runSimulation(modified);
        const yVal = outputParam.extract(result);
        points.push({
          x: rounded,
          y: Math.round(yVal * 100) / 100,
          label: `${rounded} ${inputParam.unit}`,
        });
      }
      setStudyData(points);
      setIsRunning(false);
    }, 800);
  };

  const handleExportCSV = () => {
    if (!studyData) return;
    const header = `${inputParam.label} (${inputParam.unit});${outputParam.label} (${outputParam.unit});Status vs TEK17`;
    const rows = studyData.map((p) => {
      const status = outputParam.tek17Limit
        ? p.y > outputParam.tek17Limit ? "Over krav" : "OK"
        : "—";
      return `${p.x};${p.y};${status}`;
    });
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `parameterstudie_${selectedInput}_vs_${selectedOutput}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Parameterstudie — Sensitivitetsanalyse
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Input parameter */}
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Varierbar parameter</label>
            <select
              value={selectedInput}
              onChange={(e) => {
                setSelectedInput(e.target.value);
                setStudyData(null);
                setFrom("");
                setTo("");
                setStep("");
              }}
              className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground"
            >
              {INPUT_PARAMS.map((p) => (
                <option key={p.key} value={p.key}>{p.label} ({p.unit})</option>
              ))}
            </select>
          </div>

          {/* Range */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-muted-foreground">Fra</label>
              <input
                type="number"
                value={from}
                placeholder={String(inputParam.defaultRange[0])}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs text-muted-foreground">Til</label>
              <input
                type="number"
                value={to}
                placeholder={String(inputParam.defaultRange[1])}
                onChange={(e) => setTo(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50"
              />
            </div>
            <div className="w-20">
              <label className="mb-1 block text-xs text-muted-foreground">Trinn</label>
              <input
                type="number"
                value={step}
                placeholder={String(inputParam.defaultStep)}
                onChange={(e) => setStep(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50"
              />
            </div>
          </div>

          {/* Output parameter */}
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Resultatparameter</label>
            <select
              value={selectedOutput}
              onChange={(e) => {
                setSelectedOutput(e.target.value);
                setStudyData(null);
              }}
              className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground"
            >
              {OUTPUT_PARAMS.map((p) => (
                <option key={p.key} value={p.key}>{p.label} ({p.unit})</option>
              ))}
            </select>
          </div>

          {/* Run button */}
          <div className="flex items-end">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isRunning ? (
                <motion.div
                  className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isRunning ? "Beregner..." : "Kjør studie"}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {studyData && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Chart */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                {outputParam.label} vs. {inputParam.label}
              </h3>
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Download className="h-3.5 w-3.5" />
                Eksporter som CSV
              </button>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={studyData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis
                    dataKey="x"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    label={{ value: `${inputParam.label} (${inputParam.unit})`, position: "insideBottom", offset: -5, style: { fill: "hsl(var(--muted-foreground))", fontSize: 11 } }}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    label={{ value: outputParam.unit, angle: -90, position: "insideLeft", style: { fill: "hsl(var(--muted-foreground))", fontSize: 11 } }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value: number) => [`${value} ${outputParam.unit}`, outputParam.label]}
                    labelFormatter={(val) => `${inputParam.label}: ${val} ${inputParam.unit}`}
                  />
                  {/* TEK17 limit line */}
                  {outputParam.tek17Limit && (
                    <ReferenceLine
                      y={outputParam.tek17Limit}
                      stroke="#EF4444"
                      strokeDasharray="6 3"
                      strokeWidth={2}
                      label={{
                        value: `TEK17: ${outputParam.tek17Limit} ${outputParam.unit}`,
                        position: "right",
                        style: { fill: "#EF4444", fontSize: 11, fontWeight: 600 },
                      }}
                    />
                  )}
                  {/* Current design value */}
                  <ReferenceLine
                    x={currentDesignValue}
                    stroke="#EAB308"
                    strokeDasharray="4 2"
                    strokeWidth={2}
                    label={{
                      value: "Nåværende design",
                      position: "top",
                      style: { fill: "#EAB308", fontSize: 11, fontWeight: 600 },
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="y"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    dot={{ fill: "hsl(var(--primary))", r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "#EAB308", stroke: "hsl(var(--background))", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Beregningspunkter</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                      {inputParam.label} ({inputParam.unit})
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                      {outputParam.label} ({outputParam.unit})
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                      Status vs TEK17
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {studyData.map((point, i) => {
                    const isCurrent = Math.abs(point.x - currentDesignValue) < effectiveStep * 0.5;
                    const overLimit = outputParam.tek17Limit ? point.y > outputParam.tek17Limit : false;
                    return (
                      <tr
                        key={i}
                        className={`border-b border-border/50 transition-colors ${isCurrent ? "bg-primary/10" : "hover:bg-secondary/50"}`}
                      >
                        <td className="px-3 py-2 font-mono tabular-nums text-foreground">
                          {point.x}
                          {isCurrent && (
                            <span className="ml-2 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                              DESIGN
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 font-mono tabular-nums text-foreground">
                          {outputParam.key === "annualCost"
                            ? point.y.toLocaleString("nb-NO")
                            : point.y}
                        </td>
                        <td className="px-3 py-2">
                          {outputParam.tek17Limit ? (
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                              overLimit
                                ? "bg-destructive/10 text-destructive"
                                : "bg-emerald-500/10 text-emerald-500"
                            }`}>
                              {overLimit ? "Over krav" : "OK"}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
