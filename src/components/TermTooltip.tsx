import { useState } from "react";
import { Info } from "lucide-react";

const termDefinitions: Record<string, string> = {
  "SFP": "Spesifikk vifteeffekt — hvor mye strøm viftene bruker per kubikkmeter luft. Lavere = bedre. TEK17-krav: maks 1,5 kW/(m³/s).",
  "TEK17": "Norsk byggeforskrift fra 2017. Stiller krav til energieffektivitet, inneklima og brannsikkerhet i alle nye bygg.",
  "BAS": "Building Automation System — byggets styringssystem. Kontrollerer varme, kjøling, ventilasjon og belysning automatisk.",
  "SD-anlegg": "Sentralt driftskontrollanlegg — styringssystemet som regulerer alle tekniske systemer i bygget. Samme som BAS.",
  "P&ID": "Piping and Instrumentation Diagram — et teknisk kart som viser rør, pumper, ventiler og instrumenter i et energisystem.",
  "DUT": "Dimensjonerende utetemperatur — den kaldeste temperaturen et varmesystem skal takle. For Oslo: -21,8°C.",
  "VAV": "Variable Air Volume — ventilasjonssystem som justerer luftmengden etter behov i hvert rom. Sparer energi vs. konstant luftmengde.",
  "AHU": "Air Handling Unit / Luftbehandlingsaggregat — enheten som filtrerer, varmer/kjøler og distribuerer frisk luft i bygget.",
  "COP": "Coefficient of Performance — virkningsgraden til en varmepumpe. COP 3,5 = 3,5 kWh varme per 1 kWh strøm.",
  "kWh/m²·år": "Kilowattimer per kvadratmeter per år — måler byggets energiintensitet. Lavere = mer effektivt. TEK17-krav for kontorbygg: 115.",
  "NS 3451": "Norsk Standard for bygningsdelstabellen — et kodesystem som kategoriserer alle tekniske systemer i bygg (31=sanitær, 32=varme, 36=luft osv.).",
  "BACnet": "Building Automation and Control Networks — en kommunikasjonsprotokoll som lar ulike styringssystemer i bygget snakke sammen.",
  "Modbus": "En kommunikasjonsprotokoll brukt i industrielle styringssystemer. Enkel og utbredt for å lese sensorverdier.",
  "Energisentral": "Hjernene i byggets tekniske system — varmepumper, kjølemaskiner, akkumulatortanker og automasjonen som styrer dem.",
  "Turtemperatur": "Temperaturen på vannet som sendes UT fra varmesentralen til radiatorene. Høyere turtemp = mer energi, men dårligere varmepumpe-effektivitet.",
  "Returtemperatur": "Temperaturen på vannet som kommer TILBAKE til varmesentralen etter å ha avgitt varme i radiatorene.",
  "Innregulering": "Prosessen med å justere ventiler, pumper og luftmengder slik at hvert rom får riktig mengde varme/luft. Gjøres ved idriftsettelse.",
  "ITB": "Integrerte tekniske bygningsinstallasjoner — koordinering av alle tekniske systemer for at de fungerer sammen.",
  "Enova": "Statlig foretak som gir økonomisk støtte til energieffektiviseringstiltak i bygg og industri.",
};

interface TermTooltipProps {
  term: string;
  children?: React.ReactNode;
}

export function TermTooltip({ term, children }: TermTooltipProps) {
  const [show, setShow] = useState(false);
  const definition = termDefinitions[term];

  if (!definition) return <>{children || term}</>;

  return (
    <span className="relative inline-flex items-center gap-0.5">
      {children || term}
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="inline-flex items-center justify-center h-3.5 w-3.5 rounded-full bg-primary/10 text-primary/60 hover:bg-primary/20 hover:text-primary transition-colors cursor-help"
        aria-label={`Forklaring av ${term}`}
      >
        <Info className="h-2.5 w-2.5" />
      </button>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground shadow-xl leading-relaxed">
          <span className="font-semibold text-foreground block mb-1">{term}</span>
          {definition}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-border" />
        </span>
      )}
    </span>
  );
}

/* Utility: wrap a term in text with tooltip */
export function explainTerm(text: string, term: string): JSX.Element {
  const parts = text.split(new RegExp(`(${term})`, 'i'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === term.toLowerCase()
          ? <TermTooltip key={i} term={term}>{part}</TermTooltip>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}
