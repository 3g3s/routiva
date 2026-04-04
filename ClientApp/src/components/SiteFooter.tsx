import { Link } from 'react-router-dom'
import { Logo } from './Logo'

type Props = { variant?: 'dark' | 'landing' }

export function SiteFooter({ variant = 'dark' }: Props) {
  if (variant === 'landing') {
    return (
      <footer className="bg-[var(--color-r-navy)] text-slate-300">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
          <div>
            <div className="mb-4 [&_a]:text-white">
              <Logo variant="light" />
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Türkiye genelinde yük ve araç eşleştirme platformu. Boş kapasiteyi verimli kullanın.
            </p>
            <p className="mt-4 text-xs text-slate-500">Yakında: App Store &amp; Google Play</p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Hızlı Linkler</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/nasil-calisir" className="hover:text-white">
                  Nasıl Çalışır
                </Link>
              </li>
              <li>
                <Link to="/hakkimizda" className="hover:text-white">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link to="/yuk-olustur" className="hover:text-white">
                  Yük Oluştur
                </Link>
              </li>
              <li>
                <Link to="/arac-ilani" className="hover:text-white">
                  Araç İlanı
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Kurumsal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/gizlilik" className="hover:text-white">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link to="/kullanim-kosullari" className="hover:text-white">
                  Kullanım Koşulları
                </Link>
              </li>
              <li>
                <Link to="/sss" className="hover:text-white">
                  SSS
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">İletişim</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>İstanbul, Türkiye</li>
              <li>+90 555 000 00 00</li>
              <li>
                <a href="mailto:info@routiva.com" className="hover:text-white">
                  info@routiva.com
                </a>
              </li>
              <li>
                <Link to="/iletisim" className="font-medium text-white hover:underline">
                  İletişim formu
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-slate-500 sm:flex-row sm:px-6">
            <span>© 2026 Routiva · Tüm hakları saklıdır.</span>
            <span className="hidden sm:inline">Karayolu odaklı akıllı lojistik</span>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="mt-auto border-t border-slate-800 bg-[var(--color-r-navy)] text-slate-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <div className="[&_a]:text-white">
            <Logo variant="light" />
          </div>
          <p className="max-w-md text-sm text-slate-400">Türkiye genelinde yük &amp; araç eşleştirme platformu.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="text-slate-500">© 2026 Routiva · Tüm hakları saklıdır.</span>
          <Link to="/gizlilik" className="text-slate-300 hover:text-white">
            Gizlilik
          </Link>
          <Link to="/sss" className="text-slate-300 hover:text-white">
            SSS
          </Link>
          <Link to="/iletisim" className="text-slate-300 hover:text-white">
            İletişim
          </Link>
        </div>
      </div>
    </footer>
  )
}
