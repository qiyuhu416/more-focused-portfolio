import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback, useMemo, type ReactNode } from "react";
import { CardIcon } from "./-CardIcon";
import { ARTICLE_META } from "./-articleMeta";
import { NAV_ITEMS, navHref } from "./-navItems";
import { SiteNav } from "./-SiteNav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Qiyu Hu — Human Interaction Designer" },
      {
        name: "description",
        content:
          "Qiyu Hu is a designer-engineer at Apple exploring the edges of human interaction — AI products, voice, gesture, and trust.",
      },
      { name: "author", content: "Qiyu Hu" },
      { property: "og:title", content: "Qiyu Hu — Human Interaction Designer" },
      {
        property: "og:description",
        content:
          "Qiyu Hu is a designer-engineer at Apple exploring the edges of human interaction — AI products, voice, gesture, and trust.",
      },
      { property: "og:type", content: "website" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Qiyu Hu",
          jobTitle: "Human Interaction Designer",
          worksFor: { "@type": "Organization", name: "Apple" },
          sameAs: ["https://www.linkedin.com/in/qiyu-hu/"],
        }),
      },
    ],
  }),
  component: Index,
});

// ── Types ─────────────────────────────────────────────────────────────────

type DearMode = "recruiter" | "dating" | "future-self";
type CardMedia =
  | { type: "video"; src: string; transform?: string; startTime?: number }
  | { type: "image"; src: string; thumbnailSize?: "xs" | "small" | "medium" }
  | { type: "concept"; icon?: string; label?: string; gradient?: string };

// ── Constants ─────────────────────────────────────────────────────────────

const NAV_HEIGHT  = 52;
const LEFT_W      = "38%";
const SCROLL_DIST = 500;

// Section background colors — alternating light and dark palettes
const SECTION_COLORS_LIGHT = { A: "#faf9f7", B: "#f5f0eb" };  // Cream, Warm sand
const SECTION_COLORS_DARK  = { A: "#2a2a2a", B: "#1f1f1f" };  // Dark grey, Darker grey

const SECTION_TABS_ORDER = ["expression", "others-think", "others-say", "i-interpret"] as const;

function getSectionColor(sectionId: string, isDarkMode: boolean): string {
  const colors = isDarkMode ? SECTION_COLORS_DARK : SECTION_COLORS_LIGHT;
  const index = SECTION_TABS_ORDER.indexOf(sectionId as any);
  return index % 2 === 0 ? colors.A : colors.B;
}

const SEGMENT_TO_SECTION: Record<string, string> = {
  "behave":           "expression",
  "others-interpret": "others-think",
  "others-say":       "others-say",
  "i-interpret":      "i-interpret",
};
const SECTION_TO_SEGMENT: Record<string, string> = Object.fromEntries(
  Object.entries(SEGMENT_TO_SECTION).map(([k, v]) => [v, k])
);
const SECTION_TABS = [
  { id: "expression",   label: "New ways to express" },
  { id: "others-think", label: "How others think"    },
  { id: "others-say",   label: "What others say"     },
  { id: "i-interpret",  label: "I interpret"         },
] as const;

const SECTION_QUESTIONS: Record<string, string> = {
  "expression":   "Is there a richer way to express yourself?",
  "others-think": "How might we understand what others are thinking?",
  "others-say":   "How to capture what others say elsewhere?",
  "i-interpret":  "Do I actually know how I think?",
};

// AI-specific overrides for sections with "others = AI" sub-groups
const SECTION_AI_QUESTIONS: Partial<Record<string, string>> = {
  "others-think": "How can AI better understand humans?",
  "others-say":   "How should AI act so humans feel seen?",
};

// Gallery images shown behind the diagram when each arc is hovered in the landing state
const SEGMENT_GALLERY: Record<string, Array<{ type: "video" | "image"; src: string }>> = {
  "behave": [
    { type: "video", src: "/articles/hand-gesture.mp4" },
    { type: "video", src: "/articles/voice.mp4" },
    { type: "video", src: "/articles/palo-alto.mp4" },
    { type: "image", src: "/articles/chatbot-thumb.png" },
    { type: "image", src: "/articles/product-launch-thumb.png" },
  ],
  "others-interpret": [
    { type: "image", src: "/articles/design-as-research-tool-thumb.png" },
    { type: "image", src: "/articles/meet-stranger-calendly.png" },
    { type: "image", src: "/articles/physical-ai-thumb.png" },
    { type: "image", src: "/articles/trust-thumb.png" },
    { type: "image", src: "/articles/personalization-thumb.svg" },
    { type: "image", src: "/articles/proactive-thumb.svg" },
  ],
  "others-say": [
    { type: "image", src: "/articles/hello-humans-notebook.jpg" },
    { type: "image", src: "/articles/google-cloud-thumb.png" },
    { type: "image", src: "/articles/a2ui-thumb.svg" },
    { type: "image", src: "/articles/prototype-triangle-thumb.svg" },
    { type: "image", src: "/articles/trust-thumb.png" },
  ],
  "i-interpret": [
    { type: "image", src: "/articles/claude-code-thumb.png" },
  ],
};

// Shared positions that orbit the diagram center — used for ALL hover targets.
// Items at same index share a position, so switching targets crossfades in-place.
const SCATTER_POS = [
  { w: 188, x:  7, y: 13, rot: -6 },  // top-left
  { w: 158, x: 61, y:  6, rot:  5 },  // top-right
  { w: 168, x: 70, y: 54, rot: -4 },  // right-bottom
  { w: 130, x:  5, y: 57, rot:  8 },  // left-bottom
  { w: 116, x: 79, y: 31, rot: -9 },  // right-middle
  { w: 148, x: 26, y: 74, rot:  3 },  // bottom-center
] as const;

type ScatterEntry = { src: string; type: "image" | "video"; w: number; x: number; y: number; rot: number };

// Circle-hover scatter
const CIRCLE_HOVER_SCATTER: Record<"me" | "others", ScatterEntry[]> = {
  me: [
    "/articles/claude-code-thumb.png",
    "/articles/hello-humans-notebook.jpg",
    "/articles/physical-ai-thumb.png",
    "/articles/prototype-triangle-thumb.svg",
    "/articles/personalization-thumb.svg",
  ].map((src, i) => ({ src, type: "image" as const, ...SCATTER_POS[i] })),
  others: [
    "/articles/design-as-research-tool-thumb.png",
    "/articles/meet-stranger-calendly.png",
    "/articles/google-cloud-thumb.png",
    "/articles/trust-thumb.png",
    "/articles/a2ui-thumb.svg",
  ].map((src, i) => ({ src, type: "image" as const, ...SCATTER_POS[i] })),
};

// Arc-hover scatter — built from SEGMENT_GALLERY, same positions
const SEGMENT_HOVER_SCATTER: Record<string, ScatterEntry[]> = Object.fromEntries(
  Object.entries(SEGMENT_GALLERY).map(([segId, items]) => [
    segId,
    items.slice(0, SCATTER_POS.length).map((item, i) => ({ ...SCATTER_POS[i], src: item.src, type: item.type })),
  ])
);

const SECTION_DESCRIPTIONS: Record<string, string> = {
  "expression":   "Text boxes flatten everything. A pause, a gesture, a shift in tone — these carry meaning the keyboard can't. I keep wondering what we're leaving out.",
  "others-think": "I build things based on what I think you need. I'm often wrong. That gap between my model of you and the actual you — that's where design gets interesting.",
  "others-say":   "The shape of a reply matters as much as the words. When AI talks back, how it says things shapes how heard you feel. When a stranger responds honestly — same thing.",
  "i-interpret":  "I walk into every conversation carrying invisible assumptions. Some accurate, most not. Making that visible is the whole project.",
};

// ── Easing ────────────────────────────────────────────────────────────────

function ease(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// ── Music player ──────────────────────────────────────────────────────────

function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const seekTo = 43;
  const audioRef = useRef<HTMLAudioElement>(null);
  const toggle = () => {
    const el = audioRef.current; if (!el) return;
    if (playing) el.pause();
    else { if (Math.abs(el.currentTime - seekTo) > 3) el.currentTime = seekTo; el.play().catch(() => {}); }
    setPlaying(!playing);
  };
  useEffect(() => {
    const el = audioRef.current; if (!el) return;
    const onEnd = () => setPlaying(false);
    el.addEventListener("ended", onEnd);
    return () => el.removeEventListener("ended", onEnd);
  }, []);
  return (
    <div className="mt-8 flex items-center gap-3 flex-wrap">
      <audio ref={audioRef} src="/https://www.youtube.com/watch?v=x6XYAd3D5VY" preload="none" />
      <button onClick={toggle} className="flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95">
        <span className="text-base leading-none">{playing ? "⏸" : "▶"}</span>
        <span>Baby Song · Eason Chan</span>
        <span className="font-mono text-[11px] text-white/40">0:{String(seekTo).padStart(2, "0")}</span>
      </button>
      {playing && <span className="text-xs text-white/40 italic">this one always gets me</span>}
    </div>
  );
}

// ── Dear footer ───────────────────────────────────────────────────────────

const DEAR_LABEL: Record<DearMode, string> = {
  recruiter:    "recruiter",
  "future-self":"future me",
  dating:       "friends/ strangers/ dating app matches",
};

function DearFooter() {
  const [mode, setMode]   = useState<DearMode>("recruiter");
  const [open, setOpen]   = useState(false);

  const letters: Record<DearMode, { body: ReactNode; cta?: ReactNode }> = {
    recruiter: {
      body: (<><p>I have an interdisciplinary background in UX design, programming, Human-Computer Interaction research, a bit of overthinking.</p><p>You could hire me as a design engineer, but I'd say the best way to use me is to hand me a messy, unsolved problem and ask what we should even be building.</p><p>I think a lot about innovation and work on interesting problems. If your team is figuring out what to build next and love to be a bit crazier, I'd love to talk.</p></>),
      cta: <a href="https://calendly.com/huqiyu416" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm text-neutral-900 hover:bg-neutral-100 transition-all">Book a time →</a>,
    },
    "future-self": {
      body: (<><p>How are you?</p><p>Please know that I am very proud of you, for staying curious about yourself, about this world, and about the connections between the two.</p><p>How are you now with overthinking?</p></>),
      cta: <MusicPlayer />,
    },
    dating: {
      body: (<><p>Yo.</p></>),
      cta: <a href="https://calendly.com/huqiyu416" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm text-neutral-900 hover:bg-neutral-100 transition-all">Book a time →</a>,
    },

  };
  const content = letters[mode];

  return (
    <div className="flex h-full items-center justify-center px-16">
      <div className="absolute top-6 inset-x-0 flex justify-center pointer-events-none">
        <svg width="16" height="20" viewBox="0 0 16 20" fill="none" style={{ opacity: 0.18 }}>
          <path d="M8 18V2M8 2L2 8M8 2l6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="w-full max-w-xl px-12">
        {/* Inline salutation with dropdown */}
        <p className="mb-5 text-sm text-white/35 flex items-center gap-0">
          Dear&nbsp;
          <span className="relative">
            <button
              onClick={() => setOpen(o => !o)}
              className="text-white/70 border-b border-white/25 hover:border-white/55 hover:text-white/95 transition-colors"
            >
              {DEAR_LABEL[mode]}
              <span className="ml-1 text-[10px] text-white/30">▾</span>
            </button>
            {open && (
              <div className="absolute left-0 top-full mt-2 bg-neutral-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-20 min-w-[140px]">
                {(Object.keys(letters) as DearMode[]).map(key => (
                  <button
                    key={key}
                    onClick={() => { setMode(key); setOpen(false); }}
                    className={["flex w-full text-left px-4 py-2.5 text-sm transition-colors whitespace-nowrap",
                      key === mode ? "text-white" : "text-white/45 hover:text-white hover:bg-white/5"
                    ].join(" ")}
                  >
                    {DEAR_LABEL[key]}
                  </button>
                ))}
              </div>
            )}
          </span>
          ,
        </p>

        <div className="space-y-4 text-[17px] leading-relaxed text-white/80 [&>p]:m-0">{content.body}</div>
        {content.cta}
        <p className="mt-8 text-sm text-white/30">— Qiyu</p>
      </div>
    </div>
  );
}

// Star dots representing people — shown when hovering "others" circle
const OTHERS_STARS = [
  { x: 9,  y: 9,  r: 3 },   { x: 22, y: 4,  r: 2.5 }, { x: 38, y: 14, r: 4 },
  { x: 14, y: 28, r: 2 },   { x: 58, y: 7,  r: 3 },   { x: 72, y: 16, r: 2.5 },
  { x: 48, y: 30, r: 3.5 }, { x: 5,  y: 48, r: 2 },   { x: 30, y: 52, r: 3 },
  { x: 80, y: 38, r: 4 },   { x: 65, y: 52, r: 2.5 }, { x: 18, y: 65, r: 3 },
  { x: 85, y: 60, r: 2 },   { x: 44, y: 68, r: 3.5 }, { x: 10, y: 78, r: 2.5 },
  { x: 62, y: 74, r: 3 },   { x: 78, y: 80, r: 2 },   { x: 28, y: 82, r: 4 },
  { x: 50, y: 86, r: 2.5 }, { x: 90, y: 82, r: 3 },   { x: 35, y: 38, r: 2 },
  { x: 92, y: 24, r: 2.5 }, { x: 74, y: 90, r: 3 },
];

// ── Two circles diagram — between-circles arrows, tight dashed arcs ────────
// Left circle: cx=185 cy=115 r=48 (left edge x=137)
// Right circle: cx=525 cy=115 r=48 (right edge x=573)
// Arrows go BETWEEN circles: (211,72)↔(499,72) and (211,158)↔(499,158)
// Left arc: M 211 158 C 97 158 97 72 211 72  → peak x≈125 (12px outside circle ✓)
// Right arc: M 499 72 C 613 72 613 158 499 158 → peak x≈585 (12px outside circle ✓)
function TwoCirclesDiagram({ activeSegment, onSegmentClick, onSegmentHover, onCircleClick, onCircleHover, othersIsAI: _othersIsAI }: {
  activeSegment?: string | null;
  onSegmentClick?: (id: string) => void;
  onSegmentHover?: (id: string | null) => void;
  onCircleClick?: (circle: "me" | "others") => void;
  onCircleHover?: (circle: "me" | "others" | null) => void;
  othersIsAI?: boolean;
}) {
  const [hovered, setHovered]             = useState<string | null>(null);
  const [hoveredCircle, setHoveredCircle] = useState<"me" | "others" | null>(null);

  const col = (id: string) => {
    if (activeSegment === id) return "#1a1a1a";
    if (activeSegment)        return "#d0d0d0";
    if (hovered === id)       return "#333";
    if (hovered)              return "#d0d0d0";
    return "#999";
  };
  const anyFocus     = !!(activeSegment || hovered || hoveredCircle);
  const circleStroke = anyFocus ? "#c0c0c0" : "#8a8a8a";
  const meColor      = hoveredCircle === "me"     ? "#1a1a1a" : (anyFocus ? "#bbb" : "#555");
  const othersColor  = hoveredCircle === "others" ? "#1a1a1a" : (anyFocus ? "#bbb" : "#555");

  const seg = (id: string, children: ReactNode) => (
    <g key={id}
      onMouseEnter={() => { setHovered(id);   onSegmentHover?.(id); }}
      onMouseLeave={() => { setHovered(null); onSegmentHover?.(null); }}
      onClick={() => onSegmentClick?.(id)}
      style={{ cursor: onSegmentClick ? "pointer" : "default" }}
    >{children}</g>
  );

  const on = (id: string) => hovered === id || activeSegment === id;
  const sp = (id: string, dashed?: boolean) => ({
    stroke: col(id), strokeWidth: on(id) ? 1.9 : 1.35,
    strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
    fill: "none" as const,
    strokeDasharray: dashed ? "6 4" : undefined,
    style: { transition: "stroke 150ms, stroke-width 150ms" } as React.CSSProperties,
  });

  const Arr = ({ x, y, dir, id }: { x: number; y: number; dir: "l" | "r"; id: string }) => {
    const d = dir === "r"
      ? `M ${x-10} ${y-6} L ${x} ${y} L ${x-10} ${y+6}`
      : `M ${x+10} ${y-6} L ${x} ${y} L ${x+10} ${y+6}`;
    return <path d={d} fill="none" stroke={col(id)} strokeWidth={on(id)?1.9:1.35} strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 150ms" }} />;
  };

  const hw: React.CSSProperties = { fontFamily: "'Kalam', cursive" };

  return (
    <svg viewBox="0 0 710 230" fill="none" className="w-full" overflow="visible">
      {/* Inner circles */}
      <circle cx={185} cy={115} r={48}
        stroke={hoveredCircle === "me" ? "#333" : circleStroke}
        strokeWidth={hoveredCircle === "me" ? 1.9 : 1.35}
        fill="none" style={{ transition: "stroke 150ms, stroke-width 150ms", pointerEvents: "none" }} />
      <circle cx={525} cy={115} r={48}
        stroke={hoveredCircle === "others" ? "#333" : circleStroke}
        strokeWidth={hoveredCircle === "others" ? 1.9 : 1.35}
        fill="none" style={{ transition: "stroke 150ms, stroke-width 150ms", pointerEvents: "none" }} />
      <text x="185" y="120" textAnchor="middle" fontSize="14" fill={meColor}
        style={{ ...hw, transition: "fill 150ms", pointerEvents: "none" }}>me</text>
      <text x="525" y="120" textAnchor="middle" fontSize="14" fill={othersColor}
        style={{ ...hw, transition: "fill 150ms", pointerEvents: "none" }}>others</text>

      {/* Transparent circle hit targets */}
      <circle cx={185} cy={115} r={47} fill="transparent"
        data-cursor-label="Who is Qiyu →" style={{ cursor: onCircleClick ? "pointer" : "default" }}
        onMouseEnter={() => { setHoveredCircle("me");     onCircleHover?.("me"); }}
        onMouseLeave={() => { setHoveredCircle(null);     onCircleHover?.(null); }}
        onClick={() => onCircleClick?.("me")} />
      <circle cx={525} cy={115} r={47} fill="transparent"
        data-cursor-label="People who shaped Qiyu →" style={{ cursor: onCircleClick ? "pointer" : "default" }}
        onMouseEnter={() => { setHoveredCircle("others"); onCircleHover?.("others"); }}
        onMouseLeave={() => { setHoveredCircle(null);     onCircleHover?.(null); }}
        onClick={() => onCircleClick?.("others")} />

      {/* Top arrow — behave: y=53 is 14px ABOVE circle tops (y=67). Zero intersection. */}
      {seg("behave", <>
        <line x1="155" y1="53" x2="555" y2="53" {...sp("behave")} />
        <Arr x={555} y={53} dir="r" id="behave" />
        <line x1="155" y1="53" x2="555" y2="53" stroke="transparent" strokeWidth={24} />
      </>)}

      {/* Right arc — others-interpret (dashed): Q curve, same gentle radius as the circles */}
      {seg("others-interpret", <>
        <path d="M 555 53 Q 660 115 555 177" {...sp("others-interpret", true)} />
        <Arr x={555} y={177} dir="l" id="others-interpret" />
        <path d="M 555 53 Q 660 115 555 177" stroke="transparent" strokeWidth={24} fill="none" />
      </>)}

      {/* Bottom arrow — others-say: y=177 is 14px BELOW circle bottoms (y=163). Zero intersection. */}
      {seg("others-say", <>
        <line x1="555" y1="177" x2="155" y2="177" {...sp("others-say")} />
        <Arr x={155} y={177} dir="l" id="others-say" />
        <line x1="555" y1="177" x2="155" y2="177" stroke="transparent" strokeWidth={24} />
      </>)}

      {/* Left arc — i-interpret (dashed): Q curve, same gentle radius as the circles */}
      {seg("i-interpret", <>
        <path d="M 155 177 Q 50 115 155 53" {...sp("i-interpret", true)} />
        <Arr x={155} y={53} dir="r" id="i-interpret" />
        <path d="M 155 177 Q 50 115 155 53" stroke="transparent" strokeWidth={24} fill="none" />
      </>)}
    </svg>
  );
}

// ── Article modal ──────────────────────────────────────────────────────────

interface CardModalData { href: string; title: string; meta: string; media: CardMedia; }

// Centered iframe modal — SiteNav hides itself when ?embed=1 is in the URL.
// No extra buttons: just the real article content + a close (×) button.
function ArticleModal({ card, onClose }: { card: CardModalData; onClose: () => void }) {
  const [full, setFull] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  // Expand to fullscreen when iframe content is scrolled; collapse back at top
  const handleIframeLoad = () => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    const onScroll = () => setFull(win.scrollY > 30);
    win.addEventListener("scroll", onScroll, { passive: true });
  };

  const embedUrl = `${card.href}${card.href.includes("?") ? "&" : "?"}embed=1`;
  const E = "0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

  return (
    <>
      {!full && <div className="fixed inset-0 z-[59] bg-black/50 backdrop-blur-sm" onClick={onClose} />}
      <div style={{
        position: "fixed", zIndex: 60,
        top:    full ? 0 : "clamp(24px, 5vh, 48px)",
        right:  full ? 0 : "clamp(16px, 8vw, 120px)",
        bottom: full ? 0 : "clamp(24px, 5vh, 48px)",
        left:   full ? 0 : "clamp(16px, 8vw, 120px)",
        borderRadius: full ? 0 : 16,
        background: "white", overflow: "hidden",
        boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
        display: "flex", flexDirection: "column",
        transition: `top ${E}, right ${E}, bottom ${E}, left ${E}, border-radius ${E}`,
        animation: full ? "none" : "modalIn 0.22s cubic-bezier(0.25,0.46,0.45,0.94)",
      }}>
        <button onClick={onClose} aria-label="Close"
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm text-neutral-500 hover:text-neutral-900 hover:bg-white transition-colors text-lg leading-none">
          ×
        </button>
        <iframe ref={iframeRef} src={embedUrl} onLoad={handleIframeLoad}
          className="flex-1 w-full border-0" title={card.title} />
      </div>
      <style dangerouslySetInnerHTML={{ __html: "@keyframes modalIn{from{opacity:0;transform:scale(0.97) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}" }} />
    </>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────

function Card({ title, meta, href, media, badge, isExternal, slug, onHoverChange, onMouseMove, onCardClick }: {
  title: string; meta: string; href?: string; media: CardMedia;
  badge?: string; isExternal?: boolean; slug?: string;
  onHoverChange?: (slug: string | null) => void;
  onMouseMove?: (e: React.MouseEvent) => void;
  onCardClick?: (card: CardModalData) => void;
}) {
  const isVideo = media.type === "video";
  const cls = "group relative transition-all hover:-translate-y-1 block";
  const domain = isExternal && href ? (() => { try { return new URL(href).hostname.replace(/^www\./, ""); } catch { return ""; } })() : "";
  const handlers = {
    onMouseEnter(e: React.MouseEvent<HTMLElement>) {
      const v = e.currentTarget.querySelector("video");
      if (v && media.type === "video") { v.currentTime = media.startTime ?? 0; v.play(); }
      onHoverChange?.(slug ?? null);
    },
    onMouseLeave(e: React.MouseEvent<HTMLElement>) {
      const v = e.currentTarget.querySelector("video"); if (v) { v.pause(); v.currentTime = 0; }
      onHoverChange?.(null);
    },
    onMouseMove,
  };
  const inner = (
    <>
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-neutral-100 shadow-[0_2px_14px_rgba(0,0,0,0.07)] transition-shadow group-hover:shadow-[0_8px_28px_rgba(0,0,0,0.11)]">
        {badge && <span className="absolute top-3 right-3 z-10 rounded-full bg-black/60 px-2.5 py-1 text-[10px] uppercase tracking-wide text-white backdrop-blur-sm">{badge}</span>}
        {domain && <span className="absolute bottom-3 left-3 z-10 flex items-center gap-1 rounded-full bg-neutral-900 px-3 py-1.5 text-[11px] font-medium text-white">↗ {domain}</span>}
        {media.type === "video" && <video src={`${media.src}#t=0.001`} preload="metadata" muted loop playsInline className="h-full w-full object-cover" style={media.transform ? { transform: media.transform } : undefined} />}
        {media.type === "image" && <img src={media.src} alt={title} className={
          media.thumbnailSize === "small" ? "w-20 h-20 object-contain" :
          "h-full w-full object-contain"
        } />}
        {media.type === "concept" && (
          <div className="h-full w-full flex flex-col items-center justify-center gap-3 px-8 py-6" style={{ background: media.gradient ?? "linear-gradient(135deg,#efefed 0%,#e4e4e2 100%)" }}>
            {media.icon && <span style={{ fontSize: 80 }}>{media.icon}</span>}
            {media.label && <p className="text-xs text-neutral-400 text-center leading-relaxed">{media.label}</p>}
          </div>
        )}
        <CardIcon hasVideo={isVideo} />
      </div>
      <div className="pt-3 px-0.5">
        <h3 className="text-[13px] font-medium text-neutral-600 leading-snug tracking-tight">{title}</h3>
      </div>
    </>
  );
  if (!href) return <div className={cls} {...handlers}>{inner}</div>;
  if (onCardClick && !isExternal) {
    return (
      <button onClick={() => onCardClick({ href, title, meta, media })} className={cls + " text-left w-full"} data-cursor="card" {...handlers}>
        {inner}
      </button>
    );
  }
  return <a href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined} className={cls} data-cursor="card" {...handlers}>{inner}</a>;
}

// ── Sub-group divider ─────────────────────────────────────────────────────

function TopNav({ visible }: { visible: boolean }) {
  void NAV_ITEMS; void navHref;
  return (
    <SiteNav
      active="work"
      headerProps={{
        style: {
          transform: visible ? "translateY(0)" : `translateY(-${NAV_HEIGHT}px)`,
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        },
      }}
    />
  );
}

function GroupLabel({ label }: { label: string }) {
  return (
    <div className="col-span-3 flex items-center gap-3 mt-4 mb-1">
      <span style={{ fontSize: 10, color: "#b8b8b8", letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.06)" }} />
    </div>
  );
}

// ── Collaborator cursor (Figma-style high five) ───────────────────────────

const HAND_EMOJI = "🤙";

function CollaboratorCursor({
  triggerCount,
  mousePosRef,
}: {
  triggerCount: number;
  mousePosRef: { current: { x: number; y: number } };
}) {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const emojiRef  = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (triggerCount === 0) return;

    const wrap   = wrapRef.current;
    const cursor = cursorRef.current;
    const emoji  = emojiRef.current;
    if (!wrap || !cursor || !emoji) return;

    let x = -90;
    let y = mousePosRef.current.y || window.innerHeight * 0.42;
    let rafId = 0;
    let done = false;

    wrap.style.transition = "none";
    wrap.style.opacity = "1";
    wrap.style.transform = `translate(${x}px, ${y}px)`;
    cursor.style.display = "block";
    emoji.style.display = "none";
    emoji.textContent = HAND_EMOJI;

    const startHandAnim = () => {
      cursor.style.display = "none";
      emoji.style.display = "inline";
      // Restart CSS animation by removing then re-adding it
      emoji.style.animation = "none";
      void emoji.offsetWidth;
      emoji.style.animation = "hand-collapse 1s ease forwards";
      const onEnd = () => {
        if (done) return;
        wrap.style.transition = "opacity 0.35s ease";
        wrap.style.opacity = "0";
      };
      emoji.addEventListener("animationend", onEnd, { once: true });
    };

    const tick = () => {
      if (done) return;
      const { x: tx, y: ty } = mousePosRef.current;
      const dx = tx - x;
      const dy = ty - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 32) { cancelAnimationFrame(rafId); startHandAnim(); return; }
      x += dx * 0.032;
      y += dy * 0.032;
      wrap.style.transform = `translate(${x}px, ${y}px)`;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      done = true;
      cancelAnimationFrame(rafId);
      emoji.style.animation = "none";
    };
  }, [triggerCount]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes hand-collapse {
          0%   { transform: scale(0.2) rotate(-30deg) translateY(10px); opacity: 0; }
          25%  { transform: scale(1.35) rotate(12deg) translateY(-6px); opacity: 1; }
          50%  { transform: scale(0.9) rotate(-6deg)  translateY(2px);  opacity: 1; }
          68%  { transform: scale(1.05) rotate(4deg)  translateY(-2px); opacity: 1; }
          80%  { transform: scale(0.97) rotate(-1deg) translateY(0px);  opacity: 1; }
          88%  { transform: scale(1)    rotate(0deg)  translateY(0px);  opacity: 1; }
          100% { transform: scale(0.15) rotate(-25deg) translateY(8px); opacity: 0; }
        }
      `}} />
      <div ref={wrapRef} style={{ position: "fixed", top: 0, left: 0, zIndex: 99994, pointerEvents: "none", opacity: 0 }}>
        <div ref={cursorRef} style={{ position: "relative" }}>
          <svg width="16" height="26" viewBox="0 0 16 26" fill="none">
            <path
              d="M1 1 L1 21 L6 15 L9 25 L12 23 L9 14 L15 14 Z"
              fill="#6366f1" stroke="white" strokeWidth="1.5"
              strokeLinejoin="round" strokeLinecap="round"
            />
          </svg>
          <div style={{
            position: "absolute", top: 22, left: 12,
            background: "#6366f1", color: "white",
            fontSize: 11, fontWeight: 600, letterSpacing: "0.01em",
            padding: "2px 8px 3px", borderRadius: 10, lineHeight: 1.55,
            whiteSpace: "nowrap", fontFamily: "Inter, sans-serif",
            boxShadow: "0 1px 4px rgba(0,0,0,0.22)",
          }}>Qiyu</div>
        </div>
        <span ref={emojiRef} style={{ fontSize: 40, lineHeight: 1, display: "none", transformOrigin: "center" }} />
      </div>
    </>
  );
}

// ── Index ─────────────────────────────────────────────────────────────────

function Index() {
  const navigate           = useNavigate();
  const bgRef              = useRef<HTMLDivElement>(null);
  const bgTopRef           = useRef<HTMLDivElement>(null);
  const contentWrapperRef  = useRef<HTMLDivElement>(null);
  const diagramInnerRef    = useRef<HTMLDivElement>(null);
  const heroTextRef        = useRef<HTMLDivElement>(null);
  const heroHintRef        = useRef<HTMLDivElement>(null);
  const footerSpacerRef     = useRef<HTMLDivElement>(null);
  const settledRef          = useRef(false);
  const atFooterRef         = useRef(false);
  const activeSectionRef    = useRef<string | null>(null);
  const othersTypeRef       = useRef<"human" | "AI" | null>(null);
  const mousePosRef         = useRef({ x: 0, y: 0 });
  const rightPanelRef       = useRef<HTMLDivElement>(null);

  const lastScrollY    = useRef(0);
  const savedScrollY   = useRef(0);

  const [settled, setSettled]                 = useState(false);
  const [activeSection, setActiveSection]     = useState<string | null>(null);
  const [othersType, setOthersType]           = useState<"human" | "AI" | null>(null);
  const [atFooter, setAtFooter]               = useState(false);
  const [navVisible, setNavVisible]           = useState(true);
  const [cursorPos, setCursorPos]             = useState({ x: 0, y: 0 });
  const [hoveredSlug, setHoveredSlug]         = useState<string | null>(null);
  const [openedCard, setOpenedCard]           = useState<CardModalData | null>(null);
  const [hoveredDiagramSegment, setHoveredDiagramSegment] = useState<string | null>(null);
  const [hoveredCircleGlobal, setHoveredCircleGlobal]   = useState<"me" | "others" | null>(null);
  const [collaboratorTrigger, setCollaboratorTrigger] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const hoveredSections = hoveredSlug ? (ARTICLE_META[hoveredSlug]?.sections ?? []) : [];
  const hoverKind = hoveredSlug && ARTICLE_META[hoveredSlug]?.sections ? "Article" : null;
  const handleCardClick = useCallback((card: CardModalData) => {
    savedScrollY.current = window.scrollY;
    setOpenedCard(card);
  }, []);

  const handleModalClose = useCallback(() => {
    setOpenedCard(null);
    requestAnimationFrame(() => window.scrollTo({ top: savedScrollY.current }));
  }, []);

  const ch = {
    onHoverChange: setHoveredSlug,
    onMouseMove: (e: React.MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY }),
    onCardClick: handleCardClick,
  };




  // Scroll animation loop — imperative DOM writes, no React re-renders
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const raw = Math.min(1, Math.max(0, window.scrollY / SCROLL_DIST));
      const p   = ease(raw);
      const vw  = window.innerWidth;
      if (diagramInnerRef.current) {
        const w = Math.min(820, vw * 0.84) * (1 - p) + (vw * 0.38 - 60) * p;
        diagramInnerRef.current.style.maxWidth  = `${w}px`;
        diagramInnerRef.current.style.transform = `translateX(calc(${-31 * p}vw))`;
      }
      const panelOpacity = atFooterRef.current ? 0 : p;
      if (bgRef.current)    bgRef.current.style.opacity    = String(panelOpacity);
      if (bgTopRef.current) bgTopRef.current.style.opacity = String(panelOpacity);

      // Use active section's background color, fallback to expression for landing
      const bgColor = activeSectionRef.current
        ? getSectionColor(activeSectionRef.current, isDarkMode)
        : getSectionColor("expression", isDarkMode);
      if (bgRef.current)        bgRef.current.style.background        = bgColor;
      if (bgTopRef.current)     bgTopRef.current.style.background     = bgColor;
      if (rightPanelRef.current) rightPanelRef.current.style.background = bgColor;
      const ho = Math.max(0, 1 - p / 0.4);
      if (heroTextRef.current) {
        heroTextRef.current.style.opacity      = String(ho);
        heroTextRef.current.style.maxHeight    = p >= 1 ? "0"     : "280px";
        heroTextRef.current.style.overflow     = "hidden";
        heroTextRef.current.style.marginBottom = p >= 1 ? "0"     : "2.5rem";
      }
      if (heroHintRef.current) heroHintRef.current.style.opacity = String(ho);
      // Shift content wrapper from vertically-centered → top-aligned as we settle
      // justifyContent must stay "center" — translateX handles horizontal positioning
      if (contentWrapperRef.current) {
        contentWrapperRef.current.style.alignItems   = p > 0.5 ? "flex-start" : "center";
        contentWrapperRef.current.style.paddingTop   = p > 0.5 ? `${Math.min(88, (p - 0.5) / 0.5 * 88)}px` : "0";
        contentWrapperRef.current.style.paddingLeft  = p >= 1 ? "3rem" : "0";
        contentWrapperRef.current.style.paddingRight = p >= 1 ? "3rem" : "0";
      }
      const now = raw >= 1;
      if (now !== settledRef.current) { settledRef.current = now; setSettled(now); }

      // ── Direct position tracking (replaces IntersectionObserver) ──────────
      // Reads getBoundingClientRect() every tick → always matches what's in view,
      // regardless of scroll direction or section height.
      const line = NAV_HEIGHT + 10; // detection line: just below the nav

      // Active section: whose top has just crossed the line (closest from below)
      let newActive: string | null = null;
      let bestTop = -Infinity;
      SECTION_TABS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top;
        if (top <= line && top > bestTop) { bestTop = top; newActive = id; }
      });
      if (newActive !== activeSectionRef.current) {
        activeSectionRef.current = newActive;
        setActiveSection(newActive);
      }

      // AI/human sub-group: check whether the AI sentinel has crossed the line
      let newOthersType: "human" | "AI" | null = null;
      if (newActive === "others-think" || newActive === "others-say") {
        const aiEl = document.getElementById(`sentinel-${newActive}-ai`);
        newOthersType = (aiEl && aiEl.getBoundingClientRect().top <= line) ? "AI" : "human";
      }
      if (newOthersType !== othersTypeRef.current) {
        othersTypeRef.current = newOthersType;
        setOthersType(newOthersType);
      }
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); };
    window.addEventListener("scroll", onScroll, { passive: true });
    tick();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [isDarkMode]);

  // Clear diagram segment hover when settled
  useEffect(() => {
    if (settled) setHoveredDiagramSegment(null);
    return () => document.body.removeAttribute("data-cursor");
  }, [settled]);

  // Track live mouse position for the collaborator cursor animation
  useEffect(() => {
    const onMove = (e: MouseEvent) => { mousePosRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Nav hide-on-scroll-down, show-on-scroll-up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastScrollY.current;
      if (y <= 10) setNavVisible(true);
      else if (dy > 6) setNavVisible(false);
      else if (dy < -6) setNavVisible(true);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  useEffect(() => {
    const el = footerSpacerRef.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        atFooterRef.current = entry.isIntersecting;
        setAtFooter(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id); if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - 52, behavior: "smooth" });
    setActiveSection(id);
  }, []);

  const handleSegmentClick = useCallback((segId: string) => {
    const s = SEGMENT_TO_SECTION[segId]; if (!s) return;
    scrollToSection(s);
  }, [scrollToSection]);

  const handleCircleClick = useCallback((circle: "me" | "others") => {
    navigate({ to: circle === "me" ? "/think" : "/listen" });
  }, [navigate]);

  const handleCircleHover = useCallback((circle: "me" | "others" | null) => {
    setHoveredCircleGlobal(circle);
    if (circle) {
      document.body.setAttribute("data-cursor", "circle");
      if (circle === "me") setCollaboratorTrigger(t => t + 1);
    } else {
      if (!settledRef.current) document.body.setAttribute("data-cursor", "robot");
      else document.body.removeAttribute("data-cursor");
    }
  }, []);

  const activeSegment = atFooter ? "behave" : (activeSection ? SECTION_TO_SEGMENT[activeSection] : null);

  return (
    <div className="relative">

      {/* Cursor TOC tooltip */}
      {hoveredSlug && hoveredSections.length > 0 && (
        <div className="fixed z-[70] pointer-events-none" style={{ left: cursorPos.x + 16, top: cursorPos.y + 16 }}>
          <div className="bg-neutral-900 text-white rounded-2xl px-5 py-4 shadow-xl max-w-[220px]">
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 font-semibold mb-3">{hoverKind}</p>
            <ul className="space-y-2">{hoveredSections.map((s, i) => <li key={i} className="text-[12px] font-semibold leading-snug">{s}</li>)}</ul>
          </div>
        </div>
      )}

      {/* "others" star dots — people as stars across the page */}
      {OTHERS_STARS.map((star, i) => (
        <div key={`star-${i}`} style={{
          position: "fixed", zIndex: 45, pointerEvents: "none",
          left: `${star.x}%`, top: `${star.y}%`,
          width: star.r * 2, height: star.r * 2,
          borderRadius: "50%", background: "#606060",
          transform: "translate(-50%, -50%)",
          opacity: hoveredCircleGlobal === "others" && !settled ? 1 : 0,
          transition: `opacity 0.5s ease ${i * 0.03}s`,
        }} />
      ))}

      {/* Scatter gallery — "me" images + arc segments, landing state only */}
      {[...Object.entries(CIRCLE_HOVER_SCATTER).filter(([k]) => k === "me"), ...Object.entries(SEGMENT_HOVER_SCATTER)].map(([key, items]) => {
        const isActive = !settled && (hoveredCircleGlobal === key || hoveredDiagramSegment === key);
        return items.map((item, i) => (
          <div key={`scatter-${key}-${i}`} style={{
            position: "fixed", pointerEvents: "none", zIndex: 45,
            left: `${item.x}%`, top: `${item.y}%`, width: item.w,
            borderRadius: 14, overflow: "hidden",
            boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
            opacity: isActive ? 1 : 0,
            transform: `rotate(${item.rot}deg)`,
            transition: `opacity 0.4s ease ${i * 0.06}s`,
          }}>
            {item.type === "video"
              ? <video src={`${item.src}#t=0.001`} muted loop autoPlay playsInline style={{ width: "100%", display: "block" }} />
              : <img src={item.src} alt="" style={{ width: "100%", display: "block" }} />
            }
          </div>
        ));
      })}

      {/* Dear footer */}
      <div className="fixed inset-0 z-0 bg-neutral-950"><DearFooter /></div>

      {/* Left panel top fill — covers the 0→NAV_HEIGHT gap above the fixed overlay */}
      <div ref={bgTopRef} style={{ position: "fixed", top: 0, left: 0, height: NAV_HEIGHT, width: LEFT_W, background: "#fafafa", zIndex: 29, opacity: 0, pointerEvents: "none" }} />

      {/* Dark/light mode toggle button */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        style={{
          position: "fixed",
          top: 12,
          left: "calc(19% - 20px)",
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "none",
          background: isDarkMode ? "#3a3a3a" : "#e8e8e8",
          cursor: "pointer",
          zIndex: 31,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          transition: "background 0.3s ease",
        }}
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      {/* Single diagram overlay — scroll loop animates this */}
      <div style={{ position: "fixed", top: NAV_HEIGHT, left: 0, right: 0, bottom: 0, zIndex: 30, pointerEvents: "none", overflow: "hidden", opacity: atFooter ? 0 : 1, transition: "opacity 0.5s ease" }}>


        <div ref={bgRef} style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: LEFT_W, background: "#fafafa", opacity: 0 }} />
        {/* pointerEvents: none so right panel receives clicks normally.
            Only diagramInnerRef (which sits in the left panel in split mode)
            has pointerEvents: auto — it's the only interactive element here. */}
        <div ref={contentWrapperRef} style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", overflow: "hidden" }}>
          <div ref={diagramInnerRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: settled ? "flex-start" : "center", width: "100%", height: "100%", maxWidth: 820, pointerEvents: "auto", overflow: "hidden", clipPath: "inset(0 -20px)" }}>

            {/* Hero header — subtitle IS the headline now, crossfades with section question on arc hover */}
            <div ref={heroTextRef} style={{ textAlign: "center", marginBottom: "2rem", width: "100%" }}>
              <div style={{ position: "relative", minHeight: "7rem" }}>
                <h2 style={{
                  fontSize: 17, fontWeight: 400, color: "#555",
                  lineHeight: 1.08, letterSpacing: "-0.03em",
                  position: "absolute", inset: 0,
                  opacity: hoveredDiagramSegment ? 0 : 1,
                  transition: "opacity 0.35s ease",
                }}>
                  Qiyu is exploring technology that brings people closer.
                </h2>
                <h2 style={{
                  fontSize: 17, fontWeight: 400, color: "#555",
                  lineHeight: 1.08, letterSpacing: "-0.03em",
                  opacity: hoveredDiagramSegment ? 1 : 0,
                  transition: "opacity 0.35s ease",
                }}>
                  {hoveredDiagramSegment ? SECTION_QUESTIONS[SEGMENT_TO_SECTION[hoveredDiagramSegment]] : ""}
                </h2>
              </div>
            </div>

            {/* Question titles — all 4 stacked, crossfade via CSS. No re-mounts, no layout shift. */}
            {settled && (
              <div style={{ position: "relative", minHeight: "5.5rem", width: "100%", marginBottom: "1.5rem" }}>
                {SECTION_TABS.map(({ id }) => (
                  <div key={id} style={{
                    position: "absolute", top: 0, left: 0, right: 0,
                    opacity: activeSection === id ? 1 : 0,
                    transition: "opacity 0.28s ease",
                    pointerEvents: activeSection === id ? "auto" : "none",
                  }}>
                    <h2 style={{ fontSize: 36, fontWeight: 600, color: "#171717", lineHeight: 1.15, letterSpacing: "-0.025em" }}>
                      {(id === activeSection && othersType === "AI" && SECTION_AI_QUESTIONS[id]) || SECTION_QUESTIONS[id]}
                    </h2>
                  </div>
                ))}
              </div>
            )}

            {/* Larger gap between title and diagram */}
            {settled && <div style={{ flex: 1.4 }} />}

            {/* THE single diagram + emoji badge as real DOM element */}
            <div style={{ position: "relative", width: "100%" }}>
              <TwoCirclesDiagram
                activeSegment={settled ? activeSegment : null}
                onSegmentClick={handleSegmentClick}
                onSegmentHover={!settled ? setHoveredDiagramSegment : undefined}
                onCircleClick={handleCircleClick}
                onCircleHover={handleCircleHover}
                othersIsAI={othersType === "AI"}
              />
              {othersType === "AI" && (
                <span style={{
                  position: "absolute", top: "30%", left: "89%",
                  fontSize: 22, lineHeight: 1,
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none", transition: "opacity 0.25s",
                }}>🤖</span>
              )}
            </div>

            {/* Descriptions — all 4 stacked, crossfade via CSS. */}
            {settled && (
              <div style={{ position: "relative", minHeight: "3.5rem", width: "100%", marginTop: "1rem" }}>
                {SECTION_TABS.map(({ id }) => (
                  <div key={id} style={{
                    position: "absolute", top: 0, left: 0, right: 0,
                    opacity: activeSection === id ? 1 : 0,
                    transition: "opacity 0.28s ease 0.06s",
                    pointerEvents: activeSection === id ? "auto" : "none",
                  }}>
                    <p style={{ fontSize: 13, color: "#737373", lineHeight: 1.65 }}>
                      {SECTION_DESCRIPTIONS[id]}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Hero hint — lower, bigger, more prominent */}
            <div ref={heroHintRef} style={{ marginTop: "4rem", textAlign: "center" }}>
              <svg width="20" height="26" viewBox="0 0 20 26" fill="none" style={{ opacity: 0.55, margin: "0 auto", display: "block" }}>
                <path d="M10 1v24M10 25L2 17M10 25l8-8" stroke="#a3a3a3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Bottom spacer */}
            {settled && <div style={{ flex: 0.5 }} />}
          </div>
        </div>
      </div>

      {/* Main white content */}
      <div className="relative z-10 bg-background" style={{ boxShadow: "0 0 80px 20px rgba(0,0,0,0.18)" }}>
        <TopNav visible={navVisible} />
        <div style={{ height: `calc(100vh - ${NAV_HEIGHT}px)`, background: "#fafafa" }} />

        <div className="flex">
          <div style={{ width: LEFT_W, flexShrink: 0 }} />

          {/* Right panel — background syncs with active section */}
          <div ref={rightPanelRef} className="flex-1 min-w-0" style={{ background: getSectionColor("expression", isDarkMode), opacity: settled ? 1 : 0, pointerEvents: settled ? "auto" : "none", transition: "opacity 0.4s ease" }}>

            {/* ── 01 New ways to express ── */}
            <section id="expression" className="px-8 pt-10 pb-14 scroll-mt-24" style={{ background: getSectionColor("expression", isDarkMode), color: isDarkMode ? "#f5f5f5" : "inherit" }}>
              <div className="grid grid-cols-3 gap-4">
                <Card title="Hand gesture interactions" meta="Vibe-coding · Embodied" href="/play" {...ch} media={{ type: "video", src: "/articles/hand-gesture.mp4" }} />
                <Card title="Voice interaction" meta="Vibe-coding · Voice" href="/play" {...ch} media={{ type: "video", src: "/articles/voice.mp4" }} />
                <Card title="Palo Alto moment" meta="Vibe-coding · Place & context" href="/play" {...ch} media={{ type: "video", src: "/articles/palo-alto.mp4" }} />
                <Card title="Reimagining the chatbot" meta="Prototype · Collection" href="/reimagining-the-chatbot" slug="reimagining-the-chatbot" {...ch} media={{ type: "image", src: "/articles/chatbot-thumb.png" }} />
                <Card title="Product launch from 0–1" meta="Case study · 0→1" href="/product-launch-from-0-1" slug="product-launch-from-0-1" {...ch} media={{ type: "image", src: "/articles/product-launch-thumb.png" }} />
              </div>
            </section>

            {/* ── 02 How others think ── */}
            <section id="others-think" className="px-8 pt-10 pb-14 scroll-mt-24" style={{ background: getSectionColor("others-think", isDarkMode), color: isDarkMode ? "#f5f5f5" : "inherit" }}>
              <div className="grid grid-cols-3 gap-4">
                <div id="sentinel-others-think-human" className="col-span-3" style={{ height: 0 }} />
                <GroupLabel label="Others = human" />
                <Card title="Research through design" meta="Case study · Service design" href="/design-as-a-research-tool" slug="design-as-a-research-tool" {...ch} media={{ type: "image", src: "/articles/design-as-research-tool-thumb.png" }} />
                <Card title="A Social Experiment about meeting strangers" meta="Experiment · Connection" href="https://www.linkedin.com/feed/update/urn:li:activity:7404207024164683776/" isExternal {...ch} media={{ type: "image", src: "/articles/meet-stranger-calendly.png" }} />
                <div id="sentinel-others-think-ai" className="col-span-3" style={{ height: 0 }} />
                <GroupLabel label="Others = AI" />
                <Card title="Physical AI" meta="Research · Embodied data" href="/physical-ai" slug="physical-ai" {...ch} media={{ type: "image", src: "/articles/physical-ai-thumb.png" }} />
                <Card title="Design the Human-AI relationships, then interaction" meta="Article · AI UX" href="/designing-next-gen-ai-products" slug="designing-next-gen-ai-products" {...ch} media={{ type: "image", src: "/articles/trust-thumb.png", thumbnailSize: "small" }} />
                <Card title="Personalization? What defines a person?" meta="Research · What makes a person" href="/personalization" slug="personalization" {...ch} media={{ type: "image", src: "/articles/personalization-thumb.svg", thumbnailSize: "small" }} />
                <Card title="Proactive" meta="Prototype · Anticipation" href="/proactive" slug="proactive" {...ch} media={{ type: "image", src: "/articles/proactive-thumb.svg", thumbnailSize: "small" }} />
              </div>
            </section>

            {/* ── 03 What others say ── */}
            <section id="others-say" className="px-8 pt-10 pb-14 scroll-mt-24" style={{ background: getSectionColor("others-say", isDarkMode), color: isDarkMode ? "#f5f5f5" : "inherit" }}>
              <div className="grid grid-cols-3 gap-4">
                <div id="sentinel-others-say-human" className="col-span-3" style={{ height: 0 }} />
                <GroupLabel label="Others = human" />
                <Card title="Prototypes beyond software" meta="Non-software · Analog" href="/hello-humans" {...ch} media={{ type: "image", src: "/articles/hello-humans-notebook.jpg" }} />
                <Card title="Voices that shaped how I think" meta="Interactive graph · /listen" href="/listen" {...ch} media={{ type: "concept", gradient: "linear-gradient(135deg,#18181b 0%,#27272a 100%)", label: "Find joy in the work. Inspire and be inspired. Hold your urge to solve." }} />

                <div id="sentinel-others-say-ai" className="col-span-3" style={{ height: 0 }} />
                <GroupLabel label="Others = AI" />
                <Card title="Conversations that earn trust" meta="Research · Conversation design" href="/designing-for-conversations-that-earn-trust" slug="designing-for-conversations-that-earn-trust" {...ch} media={{ type: "image", src: "/articles/trust-thumb.png", thumbnailSize: "small" }} />
                <Card title="What do prototypes prototype?" meta="Article · Method" href="/what-do-prototypes-prototype" slug="what-do-prototypes-prototype" {...ch} media={{ type: "image", src: "/articles/prototype-triangle-thumb.svg", thumbnailSize: "small" }} />
                <Card title="Google Cloud — Conversational AI" meta="Prototype · 0→1" href="/google-cloud" slug="google-cloud" {...ch} media={{ type: "image", src: "/articles/google-cloud-thumb.png" }} />
                <Card title="A2UI — Generative UI" meta="Prototype · AI response as interface" href="/a2ui-generative" slug="a2ui-generative" {...ch} media={{ type: "image", src: "/articles/a2ui-thumb.svg", thumbnailSize: "small" }} />
              </div>
            </section>

            {/* ── 04 I interpret ── */}
            <section id="i-interpret" className="px-8 pt-10 pb-14 scroll-mt-24" style={{ background: getSectionColor("i-interpret", isDarkMode), color: isDarkMode ? "#f5f5f5" : "inherit" }}>
              <div className="grid grid-cols-3 gap-4">
                <Card title="How Claude is shaping how I think" meta="Research · Tools" href="/claude-code-research" slug="claude-code-research" {...ch} media={{ type: "image", src: "/articles/claude-code-thumb.png", thumbnailSize: "small" }} />
                <Card title="AIOS — seeing your own blindspots" meta="Prototype · Self-reflection" badge="in progress" {...ch} media={{ type: "concept", icon: "◎", label: "A personal OS for mapping what I know, don't know, and don't know I don't know.", gradient: "linear-gradient(135deg,#f0f0f0 0%,#e2e2e2 100%)" }} />
                <Card title="AI-supported journaling" meta="Concept · Self-understanding" badge="coming soon" {...ch} media={{ type: "concept", gradient: "linear-gradient(135deg,#f5f5f0 0%,#e8e8e0 100%)", label: "Using AI to surface patterns in how I interpret the world and what I actually want." }} />
              </div>
            </section>

            <div className="px-6 pb-10 pt-4 text-center text-xs text-neutral-500">© 2026 — sketched with fountain pen & paper</div>
          </div>
        </div>
      </div>

      <div ref={footerSpacerRef} className="h-screen" />

      {openedCard && <ArticleModal card={openedCard} onClose={handleModalClose} />}
      <CollaboratorCursor triggerCount={collaboratorTrigger} mousePosRef={mousePosRef} />
    </div>
  );
}
