import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect, type ReactNode } from "react";
import { CardIcon } from "./-CardIcon";
import { ARTICLE_META } from "./-articleMeta";
import { NAV_ITEMS, navHref } from "./-navItems";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Qiyu — Human Interaction" },
      {
        name: "description",
        content:
          "Prototypes and explorations at the edges of human interaction — what gets expressed, what gets lost, what gets understood.",
      },
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

// ── Section tabs data ──────────────────────────────────────────────────────

const SECTION_TABS = [
  { id: "expression",     label: "Expression"     },
  { id: "self-knowledge", label: "Self-knowledge" },
  { id: "interpretation", label: "Interpretation" },
  { id: "listening",      label: "Listening"      },
] as const;

// ── Music player ──────────────────────────────────────────────────────────

function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const seekTo = 43;
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) { el.pause(); }
    else {
      if (el.currentTime < seekTo - 1 || el.currentTime > seekTo + 3) el.currentTime = seekTo;
      el.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onEnd = () => setPlaying(false);
    el.addEventListener("ended", onEnd);
    return () => el.removeEventListener("ended", onEnd);
  }, []);

  return (
    <div className="mt-8 flex items-center gap-3 flex-wrap">
      <audio ref={audioRef} src="/baby-salt.mp3" preload="none" />
      <button
        onClick={toggle}
        className="flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95"
      >
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
      label: "Recruiter",
      salutation: "Dear recruiter,",
      body: (
        <>
          <p>I have an interdisciplinary background — design, engineering, research, a bit of philosophy — and I've stopped apologizing for not fitting neatly into one lane. You can use me as a design engineer. I can prototype, write code, run user research, and translate between technical and design teams.</p>
          <p>But honestly? The best way to use me is to hand me a messy, unsolved problem and ask what we should even be building. That's where I come alive — not executing a pre-defined spec, but questioning whether we have the right spec in the first place.</p>
          <p>I think a lot about innovation. Not the word, but the actual practice of it — how you create conditions for genuinely new things to emerge. If your team is figuring out what to build next, rather than just how to build it, I'd love to talk.</p>
        </>
      ),
      cta: (
        <a href="https://www.linkedin.com/in/qiyu-hu/" target="_blank" rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm text-white/70 transition-all hover:border-white/60 hover:text-white">
          LinkedIn →
        </a>
      ),
    },
    dating: {
      label: "Dating someone?",
      salutation: "Dear you,",
      body: (
        <>
          <p>I genuinely appreciate the effort you put into tracking me down. Internet research is a skill. That's a good sign.</p>
          <p>Fair warning though: digital me is a portfolio. Real me has strong opinions about menus, theories about why people choose the places they choose, and a tendency to ask follow-up questions at dinner. Which is either charming or a lot, depending on who you ask.</p>
          <p>The most efficient next step is just to meet. Not another tab, not another scroll. Hit the button, pick a time. I'm genuinely better in person, and I'll make it worth the experiment.</p>
        </>
      ),
      cta: (
        <a href="https://calendly.com/huqiyu416" target="_blank" rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm text-neutral-900 transition-all hover:bg-neutral-100">
          Book a time →
        </a>
      ),
    },
    "future-self": {
      label: "Future me",
      salutation: "Dear future me,",
      body: (
        <>
          <p>I'm really proud of you.</p>
          <p>Not for the things you built, or the titles, or the places you worked. For staying curious — about yourself, about this world, and about the strange and surprising connections between the two. A lot of people stop doing that.</p>
          <p>You kept asking questions when it would've been easier to just have the answer. Keep going.</p>
        </>
      ),
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
              className={["rounded-full px-4 py-1.5 text-sm transition-all",
                mode === key ? "bg-white text-neutral-900" : "border border-white/15 text-white/50 hover:border-white/40 hover:text-white/80",
              ].join(" ")}>
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

function TwoCirclesDiagram() {
  const [hovered, setHovered] = useState<string | null>(null);

  const pathStyle = (id: string) => ({
    stroke: hovered === id ? "#404040" : hovered ? "#d4d4d4" : "#a3a3a3",
    strokeWidth: hovered === id ? 2 : 1.5,
    transition: "stroke 180ms, stroke-width 180ms",
  });
  const textStyle = (id: string): React.CSSProperties => ({
    fill: hovered === id ? "#404040" : hovered ? "#d4d4d4" : "#a3a3a3",
    transition: "fill 180ms",
  });
  const seg = (id: string, children: ReactNode) => (
    <g onMouseEnter={() => setHovered(id)} onMouseLeave={() => setHovered(null)} style={{ cursor: "default" }}>
      {children}
    </g>
  );

  return (
    <svg viewBox="0 0 640 230" fill="none" className="w-full max-w-2xl" style={{ overflow: "visible" }}>
      <defs>
        <marker id="arr" markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto">
          <polygon points="0 0, 7 3, 0 6" fill={hovered ? "#d4d4d4" : "#a3a3a3"} />
        </marker>
        <marker id="arr-h" markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto">
          <polygon points="0 0, 7 3, 0 6" fill="#404040" />
        </marker>
      </defs>
      <circle cx="110" cy="115" r="50" stroke={hovered ? "#d4d4d4" : "#737373"} strokeWidth="1.5" style={{ transition: "stroke 180ms" }} />
      <text x="110" y="119" textAnchor="middle" fontSize="13" fontWeight="500" fill={hovered ? "#d4d4d4" : "#404040"} style={{ transition: "fill 180ms" }}>me</text>
      <circle cx="530" cy="115" r="50" stroke={hovered ? "#d4d4d4" : "#737373"} strokeWidth="1.5" style={{ transition: "stroke 180ms" }} />
      <text x="530" y="119" textAnchor="middle" fontSize="13" fontWeight="500" fill={hovered ? "#d4d4d4" : "#404040"} style={{ transition: "fill 180ms" }}>others</text>
      {seg("behave", <>
        <path d="M 155 98 Q 320 52 485 98" {...pathStyle("behave")} markerEnd={hovered === "behave" ? "url(#arr-h)" : "url(#arr)"} />
        <text x="320" y="44" textAnchor="middle" fontSize="11" style={textStyle("behave")}>how I express / behave</text>
      </>)}
      {seg("others-interpret", <>
        <path d="M 485 98 Q 572 115 485 132" {...pathStyle("others-interpret")} strokeDasharray="5 3" />
        <text x="584" y="109" textAnchor="start" fontSize="10" style={textStyle("others-interpret")}>how others</text>
        <text x="584" y="122" textAnchor="start" fontSize="10" style={textStyle("others-interpret")}>interpret</text>
      </>)}
      {seg("others-say", <>
        <path d="M 485 132 Q 320 178 155 132" {...pathStyle("others-say")} markerEnd={hovered === "others-say" ? "url(#arr-h)" : "url(#arr)"} />
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

// ── Unified page header (scroll-transition nav + section tabs) ─────────────

function WorkPageHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 320);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTION_TABS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.25, rootMargin: "-80px 0px -35% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToSection = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-neutral-200/50 transition-all duration-300">
      {/* Row 1: main nav */}
      <div className="mx-auto max-w-6xl px-6">
        <div className={`flex items-center gap-4 transition-all duration-300 ${scrolled ? "py-2.5" : "py-4"}`}>

          {/* Badge — fades when scrolled */}
          <div className={`flex-1 transition-all duration-300 ${scrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
            <Link
              to="/what-do-prototypes-prototype"
              className="hidden md:inline-flex group relative items-center gap-2 rounded-full bg-white px-3 py-1 text-xs text-neutral-600 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:bg-neutral-900 hover:text-white transition-all overflow-hidden whitespace-nowrap"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="transition-all duration-300 group-hover:-translate-x-4 group-hover:opacity-0">currently AI prototyper @Apple</span>
              <span className="absolute left-6 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">What do prototypes prototype?</span>
            </Link>
          </div>

          {/* Page nav pills */}
          <nav className="flex items-center gap-1 rounded-full border border-neutral-200 bg-white p-1 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            {NAV_ITEMS.map((l) => (
              <Link key={l} to={navHref(l)}
                className={["rounded-full px-4 py-1.5 text-sm transition-colors",
                  l === "work" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:text-neutral-900",
                ].join(" ")}>
                {l}
              </Link>
            ))}
          </nav>

          {/* Qiyu — fades when scrolled */}
          <div className={`flex-1 flex justify-end transition-all duration-300 ${scrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
            <Link to="/" className="hidden md:block text-sm font-medium text-neutral-900">Qiyu</Link>
          </div>
        </div>
      </div>

      {/* Row 2: section tabs — slides in on scroll */}
      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: scrolled ? "52px" : "0px", opacity: scrolled ? 1 : 0 }}
      >
        <div className="border-t border-neutral-100 mx-auto max-w-6xl px-6">
          <div className="flex gap-1 py-2.5 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
            {SECTION_TABS.map(({ id, label }) => (
              <button key={id} onClick={() => scrollToSection(id)}
                className={["rounded-full px-4 py-1.5 text-sm whitespace-nowrap transition-all",
                  activeSection === id ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100",
                ].join(" ")}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
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
  // Original card size: ~340px wide, matching the old 3-column grid proportions
  const cls = "group relative rounded-2xl bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] block w-[340px] shrink-0 snap-start";

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
      {badge && (
        <span className="absolute top-5 right-5 z-10 rounded-full bg-neutral-900/80 px-2.5 py-1 text-[10px] uppercase tracking-wide text-white backdrop-blur-sm">
          {badge}
        </span>
      )}
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-white">
        {media.type === "video" && (
          <video src={`${media.src}#t=0.001`} preload="metadata" muted loop playsInline
            className="h-full w-full object-cover"
            style={media.transform ? { transform: media.transform } : undefined} />
        )}
        {media.type === "image" && (
          <img src={media.src} alt={title}
            className={`h-full w-full ${media.fit === "contain" ? "object-contain p-6" : "object-cover"}`} />
        )}
        {media.type === "concept" && (
          <div className="h-full w-full flex flex-col items-center justify-center gap-3 px-8 py-6"
            style={{ background: media.gradient ?? "linear-gradient(135deg,#f5f5f5 0%,#e8e8e8 100%)" }}>
            {media.icon && <span className="text-3xl">{media.icon}</span>}
            {media.label && <p className="text-xs text-neutral-500 text-center leading-relaxed">{media.label}</p>}
          </div>
        )}
        <CardIcon hasVideo={isVideo} />
      </div>
      <div className="flex items-start gap-4 px-2 pb-2 pt-4">
        <div className="min-w-0">
          <p className="text-xs text-neutral-500">{meta}</p>
          <h3 className="mt-1 text-[15px] font-medium text-neutral-900 leading-snug">{title}</h3>
        </div>
      </div>
    </>
  );

  if (!href) return <div className={cls} {...handlers}>{inner}</div>;
  return (
    <a href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined}
      className={cls} {...handlers}>{inner}</a>
  );
}

// ── Carousel section (Apple-style: indented start, overflow right) ─────────

function CarouselSection({
  sectionId, title, question, seeAllHref, seeAllLabel, children,
}: {
  sectionId: string; title: string; question: string;
  seeAllHref?: string; seeAllLabel?: string; children: ReactNode;
}) {
  return (
    <section id={sectionId} className="py-12 scroll-mt-24 bg-background">
      {/* Header — constrained to content column, left-aligned */}
      <div className="mx-auto max-w-6xl px-6 mb-7">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-[22px] font-semibold text-neutral-900 leading-tight">{title}</h2>
            <p className="mt-1.5 text-sm text-neutral-500 max-w-md leading-relaxed">{question}</p>
          </div>
          {seeAllHref && (
            <a href={seeAllHref} className="shrink-0 mt-0.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors whitespace-nowrap">
              {seeAllLabel ?? "See all"} →
            </a>
          )}
        </div>
      </div>

      {/* Carousel — starts at the same left edge as the title, overflows right */}
      <div
        className="overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
        style={{
          scrollbarWidth: "none",
          paddingLeft: "max(1.5rem, calc((100vw - 72rem) / 2 + 1.5rem))",
        }}
      >
        <div className="flex gap-5 w-max pb-4 pr-6">
          {children}
        </div>
      </div>
    </section>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────

function Divider() {
  return <div className="mx-auto max-w-6xl px-6"><div className="border-t border-neutral-100" /></div>;
}

// ── Main ──────────────────────────────────────────────────────────────────

function Index() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const hoveredSections = hoveredSlug ? (ARTICLE_META[hoveredSlug]?.sections ?? []) : [];
  const hoverKind = hoveredSlug && ARTICLE_META[hoveredSlug]?.sections ? "Article" : null;

  const cursorHandlers = {
    onHoverChange: setHoveredSlug,
    onMouseMove: (e: React.MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY }),
  };

  return (
    <div className="relative">
      {/* ── Cursor TOC tooltip ── */}
      {hoveredSlug && hoveredSections.length > 0 && (
        <div className="fixed z-50 pointer-events-none" style={{ left: cursorPos.x + 16, top: cursorPos.y + 16 }}>
          <div className="bg-neutral-900 text-white rounded-2xl px-5 py-4 shadow-xl max-w-[220px]">
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 font-semibold mb-3">{hoverKind}</p>
            <ul className="space-y-2">
              {hoveredSections.map((s, i) => <li key={i} className="text-[12px] font-semibold text-white leading-snug">{s}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* ── Dear footer: fixed behind, revealed as white content scrolls away ── */}
      <div className="fixed inset-0 z-0 bg-neutral-950">
        <DearFooter />
      </div>

      {/* ── Main white content: scrolls on top of Dear footer ── */}
      <div className="relative z-10 bg-background" style={{ boxShadow: "0 0 80px 20px rgba(0,0,0,0.18)" }}>
        <WorkPageHeader />

        {/* ── Framework: centered, distinct bg, highlighted landing section ── */}
        <section className="bg-neutral-50 py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="mb-3 text-[11px] uppercase tracking-[0.16em] text-neutral-400">the frame</p>
            <h2 className="mb-3 text-[26px] font-semibold text-neutral-900">
              Human interaction has four seams
            </h2>
            <p className="mb-12 text-sm text-neutral-500 leading-relaxed max-w-md mx-auto">
              Every exchange runs through them. Somewhere in each one, something gets lost.
              Everything I prototype lives at one of these four moments.
            </p>
            <div className="flex justify-center">
              <TwoCirclesDiagram />
            </div>
          </div>
        </section>

        <Divider />

        {/* ── 01 Expression ── */}
        <CarouselSection
          sectionId="expression"
          title="New ways to express"
          question="If interfaces weren't limited to text fields and submit buttons, how might humans convey presence, emotion, and intent?"
          seeAllHref="/play"
          seeAllLabel="See all explorations"
        >
          <Card title="Reimagining the chatbot" meta="Prototype · Collection" href="/reimagining-the-chatbot" slug="reimagining-the-chatbot" {...cursorHandlers} media={{ type: "image", src: "/articles/chatbot-thumb.png" }} />
          <Card title="Hand gesture interactions" meta="Vibe-coding · Embodied" href="/play" {...cursorHandlers} media={{ type: "video", src: "/articles/hand-gesture.mp4" }} />
          <Card title="Voice interaction" meta="Vibe-coding · Voice" href="/play" {...cursorHandlers} media={{ type: "video", src: "/articles/voice.mp4" }} />
          <Card title="Always here" meta="Chatbot · Presence" href="/reimagining-the-chatbot" {...cursorHandlers} media={{ type: "video", src: "/articles/chatbot-always-here.mp4", transform: "scale(2.2) translateX(-12%)" }} />
          <Card title="Hello Humans" meta="Non-software · Analog" href="/hello-humans" {...cursorHandlers} media={{ type: "image", src: "/articles/hello-humans-notebook.jpg" }} />
          <Card title="Physical AI" meta="Research · Embodied" href="/physical-ai" slug="physical-ai" {...cursorHandlers} media={{ type: "image", src: "/articles/physical-ai-thumb.png" }} />
        </CarouselSection>

        <Divider />

        {/* ── 02 Self-knowledge ── */}
        <CarouselSection
          sectionId="self-knowledge"
          title="Knowing your unknowns"
          question="How can technology help someone discover what they don't know — or that they don't know it?"
          seeAllHref="/think"
          seeAllLabel="See frameworks"
        >
          <Card title="AIOS — seeing your own blindspots" meta="Prototype · Self-reflection" badge="in progress" {...cursorHandlers}
            media={{ type: "concept", icon: "◎", label: "A tool to map the known, unknown, and unknown-unknown.", gradient: "linear-gradient(135deg,#f0f0f0 0%,#e2e2e2 100%)" }} />
          <Card title="Knowledge graph visualization" meta="Prototype · Reasoning" href="/reimagining-the-chatbot" {...cursorHandlers}
            media={{ type: "video", src: "/articles/chatbot-knowledge-graph.mp4", transform: "scale(2) translateY(20%)" }} />
          <Card title="Personalization" meta="Research · AI Philosophy" href="/personalization" slug="personalization" {...cursorHandlers} media={{ type: "image", src: "/articles/personalization-thumb.png" }} />
          <Card title="Me · Others · Think · Do" meta="Framework · Quadrant" href="/think" {...cursorHandlers}
            media={{ type: "concept", gradient: "linear-gradient(135deg,#fafafa 0%,#efefef 100%)", label: "A 2×2 for mapping where assumptions live versus where behavior happens." }} />
          <Card title="Design as a research tool" meta="Case study · Methods" href="/design-as-a-research-tool" slug="design-as-a-research-tool" {...cursorHandlers} media={{ type: "image", src: "/articles/design-as-research-tool-thumb.png" }} />
        </CarouselSection>

        <Divider />

        {/* ── 03 Interpretation gap ── */}
        <CarouselSection
          sectionId="interpretation"
          title="When meaning gets lost"
          question="The same message lands differently for everyone. How might design work with that gap instead of pretending it doesn't exist?"
        >
          <Card title="Designing for conversations that earn trust" meta="Research · Trust" href="/designing-for-conversations-that-earn-trust" slug="designing-for-conversations-that-earn-trust" {...cursorHandlers} media={{ type: "image", src: "/articles/trust-thumb.png" }} />
          <Card title="A2UI — Generative UI" meta="Prototype · Adaptive" href="/a2ui-generative" slug="a2ui-generative" {...cursorHandlers} media={{ type: "image", src: "/articles/a2ui-thumb.svg", fit: "contain" }} />
          <Card title="Designing Next-Gen AI Products" meta="Article · Design systems" href="/designing-next-gen-ai-products" slug="designing-next-gen-ai-products" {...cursorHandlers} media={{ type: "image", src: "/articles/trust-thumb.png" }} />
          <Card title="Proactive prototyping" meta="Prototype · Testing" href="/proactive" slug="proactive" {...cursorHandlers} media={{ type: "image", src: "/articles/proactive-thumb.png" }} />
          <Card title="Google Cloud — Conversational AI" meta="Prototype · 0→1" href="/google-cloud" slug="google-cloud" {...cursorHandlers} media={{ type: "image", src: "/articles/google-cloud-thumb.png" }} />
          <Card title="What do prototypes prototype?" meta="Article · Research method" href="/what-do-prototypes-prototype" slug="what-do-prototypes-prototype" {...cursorHandlers} media={{ type: "image", src: "/articles/prototype-triangle-thumb.svg", fit: "contain" }} />
        </CarouselSection>

        <Divider />

        {/* ── 04 Listening ── */}
        <CarouselSection
          sectionId="listening"
          title="What others bring"
          question="What happens when you create conditions for people to be genuinely honest about what they value — and you actually listen?"
          seeAllHref="/listen"
          seeAllLabel="Open the graph"
        >
          <Card title="Values from people who shaped how I think" meta="Interactive graph · /listen" href="/listen" {...cursorHandlers}
            media={{ type: "concept", gradient: "linear-gradient(135deg,#18181b 0%,#27272a 100%)", label: "Find joy in the work. Inspire and be inspired. Hold your urge to solve." }} />
          <Card title="Meet the stranger challenge" meta="Experiment · Connection" href="https://www.linkedin.com/feed/update/urn:li:activity:7404207024164683776/" isExternal {...cursorHandlers}
            media={{ type: "image", src: "/articles/meet-stranger-calendly.png" }} />
          <Card title="Hosting events @Apple" meta="Community · IRL" {...cursorHandlers}
            media={{ type: "concept", gradient: "linear-gradient(135deg,#f5f3ff 0%,#ede9fe 100%)", label: "5 events tracking a year of mental shifts — from vibe coding to questioning AI." }} />
        </CarouselSection>

        {/* Copyright */}
        <div className="mx-auto max-w-6xl px-6 pb-10 pt-4 text-center text-xs text-neutral-400">
          © 2026 — sketched with fountain pen & paper
        </div>
      </div>

      {/* ── Scroll spacer: transparent so Dear footer shows through ── */}
      <div className="h-screen" />
    </div>
  );
}
