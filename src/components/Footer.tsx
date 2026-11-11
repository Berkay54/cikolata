import Logo from "@/components/Logo";
import { WHATSAPP_URL } from "@/lib/site";

// Footer yalnızca sayfada gerçekten var olan bölümlere bağlantı verir.
const EXPLORE = [
  { label: "Hikâyemiz", href: "#hikayemiz" },
  { label: "Farkımız", href: "#farkimiz" },
  { label: "Etkinlik Hizmetleri", href: "#etkinliklerimiz" },
  { label: "İletişim", href: "#iletisim" },
];

const LINK =
  "relative text-[0.98rem] font-medium text-cream transition-colors duration-300 hover:text-gold-bright after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.16,1,0.3,1)] hover:after:scale-x-100";

const COLUMN_TITLE = "text-[0.7rem] font-bold uppercase tracking-[0.28em] text-gold";

export default function Footer() {
  return (
    <footer
      id="iletisim" data-search-label="İletişim"
      aria-labelledby="footer-baslik"
      className="overflow-hidden bg-cocoa-950 text-cream selection:bg-gold selection:text-cocoa-950"
    >
      <div className="mx-auto w-full max-w-[90rem] px-5 pt-20 sm:px-10 sm:pt-24 lg:px-14 lg:pt-28">
        <div className="grid grid-cols-1 gap-y-14 lg:grid-cols-12 lg:gap-x-12">
          {/* Kapanış cümlesi ve ana çağrı */}
          <div className="lg:col-span-5">
            <a href="#" className="inline-block" aria-label="Sayfanın başına dön">
              <Logo sizes="(min-width: 640px) 240px, 190px" className="h-[112px] w-auto sm:h-[140px]" />
            </a>
            <h2
              id="footer-baslik"
              className="display-sturdy mt-10 font-display text-[clamp(2rem,7vw,3.1rem)] font-semibold leading-[1.12] tracking-[-0.015em] text-cream"
            >
              Makine değil, <em className="italic text-gold-bright">usta elinden</em> çıkmış Belçika çikolatası.
            </h2>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-9 inline-flex items-center gap-4 bg-gold px-7 py-4 text-[0.75rem] font-semibold uppercase tracking-[0.22em] text-cocoa-950 transition-colors duration-300 hover:bg-gold-bright"
            >
              <ChatIcon className="h-4 w-4" />
              WhatsApp&apos;tan Sipariş
            </a>
          </div>

          {/* Bağlantı kolonları */}
          <div className="grid grid-cols-1 gap-x-10 gap-y-10 min-[480px]:grid-cols-2 lg:col-span-5 lg:col-start-8 lg:pt-2">
            <nav aria-label="Alt menü">
              <p className={COLUMN_TITLE}>Keşfet</p>
              <ul className="mt-5 space-y-3.5">
                {EXPLORE.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className={LINK}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className={COLUMN_TITLE}>Atölye</p>
              <p className="mt-5 text-[0.92rem] font-medium leading-[1.6] text-cream-muted">
                El yapımı, katkısız butik
                <br />
                Belçika çikolatası
              </p>
            </div>
          </div>
        </div>

        {/* Alt satır */}
        <div className="mt-20 flex flex-col gap-4 border-t border-gold/20 py-7 sm:mt-24 text-[0.78rem] font-medium text-cream-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CopyrightYear /> El Yapımı Artizan Belçika Çikolata Atölyesi ·{" "}
            <a
              href="https://dablabs.net/"
              target="_blank"
              rel="noopener"
              className="underline decoration-gold/40 underline-offset-4 transition-colors duration-300 hover:text-gold-bright hover:decoration-gold"
            >
              Tasarım: DAB Labs
            </a>
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 self-start font-semibold uppercase tracking-[0.22em] text-cream transition-colors duration-300 hover:text-gold-bright sm:self-auto"
          >
            Yukarı Dön
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-3 w-3" aria-hidden="true">
              <path d="M6 11V1M1.5 5.5 6 1l4.5 4.5" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

// Yıl, önbelleğe alınmış bir kapsamda hesaplanır: sayfa statik kalır,
// her yeniden derlemede güncellenir (Cache Components, prerender'da new Date() izin vermez).
async function CopyrightYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}

type IconProps = { className?: string };

function ChatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20.5 11.6a8.4 8.4 0 0 1-12.3 7.4L3.5 20.5l1.6-4.5A8.4 8.4 0 1 1 20.5 11.6Z" />
    </svg>
  );
}

