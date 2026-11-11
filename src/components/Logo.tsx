type LogoProps = {
  className?: string;
  /** Gerçek logo gelince next/image için kullanılacak; yer tutucuda etkisiz. */
  sizes?: string;
  preload?: boolean;
};

// Geçici logo alanı: marka logosu gelene kadar aynı oranda (≈1.7:1) yer tutar.
// Logo hazır olduğunda public/brand altına koyup burada next/image ile göstermek yeterli.
export default function Logo({ className = "" }: LogoProps) {
  return (
    <span
      role="img"
      aria-label="Logo"
      className={`inline-flex aspect-[1325/779] flex-col items-center justify-center gap-[0.35em] border border-dashed border-gold/55 bg-cocoa-950/40 text-gold ${className}`}
    >
      <span className="font-display text-[0.95rem] uppercase leading-none tracking-[0.32em] pl-[0.32em] sm:text-[1.05rem]">
        Logo
      </span>
      <span className="text-[0.5rem] uppercase leading-none tracking-[0.3em] pl-[0.3em] text-cream-muted/80">
        Marka Alanı
      </span>
    </span>
  );
}
