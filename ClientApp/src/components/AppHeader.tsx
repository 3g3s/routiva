import { Bell, LogOut, MapPinned, User2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Logo } from './Logo'
import { UserAvatar } from './UserAvatar'

type Props = {
  title: string
  subtitle?: string
}

export function AppHeader({ title, subtitle }: Props) {
  const { user, loading, logout } = useAuth()
  const nav = useNavigate()
  const roleLabel = user?.role === 'tasiyici' ? 'Taşıyıcı' : 'Yük Veren'

  return (
    <header className="border-b border-slate-200/80 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <Logo />
          <div className="hidden min-w-0 border-l border-slate-200 pl-4 sm:block">
            <h1 className="truncate text-lg font-semibold text-[var(--color-r-navy)]">{title}</h1>
            {subtitle ? <p className="truncate text-sm text-slate-500">{subtitle}</p> : null}
          </div>
        </div>
        <nav className="hidden items-center gap-1 lg:flex">
          {user ? (
            <>
              <Link
                to="/panel"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Panel
              </Link>
              <Link
                to="/guzergahim"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                <MapPinned className="h-4 w-4 text-[var(--color-r-orange)]" />
                Güzergâhım
              </Link>
              <Link
                to="/tasiyici"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Taşıyıcı
              </Link>
            </>
          ) : null}
        </nav>
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            className="relative rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
            aria-label="Bildirimler"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
          {!loading && user ? (
            <>
              <Link
                to="/hesabim"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 py-1.5 pl-1.5 pr-3 hover:bg-slate-50"
              >
                <UserAvatar user={user} />
                <div className="hidden leading-tight sm:block">
                  <p className="text-sm font-semibold text-slate-800">{user.displayName}</p>
                  <p className="text-xs text-slate-500">{roleLabel}</p>
                </div>
                <User2 className="ml-1 hidden h-4 w-4 text-slate-400 sm:block" />
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await logout()
                  nav('/')
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Çıkış</span>
              </button>
            </>
          ) : (
            <Link
              to="/giris"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Giriş Yap
            </Link>
          )}
        </div>
      </div>
      <div className="border-t border-slate-100 px-4 py-2 sm:hidden sm:px-6">
        <h1 className="text-base font-semibold text-[var(--color-r-navy)]">{title}</h1>
        {subtitle ? <p className="text-xs text-slate-500">{subtitle}</p> : null}
      </div>
    </header>
  )
}
