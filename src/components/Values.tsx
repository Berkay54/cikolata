"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Value = {
  no: string;
  title: string;
  text: string;
  image: string;
  alt: string;
};

const VALUES: Value[] = [
  {
    no: "01",
    title: "Saf Kakao Yağı",
    text: "Çikolatanın doğal karakterini ve kadifemsi dokusunu koruyan özenli içerik seçimi.",
    image: "/images/farkimiz/saf-kakao-yagi.jpg",
    alt: "Işıkta parlayan, ipeksi dalgalar halinde akan erimiş çikolata",
  },
  {
    no: "02",
    title: "Artizan Teknik",
    text: "Her parçaya hayat veren el işçiliği, hassas temperleme ve ustalıkla tamamlanan özel dokunuşlar.",
    image: "/images/farkimiz/artizan-teknik.jpg",
    alt: "Ustanın elindeki spatuladan cam kaseye süzülen erimiş çikolata",
  },
  {
    no: "03",
    title: "Taze Malzemeler",
    text: "Gerçek meyve özleri, özenle seçilen kuruyemişler ve doğal baharatlarla zenginleşen lezzetler.",
    image: "/images/farkimiz/taze-malzemeler.jpg",
    alt: "Antep fıstığı, fındık ve karamel damlalarıyla kaplı el yapımı çikolata tabletleri",
  },
];

// 3. bölüm: "Farkımız, Her Detayda". Üç değer, dönüşümlü görsel/metin blokları.
export default function Values() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const desktop = Boolean(ctx.conditions?.desktop);
          // Mobilde hareket yoğunluğu yarıya iner
          const lift = desktop ? 26 : 14;
          const drift = desktop ? 2 : 1;

          gsap.from(".values-head > *", {
            y: lift,
            autoAlpha: 0,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.1,
            scrollTrigger: { trigger: ".values-head", start: "top 82%", once: true },
          });

          gsap.utils.toArray<HTMLElement>(".value-block").forEach((block) => {
            gsap.from(block.querySelector(".value-media"), {
              y: lift,
              autoAlpha: 0,
              duration: 1.4,
              ease: "expo.out",
              scrollTrigger: { trigger: block, start: "top 80%", once: true },
            });
            gsap.from(block.querySelectorAll(".value-fade"), {
              y: lift,
              autoAlpha: 0,
              duration: 1.2,
              ease: "expo.out",
              stagger: 0.1,
              delay: 0.15,
              scrollTrigger: { trigger: block, start: "top 80%", once: true },
            });
            // Çok hafif parallax: görsel çerçevesinin içinde ±%drift kayar
            gsap.fromTo(
              block.querySelector(".value-parallax"),
              { yPercent: -drift },
              {
                yPercent: drift,
                ease: "none",
                scrollTrigger: { trigger: block, start: "top bottom", end: "bottom top", scrub: 0.6 },
              }
            );
          });

          gsap.from(".value-rule", {
            scaleX: 0,
            duration: 1.4,
            ease: "expo.inOut",
            stagger: 0.2,
            scrollTrigger: { trigger: ".values-list", start: "top 85%", once: true },
          });
        }
      );

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="farkimiz" data-search-label="Farkımız"
      aria-labelledby="farkimiz-baslik"
      className="bg-roast py-20 text-linen selection:bg-champagne selection:text-roast sm:py-28 lg:py-36"
    >
      <div className="mx-auto w-full max-w-[90rem] px-5 sm:px-10 lg:px-14">
        {/* Bölüm başlığı */}
        <header className="values-head grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-champagne lg:col-span-12">
            03 / Atölye Felsefesi
          </p>
          <h2
            id="farkimiz-baslik"
            className="display-sturdy font-display text-[clamp(2.75rem,10vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.02em] text-linen lg:col-span-7 lg:text-[clamp(4rem,6.6vw,6.5rem)]"
          >
            Farkımız, <em className="block italic text-champagne">Her Detayda.</em>
          </h2>
          <p className="max-w-[26rem] text-[1.0625rem] leading-[1.75] text-linen/85 sm:text-[1.125rem] lg:col-span-4 lg:col-start-9 lg:pb-3">
            Gerçek çikolatanın karakterini belirleyen üç vazgeçilmezimiz.
          </p>
        </header>

        {/* Üç değer */}
        <ol className="values-list mt-16 sm:mt-20 lg:mt-28">
          {VALUES.map((v, i) => {
            const textFirst = i % 2 === 1; // 2. blokta yazı solda, görsel sağda
            return (
              <li key={v.no} className="value-block relative py-12 sm:py-16 lg:py-24">
                <span aria-hidden="true" className="value-rule absolute inset-x-0 top-0 h-px origin-left bg-champagne/30" />

                <article className="grid grid-cols-1 gap-y-9 lg:grid-cols-12 lg:items-center lg:gap-x-12 xl:gap-x-16">
                  {/* Görsel: 16:9, mobilde her zaman üstte */}
                  <div className={`lg:col-span-7 ${textFirst ? "lg:order-2 lg:col-start-6" : "lg:col-start-1"}`}>
                    <div className="value-media group relative aspect-video overflow-hidden rounded-[4px] bg-linen/5">
                      {/* Parallax için alan %5 taşırılır */}
                      <div className="value-parallax absolute inset-x-0 -top-[2.5%] h-[105%]">
                        <Image
                          src={v.image}
                          alt={v.alt}
                          fill
                          quality={88}
                          sizes="(min-width: 1440px) 800px, (min-width: 1024px) 56vw, calc(100vw - 2.5rem)"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Metin */}
                  <div
                    className={`lg:col-span-5 ${textFirst ? "lg:order-1 lg:col-start-1" : "lg:col-start-8"} ${
                      textFirst ? "lg:pr-4" : "lg:pl-2"
                    }`}
                  >
                    <p
                      aria-hidden="true"
                      className="value-fade display-sturdy font-display text-[clamp(3.5rem,14vw,5rem)] font-medium italic leading-none text-champagne lg:text-[clamp(5rem,7vw,7rem)]"
                    >
                      {v.no}
                    </p>
                    <h3 className="value-fade display-sturdy mt-5 font-display text-[clamp(2rem,7vw,2.5rem)] font-medium leading-[1.08] tracking-[-0.01em] text-linen lg:mt-7 lg:text-[clamp(2.25rem,3.2vw,3rem)]">
                      <span className="sr-only">{v.no}. </span>
                      {v.title}
                    </h3>
                    <p className="value-fade mt-5 max-w-[28rem] text-[1.0625rem] font-[450] leading-[1.8] text-linen/85 lg:mt-6 lg:text-[1.125rem]">
                      {v.text}
                    </p>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
        <span aria-hidden="true" className="value-rule block h-px origin-left bg-champagne/30" />
      </div>
    </section>
  );
}
