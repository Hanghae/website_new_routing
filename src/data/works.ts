// src/data/works.ts
export type Tag =
  | "reality"
  | "performance"
  | "installation"
  | "rhythm_game"
  | "projection_mapping";

export const TAGS: Tag[] = [
  "reality",
  "performance",
  "installation",
  "rhythm_game",
  "projection_mapping",
];

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
  thumb: string; // public 폴더 기준 절대경로(/media/...)
};

// 필요에 맞춰 썸네일 경로/슬러그/태그를 편집하세요.
export const WORKS: WorkItem[] = [
  { id: "XEEKIN", slug: "xeekin", title: "XEEKIN", tags: ["installation","performance","reality","rhythm_game","projection_mapping"], thumb: "/media/works/XEEKIN.png" },
  { id: "NOISE CANCELLING", slug: "noise-cancelling", title: "NOISE CANCELLING", tags: ["projection_mapping","reality","installation","projection_mapping"], thumb: "/media/works/NOISECANCELLING.png" },
  { id: "The Unknown box", slug: "the-unknown-box", title: "The Unknown box", tags: ["reality","installation","projection_mapping"], thumb: "/media/works/box2.png" },
  { id: "fog-screen", slug: "fog-screen", title: "Fog Screen", tags: ["reality","projection_mapping"], thumb: "/media/works/fog.png" },
  { id: "Groo", slug: "groo", title: "Groo", tags: ["reality","installation","projection_mapping"], thumb: "/media/works/Groo.png" },
];
