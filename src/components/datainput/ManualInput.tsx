import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, Wind, Snowflake, Thermometer, Info } from "lucide-react";
import { useSimInput } from "@/lib/SimContext";

const ReadonlyField = ({ label, value, unit, note }: { label: string; value: string; unit?: string; note?: string }) => (
  <div className="flex items-start justify-between rounded-lg bg-secondary/50 px-4 py-3">
    <div className="flex-1">
      <p className="text-sm font-medium text-foreground">{label}</p>
      {note && <p className="text-xs text-muted-foreground mt-0.5">{note}</p>}
    </div>
    <div className="text-right">
      <span className="text-sm font-semibold text-primary">{value}</span>
      {unit && <span className="ml-1 text-xs text-muted-foreground">{unit}</span>}
    </div>
  </div>
);

function NumberField({ label, value, unit, note, step, onChange }: {
  label: string; value: number; unit?: string; note?: string; step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-start justify-between rounded-lg bg-secondary/50 px-4 py-3">
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {note && <p className="text-xs text-muted-foreground mt-0.5">{note}</p>}
      </div>
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={value}
          step={step ?? 1}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-24 rounded-md border border-border bg-card px-2 py-1 text-right text-sm font-semibold text-primary font-mono tabular-nums focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

function SliderField({ label, value, unit, note, min, max, step, onChange }: {
  label: string; value: number; unit?: string; note?: string;
  min: number; max: number; step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="rounded-lg bg-secondary/50 px-4 py-3">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {note && <p className="text-xs text-muted-foreground mt-0.5">{note}</p>}
        </div>
        <span className="text-sm font-semibold text-primary font-mono tabular-nums">
          {Math.round(value * 100)}%{unit ? ` ${unit}` : ""}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step ?? 0.01}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-primary h-1.5"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
        <span>{Math.round(min * 100)}%</span>
        <span>{Math.round(max * 100)}%</span>
      </div>
    </div>
  );
}

function SelectField({ label, value, options, note, onChange }: {
  label: string; value: string; options: string[]; note?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <div className="flex items-start justify-between rounded-lg bg-secondary/50 px-4 py-3">
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {note && <p className="text-xs text-muted-foreground mt-0.5">{note}</p>}
      </div>
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export function ManualInput() {
  const { input, updateInput } = useSimInput();

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <Tabs defaultValue="32" className="w-full">
          <TabsList className="mb-4 flex-wrap bg-secondary">
            <TabsTrigger value="32" className="text-xs data-[state=active]:bg-vh-red/20 data-[state=active]:text-vh-red">
              <Flame className="mr-1.5 h-3.5 w-3.5" /> 32 Varme
            </TabsTrigger>
            <TabsTrigger value="36" className="text-xs data-[state=active]:bg-vh-green/20 data-[state=active]:text-vh-green">
              <Wind className="mr-1.5 h-3.5 w-3.5" /> 36 Luft
            </TabsTrigger>
            <TabsTrigger value="37" className="text-xs data-[state=active]:bg-vh-blue/20 data-[state=active]:text-vh-blue">
              <Snowflake className="mr-1.5 h-3.5 w-3.5" /> 37 Kjøling
            </TabsTrigger>
            <TabsTrigger value="35" className="text-xs data-[state=active]:bg-vh-purple/20 data-[state=active]:text-vh-purple">
              <Thermometer className="mr-1.5 h-3.5 w-3.5" /> 35 VP/Kulde
            </TabsTrigger>
          </TabsList>

          <TabsContent value="32">
            <div className="space-y-2">
              <SelectField label="Varmekilde" value="Fjernvarme" options={["Fjernvarme", "VP luft/vann", "VP berg", "Elkjel", "Gasskjel"]} />
              <NumberField label="Turtemp radiator" value={input.heatingTurRetur[0]} unit="°C" onChange={(v) => updateInput("heatingTurRetur", [v, input.heatingTurRetur[1]])} />
              <NumberField label="Returtemp radiator" value={input.heatingTurRetur[1]} unit="°C" onChange={(v) => updateInput("heatingTurRetur", [input.heatingTurRetur[0], v])} />
              <NumberField label="DUT (dim. utetemperatur)" value={input.dut} unit="°C" step={0.1} note="Oslo, 3-døgns middel, NS-EN 12831" onChange={(v) => updateInput("dut", v)} />
              <NumberField label="Dim. romtemperatur" value={input.setpointHeating} unit="°C" note="TEK17 min 19°C" onChange={(v) => updateInput("setpointHeating", v)} />
              <NumberField label="Installert effekt" value={input.installedHeating} unit="kW" onChange={(v) => updateInput("installedHeating", v)} />
              <ReadonlyField label="Fordeling" value="Rad 65%, Gulv 10%, Vent 20%, Luftp 5%" />
              <SelectField label="Regulering" value="Mengderegulert (dynamiske ventiler)" options={["Mengderegulert (dynamiske ventiler)", "Trykkstyrt", "Konstant mengde"]} />
              <ReadonlyField label="Nattesenking" value="På, 3°C senking" />
              <ReadonlyField label="Pumper" value="2 stk doble (Grundfos Magna)" />
              <ReadonlyField label="Energimåling" value="På, separate per kurs + SD" />
            </div>
          </TabsContent>

          <TabsContent value="36">
            <div className="space-y-2">
              <ReadonlyField label="Antall aggregat" value="8" />
              <SliderField label="Gjenvinner virkningsgrad" value={input.heatRecoveryEff} min={0.5} max={0.95} step={0.01} note="TEK17 krav ≥80%" onChange={(v) => updateInput("heatRecoveryEff", v)} />
              <NumberField label="SFP" value={input.sfpDesign} unit="kW/(m³/s)" step={0.1} note="TEK17 krav ≤1.5" onChange={(v) => updateInput("sfpDesign", v)} />
              <NumberField label="Tilluft" value={input.airflowSupply} unit="m³/h" step={100} onChange={(v) => updateInput("airflowSupply", v)} />
              <NumberField label="Avtrekk" value={input.airflowExtract} unit="m³/h" step={100} onChange={(v) => updateInput("airflowExtract", v)} />
              <ReadonlyField label="Frisklufttilførsel" value="26 m³/h per person" note="0.7 m³/(h·m²) utenfor bruk" />
              <ReadonlyField label="VAV behovsstyring" value="På, CO₂ 800 ppm" />
              <ReadonlyField label="Tilluftstemperatur" value="19 °C" />
              <ReadonlyField label="Filter" value="Tilluft F7, Avtrekk M5" />
              <ReadonlyField label="Brannspjeld" value="På" />
            </div>
          </TabsContent>

          <TabsContent value="37">
            <div className="space-y-2">
              <NumberField label="Isvann turtemp" value={input.coolingTurRetur[0]} unit="°C" onChange={(v) => updateInput("coolingTurRetur", [v, input.coolingTurRetur[1]])} />
              <NumberField label="Isvann returtemp" value={input.coolingTurRetur[1]} unit="°C" onChange={(v) => updateInput("coolingTurRetur", [input.coolingTurRetur[0], v])} />
              <NumberField label="Installert kjøleeffekt" value={input.installedCooling} unit="kW" onChange={(v) => updateInput("installedCooling", v)} />
              <NumberField label="Antall kjølebafler" value={input.numCoolingBaffles} unit="stk" onChange={(v) => updateInput("numCoolingBaffles", v)} />
              <NumberField label="Kapasitet per bafel" value={input.baffleCapacity} unit="W" onChange={(v) => updateInput("baffleCapacity", v)} />
              <NumberField label="Maks romtemp sommer" value={input.setpointCoolingMax} unit="°C" onChange={(v) => updateInput("setpointCoolingMax", v)} />
              <ReadonlyField label="Frikjøling" value="På, grense 12°C utetemperatur" />
            </div>
          </TabsContent>

          <TabsContent value="35">
            <div className="space-y-2">
              <ReadonlyField label="Type" value="Vannkjølt skruekompressor" />
              <ReadonlyField label="Nominell effekt" value="400 kW" />
              <NumberField label="COP" value={input.cop} step={0.1} onChange={(v) => updateInput("cop", v)} />
              <ReadonlyField label="Kuldemedium" value="R-410A" />
              <ReadonlyField label="Tørrkjøler" value="På tak" />
              <NumberField label="BRA" value={input.bra} unit="m²" step={100} onChange={(v) => updateInput("bra", v)} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Climate requirements side panel */}
      <div className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-6 rounded-xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Klima-/komfortkrav</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Sommer dim.</p>
              <p className="font-medium text-foreground">28°C / 50% RF</p>
            </div>
            <div>
              <p className="text-muted-foreground">Vinter DUT</p>
              <p className="font-medium text-foreground">{input.dut}°C</p>
            </div>
            <div>
              <p className="text-muted-foreground">Maks operativ temp sommer</p>
              <p className="font-medium text-foreground">{input.setpointCoolingMax}°C</p>
            </div>
            <div>
              <p className="text-muted-foreground">Min operativ temp vinter</p>
              <p className="font-medium text-foreground">19°C</p>
            </div>
            <div>
              <p className="text-muted-foreground">Maks teknisk rom</p>
              <p className="font-medium text-foreground">30°C</p>
            </div>
            <div>
              <p className="text-muted-foreground">Lydklasse</p>
              <p className="font-medium text-foreground">C (NS 8175)</p>
            </div>
            <div>
              <p className="text-muted-foreground">Innregulering</p>
              <p className="font-medium text-foreground">±10%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
