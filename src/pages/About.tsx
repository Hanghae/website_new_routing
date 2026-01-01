// src/pages/About.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n";

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

export default function About() {
  const { t, lang, setLang } = useI18n();
  const toggleLang = () => setLang(lang === "ko" ? "en" : "ko");

  const [fit, setFit] = useState<"cover" | "contain">("cover");

  const handleLoad: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const img = e.currentTarget;
    const ar = img.naturalWidth / img.naturalHeight;
    const vr = window.innerWidth / window.innerHeight;
    setFit(ar < vr ? "contain" : "cover");
  };

  useEffect(() => {
    const onResize = () => {
      const el = document.getElementById("__about_img__") as HTMLImageElement | null;
      if (!el) return;
      const ar = (el.naturalWidth || 1) / (el.naturalHeight || 1);
      const vr = window.innerWidth / window.innerHeight;
      setFit(ar < vr ? "contain" : "cover");
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <main className="relative min-h-[100svh] bg-black text-white">
      {/* HeroScroll과 동일한 상단바 + 언어 토글 */}
      <nav className="fixed inset-x-0 top-0 z-40">
        <div className="bg-white/5 backdrop-blur supports-[backdrop-filter]:bg-white/5">
          <div className="flex items-center justify-end gap-4 sm:gap-6 text-base py-3 pr-3 sm:py-3.5 sm:pr-6">
            <Link to="/" className="px-2 py-1 text-white/90 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30 rounded">
              Home
            </Link>
            <Link
              to="/about"
              aria-current="page"
              className="px-2 py-1 text-white bg-white/10 rounded hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              {t("nav_about")}
            </Link>
            <Link to="/#works" className="px-2 py-1 text-white/90 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30 rounded">
              {t("nav_works")}
            </Link>
            <Link to="/#contact" className="px-2 py-1 text-white/90 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30 rounded">
              {t("nav_contact")}
            </Link>

            <button
              type="button"
              onClick={toggleLang}
              className="ml-2 rounded border border-white/20 px-2 py-1 text-xs text-white/80 hover:bg-white/10"
              aria-label="Toggle language"
            >
              {lang.toUpperCase()}
            </button>
          </div>
        </div>
      </nav>

      {/* 풀화면 이미지 */}
      <section className="relative min-h-[100svh] pt-[48px]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="absolute inset-0">
          <img
            id="__about_img__"
            src={asset("about.png")}
            alt="About — career & awards"
            onLoad={handleLoad}
            className="absolute inset-0 h-full w-full select-none pointer-events-none"
            style={{ objectFit: fit }}
            draggable={false}
          />
        </motion.div>
      </section>
    </main>
  );
}
