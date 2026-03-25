import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Building2, MapPin, Calendar, Ruler, Award, ChevronDown, ChevronRight, CheckSquare, Square, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSimInput } from "@/lib/SimContext";

const LOCATIONS = [
  { value: "oslo", label: "Oslo" },
  { value: "bergen", label: "Bergen" },
  { value: "trondheim", label: "Trondheim" },
];

const staticBuildingInfo = [
  { icon: Building2, label: "Bygningstype", value: "Kontorbygning" },
  { icon: Building2, label: "Etasjer", value: "9 (U1 + plan 1-8)" },
  { icon: Calendar, label: "Byggeår", value: "2024 (rehabilitering)" },
  { icon: Award, label: "Energimerke", value: "C" },
];

const systemTree = [
  { code: "31", name: "Sanitærinstallasjoner", checked: true, children: ["311 Kaldt vann", "312 Varmt vann / VVC", "313 Avløp og spillvann"] },
  { code: "32", name: "Varmeinstallasjoner", checked: true, children: ["321 Ledningsnett", "324 Armaturer", "325 Utstyr (radiatorer, pumper)"] },
  { code: "33", name: "Brannslokking", checked: true, children: ["331 Manuell", "332 Sprinkler", "333 Vanntåke"] },
  { code: "35", name: "Varmepumpe/kulde", checked: true, children: ["351 Kjølerom", "353 Isvann", "354 Varmepumper"] },
  { code: "36", name: "Luftbehandling", checked: true, children: ["361 Kanalnett", "364 Luftfordeling", "365 Aggregat (AHU)"] },
  { code: "37", name: "Komfortkjøling", checked: true, children: ["371 Ledningsnett", "374 Armaturer", "375 Kjølebafler"] },
  { code: "38", name: "Vannbehandling", checked: false, children: [] },
  { code: "41", name: "Basisinstallasjoner elkraft", checked: false, children: [] },
  { code: "44", name: "Lys", checked: false, children: ["441 Innvendig", "443 Nødlys"] },
  { code: "56", name: "SD-anlegg", checked: true, children: ["561 Sentral driftskontroll", "562 Undersentraler", "563 Feltinstrumentering"] },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function Prosjekt() {
  const navigate = useNavigate();
  const { input, updateInput } = useSimInput();
  const [systems, setSystems] = useState(systemTree);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleCheck = (code: string) => {
    setSystems((prev) => prev.map((s) => (s.code === code ? { ...s, checked: !s.checked } : s)));
  };

  const toggleExpand = (code: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  };

  const checkedCount = systems.filter((s) => s.checked).length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="min-h-screen p-6 lg:p-8">
      <motion.div variants={item} className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Prosjekt — Parkveien Kontorbygg</h1>
        <p className="text-sm text-muted-foreground">Bygningsinformasjon og NS 3451:2022 systemvalg</p>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-5">
        {/* Building info — left 40% */}
        <motion.div variants={item} className="xl:col-span-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Bygningsinformasjon</h2>
            <div className="space-y-4">
              {/* Editable: Sted */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Sted</p>
                  <select
                    value={input.location}
                    onChange={(e) => updateInput("location", e.target.value as "oslo" | "bergen" | "trondheim")}
                    className="mt-0.5 w-full rounded border border-border bg-secondary/50 px-2 py-1 text-sm font-semibold text-foreground"
                  >
                    {LOCATIONS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </select>
                </div>
              </div>
              {/* Editable: BRA */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <Ruler className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">BTA / BRA</p>
                  <div className="mt-0.5 flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">7 200 /</span>
                    <input
                      type="number"
                      value={input.bra}
                      onChange={(e) => updateInput("bra", Number(e.target.value))}
                      className="w-24 rounded border border-border bg-secondary/50 px-2 py-1 text-sm font-semibold text-foreground font-mono tabular-nums"
                    />
                    <span className="text-sm text-muted-foreground">m²</span>
                  </div>
                </div>
              </div>
              {/* Static info */}
              {staticBuildingInfo.map((info) => (
                <div key={info.label} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <info.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{info.label}</p>
                    <p className="text-sm font-semibold text-foreground">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-secondary/50 p-4">
              <p className="text-xs text-muted-foreground mb-1">Prosjektbeskrivelse</p>
              <p className="text-sm text-foreground leading-relaxed">
                Totalrehabilitering av eksisterende kontorbygning med nytt VVS-anlegg.
                Bygningen har fjernvarme, kjølebafler, VAV-ventilasjon og BACnet SD-anlegg.
                Prosjektet inkluderer energioptimalisering mot TEK17.
              </p>
            </div>
          </div>
        </motion.div>

        {/* NS 3451 system tree — right 60% */}
        <motion.div variants={item} className="xl:col-span-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 text-lg font-semibold text-foreground">NS 3451:2022 — Systemvalg</h2>
            <p className="mb-4 text-xs text-muted-foreground">Velg hvilke tekniske systemer som skal inkluderes i simuleringsmodellen</p>

            <div className="space-y-1">
              {systems.map((sys) => {
                const isExpanded = expanded.has(sys.code);
                const hasChildren = sys.children.length > 0;

                return (
                  <div key={sys.code}>
                    <div
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                        sys.checked ? "bg-primary/5" : "hover:bg-secondary/50"
                      }`}
                    >
                      <button onClick={() => toggleCheck(sys.code)} className="shrink-0">
                        {sys.checked ? (
                          <CheckSquare className="h-5 w-5 text-primary" />
                        ) : (
                          <Square className="h-5 w-5 text-muted-foreground/40" />
                        )}
                      </button>

                      <span className="shrink-0 rounded-md bg-secondary px-2 py-0.5 text-xs font-bold font-mono tabular-nums text-muted-foreground">
                        {sys.code}
                      </span>

                      <span className={`flex-1 text-sm font-medium ${sys.checked ? "text-foreground" : "text-muted-foreground"}`}>
                        {sys.name}
                      </span>

                      {hasChildren && (
                        <button onClick={() => toggleExpand(sys.code)} className="shrink-0 rounded p-1 hover:bg-secondary">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      )}
                    </div>

                    {isExpanded && hasChildren && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="ml-12 space-y-0.5 overflow-hidden pb-1"
                      >
                        {sys.children.map((child) => (
                          <div key={child} className="rounded-md px-3 py-1.5 text-xs text-muted-foreground">
                            {child}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground font-mono tabular-nums">{checkedCount}</span> systemer valgt
              </span>
              <button
                onClick={() => navigate("/datainput")}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Konfigurer valgte systemer
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Klimaskall-kalkulator */}
      <KlimaskallKalkulator />
    </motion.div>
  );
}

/* ─── Klimaskall-kalkulator ─── */

type Retning = "Sør" | "Vest" | "Nord" | "Øst" | "Hjørne (Sør+Vest)";
type Solavskjerming = "Ingen" | "Utvendig (lamellavskjerming)" | "Innvendig persienner" | "Kombinert";
type Isolasjon = "TEK17 minimum (U=0.22)" | "Passivhus (U=0.15)" | "Lavenergi (U=0.18)";

const RETNINGER: Retning[] = ["Sør", "Vest", "Nord", "Øst", "Hjørne (Sør+Vest)"];
const SOLAVSKJERMING: Solavskjerming[] = ["Ingen", "Utvendig (lamellavskjerming)", "Innvendig persienner", "Kombinert"];
const ISOLASJON: { label: Isolasjon; u: number }[] = [
  { label: "TEK17 minimum (U=0.22)", u: 0.22 },
  { label: "Passivhus (U=0.15)", u: 0.15 },
  { label: "Lavenergi (U=0.18)", u: 0.18 },
];

const fasadeMultiplikator: Record<Retning, number> = {
  "Sør": 1.3, "Vest": 1.15, "Nord": 0.7, "Øst": 1.0, "Hjørne (Sør+Vest)": 1.45,
};
const solavskjermingFaktor: Record<Solavskjerming, number> = {
  "Ingen": 1.0, "Utvendig (lamellavskjerming)": 0.45, "Innvendig persienner": 0.7, "Kombinert": 0.35,
};
const isolasjonFaktor: Record<string, number> = { "0.22": 1.0, "0.15": 0.72, "0.18": 0.85 };

const RETNING_ANGLES: Record<Retning, number> = {
  "Nord": 0, "Øst": 90, "Sør": 180, "Vest": 270, "Hjørne (Sør+Vest)": 225,
};

function KlimaskallKalkulator() {
  const [retning, setRetning] = useState<Retning>("Sør");
  const [vindusandel, setVindusandel] = useState(40);
  const [solavskjerming, setSolavskjerming] = useState<Solavskjerming>("Ingen");
  const [isolasjon, setIsolasjon] = useState<Isolasjon>("TEK17 minimum (U=0.22)");

  const uValue = ISOLASJON.find((i) => i.label === isolasjon)!.u;

  const calc = useMemo(() => {
    const base = 100;
    const kjole = Math.round(base * (vindusandel / 40) * fasadeMultiplikator[retning] * solavskjermingFaktor[solavskjerming] * 10) / 10;
    const varme = Math.round(45 * isolasjonFaktor[String(uValue)] * (1 + (vindusandel - 40) * 0.005) * 10) / 10;
    const vifter = 28;
    const total = Math.round((kjole + varme + vifter + 18 + 20 + 5) * 10) / 10;
    const timer26 = Math.max(0, Math.round((kjole - 60) * 2.5));
    const tek17Ok = total <= 115;
    return { kjole, varme, vifter, total, timer26, tek17Ok };
  }, [retning, vindusandel, solavskjerming, uValue]);

  const barData = [
    { name: "Varme", value: calc.varme },
    { name: "Kjøling", value: calc.kjole },
    { name: "Vifter", value: calc.vifter },
  ];
  const barColors = ["#EF4444", "#3B82F6", "#22C55E"];

  const compassAngle = RETNING_ANGLES[retning];

  return (
    <motion.div variants={item} className="mt-6">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">🏗️</span>
        <h2 className="text-lg font-bold text-foreground">Klimaskall — tidligfase energiestimering</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">Forenklede beregninger for skissefase. Detaljert simulering gjøres i Simulering-skjermen.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className="mb-5 text-sm text-muted-foreground">Juster fasadeparametere og se umiddelbar effekt på energiramme</p>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Venstre — Inputs */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-5">
          {/* Fasaderetning */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fasaderetning</label>
            <div className="flex items-center gap-5">
              <svg width="80" height="80" viewBox="0 0 80 80" className="shrink-0">
                <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--border))" strokeWidth="2" />
                {/* Cardinal labels */}
                <text x="40" y="12" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9" fontWeight="600">N</text>
                <text x="40" y="76" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9" fontWeight="600">S</text>
                <text x="8" y="44" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9" fontWeight="600">V</text>
                <text x="72" y="44" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9" fontWeight="600">Ø</text>
                {/* Needle */}
                <line
                  x1="40" y1="40"
                  x2={40 + 24 * Math.sin((compassAngle * Math.PI) / 180)}
                  y2={40 - 24 * Math.cos((compassAngle * Math.PI) / 180)}
                  stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"
                />
                <circle cx="40" cy="40" r="3" fill="hsl(var(--primary))" />
              </svg>
              <div className="flex flex-wrap gap-2">
                {RETNINGER.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRetning(r)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      retning === r
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Vindusandel */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Vindusandel fasade
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range" min={20} max={80} value={vindusandel}
                onChange={(e) => setVindusandel(Number(e.target.value))}
                className="flex-1 accent-primary"
              />
              <span className="w-28 text-sm font-semibold text-foreground font-mono tabular-nums">
                {vindusandel}% glassfasade
              </span>
            </div>
          </div>

          {/* Solavskjerming */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Solavskjerming</label>
            <div className="space-y-1.5">
              {SOLAVSKJERMING.map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 transition-colors hover:bg-secondary/50">
                  <input
                    type="radio" name="solavskjerming" checked={solavskjerming === s}
                    onChange={() => setSolavskjerming(s)}
                    className="accent-primary"
                  />
                  <span className={`text-sm ${solavskjerming === s ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Isolasjon */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Isolasjonsstandard</label>
            <div className="space-y-1.5">
              {ISOLASJON.map((iso) => (
                <label key={iso.label} className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 transition-colors hover:bg-secondary/50">
                  <input
                    type="radio" name="isolasjon" checked={isolasjon === iso.label}
                    onChange={() => setIsolasjon(iso.label)}
                    className="accent-primary"
                  />
                  <span className={`text-sm ${isolasjon === iso.label ? "text-foreground font-medium" : "text-muted-foreground"}`}>{iso.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Høyre — Resultater */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Kjølebehov sør-soner</p>
              <p className="mt-1 text-2xl font-bold font-mono tabular-nums text-foreground">
                {calc.kjole} <span className="text-sm font-normal text-muted-foreground">kWh/m²</span>
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Komfortoverskridelse</p>
              <p className={`mt-1 text-2xl font-bold font-mono tabular-nums ${calc.timer26 > 50 ? "text-destructive" : "text-foreground"}`}>
                {calc.timer26} <span className="text-sm font-normal text-muted-foreground">timer &gt;26°C</span>
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Netto energibehov</p>
              <p className={`mt-1 text-2xl font-bold font-mono tabular-nums ${calc.tek17Ok ? "text-foreground" : "text-destructive"}`}>
                {calc.total} <span className="text-sm font-normal text-muted-foreground">kWh/m²·år</span>
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">TEK17-ramme</p>
              <p className="mt-1 text-2xl font-bold">
                {calc.tek17Ok ? (
                  <span className="text-emerald-400">✅ Oppfyller</span>
                ) : (
                  <span className="text-destructive">❌ Overskrider</span>
                )}
              </p>
              <p className="text-[10px] text-muted-foreground">Krav: 115 kWh/m²·år</p>
            </div>
          </div>

          {/* Bar chart */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Energifordeling (estimat)</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} unit=" kWh/m²" />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} width={55} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={400}>
                    {barData.map((_, i) => (
                      <Cell key={i} fill={barColors[i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
