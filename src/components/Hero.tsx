"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SiteHeader from "@/components/SiteHeader";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { WHATSAPP_URL } from "@/lib/site";
import { useInViewPlayback } from "@/lib/useInViewPlayback";

gsap.registerPlugin(useGSAP);

// Atölyenin İmzaları: görseller şimdilik yer tutucu (gerçek ürün fotoğrafları gelince eklenecek),
// metinler mevcut sitedeki ifadelerden (docs/icerik/urunlerimiz.md, ana-sayfa.md).
// href: ürün / koleksiyon sayfası hazır olduğunda yolunu yazın; boşken kart pasif görünür.
type Signature = { name: string; note: string; href?: string };

const SIGNATURES: Signature[] = [
  {
    name: "Pralin Kutusu",
    note: "Her bölmede ayrı bir dolgu; prestijli bir hediye.",
  },
  {
    name: "Bitter Koleksiyonu",
    note: "%70 kakao ile derin ve aromatik bir serüven.",
  },
  {
    name: "Özel Tasarım",
    note: "Elle işlenmiş beyaz ve sütlü çikolata halkaları.",
  },
  {
    name: "Kurumsal Hediye",
    note: "Kurumunuza özel, logolu kutularda hediyeler.",
  },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  // Video yalnızca görünürken oynar; kullanıcı durdurduysa durur
  useInViewPlayback(video, playing);
  const toggleVideo = () => setPlaying((p) => !p);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const ease = "expo.out";
        const tl = gsap.timeline({ defaults: { ease } });

        tl.set(".hero-anim", { autoAlpha: 1 })
          .from(".hero-nav > *", { y: -14, autoAlpha: 0, duration: 1.1, stagger: 0.08 }, 0.2)
          .from(".hero-line", { yPercent: 115, duration: 1.4, stagger: 0.12 }, 0.35)
          .from(".hero-sub", { y: 18, autoAlpha: 0, filter: "blur(6px)", duration: 1.2 }, 0.95)
          .from(".hero-cta > *", { y: 16, autoAlpha: 0, duration: 1, stagger: 0.1 }, 1.1)
          .from(".hero-showcase", { y: 10, autoAlpha: 0, duration: 1 }, 1.3)
          .from(".hero-video-control", { autoAlpha: 0, duration: 0.8 }, 1.6);
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".hero-anim", { autoAlpha: 1 });
        setPlaying(false);
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      aria-label="Ana sayfa" data-search-label="Ana Sayfa"
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-cocoa-950"
    >
      {/* Video arka plan. Telefonda yalnızca ilk ekranı kaplar (vitrin altında ayrı durur); sm+ tüm bölümün arkasında */}
      <div className="absolute inset-x-0 top-0 -z-10 h-svh sm:inset-0 sm:h-auto" aria-hidden="true">
        {/* Poster: video ilk kareyi çizene kadar görünür; ekran yönüne göre doğru kadraj seçilir */}
        <picture>
          <source media="(orientation: portrait)" srcSet="/videos/hero-dikey-poster.jpg" />
          <img
            src="/videos/hero-poster.jpg"
            alt=""
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover object-[62%_center] portrait:object-center"
          />
        </picture>
        {/* Dikey ekranlar (telefon, dikey tablet) çikolatalara odaklı 810×1080 kadrajı indirir; yatay ekranlar 1920×1080 */}
        <video
          ref={video}
          className="hero-video relative h-full w-full object-cover object-[62%_center] portrait:object-center"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
        >
          <source media="(orientation: portrait)" src="/videos/hero-dikey.mp4" type="video/mp4" />
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        {/* Sol tarafta okunabilirlik için kakao tonunda geçiş (sm+) */}
        <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(15,8,5,0.92)_0%,rgba(15,8,5,0.72)_32%,rgba(15,8,5,0.18)_62%,rgba(15,8,5,0)_80%)] sm:block" />
        <div className="absolute inset-x-0 bottom-0 hidden h-2/5 bg-[linear-gradient(0deg,rgba(15,8,5,0.95)_0%,rgba(15,8,5,0)_100%)] sm:block" />
        <div className="absolute inset-0 hidden bg-cocoa-950/55 sm:block lg:hidden" />
        {/* Telefon: video açık kalır; yalnızca alttaki yazı alanı koyulaşır ve vitrine kesintisiz bağlanır */}
        <div className="absolute inset-x-0 bottom-0 h-[68%] bg-[linear-gradient(0deg,rgba(15,8,5,1)_0%,rgba(15,8,5,0.92)_34%,rgba(15,8,5,0.62)_58%,rgba(15,8,5,0)_100%)] sm:hidden" />
        <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(15,8,5,0.7)_0%,rgba(15,8,5,0)_100%)]" />
      </div>

      <div className="hero-anim invisible flex flex-1 flex-col">
        {/* Telefonda başlık + yazılar tam bir ekran: video ortada net görünür, yazılar altta */}
        <div className="flex min-h-svh flex-col sm:min-h-0 sm:flex-1">
        <SiteHeader className="hero-nav" />

        {/* Sol taraf: ana tipografi */}
        <div className="mx-auto flex w-full max-w-[90rem] flex-1 items-end px-5 pb-20 pt-12 sm:items-center sm:px-10 sm:pb-16 sm:pt-16 lg:px-14 lg:pb-12 lg:pt-2">
          <div className="max-w-[42rem]">
            <h1 className="font-display text-cream [text-shadow:0_2px_22px_rgba(15,8,5,0.7)] sm:[text-shadow:none]">
              <span className="block overflow-hidden pb-[0.06em]">
                <span className="hero-line block text-[clamp(2.4rem,11vw,4.6rem)] lg:text-[clamp(4rem,6.4vw,6rem)] font-normal leading-[0.98] tracking-[-0.02em]">
                  Bir Çikolatadan
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.06em]">
                <span className="hero-line block text-[clamp(2.4rem,11vw,4.6rem)] lg:text-[clamp(4rem,6.4vw,6rem)] font-normal leading-[0.98] tracking-[-0.02em]">
                  Daha Fazlası
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.12em] pt-[0.18em]">
                <span className="hero-line block text-[clamp(1.3rem,5.4vw,2.2rem)] lg:text-[clamp(1.85rem,2.8vw,2.7rem)] italic leading-[1.05] tracking-[-0.01em] text-gold-bright">
                  sanatın en tatlı hali.
                </span>
              </span>
            </h1>

            <p className="hero-sub mt-4 max-w-[34rem] text-[1rem] leading-[1.6] text-cream sm:mt-7 sm:text-[1.125rem] sm:leading-[1.75] sm:text-cream-muted">
              Gerçek Belçika çikolatasının yoğunluğu, el yapımı artizan dokunuşlarla buluştu.
              Her bir parçada tutku, ustalık ve saf lezzet var.
            </p>

            <div className="hero-cta mt-6 flex sm:mt-10 flex-wrap items-center gap-x-8 gap-y-5">
              <a
                href="#urunlerimiz"
                className="group inline-flex w-full items-center justify-center gap-4 bg-gold px-7 py-4 sm:w-auto text-[0.75rem] font-medium uppercase tracking-[0.26em] text-cocoa-950 shadow-[0_12px_32px_-12px_rgba(200,162,101,0.55)] transition-colors duration-300 hover:bg-gold-bright"
              >
                Ürünlerimizi Keşfedin
                <ArrowIcon className="h-3.5 w-6 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5" />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 py-2 text-[0.75rem] uppercase tracking-[0.26em] text-cream underline decoration-gold/50 decoration-1 underline-offset-[10px] transition-colors duration-300 hover:decoration-gold"
              >
                WhatsApp&apos;tan Sipariş
              </a>
            </div>
          </div>
        </div>
        </div>

        {/* Atölyenin İmzaları: ürün vitrini */}
        <div className="relative mx-auto w-full max-w-[90rem] px-5 pb-5 sm:px-10 lg:px-14 lg:pb-7">
          {/* Video kontrolü: şeritten ayrı, sağ alt köşede */}
          <button
            type="button"
            onClick={toggleVideo}
            aria-pressed={!playing}
            className="hero-video-control absolute bottom-full right-5 mb-3 flex h-9 items-center gap-2.5 rounded-full border border-cream/25 bg-cocoa-950/75 pl-3 pr-4 text-[0.66rem] uppercase tracking-[0.2em] text-cream transition-colors duration-300 hover:border-gold/70 sm:right-10 lg:right-14"
          >
            {playing ? <PauseIcon className="h-2.5 w-2.5 text-gold" /> : <PlayIcon className="h-2.5 w-2.5 text-gold" />}
            {playing ? "Videoyu durdur" : "Videoyu oynat"}
          </button>

          <section
            aria-labelledby="imzalar-baslik"
            className="hero-showcase border border-gold/30 bg-cocoa-950/85 py-5 xl:px-5 xl:py-4"
          >
            <header className="px-5 sm:px-6 xl:flex xl:items-baseline xl:gap-4 xl:px-0">
              <h2 id="imzalar-baslik" className="font-display text-[1.35rem] leading-tight text-cream">
                Atölyenin İmzaları
              </h2>
              <p className="mt-1 text-[0.85rem] leading-snug text-cream-muted xl:mt-0">
                Hediye kutusundan bitter koleksiyonuna, dört imza seçki.
              </p>
            </header>

            <ul className="mt-4 grid grid-cols-2 gap-2.5 px-4 sm:grid-cols-4 sm:gap-3 sm:px-6 xl:mt-3 xl:px-0">
              {SIGNATURES.map((item) => (
                <li key={item.name} className="min-w-0">
                  <SignatureCard item={item} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <noscript>
        <style>{`.hero-anim{visibility:visible}`}</style>
      </noscript>
    </section>
  );
}

function SignatureCard({ item }: { item: Signature }) {
  const body = (
    <>
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-cocoa-800 xl:aspect-auto xl:w-[5.5rem] xl:self-stretch">
        <ImagePlaceholder label={`${item.name} görseli`} compact />
      </div>
      <div className="min-w-0 flex-1 px-3 pb-3 pt-2.5 xl:px-0 xl:py-2.5 xl:pr-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-[1rem] leading-tight text-cream sm:text-[1.1rem]">{item.name}</h3>
          {item.href && (
            <ArrowIcon className="h-2.5 w-4 shrink-0 text-gold transition-transform duration-300 group-hover:translate-x-0.5" />
          )}
        </div>
        <p className="mt-1 text-[0.75rem] leading-[1.45] text-cream-muted sm:text-[0.8rem]">{item.note}</p>
      </div>
    </>
  );

  const base = "flex h-full flex-col overflow-hidden border border-gold/15 bg-cocoa-900/90 xl:min-h-[5rem] xl:flex-row xl:items-stretch xl:gap-3.5";

  return item.href ? (
    <a href={item.href} className={`group ${base} transition-colors duration-300 hover:border-gold/50`}>
      {body}
    </a>
  ) : (
    <article className={base}>{body}</article>
  );
}

type IconProps = { className?: string };

function ArrowIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="1.25" className={className} aria-hidden="true">
      <path d="M0 6h22M17 1l5 5-5 5" />
    </svg>
  );
}

function PauseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" className={className} aria-hidden="true">
      <rect x="2" y="1" width="2.4" height="10" />
      <rect x="7.6" y="1" width="2.4" height="10" />
    </svg>
  );
}

function PlayIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" className={className} aria-hidden="true">
      <path d="M3 1.2v9.6L10.4 6 3 1.2Z" />
    </svg>
  );
}
