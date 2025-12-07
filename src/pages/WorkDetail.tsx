// src/pages/WorkDetail.tsx
import { useParams, useNavigate, Link } from "react-router-dom";
import { WORKS } from "../data/works";

export default function WorkDetail() {
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

  // youtubeId가 공란("")이어도 임베드하지 않도록 안전 체크
  const hasYouTube = typeof work.youtubeId === "string" && work.youtubeId.trim().length > 0;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-10 bg-black text-white">
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

      {/* 타이틀 */}
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{work.title}</h1>

      {/* ★ 상단은 반드시 YouTube 임베드 (없으면 안내) */}
      <section aria-labelledby="video-heading" className="space-y-3">
        <h2 id="video-heading" className="text-xl font-semibold">Video</h2>

        <div className="aspect-video overflow-hidden rounded-lg border border-white/10 bg-black">
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
                This work has no <code className="text-white/90">youtubeId</code> yet.
                Add it in <code className="text-white/90">src/data/works.ts</code> to show a video.
              </p>
            </div>
          )}
        </div>

        <p className="text-sm text-white/60">YouTube (privacy-enhanced) embed.</p>
      </section>

      {/* 태그 */}
      <div className="flex flex-wrap gap-2">
        {work.tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-white/20 px-2 py-0.5 text-xs uppercase tracking-wide text-white/80"
          >
            {t}
          </span>
        ))}
      </div>

      {/* 설명 섹션 */}
      <section className="prose prose-invert max-w-3xl">
        <h2 className="text-xl font-semibold">About this work</h2>
        <p className="text-white/80">
          작품 설명 / 역할 / 사용 툴 / 제작 연도 / 외부 링크 등을 여기에 작성하세요.
          섹션을 더 나눠서 각 섹션마다 스크롤 모션을 추가할 수도 있습니다.
        </p>
      </section>
    </main>
  );
}
