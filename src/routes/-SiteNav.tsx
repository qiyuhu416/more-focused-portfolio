import { Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { NAV_ITEMS, navHref, type NavItem } from "./-navItems";

interface SiteNavProps {
  active: NavItem;
  theme?: "light" | "dark";
  headerProps?: React.HTMLAttributes<HTMLElement>;
}

const BADGE: Record<NavItem, string> = {
  work:    "currently AI prototyper @Apple",
  play:    "currently shipping half-baked prototypes",
  reflect: "currently questioning my assumptions",
  listen:  "currently all ears, really",
};

function QiyuDropdown({ dark }: { dark: boolean }) {
  const [open, setOpen] = useState(false);
  const ref       = useRef<HTMLDivElement>(null);
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const enter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(true);
  };
  const leave = () => {
    timerRef.current = setTimeout(() => setOpen(false), 180);
  };

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onMouseEnter={enter}
        onMouseLeave={leave}
        onClick={() => setOpen(o => !o)}
        className={`text-sm font-semibold tracking-tight transition-colors ${dark ? "text-white" : "text-neutral-900"}`}
      >
        Qiyu
      </button>

      {open && (
        <div
          onMouseEnter={enter}
          onMouseLeave={leave}
          className={[
            "absolute left-0 top-full mt-2 w-52 rounded-2xl shadow-xl border overflow-hidden z-50",
            dark
              ? "bg-neutral-900 border-neutral-800"
              : "bg-white border-neutral-100",
          ].join(" ")}
        >
          {/* Pronunciation */}
          <div className={`px-4 pt-3.5 pb-2.5 border-b ${dark ? "border-neutral-800" : "border-neutral-100"}`}>
            <p className={`text-[11px] ${dark ? "text-neutral-500" : "text-neutral-400"}`}>
              "key-you"&nbsp;&nbsp;🔑🫵
            </p>
          </div>

          {/* Links */}
          <div className="p-1.5 space-y-0.5">
            <a
              href="https://www.linkedin.com/in/qiyu-hu/"
              target="_blank"
              rel="noopener noreferrer"
              className={[
                "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors",
                dark
                  ? "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                  : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900",
              ].join(" ")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 opacity-60">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
              LinkedIn
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={[
                "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors",
                dark
                  ? "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                  : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900",
              ].join(" ")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-60">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              Resume
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export function SiteNav({ active, theme = "light", headerProps }: SiteNavProps) {
  // Hide entirely when loaded inside the card modal iframe
  if (typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("embed") === "1") {
    return null;
  }
  const dark = theme === "dark";
  return (
    <header
      {...headerProps}
      className={[
        "sticky top-0 z-40 backdrop-blur-sm border-b",
        dark
          ? "bg-neutral-900/90 border-neutral-800/50"
          : "bg-background/90 border-neutral-200/50",
        headerProps?.className ?? "",
      ].join(" ")}
      style={{ height: 52, ...(headerProps?.style ?? {}) }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between h-full px-6">
        {/* Left: name + badge */}
        <div className="flex items-center gap-3">
          <QiyuDropdown dark={dark} />
          <Link
            to="/what-do-prototypes-prototype"
            className={[
              "group relative inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs overflow-hidden transition-all",
              dark
                ? "bg-neutral-800 text-neutral-300 hover:bg-white hover:text-neutral-900 shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                : "bg-white text-neutral-600 hover:bg-neutral-900 hover:text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]",
            ].join(" ")}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="transition-all duration-300 group-hover:-translate-x-4 group-hover:opacity-0 whitespace-nowrap">
              {BADGE[active]}
            </span>
            <span className="absolute left-6 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
              What do prototypes prototype?
            </span>
          </Link>
        </div>

        {/* Right: nav links */}
        <nav className="flex items-center gap-6">
          {NAV_ITEMS.map((l) => (
            <Link
              key={l}
              to={navHref(l)}
              className={[
                "text-sm transition-colors",
                l === active
                  ? dark
                    ? "text-white font-semibold"
                    : "text-neutral-900 font-semibold"
                  : dark
                  ? "text-neutral-500 hover:text-neutral-200"
                  : "text-neutral-400 hover:text-neutral-900",
              ].join(" ")}
            >
              {l}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
