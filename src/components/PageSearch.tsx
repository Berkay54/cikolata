"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Sayfa içi arama. Açıldığı anda sayfadaki görünür metinleri (başlık, paragraf, liste…) tarar.
 * - Türkçe karakter ve büyük/küçük harf duyarsızdır: "cikolata" → "Çikolata".
 * - Sonuca tıklanınca ilgili yere yumuşakça kayar ve metni kısa süre vurgular.
 * - Kapalı akordeon içindeki metin bulunursa önce o akordeon açılır.
 */

type Hit = { el: HTMLElement; text: string; section: string; key: string };

const SELECTOR = "h1, h2, h3, p, li, dt, dd, figcaption, blockquote";
const MAX_RESULTS = 8;

const TR_MAP: Record<string, string> = { ç: "c", ğ: "g", ı: "i", İ: "i", ö: "o", ş: "s", ü: "u", â: "a", î: "i", û: "u" };
const normalize = (s: string) =>
  s
    .toLocaleLowerCase("tr")
    .replace(/[çğıİöşüâîû]/g, (c) => TR_MAP[c] ?? c)
    .replace(/\s+/g, " ")
    .trim();

function textOf(el: HTMLElement) {
  const parts: string[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (n.parentElement?.closest('[aria-hidden="true"], .sr-only')) continue;
    parts.push(n.nodeValue ?? "");
  }
  return parts.join(" ").replace(/\s+/g, " ").replace(/\s+([.,;:!?…])/g, "$1").trim();
}

function collect(): Hit[] {
  const roots = document.querySelectorAll<HTMLElement>("main, footer");
  const hits: Hit[] = [];
  const seen = new Set<string>();
  roots.forEach((root) => {
    root.querySelectorAll<HTMLElement>(SELECTOR).forEach((el, i) => {
      if (el.closest('[aria-hidden="true"], .sr-only')) return;
      // İç içe eşleşmeleri ele: içinde başka aranabilir öğe olan kapsayıcıyı atla
      if (el.querySelector(SELECTOR)) return;
      // Metin düğümleri boşlukla birleştirilir: bloklara bölünmüş başlıklar bitişik okunmaz ("Çikolatadan Daha")
      const text = textOf(el);
      if (text.length < 2) return;
      const key = `${text}|${i}`;
      if (seen.has(text)) return;
      seen.add(text);
      const section = el.closest<HTMLElement>("[data-search-label]")?.dataset.searchLabel ?? "Sayfa";
      hits.push({ el, text, section, key });
    });
  });
  return hits;
}

function snippet(text: string, query: string) {
  // Eşleşmenin etrafından kısa bir parça al; eşleşen kısmı ayrı döndür
  const nText = normalize(text);
  const nQuery = normalize(query);
  const idx = nText.indexOf(nQuery);
  if (idx < 0) return { before: text.slice(0, 120), match: "", after: "" };
  // normalize uzunluğu korur (tek karakter → tek karakter), boşluk sadeleştirmesi zaten uygulandı
  const start = Math.max(0, idx - 48);
  const end = Math.min(text.length, idx + nQuery.length + 72);
  return {
    before: (start > 0 ? "…" : "") + text.slice(start, idx),
    match: text.slice(idx, idx + nQuery.length),
    after: text.slice(idx + nQuery.length, end) + (end < text.length ? "…" : ""),
  };
}

function reveal(el: HTMLElement) {
  // Kapalı akordeon içindeyse önce aç
  const region = el.closest<HTMLElement>('[role="region"][aria-labelledby]');
  const button = region ? document.getElementById(region.getAttribute("aria-labelledby") ?? "") : null;
  if (button?.getAttribute("aria-expanded") === "false") button.click();

  window.setTimeout(() => {
    // Yumuşak kaydırma (Lenis) aktifse ona devret, değilse tarayıcının kendi kaydırması
    if (document.documentElement.classList.contains("lenis")) {
      window.dispatchEvent(new CustomEvent("site:scrollto", { detail: el }));
    } else {
      el.scrollIntoView({ block: "center" });
    }
    el.classList.add("search-flash");
    window.setTimeout(() => el.classList.remove("search-flash"), 2200);
  }, button ? 380 : 0);
}

// Yalnızca açıkken render edilir; her açılışta dizin sıfırdan, o anki sayfadan oluşturulur.
export default function PageSearch({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [index] = useState<Hit[]>(() => collect());
  const input = useRef<HTMLInputElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // Açılınca: odağı ver, sayfa kaydırmasını kilitle, Esc ile kapat
  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(() => input.current?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const items = panel.current.querySelectorAll<HTMLElement>("input, button, [role='option']");
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const results = useMemo(() => {
    const q = normalize(query);
    if (q.length < 2) return [];
    return index.filter((h) => normalize(h.text).includes(q)).slice(0, MAX_RESULTS);
  }, [query, index]);

  const choose = (hit: Hit | undefined) => {
    if (!hit) return;
    onClose();
    requestAnimationFrame(() => reveal(hit.el));
  };

  return createPortal(
    <div
      id="sayfa-ici-arama"
      role="dialog"
      aria-modal="true"
      aria-label="Sayfada ara"
      className="fixed inset-0 z-[60] flex justify-center overflow-y-auto overscroll-contain bg-cocoa-950/92 px-4 pb-10 pt-[12vh] backdrop-blur-[2px] sm:px-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div ref={panel} className="h-fit w-full max-w-2xl border border-gold/30 bg-cocoa-900 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3 border-b border-gold/20 px-5">
          <SearchIcon className="h-5 w-5 shrink-0 text-gold" />
          <label htmlFor="sayfa-arama-girdi" className="sr-only">
            Sayfada ara
          </label>
          <input
            ref={input}
            id="sayfa-arama-girdi"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, Math.max(results.length - 1, 0)));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                choose(results[active]);
              }
            }}
            placeholder="Ürün, hizmet veya içerik ara…"
            autoComplete="off"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="sayfa-arama-sonuclari"
            aria-activedescendant={results[active] ? `arama-sonuc-${active}` : undefined}
            className="h-16 w-full bg-transparent outline-none focus:outline-none focus-visible:outline-none text-[1.125rem] font-medium text-cream placeholder:text-cream-muted/70 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-sm border border-gold/30 px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-cream-muted transition-colors hover:border-gold hover:text-cream"
          >
            Esc
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim().length < 2 ? (
            <p className="px-5 py-6 text-[0.9rem] font-medium text-cream-muted">
              Aramak için en az 2 harf yazın. Örneğin: <span className="text-gold-bright">fıstık</span>,{" "}
              <span className="text-gold-bright">kurumsal</span>, <span className="text-gold-bright">waffle</span>
            </p>
          ) : results.length === 0 ? (
            <p className="px-5 py-6 text-[0.9rem] font-medium text-cream-muted">
              “{query}” için sonuç bulunamadı. Farklı bir kelime deneyin.
            </p>
          ) : (
            <ul id="sayfa-arama-sonuclari" role="listbox" aria-label="Arama sonuçları" className="py-2">
              {results.map((hit, i) => {
                const s = snippet(hit.text, query);
                return (
                  <li
                    key={hit.key}
                    id={`arama-sonuc-${i}`}
                    role="option"
                    aria-selected={i === active}
                    tabIndex={-1}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => choose(hit)}
                    className={`cursor-pointer px-5 py-3.5 transition-colors ${i === active ? "bg-gold/12" : ""}`}
                  >
                    <span className="block text-[0.64rem] font-bold uppercase tracking-[0.22em] text-gold">
                      {hit.section}
                    </span>
                    <span className="mt-1 block text-[0.95rem] font-medium leading-snug text-cream">
                      {s.before}
                      <mark className="bg-gold/30 text-cream">{s.match}</mark>
                      {s.after}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}
