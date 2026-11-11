import { useEffect, type RefObject } from "react";

/**
 * Video yalnızca ekranda görünürken ve kullanıcı duraklatmadıysa oynar.
 * Ekran dışındaki videoyu durdurmak, çözücüyü (decoder) ve GPU'yu boşaltır;
 * sayfadaki diğer videonun takılmasını önler.
 */
export function useInViewPlayback(video: RefObject<HTMLVideoElement | null>, wantsPlay: boolean) {
  useEffect(() => {
    const v = video.current;
    if (!v) return;

    let visible = false;
    const sync = () => {
      if (visible && wantsPlay) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.15 }
    );
    io.observe(v);

    const onVisibility = () => {
      if (document.hidden) v.pause();
      else sync();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [video, wantsPlay]);
}
