import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useI18n } from "../i18n";
import { marked } from "marked";

type Props = {
  className?: string;
};

/**
 * /public/content/<slug>.(ko|en).md → <slug>.md 순으로 불러옴
 * - 예: xeekin.ko.md > xeekin.en.md > xeekin.md
 */
export default function WorkBody({ className }: Props) {
  const { slug } = useParams();
  const { lang } = useI18n();
  const [state, setState] = useState<"idle" | "loading" | "ok" | "empty" | "error">("idle");
  const [html, setHtml] = useState("");

  const candidates = useMemo(() => {
    if (!slug) return [];
    const list = [
      `/content/${slug}.${lang}.md`,
      `/content/${slug}.${lang === "ko" ? "en" : "ko"}.md`,
      `/content/${slug}.md`,
    ];
    // 중복 제거
    return Array.from(new Set(list));
  }, [slug, lang]);

  useEffect(() => {
    let abort = false;
    async function run() {
      if (!slug) return;
      setState("loading");
      for (const url of candidates) {
        try {
          const res = await fetch(url, { cache: "no-cache" });
          if (!res.ok) continue;
          const md = await res.text();
          if (abort) return;
          const rendered = marked.parse(md);
          setHtml(typeof rendered === "string" ? rendered : (rendered as any).toString());
          setState(md.trim() ? "ok" : "empty");
          return;
        } catch {
          // try next
        }
      }
      if (!abort) setState("empty");
    }
    run();
    return () => {
      abort = true;
    };
  }, [candidates, slug]);

  if (state === "loading")
    return <p className="text-white/60">Loading content…</p>;

  if (state === "error")
    return <p className="text-red-400">Failed to load content.</p>;

  if (state === "empty")
    return (
      <p className="text-white/80">
        본문 파일이 없습니다. <code className="text-white/95">/public/content/{slug}.(ko|en).md</code> 를 만들어 주세요.
      </p>
    );

  // 기본적으로 로컬 관리 컨텐츠만 들어오므로 sanitize 생략 (외부 소스라면 DOMPurify 등 권장)
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
