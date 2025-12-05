// src/data/works.ts

export type Tag =
  | "reality"
  | "performance"
  | "installation"
  | "rhythm_game"
  | "projection_mapping";

// 상단 필터 칩 노출 순서
export const TAGS: Tag[] = [
  "reality",
  "performance",
  "installation",
  "rhythm_game",
  "projection_mapping",
];

// 칩에 보여줄 라벨(필요하면 값만 바꿔 쓰세요)
export const TAG_LABEL: Record<Tag, string> = {
  reality: "reality",
  performance: "performance",
  installation: "installation",
  rhythm_game: "rhythm_game",
  projection_mapping: "projection_mapping",
};

export type WorkItem = {
  id: string;
  slug: string;
  title: string;
  tags: Tag[];
  thumb: string;     // public 기준 절대경로(/media/...)
  youtubeId?: string; // ★ YouTube ID (watch?v=ID 의 그 ID)
};

export const WORKS: WorkItem[] = [
  {
    id: "XEEKIN",
    slug: "xeekin",
    title: "XEEKIN",
    tags: ["installation", "performance", "reality", "rhythm_game", "projection_mapping"],
    thumb: "/media/works/XEEKIN.png",
  },
  {
    id: "NOISE CANCELLING",
    slug: "noise-cancelling",
    title: "NOISE CANCELLING",
    tags: ["projection_mapping", "reality", "installation", "projection_mapping"],
    thumb: "/media/works/NOISECANCELLING.png",
    youtubeId: "IXnayv0lLkQ", // ← 실제 ID로 교체하세요
  },
  {
    id: "The Unknown box",
    slug: "the-unknown-box",
    title: "The Unknown box",
    tags: ["reality", "installation", "projection_mapping"],
    thumb: "/media/works/box2.png",
  },
  {
    id: "fog-screen",
    slug: "fog-screen",
    title: "Fog Screen",
    tags: ["reality", "projection_mapping"],
    thumb: "/media/works/fog.png",
  },
  {
    id: "Groo",
    slug: "groo",
    title: "Groo",
    tags: ["reality", "installation", "projection_mapping"],
    thumb: "/media/works/Groo.png",
  },
];
