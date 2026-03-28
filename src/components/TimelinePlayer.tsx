import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";

interface TimelineEvent {
  month: number;
  type: "critical" | "warning" | "info";
  label: string;
}

interface TimelinePlayerProps {
  events: TimelineEvent[];
  totalMonths?: number;
  onMonthChange?: (month: number) => void;
  className?: string;
}

export default function TimelinePlayer({
  events,
  totalMonths = 24,
  onMonthChange,
  className = "",
}: TimelinePlayerProps) {
  const [currentMonth, setCurrentMonth] = useState(0);
  const [playing, setPlaying] = useState(false);
  const rafRef = useRef<number>();
  const startRef = useRef<number>(0);

  // Auto-play
  useEffect(() => {
    if (!playing) return;
    startRef.current = performance.now() - (currentMonth / totalMonths) * 8000;
    
    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const month = Math.min((elapsed / 8000) * totalMonths, totalMonths);
      setCurrentMonth(month);
      onMonthChange?.(month);
      if (month < totalMonths) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPlaying(false);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [playing, totalMonths, onMonthChange]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setCurrentMonth(v);
    onMonthChange?.(v);
    setPlaying(false);
  };

  const reset = () => {
    setCurrentMonth(0);
    setPlaying(false);
    onMonthChange?.(0);
  };

  // Find active events up to current month
  const activeEvents = events.filter(e => e.month <= currentMonth);
  const nextEvent = events.find(e => e.month > currentMonth);

  return (
    <div className={`rounded-xl border border-border bg-card p-5 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Fremtidssimulering
        </p>
        <span className="text-xs font-mono tabular-nums text-primary font-bold">
          Måned {Math.round(currentMonth)} / {totalMonths}
        </span>
      </div>

      {/* Timeline track */}
      <div className="relative mb-2">
        {/* Background */}
        <div className="h-3 rounded-full bg-secondary w-full relative overflow-hidden">
          {/* Year 1 / Year 2 split */}
          <div className="absolute top-0 left-0 h-full w-1/2 bg-primary/10 rounded-l-full" />
          <div className="absolute top-0 left-1/2 h-full w-1/2 bg-vh-yellow/10 rounded-r-full" />
          
          {/* Progress */}
          <motion.div 
            className="absolute top-0 left-0 h-full rounded-full bg-primary/40"
            style={{ width: `${(currentMonth / totalMonths) * 100}%` }}
          />
        </div>

        {/* Event markers on track */}
        {events.map((e, i) => (
          <div
            key={i}
            className="absolute top-0"
            style={{ left: `${(e.month / totalMonths) * 100}%`, transform: "translateX(-50%)" }}
          >
            <div className={`h-3 w-1.5 rounded-full ${
              e.type === "critical" ? "bg-destructive" : e.type === "warning" ? "bg-vh-yellow" : "bg-primary"
            } ${e.month <= currentMonth ? "opacity-100" : "opacity-30"}`} />
          </div>
        ))}
      </div>

      {/* Slider control */}
      <input
        type="range"
        min="0"
        max={totalMonths}
        step="0.1"
        value={currentMonth}
        onChange={handleSliderChange}
        className="w-full h-1 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-card [&::-webkit-slider-thumb]:shadow-md"
      />

      {/* Controls */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPlaying(!playing)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary hover:bg-secondary/80 transition-colors"
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
          </button>
          <button
            onClick={reset}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <span className="text-[10px] text-muted-foreground ml-2">
            {currentMonth < 12 ? "År 1" : "År 2 (med slitasje)"}
          </span>
        </div>

        {/* Current/next event indicator */}
        <div className="text-right">
          {activeEvents.length > 0 && (
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
              activeEvents[activeEvents.length - 1].type === "critical" ? "bg-destructive/10 text-destructive" :
              activeEvents[activeEvents.length - 1].type === "warning" ? "bg-vh-yellow/10 text-vh-yellow" :
              "bg-primary/10 text-primary"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${
                activeEvents[activeEvents.length - 1].type === "critical" ? "bg-destructive" :
                activeEvents[activeEvents.length - 1].type === "warning" ? "bg-vh-yellow" : "bg-primary"
              }`} />
              {activeEvents[activeEvents.length - 1].label}
            </span>
          )}
        </div>
      </div>

      {/* Event log */}
      {activeEvents.length > 0 && (
        <div className="mt-3 border-t border-border pt-3 space-y-1.5 max-h-32 overflow-y-auto">
          {activeEvents.map((e, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px]">
              <span className="font-mono text-muted-foreground w-12 shrink-0">mnd {e.month + 1}</span>
              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                e.type === "critical" ? "bg-destructive" : e.type === "warning" ? "bg-vh-yellow" : "bg-primary"
              }`} />
              <span className="text-foreground">{e.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
