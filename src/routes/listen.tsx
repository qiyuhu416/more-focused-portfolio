import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteNav } from "./-SiteNav";

export const Route = createFileRoute("/listen")({
  head: () => ({
    meta: [
      { title: "Qiyu — Listen" },
      { name: "description", content: "Voices and values that have shaped my thinking." },
    ],
  }),
  component: ListenComponent,
});

interface NodeData {
  id: string;
  label: string;
  fullLabel: string;
  quote?: string;
  type: "synthesis" | "person";
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface BioPerson {
  name: string;
  role: string;
  note: string;
}

const BIO_DATA: Record<string, BioPerson> = {
  mia: {
    name: "Mia Hu",
    role: "who I currently see every week :)",
    note: "The best job is about making good laugh with good people. Mia makes me like my job.",
  },
  huaze: {
    name: "Huaze Shao",
    role: "that Buddhist friend, currently in China",
    note: "Someone I always turn to when I navigate through life's uncertainties, drink tea with, or simply yawn together while soaking up the sun.",
  },
  jess: {
    name: "Jess Hammer",
    role: "mentor from my college, currently in Pittsburgh",
    note: "Still thinking about how to write a proper description about Jess, but EVERYONE has something to say about her. She is a magical person.",
  },
};

const SPECIAL_PEOPLE_IDS = new Set(Object.keys(BIO_DATA));

const REF_CX = 450, REF_CY = 240;

const INITIAL_NODES: NodeData[] = [
  { id: "joy",       label: "Joy in work",          fullLabel: "Find joy in the work itself",                            type: "synthesis", x: REF_CX - 120, y: REF_CY - 40,  vx: 0, vy: 0 },
  { id: "inspire",   label: "Inspire & be inspired", fullLabel: "Inspire others and let yourself be inspired in return", type: "synthesis", x: REF_CX + 80,  y: REF_CY - 80,  vx: 0, vy: 0 },
  { id: "action",    label: "Bias to act",           fullLabel: "Have a bias toward action — make things happen",        type: "synthesis", x: REF_CX + 200, y: REF_CY + 60,  vx: 0, vy: 0 },
  { id: "ambiguity", label: "Embrace the mess",      fullLabel: "Hold your urge to solve; sit with the messiness",       type: "synthesis", x: REF_CX - 60,  y: REF_CY + 120, vx: 0, vy: 0 },
  { id: "direction", label: "Direction > pace",      fullLabel: "Being on the right track matters more than being fast", type: "synthesis", x: REF_CX + 140, y: REF_CY + 150, vx: 0, vy: 0 },
  { id: "mia",    label: "Mia H.",    fullLabel: "Mia H.",    quote: "Make work fun.",                                                            type: "person", x: REF_CX - 280, y: REF_CY - 100, vx: 0, vy: 0 },
  { id: "samar",  label: "Samar K.",  fullLabel: "Samar K.",  quote: "I am lucky to have a job I would work for even without getting paid.",     type: "person", x: REF_CX - 260, y: REF_CY + 60,  vx: 0, vy: 0 },
  { id: "sharif", label: "Sharif S.", fullLabel: "Sharif S.", quote: "It feels great to inspire people and get inspired.",                       type: "person", x: REF_CX + 20,  y: REF_CY - 200, vx: 0, vy: 0 },
  { id: "yan",    label: "Yan M.",    fullLabel: "Yan M.",    quote: "Make things happen.",                                                       type: "person", x: REF_CX + 340, y: REF_CY - 20,  vx: 0, vy: 0 },
  { id: "jess",   label: "Jess H.",   fullLabel: "Jess H.",   quote: "Hold your tendency to seek solutions; enjoy the messiness.",               type: "person", x: REF_CX - 180, y: REF_CY + 200, vx: 0, vy: 0 },
  { id: "qian",   label: "Qian Y.",   fullLabel: "Qian Y.",   quote: "It's okay to be a little slow as long as you're on the right track.",     type: "person", x: REF_CX + 300, y: REF_CY + 200, vx: 0, vy: 0 },
  { id: "huaze",  label: "Huaze S.",  fullLabel: "Huaze S.",  quote: "Sit with the uncertainty. It's not a problem to solve.",                   type: "person", x: REF_CX - 320, y: REF_CY + 160, vx: 0, vy: 0 },
];

const LINKS = [
  { source: "mia",       target: "joy"       },
  { source: "samar",     target: "joy"       },
  { source: "sharif",    target: "inspire"   },
  { source: "sharif",    target: "joy"       },
  { source: "yan",       target: "action"    },
  { source: "jess",      target: "ambiguity" },
  { source: "qian",      target: "direction" },
  { source: "huaze",     target: "ambiguity" },
  { source: "joy",       target: "inspire"   },
  { source: "ambiguity", target: "direction" },
];

function ListenComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef  = useRef<NodeData[]>(INITIAL_NODES.map(n => ({ ...n })));
  const hoveredIdRef = useRef<string | null>(null);
  const dragRef = useRef<{ id: string; startX: number; startY: number; moved: boolean } | null>(null);
  const panRef  = useRef({ x: 0, y: 0, dragging: false, lastX: 0, lastY: 0 });
  const rafRef  = useRef<number>(0);
  const sizeRef = useRef({ W: 0, H: 0, dpr: 1 });
  const initializedRef = useRef(false);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [modal, setModal]         = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    sizeRef.current.dpr = dpr;

    const resize = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      sizeRef.current.W = W;
      sizeRef.current.H = H;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      if (!initializedRef.current) {
        initializedRef.current = true;
        const scale = Math.min(W / 900, H / 480) * 0.85;
        nodesRef.current.forEach(n => {
          n.x = W / 2 + (n.x - REF_CX) * scale;
          n.y = H / 2 + (n.y - REF_CY) * scale;
        });
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      const { W, H } = sizeRef.current;
      const { x: panX, y: panY } = panRef.current;
      const nodes = nodesRef.current;

      nodes.forEach((a, i) => {
        if (dragRef.current?.id === a.id) return;
        let fx = 0, fy = 0;

        nodes.forEach((b, j) => {
          if (i === j) return;
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const f = 4500 / (dist * dist);
          fx += (dx / dist) * f;
          fy += (dy / dist) * f;
        });

        LINKS.forEach(link => {
          if (link.source !== a.id && link.target !== a.id) return;
          const otherId = link.source === a.id ? link.target : link.source;
          const b = nodes.find(n => n.id === otherId);
          if (!b) return;
          const dx = b.x - a.x, dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const stretch = dist - 140;
          fx += (dx / dist) * 0.05 * stretch;
          fy += (dy / dist) * 0.05 * stretch;
        });

        fx += (W / 2 - a.x) * 0.003;
        fy += (H / 2 - a.y) * 0.003;

        a.vx = (a.vx + fx) * 0.78;
        a.vy = (a.vy + fy) * 0.78;
        a.x += a.vx;
        a.y += a.vy;
      });

      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.translate(panX, panY);

      const hov = hoveredIdRef.current;
      const linkedToHov = new Set<string>();
      if (hov) {
        LINKS.forEach(l => {
          if (l.source === hov) linkedToHov.add(l.target);
          if (l.target === hov) linkedToHov.add(l.source);
        });
      }

      LINKS.forEach(link => {
        const s = nodes.find(n => n.id === link.source);
        const t = nodes.find(n => n.id === link.target);
        if (!s || !t) return;
        const active = hov && (link.source === hov || link.target === hov);
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(t.x, t.y);
        ctx.strokeStyle = active ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.07)";
        ctx.lineWidth = active ? 1.2 : 0.7;
        ctx.stroke();
      });

      nodes.forEach(node => {
        const isGreen   = node.type === "synthesis";
        const isSpecial = SPECIAL_PEOPLE_IDS.has(node.id);
        const isHov     = node.id === hov;
        const isLinked  = linkedToHov.has(node.id);
        const dimmed    = !!(hov && !isHov && !isLinked);
        const r = isGreen ? (isHov ? 9 : 7) : isSpecial ? (isHov ? 8 : 6) : (isHov ? 7 : 4.5);

        if ((isHov || isLinked) && !dimmed) {
          const glowColor = isGreen
            ? "rgba(52,211,153,0.22)"
            : isSpecial
            ? "rgba(251,191,36,0.22)"
            : "rgba(255,255,255,0.10)";
          const grad = ctx.createRadialGradient(node.x, node.y, r, node.x, node.y, r + 16);
          grad.addColorStop(0, glowColor);
          grad.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(node.x, node.y, r + 16, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // Pulsing ring for special people
        if (isSpecial && !dimmed && !isHov) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, r + 3.5, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(251,191,36,0.35)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        if (isGreen) {
          ctx.fillStyle = dimmed ? "rgba(52,211,153,0.2)" : isHov ? "#a7f3d0" : "#34d399";
        } else if (isSpecial) {
          ctx.fillStyle = dimmed ? "rgba(251,191,36,0.15)" : isHov ? "#fef3c7" : "#fbbf24";
        } else {
          ctx.fillStyle = dimmed
            ? "rgba(115,115,115,0.25)"
            : isHov
            ? "#ffffff"
            : isLinked
            ? "rgba(212,212,212,0.8)"
            : "rgba(163,163,163,0.6)";
        }
        ctx.fill();

        ctx.globalAlpha = dimmed ? 0.2 : 1;
        ctx.font = `${isHov ? "11px" : "10px"} -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillStyle = isGreen
          ? isHov ? "#a7f3d0" : "#6ee7b7"
          : isSpecial
          ? isHov ? "#fef3c7" : "#fcd34d"
          : isHov ? "#e5e5e5" : "#6b7280";
        ctx.fillText(node.label, node.x, node.y + r + 13);
        ctx.globalAlpha = 1;
      });

      // Quote tooltip
      if (hov) {
        const hovNode = nodes.find(n => n.id === hov);
        if (hovNode?.type === "person" && hovNode.quote && !SPECIAL_PEOPLE_IDS.has(hovNode.id)) {
          const text = `"${hovNode.quote}"`;
          const maxW = 210, pad = 10, lineH = 15;
          ctx.font = "italic 10.5px -apple-system, BlinkMacSystemFont, sans-serif";
          const words = text.split(" ");
          const lines: string[] = [];
          let cur = "";
          for (const w of words) {
            const test = cur ? `${cur} ${w}` : w;
            if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = w; }
            else cur = test;
          }
          if (cur) lines.push(cur);
          const bw = Math.min(maxW, Math.max(...lines.map(l => ctx.measureText(l).width))) + pad * 2;
          const bh = lines.length * lineH + pad * 2;
          const { W: cW, H: cH } = sizeRef.current;
          let bx = hovNode.x + 16;
          if (bx + bw > cW - panX - 8) bx = hovNode.x - 16 - bw;
          const by = Math.max(8 - panY, Math.min(cH - panY - bh - 8, hovNode.y - bh / 2));
          ctx.fillStyle = "rgba(12,12,14,0.93)";
          ctx.strokeStyle = "rgba(255,255,255,0.08)";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.roundRect(bx, by, bw, bh, 6);
          ctx.fill(); ctx.stroke();
          ctx.fillStyle = "rgba(212,212,212,0.88)";
          ctx.textAlign = "left";
          lines.forEach((line, i) => ctx.fillText(line, bx + pad, by + pad + (i + 1) * lineH - 3));
          ctx.textAlign = "center";
        }
      }

      ctx.restore();
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    const toWorld = (clientX: number, clientY: number) => {
      const rect  = canvas.getBoundingClientRect();
      const { W, H } = sizeRef.current;
      const scaleX = W / rect.width;
      const scaleY = H / rect.height;
      return {
        wx: (clientX - rect.left) * scaleX - panRef.current.x,
        wy: (clientY - rect.top)  * scaleY - panRef.current.y,
      };
    };

    const pick = (wx: number, wy: number): NodeData | null => {
      let best: NodeData | null = null as NodeData | null, minD = 30;
      nodesRef.current.forEach(n => {
        const d = Math.hypot(n.x - wx, n.y - wy);
        if (d < minD) { minD = d; best = n; }
      });
      return best;
    };

    const onMove = (e: MouseEvent) => {
      const { wx, wy } = toWorld(e.clientX, e.clientY);
      const best = pick(wx, wy);
      hoveredIdRef.current = best?.id ?? null;
      setHoveredId(best?.id ?? null);

      if (dragRef.current) {
        const node = nodesRef.current.find(n => n.id === dragRef.current!.id);
        if (node) {
          const dx = Math.abs(wx - dragRef.current.startX);
          const dy = Math.abs(wy - dragRef.current.startY);
          if (dx > 5 || dy > 5) dragRef.current.moved = true;
          node.x = wx; node.y = wy; node.vx = 0; node.vy = 0;
        }
      } else if (panRef.current.dragging) {
        panRef.current.x += e.clientX - panRef.current.lastX;
        panRef.current.y += e.clientY - panRef.current.lastY;
        panRef.current.lastX = e.clientX;
        panRef.current.lastY = e.clientY;
      }

      canvas.style.cursor =
        dragRef.current || panRef.current.dragging
          ? "grabbing"
          : best
          ? SPECIAL_PEOPLE_IDS.has(best.id) ? "pointer" : "grab"
          : "default";
    };

    const onDown = (e: MouseEvent) => {
      const { wx, wy } = toWorld(e.clientX, e.clientY);
      const best = pick(wx, wy);
      if (best) {
        dragRef.current = { id: best.id, startX: wx, startY: wy, moved: false };
        canvas.style.cursor = "grabbing";
      } else {
        panRef.current.dragging = true;
        panRef.current.lastX = e.clientX;
        panRef.current.lastY = e.clientY;
        canvas.style.cursor = "grabbing";
      }
    };

    const onUp = () => {
      if (dragRef.current && !dragRef.current.moved) {
        const id = dragRef.current.id;
        if (SPECIAL_PEOPLE_IDS.has(id)) setModal(id);
      }
      dragRef.current = null;
      panRef.current.dragging = false;
      canvas.style.cursor = hoveredIdRef.current ? "pointer" : "default";
    };

    const onLeave = () => {
      hoveredIdRef.current = null;
      setHoveredId(null);
      dragRef.current = null;
      panRef.current.dragging = false;
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mouseup",   onUp);
    canvas.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mouseup",   onUp);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const modalPerson  = modal ? BIO_DATA[modal] : null;

  return (
    <div className="flex flex-col h-screen bg-[#09090b] overflow-hidden">
      <SiteNav active="listen" theme="dark" />

      {/* Canvas area */}
      <div className="relative flex-1 overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />


      </div>

      {/* Modal */}
      {modal && modalPerson && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 max-w-sm mx-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-5">
              <p className="text-white font-medium text-lg leading-snug">{modalPerson.name}</p>
              <p className="text-xs text-neutral-500 mt-1">{modalPerson.role}</p>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">{modalPerson.note}</p>
            <button
              onClick={() => setModal(null)}
              className="mt-7 text-xs text-neutral-700 hover:text-neutral-400 transition-colors"
            >
              close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
