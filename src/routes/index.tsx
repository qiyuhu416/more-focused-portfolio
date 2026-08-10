import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { CardIcon } from "./-CardIcon";
import { ARTICLE_META } from "./-articleMeta";
import { NAV_ITEMS, navHref } from "./-navItems";

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
  "others-think": "How do you understand what others are thinking?",
  "others-say":   "What does it sound like when others respond?",
  "i-interpret":  "Do you know what you actually want?",
};

const SECTION_DESCRIPTIONS: Record<string, string> = {
  "expression":   "Current interfaces reduce all intent to text boxes. But presence, nuance, and emotion are much richer than that.",
  "others-think": "We design based on assumptions about how others think — whether that someone is human or AI. Those assumptions are often wrong.",
  "others-say":   "What gets said back shapes how understood we feel. Whether it's a conversation with a stranger or an AI response, design decides what gets heard.",
  "i-interpret":  "The way I process what arrives is filtered by what I already believe. Making that filter visible is the first step.",
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

const DEAR_LABEL: Record<DearMode, string> = {
  recruiter:    "recruiter",
  dating:       "you",
  "future-self":"future me",
};

function DearFooter() {
  const [mode, setMode]   = useState<DearMode>("recruiter");
  const [open, setOpen]   = useState(false);

  const letters: Record<DearMode, { body: ReactNode; cta?: ReactNode }> = {
    recruiter: {
      body: (<><p>I have an interdisciplinary background — design, engineering, research, a bit of philosophy — and I've stopped apologizing for not fitting neatly into one lane.</p><p>The best way to use me is to hand me a messy, unsolved problem and ask what we should even be building. That's where I come alive.</p><p>I think a lot about innovation — not the word, but the actual practice of it. If your team is figuring out what to build next, rather than just how, I'd love to talk.</p></>),
      cta: <a href="https://www.linkedin.com/in/qiyu-hu/" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm text-white/70 hover:border-white/60 hover:text-white transition-all">LinkedIn →</a>,
    },
    dating: {
      body: (<><p>I genuinely appreciate the effort you put into tracking me down. Internet research is a skill. That's a good sign.</p><p>Fair warning though: digital me is a portfolio. Real me has strong opinions about menus and a tendency to ask follow-up questions at dinner.</p><p>The most efficient next step is just to meet. Hit the button, pick a time. I'm genuinely better in person.</p></>),
      cta: <a href="https://calendly.com/huqiyu416" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm text-neutral-900 hover:bg-neutral-100 transition-all">Book a time →</a>,
    },
    "future-self": {
      body: (<><p>I'm really proud of you.</p><p>Not for the things you built, or the titles, or the places you worked. For staying curious — about yourself, about this world, and about the strange connections between the two.</p><p>You kept asking questions when it would've been easier to just have the answer. Keep going.</p></>),
      cta: <MusicPlayer />,
    },
  };
  const content = letters[mode];

  return (
    <div className="flex h-full items-center" style={{ paddingLeft: LEFT_W }}>
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

// ── Two circles diagram ────────────────────────────────────────────────────

function TwoCirclesDiagram({ activeSegment, onSegmentClick }: {
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
    stroke: col(id), strokeWidth: (activeSegment === id || hovered === id) ? 2 : 1.5,
    transition: "stroke 160ms, stroke-width 160ms",
    cursor: onSegmentClick ? "pointer" as const : "default" as const,
  });
  const ts = (id: string): React.CSSProperties => ({ fill: col(id), transition: "fill 160ms", cursor: onSegmentClick ? "pointer" : "default" });
  const anyFocus = !!(activeSegment || hovered);
  const cs = anyFocus ? "#d4d4d4" : "#737373";
  const ct = anyFocus ? "#c4c4c4" : "#404040";
  const seg = (id: string, children: ReactNode) => (
    <g onMouseEnter={() => setHovered(id)} onMouseLeave={() => setHovered(null)} onClick={() => onSegmentClick?.(id)}>{children}</g>
  );
  return (
    <svg viewBox="0 0 640 230" fill="none" className="w-full">
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
        <text x="570" y="109" textAnchor="start" fontSize="10" style={ts("others-interpret")}>how others</text>
        <text x="570" y="122" textAnchor="start" fontSize="10" style={ts("others-interpret")}>interpret</text>
      </>)}
      {seg("others-say", <>
        <path d="M 485 132 Q 320 178 155 132" {...ps("others-say")} />
        <polygon points="0 0,7 3,0 6" fill={col("others-say")} transform="translate(162,131) rotate(172)" style={{ transition: "fill 160ms" }} />
        <text x="320" y="198" textAnchor="middle" fontSize="11" style={ts("others-say")}>what others do or say</text>
      </>)}
      {seg("i-interpret", <>
        <path d="M 155 132 Q 68 115 155 98" {...ps("i-interpret")} strokeDasharray="5 3" />
        <text x="60" y="109" textAnchor="end" fontSize="10" style={ts("i-interpret")}>how I</text>
        <text x="60" y="122" textAnchor="end" fontSize="10" style={ts("i-interpret")}>interpret</text>
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
        {media.type === "image" && <img src={media.src} alt={title} className={
          media.thumbnailSize === "xs"     ? "w-8 h-8 object-contain" :
          media.thumbnailSize === "small"  ? "w-16 h-16 object-contain" :
          media.thumbnailSize === "medium" ? "w-32 h-32 object-contain" :
          "h-full w-full object-cover"
        } />}
        {media.type === "concept" && (
          <div className="h-full w-full flex flex-col items-center justify-center gap-3 px-8 py-6" style={{ background: media.gradient ?? "linear-gradient(135deg,#f5f5f5 0%,#e8e8e8 100%)" }}>
            {media.icon && <span style={{ fontSize: 52 }}>{media.icon}</span>}
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

// ── Sub-group divider ─────────────────────────────────────────────────────

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

function GroupLabel({ label }: { label: string }) {
  return (
    <div className="col-span-2 flex items-center gap-3 mt-4 mb-1">
      <span style={{ fontSize: 10, color: "#c4c4c4", letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: "#f0f0f0" }} />
    </div>
  );
}

// ── Index ─────────────────────────────────────────────────────────────────

function Index() {
  const bgRef              = useRef<HTMLDivElement>(null);
  const contentWrapperRef  = useRef<HTMLDivElement>(null);
  const diagramInnerRef    = useRef<HTMLDivElement>(null);
  const heroTextRef        = useRef<HTMLDivElement>(null);
  const heroHintRef        = useRef<HTMLDivElement>(null);
  const footerSpacerRef = useRef<HTMLDivElement>(null);
  const settledRef      = useRef(false);

  const [settled, setSettled]                 = useState(false);
  const [activeSection, setActiveSection]     = useState<string | null>(null);
  const [atFooter, setAtFooter]               = useState(false);
  const [questionVisible, setQuestionVisible] = useState(true);
  const [cursorPos, setCursorPos]             = useState({ x: 0, y: 0 });
  const [hoveredSlug, setHoveredSlug]         = useState<string | null>(null);

  const hoveredSections = hoveredSlug ? (ARTICLE_META[hoveredSlug]?.sections ?? []) : [];
  const hoverKind = hoveredSlug && ARTICLE_META[hoveredSlug]?.sections ? "Article" : null;
  const ch = {
    onHoverChange: setHoveredSlug,
    onMouseMove: (e: React.MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY }),
  };

  // CSS keyframe for question title entrance
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes qFadeIn {
        from { opacity: 0; transform: translateY(5px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .q-title { animation: qFadeIn 0.35s ease forwards; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // Brief opacity dip when section changes, then snap back
  useEffect(() => {
    setQuestionVisible(false);
    const t = setTimeout(() => setQuestionVisible(true), 160);
    return () => clearTimeout(t);
  }, [activeSection]);

  // Scroll animation loop — imperative DOM writes, no React re-renders
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const raw = Math.min(1, Math.max(0, window.scrollY / SCROLL_DIST));
      const p   = ease(raw);
      const vw  = window.innerWidth;
      if (diagramInnerRef.current) {
        const w = Math.min(600, vw * 0.9) * (1 - p) + (vw * 0.38 - 60) * p;
        diagramInnerRef.current.style.maxWidth  = `${w}px`;
        diagramInnerRef.current.style.transform = `translateX(calc(${-31 * p}vw))`;
      }
      if (bgRef.current) bgRef.current.style.opacity = String(p);
      const ho = String(Math.max(0, 1 - p / 0.4));
      if (heroTextRef.current) heroTextRef.current.style.opacity = ho;
      if (heroHintRef.current) heroHintRef.current.style.opacity = ho;
      // Shift content wrapper from vertically-centered → top-aligned as we settle
      if (contentWrapperRef.current) {
        contentWrapperRef.current.style.alignItems     = p > 0.5 ? "flex-start" : "center";
        contentWrapperRef.current.style.justifyContent = p > 0.5 ? "flex-start" : "center";
        contentWrapperRef.current.style.paddingTop     = p > 0.5 ? `${Math.min(4, (p - 0.5) / 0.5 * 4)}rem` : "0";
      }
      const now = raw >= 1;
      if (now !== settledRef.current) { settledRef.current = now; setSettled(now); }
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); };
    window.addEventListener("scroll", onScroll, { passive: true });
    tick();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  // Active section via IntersectionObserver
  useEffect(() => {
    const obs: IntersectionObserver[] = [];
    SECTION_TABS.forEach(({ id }) => {
      const el = document.getElementById(id); if (!el) return;
      const o = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.25, rootMargin: `-${NAV_HEIGHT + 52}px 0px -35% 0px` }
      );
      o.observe(el); obs.push(o);
    });
    return () => obs.forEach(o => o.disconnect());
  }, []);

  useEffect(() => {
    const el = footerSpacerRef.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setAtFooter(entry.isIntersecting),
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

      {/* Dear footer */}
      <div className="fixed inset-0 z-0 bg-neutral-950"><DearFooter /></div>

      {/* Single diagram overlay — scroll loop animates this */}
      <div style={{ position: "fixed", top: NAV_HEIGHT, left: 0, right: 0, bottom: 0, zIndex: 30, pointerEvents: "none", overflow: "hidden" }}>
        <div ref={bgRef} style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: LEFT_W, background: "#fafafa", borderRight: "1px solid #f0f0f0", opacity: 0 }} />
        {/* pointerEvents: none so right panel receives clicks normally.
            Only diagramInnerRef (which sits in the left panel in split mode)
            has pointerEvents: auto — it's the only interactive element here. */}
        <div ref={contentWrapperRef} style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", overflow: "hidden" }}>
          <div ref={diagramInnerRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 600, pointerEvents: "auto", overflow: "hidden", clipPath: "inset(0 -20px)" }}>

            {/* Hero header */}
            <div ref={heroTextRef} style={{ textAlign: "center", marginBottom: "2.5rem", width: "100%" }}>
              <h2 style={{ fontSize: 32, fontWeight: 600, color: "#171717", marginBottom: 12, lineHeight: 1.15, letterSpacing: "-0.01em" }}>Hello Humans.</h2>
              <p style={{ fontSize: 15, color: "#737373", lineHeight: 1.65 }}>Qiyu is exploring technology that brings people closer.</p>
            </div>

            {/* Question title — centered, appears when settled, re-animates on section change */}
            {settled && activeSection && (
              <div key={activeSection} className="q-title" style={{ width: "100%", marginBottom: "1.5rem", textAlign: "center" }}>
                <h3 style={{ fontSize: 22, fontWeight: 600, color: "#171717", lineHeight: 1.3, opacity: questionVisible ? 1 : 0, transition: "opacity 0.16s ease" }}>
                  {SECTION_QUESTIONS[activeSection]}
                </h3>
              </div>
            )}

            {/* THE single diagram */}
            <TwoCirclesDiagram activeSegment={settled ? activeSegment : null} onSegmentClick={handleSegmentClick} />

            {/* Hero hint */}
            <div ref={heroHintRef} style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <svg width="14" height="18" viewBox="0 0 14 18" fill="none" style={{ opacity: 0.35, margin: "0 auto" }}><path d="M7 1v16M7 17l-5-5M7 17l5-5" stroke="#a3a3a3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>

            {/* Pain point description — appears in split mode, per section */}
            {settled && activeSection && (
              <div key={`desc-${activeSection}`} style={{ marginTop: "1.5rem", width: "100%", textAlign: "center", opacity: questionVisible ? 1 : 0, transition: "opacity 0.16s ease" }}>
                <p style={{ fontSize: 13, color: "#737373", lineHeight: 1.65 }}>
                  {SECTION_DESCRIPTIONS[activeSection]}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main white content */}
      <div className="relative z-10 bg-background" style={{ boxShadow: "0 0 80px 20px rgba(0,0,0,0.18)" }}>
        <TopNav />
        <div style={{ height: `calc(100vh - ${NAV_HEIGHT}px)`, background: "#fafafa" }} />

        <div className="flex">
          <div style={{ width: LEFT_W, flexShrink: 0 }} />

          {/* Right panel */}
          <div className="flex-1 min-w-0" style={{ opacity: settled ? 1 : 0, pointerEvents: settled ? "auto" : "none", transition: "opacity 0.4s ease" }}>

            {/* ── 01 New ways to express ── */}
            <section id="expression" className="px-6 pt-8 pb-12 scroll-mt-24">
              <div className="flex justify-end mb-5">
                <a href="/play" className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors">See all →</a>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <Card title="Hand gesture interactions" meta="Vibe-coding · Embodied" href="/play" {...ch} media={{ type: "video", src: "/articles/hand-gesture.mp4" }} />
                <Card title="Voice interaction" meta="Vibe-coding · Voice" href="/play" {...ch} media={{ type: "video", src: "/articles/voice.mp4" }} />
                <Card title="Palo Alto moment" meta="Vibe-coding · Place & context" href="/play" {...ch} media={{ type: "video", src: "/articles/palo-alto.mp4" }} />
                <Card title="Reimagining the chatbot" meta="Prototype · Collection" href="/reimagining-the-chatbot" slug="reimagining-the-chatbot" {...ch} media={{ type: "image", src: "/articles/chatbot-thumb.png", thumbnailSize: "medium" }} />
              </div>
            </section>

            <div className="mx-6 border-t border-neutral-100" />

            {/* ── 02 How others think ── */}
            <section id="others-think" className="px-6 pt-8 pb-12 scroll-mt-24">
              <div className="flex justify-end mb-5">
                <a href="/think" className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors">See frameworks →</a>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <GroupLabel label="others = human" />
                <Card title="Design as a research tool" meta="Case study · Service design" href="/design-as-a-research-tool" slug="design-as-a-research-tool" {...ch} media={{ type: "image", src: "/articles/design-as-research-tool-thumb.png" }} />
                <Card title="Meet the stranger challenge" meta="Experiment · Connection" href="https://www.linkedin.com/feed/update/urn:li:activity:7404207024164683776/" isExternal {...ch} media={{ type: "image", src: "/articles/meet-stranger-calendly.png" }} />
                <Card title="Thinking frameworks" meta="Models · /reflect" href="/think" {...ch} media={{ type: "concept", gradient: "linear-gradient(135deg,#fafafa 0%,#efefef 100%)", label: "Mental models for understanding how people think — analysis-synthesis, 2×2 quadrant, double diamond." }} />

                <GroupLabel label="others = AI" />
                <Card title="Physical AI" meta="Research · Embodied data" href="/physical-ai" slug="physical-ai" {...ch} media={{ type: "image", src: "/articles/physical-ai-thumb.png", thumbnailSize: "medium" }} />
                <Card title="Proactive" meta="Prototype · Anticipation" href="/proactive" slug="proactive" {...ch} media={{ type: "image", src: "/articles/proactive-thumb.svg", thumbnailSize: "small" }} />
                <Card title="Personalization" meta="Research · What makes a person" href="/personalization" slug="personalization" {...ch} media={{ type: "image", src: "/articles/personalization-thumb.svg", thumbnailSize: "xs" }} />
                <Card title="Designing Next-Gen AI Products" meta="Article · AI UX" href="/designing-next-gen-ai-products" slug="designing-next-gen-ai-products" {...ch} media={{ type: "image", src: "/articles/trust-thumb.png", thumbnailSize: "small" }} />
              </div>
            </section>

            <div className="mx-6 border-t border-neutral-100" />

            {/* ── 03 What others say ── */}
            <section id="others-say" className="px-6 pt-8 pb-12 scroll-mt-24">
              <div className="flex justify-end mb-5">
                <a href="/listen" className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors">Listen →</a>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <GroupLabel label="others = human" />
                <Card title="Hello Humans" meta="Non-software · Analog" href="/hello-humans" {...ch} media={{ type: "image", src: "/articles/hello-humans-notebook.jpg" }} />
                <Card title="Voices that shaped how I think" meta="Interactive graph · /listen" href="/listen" {...ch} media={{ type: "concept", gradient: "linear-gradient(135deg,#18181b 0%,#27272a 100%)", label: "Find joy in the work. Inspire and be inspired. Hold your urge to solve." }} />

                <GroupLabel label="others = AI" />
                <Card title="A2UI — Generative UI" meta="Prototype · AI response as interface" href="/a2ui-generative" slug="a2ui-generative" {...ch} media={{ type: "image", src: "/articles/a2ui-thumb.svg", thumbnailSize: "small" }} />
                <Card title="Google Cloud — Conversational AI" meta="Prototype · 0→1" href="/google-cloud" slug="google-cloud" {...ch} media={{ type: "image", src: "/articles/google-cloud-thumb.png" }} />
                <Card title="Conversations that earn trust" meta="Research · Conversation design" href="/designing-for-conversations-that-earn-trust" slug="designing-for-conversations-that-earn-trust" {...ch} media={{ type: "image", src: "/articles/trust-thumb.png", thumbnailSize: "small" }} />
              </div>
            </section>

            <div className="mx-6 border-t border-neutral-100" />

            {/* ── 04 I interpret ── */}
            <section id="i-interpret" className="px-6 pt-8 pb-12 scroll-mt-24">
              <div className="grid grid-cols-2 gap-5">
                <Card title="AIOS — seeing your own blindspots" meta="Prototype · Self-reflection" badge="in progress" {...ch} media={{ type: "concept", icon: "◎", label: "A personal OS for mapping what I know, don't know, and don't know I don't know.", gradient: "linear-gradient(135deg,#f0f0f0 0%,#e2e2e2 100%)" }} />
                <Card title="AI-supported journaling" meta="Concept · Self-understanding" badge="coming soon" {...ch} media={{ type: "concept", gradient: "linear-gradient(135deg,#f5f5f0 0%,#e8e8e0 100%)", label: "Using AI to surface patterns in how I interpret the world and what I actually want." }} />
                <Card title="Reflection frameworks" meta="Models · /reflect" href="/think" {...ch} media={{ type: "concept", gradient: "linear-gradient(135deg,#f0f4ff 0%,#e4eaff 100%)", label: "The mental models I use to interpret what I experience — quadrants, bridges, blueprints." }} />
              </div>
            </section>

            <div className="px-6 pb-10 pt-4 text-center text-xs text-neutral-400">© 2026 — sketched with fountain pen & paper</div>
          </div>
        </div>
      </div>

      <div ref={footerSpacerRef} className="h-screen" />
    </div>
  );
}
