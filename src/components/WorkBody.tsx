// src/components/WorkBody.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
// 줄바꿈 한 줄 == <br/> 원하면 유지, 아니면 이 줄과 plugins에서 제거
import remarkBreaks from "remark-breaks";
import { useI18n } from "../i18n";

type Props = {
  className?: string;
};

/**
 * /public/content/<slug>.(ko|en).md → <slug>.md 순으로 시도
 */
export default function WorkBody({ className }: Props) {
  const { slug } = useParams();
  const { lang } = useI18n();
  const [md, setMd] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "ok" | "empty" | "error">("idle");

  const candidates = useMemo(() => {
    if (!slug) return [];
    const list = [
      `/content/${slug}.${lang}.md`,
      `/content/${slug}.${lang === "ko" ? "en" : "ko"}.md`,
      `/content/${slug}.md`,
    ];
    return Array.from(new Set(list));
  }, [slug, lang]);

  useEffect(() => {
    let abort = false;
    async function load() {
      if (!slug) return;
      setState("loading");
      for (const url of candidates) {
        try {
          const res = await fetch(url, { cache: "no-cache" });
          if (!res.ok) continue;
          const text = await res.text();
          if (abort) return;
          if (text.trim().length === 0) continue;
          setMd(text);        // ✨ 원본 그대로 — 하드브레이크/공백 보존
          setState("ok");
          return;
        } catch {
          // 다음 후보 시도
        }
      }
      if (!abort) setState("empty");
    }
    load();
    return () => { abort = true; };
  }, [candidates, slug]);

  if (state === "loading") return <p className="text-white/60">Loading content…</p>;
  if (state === "empty")   return <p className="text-white/80">본문 파일이 없습니다. <code className="text-white/95">/public/content/{slug}.(ko|en).md</code> 를 만들어 주세요.</p>;
  if (state === "error")   return <p className="text-red-400">Failed to load content.</p>;
  if (!md)                 return null;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      className={
        "prose prose-invert max-w-none " +
        "prose-headings:scroll-mt-20 " +
        "prose-p:text-white/90 prose-strong:text-white " +
        "prose-a:text-white hover:prose-a:opacity-80 " +
        "prose-li:marker:text-white/50 " +
        (className ?? "")
      }
      components={{
        h1: ({node, ...props}) => <h1 className="!mt-0" {...props} />,
      }}
    >
      {md}
    </ReactMarkdown>
  );
}
