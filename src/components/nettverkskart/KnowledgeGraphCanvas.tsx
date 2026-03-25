import { useRef, useEffect, useCallback, useState } from "react";
import { NODE_COLORS, type GraphNode, type GraphEdge, type NodeGroup } from "./graphData";

interface Props {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId: string | null;
  activeFilter: string;
  criticalPathIds: string[];
  onNodeClick: (id: string) => void;
  onEdgeHover: (edge: GraphEdge | null) => void;
  onBackgroundClick: () => void;
}

interface SimNode extends GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  _onPath?: boolean;
}

interface SimEdge {
  source: SimNode;
  target: SimNode;
  type: GraphEdge["type"];
  label?: string;
  bidirectional?: boolean;
}

export function KnowledgeGraphCanvas({
  nodes,
  edges,
  selectedNodeId,
  activeFilter,
  criticalPathIds,
  onNodeClick,
  onEdgeHover,
  onBackgroundClick,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simNodesRef = useRef<SimNode[]>([]);
  const simEdgesRef = useRef<SimEdge[]>([]);
  const animFrameRef = useRef<number>(0);
  const dragRef = useRef<{ node: SimNode | null; offsetX: number; offsetY: number }>({ node: null, offsetX: 0, offsetY: 0 });
  const hoveredNodeRef = useRef<SimNode | null>(null);
  const [tick, setTick] = useState(0);
  const timeRef = useRef(0);

  // Initialize simulation nodes
  useEffect(() => {
    const w = canvasRef.current?.parentElement?.clientWidth ?? 800;
    const h = canvasRef.current?.parentElement?.clientHeight ?? 600;
    const cx = w / 2;
    const cy = h / 2;

    // Position nodes in groups
    const groupAngles: Record<NodeGroup | string, number> = {
      climate: -Math.PI / 2,
      varme: -Math.PI / 4,
      kjøling: Math.PI / 4,
      ventilasjon: Math.PI * 3 / 4,
      automasjon: -Math.PI * 3 / 4,
    };

    const simNodes: SimNode[] = nodes.map((n, i) => {
      const angle = groupAngles[n.group] ?? 0;
      const groupNodes = nodes.filter(gn => gn.group === n.group);
      const idx = groupNodes.indexOf(n);
      const spread = 140;
      const radius = 180 + (idx % 3) * 60;

      return {
        ...n,
        x: cx + Math.cos(angle + (idx - groupNodes.length / 2) * 0.25) * radius + (Math.random() - 0.5) * spread,
        y: cy + Math.sin(angle + (idx - groupNodes.length / 2) * 0.25) * radius + (Math.random() - 0.5) * spread,
        vx: 0,
        vy: 0,
      };
    });

    const nodeMap = new Map(simNodes.map(n => [n.id, n]));
    const simEdges: SimEdge[] = edges
      .map(e => ({
        source: nodeMap.get(e.source as string)!,
        target: nodeMap.get(e.target as string)!,
        type: e.type,
        label: e.label,
        bidirectional: e.bidirectional,
      }))
      .filter(e => e.source && e.target);

    simNodesRef.current = simNodes;
    simEdgesRef.current = simEdges;
  }, [nodes, edges]);

  // Physics + render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let running = true;

    const resize = () => {
      const parent = canvas.parentElement!;
      canvas.width = parent.clientWidth * devicePixelRatio;
      canvas.height = parent.clientHeight * devicePixelRatio;
      canvas.style.width = parent.clientWidth + "px";
      canvas.style.height = parent.clientHeight + "px";
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const simulate = () => {
      if (!running) return;
      const sNodes = simNodesRef.current;
      const sEdges = simEdgesRef.current;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      timeRef.current += 0.016;

      // Repulsion
      for (let i = 0; i < sNodes.length; i++) {
        for (let j = i + 1; j < sNodes.length; j++) {
          const dx = sNodes[j].x - sNodes[i].x;
          const dy = sNodes[j].y - sNodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = 3000 / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          sNodes[i].vx -= fx;
          sNodes[i].vy -= fy;
          sNodes[j].vx += fx;
          sNodes[j].vy += fy;
        }
      }

      // Attraction on edges
      for (const edge of sEdges) {
        const dx = edge.target.x - edge.source.x;
        const dy = edge.target.y - edge.source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (dist - 120) * 0.005;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        edge.source.vx += fx;
        edge.source.vy += fy;
        edge.target.vx -= fx;
        edge.target.vy -= fy;
      }

      // Center gravity
      for (const n of sNodes) {
        n.vx += (w / 2 - n.x) * 0.0008;
        n.vy += (h / 2 - n.y) * 0.0008;
      }

      // Apply velocity with damping
      for (const n of sNodes) {
        if (dragRef.current.node === n) continue;
        n.vx *= 0.85;
        n.vy *= 0.85;
        n.x += n.vx;
        n.y += n.vy;
        n.x = Math.max(30, Math.min(w - 30, n.x));
        n.y = Math.max(30, Math.min(h - 30, n.y));
      }

      // Draw
      ctx.clearRect(0, 0, w, h);

      const selectedNeighbors = new Set<string>();
      if (selectedNodeId) {
        sEdges.forEach(e => {
          if (e.source.id === selectedNodeId) selectedNeighbors.add(e.target.id);
          if (e.target.id === selectedNodeId) selectedNeighbors.add(e.source.id);
        });
        // 2nd order
        const first = new Set(selectedNeighbors);
        sEdges.forEach(e => {
          if (first.has(e.source.id)) selectedNeighbors.add(e.target.id);
          if (first.has(e.target.id)) selectedNeighbors.add(e.source.id);
        });
        selectedNeighbors.add(selectedNodeId);
      }

      const critSet = new Set(criticalPathIds);
      const isCritical = activeFilter === "kritisk";

      // Draw edges
      for (const edge of sEdges) {
        const dimmed = selectedNodeId && !(selectedNeighbors.has(edge.source.id) && selectedNeighbors.has(edge.target.id));
        const isConflict = edge.type === "conflict";
        const onCritPath = isCritical && critSet.has(edge.source.id) && critSet.has(edge.target.id);

        ctx.beginPath();
        ctx.moveTo(edge.source.x, edge.source.y);
        ctx.lineTo(edge.target.x, edge.target.y);

        if (isConflict) {
          // Pulse for ~3 seconds then settle to steady glow
          const t = timeRef.current;
          const pulsePhase = t < 3 ? Math.sin(t * 4) * 0.4 + 0.6 : 0.7;
          ctx.strokeStyle = `rgba(239, 68, 68, ${dimmed ? 0.15 : pulsePhase})`;
          ctx.lineWidth = dimmed ? 1 : t < 3 ? 3 + Math.sin(t * 3) * 1 : 2.5;
          ctx.setLineDash([]);
        } else if (onCritPath) {
          ctx.strokeStyle = dimmed ? "rgba(234, 179, 8, 0.1)" : "rgba(234, 179, 8, 0.8)";
          ctx.lineWidth = 2.5;
          ctx.setLineDash([6, 4]);
        } else if (edge.type === "synergy") {
          ctx.strokeStyle = dimmed ? "rgba(34, 197, 94, 0.08)" : "rgba(34, 197, 94, 0.35)";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([]);
        } else {
          ctx.strokeStyle = dimmed ? "rgba(156, 163, 175, 0.06)" : "rgba(156, 163, 175, 0.2)";
          ctx.lineWidth = 1;
          ctx.setLineDash([]);
        }

        ctx.stroke();
        ctx.setLineDash([]);

        // Arrow
        if (!dimmed) {
          const angle = Math.atan2(edge.target.y - edge.source.y, edge.target.x - edge.source.x);
          const nodeRadius = getNodeRadius(edge.target);
          const ax = edge.target.x - Math.cos(angle) * (nodeRadius + 6);
          const ay = edge.target.y - Math.sin(angle) * (nodeRadius + 6);
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(ax - Math.cos(angle - 0.3) * 8, ay - Math.sin(angle - 0.3) * 8);
          ctx.lineTo(ax - Math.cos(angle + 0.3) * 8, ay - Math.sin(angle + 0.3) * 8);
          ctx.closePath();
          ctx.fillStyle = isConflict ? "rgba(239, 68, 68, 0.7)" : onCritPath ? "rgba(234, 179, 8, 0.6)" : "rgba(156, 163, 175, 0.3)";
          ctx.fill();
        }

        // Conflict glow
        if (isConflict && !dimmed) {
          const midX = (edge.source.x + edge.target.x) / 2;
          const midY = (edge.source.y + edge.target.y) / 2;
          const t = timeRef.current;
          const glowR = t < 3 ? 15 + Math.sin(t * 3) * 5 : 14;
          const glowAlpha = t < 3 ? 0.4 + Math.sin(t * 4) * 0.2 : 0.3;
          const gradient = ctx.createRadialGradient(midX, midY, 0, midX, midY, glowR);
          gradient.addColorStop(0, `rgba(239, 68, 68, ${glowAlpha})`);
          gradient.addColorStop(1, "rgba(239, 68, 68, 0)");
          ctx.beginPath();
          ctx.arc(midX, midY, glowR, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      }

      // Draw nodes
      for (const node of sNodes) {
        const dimmed = selectedNodeId && !selectedNeighbors.has(node.id);
        const isSelected = node.id === selectedNodeId;
        const isHovered = hoveredNodeRef.current?.id === node.id;
        const onPath = isCritical && critSet.has(node.id);
        const r = getNodeRadius(node);
        const color = NODE_COLORS[node.group];

        // Glow
        if ((isSelected || isHovered) && !dimmed) {
          const gradient = ctx.createRadialGradient(node.x, node.y, r, node.x, node.y, r * 2.5);
          gradient.addColorStop(0, color + "40");
          gradient.addColorStop(1, color + "00");
          ctx.beginPath();
          ctx.arc(node.x, node.y, r * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Critical path glow
        if (onPath && !dimmed) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, r + 4, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(234, 179, 8, 0.5)";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = dimmed ? color + "20" : color + (isSelected ? "FF" : "CC");
        ctx.fill();

        if (isSelected) {
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Label
        ctx.font = `${dimmed ? 300 : 500} 10px Inter, sans-serif`;
        ctx.fillStyle = dimmed ? "rgba(210, 220, 240, 0.2)" : "rgba(210, 220, 240, 0.9)";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        // Truncate label
        const maxLen = 20;
        const lbl = node.label.length > maxLen ? node.label.slice(0, maxLen - 1) + "…" : node.label;
        ctx.fillText(lbl, node.x, node.y + r + 4);
      }

      animFrameRef.current = requestAnimationFrame(simulate);
    };

    animFrameRef.current = requestAnimationFrame(simulate);

    return () => {
      running = false;
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [selectedNodeId, activeFilter, criticalPathIds]);

  // Mouse interaction
  const getNodeAt = useCallback((mx: number, my: number): SimNode | null => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const x = mx - rect.left;
    const y = my - rect.top;
    for (const n of simNodesRef.current) {
      const r = getNodeRadius(n);
      if ((n.x - x) ** 2 + (n.y - y) ** 2 < (r + 6) ** 2) return n;
    }
    return null;
  }, []);

  const getEdgeAt = useCallback((mx: number, my: number): GraphEdge | null => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const x = mx - rect.left;
    const y = my - rect.top;
    for (const e of simEdgesRef.current) {
      // Point-to-segment distance
      const dx = e.target.x - e.source.x;
      const dy = e.target.y - e.source.y;
      const len2 = dx * dx + dy * dy;
      if (len2 === 0) continue;
      let t = ((x - e.source.x) * dx + (y - e.source.y) * dy) / len2;
      t = Math.max(0, Math.min(1, t));
      const px = e.source.x + t * dx;
      const py = e.source.y + t * dy;
      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (dist < 8 && e.label) return e as unknown as GraphEdge;
    }
    return null;
  }, []);

  const handleMouseDown = useCallback((ev: React.MouseEvent) => {
    const node = getNodeAt(ev.clientX, ev.clientY);
    if (node) {
      const rect = canvasRef.current!.getBoundingClientRect();
      dragRef.current = { node, offsetX: ev.clientX - rect.left - node.x, offsetY: ev.clientY - rect.top - node.y };
    }
  }, [getNodeAt]);

  const handleMouseMove = useCallback((ev: React.MouseEvent) => {
    if (dragRef.current.node) {
      const rect = canvasRef.current!.getBoundingClientRect();
      dragRef.current.node.x = ev.clientX - rect.left - dragRef.current.offsetX;
      dragRef.current.node.y = ev.clientY - rect.top - dragRef.current.offsetY;
      dragRef.current.node.vx = 0;
      dragRef.current.node.vy = 0;
    } else {
      const node = getNodeAt(ev.clientX, ev.clientY);
      hoveredNodeRef.current = node;
      canvasRef.current!.style.cursor = node ? "pointer" : "default";

      const edge = getEdgeAt(ev.clientX, ev.clientY);
      onEdgeHover(edge);

      // Tooltip
      if (node) {
        canvasRef.current!.title = `${node.label} → påvirker ${node.connections ?? 0} andre parametere`;
      } else {
        canvasRef.current!.title = "";
      }
    }
  }, [getNodeAt, getEdgeAt, onEdgeHover]);

  const handleMouseUp = useCallback((ev: React.MouseEvent) => {
    if (dragRef.current.node) {
      // If barely moved, treat as click
      const node = getNodeAt(ev.clientX, ev.clientY);
      if (node) onNodeClick(node.id);
      dragRef.current = { node: null, offsetX: 0, offsetY: 0 };
    } else {
      const node = getNodeAt(ev.clientX, ev.clientY);
      if (node) {
        onNodeClick(node.id);
      } else {
        onBackgroundClick();
      }
    }
  }, [getNodeAt, onNodeClick, onBackgroundClick]);

  return (
    <div className="h-full w-full">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="h-full w-full"
      />
    </div>
  );
}

function getNodeRadius(node: { connections?: number }): number {
  const c = node.connections ?? 1;
  return Math.max(6, Math.min(18, 5 + c * 1.5));
}
