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

// ── Diagram ↔ section mapping ──────────────────────────────────────────────

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
  { id: "expression",     label: "New ways to express"   },
  { id: "self-knowledge", label: "Knowing your unknowns" },
  { id: "interpretation", label: "When meaning gets lost"},
  { id: "listening",      label: "What others bring"     },
] as const;

const NAV_HEIGHT = 52;

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
    recruiter: { label: "Recruiter", salutation: "Dear recruiter,",
      body: (<><p>I have an interdisciplinary background — design, engineering, research, a bit of philosophy — and I've stopped apologizing for not fitting neatly into one lane. You can use me as a design engineer.</p><p>But honestly? The best way to use me is to hand me a messy, unsolved problem and ask what we should even be building. That's where I come alive.</p><p>I think a lot about innovation — not the word, but the actual practice of it. If your team is figuring out what to build next, rather than just how to build it, I'd love to talk.</p></>),
      cta: <a href="https://www.linkedin.com/in/qiyu-hu/" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm text-white/70 hover:border-white/60 hover:text-white transition-all">LinkedIn →</a>,
    },
    dating: { label: "Dating someone?", salutation: "Dear you,",
      body: (<><p>I genuinely appreciate the effort you put into tracking me down. Internet research is a skill. That's a good sign.</p><p>Fair warning though: digital me is a portfolio. Real me has strong opinions about menus, theories about why people choose the places they choose, and a tendency to ask follow-up questions at dinner.</p><p>The most efficient next step is just to meet. Hit the button, pick a time. I'm genuinely better in person.</p></>),
      cta: <a href="https://calendly.com/huqiyu416" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm text-neutral-900 hover:bg-neutral-100 transition-all">Book a time →</a>,
    },
    "future-self": { label: "Future me", salutation: "Dear future me,",
      body: (<><p>I'm really proud of you.</p><p>Not for the things you built, or the titles, or the places you worked. For staying curious — about yourself, about this world, and about the strange and surprising connections between the two.</p><p>You kept asking questions when it would've been easier to just have the answer. Keep going.</p></>),
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
            <button key={key} onClick={() => setMode(key)} className={["rounded-full px-4 py-1.5 text-sm transition-all", mode === key ? "bg-white text-neutral-900" : "border border-white/15 text-white/50 hover:border-white/40 hover:text-white/80"].join(" ")}>{letters[key].label}</button>
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
  onSegmentClick?: (segmentId: string) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  const segColor = (id: string) => {
    if (activeSegment === id)  return "#171717";
    if (activeSegment && activeSegment !== id) return "#d4d4d4";
    if (hovered === id)        return "#404040";
    if (hovered && hovered !== id) return "#d4d4d4";
    return "#a3a3a3";
  };
  const pathStyle = (id: string) => ({
    stroke: segColor(id),
    strokeWidth: (activeSegment === id || hovered === id) ? 2 : 1.5,
    transition: "stroke 180ms, stroke-width 180ms",
    cursor: onSegmentClick ? "pointer" : "default",
  });
  const textStyle = (id: string): React.CSSProperties => ({
    fill: segColor(id), transition: "fill 180ms",
    cursor: onSegmentClick ? "pointer" : "default",
  });

  const anyActive = !!(activeSegment || hovered);
  const circleStroke = anyActive ? "#d4d4d4" : "#737373";
  const circleText = anyActive ? "#c4c4c4" : "#404040";

  const arrowFill = (id: string) => segColor(id);

  const seg = (id: string, children: ReactNode) => (
    <g onMouseEnter={() => setHovered(id)} onMouseLeave={() => setHovered(null)} onClick={() => onSegmentClick?.(id)}>
      {children}
    </g>
  );

  return (
    <svg viewBox="0 0 640 230" fill="none" className="w-full" style={{ overflow: "visible" }}>
      <circle cx="110" cy="115" r="50" stroke={circleStroke} strokeWidth="1.5" style={{ transition: "stroke 180ms" }} />
      <text x="110" y="119" textAnchor="middle" fontSize="13" fontWeight="500" fill={circleText} style={{ transition: "fill 180ms" }}>me</text>
      <circle cx="530" cy="115" r="50" stroke={circleStroke} strokeWidth="1.5" style={{ transition: "stroke 180ms" }} />
      <text x="530" y="119" textAnchor="middle" fontSize="13" fontWeight="500" fill={circleText} style={{ transition: "fill 180ms" }}>others</text>

      {seg("behave", <>
        <path d="M 155 98 Q 320 52 485 98" {...pathStyle("behave")} markerEnd="none" />
        <polygon points="0 0,7 3,0 6" fill={arrowFill("behave")} transform="translate(478,96) rotate(-10)" style={{ transition: "fill 180ms" }} />
        <text x="320" y="44" textAnchor="middle" fontSize="11" style={textStyle("behave")}>how I express / behave</text>
      </>)}
      {seg("others-interpret", <>
        <path d="M 485 98 Q 572 115 485 132" {...pathStyle("others-interpret")} strokeDasharray="5 3" />
        <text x="584" y="109" textAnchor="start" fontSize="10" style={textStyle("others-interpret")}>how others</text>
        <text x="584" y="122" textAnchor="start" fontSize="10" style={textStyle("others-interpret")}>interpret</text>
      </>)}
      {seg("others-say", <>
        <path d="M 485 132 Q 320 178 155 132" {...pathStyle("others-say")} />
        <polygon points="0 0,7 3,0 6" fill={arrowFill("others-say")} transform="translate(162,130) rotate(170)" style={{ transition: "fill 180ms" }} />
        <text x="320" y="198" textAnchor="middle" fontSize="11" style={textStyle("others-say")}>what others do or say</text>
      </>)}
      {seg("i-interpret", <>
        <path d="M 155 132 Q 68 115 155 98" {...pathStyle("i-interpret")} strokeDasharray="5 3" />
        <text x="48" y="109" textAnchor="end" fontSize="10" style={textStyle("i-interpret")}>how I</text>
        <text x="48" y="122" textAnchor="end" fontSize="10" style={textStyle("i-interpret")}>interpret</text>
      </>)}
    </svg>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────

function Card({
  title, meta, href, media, badge, isExternal, slug, onHoverChange, onMouseMove,
}: {
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
      const v = e.currentTarget.querySelector("video");
      if (v) { v.pause(); v.currentTime = 0; }
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

// ── Top nav (layer 1) ─────────────────────────────────────────────────────

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

// ── Main ──────────────────────────────────────────────────────────────────

function Index() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  // Split layout entrance animation
  const splitRef    = useRef<HTMLDivElement>(null);
  const [ready,   setReady]   = useState(false); // in viewport: enable transition
  const [entered, setEntered] = useState(false); // animation end state

  const hoveredSections = hoveredSlug ? (ARTICLE_META[hoveredSlug]?.sections ?? []) : [];
  const hoverKind = hoveredSlug && ARTICLE_META[hoveredSlug]?.sections ? "Article" : null;
  const cursorHandlers = {
    onHoverChange: setHoveredSlug,
    onMouseMove: (e: React.MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY }),
  };

  // Watch split layout entering viewport — two-frame delay to render initial offset before transition
  useEffect(() => {
    const el = splitRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !entered) {
        setReady(true);
        requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
        obs.disconnect();
      }
    }, { threshold: 0.04 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [entered]);

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTION_TABS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.25, rootMargin: `-${NAV_HEIGHT + 52}px 0px -35% 0px` }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - 52, behavior: "smooth" });
    setActiveSection(sectionId);
  }, []);

  // Hero diagram click: scroll to split layout, then to section
  const handleHeroSegmentClick = useCallback((segmentId: string) => {
    const sectionId = SEGMENT_TO_SECTION[segmentId];
    if (!sectionId) return;
    splitRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => scrollToSection(sectionId), 750);
  }, [scrollToSection]);

  const activeSegment = activeSection ? SECTION_TO_SEGMENT[activeSection] : null;

  // Left panel animation: diagram starts at ~center of viewport (translateX(31vw))
  // and slides left to its natural position (translateX(0))
  const leftPanelStyle: React.CSSProperties = {
    transform: entered ? "none" : "translateX(31vw)",
    opacity:   entered ? 1     : 0,
    transition: ready
      ? "transform 0.85s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.55s ease-out"
      : "none",
  };
  const rightPanelStyle: React.CSSProperties = {
    opacity:   entered ? 1   : 0,
    transform: entered ? "none" : "translateX(30px)",
    transition: ready
      ? "opacity 0.6s 0.3s ease-out, transform 0.6s 0.3s ease-out"
      : "none",
  };

  // Cards
  const ch = cursorHandlers;
  const expressionCards = (<>
    <Card title="Reimagining the chatbot"         meta="Prototype · Collection"    href="/reimagining-the-chatbot"  slug="reimagining-the-chatbot"                  {...ch} media={{ type: "image", src: "/articles/chatbot-thumb.png" }} />
    <Card title="Hand gesture interactions"        meta="Vibe-coding · Embodied"    href="/play"                                                                     {...ch} media={{ type: "video", src: "/articles/hand-gesture.mp4" }} />
    <Card title="Voice interaction"                meta="Vibe-coding · Voice"       href="/play"                                                                     {...ch} media={{ type: "video", src: "/articles/voice.mp4" }} />
    <Card title="Always here"                      meta="Chatbot · Presence"        href="/reimagining-the-chatbot"                                                  {...ch} media={{ type: "video", src: "/articles/chatbot-always-here.mp4", transform: "scale(2.2) translateX(-12%)" }} />
    <Card title="Hello Humans"                     meta="Non-software · Analog"     href="/hello-humans"                                                             {...ch} media={{ type: "image", src: "/articles/hello-humans-notebook.jpg" }} />
    <Card title="Physical AI"                      meta="Research · Embodied"       href="/physical-ai"              slug="physical-ai"                              {...ch} media={{ type: "image", src: "/articles/physical-ai-thumb.png" }} />
  </>);
  const selfKnowledgeCards = (<>
    <Card title="AIOS — seeing your own blindspots" meta="Prototype · Self-reflection" badge="in progress"                                                          {...ch} media={{ type: "concept", icon: "◎", label: "A tool to map the known, unknown, and unknown-unknown.", gradient: "linear-gradient(135deg,#f0f0f0 0%,#e2e2e2 100%)" }} />
    <Card title="Knowledge graph visualization"    meta="Prototype · Reasoning"      href="/reimagining-the-chatbot"                                                 {...ch} media={{ type: "video", src: "/articles/chatbot-knowledge-graph.mp4", transform: "scale(2) translateY(20%)" }} />
    <Card title="Personalization"                  meta="Research · AI Philosophy"   href="/personalization"          slug="personalization"                         {...ch} media={{ type: "image", src: "/articles/personalization-thumb.png" }} />
    <Card title="Me · Others · Think · Do"         meta="Framework · Quadrant"       href="/think"                                                                   {...ch} media={{ type: "concept", gradient: "linear-gradient(135deg,#fafafa 0%,#efefef 100%)", label: "A 2×2 for mapping where assumptions live versus where behavior happens." }} />
    <Card title="Design as a research tool"        meta="Case study · Methods"       href="/design-as-a-research-tool" slug="design-as-a-research-tool"             {...ch} media={{ type: "image", src: "/articles/design-as-research-tool-thumb.png" }} />
  </>);
  const interpretationCards = (<>
    <Card title="Conversations that earn trust"    meta="Research · Trust"           href="/designing-for-conversations-that-earn-trust" slug="designing-for-conversations-that-earn-trust" {...ch} media={{ type: "image", src: "/articles/trust-thumb.png" }} />
    <Card title="A2UI — Generative UI"             meta="Prototype · Adaptive"       href="/a2ui-generative"           slug="a2ui-generative"                        {...ch} media={{ type: "image", src: "/articles/a2ui-thumb.svg", fit: "contain" }} />
    <Card title="Designing Next-Gen AI Products"   meta="Article · Design systems"   href="/designing-next-gen-ai-products" slug="designing-next-gen-ai-products"    {...ch} media={{ type: "image", src: "/articles/trust-thumb.png" }} />
    <Card title="Proactive prototyping"            meta="Prototype · Testing"        href="/proactive"                slug="proactive"                               {...ch} media={{ type: "image", src: "/articles/proactive-thumb.png" }} />
    <Card title="Google Cloud — Conversational AI" meta="Prototype · 0→1"            href="/google-cloud"             slug="google-cloud"                            {...ch} media={{ type: "image", src: "/articles/google-cloud-thumb.png" }} />
    <Card title="What do prototypes prototype?"    meta="Article · Research method"  href="/what-do-prototypes-prototype" slug="what-do-prototypes-prototype"        {...ch} media={{ type: "image", src: "/articles/prototype-triangle-thumb.svg", fit: "contain" }} />
  </>);
  const listeningCards = (<>
    <Card title="Values from people who shaped how I think" meta="Interactive graph · /listen" href="/listen"                                                       {...ch} media={{ type: "concept", gradient: "linear-gradient(135deg,#18181b 0%,#27272a 100%)", label: "Find joy in the work. Inspire and be inspired. Hold your urge to solve." }} />
    <Card title="Meet the stranger challenge"      meta="Experiment · Connection"    href="https://www.linkedin.com/feed/update/urn:li:activity:7404207024164683776/" isExternal {...ch} media={{ type: "image", src: "/articles/meet-stranger-calendly.png" }} />
    <Card title="Hosting events @Apple"            meta="Community · IRL"                                                                                           {...ch} media={{ type: "concept", gradient: "linear-gradient(135deg,#f5f3ff 0%,#ede9fe 100%)", label: "5 events tracking a year of mental shifts — from vibe coding to questioning AI." }} />
  </>);

  return (
    <div className="relative">
      {/* Cursor TOC tooltip */}
      {hoveredSlug && hoveredSections.length > 0 && (
        <div className="fixed z-[60] pointer-events-none" style={{ left: cursorPos.x + 16, top: cursorPos.y + 16 }}>
          <div className="bg-neutral-900 text-white rounded-2xl px-5 py-4 shadow-xl max-w-[220px]">
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 font-semibold mb-3">{hoverKind}</p>
            <ul className="space-y-2">{hoveredSections.map((s, i) => <li key={i} className="text-[12px] font-semibold text-white leading-snug">{s}</li>)}</ul>
          </div>
        </div>
      )}

      {/* Dear footer: fixed behind */}
      <div className="fixed inset-0 z-0 bg-neutral-950"><DearFooter /></div>

      {/* Main white content */}
      <div className="relative z-10 bg-background" style={{ boxShadow: "0 0 80px 20px rgba(0,0,0,0.18)" }}>
        <TopNav />

        {/* ── Hero: full viewport, diagram centered ── */}
        <section
          className="bg-neutral-50 flex items-center justify-center"
          style={{ minHeight: `calc(100vh - ${NAV_HEIGHT}px)` }}
        >
          <div className="w-full max-w-2xl px-12 text-center">
            <p className="mb-3 text-[11px] uppercase tracking-[0.16em] text-neutral-400">the frame</p>
            <h2 className="mb-3 text-[26px] font-semibold text-neutral-900">Human interaction has four seams</h2>
            <p className="mb-12 text-sm text-neutral-500 leading-relaxed max-w-sm mx-auto">
              Every exchange runs through them. Somewhere in each one, something gets lost.
            </p>
            <TwoCirclesDiagram onSegmentClick={handleHeroSegmentClick} />
            <p className="mt-8 text-xs text-neutral-400">click a segment or scroll to explore</p>
          </div>
        </section>

        {/* ── Split layout ── */}
        <div ref={splitRef} className="relative flex" style={{ overflow: "visible" }}>

          {/* Left panel: sticky — the problem space */}
          <div
            className="hidden lg:flex flex-col justify-center bg-neutral-50 border-r border-neutral-100 px-10 py-14 shrink-0"
            style={{
              width: "38%",
              position: "sticky",
              top: NAV_HEIGHT,
              height: `calc(100vh - ${NAV_HEIGHT}px)`,
              alignSelf: "flex-start",
              overflow: "visible",
              zIndex: entered ? 1 : 5,
              ...leftPanelStyle,
            }}
          >
            <TwoCirclesDiagram
              activeSegment={activeSegment}
              onSegmentClick={(segId) => scrollToSection(SEGMENT_TO_SECTION[segId])}
            />

            {/* Description: the problem space */}
            <div className="mt-10">
              <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-400 mb-2">my understanding</p>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Every human interaction runs through four layers — expression, interpretation, response, and how I receive it back. There's always a gap somewhere. I'm curious about those gaps.
              </p>
            </div>

            {/* Sidebar nav */}
            <div className="mt-8 space-y-1">
              {SECTION_TABS.map(({ id, label }) => (
                <button key={id} onClick={() => scrollToSection(id)}
                  className={["w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                    activeSection === id ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100",
                  ].join(" ")}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Right panel: the tech explorations */}
          <div className="flex-1 min-w-0" style={rightPanelStyle}>

            {/* Layer 2 nav: section sub-nav */}
            <div className="sticky z-30 bg-white/95 backdrop-blur-sm border-b border-neutral-100 px-6" style={{ top: NAV_HEIGHT }}>
              <div className="flex items-center gap-6 py-3.5 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
                <span className="text-[11px] uppercase tracking-[0.14em] text-neutral-300 shrink-0">using tech to explore</span>
                <div className="w-px h-4 bg-neutral-200 shrink-0" />
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

            {/* Section: Expression */}
            <section id="expression" className="px-6 pt-10 pb-12 scroll-mt-24">
              <div className="mb-7 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900">New ways to express</h2>
                  <p className="mt-1 text-sm text-neutral-500 max-w-sm leading-relaxed">If interfaces weren't limited to text fields, how might humans convey presence, emotion, and intent?</p>
                </div>
                <a href="/play" className="shrink-0 text-sm text-neutral-400 hover:text-neutral-900 transition-colors whitespace-nowrap mt-0.5">See all →</a>
              </div>
              <div className="grid grid-cols-2 gap-5">{expressionCards}</div>
            </section>

            <div className="mx-6 border-t border-neutral-100" />

            {/* Section: Self-knowledge */}
            <section id="self-knowledge" className="px-6 pt-10 pb-12 scroll-mt-24">
              <div className="mb-7 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900">Knowing your unknowns</h2>
                  <p className="mt-1 text-sm text-neutral-500 max-w-sm leading-relaxed">How can technology help someone discover what they don't know — or that they don't know it?</p>
                </div>
                <a href="/think" className="shrink-0 text-sm text-neutral-400 hover:text-neutral-900 transition-colors whitespace-nowrap mt-0.5">See frameworks →</a>
              </div>
              <div className="grid grid-cols-2 gap-5">{selfKnowledgeCards}</div>
            </section>

            <div className="mx-6 border-t border-neutral-100" />

            {/* Section: Interpretation */}
            <section id="interpretation" className="px-6 pt-10 pb-12 scroll-mt-24">
              <div className="mb-7">
                <h2 className="text-xl font-semibold text-neutral-900">When meaning gets lost</h2>
                <p className="mt-1 text-sm text-neutral-500 max-w-sm leading-relaxed">The same message lands differently for everyone. How might design work with that gap?</p>
              </div>
              <div className="grid grid-cols-2 gap-5">{interpretationCards}</div>
            </section>

            <div className="mx-6 border-t border-neutral-100" />

            {/* Section: Listening */}
            <section id="listening" className="px-6 pt-10 pb-12 scroll-mt-24">
              <div className="mb-7 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900">What others bring</h2>
                  <p className="mt-1 text-sm text-neutral-500 max-w-sm leading-relaxed">What happens when you create conditions for people to be genuinely honest — and you actually listen?</p>
                </div>
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

      {/* Transparent scroll spacer — Dear footer shows through */}
      <div className="h-screen" />
    </div>
  );
}
