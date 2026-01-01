/// <reference types="vitest" />
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { WORKS, TAGS, TAG_LABEL, type Tag } from "../data/works";
import { useI18n } from "../i18n";

/** Utilities kept (asset, assetChain, mimeFrom, SmartImg) */
function isVideoLike(url?: string) {
  if (!url) return false;
  const u = url.toLowerCase();
  return u.endsWith(".webm") || u.endsWith(".mp4");
}

type WorkCardProps = {
  w: {
    id: string;
    slug: string;
    title: string;
    thumb: string;
    tags: string[];
    preview?: string;   // 선택
    subtitle?: string;  // 선택
  };
  onError?: (url: string) => void;
};

function WorkCard({ w, onError }: WorkCardProps) {
  const [hovered, setHovered] = useState(false);
  const hasPreview = Boolean(w.preview);
  const previewIsVideo = isVideoLike(w.preview);
  const overlayText = w.subtitle || w.tags?.[0] || "";

  // 살짝 더 부드럽게: 호버 시만 로드/재생
  const handleEnter = () => setHovered(true);
  const handleLeave = () => setHovered(false);

  return (
    <motion.li
      layout
      className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/5"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onTouchStart={handleEnter}
      onTouchEnd={handleLeave}
    >
      <Link
        to={`/work/${encodeURIComponent(w.slug)}`}
        className="block"
        aria-label={`Open ${w.title}`}
      >
        {/* 포스터(기본 썸네일) */}
        <div className="aspect-[4/3] overflow-hidden bg-white/5">
          <SmartImg
            sources={
              w.thumb.startsWith("/")
                ? [w.thumb]
                : assetChain(w.thumb.replace(/^.*media\//, "").replace(/^\//, ""))
            }
            alt={w.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>

        {/* 호버 프리뷰: preview가 있을 때만 표시 */}
        {hasPreview && (
          <div
            className={`
              pointer-events-none absolute inset-0 opacity-0
              transition-opacity duration-200
              ${hovered ? "opacity-100" : ""}
            `}
            aria-hidden
          >
            {/* 재생 소스: video 우선, 아니면 gif/img */}
            {previewIsVideo ? (
              <video
                className="h-full w-full object-cover"
                muted
                loop
                playsInline
                preload="metadata"
                autoPlay={hovered}
                src={w.preview}
                onError={() => onError?.(w.preview!)}
              />
            ) : (
              <img
                className="h-full w-full object-cover"
                src={w.preview}
                alt=""
                loading="lazy"
                onError={() => onError?.(w.preview!)}
              />
            )}

           {/* 오버레이(그라데이션 + 텍스트) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-7">
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  {/* 제목 크기 키움 */}
                  <p className="truncate text-lg sm:text-xl md:text-2xl font-semibold text-white leading-tight">
                    {w.title}
                  </p>
                  {/* 부제/태그 첫번째를 더 크게 + 아래 여백 확보 */}
                  {overlayText && (
                    <p className="truncate mt-1 text-sm sm:text-base md:text-lg text-white/85">
                      {overlayText}
                    </p>
                  )}
                  {/* 아래 여백 조금 더 주기 */}
                  <div className="h-2 sm:h-3" />
                </div>

                {/* 우측 태그 배지도 살짝 키움 */}
                {w.tags?.[0] && (
                  <span className="shrink-0 rounded-full border border-white/30 px-2.5 py-1 text-[11px] sm:text-sm text-white/90">
                    {w.tags[0]}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 카드 하단 라벨(기존 유지) — 필요 없으면 지워도 됨 */}
        <div className="flex items-center justify-between px-3 py-2 text-xs sm:text-sm">
          <span className="truncate text-white/90">{w.title}</span>
          <span className="truncate text-white/40">{w.tags[0]}</span>
        </div>
      </Link>
    </motion.li>
  );
}

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
function assetChain(p: string): string[] {
  const a = asset(p);
  const chain = [a];
  if (!a.startsWith("/media/")) chain.push(`/media/${p}`);
  chain.push(`/${p}`);
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

type HeroScrollProps = {
  heroVideoSrc?: string;
  logoVideoSrc?: string;
  logoWebmAlphaSrc?: string;
  logoOpacity?: number;
  logoOffsetYPct?: number;
  bgOpacity?: number;
  heroBgOpacity?: number;
  showVignette?: boolean;
};

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
  const { lang, setLang, t } = useI18n();

  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null); // 히어로 배경 모션

  // 전체 페이지 진행도 (상단 progress bar)
  const { scrollYProgress } = useScroll({ target: pageRef, offset: ["start start", "end end"] });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // 히어로(두 번째 섹션) 스크롤 진행도
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const h1Y = useTransform(heroProgress, [0, 0.5, 1], [24, 0, -32]);
  const h1Opacity = useTransform(heroProgress, [0, 0.15, 0.6, 1], [0, 1, 0.92, 0.85]);
  const h1Scale = useTransform(heroProgress, [0, 1], [1.02, 1]);
  const pY = useTransform(heroProgress, [0, 0.6, 1], [16, 0, -20]);
  const pOpacity = useTransform(heroProgress, [0, 0.2, 0.8, 1], [0, 1, 0.95, 0.9]);

  // 접근성: reduced motion
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  // 자가 진단 (?debug=1)
  const [assetErrors, setAssetErrors] = useState<string[]>([]);
  const markError = (url: string) => setAssetErrors((s) => (s.includes(url) ? s : [...s, url]));
  const debug = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("debug") === "1";

  // 스크롤 이동 (Works/Contact만 사용)
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // 태그 필터
  const [activeTag, setActiveTag] = useState<"All" | Tag>("All");
  const allTags = ["All", ...TAGS] as const;
  const filteredWorks = activeTag === "All" ? WORKS : WORKS.filter((w) => w.tags.includes(activeTag));

  return (
    <div
      ref={pageRef}
      className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black"
      style={{ ["--nav-h" as any]: "56px" }} // ← 공통 높이 변수
    >
      {/* progress bar */}
      <motion.div className="fixed left-0 right-0 top-0 z-50 h-[2px] origin-left bg-white/70" style={{ scaleX }} />

      {/* top nav */}
      <nav className="fixed inset-x-0 top-0 z-40">
        <div
          className="
            h-[var(--nav-h)]
            bg-black/70
            supports-[backdrop-filter]:bg-black/60
            backdrop-blur-sm
            border-b border-white/10
          "
        >
          <div className="flex h-full items-center justify-end gap-3 sm:gap-4 px-3 sm:px-6">
            <Link
              to="/about"
              className="px-2 py-1 text-white/90 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 rounded"
            >
              {t("nav_about")}
            </Link>
            <button
              type="button"
              onClick={() => scrollToId("works")}
              className="px-2 py-1 text-white/90 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 rounded"
            >
              {t("nav_works")}
            </button>
            <button
              type="button"
              onClick={() => scrollToId("contact")}
              className="px-2 py-1 text-white/90 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 rounded"
            >
              {t("nav_contact")}
            </button>

            {/* 언어 토글 */}
            <button
              type="button"
              onClick={() => setLang(lang === "ko" ? "en" : "ko")}
              className="ml-2 rounded border border-white/20 px-2 py-1 text-xs text-white/80 hover:bg-white/10"
              aria-label="Toggle language"
              title="Toggle language"
            >
              {lang.toUpperCase()}
            </button>
          </div>
        </div>
      </nav>

      {/* INTRO (page 1) */}
      <section className="relative min-h-[100svh]">
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {showVignette && (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
          )}
        </div>

        {/* foreground logo (optional) */}
        {Boolean(logoWebmAlphaSrc) && (
          <div
            className="pointer-events-none absolute inset-0 z-10 grid place-items-center"
            style={{ transform: `translateY(${logoOffsetYPct}%)` }}
          >
            <video
              className="max-h-[80svh] max-w-[80vw] object-contain"
              onError={() => markError(logoWebmAlphaSrc!)}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              style={{ opacity: Math.min(1, Math.max(0, logoOpacity)) }}
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

      {/* HERO (page 2) */}
      <section id="hero" ref={heroRef} className="relative min-h-[140svh]">
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <video
            className="h-full w-full object-cover"
            src={heroVideoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            style={{ opacity: Math.min(1, Math.max(0, heroBgOpacity ?? bgOpacity)) }}
          />
          {showVignette && (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
          )}
        </div>

        <div className="sticky top-0 flex h-[100svh] items-center px-6 sm:px-10">
          {/* === REPLACE FROM HERE (HERO text block) === */}
          <div className="w-full">
            {/* 좌측 여백 래퍼 */}
            <div className="pl-[10vw] sm:pl-[12vw] md:pl-[14vw] lg:pl-[16vw] xl:pl-[18vw] max-w-[1600px]">
              {/* 메인 + 서브 (같은 크기/색) */}
              <motion.div
                initial={reduced ? undefined : { opacity: 0, y: 24 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ y: reduced ? 0 : h1Y, opacity: reduced ? 1 : h1Opacity, scale: reduced ? 1 : h1Scale }}
                className="text-left"
              >
                <h1 className="text-balance text-4xl sm:text-6xl md:text-7xl font-semibold leading-tight tracking-tight">
                  Hwang Su Jong
                </h1>
                <h2 className="mt-1 text-4xl sm:text-6xl md:text-7xl font-semibold leading-tight tracking-tight">
                  Interfacing Reality, Playfully.
                </h2>
              </motion.div>

              {/* 제2 서브텍스트 */}
              <motion.p
                initial={reduced ? undefined : { opacity: 0, y: 16 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                style={{ y: reduced ? 0 : pY, opacity: reduced ? 1 : pOpacity }}
                className="mt-10 max-w-3xl text-pretty text-[1.125rem] sm:text-[1.25rem] leading-relaxed text-neutral-200"
              >
                {t("hero_subtitle")}
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* Works (page 3) */}
      <section id="works" className="relative min-h-[100svh] bg-black">
        {/* sticky filter bar */}
        <div
          className="
            sticky
            top-[var(--nav-h)]
            z-30
            bg-black/70
            supports-[backdrop-filter]:bg-black/60
            backdrop-blur-sm
            border-b border-white/10
          "
        >
          <div className="mx-auto max-w-none px-2 py-3 sm:px-6 lg:px-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="text-2xl font-semibold leading-none tracking-tight sm:text-3xl" aria-live="polite">
                <span className="text-white/70">{t("works_play_a")}</span>
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
                <button
                  type="button"
                  onClick={() => setActiveTag("All")}
                  className="ml-1 px-3 py-1.5 text-xs sm:text-sm rounded-full border border-white/10 text-white/60 hover:text-white/90 hover:border-white/30"
                  title="Show all"
                >
                  {t("works_reset")}
                </button>
              </div>
            </div>
          </div>
        </div>

  {/* 이하 그리드 그대로… */}


        {/* Grid */}
        <div className="mx-auto max-w-none px-4 sm:px-6 lg:px-10 py-8">
          <motion.ul
            layout
            className="grid grid-cols-2 gap-3.5 sm:gap-4.5 lg:gap-6.5"
            initial={false}
          >
            {filteredWorks.map((w) => (
              <motion.li
                key={w.id}
                layout
                className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5"
              >
                <Link
                  to={`/work/${encodeURIComponent(w.slug)}`}
                  className="group block relative"
                  aria-label={`Open ${w.title}`}
                >
                  {/* 비주얼 박스 */}
                  <div className="aspect-[4/3] relative overflow-hidden rounded-[inherit]">
                    {/* 확대되는 공통 래퍼: 썸네일/프리뷰/오버레이가 함께 확대 */}
                    <div className="absolute inset-0 will-change-transform transition-transform duration-300 group-hover:scale-[1.02] [transform-origin:center] rounded-[inherit]">
                      {/* 썸네일(기본) */}
                      <SmartImg
                        sources={
                          w.thumb.startsWith("/")
                            ? [w.thumb]
                            : assetChain(w.thumb.replace(/^.*media\//, "").replace(/^\//, ""))
                        }
                        alt={w.title}
                        className="absolute inset-0 h-full w-full object-cover rounded-[inherit] z-[1]"
                      />

                      {/* 호버 프리뷰 (webm) */}
                      {w.preview && (
                        <video
                          className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-[inherit] z-[1]"
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                        >
                          <source
                            src={
                              w.preview.startsWith("/")
                                ? w.preview
                                : assetChain(w.preview.replace(/^.*media\//, "").replace(/^\//, ""))[0]
                            }
                            type="video/webm"
                          />
                        </video>
                      )}

                      {/* 1) 균일 딤(전체 어둡게) */}
                      <div
                        className="pointer-events-none absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-[inherit] z-[2]"
                        aria-hidden
                      />

                      {/* 2) 하단 그라데이션(가독성 보강) */}
                      <div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-[inherit] z-[3]"
                        aria-hidden
                      />

                      {/* 텍스트 오버레이 */}
                      <div className="absolute left-0 right-0 bottom-0 p-4 sm:p-6 md:p-7 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-[4]">
                        <p className="truncate text-lg sm:text-xl md:text-2xl font-semibold text-white leading-tight drop-shadow">
                          {w.title}
                        </p>
                        <p className="truncate mt-1.5 text-sm sm:text-base md:text-lg text-white/90">
                          {w.subtitle ?? w.tags[0]}
                        </p>
                        <div className="h-1.5 sm:h-2" />
                      </div>
                    </div>
                  </div>

                </Link>
              </motion.li>
            ))}
          </motion.ul>

          {filteredWorks.length === 0 && (
            <p className="mt-10 text-center text-white/50">No works for the selected tag.</p>
          )}
        </div>

      </section>

      {/* Contact (page 4) */}
      <section id="contact" className="relative bg-black" aria-labelledby="contact-heading">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 py-14 sm:py-16">
          <h2 id="contact-heading" className="text-2xl sm:text-3xl font-bold tracking-tight">{t("contact_title")}</h2>
          <p className="mt-2 text-neutral-300 max-w-2xl">
            {t("contact_hint")}
          </p>
          <ContactForm />
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-6 sm:px-10 py-8 text-sm text-neutral-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} Hwang Su Jong</p>
            <a
              className="rounded underline-offset-4 hover:text-neutral-300 hover:underline focus:outline-none focus:ring-2 focus:ring-white/30"
              href="mailto:hsail5483@gmail.com"
            >
              hsail5483@gmail.com
            </a>
          </div>
        </div>
      </section>

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

/* ---- helpers & tests (기존 그대로) ---- */
export function clamp01(v: number) { return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0; }
export function formatBlur(px: number) { const v = Number.isFinite(px) ? Math.max(0, px) : 0; return `blur(${v}px)`; }
export function mapRangeClamped(x: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  if (!Number.isFinite(x) || !Number.isFinite(inMin) || !Number.isFinite(inMax) || inMin === inMax) return outMin;
  const t = Math.min(1, Math.max(0, (x - inMin) / (inMax - inMin)));
  return outMin + (outMax - outMin) * t;
}
export function isLogoOverlayEnabled(src?: string) { return Boolean(src && typeof src === "string" && src.length > 0); }
export function shouldUseBlend(logoWebmAlphaSrc?: string) { return !isLogoOverlayEnabled(logoWebmAlphaSrc); }
export function uniqueTags(items: { tags: string[] }[]) { const s = new Set<string>(); for (const it of items) for (const t of it.tags) s.add(t); return Array.from(s); }
export function filterByTag<T extends { tags: string[] }>(items: T[], tag: string): T[] { if (!tag || tag === "All") return items; return items.filter((it) => it.tags.includes(tag)); }

/* ContactForm: i18n 적용된 버전 */
function ContactForm() {
  const { t } = useI18n();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // 허니팟

  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // .env 의 VITE_FORMSPREE_ID
  const formId = (import.meta as any).env?.VITE_FORMSPREE_ID as string | undefined;
  const endpoint = formId ? `https://formspree.io/${formId}` : "";

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    if (website) return; // 봇 의심시 무시

    if (!endpoint) {
      setStatus("error");
      setErrorMsg("Form endpoint가 설정되지 않았습니다. .env의 VITE_FORMSPREE_ID를 확인하세요.");
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setStatus("ok");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setErrorMsg(data?.errors?.[0]?.message || `전송에 실패했습니다. (HTTP ${res.status})`);
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || "네트워크 오류가 발생했습니다.");
    }
  };

  const inputCls =
    "w-full rounded-xl bg-black/40 border border-white/15 px-4 py-2.5 outline-none focus:ring-2 focus:ring-white/30 text-white placeholder:text-white/40";

  return (
    <form
      onSubmit={onSubmit}
      className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-white/5 p-5"
      aria-labelledby="contact-form"
      noValidate
    >
      <h3 id="contact-form" className="sr-only">Contact form</h3>

      {/* 허니팟(숨김) */}
      <label className="hidden">
        Website
        <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </label>

      <label>
        <div className="mb-1 text-xs text-white/60">{t("contact_name")}</div>
        <input
          className={inputCls}
          placeholder={t("contact_placeholder_name")}
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label>
        <div className="mb-1 text-xs text-white/60">{t("contact_email")}</div>
        <input
          type="email"
          className={inputCls}
          placeholder={t("contact_placeholder_email")}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label>
        <div className="mb-1 text-xs text-white/60">{t("contact_message")}</div>
        <textarea
          className={inputCls + " min-h-[140px]"}
          placeholder={t("contact_placeholder_message")}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>

      {/* 상태 메시지 */}
      <div aria-live="polite" className="text-sm">
        {status === "sending" && <p className="text-white/70">{t("contact_sending")}</p>}
        {status === "ok" && <p className="text-emerald-400">{t("contact_ok")}</p>}
        {status === "error" && <p className="text-red-400">{t("contact_error_prefix")} {errorMsg}</p>}
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-white/60">{t("contact_privacy")}</p>
        <button
          className="rounded-xl bg-white text-black hover:bg-white/90 px-4 py-2.5 font-medium disabled:opacity-60"
          type="submit"
          disabled={status === "sending"}
        >
          {status === "sending" ? t("contact_sending") : t("contact_send")}
        </button>
      </div>
    </form>
  );
}
