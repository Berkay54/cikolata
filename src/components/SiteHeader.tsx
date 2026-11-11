"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { NAV, WHATSAPP_URL } from "@/lib/site";
import Logo from "@/components/Logo";
import PageSearch, { SearchIcon } from "@/components/PageSearch";

const noopSubscribe = () => () => {};

const LINK_UNDERLINE =
  "relative after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.16,1,0.3,1)] hover:after:scale-x-100";

export default function SiteHeader({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLButtonElement>(null);
  // Portal yalnızca tarayıcıda (document.body hazırken) render edilir
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    searchRef.current?.focus();
  }, []);

  // Klavye kısayolu: Ctrl/Cmd + K ya da "/" ile arama açılır
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement | null)?.closest("input, textarea, [contenteditable='true']");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  return (
    <>
      <header
        className={`mx-auto flex w-full max-w-[90rem] items-center justify-between gap-4 px-5 pt-4 sm:px-10 sm:pt-5 lg:px-14 lg:pt-5 ${className}`}
      >
        <Wordmark preload />

        <nav aria-label="Ana menü" className="hidden lg:block">
          <ul className="flex items-center gap-10">
            {NAV.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={`py-2 text-[0.72rem] uppercase tracking-[0.28em] text-cream-muted transition-colors duration-300 hover:text-cream ${LINK_UNDERLINE}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            ref={searchRef}
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Sayfada ara"
            aria-haspopup="dialog"
            title="Sayfada ara (Ctrl + K)"
            className="grid h-11 w-11 place-items-center border border-gold/50 text-cream transition-colors duration-300 hover:border-gold hover:text-gold-bright"
          >
            <SearchIcon className="h-[18px] w-[18px]" />
          </button>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp'tan sipariş ver"
            className="flex h-11 items-center gap-2.5 border border-gold/50 px-3.5 text-[0.7rem] uppercase tracking-[0.24em] text-cream transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-cocoa-950 sm:px-5"
          >
            <ChatIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Sipariş Ver</span>
          </a>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobil-menu"
            aria-label="Menüyü aç"
            className="group flex h-11 items-center gap-3 border border-gold/50 px-3.5 text-cream transition-colors duration-300 hover:border-gold lg:hidden"
          >
            <span className="hidden text-[0.7rem] uppercase tracking-[0.24em] sm:inline">Menü</span>
            <span aria-hidden="true" className="flex w-5 flex-col items-end gap-[5px]">
              <span className="h-px w-5 bg-current" />
              <span className="h-px w-3.5 bg-gold transition-all duration-300 group-hover:w-5" />
            </span>
          </button>
        </div>
      </header>

      {mounted && createPortal(<MobileMenu open={open} onClose={close} />, document.body)}
      {searchOpen && <PageSearch onClose={closeSearch} />}
    </>
  );
}

function Wordmark({ onClick, preload = false }: { onClick?: () => void; preload?: boolean }) {
  return (
    <a href="#" onClick={onClick} className="block shrink-0" aria-label="Ana sayfa">
      <Logo
        sizes="(min-width: 1024px) 160px, (min-width: 640px) 130px, 110px"
        preload={preload}
        className="h-[62px] w-auto sm:h-[72px] lg:h-[80px]"
      />
    </a>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // Açılış / kapanış animasyonu: perde yukarıdan iner, satırlar sırayla yükselir
  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    tl.current?.kill();
    const q = gsap.utils.selector(el);

    if (open) {
      gsap.set(el, { visibility: "visible" });
      if (reduce) {
        gsap.set(el, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(q(".menu-reveal"), { yPercent: 0, autoAlpha: 1 });
      } else {
        tl.current = gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "expo.inOut" })
          .fromTo(q(".menu-link"), { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.07 }, 0.4)
          .fromTo(q(".menu-rule"), { scaleX: 0 }, { scaleX: 1, duration: 1.2, stagger: 0.07 }, 0.45)
          .fromTo(q(".menu-fade"), { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.06 }, 0.7);
      }
      el.querySelector<HTMLElement>("[data-autofocus]")?.focus({ preventScroll: true });
    } else if (getComputedStyle(el).visibility === "visible") {
      if (reduce) {
        gsap.set(el, { visibility: "hidden" });
      } else {
        tl.current = gsap
          .timeline()
          .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.7, ease: "expo.inOut" })
          .set(el, { visibility: "hidden" });
      }
    }
  }, [open]);

  // Açıkken sayfa kaymasını kilitle, Esc ile kapat, Tab odağı menü içinde tut
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const items = panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) onClose();
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open, onClose]);

  return (
    <div
      ref={panel}
      id="mobil-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menü"
      aria-hidden={!open}
      style={{ visibility: "hidden", clipPath: "inset(0% 0% 100% 0%)" }}
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-cocoa-950 bg-[radial-gradient(120%_70%_at_100%_0%,rgba(200,162,101,0.14)_0%,rgba(15,8,5,0)_60%)] pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      <div className="flex items-center justify-between gap-4 px-5 pt-5 sm:px-10 sm:pt-6">
        <Wordmark onClick={onClose} />
        <button
          type="button"
          onClick={onClose}
          data-autofocus
          aria-label="Menüyü kapat"
          className="group flex h-11 items-center gap-3 border border-gold/50 px-3.5 text-cream transition-colors duration-300 hover:border-gold"
        >
          <span className="hidden text-[0.7rem] uppercase tracking-[0.24em] sm:inline">Kapat</span>
          <span aria-hidden="true" className="relative block h-5 w-5">
            <span className="absolute left-0 top-1/2 h-px w-5 rotate-45 bg-current" />
            <span className="absolute left-0 top-1/2 h-px w-5 -rotate-45 bg-gold" />
          </span>
        </button>
      </div>

      <nav aria-label="Mobil menü" className="mt-[clamp(1rem,6svh,3.5rem)] px-5 sm:px-10">
        <ul>
          {NAV.map((item) => (
            <li key={item.label} className="relative">
              <a
                href={item.href}
                onClick={onClose}
                className="group flex items-baseline justify-between gap-4 overflow-hidden py-[clamp(0.45rem,1.6svh,0.9rem)]"
              >
                <span className="menu-link menu-reveal block font-display text-[clamp(1.4rem,min(6.6vw,6svh),2.4rem)] leading-[1.1] text-cream transition-colors duration-300 group-hover:text-gold-bright group-active:text-gold-bright">
                  {item.label}
                </span>
                <span
                  aria-hidden="true"
                  className="menu-link menu-reveal block text-gold transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                >
                  <ArrowIcon className="h-2.5 w-5" />
                </span>
              </a>
              <span aria-hidden="true" className="menu-rule absolute inset-x-0 bottom-0 h-px origin-left bg-gold/25" />
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto px-5 pt-10 sm:px-10">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="menu-fade menu-reveal flex h-14 w-full items-center justify-center gap-3 bg-gold text-[0.75rem] font-medium uppercase tracking-[0.26em] text-cocoa-950 transition-colors duration-300 hover:bg-gold-bright active:bg-gold-bright"
        >
          <ChatIcon className="h-4 w-4" />
          WhatsApp&apos;tan Sipariş
        </a>

        <p className="menu-fade menu-reveal mt-8 border-t border-gold/20 pt-5 font-display text-[1.05rem] italic text-cream-muted">
          Makine değil, usta elinden çıkmış Belçika çikolatası.
        </p>
      </div>
    </div>
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

function ChatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20.5 11.6a8.4 8.4 0 0 1-12.3 7.4L3.5 20.5l1.6-4.5A8.4 8.4 0 1 1 20.5 11.6Z" />
    </svg>
  );
}
