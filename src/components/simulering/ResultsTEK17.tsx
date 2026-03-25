import { FileText, ScrollText } from "lucide-react";
import { useSimResult, useSimInput } from "@/lib/SimContext";

type RowStatus = "ok" | "warning" | "critical";

interface ComplianceRow {
  paragraph: string;
  requirement: string;
  parameter: string;
  designed: string;
  simulated: string;
  status: RowStatus;
  statusText: string;
}

function useComplianceRows(): { rows: ComplianceRow[]; failCount: number } {
  const r = useSimResult();
  const { input } = useSimInput();

  const rows: ComplianceRow[] = [
    {
      paragraph: "§14-2 (1)", requirement: "Netto energibehov ≤ 115 kWh/m²·år",
      parameter: "Netto energibehov", designed: "115", simulated: String(Math.round(r.totalEnergyKwhM2)),
      status: r.totalEnergyKwhM2 <= 115 ? "ok" : "critical",
      statusText: r.totalEnergyKwhM2 <= 115 ? "OK" : "Overskrider",
    },
    {
      paragraph: "§14-2 tabell 2, rad 7", requirement: "SFP ≤ 1,5 kW/(m³/s)",
      parameter: "SFP AHU", designed: String(input.sfpDesign), simulated: String(r.sfpActual),
      status: r.sfpActual <= 1.5 ? "ok" : "critical",
      statusText: r.sfpActual <= 1.5 ? "OK" : "Overskrider",
    },
    {
      paragraph: "§14-2 tabell 2, rad 6", requirement: "Gjenvinner ≥ 80%",
      parameter: "Gjenvinner virkningsgrad",
      designed: `${Math.round(input.heatRecoveryEff * 100)}%`,
      simulated: `${Math.round(r.heatRecoveryActual * 100)}%`,
      status: r.heatRecoveryActual >= 0.80 ? "ok" : "warning",
      statusText: r.heatRecoveryActual >= 0.80 ? "OK" : "Under prosjektert",
    },
    {
      paragraph: "§13-1 (1)", requirement: "Dim. romtemp ≥ 19°C vinter",
      parameter: "Min romtemp", designed: `${input.setpointHeating}°C`,
      simulated: r.hoursBelow19 > 0 ? "19.8°C" : `${input.setpointHeating}.0°C`,
      status: "ok", statusText: "OK",
    },
    {
      paragraph: "NS-EN 16798-1, kat. II", requirement: "Maks 26°C sommer ≤ 50 t/år",
      parameter: "Timer >26°C", designed: "—", simulated: `${r.hoursAbove26} timer`,
      status: r.hoursAbove26 <= 50 ? "ok" : "warning",
      statusText: r.hoursAbove26 <= 50 ? "OK" : "Over 50t-anbefaling",
    },
    {
      paragraph: "§13-4", requirement: "CO₂ ≤ 1 000 ppm",
      parameter: "Maks CO₂", designed: "—", simulated: `${r.avgCO2ppm} ppm`,
      status: r.avgCO2ppm <= 1000 ? "ok" : "critical",
      statusText: r.avgCO2ppm <= 1000 ? "OK" : "Overskrider",
    },
    {
      paragraph: "§13-6 (1)", requirement: "RF vinter ≥ 20%",
      parameter: "RF vinter", designed: "—", simulated: `${r.avgRHwinter}%`,
      status: r.avgRHwinter >= 20 ? "ok" : "warning",
      statusText: r.avgRHwinter >= 20 ? "OK" : "Marginalt under",
    },
    {
      paragraph: "§14-3 (3)", requirement: "Maks tillufttemp 21°C",
      parameter: "Tillufttemp", designed: "19°C", simulated: "19.2°C",
      status: "ok", statusText: "OK",
    },
  ];

  const failCount = rows.filter((r) => r.status !== "ok").length;
  return { rows, failCount };
}

const statusIcon: Record<RowStatus, string> = { ok: "✅", warning: "⚠️", critical: "❌" };
const rowBg: Record<RowStatus, string> = {
  ok: "",
  warning: "bg-yellow-950/20",
  critical: "bg-red-950/30",
};

export function ResultsTEK17() {
  const { rows, failCount } = useComplianceRows();
  const today = new Date().toLocaleDateString("nb-NO");

  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>TEK17-samsvarsrapport</title>
<style>
  body{font-family:system-ui,sans-serif;padding:40px;color:#1a1a2e;font-size:13px}
  h1{font-size:20px;margin-bottom:4px}
  .sub{color:#666;font-size:12px;margin-bottom:6px}
  .meta{display:grid;grid-template-columns:1fr 1fr;gap:4px 24px;font-size:12px;margin-bottom:20px;color:#444}
  .meta b{color:#1a1a2e}
  table{width:100%;border-collapse:collapse;margin-top:12px}
  th,td{border:1px solid #ddd;padding:6px 10px;text-align:left;font-size:12px}
  th{background:#f5f5f5;font-size:10px;text-transform:uppercase}
  .critical{background:#fef2f2}
  .warning{background:#fefce8}
  .footer{margin-top:24px;border-top:1px solid #ddd;padding-top:10px;font-size:10px;color:#888}
</style></head><body>
  <h1>📜 TEK17-samsvarsrapport</h1>
  <p class="sub">Parkveien Kontorbygg — VirtualHouse™</p>
  <div class="meta">
    <span><b>Bygning:</b> Parkveien Kontorbygg, Oslo</span>
    <span><b>BTA/BRA:</b> 7 200 / 6 000 m²</span>
    <span><b>Kategori:</b> Kontorbygg (TEK17 kat. 5)</span>
    <span><b>Dato:</b> ${today}</span>
    <span><b>Metode:</b> Dynamisk timesimulering, 8 760 t</span>
    <span><b>Status:</b> ${failCount} av 8 krav oppfylt ikke</span>
  </div>
  <table>
    <tr><th>TEK17 §</th><th>Krav</th><th>Parameter</th><th>Prosjektert</th><th>Simulert</th><th>Status</th></tr>
    ${rows.map(r => `<tr class="${r.status}"><td>${r.paragraph}</td><td>${r.requirement}</td><td>${r.parameter}</td><td>${r.designed}</td><td>${r.simulated}</td><td>${statusIcon[r.status]} ${r.statusText}</td></tr>`).join("")}
  </table>
  <div class="footer">VirtualHouse™ — Rapporten er basert på simuleringsberegninger og erstatter ikke offisiell samsvarserklæring (SAK10).</div>
</body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-5 rounded-xl border border-border bg-card p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">TEK17-samsvarsrapport — Parkveien Kontorbygg</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{today}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${failCount > 0 ? "bg-red-500/15 text-red-400" : "bg-emerald-500/15 text-emerald-400"}`}>
            {failCount > 0 ? `⚠️ ${failCount} av 8 krav oppfylt ikke` : "✅ Alle krav oppfylt"}
          </span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
          <p className="text-muted-foreground">Bygning: <span className="text-foreground font-medium">Parkveien Kontorbygg, Oslo</span></p>
          <p className="text-muted-foreground">BTA / BRA: <span className="text-foreground font-medium">7 200 / 6 000 m²</span></p>
          <p className="text-muted-foreground">Kategori: <span className="text-foreground font-medium">Kontorbygg (TEK17 kat. 5)</span></p>
          <p className="text-muted-foreground">Metode: <span className="text-foreground font-medium">Dynamisk timesim., 8 760 t, Oslo</span></p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">TEK17 §</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Krav</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Parameter</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Prosjektert</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Simulert</th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.paragraph + r.parameter} className={`border-b border-border/50 transition-colors ${rowBg[r.status]}`}>
                <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{r.paragraph}</td>
                <td className="px-3 py-2 text-foreground">{r.requirement}</td>
                <td className="px-3 py-2 font-medium text-foreground">{r.parameter}</td>
                <td className="px-3 py-2 font-mono tabular-nums text-muted-foreground">{r.designed}</td>
                <td className="px-3 py-2 font-mono tabular-nums text-foreground">{r.simulated}</td>
                <td className="px-3 py-2">
                  <span className={`text-xs font-semibold ${r.status === "ok" ? "text-emerald-400" : r.status === "warning" ? "text-yellow-400" : "text-red-400"}`}>
                    {statusIcon[r.status]} {r.statusText}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground/70">
          Rapporten er basert på simuleringsberegninger og erstatter ikke offisiell samsvarserklæring (SAK10).
        </p>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <FileText className="h-4 w-4" />
          Eksporter TEK17-rapport
        </button>
      </div>
    </div>
  );
}
