import { Link, useLocation } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { SiteFooter } from '../components/SiteFooter'

const titles: Record<string, string> = {
  giris: 'Giriş Yap',
  kayit: 'Kayıt Ol',
}

export function PlaceholderPage() {
  const { pathname } = useLocation()
  const key = pathname.replace(/^\//, '') || 'giris'
  const title = titles[key] ?? 'Sayfa'

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-r-bg)]">
      <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
        <Logo />
      </header>
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-[var(--color-r-navy)]">{title}</h1>
          <p className="mt-3 text-sm text-slate-600">
            Bu bölüm kimlik doğrulama veya form backend’i bağlandığında aktif olacaktır.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-lg bg-[var(--color-r-orange)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-r-orange-hover)]"
          >
            Anasayfa
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
