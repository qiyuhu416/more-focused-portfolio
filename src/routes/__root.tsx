import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";

function CustomCursor() {
  const dotRef   = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;

    let tx = -200, ty = -200;
    let isCard = false;
    let label = "";
    let raf = 0;

    const getDomain = (href: string) => {
      try { return new URL(href).hostname.replace(/^www\./, ""); }
      catch { return "external"; }
    };

    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };

    const onOver = (e: MouseEvent) => {
      const el = e.target as Element;
      isCard = !!el.closest("[data-cursor='card']");
      const ext = el.closest("a[target='_blank']") as HTMLAnchorElement | null;
      const customLabel = (el.closest("[data-cursor-label]") as HTMLElement | null)?.dataset.cursorLabel ?? "";
      label = ext ? getDomain(ext.href) : customLabel;
    };

    const tick = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${tx - 4}px, ${ty - 4}px)`;
      }
      if (arrowRef.current) {
        // Floats just above-right of the dot
        arrowRef.current.style.transform = `translate(${tx + 6}px, ${ty - 18}px)`;
        arrowRef.current.style.opacity = isCard ? "1" : "0";
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate(${tx + 12}px, ${ty + 10}px)`;
        labelRef.current.style.opacity = label ? "1" : "0";
        if (label) labelRef.current.textContent = `↗ ${label}`;
      }
      raf = requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Single dot cursor */}
      <div ref={dotRef} style={{ mixBlendMode: "difference", background: "white", position: "fixed", top: 0, left: 0, zIndex: 99999, width: 8, height: 8, borderRadius: "50%", pointerEvents: "none", willChange: "transform" }} />
      {/* Card arrow — floats above dot on card hover */}
      <div ref={arrowRef} style={{ position: "fixed", top: 0, left: 0, zIndex: 99999, pointerEvents: "none", mixBlendMode: "difference", opacity: 0, transition: "opacity 0.15s", willChange: "transform" }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 11L11 3M11 3H5M11 3V9" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {/* External link label */}
      <div ref={labelRef} style={{ position: "fixed", top: 0, left: 0, zIndex: 99999, pointerEvents: "none", background: "#111", color: "white", fontSize: 11, fontWeight: 500, padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap", opacity: 0, transition: "opacity 0.15s", willChange: "transform" }} />
    </>
  );
}

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Hello. You found a bug!
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You know vibe coding needs more careful debugging.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <a  href="https://www.linkedin.com/in/qiyu-hu/">
            Talk to Qiyu
            </a>
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go back
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Qiyu x AI interaction" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Kalam:wght@400;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <CustomCursor />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
