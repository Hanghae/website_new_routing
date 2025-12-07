// src/data/works.ts

export type Tag =
  | "reality"
  | "performance"
  | "installation"
  | "rhythm_game"
  | "projection_mapping"
  | "develop"
  | "motion_graphic";

// 상단 필터 칩 노출 순서
export const TAGS: Tag[] = [
  "reality",
  "performance",
  "installation",
  "rhythm_game",
  "projection_mapping",
  "develop",
  "motion_graphic",
];

// 칩 라벨(필요 시 변경)
export const TAG_LABEL: Record<Tag, string> = {
  reality: "reality",
  performance: "performance",
  installation: "installation",
  rhythm_game: "rhythm_game",
  projection_mapping: "projection_mapping",
  develop: "develop",
  motion_graphic: "motion_graphic",
};

export type WorkItem = {
  id: string;
  slug: string;     // /work/:slug
  title: string;
  tags: Tag[];
  /** 홈 그리드 썸네일 — (root)/public/works/<파일> → "/works/<파일>" 로 적기 */
  thumb: string;
  /** YouTube watch?v=ID 의 그 ID (없어도 됨) */
  youtubeId?: string;
};

/**
 * 썸네일 파일은 (root)/public/works/ 폴더에 두고,
 * thumb는 "/works/<파일명>" 형식으로 적어주세요.
 */
export const WORKS: WorkItem[] = [
  {
    id: "XEEKIN",
    slug: "xeekin",
    title: "XEEKIN",
    tags: ["installation", "performance", "reality", "rhythm_game", "projection_mapping"],
    thumb: "works/XEEKIN.jpg",
    youtubeId: "LNq-itphuMw", // ← 실제 11자리 ID인지 확인 권장
  },
  {
    id: "NOISE CANCELLING",
    slug: "noise-cancelling",
    title: "NOISE CANCELLING",
    tags: ["projection_mapping", "reality", "installation", "projection_mapping"],
    thumb: "/works/NOISECANCELLING.png",
    youtubeId: "IXnayv0lLkQ",
  },
  {
    id: "The Unknown box",
    slug: "the-unknown-box",
    title: "The Unknown box",
    tags: ["reality", "installation", "projection_mapping"],
    thumb: "/works/box2.png",
    youtubeId: "CJe59NjIhkM",
  },
  {
    id: "fog-screen",
    slug: "fog-screen",
    title: "Fog Screen",
    tags: ["reality", "projection_mapping"],
    thumb: "/works/fog.png",
    youtubeId: "ZS0lAN9J2sw",
  },
  {
    id: "Groo",
    slug: "groo",
    title: "Groo",
    tags: ["reality", "installation", "projection_mapping"],
    thumb: "/works/Groo.png",
    youtubeId: "iuovOa8r4Uw",
  },
  {
    id: "JangMaRoo",
    slug: "jangMaRoo", // 라우팅은 이 값과 정확히 일치해야 함
    title: "JangMaRoo",
    tags: ["reality", "performance", "projection_mapping"],
    thumb: "/works/JangMaRoo.png", // 필요시 실제 파일명으로 교체
    youtubeId: "_-kpnAqf3mM",
  },
  {
    id: "3D Mapping",
    slug: "3D-Mapping", // 라우팅은 이 값과 정확히 일치해야 함
    title: "3D Mapping",
    tags: ["reality", "projection_mapping", "develop"],
    thumb: "/works/3d_mapping.png", // 필요시 실제 파일명으로 교체
    youtubeId: "slSxIV_E_Ug",
  },
  {
    id: "Earth",
    slug: "Earth", // 라우팅은 이 값과 정확히 일치해야 함
    title: "Earth",
    tags: ["reality", "installation", "develop", "projection_mapping"],
    thumb: "/works/earth.png", // 필요시 실제 파일명으로 교체
    youtubeId: "rGLacluUKhg",
  },
  {
    id: "Hokuyo",
    slug: "Hokuyo", // 라우팅은 이 값과 정확히 일치해야 함
    title: "Hokuyo",
    tags: ["reality", "develop"],
    thumb: "/works/hokuyo.png", // 필요시 실제 파일명으로 교체
    youtubeId: "i_-1t-jhpaY",
  },
  {
    id: "TD with instagram",
    slug: "TD－with－instagram", // 라우팅은 이 값과 정확히 일치해야 함
    title: "TD with instagram",
    tags: ["reality", "develop"],
    thumb: "/works/TD_with_insta.png", // 필요시 실제 파일명으로 교체
    youtubeId: "8gC-aMdRaJM",
  },
  {
    id: "타는목마름으로",
    slug: "thirsty", // 라우팅은 이 값과 정확히 일치해야 함
    title: "타는목마름으로",
    tags: ["reality", "motion_graphic"],
    thumb: "/works/thirsty.png", // 필요시 실제 파일명으로 교체
    youtubeId: "mbtMukyl4QU",
  },
  {
    id: "flee",
    slug: "flee", // 라우팅은 이 값과 정확히 일치해야 함
    title: "flee",
    tags: ["reality", "motion_graphic"],
    thumb: "/works/flee.png", // 필요시 실제 파일명으로 교체
    youtubeId: "qNJRGNJrtNA",
  },
  {
    id: "black pearl",
    slug: "black-pearl", // 라우팅은 이 값과 정확히 일치해야 함
    title: "black pearl",
    tags: ["reality", "motion_graphic"],
    thumb: "/works/black_pearl.png", // 필요시 실제 파일명으로 교체
    youtubeId: "pgZZhv96p0E",
  },
  {
    id: "show reel(~2020)",
    slug: "show-reel", // 라우팅은 이 값과 정확히 일치해야 함
    title: "show reel(~2020)",
    tags: ["reality", "motion_graphic"],
    thumb: "/works/show_reel.png", // 필요시 실제 파일명으로 교체
    youtubeId: "4Xbhyrb8EAY",
  },
  {
    id: "TD Diffusion",
    slug: "TD-Diffusion", // 라우팅은 이 값과 정확히 일치해야 함
    title: "TD Diffusion",
    tags: ["reality", "develop"],
    thumb: "/works/TD_Diffusion.png", // 필요시 실제 파일명으로 교체
    youtubeId: "8NXkAlqFgFo",
  },
  {
    id: "Moving Foster",
    slug: "Moving-Foster", // 라우팅은 이 값과 정확히 일치해야 함
    title: "Moving Foster",
    tags: ["reality", "develop", "motion_graphic"],
    thumb: "/works/Moving_Foster.png", // 필요시 실제 파일명으로 교체
    youtubeId: "8jTFZBbRUGo",
  },
];
