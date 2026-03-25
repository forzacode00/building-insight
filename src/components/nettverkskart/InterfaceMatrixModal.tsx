import { useState } from "react";
import { motion } from "framer-motion";
import { X, Download } from "lucide-react";

type InterfaceStatus = "Uavklart" | "Under arbeid" | "Avklart" | "Kritisk";

interface InterfaceRow {
  nr: number;
  systemA: string;
  nsA: string;
  grensesnitt: string;
  systemB: string;
  nsB: string;
  type: string;
  konflikt: string;
  ansvarlig: string;
  status: InterfaceStatus;
  isConflict?: boolean;
}

const STATUS_STYLES: Record<InterfaceStatus, string> = {
  Uavklart: "bg-yellow-500/20 text-yellow-400",
  "Under arbeid": "bg-blue-500/20 text-blue-400",
  Avklart: "bg-emerald-500/20 text-emerald-400",
  Kritisk: "bg-red-500/20 text-red-400",
};

const INITIAL_DATA: InterfaceRow[] = [
  { nr: 1, systemA: "Varmeinstallasjon", nsA: "32", grensesnitt: "Settpunkt romtemp", systemB: "SD-anlegg", nsB: "56", type: "Styring", konflikt: "—", ansvarlig: "Automasjon", status: "Uavklart" },
  { nr: 2, systemA: "Luftbehandling", nsA: "36", grensesnitt: "CO₂ settpunkt", systemB: "SD-anlegg", nsB: "56", type: "Regulering", konflikt: "—", ansvarlig: "Automasjon", status: "Avklart" },
  { nr: 3, systemA: "Radiator aktuator", nsA: "32", grensesnitt: "Samtidig drift", systemB: "Kjølebafel", nsB: "37", type: "Konflikt", konflikt: "🔴 NOK 42 000/år", ansvarlig: "VVS + Automasjon", status: "Kritisk", isConflict: true },
  { nr: 4, systemA: "Kjølemaskin", nsA: "37", grensesnitt: "Isvannstemp tur/retur", systemB: "Kjølebafler", nsB: "37", type: "Kapasitet", konflikt: "—", ansvarlig: "VVS", status: "Avklart" },
  { nr: 5, systemA: "AHU gjenvinner", nsA: "36", grensesnitt: "Temperaturvirkningsgrad", systemB: "Varmebatteri", nsB: "36", type: "Energi", konflikt: "—", ansvarlig: "VVS", status: "Under arbeid" },
  { nr: 6, systemA: "VAV-spjeld", nsA: "36", grensesnitt: "Luftmengde behovsstyrt", systemB: "SD-anlegg", nsB: "56", type: "Regulering", konflikt: "—", ansvarlig: "Automasjon", status: "Avklart" },
  { nr: 7, systemA: "Brannspjeld", nsA: "36", grensesnitt: "Åpen/lukket status", systemB: "Brannalarm", nsB: "64", type: "Sikkerhet", konflikt: "—", ansvarlig: "Brann + Automasjon", status: "Avklart" },
  { nr: 8, systemA: "Elkraftforsyning", nsA: "40", grensesnitt: "Effektbehov UPS", systemB: "SD-anlegg", nsB: "56", type: "Kapasitet", konflikt: "—", ansvarlig: "Elkraft", status: "Uavklart" },
  { nr: 9, systemA: "Fjernvarmesentral", nsA: "32", grensesnitt: "Abonnert effekt", systemB: "Varmeinstallasjon", nsB: "32", type: "Kapasitet", konflikt: "—", ansvarlig: "VVS", status: "Avklart" },
  { nr: 10, systemA: "Solavskjerming", nsA: "28", grensesnitt: "Solintensitet trigger", systemB: "SD-anlegg", nsB: "56", type: "Styring", konflikt: "—", ansvarlig: "Fasade + Automasjon", status: "Uavklart" },
  { nr: 11, systemA: "Luftbehandling", nsA: "36", grensesnitt: "SFP krav TEK17", systemB: "Vifteeffekt", nsB: "36", type: "Krav", konflikt: "⚠ SFP 1.73", ansvarlig: "VVS", status: "Kritisk" },
  { nr: 12, systemA: "Kjølemaskin", nsA: "37", grensesnitt: "COP ved dellast", systemB: "Elkraftforsyning", nsB: "40", type: "Energi", konflikt: "—", ansvarlig: "VVS + Elkraft", status: "Under arbeid" },
  { nr: 13, systemA: "Varmepumpe", nsA: "32", grensesnitt: "Prioritet vs fjernvarme", systemB: "Fjernvarmesentral", nsB: "32", type: "Styring", konflikt: "—", ansvarlig: "VVS + Automasjon", status: "Uavklart" },
  { nr: 14, systemA: "Nattsenking", nsA: "56", grensesnitt: "Tidsprogram oppstart", systemB: "Varmeinstallasjon", nsB: "32", type: "Styring", konflikt: "—", ansvarlig: "Automasjon", status: "Avklart" },
];

const STATUS_OPTIONS: InterfaceStatus[] = ["Uavklart", "Under arbeid", "Avklart", "Kritisk"];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function InterfaceMatrixModal({ open, onClose }: Props) {
  const [rows, setRows] = useState<InterfaceRow[]>(INITIAL_DATA);

  if (!open) return null;

  const updateStatus = (nr: number, status: InterfaceStatus) => {
    setRows((prev) => prev.map((r) => (r.nr === nr ? { ...r, status } : r)));
  };

  const handleExportCSV = () => {
    const header = "Nr;System A;NS-kode A;Grensesnitt;System B;NS-kode B;Type;Konflikt;Ansvarlig fag;Status";
    const csvRows = rows.map(
      (r) => `${r.nr};${r.systemA};${r.nsA};${r.grensesnitt};${r.systemB};${r.nsB};${r.type};${r.konflikt};${r.ansvarlig};${r.status}`
    );
    const csv = [header, ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "grensesnittmatrise_parkveien.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/95 p-4 pt-8 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-7xl rounded-xl border border-border bg-card p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Grensesnittmatrise — Parkveien Kontorbygg</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Generert fra nettverkskart. Basert på NS 3935 grensesnittkrav.
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Nr</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">System A (NS-kode)</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Grensesnitt</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">System B (NS-kode)</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Type</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Konflikt</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Ansvarlig fag</th>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.nr}
                  className={`border-b border-border/50 transition-colors ${
                    row.isConflict
                      ? "animate-pulse bg-destructive/10"
                      : "hover:bg-secondary/30"
                  }`}
                  style={row.isConflict ? { animationDuration: "3s" } : undefined}
                >
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{row.nr}</td>
                  <td className="px-3 py-2 text-foreground">
                    {row.systemA} <span className="text-muted-foreground">({row.nsA})</span>
                  </td>
                  <td className="px-3 py-2 font-medium text-foreground">{row.grensesnitt}</td>
                  <td className="px-3 py-2 text-foreground">
                    {row.systemB} <span className="text-muted-foreground">({row.nsB})</span>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{row.type}</td>
                  <td className="px-3 py-2">
                    {row.konflikt === "—" ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <span className="text-xs font-semibold text-destructive">{row.konflikt}</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-sm font-medium text-foreground">{row.ansvarlig}</td>
                  <td className="px-3 py-2">
                    <select
                      value={row.status}
                      onChange={(e) => updateStatus(row.nr, e.target.value as InterfaceStatus)}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold border-0 cursor-pointer ${STATUS_STYLES[row.status]}`}
                      style={{ backgroundColor: "transparent" }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-card text-foreground">{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {rows.filter((r) => r.status === "Kritisk").length} kritiske · {rows.filter((r) => r.status === "Uavklart").length} uavklarte · {rows.filter((r) => r.status === "Avklart").length} avklarte
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <Download className="h-3.5 w-3.5" />
              Eksporter CSV
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              Lukk
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
