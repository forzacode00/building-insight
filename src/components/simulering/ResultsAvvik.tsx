import { useSimResult } from "@/lib/SimContext";

function StatusBadge({ severity }: { severity: "critical" | "warning" | "ok" }) {
  if (severity === "critical") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-red-800/50 bg-red-950/50 px-2.5 py-1 text-xs font-semibold text-red-400">
        <span className="h-2 w-2 rounded-full bg-red-400" />
        Høy
      </span>
    );
  }
  if (severity === "warning") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-yellow-800/50 bg-yellow-950/50 px-2.5 py-1 text-xs font-semibold text-yellow-400">
        <span className="h-2 w-2 rounded-full bg-yellow-400" />
        Medium
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-green-800/50 bg-green-950/50 px-2.5 py-1 text-xs font-semibold text-green-400">
      <span className="h-2 w-2 rounded-full bg-green-400" />
      Lav
    </span>
  );
}

export function ResultsAvvik() {
  const r = useSimResult();

  return (
    <div>
      <div className="mb-4 rounded-xl bg-secondary/50 px-4 py-2 text-xs text-muted-foreground">
        Innreguleringstolerans ±10% (NS 6450)
      </div>
      {r.avvik.length === 0 ? (
        <div className="rounded-xl border border-vh-green/30 bg-vh-green/5 p-8 text-center">
          <p className="text-sm font-medium text-vh-green">Ingen avvik funnet — alle parametere innenfor krav</p>
        </div>
      ) : (
        <div className="space-y-3">
          {r.avvik.map((a) => (
            <div key={a.nr} className="rounded-xl border border-border bg-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {a.system}
                </span>
                <StatusBadge severity={a.severity} />
              </div>
              <h3 className="text-sm font-bold text-foreground">{a.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{a.description}</p>
              <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5">
                <p className="text-sm text-primary">{a.tiltak}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
