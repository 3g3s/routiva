import { Link } from 'react-router-dom'
import { Logo } from './Logo'

export function LandingHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 border-b border-white/10 bg-black/20 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Logo variant="light" />
        <nav className="hidden items-center gap-6 text-sm font-medium text-white/95 md:flex lg:gap-8">
          <a href="#anasayfa" className="transition hover:text-white">
            Anasayfa
          </a>
          <Link to="/nasil-calisir" className="transition hover:text-white">
            Nasıl Çalışır
          </Link>
          <Link to="/hakkimizda" className="transition hover:text-white">
            Hakkımızda
          </Link>
          <Link to="/iletisim" className="transition hover:text-white">
            İletişim
          </Link>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/giris"
            className="rounded-lg border border-white/80 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10 sm:px-4"
          >
            Giriş Yap
          </Link>
          <Link
            to="/kayit"
            className="rounded-lg bg-[var(--color-r-orange)] px-3 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[var(--color-r-orange-hover)] sm:px-4"
          >
            Kayıt Ol
          </Link>
        </div>
      </div>
    </header>
  )
}
