import { useState, useRef } from "react";

const months = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"];
const TOTAL_HOURS = 8760;
const monthStartHours = [0, 744, 1416, 2160, 2880, 3624, 4344, 5088, 5832, 6552, 7296, 8016];

interface TimelineEvent {
  hourStart: number;
  hourEnd?: number;
  color: "red" | "yellow" | "green";
  label: string;
  avvikNr?: number; // links to avvik tab
}

const events: TimelineEvent[] = [
  { hourStart: 120, hourEnd: 180, color: "red", label: "SFP overskred 1.5 kW/(m³/s) — Kald start januar", avvikNr: 1 },
  { hourStart: 800, hourEnd: 900, color: "yellow", label: "Pumpe >90% kapasitet — kuldeperiode" },
  { hourStart: 2340, color: "yellow", label: "Gjenvinner virkningsgrad falt under 75%" },
  { hourStart: 4100, hourEnd: 4500, color: "red", label: "Sommerperiode — 87 timer overtemperatur >26°C sone 4S", avvikNr: 3 },
  { hourStart: 4200, color: "red", label: "Samtidig varme/kjøle-drift detektert sone 4S", avvikNr: 2 },
  { hourStart: 5800, color: "yellow", label: "Kjølemaskin COP falt til 3.8 — høy utetemperatur" },
  { hourStart: 7200, color: "green", label: "Frikjøling aktivert — normal drift" },
  { hourStart: 8400, color: "yellow", label: "Filter trykktap +30% — bytte anbefalt" },
];

function hourToDate(hour: number): string {
  const d = new Date(2026, 0, 1);
  d.setHours(d.getHours() + hour);
  return d.toLocaleDateString("no-NO", { day: "numeric", month: "short" });
}

const colorMap = {
  red: { dot: "bg-red-500", ring: "ring-red-500/30", band: "bg-red-500/30 border-red-500/50" },
  yellow: { dot: "bg-yellow-500", ring: "ring-yellow-500/30", band: "bg-yellow-500/30 border-yellow-500/50" },
  green: { dot: "bg-green-500", ring: "ring-green-500/30", band: "bg-green-500/30 border-green-500/50" },
};

interface Props {
  onAvvikClick?: (nr: number) => void;
}

export function SimTimeline({ onAvvikClick }: Props) {
  const [tooltip, setTooltip] = useState<{ x: number; event: TimelineEvent } | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const pct = (hour: number) => (hour / TOTAL_HOURS) * 100;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h4 className="mb-3 text-sm font-semibold text-foreground">Hendelsestidslinje — 8 760 timer</h4>
      <div className="relative">
        {/* Bar */}
        <div
          ref={barRef}
          className="relative h-10 w-full rounded-xl border border-border bg-[#111827]"
        >
          {/* Event markers */}
          {events.map((ev, i) => {
            const isBand = ev.hourEnd && (ev.hourEnd - ev.hourStart) > 100;
            const left = pct(ev.hourStart);
            const width = ev.hourEnd ? pct(ev.hourEnd) - pct(ev.hourStart) : 0;
            const c = colorMap[ev.color];

            if (isBand) {
              return (
                <div
                  key={i}
                  className={`absolute top-1 bottom-1 rounded-md border ${c.band} cursor-pointer transition-opacity hover:opacity-80`}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  onMouseEnter={() => setTooltip({ x: left + width / 2, event: ev })}
                  onMouseLeave={() => setTooltip(null)}
                  onClick={() => ev.avvikNr && onAvvikClick?.(ev.avvikNr)}
                />
              );
            }

            return (
              <div
                key={i}
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-3 rounded-full ${c.dot} ring-2 ${c.ring} cursor-pointer transition-transform hover:scale-150`}
                style={{ left: `${left}%` }}
                onMouseEnter={() => setTooltip({ x: left, event: ev })}
                onMouseLeave={() => setTooltip(null)}
                onClick={() => ev.avvikNr && onAvvikClick?.(ev.avvikNr)}
              />
            );
          })}
        </div>

        {/* Month labels */}
        <div className="relative mt-1.5 h-4">
          {months.map((m, i) => (
            <span
              key={m}
              className="absolute text-[10px] text-muted-foreground -translate-x-1/2"
              style={{ left: `${pct(monthStartHours[i] + (i < 11 ? (monthStartHours[i + 1] - monthStartHours[i]) / 2 : (TOTAL_HOURS - monthStartHours[i]) / 2))}%` }}
            >
              {m}
            </span>
          ))}
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute bottom-14 z-20 -translate-x-1/2 rounded-lg border border-border bg-popover px-3 py-2 shadow-xl"
            style={{ left: `${tooltip.x}%`, maxWidth: 280 }}
          >
            <p className="text-xs font-semibold text-foreground">{tooltip.event.label}</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground font-mono tabular-nums">
              Time {tooltip.event.hourStart.toLocaleString("no-NO")}
              {tooltip.event.hourEnd ? `–${tooltip.event.hourEnd.toLocaleString("no-NO")}` : ""} — {hourToDate(tooltip.event.hourStart)}
            </p>
            {tooltip.event.avvikNr && (
              <p className="mt-1 text-[10px] text-primary">Klikk for å se avvik →</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
