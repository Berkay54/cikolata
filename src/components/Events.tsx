"use client";

import { useId, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useInViewPlayback } from "@/lib/useInViewPlayback";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Metinler mevcut siteden: docs/icerik/etkinliklerimiz.md
type Service = {
  name: string;
  summary: string;
  occasions: string[];
  details: { label: string; text: string }[];
};

const SERVICES: Service[] = [
  {
    name: "Çikolata Şelalesi",
    summary:
      "En kaliteli Belçika çikolatası, tam kıvamında ve sıcacık, sürekli bir döngüyle akar. Davetlerinizde hem göze hem damağa hitap eden bir sunum.",
    occasions: ["Düğün", "Nişan", "Kurumsal"],
    details: [
      { label: "Taze Meyveler", text: "Çilek, ananas ve muz; sıcacık Belçika çikolatasıyla buluşmaya hazır." },
    ],
  },
  {
    name: "Ofis Gurme İstasyonu",
    summary:
      "Toplantı aralarında, kutlamalarda veya motivasyon günlerinde ofisinizi bir gurme istasyonuna dönüştürüyoruz.",
    occasions: ["Toplantı", "Kutlama", "Motivasyon günü"],
    details: [
      { label: "Gerçek Sıcak Çikolata", text: "Toz karışımlar yerine erimiş saf Belçika çikolatası ve taze sütle, yoğun kıvamda." },
    ],
  },
  {
    name: "Waffle",
    summary:
      "Waffle makinelerimizle mekânınıza geliyor, konuklarınızın gözü önünde anlık üretim yapıyoruz. Bir tatlı servisi değil, canlı bir performans.",
    occasions: ["Kurumsal", "Özel gün"],
    details: [
      { label: "Kurumsal Motivasyon", text: "Çalışanlarınız için tatlı bir sürpriz." },
      { label: "Kişiye Özel Menü", text: "Etkinliğinizin konseptine uygun süslemeler ve sunumlar." },
      { label: "Hijyen ve Hız", text: "Hijyenik ve taze servis." },
    ],
  },
  {
    name: "Bardakta Fondü",
    summary: "Kat kat lezzet, her kaşıkta ayrı bir keyif. Karmaşadan uzak, yalnızca en kaliteli malzemeler.",
    occasions: ["Davet", "Kurumsal"],
    details: [
      { label: "En alt katman", text: "Taze çilekler ve muz dilimleri." },
      { label: "Orta katman", text: "Çıtır, özel yapım tereyağlı bisküvi parçaları." },
      { label: "Final dokunuşu", text: "Cömertçe gezdirilen, sıcacık ve ipeksi Belçika çikolatası." },
    ],
  },
];

const ADVANTAGES = [
  { title: "Mobil İstasyon Kurulumu", text: "Ofis içi veya dış mekân alanınıza uygun, şık ve profesyonel standlar." },
  { title: "Kişiselleştirilmiş Sunum", text: "Bardaklarda kurum logonuza yer vererek marka sadakatini pekiştiriyoruz." },
  { title: "Profesyonel Ekip", text: "Deneyimli baristalarla, hijyenden ödün vermeden hızlı ve kaliteli servis." },
  { title: "Butik Kalite", text: "Endüstriyel ürün kullanmıyor, her bardakta artizan dükkân kalitesini taşıyoruz." },
];

// 4. bölüm: Etkinlik hizmetleri. Solda yapışkan video, sağda menü kartı gibi hizmet listesi.
export default function Events() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [open, setOpen] = useState(0);
  const baseId = useId();

  useInViewPlayback(video, playing);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const lift = ctx.conditions?.desktop ? 24 : 14;
          const fadeGroup = (selector: string, trigger: string) =>
            gsap.from(selector, {
              y: lift,
              autoAlpha: 0,
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.08,
              scrollTrigger: { trigger, start: "top 84%", once: true },
            });

          fadeGroup(".events-head > *", ".events-head");
          fadeGroup(".events-media", ".events-media");
          fadeGroup(".events-row", ".events-list");
          fadeGroup(".events-adv", ".events-advantages");
        }
      );

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
      id="etkinliklerimiz" data-search-label="Etkinlik Hizmetleri"
      aria-labelledby="etkinlik-baslik"
      className="bg-paper py-20 text-ink selection:bg-ink selection:text-paper sm:py-28 lg:py-36"
    >
      <div className="mx-auto w-full max-w-[90rem] px-5 sm:px-10 lg:px-14">
        {/* Başlık */}
        <header className="events-head grid grid-cols-1 gap-y-6 lg:grid-cols-12 lg:items-end lg:gap-x-12">
          <h2
            id="etkinlik-baslik"
            className="display-sturdy font-display text-[clamp(2.6rem,9.5vw,4.25rem)] font-semibold leading-[1.06] tracking-[-0.02em] text-ink lg:col-span-7 lg:text-[clamp(3.75rem,5.8vw,5.75rem)]"
          >
            Davetlerinize <em className="block pt-[0.12em] italic text-brass">Tatlı Bir İmza.</em>
          </h2>
          <p className="max-w-[28rem] text-[1.0625rem] font-medium leading-[1.75] text-ink sm:text-[1.125rem] lg:col-span-4 lg:col-start-9 lg:pb-3">
            Düğün, nişan ve kurumsal etkinliklerinize hem şıklık hem lezzet katıyoruz. Profesyonel ekibimizle
            etkinliğinizi bir festival havasına çevirelim.
          </p>
        </header>

        <div className="mt-14 grid grid-cols-1 gap-12 sm:mt-16 lg:mt-24 lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          {/* Video: masaüstünde kaydırma boyunca görünür kalır (sabitleme değil, sticky) */}
          <figure className="events-media lg:sticky lg:top-24 lg:col-span-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-ink/10 lg:aspect-[4/5]">
              <video
                ref={video}
                className="h-full w-full object-cover object-center"
                src="/videos/etkinlik-waffle.mp4"
                poster="/videos/etkinlik-waffle-poster.jpg"
                muted
                loop
                playsInline
                preload="none"
                disablePictureInPicture
                disableRemotePlayback
                aria-label="Meyveli ve dondurmalı waffle'ın üzerine sıcak Belçika çikolatası dökülüyor"
              />
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="absolute bottom-3 right-3 flex h-8 items-center gap-2 rounded-full bg-ink/70 pl-2.5 pr-3.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-paper transition-colors duration-300 hover:bg-ink/90 sm:bottom-4 sm:right-4"
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
            <figcaption className="mt-4 flex items-baseline justify-between gap-4 text-[0.78rem] font-medium text-ink/85">
              <span className="font-display text-[1rem] font-semibold italic text-ink">Waffle</span>
              <span className="font-semibold uppercase tracking-[0.22em] text-brass-deep">Canlı üretim</span>
            </figcaption>
          </figure>

          {/* Hizmet menüsü */}
          <div className="lg:col-span-7">
            <ul className="events-list border-t border-ink/20">
              {SERVICES.map((s, i) => {
                const isOpen = open === i;
                const panelId = `${baseId}-panel-${i}`;
                const buttonId = `${baseId}-button-${i}`;
                return (
                  <li key={s.name} className="events-row border-b border-ink/20">
                    <h3>
                      <button
                        id={buttonId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpen(isOpen ? -1 : i)}
                        className="group flex w-full items-start justify-between gap-6 py-6 text-left sm:py-7"
                      >
                        <span className="min-w-0">
                          <span className="display-sturdy block font-display text-[clamp(1.6rem,5.6vw,2.1rem)] font-semibold leading-[1.1] text-ink transition-colors duration-300 group-hover:text-brass-deep">
                            {s.name}
                          </span>
                          <span className="mt-2 block text-[0.7rem] font-bold uppercase tracking-[0.22em] text-brass-deep">
                            {s.occasions.join(" · ")}
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className="relative mt-3 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/30 transition-colors duration-300 group-hover:border-brass"
                        >
                          <span className="absolute h-[1.5px] w-3.5 bg-ink" />
                          <span
                            className={`absolute h-3.5 w-[1.5px] bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                              isOpen ? "scale-y-0" : "scale-y-100"
                            }`}
                          />
                        </span>
                      </button>
                    </h3>

                    {/* Yükseklik animasyonu: grid-rows 0fr → 1fr */}
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden" inert={!isOpen}>
                        <p className="max-w-[36rem] pb-5 text-[1.0625rem] font-medium leading-[1.8] text-ink">
                          {s.summary}
                        </p>
                        <dl className="grid grid-cols-1 gap-x-8 gap-y-4 pb-8 sm:grid-cols-2">
                          {s.details.map((d) => (
                            <div key={d.label} className="border-l border-brass/60 pl-4">
                              <dt className="font-display text-[1.05rem] font-semibold italic text-ink">{d.label}</dt>
                              <dd className="mt-1 text-[0.95rem] font-medium leading-[1.6] text-ink/90">{d.text}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Kurumsal avantajlar */}
        <div className="events-advantages mt-20 sm:mt-24 lg:mt-28">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.28em] text-brass-deep">Kurumsal Avantajlar</p>
          <ul className="mt-6 grid grid-cols-1 border-t border-ink/20 sm:grid-cols-2 lg:grid-cols-4">
            {ADVANTAGES.map((a, i) => (
              <li
                key={a.title}
                className={`events-adv border-b border-ink/20 py-6 sm:pr-8 lg:border-b-0 lg:py-8 ${
                  i > 0 ? "lg:border-l lg:pl-8" : ""
                } ${i % 2 === 1 ? "sm:border-l sm:pl-8 lg:pl-8" : ""}`}
              >
                <h3 className="display-sturdy font-display text-[1.35rem] font-semibold leading-tight text-ink">{a.title}</h3>
                <p className="mt-2 text-[0.97rem] font-medium leading-[1.65] text-ink/90">{a.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
