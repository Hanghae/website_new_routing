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
  /** 호버 시 재생할 프리뷰 (gif/webm/mp4). 없으면 정지 썸네일만 */
  preview?: string;
  /** 썸네일 오버레이에 뜨는 서브 텍스트(없으면 첫 태그 사용) */
  subtitle?: string;
  /** YouTube watch?v=ID 의 그 ID (없어도 됨) */
  youtubeId?: string;
};

/**
 * 썸네일 파일은 (root)/public/works/ 폴더에 두고,
 * thumb는 "/works/<파일명>" 형식으로 적어주세요.
 * 프리뷰는 (root)/public/works/previews/<slug>.webm 로 두었습니다.
 */
export const WORKS: WorkItem[] = [
  {
    id: "XEEKIN",
    slug: "xeekin",
    title: "XEEKIN",
    tags: ["installation", "performance", "reality", "rhythm_game", "projection_mapping"],
    thumb: "/works/XEEKIN.jpg",
    preview: "/works/previews/xeekin.webm",
    subtitle: "Anyone can be a performer",
    youtubeId: "LNq-itphuMw",
  },
  {
    id: "NOISE CANCELLING",
    slug: "noise-cancelling",
    title: "NOISE CANCELLING",
    tags: ["projection_mapping", "reality", "installation", "projection_mapping"],
    thumb: "/works/NOISECANCELLING.png",
    preview: "/works/previews/noise-cancelling.webm",
    subtitle: "Projection mapping experiment",
    youtubeId: "IXnayv0lLkQ",
  },
  {
    id: "The Unknown box",
    slug: "the-unknown-box",
    title: "The Unknown box",
    tags: ["reality", "installation", "projection_mapping"],
    thumb: "/works/box2.png",
    preview: "/works/previews/the-unknown-box.webm",
    subtitle: "Interactive installation",
    youtubeId: "CJe59NjIhkM",
  },
  {
    id: "fog-screen",
    slug: "fog-screen",
    title: "Fog Screen",
    tags: ["reality", "projection_mapping"],
    thumb: "/works/fog.png",
    preview: "/works/previews/fog-screen.webm",
    subtitle: "Volumetric projection",
    youtubeId: "ZS0lAN9J2sw",
  },
  {
    id: "Groo",
    slug: "groo",
    title: "Groo",
    tags: ["reality", "installation", "projection_mapping"],
    thumb: "/works/Groo.png",
    preview: "/works/previews/groo.webm",
    subtitle: "Site-specific installation",
    youtubeId: "iuovOa8r4Uw",
  },
  {
    id: "JangMaRoo",
    slug: "jangMaRoo",
    title: "JangMaRoo",
    tags: ["reality", "performance", "projection_mapping"],
    thumb: "/works/JangMaRoo.png",
    preview: "/works/previews/jangMaRoo.webm",
    subtitle: "Live performance",
    youtubeId: "_-kpnAqf3mM",
  },
  {
    id: "Earth",
    slug: "Earth",
    title: "Earth",
    tags: ["reality", "installation", "develop", "projection_mapping"],
    thumb: "/works/earth.png",
    preview: "/works/previews/Earth.webm",
    subtitle: "Generative earth scene",
    youtubeId: "rGLacluUKhg",
  },
  {
    id: "Hokuyo",
    slug: "Hokuyo",
    title: "Hokuyo",
    tags: ["reality", "develop"],
    thumb: "/works/hokuyo.png",
    preview: "/works/previews/Hokuyo.webm",
    subtitle: "Lidar-based interaction",
    youtubeId: "i_-1t-jhpaY",
  },
  {
    id: "TD with instagram",
    slug: "TD－with－instagram",
    title: "TD with instagram",
    tags: ["reality", "develop"],
    thumb: "/works/TD_with_insta.png",
    preview: "/works/previews/TD－with－instagram.webm",
    subtitle: "TD × social API",
    youtubeId: "8gC-aMdRaJM",
  },
  {
    id: "타는목마름으로",
    slug: "thirsty",
    title: "타는목마름으로",
    tags: ["reality", "motion_graphic"],
    thumb: "/works/thirsty.png",
    preview: "/works/previews/thirsty.webm",
    subtitle: "Motion graphic short",
    youtubeId: "mbtMukyl4QU",
  },
  {
    id: "flee",
    slug: "flee",
    title: "flee",
    tags: ["reality", "motion_graphic"],
    thumb: "/works/flee.png",
    preview: "/works/previews/flee.webm",
    subtitle: "Style exploration",
    youtubeId: "qNJRGNJrtNA",
  },
  {
    id: "black pearl",
    slug: "black-pearl",
    title: "black pearl",
    tags: ["reality", "motion_graphic"],
    thumb: "/works/black_pearl.png",
    preview: "/works/previews/black-pearl.webm",
    subtitle: "Cinematic motion",
    youtubeId: "pgZZhv96p0E",
  },
  {
    id: "show reel(~2020)",
    slug: "show-reel",
    title: "show reel(~2020)",
    tags: ["reality", "motion_graphic"],
    thumb: "/works/show_reel.png",
    preview: "/works/previews/show-reel.webm",
    subtitle: "Early works compilation",
    youtubeId: "4Xbhyrb8EAY",
  },
  {
    id: "TD Diffusion",
    slug: "TD-Diffusion",
    title: "TD Diffusion",
    tags: ["reality", "develop"],
    thumb: "/works/TD_Diffusion.png",
    preview: "/works/previews/TD-Diffusion.webm",
    subtitle: "TouchDesigner × Diffusion",
    youtubeId: "8NXkAlqFgFo",
  },
  {
    id: "Moving Foster",
    slug: "Moving-Foster",
    title: "Moving Foster",
    tags: ["reality", "develop", "motion_graphic"],
    thumb: "/works/Moving_Foster.png",
    preview: "/works/previews/Moving-Foster.webm",
    subtitle: "Kinetic poster test",
    youtubeId: "8jTFZBbRUGo",
  },
];
