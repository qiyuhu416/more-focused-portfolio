import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { CardIcon } from "./-CardIcon";
import { ARTICLE_META } from "./-articleMeta";
import { NAV_ITEMS, navHref } from "./-navItems";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Qiyu — Human Interaction" },
      { name: "description", content: "Prototypes and explorations at the edges of human interaction." },
    ],
  }),
  component: Index,
});

// ── Types ─────────────────────────────────────────────────────────────────

type DearMode = "recruiter" | "dating" | "future-self";
type CardMedia =
  | { type: "video"; src: string; transform?: string; startTime?: number }
  | { type: "image"; src: string; fit?: "cover" | "contain" }
  | { type: "concept"; icon?: string; label?: string; gradient?: string };

// ── Constants ─────────────────────────────────────────────────────────────

const NAV_HEIGHT   = 52;
const LEFT_W       = "38%";
const SCROLL_DIST  = 500; // px of scroll over which the animation plays

const SEGMENT_TO_SECTION: Record<string, string> = {
  "behave":           "expression",
  "i-interpret":      "self-knowledge",
  "others-interpret": "interpretation",
  "others-say":       "listening",
};
const SECTION_TO_SEGMENT: Record<string, string> = Object.fromEntries(
  Object.entries(SEGMENT_TO_SECTION).map(([k, v]) => [v, k])
);
const SECTION_TABS = [
  { id: "expression",     label: "New ways to express"    },
  { id: "self-knowledge", label: "Knowing your unknowns"  },
  { id: "interpretation", label: "When meaning gets lost" },
  { id: "listening",      label: "What others bring"      },
] as const;

// ── Easing ────────────────────────────────────────────────────────────────

// smooth ease-in-out: slow start, fast middle, slow end
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
      <audio ref={audioRef} src="/baby-salt.mp3" preload="none" />
      <button onClick={toggle} className="flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95">
        <span className="text-base leading-none">{playing ? "⏸" : "▶"}</span>
        <span>Baby Salt · Chang</span>
        <span className="font-mono text-[11px] text-white/40">0:{String(seekTo).padStart(2, "0")}</span>
      </button>
      {playing && <span className="text-xs text-white/40 italic">this one always gets me</span>}
    </div>
  );
}

// ── Dear footer ───────────────────────────────────────────────────────────

function DearFooter() {
  const [mode, setMode] = useState<DearMode>("recruiter");
  const letters: Record<DearMode, { label: string; salutation: string; body: ReactNode; cta?: ReactNode }> = {
    recruiter: {
      label: "Recruiter", salutation: "Dear recruiter,",
      body: (<><p>I have an interdisciplinary background — design, engineering, research, a bit of philosophy — and I've stopped apologizing for not fitting neatly into one lane.</p><p>The best way to use me is to hand me a messy, unsolved problem and ask what we should even be building. That's where I come alive.</p><p>I think a lot about innovation — not the word, but the actual practice of it. If your team is figuring out what to build next, rather than just how, I'd love to talk.</p></>),
      cta: <a href="https://www.linkedin.com/in/qiyu-hu/" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm text-white/70 hover:border-white/60 hover:text-white transition-all">LinkedIn →</a>,
    },
    dating: {
      label: "Dating someone?", salutation: "Dear you,",
      body: (<><p>I genuinely appreciate the effort you put into tracking me down. Internet research is a skill. That's a good sign.</p><p>Fair warning though: digital me is a portfolio. Real me has strong opinions about menus and a tendency to ask follow-up questions at dinner.</p><p>The most efficient next step is just to meet. Hit the button, pick a time. I'm genuinely better in person.</p></>),
      cta: <a href="https://calendly.com/huqiyu416" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm text-neutral-900 hover:bg-neutral-100 transition-all">Book a time →</a>,
    },
    "future-self": {
      label: "Future me", salutation: "Dear future me,",
      body: (<><p>I'm really proud of you.</p><p>Not for the things you built, or the titles, or the places you worked. For staying curious — about yourself, about this world, and about the strange connections between the two.</p><p>You kept asking questions when it would've been easier to just have the answer. Keep going.</p></>),
      cta: <MusicPlayer />,
    },
  };
  const content = letters[mode];
  return (
    <div className="flex h-full flex-col items-center justify-center px-6">
      <p className="absolute top-8 text-[11px] uppercase tracking-[0.2em] text-white/20">scroll up to explore</p>
      <div className="w-full max-w-xl">
        <div className="mb-10 flex flex-wrap gap-2">
          {(Object.keys(letters) as DearMode[]).map((key) => (
            <button key={key} onClick={() => setMode(key)}
              className={["rounded-full px-4 py-1.5 text-sm transition-all", mode === key ? "bg-white text-neutral-900" : "border border-white/15 text-white/50 hover:border-white/40 hover:text-white/80"].join(" ")}>
              {letters[key].label}
            </button>
          ))}
        </div>
        <p className="mb-5 text-sm text-white/35">{content.salutation}</p>
        <div className="space-y-4 text-[17px] leading-relaxed text-white/80 [&>p]:m-0">{content.body}</div>
        {content.cta}
        <p className="mt-8 text-sm text-white/30">— Qiyu</p>
      </div>
    </div>
  );
}

// ── Two circles diagram ────────────────────────────────────────────────────

function TwoCirclesDiagram({
  activeSegment, onSegmentClick,
}: {
  activeSegment?: string | null;
  onSegmentClick?: (id: string) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const col = (id: string) => {
    if (activeSegment === id) return "#171717";
    if (activeSegment)        return "#d4d4d4";
    if (hovered === id)       return "#404040";
    if (hovered)              return "#d4d4d4";
    return "#a3a3a3";
  };
  const ps = (id: string) => ({
    stroke: col(id),
    strokeWidth: (activeSegment === id || hovered === id) ? 2 : 1.5,
    transition: "stroke 160ms, stroke-width 160ms",
    cursor: onSegmentClick ? "pointer" as const : "default" as const,
  });
  const ts = (id: string): React.CSSProperties => ({
    fill: col(id), transition: "fill 160ms",
    cursor: onSegmentClick ? "pointer" : "default",
  });
  const anyFocus = !!(activeSegment || hovered);
  const cs = anyFocus ? "#d4d4d4" : "#737373";
  const ct = anyFocus ? "#c4c4c4" : "#404040";
  const seg = (id: string, children: ReactNode) => (
    <g onMouseEnter={() => setHovered(id)} onMouseLeave={() => setHovered(null)}
       onClick={() => onSegmentClick?.(id)}>{children}</g>
  );
  return (
    <svg viewBox="0 0 640 230" fill="none" className="w-full" style={{ overflow: "visible" }}>
      <circle cx="110" cy="115" r="50" stroke={cs} strokeWidth="1.5" style={{ transition: "stroke 160ms" }} />
      <text x="110" y="119" textAnchor="middle" fontSize="13" fontWeight="500" fill={ct} style={{ transition: "fill 160ms" }}>me</text>
      <circle cx="530" cy="115" r="50" stroke={cs} strokeWidth="1.5" style={{ transition: "stroke 160ms" }} />
      <text x="530" y="119" textAnchor="middle" fontSize="13" fontWeight="500" fill={ct} style={{ transition: "fill 160ms" }}>others</text>
      {seg("behave", <>
        <path d="M 155 98 Q 320 52 485 98" {...ps("behave")} />
        <polygon points="0 0,7 3,0 6" fill={col("behave")} transform="translate(478,95) rotate(-8)" style={{ transition: "fill 160ms" }} />
        <text x="320" y="44" textAnchor="middle" fontSize="11" style={ts("behave")}>how I express / behave</text>
      </>)}
      {seg("others-interpret", <>
        <path d="M 485 98 Q 572 115 485 132" {...ps("others-interpret")} strokeDasharray="5 3" />
        <text x="584" y="109" textAnchor="start" fontSize="10" style={ts("others-interpret")}>how others</text>
        <text x="584" y="122" textAnchor="start" fontSize="10" style={ts("others-interpret")}>interpret</text>
      </>)}
      {seg("others-say", <>
        <path d="M 485 132 Q 320 178 155 132" {...ps("others-say")} />
        <polygon points="0 0,7 3,0 6" fill={col("others-say")} transform="translate(162,131) rotate(172)" style={{ transition: "fill 160ms" }} />
        <text x="320" y="198" textAnchor="middle" fontSize="11" style={ts("others-say")}>what others do or say</text>
      </>)}
      {seg("i-interpret", <>
        <path d="M 155 132 Q 68 115 155 98" {...ps("i-interpret")} strokeDasharray="5 3" />
        <text x="48" y="109" textAnchor="end" fontSize="10" style={ts("i-interpret")}>how I</text>
        <text x="48" y="122" textAnchor="end" fontSize="10" style={ts("i-interpret")}>interpret</text>
      </>)}
    </svg>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────

function Card({ title, meta, href, media, badge, isExternal, slug, onHoverChange, onMouseMove }: {
  title: string; meta: string; href?: string; media: CardMedia;
  badge?: string; isExternal?: boolean; slug?: string;
  onHoverChange?: (slug: string | null) => void;
  onMouseMove?: (e: React.MouseEvent) => void;
}) {
  const isVideo = media.type === "video";
  const cls = "group relative rounded-2xl bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] block";
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
      {badge && <span className="absolute top-5 right-5 z-10 rounded-full bg-neutral-900/80 px-2.5 py-1 text-[10px] uppercase tracking-wide text-white backdrop-blur-sm">{badge}</span>}
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-white">
        {media.type === "video" && <video src={`${media.src}#t=0.001`} preload="metadata" muted loop playsInline className="h-full w-full object-cover" style={media.transform ? { transform: media.transform } : undefined} />}
        {media.type === "image" && <img src={media.src} alt={title} className={`h-full w-full ${media.fit === "contain" ? "object-contain p-6" : "object-cover"}`} />}
        {media.type === "concept" && (
          <div className="h-full w-full flex flex-col items-center justify-center gap-3 px-8 py-6" style={{ background: media.gradient ?? "linear-gradient(135deg,#f5f5f5 0%,#e8e8e8 100%)" }}>
            {media.icon && <span className="text-3xl">{media.icon}</span>}
            {media.label && <p className="text-xs text-neutral-500 text-center leading-relaxed">{media.label}</p>}
          </div>
        )}
        <CardIcon hasVideo={isVideo} />
      </div>
      <div className="px-2 pb-2 pt-4">
        <p className="text-xs text-neutral-500">{meta}</p>
        <h3 className="mt-1 text-[15px] font-medium text-neutral-900 leading-snug">{title}</h3>
      </div>
    </>
  );
  if (!href) return <div className={cls} {...handlers}>{inner}</div>;
  return <a href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined} className={cls} {...handlers}>{inner}</a>;
}

// ── Top nav ───────────────────────────────────────────────────────────────

function TopNav() {
  return (
    <header className="sticky top-0 z-50 flex items-center px-8 bg-white/95 backdrop-blur-sm border-b border-neutral-100" style={{ height: NAV_HEIGHT }}>
      <Link to="/" className="text-[15px] font-semibold tracking-tight text-neutral-900 mr-auto">Qiyu</Link>
      <nav className="flex items-center gap-8">
        {NAV_ITEMS.map((l) => (
          <Link key={l} to={navHref(l)} className={["text-sm transition-colors", l === "work" ? "text-neutral-900 font-medium" : "text-neutral-400 hover:text-neutral-900"].join(" ")}>{l}</Link>
        ))}
      </nav>
    </header>
  );
}

// ── Index ─────────────────────────────────────────────────────────────────

function Index() {
  // ── Refs for the imperative animation loop (no re-renders) ──
  const bgRef           = useRef<HTMLDivElement>(null); // left panel bg fill
  const diagramInnerRef = useRef<HTMLDivElement>(null); // gets translateX
  const heroTextRef     = useRef<HTMLDivElement>(null); // fades out
  const heroHintRef     = useRef<HTMLDivElement>(null); // fades out
  const splitDescRef    = useRef<HTMLDivElement>(null); // fades in
  const settledRef      = useRef(false);                // tracks without re-render

  // ── React state — only changes ONCE when animation settles ──
  const [settled, setSettled]           = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [cursorPos, setCursorPos]       = useState({ x: 0, y: 0 });
  const [hoveredSlug, setHoveredSlug]   = useState<string | null>(null);

  const hoveredSections = hoveredSlug ? (ARTICLE_META[hoveredSlug]?.sections ?? []) : [];
  const hoverKind = hoveredSlug && ARTICLE_META[hoveredSlug]?.sections ? "Article" : null;
  const ch = {
    onHoverChange: setHoveredSlug,
    onMouseMove: (e: React.MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY }),
  };

  // ── THE animation loop — runs per scroll tick, writes directly to DOM ──
  useEffect(() => {
    let raf = 0;

    const tick = () => {
      // progress: 0 at top, 1 when scrolled SCROLL_DIST px
      const raw = Math.min(1, Math.max(0, window.scrollY / SCROLL_DIST));
      const p   = ease(raw);
      const vw  = window.innerWidth;

      // Diagram slides from center (0) to left panel center (-31vw)
      // Also shrinks from hero width → left panel width
      if (diagramInnerRef.current) {
        const heroW  = Math.min(600, vw * 0.9);
        const splitW = vw * 0.38 - 60; // left panel minus padding
        const w      = heroW + (splitW - heroW) * p;
        diagramInnerRef.current.style.maxWidth   = `${w}px`;
        diagramInnerRef.current.style.transform  = `translateX(calc(${-31 * p}vw))`;
      }

      // Left panel background: transparent → #fafafa
      if (bgRef.current) {
        bgRef.current.style.opacity = String(p);
      }

      // Hero text + hint: fade out over first 40% of progress
      const heroOpacity = String(Math.max(0, 1 - p / 0.4));
      if (heroTextRef.current) heroTextRef.current.style.opacity = heroOpacity;
      if (heroHintRef.current) heroHintRef.current.style.opacity = heroOpacity;

      // Split description: fade in from 60% → 100% of progress
      if (splitDescRef.current) {
        const descOp = Math.max(0, (p - 0.6) / 0.4);
        splitDescRef.current.style.opacity      = String(descOp);
        splitDescRef.current.style.pointerEvents = descOp > 0.5 ? "auto" : "none";
      }

      // React state: flip exactly once when crossing the threshold
      const nowSettled = raw >= 1;
      if (nowSettled !== settledRef.current) {
        settledRef.current = nowSettled;
        setSettled(nowSettled); // single re-render, once
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    tick(); // run immediately on mount

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []); // empty — setSettled is stable, all refs are stable

  // ── Active section tracker (IntersectionObserver) ──
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTION_TABS.forEach(({ id }) => {
      const el = document.getElementById(id); if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.25, rootMargin: `-${NAV_HEIGHT + 52}px 0px -35% 0px` }
      );
      obs.observe(el); observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id); if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - 52, behavior: "smooth" });
    setActiveSection(id);
  }, []);

  // Clicking a diagram segment scrolls past the animation and into that section
  const handleSegmentClick = useCallback((segId: string) => {
    const sectionId = SEGMENT_TO_SECTION[segId]; if (!sectionId) return;
    scrollToSection(sectionId);
    // scrollToSection scrolls to >SCROLL_DIST naturally, animation plays on the way
  }, [scrollToSection]);

  const activeSegment = activeSection ? SECTION_TO_SEGMENT[activeSection] : null;

  // ── Cards ────────────────────────────────────────────────────────────────
  const expressionCards = (<>
    <Card title="Reimagining the chatbot"           meta="Prototype · Collection"     href="/reimagining-the-chatbot"    slug="reimagining-the-chatbot"   {...ch} media={{ type: "image", src: "/articles/chatbot-thumb.png" }} />
    <Card title="Hand gesture interactions"          meta="Vibe-coding · Embodied"     href="/play"                                                        {...ch} media={{ type: "video", src: "/articles/hand-gesture.mp4" }} />
    <Card title="Voice interaction"                  meta="Vibe-coding · Voice"        href="/play"                                                        {...ch} media={{ type: "video", src: "/articles/voice.mp4" }} />
    <Card title="Always here"                        meta="Chatbot · Presence"         href="/reimagining-the-chatbot"                                     {...ch} media={{ type: "video", src: "/articles/chatbot-always-here.mp4", transform: "scale(2.2) translateX(-12%)" }} />
    <Card title="Hello Humans"                       meta="Non-software · Analog"      href="/hello-humans"                                                {...ch} media={{ type: "image", src: "/articles/hello-humans-notebook.jpg" }} />
    <Card title="Physical AI"                        meta="Research · Embodied"        href="/physical-ai"                slug="physical-ai"               {...ch} media={{ type: "image", src: "/articles/physical-ai-thumb.png" }} />
  </>);
  const selfKnowledgeCards = (<>
    <Card title="AIOS — seeing your own blindspots"  meta="Prototype · Self-reflection" badge="in progress"                                                {...ch} media={{ type: "concept", icon: "◎", label: "A tool to map the known, unknown, and unknown-unknown.", gradient: "linear-gradient(135deg,#f0f0f0 0%,#e2e2e2 100%)" }} />
    <Card title="Knowledge graph visualization"      meta="Prototype · Reasoning"      href="/reimagining-the-chatbot"                                     {...ch} media={{ type: "video", src: "/articles/chatbot-knowledge-graph.mp4", transform: "scale(2) translateY(20%)" }} />
    <Card title="Personalization"                    meta="Research · AI Philosophy"   href="/personalization"            slug="personalization"           {...ch} media={{ type: "image", src: "/articles/personalization-thumb.png" }} />
    <Card title="Me · Others · Think · Do"           meta="Framework · Quadrant"       href="/think"                                                       {...ch} media={{ type: "concept", gradient: "linear-gradient(135deg,#fafafa 0%,#efefef 100%)", label: "A 2×2 for mapping where assumptions live versus where behavior happens." }} />
    <Card title="Design as a research tool"          meta="Case study · Methods"       href="/design-as-a-research-tool"  slug="design-as-a-research-tool" {...ch} media={{ type: "image", src: "/articles/design-as-research-tool-thumb.png" }} />
  </>);
  const interpretationCards = (<>
    <Card title="Conversations that earn trust"      meta="Research · Trust"           href="/designing-for-conversations-that-earn-trust" slug="designing-for-conversations-that-earn-trust" {...ch} media={{ type: "image", src: "/articles/trust-thumb.png" }} />
    <Card title="A2UI — Generative UI"               meta="Prototype · Adaptive"       href="/a2ui-generative"            slug="a2ui-generative"           {...ch} media={{ type: "image", src: "/articles/a2ui-thumb.svg", fit: "contain" }} />
    <Card title="Designing Next-Gen AI Products"     meta="Article · Design systems"   href="/designing-next-gen-ai-products" slug="designing-next-gen-ai-products" {...ch} media={{ type: "image", src: "/articles/trust-thumb.png" }} />
    <Card title="Proactive prototyping"              meta="Prototype · Testing"        href="/proactive"                  slug="proactive"                 {...ch} media={{ type: "image", src: "/articles/proactive-thumb.png" }} />
    <Card title="Google Cloud — Conversational AI"   meta="Prototype · 0→1"            href="/google-cloud"               slug="google-cloud"              {...ch} media={{ type: "image", src: "/articles/google-cloud-thumb.png" }} />
    <Card title="What do prototypes prototype?"      meta="Article · Research method"  href="/what-do-prototypes-prototype" slug="what-do-prototypes-prototype" {...ch} media={{ type: "image", src: "/articles/prototype-triangle-thumb.svg", fit: "contain" }} />
  </>);
  const listeningCards = (<>
    <Card title="Values from people who shaped how I think" meta="Interactive graph · /listen" href="/listen" {...ch} media={{ type: "concept", gradient: "linear-gradient(135deg,#18181b 0%,#27272a 100%)", label: "Find joy in the work. Inspire and be inspired. Hold your urge to solve." }} />
    <Card title="Meet the stranger challenge"        meta="Experiment · Connection"    href="https://www.linkedin.com/feed/update/urn:li:activity:7404207024164683776/" isExternal {...ch} media={{ type: "image", src: "/articles/meet-stranger-calendly.png" }} />
    <Card title="Hosting events @Apple"              meta="Community · IRL"                                                                                {...ch} media={{ type: "concept", gradient: "linear-gradient(135deg,#f5f3ff 0%,#ede9fe 100%)", label: "5 events tracking a year of mental shifts." }} />
  </>);

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

      {/* Dear footer: fixed behind */}
      <div className="fixed inset-0 z-0 bg-neutral-950"><DearFooter /></div>

      {/*
        ── SINGLE DIAGRAM OVERLAY ──────────────────────────────────────────
        position: fixed, always full width.
        The scroll loop writes directly to diagramInnerRef.style.transform
        and diagramInnerRef.style.maxWidth — no React re-renders during animation.
        bgRef opacity 0→1 reveals the left panel background behind the diagram.
        ────────────────────────────────────────────────────────────────── */}
      <div style={{
        position: "fixed", top: NAV_HEIGHT, left: 0, right: 0, bottom: 0,
        zIndex: 30, pointerEvents: "none", overflow: "hidden",
      }}>
        {/* Left panel background fill — opacity animated by scroll loop */}
        <div ref={bgRef} style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: LEFT_W,
          background: "#fafafa", borderRight: "1px solid #f0f0f0", opacity: 0,
        }} />

        {/* Content layer — pointer-events restored for diagram interaction */}
        <div style={{
          position: "relative", zIndex: 1, height: "100%",
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "auto",
        }}>
          {/*
            diagramInnerRef: this is what the scroll loop moves.
            translateX: 0 (centered) → -31vw (left panel center)
            maxWidth: hero size → left panel size
            All applied imperatively, zero React re-renders.
          */}
          <div ref={diagramInnerRef} style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            width: "100%", maxWidth: 600, // overwritten by scroll loop
          }}>
            {/* Hero header — fades out via scroll loop */}
            <div ref={heroTextRef} style={{ textAlign: "center", marginBottom: "2.5rem", width: "100%" }}>
              <p style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#a3a3a3", marginBottom: 10 }}>the frame</p>
              <h2 style={{ fontSize: 26, fontWeight: 600, color: "#171717", marginBottom: 10, lineHeight: 1.2 }}>Human interaction has four seams</h2>
              <p style={{ fontSize: 14, color: "#737373", lineHeight: 1.6, maxWidth: 360, margin: "0 auto" }}>
                Every exchange runs through them. Somewhere in each one, something gets lost.
              </p>
            </div>

            {/* THE diagram — one instance, never remounted */}
            <TwoCirclesDiagram
              activeSegment={settled ? activeSegment : null}
              onSegmentClick={handleSegmentClick}
            />

            {/* Hero scroll hint — fades out */}
            <div ref={heroHintRef} style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <p style={{ fontSize: 12, color: "#a3a3a3" }}>click a segment or scroll to explore</p>
            </div>

            {/* Split description — fades in, no pointer-events until visible */}
            <div ref={splitDescRef} style={{ marginTop: "2rem", width: "100%", opacity: 0, pointerEvents: "none" }}>
              <p style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#a3a3a3", marginBottom: 8 }}>my understanding</p>
              <p style={{ fontSize: 13, color: "#525252", lineHeight: 1.65 }}>
                Every human interaction runs through four layers — expression, interpretation, response, and how I receive it back. There's always a gap somewhere. That gap is what I explore.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content — white layer that scrolls over the Dear footer ── */}
      <div className="relative z-10 bg-background" style={{ boxShadow: "0 0 80px 20px rgba(0,0,0,0.18)" }}>
        <TopNav />

        {/* Hero placeholder — provides scroll space + bg-neutral-50 context */}
        <div style={{ height: `calc(100vh - ${NAV_HEIGHT}px)`, background: "#fafafa" }} />

        {/* Split layout */}
        <div className="flex">
          {/* Left placeholder — keeps space for the fixed overlay */}
          <div style={{ width: LEFT_W, flexShrink: 0 }} />

          {/* Right panel — fades in once scroll settles */}
          <div className="flex-1 min-w-0" style={{
            opacity: settled ? 1 : 0,
            pointerEvents: settled ? "auto" : "none",
            transition: "opacity 0.4s ease",
          }}>
            {/* Layer 2 nav */}
            <div className="sticky z-30 bg-white/95 backdrop-blur-sm border-b border-neutral-100 px-6" style={{ top: NAV_HEIGHT }}>
              <div className="flex items-center gap-6 py-3.5 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
                <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#d4d4d4", whiteSpace: "nowrap" }}>using tech to explore</span>
                <div style={{ width: 1, height: 16, background: "#e5e5e5", flexShrink: 0 }} />
                {SECTION_TABS.map(({ id, label }) => (
                  <button key={id} onClick={() => scrollToSection(id)}
                    className={["text-sm whitespace-nowrap transition-colors shrink-0",
                      activeSection === id ? "text-neutral-900 font-medium" : "text-neutral-400 hover:text-neutral-900",
                    ].join(" ")}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <section id="expression" className="px-6 pt-10 pb-12 scroll-mt-24">
              <div className="mb-7 flex items-start justify-between gap-4">
                <div><h2 className="text-xl font-semibold text-neutral-900">New ways to express</h2><p className="mt-1 text-sm text-neutral-500 max-w-sm leading-relaxed">If interfaces weren't limited to text fields, how might humans convey presence, emotion, and intent?</p></div>
                <a href="/play" className="shrink-0 text-sm text-neutral-400 hover:text-neutral-900 transition-colors whitespace-nowrap mt-0.5">See all →</a>
              </div>
              <div className="grid grid-cols-2 gap-5">{expressionCards}</div>
            </section>

            <div className="mx-6 border-t border-neutral-100" />

            <section id="self-knowledge" className="px-6 pt-10 pb-12 scroll-mt-24">
              <div className="mb-7 flex items-start justify-between gap-4">
                <div><h2 className="text-xl font-semibold text-neutral-900">Knowing your unknowns</h2><p className="mt-1 text-sm text-neutral-500 max-w-sm leading-relaxed">How can technology help someone discover what they don't know — or that they don't know it?</p></div>
                <a href="/think" className="shrink-0 text-sm text-neutral-400 hover:text-neutral-900 transition-colors whitespace-nowrap mt-0.5">See frameworks →</a>
              </div>
              <div className="grid grid-cols-2 gap-5">{selfKnowledgeCards}</div>
            </section>

            <div className="mx-6 border-t border-neutral-100" />

            <section id="interpretation" className="px-6 pt-10 pb-12 scroll-mt-24">
              <div className="mb-7"><h2 className="text-xl font-semibold text-neutral-900">When meaning gets lost</h2><p className="mt-1 text-sm text-neutral-500 max-w-sm leading-relaxed">The same message lands differently for everyone. How might design work with that gap?</p></div>
              <div className="grid grid-cols-2 gap-5">{interpretationCards}</div>
            </section>

            <div className="mx-6 border-t border-neutral-100" />

            <section id="listening" className="px-6 pt-10 pb-12 scroll-mt-24">
              <div className="mb-7 flex items-start justify-between gap-4">
                <div><h2 className="text-xl font-semibold text-neutral-900">What others bring</h2><p className="mt-1 text-sm text-neutral-500 max-w-sm leading-relaxed">What happens when you create conditions for people to be genuinely honest — and you actually listen?</p></div>
                <a href="/listen" className="shrink-0 text-sm text-neutral-400 hover:text-neutral-900 transition-colors whitespace-nowrap mt-0.5">Open the graph →</a>
              </div>
              <div className="grid grid-cols-2 gap-5">{listeningCards}</div>
            </section>

            <div className="px-6 pb-10 pt-4 text-center text-xs text-neutral-400">
              © 2026 — sketched with fountain pen & paper
            </div>
          </div>
        </div>
      </div>

      {/* Transparent spacer — Dear footer shows through */}
      <div className="h-screen" />
    </div>
  );
}
