// src/pages/WorkDetail.tsx
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks"; // 줄바꿈 보존

import { WORKS } from "../data/works";
import { useI18n } from "../i18n";

// MD 파일 묶어 불러오기 (slug.md)
const RAW_MD = import.meta.glob("../content/works/*.md", { as: "raw" });

export default function WorkDetail() {
  const { t } = useI18n();
  const { slug } = useParams();
  const nav = useNavigate();
  const work = WORKS.find((w) => w.slug === slug);

  if (!work) {
    return (
      <div className="grid min-h-screen place-items-center bg-black text-white">
        <div className="text-center">
          <p className="mb-3 text-white/70">Work not found</p>
          <Link to="/" className="underline">Back to home</Link>
        </div>
      </div>
    );
  }

  const hasYouTube =
    typeof work.youtubeId === "string" && work.youtubeId.trim().length > 0;

  // MD 본문 상태
  const [mdBody, setMdBody] = useState<string | null>(null);

  // slug에 맞는 md 파일 로드
  useEffect(() => {
    let alive = true;
    // 파일명: /src/content/works/{slug}.md
    const key = Object.keys(RAW_MD).find((k) => k.endsWith(`/${work.slug}.md`));
    if (!key) {
      setMdBody(null);
      return;
    }
    (async () => {
      const raw = await RAW_MD[key](); // 문자열 원본
      if (!alive) return;
      // trim 제거: 마크다운 하드 브레이크 보존
      setMdBody(raw);
    })();
    return () => {
      alive = false;
    };
  }, [work.slug]);

  return (
    <main className="mx-auto max-w-6xl bg-black text-white px-4 sm:px-6 lg:px-10 py-10 space-y-10">
      {/* 상단 컨트롤 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => nav(-1)}
          className="rounded border border-white/20 px-3 py-1.5 hover:bg-white/10"
        >
          Back
        </button>
        <Link to="/" className="text-white/80 hover:text-white">
          Home
        </Link>
      </div>

      {/* 제목 + 태그 */}
      <header className="border-b border-white/10 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {work.title}
          </h1>

          <div className="-mx-1 flex flex-wrap items-center gap-2">
            {work.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 text-xs sm:text-sm rounded-full border border-white/20 text-white/85"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Video */}
      <section aria-labelledby="video-heading" className="space-y-3">
        <h2 id="video-heading" className="text-base font-semibold text-white/80">
          {t("work_video")}
        </h2>

        <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
          {hasYouTube ? (
            <iframe
              loading="lazy"
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${work.youtubeId!.trim()}?rel=0&modestbranding=1&playsinline=1`}
              title={`${work.title} — YouTube player`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <div className="grid h-full place-items-center p-4 text-sm text-white/70">
              <p>
                {t("work_no_youtube_1")}
                <code className="text-white/90">{t("work_youtubeId")}</code>
                {t("work_no_youtube_2")} {t("work_add_in_file_1")}
                <code className="text-white/90">src/data/works.ts</code>
                {t("work_add_in_file_2")}
              </p>
            </div>
          )}
        </div>

        <p className="text-xs sm:text-sm text-white/50">
          YouTube (privacy-enhanced) embed.
        </p>
      </section>

      {/* 본문(캡션) */}
      <section
        aria-labelledby="desc-heading"
        className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8"
      >
        <h2 id="desc-heading" className="sr-only">
          Description
        </h2>

        {mdBody ? (
          <div
            className={
              "prose prose-invert max-w-none " +
              "prose-headings:scroll-mt-20 " +
              "prose-p:text-white/90 prose-strong:text-white " +
              "prose-a:text-white hover:prose-a:opacity-80 " +
              "prose-li:marker:text-white/50 "
            }
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]} // 줄바꿈 처리
              components={{
                h1: (props) => <h1 className="!mt-0" {...props} />,
              }}
            >
              {mdBody}
            </ReactMarkdown>
          </div>
        ) : (
          <article className="prose prose-invert max-w-none">
            {work.slug === "xeekin" ? (
              <>
                <h3 className="!mt-0">{t("xeekin_h3")}</h3>
                <p>{t("xeekin_p1")}</p>
                <p>{t("xeekin_p2")}</p>
              </>
            ) : (
              <>
                <h3 className="!mt-0">{work.title}</h3>
                <p className="text-white/80">
                  작품 설명 / 역할 / 사용 툴 / 제작 연도 / 외부 링크 등을 여기에 작성하세요.
                </p>
              </>
            )}
          </article>
        )}
      </section>
    </main>
  );
}
