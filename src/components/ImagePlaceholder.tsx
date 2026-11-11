type Props = {
  /** Ekran okuyucu ve ekranda görünen kısa etiket, ör. "Pralin Kutusu görseli". */
  label: string;
  /** Küçük alanlarda (dar kart) yalnızca simge gösterilir. */
  compact?: boolean;
  className?: string;
};

// Geçici görsel alanı: gerçek fotoğraflar gelene kadar kakao tonlarında, ince altın çerçeveli bir yüzey.
// Kapsayıcının boyutunu doldurur (absolute inset-0); oran ve köşe yuvarlaklığı kapsayıcıdan gelir.
export default function ImagePlaceholder({ label, compact = false, className = "" }: Props) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[radial-gradient(120%_90%_at_30%_20%,#3a2418_0%,#2a1810_45%,#1a0f09_100%)] text-gold/75 ${className}`}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-2 border border-gold/20" />
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="h-6 w-6" aria-hidden="true">
        <rect x="3" y="4.5" width="18" height="15" rx="1.5" />
        <circle cx="9" cy="10" r="1.8" />
        <path d="m4 18 5.5-5 4 3.5 3-2.5L20 17" />
      </svg>
      {!compact && (
        <span className="px-4 text-center text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-cream-muted/80">
          Görsel Alanı
        </span>
      )}
    </div>
  );
}
