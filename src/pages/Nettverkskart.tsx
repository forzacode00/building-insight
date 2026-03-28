import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Zap, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { graphNodes, graphEdges, NODE_COLORS, type GraphNode, type GraphEdge, type NodeGroup } from "@/components/nettverkskart/graphData";
import { KnowledgeGraphCanvas } from "@/components/nettverkskart/KnowledgeGraphCanvas";
import { InterfaceMatrixModal } from "@/components/nettverkskart/InterfaceMatrixModal";

type FilterMode = "alle" | "varme" | "kjøling" | "ventilasjon" | "konflikter" | "kritisk";

const filters: { id: FilterMode; label: string; color?: string }[] = [
  { id: "alle", label: "Vis alle" },
  { id: "varme", label: "Kun varme", color: "#EF4444" },
  { id: "kjøling", label: "Kun kjøling", color: "#3B82F6" },
  { id: "ventilasjon", label: "Kun ventilasjon", color: "#22C55E" },
  { id: "konflikter", label: "Kun konflikter", color: "#EF4444" },
  { id: "kritisk", label: "Vis kritisk sti", color: "#EAB308" },
];

// Critical path (longest dependency chain)
const criticalPathIds = [
  "internlast", "co2-nivå", "luftmengde-vav", "vifteeffekt-sfp",
  "trykktap", "brannspjeld", "luftfordeling"
];

export default function Nettverkskart() {
  const [activeFilter, setActiveFilter] = useState<FilterMode>("alle");
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<GraphEdge | null>(null);
  const [matrixOpen, setMatrixOpen] = useState(false);
  const navigate = useNavigate();

  const filteredData = useMemo(() => {
    let nodes = [...graphNodes];
    let edges = [...graphEdges];

    const groupMap: Record<string, NodeGroup> = { varme: "varme", kjøling: "kjøling", ventilasjon: "ventilasjon" };

    if (activeFilter in groupMap) {
      const group = groupMap[activeFilter];
      const nodeIds = new Set(nodes.filter(n => n.group === group).map(n => n.id));
      // Include connected nodes
      edges.forEach(e => {
        if (nodeIds.has(e.source as string) || nodeIds.has(e.target as string)) {
          nodeIds.add(e.source as string);
          nodeIds.add(e.target as string);
        }
      });
      nodes = nodes.filter(n => nodeIds.has(n.id));
      edges = edges.filter(e => nodeIds.has(e.source as string) && nodeIds.has(e.target as string));
    } else if (activeFilter === "konflikter") {
      const conflictEdges = edges.filter(e => e.type === "conflict");
      const nodeIds = new Set<string>();
      conflictEdges.forEach(e => { nodeIds.add(e.source as string); nodeIds.add(e.target as string); });
      nodes = nodes.filter(n => nodeIds.has(n.id));
      edges = conflictEdges;
    } else if (activeFilter === "kritisk") {
      const pathSet = new Set(criticalPathIds);
      // Include edges on the path
      edges = edges.filter(e =>
        pathSet.has(e.source as string) && pathSet.has(e.target as string)
      );
      // Show all nodes but highlight path ones
      nodes = nodes.map(n => ({ ...n, _onPath: pathSet.has(n.id) } as any));
    }

    return { nodes, edges };
  }, [activeFilter]);

  // Compute neighbours for selected node
  const selectedInfo = useMemo(() => {
    if (!selectedNode) return null;
    const affects = graphEdges
      .filter(e => e.source === selectedNode.id)
      .map(e => graphNodes.find(n => n.id === e.target)!)
      .filter(Boolean);
    const affectedBy = graphEdges
      .filter(e => e.target === selectedNode.id)
      .map(e => graphNodes.find(n => n.id === e.source)!)
      .filter(Boolean);
    return { affects, affectedBy };
  }, [selectedNode]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-[calc(100vh)] flex-col"
    >
      {/* Header */}
      <div className="shrink-0 border-b border-border px-6 py-4 lg:px-8">
        <h1 className="text-2xl font-bold text-foreground">VirtualHouse Knowledge Graph</h1>
        <p className="text-sm text-muted-foreground">Interaktivt avhengighetskart som viser hvordan hvert system påvirker de andre</p>

        {/* Filters */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                activeFilter === f.id
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-secondary text-muted-foreground hover:text-foreground"
              }`}
              style={activeFilter === f.id && f.color ? { backgroundColor: f.color } : {}}
            >
              {f.label}
            </button>
          ))}
          <div className="ml-auto">
            <button
              onClick={() => setMatrixOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
            >
              <ClipboardList className="h-3.5 w-3.5" />
              Grensesnittmatrise
            </button>
          </div>
        </div>
      </div>

      {/* Graph + Sidebar */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Canvas */}
        <div className="flex-1">
          <KnowledgeGraphCanvas
            nodes={filteredData.nodes}
            edges={filteredData.edges}
            selectedNodeId={selectedNode?.id ?? null}
            activeFilter={activeFilter}
            criticalPathIds={criticalPathIds}
            onNodeClick={(id) => {
              const node = graphNodes.find(n => n.id === id);
              setSelectedNode(node ?? null);
            }}
            onEdgeHover={setHoveredEdge}
            onBackgroundClick={() => setSelectedNode(null)}
          />

          {/* Edge tooltip */}
          <AnimatePresence>
            {hoveredEdge?.label && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground shadow-lg"
              >
                {hoveredEdge.label}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right sidebar */}
        <AnimatePresence>
          {selectedNode && selectedInfo && (
            <motion.aside
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 z-30 h-full w-80 overflow-y-auto border-l border-border bg-card p-5 shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: NODE_COLORS[selectedNode.group] }}
                />
                <button onClick={() => setSelectedNode(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <h3 className="text-lg font-bold text-foreground">{selectedNode.label}</h3>
              <div className="mt-3 space-y-2">
                <InfoRow label="Nåværende verdi" value={selectedNode.value || "—"} />
                <InfoRow label="NS 3451-kode" value={selectedNode.nsKode || "—"} />
                <InfoRow label="Tilkoblinger" value={String(selectedNode.connections ?? 0)} />
              </div>

              {selectedInfo.affects.length > 0 && (
                <div className="mt-5">
                  <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Påvirker →</p>
                  <div className="space-y-1">
                    {selectedInfo.affects.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => setSelectedNode(n)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
                      >
                        <ArrowRight className="h-3 w-3 shrink-0" style={{ color: NODE_COLORS[n.group] }} />
                        <span className="truncate">{n.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedInfo.affectedBy.length > 0 && (
                <div className="mt-5">
                  <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Påvirkes av ←</p>
                  <div className="space-y-1">
                    {selectedInfo.affectedBy.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => setSelectedNode(n)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
                      >
                        <ArrowLeft className="h-3 w-3 shrink-0" style={{ color: NODE_COLORS[n.group] }} />
                        <span className="truncate">{n.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => navigate("/simulator/sd-live")}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Zap className="h-4 w-4" />
                Simuler endring →
              </button>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {matrixOpen && <InterfaceMatrixModal open={matrixOpen} onClose={() => setMatrixOpen(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
