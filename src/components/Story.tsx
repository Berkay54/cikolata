"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useInViewPlayback } from "@/lib/useInViewPlayback";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CLOSING = ["El Emeği", "Ustalık", "Tutku"];

// 2. bölüm: "Kakaonun Kalbine Yolculuk". Dergi açılışı kurgusu:
// sayfa genişliğinde başlık, asimetrik video + drop cap'li metin, üç kelimelik kapanış.
export default function Story() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  // Video yalnızca bölüm görünürken oynar (sayfa yüklenirken indirilmez)
  useInViewPlayback(video, playing);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Başlık satırları maskeden yükselir
        gsap.from(".story-line", {
          yPercent: 108,
          duration: 1.3,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".story-title", start: "top 82%", once: true },
        });

        // Metin grupları: hafif fade-up, her grup bir kez
        gsap.utils.toArray<HTMLElement>(".story-group").forEach((group) => {
          gsap.from(group.querySelectorAll(".story-fade"), {
            y: 24,
            autoAlpha: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.1,
            scrollTrigger: { trigger: group, start: "top 84%", once: true },
          });
        });

        // Video: çok düşük yoğunluklu parallax (kilitleme yok)
        gsap.fromTo(
          ".story-parallax",
          { yPercent: -2.5 },
          {
            yPercent: 2.5,
            ease: "none",
            scrollTrigger: { trigger: ".story-media", start: "top bottom", end: "bottom top", scrub: 0.5 },
          }
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        setPlaying(false);
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="hikayemiz" data-search-label="Hikâyemiz"
      aria-labelledby="hikaye-baslik"
      className="overflow-hidden bg-paper pb-20 pt-20 text-ink selection:bg-ink selection:text-paper sm:pb-24 sm:pt-28 lg:pb-28 lg:pt-36"
    >
      <div className="mx-auto w-full max-w-[90rem] px-5 sm:px-10 lg:px-14">
        {/* Açılış: etiket ve sayfa genişliğinde başlık */}
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-brass-deep">Atölye / Hikâyemiz</p>

        <h2
          id="hikaye-baslik"
          className="story-title display-sturdy mt-6 font-display font-medium text-[clamp(3.1rem,11.5vw,5rem)] leading-[0.95] tracking-[-0.025em] text-ink sm:mt-8 lg:text-[clamp(5rem,8.6vw,8.5rem)] lg:leading-[0.92]"
        >
          <span className="block overflow-hidden pb-[0.08em]">
            <span className="story-line block">
              Kakaonun <em className="italic text-brass">Kalbine</em>
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.08em] lg:pl-[38%]">
            <span className="story-line block">Yolculuk</span>
          </span>
        </h2>

        {/* Asimetrik gövde: solda metin, sağda aşağı kaydırılmış video. Mobilde video önce. */}
        <div className="mt-12 grid grid-cols-1 gap-12 sm:mt-16 lg:mt-20 lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
          <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:pt-6">
            <div className="story-media relative aspect-video overflow-hidden rounded-[6px] bg-ink/10 shadow-[0_32px_64px_-32px_rgba(44,27,21,0.5)]">
              {/* Parallax için video %6 taşırılır; kayma ±%2,5 olduğundan kenarlardan anlamlı detay kesilmez */}
              <div className="story-parallax absolute inset-x-0 -top-[3%] h-[106%]">
                <video
                  ref={video}
                  className="h-full w-full object-cover"
                  src="/videos/temperleme.mp4"
                  poster="/videos/temperleme-poster.jpg"
                  muted
                  loop
                  playsInline
                  preload="none"
                  disablePictureInPicture
                  disableRemotePlayback
                  aria-label="Usta, mermer tezgâh üzerinde erimiş çikolatayı spatulayla temperliyor"
                />
              </div>

              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="absolute bottom-3 right-3 flex h-8 items-center gap-2 rounded-full bg-ink/70 pl-2.5 pr-3.5 text-[0.62rem] uppercase tracking-[0.18em] text-paper transition-colors duration-300 hover:bg-ink/90 sm:bottom-4 sm:right-4"
              >
                <svg viewBox="0 0 12 12" fill="currentColor" className="h-2.5 w-2.5 text-brass" aria-hidden="true">
                  {playing ? (
                    <>
                      <rect x="2" y="1" width="2.4" height="10" />
                      <rect x="7.6" y="1" width="2.4" height="10" />
                    </>
                  ) : (
                    <path d="M3 1.2v9.6L10.4 6 3 1.2Z" />
                  )}
                </svg>
                {playing ? "Videoyu durdur" : "Videoyu oynat"}
              </button>
            </div>
          </div>

          <div className="story-group lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:flex lg:flex-col lg:justify-between lg:gap-14">
            <p className="story-fade max-w-[30rem] text-[1.0625rem] font-[450] leading-[1.85] text-ink first-letter:float-left first-letter:mr-3 first-letter:mt-[0.42rem] first-letter:font-display first-letter:font-medium first-letter:[font-variation-settings:'opsz'_28] first-letter:text-[5.7rem] first-letter:leading-[0.7] first-letter:text-brass sm:text-[1.125rem]">
              Hikâyemiz, Belçika&apos;nın köklü çikolata geleneğinden aldığımız ilhamla başlıyor. Bizim için çikolata
              yalnızca bir lezzet değil; sabırla, özenle ve ustalıkla şekillenen bir sanat. Her dokunuşta aynı tutku, her
              parçada aynı özen.
            </p>

            <blockquote className="story-fade mt-12 lg:mt-0">
              <p className="display-sturdy font-display font-medium text-[clamp(1.9rem,6.4vw,2.9rem)] italic leading-[1.12] tracking-[-0.01em] text-ink">
                <span aria-hidden="true" className="mr-1 text-brass">
                  “
                </span>
                Her parça, kendine özgü bir sanat.
              </p>
            </blockquote>
          </div>
        </div>

        {/* Kapanış: üç kelime */}
        <div className="story-group mt-20 border-t border-ink/15 pt-8 sm:mt-24 sm:pt-10 lg:mt-28">
          <p className="sr-only">El emeği, ustalık, tutku.</p>
          <ul
            aria-hidden="true"
            className="display-sturdy flex flex-wrap items-baseline justify-center gap-x-5 gap-y-1 font-display font-medium text-[clamp(1.9rem,7vw,2.6rem)] leading-[1.15] tracking-[-0.01em] text-ink sm:justify-between sm:text-[clamp(2.2rem,5.6vw,5rem)]"
          >
            {CLOSING.map((word, i) => (
              <li key={word} className={`story-fade ${i === 1 ? "italic text-brass" : ""}`}>
                {word}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
