import { Bell, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo } from './Logo'

type Props = {
  title: string
  subtitle?: string
  userName: string
  userRole: string
  userInitial: string
}

export function AppHeader({ title, subtitle, userName, userRole, userInitial }: Props) {
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
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            className="relative rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
            aria-label="Bildirimler"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 py-1.5 pl-1.5 pr-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-r-navy)] text-sm font-semibold text-white">
              {userInitial}
            </div>
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-semibold text-slate-800">{userName}</p>
              <p className="text-xs text-slate-500">{userRole}</p>
            </div>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Çıkış</span>
          </Link>
        </div>
      </div>
      <div className="border-t border-slate-100 px-4 py-2 sm:hidden sm:px-6">
        <h1 className="text-base font-semibold text-[var(--color-r-navy)]">{title}</h1>
        {subtitle ? <p className="text-xs text-slate-500">{subtitle}</p> : null}
      </div>
    </header>
  )
}
