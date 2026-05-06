import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Logo } from './Logo'
import { UserAvatar } from './UserAvatar'

function SectionNavLink({
  targetId,
  children,
  className,
}: {
  targetId: string
  children: ReactNode
  className?: string
}) {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <Link
      to={{ pathname: '/', hash: targetId }}
      className={className}
      onClick={(e) => {
        if (isHome) {
          e.preventDefault()
          const el = document.getElementById(targetId)
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          window.history.replaceState(null, '', `#${targetId}`)
        }
      }}
    >
      {children}
    </Link>
  )
}

function HomeNavLink({ className, children }: { className?: string; children: ReactNode }) {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <Link
      to="/"
      className={className}
      onClick={(e) => {
        if (isHome) {
          e.preventDefault()
          window.scrollTo({ top: 0, behavior: 'smooth' })
          window.history.replaceState(null, '', '/')
        }
      }}
    >
      {children}
    </Link>
  )
}

export function LandingHeader() {
  const navLink =
    'transition hover:text-white text-sm font-medium text-white/95'
  const { user, loading, logout } = useAuth()
  const nav = useNavigate()

  return (
    <header className="absolute inset-x-0 top-0 z-20 border-b border-white/10 bg-black/20 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Logo variant="light" />
        <nav className="hidden items-center gap-6 md:flex lg:gap-8">
          <HomeNavLink className={navLink}>Anasayfa</HomeNavLink>
          <SectionNavLink targetId="hizli" className={navLink}>
            Keşfet
          </SectionNavLink>
          <SectionNavLink targetId="nasil" className={navLink}>
            Nasıl Çalışır
          </SectionNavLink>
          <SectionNavLink targetId="hakkimizda" className={navLink}>
            Hakkımızda
          </SectionNavLink>
          <SectionNavLink targetId="sss" className={navLink}>
            SSS
          </SectionNavLink>
          <SectionNavLink targetId="iletisim" className={navLink}>
            İletişim
          </SectionNavLink>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          {!loading && user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/hesabim"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-2.5 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
              >
                <UserAvatar user={user} size="sm" variant="light" />
                <span className="hidden sm:inline">{user.displayName}</span>
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await logout()
                  nav('/')
                }}
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Çıkış
              </button>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </header>
  )
}
