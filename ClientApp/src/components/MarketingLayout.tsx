import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { SiteFooter } from './SiteFooter'

type Props = { title: string; children: ReactNode }

const nav = [
  { to: '/', label: 'Anasayfa' },
  { to: '/nasil-calisir', label: 'Nasıl Çalışır' },
  { to: '/hakkimizda', label: 'Hakkımızda' },
  { to: '/sss', label: 'SSS' },
  { to: '/iletisim', label: 'İletişim' },
] as const

export function MarketingLayout({ title, children }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-r-bg)]">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Logo />
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-slate-600">
            {nav.map((item) => (
              <Link key={item.to} to={item.to} className="transition hover:text-[var(--color-r-orange)]">
                {item.label}
              </Link>
            ))}
            <Link
              to="/giris"
              className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-[var(--color-r-orange)] hover:text-[var(--color-r-orange)]"
            >
              Giriş
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-r-navy)]">{title}</h1>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-slate-600">{children}</div>
      </main>
      <SiteFooter />
    </div>
  )
}
