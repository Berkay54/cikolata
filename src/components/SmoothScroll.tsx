"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Landing page için yumuşak kaydırma (Lenis).
 * - Tarayıcının kendi kaydırmasını korur: sticky öğeler ve ScrollTrigger animasyonları çalışmaya devam eder.
 * - GSAP ile aynı karede (ticker) çalışır; ScrollTrigger her kaydırmada güncellenir.
 * - Sayfa içi bağlantılar (#hikayemiz, #iletisim, "Yukarı Dön") yumuşakça kayar.
 * - "Hareketi azalt" tercihi açık kullanıcılarda devre dışı kalır.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.085, // düşük değer = daha yumuşak, ağırbaşlı bir süzülme
      smoothWheel: true,
      wheelMultiplier: 0.95,
      // Dokunmatik ekranlarda telefonun kendi kaydırması kullanılır (en doğal his)
      syncTouch: false,
      // Açık mobil menünün içi tarayıcının kendi kaydırmasıyla çalışır; arka plan kaymaz
      prevent: (node) => node.id === "mobil-menu" || node.id === "sayfa-ici-arama",
    });

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Sayfa içi bağlantılar: "#" en üste, "#bolum" ilgili bölüme yumuşakça kayar
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute("href") ?? "#";
      const target = hash === "#" ? 0 : document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target === null) return;
      e.preventDefault();
      // Mobil menü kapanırken sayfa kilidi kalksın diye bir kare bekle
      requestAnimationFrame(() => {
        lenis.scrollTo(target, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
      });
      if (hash !== "#") history.replaceState(null, "", hash);
      else history.replaceState(null, "", window.location.pathname);
    };
    document.addEventListener("click", onClick);

    // Sayfa içi arama sonuçları: bulunan öğeyi ekranın üst üçte birine getir
    const onScrollTo = (e: Event) => {
      const el = (e as CustomEvent<HTMLElement>).detail;
      if (el) lenis.scrollTo(el, { offset: -window.innerHeight / 3, duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
    };
    window.addEventListener("site:scrollto", onScrollTo);

    return () => {
      window.removeEventListener("site:scrollto", onScrollTo);
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
