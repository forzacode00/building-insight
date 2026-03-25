export type NodeGroup = "climate" | "varme" | "kjøling" | "ventilasjon" | "automasjon";
export type EdgeType = "synergy" | "conflict" | "neutral";

export interface GraphNode {
  id: string;
  label: string;
  group: NodeGroup;
  value?: string;
  nsKode?: string;
  connections?: number;
  iconHint?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: EdgeType;
  label?: string;
  bidirectional?: boolean;
}

const NODE_COLORS: Record<NodeGroup, string> = {
  climate: "#9CA3AF",
  varme: "#EF4444",
  kjøling: "#3B82F6",
  ventilasjon: "#22C55E",
  automasjon: "#A855F7",
};

export { NODE_COLORS };

export const graphNodes: GraphNode[] = [
  // Climate (grey)
  { id: "utetemperatur", label: "Utetemperatur", group: "climate", value: "-5.2°C", nsKode: "—" },
  { id: "solinnstråling", label: "Solinnstråling sør-fasade", group: "climate", value: "340 W/m²", nsKode: "—" },
  // Varme (red)
  { id: "varmebehov-rad", label: "Varmebehov radiatorer", group: "varme", value: "187 kW", nsKode: "32" },
  { id: "turtemp-varme", label: "Turtemperatur varme 55°C", group: "varme", value: "55°C", nsKode: "32" },
  { id: "radiator-kap", label: "Radiator kapasitet", group: "varme", value: "280 kW", nsKode: "32" },
  { id: "pumpeeffekt", label: "Pumpeeffekt", group: "varme", value: "12.4 kW", nsKode: "32" },
  { id: "varmetap", label: "Varmetap ledningsnett", group: "varme", value: "8.2 kW", nsKode: "32" },
  { id: "fjernvarme-retur", label: "Fjernvarme returtemp", group: "varme", value: "38°C", nsKode: "32" },
  { id: "fjernvarme-eff", label: "Fjernvarme effektivitet", group: "varme", value: "92%", nsKode: "32" },
  { id: "rad-aktuator-4s", label: "Radiator aktuator sone 4S", group: "varme", value: "73% åpen", nsKode: "32" },
  // Kjøling (blue)
  { id: "kjølebehov", label: "Kjølebehov", group: "kjøling", value: "142 kW", nsKode: "37" },
  { id: "kjølebehov-sør", label: "Kjølebehov sør-soner", group: "kjøling", value: "68 kW", nsKode: "37" },
  { id: "kjølemaskin", label: "Kjølemaskin", group: "kjøling", value: "400 kW nom.", nsKode: "35" },
  { id: "isvannstemp", label: "Isvannstemperatur 6°C", group: "kjøling", value: "6.1°C", nsKode: "35" },
  { id: "kjølebafel-kap", label: "Kjølebafel kapasitet", group: "kjøling", value: "108 kW", nsKode: "37" },
  { id: "kondensfarerisiko", label: "Kondensfarerisiko", group: "kjøling", value: "Lav", nsKode: "37" },
  { id: "elkraft-kjøling", label: "Elkraftforbruk kjøling", group: "kjøling", value: "89 kW", nsKode: "44" },
  { id: "overtemp-risiko", label: "Overtemperatur-risiko", group: "kjøling", value: "Middels", nsKode: "37" },
  { id: "frikjøling", label: "Frikjøling tilgjengelig?", group: "kjøling", value: "Nei (>12°C)", nsKode: "35" },
  { id: "kjølebafel-ventil-4s", label: "Kjølebafel ventil sone 4S", group: "kjøling", value: "45% åpen", nsKode: "37" },
  // Ventilasjon (green)
  { id: "luftmengde-vav", label: "Luftmengde (VAV)", group: "ventilasjon", value: "34,200 m³/h", nsKode: "36" },
  { id: "co2-nivå", label: "CO₂-nivå", group: "ventilasjon", value: "720 ppm", nsKode: "36" },
  { id: "vifteeffekt-sfp", label: "Vifteeffekt (SFP)", group: "ventilasjon", value: "1.82 kW/(m³/s)", nsKode: "36" },
  { id: "trykktap", label: "Trykktap kanalnett", group: "ventilasjon", value: "312 Pa", nsKode: "36" },
  { id: "varmebatteri-eff", label: "Varmebatteri effekt", group: "ventilasjon", value: "64 kW", nsKode: "36" },
  { id: "kjølebatteri-eff", label: "Kjølebatteri effekt", group: "ventilasjon", value: "48 kW", nsKode: "36" },
  { id: "gjenvinner-eff", label: "Gjenvinner effektivitet", group: "ventilasjon", value: "76%", nsKode: "36" },
  { id: "gjenvinner-last", label: "Gjenvinner last", group: "ventilasjon", value: "82%", nsKode: "36" },
  { id: "brannspjeld", label: "Brannspjeld status", group: "ventilasjon", value: "Normal", nsKode: "33" },
  { id: "luftfordeling", label: "Luftfordeling", group: "ventilasjon", value: "Balansert", nsKode: "36" },
  { id: "avkastluft-temp", label: "Avkastluft temperatur", group: "ventilasjon", value: "22.4°C", nsKode: "36" },
  // Automasjon (purple)
  { id: "sd-settpunkt", label: "SD-anlegg settpunkt romtemp", group: "automasjon", value: "21.0°C", nsKode: "56" },
  { id: "vav-spjeld", label: "VAV-spjeld posisjon", group: "automasjon", value: "62% åpen", nsKode: "56" },
  { id: "internlast", label: "Internlast (personer + utstyr)", group: "automasjon", value: "38 W/m²", nsKode: "56" },
];

export const graphEdges: GraphEdge[] = [
  { source: "utetemperatur", target: "varmebehov-rad", type: "neutral" },
  { source: "utetemperatur", target: "gjenvinner-eff", type: "neutral" },
  { source: "utetemperatur", target: "kjølebehov", type: "neutral" },
  { source: "utetemperatur", target: "frikjøling", type: "synergy" },
  { source: "internlast", target: "kjølebehov", type: "neutral" },
  { source: "internlast", target: "co2-nivå", type: "neutral" },
  { source: "internlast", target: "luftmengde-vav", type: "neutral" },
  { source: "luftmengde-vav", target: "vifteeffekt-sfp", type: "neutral", label: "Kubisk forhold: P ∝ Q³ — Luftmengde +20% → Vifteeffekt +73%" },
  { source: "luftmengde-vav", target: "trykktap", type: "neutral" },
  { source: "luftmengde-vav", target: "varmebatteri-eff", type: "neutral" },
  { source: "luftmengde-vav", target: "kjølebatteri-eff", type: "neutral" },
  { source: "luftmengde-vav", target: "gjenvinner-last", type: "neutral" },
  { source: "luftmengde-vav", target: "co2-nivå", type: "synergy", bidirectional: true },
  { source: "turtemp-varme", target: "radiator-kap", type: "neutral" },
  { source: "turtemp-varme", target: "pumpeeffekt", type: "neutral" },
  { source: "turtemp-varme", target: "varmetap", type: "neutral" },
  { source: "turtemp-varme", target: "fjernvarme-retur", type: "neutral" },
  { source: "fjernvarme-retur", target: "fjernvarme-eff", type: "synergy" },
  { source: "kjølemaskin", target: "isvannstemp", type: "neutral" },
  { source: "kjølemaskin", target: "elkraft-kjøling", type: "neutral" },
  { source: "kjølemaskin", target: "avkastluft-temp", type: "neutral" },
  { source: "isvannstemp", target: "kjølebafel-kap", type: "neutral" },
  { source: "isvannstemp", target: "kondensfarerisiko", type: "neutral" },
  { source: "solinnstråling", target: "kjølebehov-sør", type: "neutral" },
  { source: "solinnstråling", target: "overtemp-risiko", type: "neutral" },
  { source: "brannspjeld", target: "trykktap", type: "neutral" },
  { source: "brannspjeld", target: "luftfordeling", type: "neutral" },
  { source: "sd-settpunkt", target: "rad-aktuator-4s", type: "neutral" },
  { source: "sd-settpunkt", target: "vav-spjeld", type: "neutral" },
  { source: "sd-settpunkt", target: "kjølebafel-ventil-4s", type: "neutral" },
  // CONFLICT edge
  { source: "rad-aktuator-4s", target: "kjølebafel-ventil-4s", type: "conflict", label: "⚠️ Samtidig varme/kjøle-drift: estimert bortkastet energi NOK 42 000/år" },
];

// Pre-compute connection counts
graphNodes.forEach((node) => {
  node.connections = graphEdges.filter(
    (e) => e.source === node.id || e.target === node.id
  ).length;
});
