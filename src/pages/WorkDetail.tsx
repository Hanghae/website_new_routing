import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { WORKS } from "../data/works"; // 기존 WORKS 데이터 분리 추천

export default function WorkDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const work = WORKS.find(w => w.slug === slug);

  if (!work) {
    return (
      <div className="min-h-screen bg-black text-white grid place-items-center">
        <div className="text-center">
          <p className="mb-4 text-white/70">Work not found</p>
          <button onClick={() => nav("/")} className="underline">Back to home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 상단 바 */}
      <header className="sticky top-0 z-30 bg-black/70 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 h-12 flex items-center justify-between">
          <button onClick={() => nav(-1)} className="text-sm rounded border border-white/20 px-3 py-1.5 hover:bg-white/10">Back</button>
          <button onClick={() => nav("/")} className="text-sm text-white/80 hover:text-white">Home</button>
        </div>
      </header>

      {/* 모션 연출 영역 */}
      <main className="mx-auto max-w-6xl px-4 py-10 space-y-10">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold tracking-tight"
        >
          {work.title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="aspect-[16/9] overflow-hidden rounded-lg border border-white/10 bg-white/5"
        >
          {/* 여기 webm/mp4/이미지/갤러리 등 자유롭게 */}
          <img src={work.thumb} alt={work.title} className="h-full w-full object-contain" />
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="prose-invert max-w-3xl"
        >
          <h2 className="text-xl font-semibold mb-2">About this work</h2>
          <p className="text-white/80">
            여기에 작품 설명 / 역할 / 사용 툴 / 제작 연도 / 링크 등을 적습니다. 섹션을
            여러 개로 나눠서 각 섹션에 다른 스크롤 모션을 줄 수도 있어요.
          </p>
        </motion.section>

        <div className="flex flex-wrap gap-2">
          {work.tags.map(t => (
            <span key={t} className="rounded-full border border-white/20 px-2 py-0.5 text-xs uppercase tracking-wide text-white/80">{t}</span>
          ))}
        </div>
      </main>
    </div>
  );
}
