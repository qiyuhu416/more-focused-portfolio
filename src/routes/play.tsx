import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { SiteNav } from "./-SiteNav";
import { CardIcon } from "./-CardIcon";
import { HELLO_HUMANS } from "./helloHumansData";

interface PlacedImage { id: number; src: string; x: number; y: number; }
interface DragState { id: number; offsetX: number; offsetY: number; }

const PLAY_IMAGES = [
  "/articles/play-1.png",
  "/articles/play-2.png",
  "/articles/play-3.png",
  "/articles/play-5.png",
];

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { title: "Qiyu x AI interaction" },
      {
        name: "description",
        content: "Vibe-coding projects, playful experiments, and creative explorations.",
      },
    ],
  }),
  component: PlayComponent,
});

const EVENT_IMAGES = [
  "/articles/event-19.png",
  "/articles/event-20.png",
  "/articles/event-21.png",
  "/articles/event-22.png",
  "/articles/event-23.png",
];

function EventModal({ onClose }: { onClose: () => void }) {
  const [activeIdx, setActiveIdx] = useState(0);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ cursor: "auto" }} onClick={onClose}>
      <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors">✕</button>
        <div className="p-6 pb-4">
          <h2 className="text-xl font-semibold text-neutral-900 mb-1">Hosting events @Apple</h2>
          <p className="text-sm text-neutral-500 mb-4">5 events · Oct 2025 – May 2026</p>
          <p className="text-sm text-neutral-700 leading-relaxed mb-6">
            You can kind of tell how my mindset shifted over a year. It started when the AI hype was still peaking—I was one of the first few people on my team using Claude Code, so I hosted a vibe coding meetup to share it. Then came a more sceptical phase: where should we actually <em>not</em> use AI? And by the end I just wanted to have fun—show and tell, lunch chats, no agenda. The whole arc in five events.
          </p>
        </div>

        {/* Image viewer */}
        <div className="px-6 pb-4">
          <img
            src={EVENT_IMAGES[activeIdx]}
            alt={`Event ${activeIdx + 1}`}
            className="w-full rounded-xl border border-neutral-200 object-contain"
          />
        </div>

        {/* Thumbnails */}
        <div className="px-6 pb-6 flex gap-2 overflow-x-auto">
          {EVENT_IMAGES.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${activeIdx === i ? "border-neutral-900" : "border-transparent"}`}
            >
              <img src={src} alt={`Event ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const WAND_CURSOR = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"56\" height=\"56\" viewBox=\"0 0 56 56\"><text y=\"48\" font-size=\"46\">🪄</text></svg>') 0 56, auto";

function PlayComponent() {
  const [placed, setPlaced] = useState<PlacedImage[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [nextIdx, setNextIdx] = useState(1);
  const [drag, setDrag] = useState<DragState | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPlaced([{ id: 0, src: PLAY_IMAGES[0], x: window.innerWidth / 2 - 70, y: 90 }]);
  }, []);

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setPlaced(prev => [...prev, {
      id: Date.now(),
      src: PLAY_IMAGES[nextIdx % PLAY_IMAGES.length],
      x: e.pageX - 60,
      y: e.pageY - 60,
    }]);
    setNextIdx(i => i + 1);
  };

  const startDrag = (e: React.PointerEvent<HTMLImageElement>, id: number) => {
    e.stopPropagation();
    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();
    setDrag({ id, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top });
    img.setPointerCapture(e.pointerId);
  };

  const onDragMove = (e: React.PointerEvent<HTMLImageElement>, id: number) => {
    if (!drag || drag.id !== id) return;
    setPlaced(prev => prev.map(p =>
      p.id === id ? { ...p, x: e.pageX - drag.offsetX, y: e.pageY - drag.offsetY } : p
    ));
  };

  const renderCard = (project: any) => {
    const Wrapper = project.onCardClick ? "button" : "a";
    const wrapperProps = project.onCardClick
      ? { onClick: project.onCardClick, type: "button" as const }
      : { href: project.external ? project.external : `/${project.slug}`, target: project.external ? "_blank" : undefined, rel: project.external ? "noopener noreferrer" : undefined };
    return (
    <Wrapper
      key={project.slug || project.title}
      {...(wrapperProps as any)}
      className="group relative rounded-2xl bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] block text-left w-full"
      onMouseEnter={(e: React.MouseEvent<HTMLElement>) => { const v = e.currentTarget.querySelector('video'); if (v) { v.currentTime = 0; v.play(); } }}
      onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { const v = e.currentTarget.querySelector('video'); if (v) { v.pause(); v.currentTime = 0; } }}
    >
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-white">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className={project.thumbnailSize === "small" ? "w-16 h-16 object-contain" : project.thumbnailSize === "medium" ? "w-80 h-80 object-contain" : "h-full w-full object-cover"}
          />
        ) : project.videoPreview ? (
          <video src={`${project.videoPreview}#t=${project.videoStartTime ?? 0.001}`} preload="metadata" muted loop className="h-full w-full object-cover" />
        ) : (
          <span className="text-xs uppercase tracking-[0.2em] text-neutral-400">
            {project.category}
          </span>
        )}
        <CardIcon hasVideo={!!project.videoPreview} />
      </div>
      <div className="flex items-start justify-between gap-4 px-2 pb-2 pt-4">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <span>{project.category}</span>
            <span>·</span>
            <span>{project.meta}</span>
          </div>
          <h3 className="mt-1 text-[15px] font-medium text-neutral-900">
            {project.title}
          </h3>
        </div>
      </div>
    </Wrapper>
    );
  };

  return (
    <div
      className="relative min-h-screen bg-background text-neutral-900"
      onClick={handlePageClick}
      style={{ cursor: WAND_CURSOR }}
    >
      {showEventModal && <EventModal onClose={() => setShowEventModal(false)} />}
      {/* Fixed floating images */}
      {placed.map((img) => (
        <img
          key={img.id}
          src={img.src}
          alt=""
          draggable={false}
          onPointerDown={(e) => startDrag(e, img.id)}
          onPointerMove={(e) => onDragMove(e, img.id)}
          onPointerUp={() => setDrag(null)}
          onClick={(e) => e.stopPropagation()}
              className="absolute select-none"
          style={{
            left: img.x,
            top: img.y,
            maxHeight: "160px",
            width: "auto",
            zIndex: 0,
            cursor: drag?.id === img.id ? "grabbing" : "grab",
            userSelect: "none",
            touchAction: "none",
          }}
        />
      ))}
      <SiteNav
        active="play"
        headerProps={{ onClick: (e) => e.stopPropagation(), style: { cursor: "auto" } }}
      />

      {/* Hero space */}
      <div ref={boardRef} className="w-full" style={{ minHeight: "50vh" }} />

      {/* Human-Human Interaction Prototypes */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24" onClick={(e) => e.stopPropagation()} style={{ cursor: "auto" }}>
        <div className="mb-12">
          <h2 className="text-2xl font-medium text-neutral-900 mb-2">Human-human interaction prototypes</h2>
          <p className="text-neutral-600 text-sm">Actually, humans are more interesting</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              title: HELLO_HUMANS.title,
              description: HELLO_HUMANS.description,
              category: HELLO_HUMANS.category,
              meta: HELLO_HUMANS.meta,
              image: HELLO_HUMANS.image,
            },
            {
              title: "Meet the stranger challenge",
              description: "A simple post with a Calendly link: 'Hi all, I'm running a small experiment.' No agenda, just conversation. A real-time experiment in how people connect.",
              category: "Experiment",
              meta: "Connection · Open-ended",
              image: "/articles/meet-stranger-calendly.png",
              thumbnailSize: "medium",
              external: "https://www.linkedin.com/feed/update/urn:li:activity:7404207024164683776/",
            },
            {
              title: "Hosting events @Apple",
              description: "A year of gatherings—from vibe coding to questioning AI to just having fun. 5 events, 1 mental shift.",
              category: "Event",
              meta: "Community · IRL",
              image: "/articles/events-thumb.svg",
              thumbnailSize: "small",
              onCardClick: () => setShowEventModal(true),
            },
          ].map((project) => renderCard(project))}
        </div>
      </section>

      {/* Qiyu-Technology Interaction */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24" onClick={(e) => e.stopPropagation()} style={{ cursor: "auto" }}>
        <div className="mb-12">
          <h2 className="text-2xl font-medium text-neutral-900 mb-2">Qiyu–technology interaction</h2>
          <p className="text-neutral-600 text-sm">Vibe-coding projects and creative explorations with code and tools</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              title: "Birthday card",
              description: "A small moment of delight. The joy is in the details, the unexpected animation, the gesture that makes you smile.",
              slug: "birthday-card",
              category: "Vibe-coding",
              meta: "Motion · Delight",
              videoPreview: "/articles/birthday-card.mp4",
              videoStartTime: 1,
            },
            {
              title: "Hand gesture interactions",
              description: "Exploring how gestures can make technology feel natural and embodied.",
              slug: "hand-gesture-interactions",
              category: "Vibe-coding",
              meta: "Gesture · Motion",
              videoPreview: "/articles/hand-gesture.mp4",
            },
            {
              title: "Palo Alto moment",
              description: "A location-based concept. What happens when design meets place?",
              slug: "palo-alto-moment",
              category: "Vibe-coding",
              meta: "Context · Place",
              videoPreview: "/articles/palo-alto.mp4",
            },
            {
              title: "Voice interaction",
              description: "Beyond screens. Exploring how voice can become an interface—natural, conversational, human.",
              slug: "voice-interaction",
              category: "Vibe-coding",
              meta: "Voice · AI",
              videoPreview: "/articles/voice.mp4",
            },
          ].map((project) => renderCard(project))}
        </div>
      </section>
    </div>
  );
}
