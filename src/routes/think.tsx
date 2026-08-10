import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "./-SiteNav";

export const Route = createFileRoute("/think")({
  head: () => ({
    meta: [
      { title: "Qiyu x AI interaction" },
      {
        name: "description",
        content: "Mental models, thinking frameworks, and written reflections on design and prototyping.",
      },
    ],
  }),
  component: ThinkComponent,
});

function ThinkComponent() {
  const [quadrantOpen, setQuadrantOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background text-neutral-900">
      <SiteNav active="reflect" />

      {/* Frameworks section */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-12">
        <h2 className="text-2xl font-medium mb-8 text-neutral-900">Frameworks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Analysis-synthesis bridge */}
          <a
            href="https://www.dubberly.com/articles/interactions-the-analysis-synthesis-bridge-model.html"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-neutral-200 p-6 bg-white hover:shadow-lg transition-shadow block group"
          >
            <div className="mb-6">
              <svg viewBox="0 0 80 50" fill="none" className="w-24 h-auto opacity-75">
                <circle cx="16" cy="12" r="3" fill="#1a1a1a"/>
                <circle cx="64" cy="12" r="3" fill="#1a1a1a"/>
                <circle cx="16" cy="38" r="3" fill="#1a1a1a"/>
                <circle cx="64" cy="38" r="3" fill="#1a1a1a"/>
                <line x1="19" y1="12" x2="61" y2="12" stroke="#1a1a1a" strokeWidth="1" strokeDasharray="3 2"/>
                <line x1="19" y1="38" x2="61" y2="38" stroke="#1a1a1a" strokeWidth="1" strokeDasharray="3 2"/>
                <line x1="16" y1="15" x2="16" y2="35" stroke="#1a1a1a" strokeWidth="1" strokeDasharray="3 2"/>
                <line x1="64" y1="15" x2="64" y2="35" stroke="#1a1a1a" strokeWidth="1" strokeDasharray="3 2"/>
              </svg>
            </div>
            <h3 className="font-medium text-lg text-neutral-900 mb-2 ">Analysis-synthesis bridge</h3>
            <p className="text-neutral-600 text-sm">The best model by Hugh Dubberly! It has been helping me intentionally practice "thinking outside the box" the mindset</p>
          </a>

          {/* Me × Others × Think × Do */}
          <button
            onClick={() => setQuadrantOpen(true)}
            className="rounded-2xl border border-neutral-200 p-6 bg-white hover:shadow-lg transition-shadow text-left group"
          >
            <div className="mb-6">
              <svg viewBox="0 0 80 50" fill="none" className="w-24 h-auto opacity-75">
                <line x1="40" y1="0" x2="40" y2="50" stroke="#e5e5e5" strokeWidth="1"/>
                <line x1="0" y1="25" x2="80" y2="25" stroke="#e5e5e5" strokeWidth="1"/>
                <circle cx="40" cy="8" r="3" fill="#1a1a1a"/>
                <circle cx="8" cy="25" r="3" fill="#1a1a1a"/>
                <circle cx="72" cy="25" r="3" fill="#1a1a1a"/>
                <circle cx="40" cy="42" r="3" fill="#1a1a1a"/>
              </svg>
            </div>
            <h3 className="font-medium text-lg text-neutral-900 mb-2 ">Me · Others · Think · Do</h3>
            <p className="text-neutral-600 text-sm">2×2 is just a cool way to map out the situations and help me see my own "unknown-unkonwn"s</p>
          </button>

          {/* Double diamond */}
          <div className="rounded-2xl border border-neutral-200 p-6 bg-white hover:shadow-lg transition-shadow">
            <div className="mb-6">
              <svg viewBox="0 0 80 50" fill="none" className="w-24 h-auto opacity-75">
                <polygon points="4,25 22,8 40,25 22,42" stroke="#1a1a1a" strokeWidth="1" fill="none"/>
                <polygon points="40,25 58,8 76,25 58,42" stroke="#1a1a1a" strokeWidth="1" fill="none"/>
                <circle cx="4" cy="25" r="3" fill="#1a1a1a"/>
                <circle cx="40" cy="25" r="3" fill="#1a1a1a"/>
                <circle cx="76" cy="25" r="3" fill="#1a1a1a"/>
              </svg>
            </div>
            <h3 className="font-medium text-lg text-neutral-900 mb-2">Double diamond</h3>
            <p className="text-neutral-600 text-sm">The designer thinking day 1 model. Ya I hear sometimes it could be "too theoretical", but at least it let us know where we are making a leap of faith while we have to.</p>
          </div>

          {/* Service blueprint */}
          <div className="rounded-2xl border border-neutral-200 p-6 bg-white hover:shadow-lg transition-shadow">
            <div className="mb-6">
              <svg viewBox="0 0 80 50" fill="none" className="w-24 h-auto opacity-75">
                <line x1="4" y1="10" x2="76" y2="10" stroke="#e5e5e5" strokeWidth="1"/>
                <line x1="4" y1="25" x2="76" y2="25" stroke="#e5e5e5" strokeWidth="1"/>
                <line x1="4" y1="40" x2="76" y2="40" stroke="#e5e5e5" strokeWidth="1"/>
                <line x1="14" y1="10" x2="40" y2="10" stroke="#1a1a1a" strokeWidth="1"/>
                <line x1="40" y1="10" x2="64" y2="10" stroke="#1a1a1a" strokeWidth="1"/>
                <line x1="22" y1="25" x2="54" y2="25" stroke="#1a1a1a" strokeWidth="1"/>
                <line x1="14" y1="40" x2="40" y2="40" stroke="#1a1a1a" strokeWidth="1"/>
                <line x1="40" y1="40" x2="64" y2="40" stroke="#1a1a1a" strokeWidth="1"/>
                <line x1="40" y1="13" x2="22" y2="22" stroke="#1a1a1a" strokeWidth="1" strokeDasharray="2 2"/>
                <line x1="54" y1="28" x2="40" y2="37" stroke="#1a1a1a" strokeWidth="1" strokeDasharray="2 2"/>
                <circle cx="14" cy="10" r="3" fill="#1a1a1a"/>
                <circle cx="40" cy="10" r="3" fill="#1a1a1a"/>
                <circle cx="64" cy="10" r="3" fill="#1a1a1a"/>
                <circle cx="22" cy="25" r="3" fill="#1a1a1a"/>
                <circle cx="54" cy="25" r="3" fill="#1a1a1a"/>
                <circle cx="14" cy="40" r="3" fill="#1a1a1a"/>
                <circle cx="40" cy="40" r="3" fill="#1a1a1a"/>
                <circle cx="64" cy="40" r="3" fill="#1a1a1a"/>
              </svg>
            </div>
            <h3 className="font-medium text-lg text-neutral-900 mb-2">Service blueprint</h3>
            <p className="text-neutral-600 text-sm">What are all the stakeholders, what do they do, and how are their actions related to each other. Layer by layer, step by step. Great for service design.</p>
          </div>

        </div>
      </section>

      {/* Blog/Writing section */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-2xl font-medium mb-8 text-neutral-900">Reflections</h2>
        <div className="space-y-4">
          {[
            {
              title: "What do prototypes prototype?",
              excerpt: "A reflection on what we're actually testing when we prototype.",
              date: "Apr 2026",
              readTime: "8 min",
              href: "/what-do-prototypes-prototype",
            },
            {
              title: "Making design fun",
              excerpt: "On curiosity, vibe-coding, and why creation should feel like play.",
              date: "Apr 2026",
              readTime: "5 min",
              href: "/making-design-fun",
            },
            {
              title: "Designing Next-Gen AI Products",
              excerpt: "Mapping UX to capability. Lessons from conversational AI and human-AI co-writing.",
              date: "Apr 2026",
              readTime: "8 min",
              href: "/designing-next-gen-ai-products",
            },
            {
              title: "How I use AI to create",
              excerpt: "Prototyping as research, and why AI should augment—not replace—thinking.",
              date: "Apr 2026",
              readTime: "5 min",
              href: null,
            },
            {
              title: "Cheap edges, expensive corners",
              excerpt: "Where quality actually accrues in an interface.",
              date: "Apr 2026",
              readTime: "5 min",
              href: null,
            },
          ].map((article) => article.href ? (
            <a
              key={article.title}
              href={article.href}
              className="block rounded-lg border border-neutral-200 p-4 hover:border-neutral-400 hover:bg-neutral-50 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-neutral-900">{article.title}</h3>
                  <p className="mt-1 text-sm text-neutral-600">{article.excerpt}</p>
                  <div className="mt-2 flex gap-2 text-xs text-neutral-500">
                    <span>{article.date}</span>
                    <span>·</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
                <span className="text-neutral-400">→</span>
              </div>
            </a>
          ) : (
            <div
              key={article.title}
              className="block rounded-lg border border-neutral-100 p-4 opacity-40 cursor-default"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-neutral-900">{article.title}</h3>
                  <p className="mt-1 text-sm text-neutral-600">{article.excerpt}</p>
                  <div className="mt-2 flex gap-2 text-xs text-neutral-500">
                    <span>{article.date}</span>
                    <span>·</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
                <span className="text-[10px] text-neutral-400 mt-1">soon</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Me × Others × Think × Do modal */}
      {quadrantOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
          onClick={() => setQuadrantOpen(false)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQuadrantOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 transition-colors text-lg leading-none"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold text-neutral-900 mb-1">Me · Others · Think · Do</h2>
            <p className="text-sm text-neutral-500 mb-2">A lens for mapping perspective and agency in any situation.</p>
            <p className="text-xs text-neutral-400 mb-8">This is also how I created the 4 tabs for this site: <span className="font-medium text-neutral-600">Work · Play · Think · Listen</span> — me doing, others doing, me reflecting, others reflecting.</p>

            <div className="grid grid-cols-2 gap-px bg-neutral-200 rounded-xl overflow-hidden">
              {/* Think / Me */}
              <div className="bg-white p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-3 w-3 rounded-full bg-neutral-900 mt-0.5 shrink-0" />
                  <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">Me · Think</span>
                </div>
                <p className="text-sm text-neutral-700">My beliefs, assumptions, mental models, and internal narratives about the situation.</p>
              </div>
              {/* Think / Others */}
              <div className="bg-white p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-3 w-3 rounded-full bg-neutral-900 mt-0.5 shrink-0" />
                  <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">Others · Think</span>
                </div>
                <p className="text-sm text-neutral-700">What others believe, perceive, or assume — often invisible until you look for it.</p>
              </div>
              {/* Do / Me */}
              <div className="bg-white p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-3 w-3 rounded-full bg-neutral-900 mt-0.5 shrink-0" />
                  <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">Me · Do</span>
                </div>
                <p className="text-sm text-neutral-700">My actions, behaviors, and choices — what I actually control in the situation.</p>
              </div>
              {/* Do / Others */}
              <div className="bg-white p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-3 w-3 rounded-full bg-neutral-900 mt-0.5 shrink-0" />
                  <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">Others · Do</span>
                </div>
                <p className="text-sm text-neutral-700">Others' observable behaviors — what they actually do versus what they say they think.</p>
              </div>
            </div>

            <p className="mt-6 text-xs text-neutral-400">Use this to spot where your assumptions about others' thinking diverge from their actual behavior — that gap is often where design problems hide.</p>
          </div>
        </div>
      )}
    </div>
  );
}
