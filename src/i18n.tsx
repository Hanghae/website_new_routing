// src/i18n.ts
import { useEffect, useMemo, useState, createContext, useContext } from "react";

export type Lang = "ko" | "en";

type Dict = Record<string, { ko: string; en: string }>;

const DICT: Dict = {
  // Nav
  nav_about: { ko: "About", en: "About" },
  nav_works: { ko: "Works", en: "Works" },
  nav_contact: { ko: "Contact", en: "Contact" },

  // Hero
  hero_title: { ko: "Hwang Su Jong — Portfolio", en: "Hwang Su Jong — Portfolio" },
  hero_subtitle: {
    ko: "디지털과 현실 사이의 틈을 열어, 플레이할 수 있는 현실을 만듭니다.",
    en: "I open seams between digital and reality to make a world you can play.",
  },

  // Works
  works_archive: { ko: "Archive", en: "Archive" },
  works_reset: { ko: "reset", en: "reset" },
  works_play_a: { ko: "play a", en: "play a" },

  // Contact
  contact_title: { ko: "Contact", en: "Contact" },
  contact_hint: {
    ko: "제출 즉시 메일 초안이 열리며, 필요 시 내용을 수정한 뒤 전송하시면 됩니다.",
    en: "Submitting opens an email draft. Edit if needed and send.",
  },
  contact_name: { ko: "Name", en: "Name" },
  contact_email: { ko: "Email", en: "Email" },
  contact_message: { ko: "Message", en: "Message" },
  contact_placeholder_name: { ko: "이름", en: "Your name" },
  contact_placeholder_email: { ko: "you@domain.com", en: "you@domain.com" },
  contact_placeholder_message: {
    ko: "문의 내용을 작성해주세요.",
    en: "Write a short message.",
  },
  contact_sending: { ko: "Sending…", en: "Sending…" },
  contact_ok: { ko: "메시지가 전송되었습니다. 곧 연락드릴게요!", en: "Message sent. I’ll get back to you soon!" },
  contact_error_prefix: { ko: "전송 오류:", en: "Error:" },
  contact_privacy: {
    ko: "제출 시 서버를 통해 실제 이메일이 전송됩니다.",
    en: "A real email will be sent via server.",
  },
  contact_send: { ko: "Send", en: "Send" },

  // WorkDetail
  work_video: { ko: "Video", en: "Video" },
  work_no_youtube_1: { ko: "이 작품에는 아직 ", en: "This work has no " },
  work_no_youtube_2: { ko: " 가 없습니다.", en: " yet." },
  work_youtubeId: { ko: "youtubeId", en: "youtubeId" },
  work_add_in_file_1: { ko: "를 추가하려면 ", en: "Add it in " },
  work_add_in_file_2: { ko: " 에서 설정하세요.", en: " to show a video." },

  // XEEKIN text
  xeekin_h3: { ko: "XEEKIN — Anyone Can Be a Performer (2025)", en: "XEEKIN — Anyone Can Be a Performer (2025)" },
  xeekin_p1: {
    ko: "XEEKIN은 누구나 무대의 중심에서 퍼포머가 될 수 있도록 설계된 인터랙티브 미디어 퍼포먼스 작품이다. 특정한 능력이나 조건을 갖춘 사람만이 무대를 점유하는 기존 구조에서 벗어나, 참여하는 순간 즉시 스포트라이트가 켜지는 무대, 즉 “모두의 공연”을 만들기 위한 시도에서 출발했다.",
    en: "XEEKIN is an interactive media performance designed so anyone can stand at the center of the stage. It departs from stages reserved for the few, and instead lights the spotlight the moment you participate—building a truly ‘performance for everyone.’",
  },
  xeekin_p2: {
    ko: "XEEKIN은 게임의 재미, 음악적 리듬성, 실시간 시각효과, 그리고 퍼포먼스의 강렬함을 하나의 경험으로 결합한다. 이를 통해 관객은 단순한 감상자를 넘어, 자신만의 방식으로 공간을 움직이고, 연주하고, 주인공이 되는 경험을 얻게 된다.",
    en: "XEEKIN fuses game-like fun, musical rhythm, real-time visuals, and the intensity of performance into one experience. Audiences go beyond passive viewing to move space, play, and become the protagonist in their own way.",
  },
};

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: keyof typeof DICT) => string } | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved === "ko" || saved === "en") return saved;
    const nav = navigator.language.toLowerCase();
    return nav.startsWith("ko") ? "ko" : "en";
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useMemo(() => {
    return (k: keyof typeof DICT) => DICT[k][lang] ?? "";
  }, [lang]);

  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider>");
  return ctx;
}
