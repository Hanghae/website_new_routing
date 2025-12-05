/// <reference types="vitest" />
import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Minimal, text‑only hero with scroll‑driven reveals on a pure‑black background.
 * – Background video (opacity configurable) + optional FOREGROUND looping logo (WebM alpha preferred).
 * – Sticky hero copy up top, then Works archive grid with tag filtering, then Contact.
 * – Built with Tailwind + Framer Motion. Drop into any React app.
 */

type HeroScrollProps = {
  /** Background video source */
  heroVideoSrc?: string;
  /** Legacy MP4 logo (kept for tests/back-compat, not rendered when WebM is provided) */
  logoVideoSrc?: string;
  /** WebM (VP9/AV1) with alpha for the logo overlay */
  logoWebmAlphaSrc?: string;
  /** Opacity for logo overlay video (0..1). Default 1 */
  logoOpacity?: number;
  /** Vertical offset for the logo overlay in percent (negative moves up). Default -8 */
  logoOffsetYPct?: number;
  /** Background video opacity (0..1). Default 0.3 */
  bgOpacity?: number;
  /** Background opacity for the HERO (2nd page) video (0..1). Defaults to bgOpacity */
  heroBgOpacity?: number;
  /** Show vignette overlay over background video */
  showVignette?: boolean;
};

/**
 * Safe asset helper that avoids import.meta.env access (which breaks in some sandboxes/CI).
 * It respects a <base href> if present; otherwise falls back to "/media/...".
 */
function asset(p: string) {
  try {
    if (!p) return "";
    if (/^https?:\/\//.test(p) || p.startsWith("/")) return p;
    if (typeof document !== "undefined") {
      const baseHref = document.querySelector("base")?.getAttribute("href") || "/";
      const prefix = baseHref.endsWith("/") ? baseHref : baseHref + "/";
      return `${prefix}media/${p}`;
    }
  } catch {}
  return `/media/${p}`;
}

// Fallback chain: tries base-aware /media/p, then root /media/p, then root /p
function assetChain(p: string): string[] {
  const a = asset(p);
  const chain = [a];
  if (!a.startsWith("/media/")) chain.push(`/media/${p}`);
  chain.push(`/${p}`);
  // de-dup
  return Array.from(new Set(chain));
}

function mimeFrom(url: string): string | undefined {
  const u = url.toLowerCase();
  if (u.endsWith(".webm")) return "video/webm";
  if (u.endsWith(".mp4")) return "video/mp4";
  if (u.endsWith(".jpg") || u.endsWith(".jpeg")) return "image/jpeg";
  if (u.endsWith(".png")) return "image/png";
  return undefined;
}

function SmartImg({ sources, alt, className }: { sources: string[]; alt: string; className?: string }) {
  const [idx, setIdx] = useState(0);
  const src = sources[idx];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setIdx((i) => (i + 1 < sources.length ? i + 1 : i))}
      loading="lazy"
      decoding="async"
    />
  );
}

export default function HeroScroll({
  heroVideoSrc = asset("hero.mp4"),
  logoVideoSrc = asset("logo.mp4"),
  logoWebmAlphaSrc = asset("logo.webm"),
  logoOpacity = 1,
  logoOffsetYPct = 0,
  bgOpacity = 0.3,
  heroBgOpacity = bgOpacity,
  showVignette = false,
}: HeroScrollProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Whole‑page progress (for progress bar or global effects)
  const { scrollYProgress } = useScroll({ target: pageRef, offset: ["start start", "end end"] });

  // Hero‑local progress: 0 at hero top aligned to viewport top, 1 when hero bottom hits viewport top
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Top progress bar
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Respect prefers‑reduced‑motion
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  // lightweight runtime diagnostics (enable with ?debug=1)
  const [assetErrors, setAssetErrors] = useState<string[]>([]);
  const markError = (url: string) => setAssetErrors((s) => (s.includes(url) ? s : [...s, url]));
  const debug = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === '1';

  // In-page smooth scroll helper for top-right nav
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // -------- Hero scroll motion (parallax + fade) --------
  // Heading moves up slightly and fades as hero scrolls away
  const h1Y = useTransform(heroProgress, [0, 0.5, 1], [24, 0, -32]);
  const h1Opacity = useTransform(heroProgress, [0, 0.15, 0.6, 1], [0, 1, 0.92, 0.85]);
  const h1Scale = useTransform(heroProgress, [0, 1], [1.02, 1]);

  // Sub copy follows with a bit more lag for depth
  const pY = useTransform(heroProgress, [0, 0.6, 1], [16, 0, -20]);
  const pOpacity = useTransform(heroProgress, [0, 0.2, 0.8, 1], [0, 1, 0.95, 0.9]);

  // -------- About image scroll motion --------
  const aboutImageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: aboutProg } = useScroll({ target: aboutImageRef, offset: ["start 80%", "end 20%"] });
  const aboutY = useTransform(aboutProg, [0, 1], [32, 0]);
  const aboutOpacity = useTransform(aboutProg, [0, 0.2, 1], [0, 1, 1]);
  const aboutScale = useTransform(aboutProg, [0, 1], [1.05, 1]);

  // -------- Works data & filtering --------
  // Controlled tag set (you edit here)
  type Tag =
    | "reality"
    | "performance"
    | "installation"
    | "rhythm_game"
    | "projection_mapping";

  // Order of tag chips on the right (you edit order here)
  const TAGS: Tag[] = [
    "reality",
    "performance",
    "installation",
    "rhythm_game",
    "projection_mapping",
  ];

  // Optional: visible label per tag (if you want different display text)
  const TAG_LABEL: Record<Tag, string> = {
    reality: "reality",
    performance: "performance",
    installation: "installation",
    rhythm_game: "rhythm_game",
    projection_mapping: "projection_mapping",
  };

  type WorkItem = { id: string; slug: string; title: string; tags: Tag[]; thumb: string };
  const WORKS: WorkItem[] = [
    { id: "XEEKIN", slug: "xeekin", title: "XEEKIN", tags: ["installation", "performance", "reality", "rhythm_game", "projection_mapping"], thumb: asset("works/XEEKIN.png") },
    { id: "NOISE CANCELLING", slug: "noise-cancelling", title: "NOISE CANCELLING", tags: ["projection_mapping", "reality", "installation", "projection_mapping"], thumb: asset("works/NOISECANCELLING.png") },
    { id: "The Unknown box", slug: "the-unknown-box", title: "The Unknown box", tags: ["reality", "installation", "projection_mapping"], thumb: asset("works/box2.png") },
    { id: "fog-screen", slug: "fog-screen", title: "Fog Screen", tags: ["reality", "projection_mapping"], thumb: asset("works/fog.png") },
    { id: "Groo", slug: "groo", title: "Groo", tags: ["reality", "installation", "projection_mapping"], thumb: asset("works/Groo.png") },
  ];

  const [activeTag, setActiveTag] = useState<"All" | Tag>("All");
  const allTags = useMemo(() => ["All", ...TAGS] as const, []);
  const filteredWorks = useMemo(
    () => (activeTag === "All" ? WORKS : WORKS.filter((w) => w.tags.includes(activeTag))),
    [activeTag]
  );

  // -------- render home --------
  return (
    <div ref={pageRef} className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Top progress bar (2px) */}
      <motion.div className="fixed left-0 right-0 top-0 z-50 h-[2px] origin-left bg-white/70" style={{ scaleX }} />

      {/* Translucent top bar with right-aligned nav */}
      <nav className="fixed inset-x-0 top-0 z-40">
        <div className="bg-white/5 backdrop-blur supports-[backdrop-filter]:bg-white/5">
          <div className="flex items-center justify-end gap-8 text-base py-3 pr-4 sm:py-3.5 sm:pr-6">
            <button type="button" onClick={() => scrollToId('about')} className="px-2 py-1 text-white/90 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30 rounded">About</button>
            <button type="button" onClick={() => scrollToId('works')} className="px-2 py-1 text-white/90 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30 rounded">Works</button>
            <button type="button" onClick={() => scrollToId('contact')} className="px-2 py-1 text-white/90 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30 rounded">Contact</button>
          </div>
        </div>
      </nav>

      {/* INTRO section (full viewport): only videos, no text) */}
      <section className="relative min-h-[100svh]">
        {/* Background (no video on page 1 as requested) */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {/* Intro page background intentionally left black */}
          {showVignette && (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
          )}
        </div>

        {/* Foreground LOGO (centered, moved slightly up) */}
        {isLogoOverlayEnabled(logoWebmAlphaSrc) && (
          <div
            className="pointer-events-none absolute inset-0 z-10 grid place-items-center"
            style={{ transform: `translateY(${logoOffsetYPct}%)` }}
          >
            <video
              className="max-h-[80svh] max-w-[80vw] object-contain"
              onError={() => markError(logoWebmAlphaSrc)}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              style={{ opacity: clamp01(logoOpacity) }}
            >
              {assetChain("logo.webm").map((u) => (
                <source key={u} src={u} type={mimeFrom(u)} onError={() => markError(u)} />
              ))}
              {assetChain("logo.mp4").map((u) => (
                <source key={u} src={u} type={mimeFrom(u)} onError={() => markError(u)} />
              ))}
            </video>
          </div>
        )}
      </section>

      {/* Sticky HERO section (now starts one page later) */}
      <section id="about" ref={heroRef} className="relative min-h-[140svh]">
        {/* Background video */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <video
            className="h-full w-full object-cover"
            src={heroVideoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            style={{ opacity: clamp01(heroBgOpacity ?? bgOpacity) }}
          />
          {showVignette && (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
          )}
        </div>

        <div className="sticky top-0 flex h-[100svh] items-center px-6 sm:px-10">
          <div className="mx-auto max-w-6xl">
            <motion.h1
              initial={reduced ? undefined : { opacity: 0, y: 24 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ y: reduced ? 0 : h1Y, opacity: reduced ? 1 : h1Opacity, scale: reduced ? 1 : h1Scale }}
              className="text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-6xl md:text-7xl"
            >
              Hwang Su Jong — Portfolio
              <span className="block text-neutral-300">Interfacing Reality, Playfully.</span>
            </motion.h1>

            <motion.p
              initial={reduced ? undefined : { opacity: 0, y: 16 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              style={{ y: reduced ? 0 : pY, opacity: reduced ? 1 : pOpacity }}
              className="mt-6 max-w-3xl text-pretty text-[1.4rem] leading-relaxed text-neutral-200"
            >
              Text‑only hero. No distractions. Scroll to reveal the work philosophy and jump straight to selected projects.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ABOUT image (3rd section): transparent PNG centered */}
      <section id="about-image" className="relative min-h-[100svh] bg-black">
        <div ref={aboutImageRef} className="grid h-full place-items-center px-0">
          <motion.div style={{ y: aboutY, opacity: aboutOpacity, scale: aboutScale }}>
            <SmartImg
              sources={assetChain("about.png")}
              alt="About — career & awards"
              className="w-[90vw] max-w-[1600px] object-contain pointer-events-none select-none"
            />
          </motion.div>
        </div>
      </section>

      {/* Works Archive Grid (4th) */}
      <section id="works" className="relative min-h-[100svh] bg-black">
        {/* Tag selector row — “play a ____” concept */}
        <div className="sticky top-[44px] z-30 bg-black/50 backdrop-blur supports-[backdrop-filter]:bg-black/50">
          <div className="mx-auto max-w-none px-3 py-3 sm:px-6 lg:px-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              {/* Left: play a ____ headline */}
              <div className="text-2xl font-semibold leading-none tracking-tight sm:text-3xl" aria-live="polite">
                <span className="text-white/70">play a</span>
                <motion.span
                  key={activeTag}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="ml-2 inline-block bg-white text-black px-2.5 py-1 rounded-md"
                >
                  {activeTag === "All" ? "reality" : activeTag}
                </motion.span>
              </div>

              {/* Right: tag chips (you can author your own list later; we derive for now) */}
              <div className="-mx-1 flex flex-wrap items-center gap-2">
                {allTags.filter((t) => t !== "All").map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveTag(tag)}
                    className={
                      "px-3 py-1.5 text-xs sm:text-sm rounded-full border transition " +
                      (activeTag === tag
                        ? "border-white bg-white text-black"
                        : "border-white/20 text-white/85 hover:border-white/40 hover:text-white")
                    }
                    aria-pressed={activeTag === tag}
                  >
                    {TAG_LABEL[tag as Tag] ?? tag}
                  </button>
                ))}
                {/* Reset to All */}
                <button
                  type="button"
                  onClick={() => setActiveTag("All")}
                  className="ml-1 px-3 py-1.5 text-xs sm:text-sm rounded-full border border-white/10 text-white/60 hover:text-white/90 hover:border-white/30"
                  title="Show all"
                >
                  reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="mx-auto max-w-none px-2 sm:px-4 lg:px-8 py-8">
          <h2 className="mb-6 text-lg font-medium text-white/90">Archive</h2>
          <motion.ul
            layout
            className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-2 lg:gap-6"
            initial={false}
          >
            {filteredWorks.map((w) => (
              <motion.li key={w.id} layout className="group overflow-hidden rounded-lg border border-white/10 bg-white/5">
                <a
                  href={`#works`}
                  className="block"
                  role="link"
                  aria-label={`Open ${w.title}`}
                >

                  <div className="aspect-[4/3] overflow-hidden bg-white/5">
                    <SmartImg
                      sources={assetChain(w.thumb.replace(/^.*media\//, '').replace(/^\//, ''))}
                      alt={w.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 text-xs sm:text-sm">
                    <span className="truncate text-white/90">{w.title}</span>
                    <span className="truncate text-white/40">{w.tags[0]}</span>
                  </div>
                </a>
              </motion.li>
            ))}
          </motion.ul>

          {filteredWorks.length === 0 && (
            <p className="mt-10 text-center text-white/50">No works for the selected tag.</p>
          )}
        </div>
      </section>

      {/* Contact (5th) */}
      <footer id="contact" className="mx-auto max-w-6xl px-6 pb-16 pt-10 text-sm text-neutral-500 sm:px-10">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Hwang Su Jong</p>
          <a className="rounded underline-offset-4 hover:text-neutral-300 hover:underline focus:outline-none focus:ring-2 focus:ring-white/30" href="mailto:su96hwang@gmail.com">
            Contact
          </a>
        </div>
      </footer>

      {/* Debug panel */}
      {debug && assetErrors.length > 0 && (
        <div className="fixed left-2 bottom-2 z-[100] max-w-[90vw] rounded-md border border-white/20 bg-black/80 p-3 text-xs text-white">
          <p className="mb-2 font-medium">Missing/failed assets:</p>
          <ul className="list-disc pl-4 opacity-90">
            {assetErrors.map((u) => (
              <li key={u}><code className="break-all">{u}</code></li>
            ))}
          </ul>
          <p className="mt-2 opacity-70">Tip: files must exist under <code>/public/media</code> in your repo, case-sensitive on Linux.</p>
        </div>
      )}
    </div>
  );
}

/**
 * ---------- Utilities & tests ----------
 * Keep runtime clean; tests run only under Vitest.
 */
export function clamp01(v: number) {
  return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0;
}

export function formatBlur(px: number) {
  const v = Number.isFinite(px) ? Math.max(0, px) : 0;
  return `blur(${v}px)`;
}

export function mapRangeClamped(x: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  if (!Number.isFinite(x) || !Number.isFinite(inMin) || !Number.isFinite(inMax) || inMin === inMax) return outMin;
  const t = Math.min(1, Math.max(0, (x - inMin) / (inMax - inMin)));
  return outMin + (outMax - outMin) * t;
}

export function isLogoOverlayEnabled(src?: string) {
  return Boolean(src && typeof src === 'string' && src.length > 0);
}

export function shouldUseBlend(logoWebmAlphaSrc?: string) {
  return !isLogoOverlayEnabled(logoWebmAlphaSrc);
}

// Works helpers
export function uniqueTags(items: { tags: string[] }[]): string[] {
  const s = new Set<string>();
  for (const it of items) for (const t of it.tags) s.add(t);
  return Array.from(s);
}

export function filterByTag<T extends { tags: string[] }>(items: T[], tag: string): T[] {
  if (!tag || tag === 'All') return items;
  return items.filter((it) => it.tags.includes(tag));
}

// Inline tests (run only under Vitest). Safe in normal builds.
// @vitest-environment jsdom
void (async () => {
  // Guard for non-test environments
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const meta: any = import.meta as any;
  if (!meta || !meta.vitest) return;

  // Existing tests — do not modify
  // @ts-ignore
  test("formatBlur clamps negatives to 0", () => {
    // @ts-ignore
    expect(formatBlur(-3)).toBe("blur(0px)");
  });
  // @ts-ignore
  test("formatBlur formats integer px", () => {
    // @ts-ignore
    expect(formatBlur(5)).toBe("blur(5px)");
  });
  // @ts-ignore
  test("formatBlur handles NaN as 0", () => {
    // @ts-ignore
    expect(formatBlur(Number.NaN)).toBe("blur(0px)");
  });

  // Additional tests (existing additions)
  // @ts-ignore
  test("formatBlur keeps float precision", () => {
    // @ts-ignore
    expect(formatBlur(2.5)).toBe("blur(2.5px)");
  });
  // @ts-ignore
  test("formatBlur clamps Infinity to 0", () => {
    // @ts-ignore
    expect(formatBlur(Number.POSITIVE_INFINITY)).toBe("blur(0px)");
  });

  // @ts-ignore
  test("mapRangeClamped maps center to center", () => {
    // @ts-ignore
    expect(mapRangeClamped(0.5, 0, 1, 10, 20)).toBe(15);
  });
  // @ts-ignore
  test("mapRangeClamped clamps below", () => {
    // @ts-ignore
    expect(mapRangeClamped(-1, 0, 1, 10, 20)).toBe(10);
  });
  // @ts-ignore
  test("mapRangeClamped clamps above", () => {
    // @ts-ignore
    expect(mapRangeClamped(2, 0, 1, 10, 20)).ToBe // intentionally wrong casing would fail — keep existing tests unchanged
    expect(mapRangeClamped(2, 0, 1, 10, 20)).toBe(20);
  });
  // @ts-ignore
  test("mapRangeClamped handles bad input range", () => {
    // @ts-ignore
    expect(mapRangeClamped(0.5, 1, 1, 10, 20)).toBe(10);
  });

  // New tests for logo overlay enable check
  // @ts-ignore
  test("isLogoOverlayEnabled returns true for non-empty string", () => {
    // @ts-ignore
    expect(isLogoOverlayEnabled("/media/logo.mp4")).toBe(true);
  });
  // @ts-ignore
  test("isLogoOverlayEnabled returns false for empty or undefined", () => {
    // @ts-ignore
    expect(isLogoOverlayEnabled("")).toBe(false);
    // @ts-ignore
    expect(isLogoOverlayEnabled(undefined)).toBe(false);
  });

  // New tests for shouldUseBlend
  // @ts-ignore
  test("shouldUseBlend is false when webm alpha provided", () => {
    // @ts-ignore
    expect(shouldUseBlend("/media/logo_alpha.webm")).toBe(false);
  });
  // @ts-ignore
  test("shouldUseBlend is true when webm alpha missing", () => {
    // @ts-ignore
    expect(shouldUseBlend(undefined)).toBe(true);
  });

  // New tests for uniqueTags / filterByTag
  // @ts-ignore
  test("uniqueTags returns distinct tags", () => {
    // @ts-ignore
    expect(uniqueTags([{ tags: ["a", "b"] }, { tags: ["b", "c"] }]).sort()).toEqual(["a", "b", "c"]);
  });
  // @ts-ignore
  test("filterByTag returns all for 'All'", () => {
    // @ts-ignore
    const items = [{ tags: ["x"] }, { tags: ["y"] }];
    // @ts-ignore
    expect(filterByTag(items, "All").length).toBe(2);
  });
  // @ts-ignore
  test("filterByTag filters by exact tag", () => {
    // @ts-ignore
    const items = [{ tags: ["x"] }, { tags: ["y", "x"] }, { tags: ["z"] }];
    // @ts-ignore
    expect(filterByTag(items, "x").length).toBe(2);
  });

  // New tests for asset() helper
  // @ts-ignore
  test("asset returns /media/... by default", () => {
    // @ts-ignore
    expect(asset("x.jpg")).toBe("/media/x.jpg");
  });
  // @ts-ignore
  test("asset respects <base href>", () => {
    const base = document.createElement('base');
    base.setAttribute('href', '/app/');
    document.head.append(base);
    // @ts-ignore
    expect(asset("y.png")).toBe("/app/media/y.png");
    base.remove();
  });
})();
