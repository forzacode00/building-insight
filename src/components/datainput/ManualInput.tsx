import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, Wind, Snowflake, Thermometer, Info } from "lucide-react";

const Field = ({ label, value, unit, note }: { label: string; value: string; unit?: string; note?: string }) => (
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

const SelectField = ({ label, value, options, note }: { label: string; value: string; options: string[]; note?: string }) => (
  <div className="flex items-start justify-between rounded-lg bg-secondary/50 px-4 py-3">
    <div className="flex-1">
      <p className="text-sm font-medium text-foreground">{label}</p>
      {note && <p className="text-xs text-muted-foreground mt-0.5">{note}</p>}
    </div>
    <select className="rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground">
      {options.map(o => <option key={o} selected={o === value}>{o}</option>)}
    </select>
  </div>
);

export function ManualInput() {
  return (
    <div className="flex gap-6">
      {/* Main content */}
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
              <Field label="Turtemp/retur radiator" value="55 / 40" unit="°C" />
              <Field label="Turtemp/retur ventilasjon" value="55 / 35" unit="°C" />
              <Field label="DUT (dim. utetemperatur)" value="-21.8" unit="°C" note="Oslo, 3-døgns middel, NS-EN 12831" />
              <Field label="Dim. romtemperatur" value="21" unit="°C" note="TEK17 min 19°C" />
              <Field label="Installert effekt" value="280" unit="kW" />
              <Field label="Fordeling" value="Rad 65%, Gulv 10%, Vent 20%, Luftp 5%" />
              <SelectField label="Regulering" value="Mengderegulert (dynamiske ventiler)" options={["Mengderegulert (dynamiske ventiler)", "Trykkstyrt", "Konstant mengde"]} />
              <Field label="Nattesenking" value="På, 3°C senking" />
              <Field label="Pumper" value="2 stk doble (Grundfos Magna)" />
              <Field label="Energimåling" value="På, separate per kurs + SD" />
            </div>
          </TabsContent>

          <TabsContent value="36">
            <div className="space-y-2">
              <Field label="Antall aggregat" value="8" />
              <Field label="Gjenvinner" value="Roterende, 82%" note="TEK17 krav ≥80%" />
              <Field label="SFP" value="1.5" unit="kW/(m³/s)" note="TEK17 krav ≤1.5" />
              <Field label="Tilluft" value="42,000" unit="m³/h" />
              <Field label="Avtrekk" value="40,500" unit="m³/h" />
              <Field label="Frisklufttilførsel" value="26 m³/h per person" note="0.7 m³/(h·m²) utenfor bruk" />
              <Field label="VAV behovsstyring" value="På, CO₂ 800 ppm" />
              <Field label="Tilluftstemperatur" value="19" unit="°C" />
              <Field label="Filter" value="Tilluft F7, Avtrekk M5" />
              <Field label="Varme" value="Fjernvarme" />
              <Field label="Kjøling" value="Isvannsbatteri" />
              <Field label="Brannspjeld" value="På" />
            </div>
          </TabsContent>

          <TabsContent value="37">
            <div className="space-y-2">
              <Field label="Isvann tur/retur" value="6 / 12" unit="°C" />
              <Field label="Installert kjøleeffekt" value="350" unit="kW" />
              <Field label="Kjølebafler" value="180 stk à 600W" />
              <Field label="Frikjøling" value="På, grense 12°C utetemperatur" />
            </div>
          </TabsContent>

          <TabsContent value="35">
            <div className="space-y-2">
              <Field label="Type" value="Vannkjølt skruekompressor" />
              <Field label="Nominell effekt" value="400" unit="kW" />
              <Field label="COP" value="4.5" />
              <Field label="Kuldemedium" value="R-410A" />
              <Field label="Tørrkjøler" value="På tak" />
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
              <p className="font-medium text-foreground">-21.8°C</p>
            </div>
            <div>
              <p className="text-muted-foreground">Maks operativ temp sommer</p>
              <p className="font-medium text-foreground">26°C</p>
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
