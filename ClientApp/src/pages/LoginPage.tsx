import { Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { AuthFormCard, AuthFormHeading } from '../components/AuthFormCard'
import { SiteFooter } from '../components/SiteFooter'

type Role = 'yukveren' | 'tasiyici'

export function LoginPage() {
  const [role, setRole] = useState<Role>('yukveren')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const { setUser } = useAuth()

  const title = role === 'yukveren' ? 'Yük Veren Girişi' : 'Taşıyıcı Girişi'
  const subtitle =
    role === 'yukveren' ? 'Yük oluşturmak için giriş yap' : 'Taşıma yapmak için giriş yap'

  return (
    <div className="flex min-h-screen flex-col bg-slate-100/90">
      <header className="border-b border-slate-200/80 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
        <Link to="/" className="inline-flex items-center gap-2 font-semibold text-[var(--color-r-navy)]">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-r-orange)] text-lg font-bold text-white shadow-sm">
            R
          </span>
          <span className="text-xl">Routiva</span>
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-12 sm:px-6">
        <AuthFormCard>
          <AuthFormHeading title={title} subtitle={subtitle} />

          <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setRole('yukveren')}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                role === 'yukveren'
                  ? 'bg-white text-[var(--color-r-navy)] shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Yük Veren
            </button>
            <button
              type="button"
              onClick={() => setRole('tasiyici')}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                role === 'tasiyici'
                  ? 'bg-white text-[var(--color-r-navy)] shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Taşıyıcı
            </button>
          </div>

          <form
            className="space-y-5"
            onSubmit={async (e) => {
              e.preventDefault()
              setError(null)
              setLoading(true)
              try {
                const resp = await fetch('/api/auth/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({ email, password, remember, role }),
                })
                if (!resp.ok) {
                  const t = await resp.text()
                  throw new Error(t || 'Giriş başarısız.')
                }
                const u = await resp.json()
                setUser(u)
                nav('/')
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Giriş başarısız.')
              } finally {
                setLoading(false)
              }
            }}
          >
            <div>
              <label htmlFor="login-email" className="sr-only">
                E-posta
              </label>
              <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-[var(--color-r-orange)]/25">
                <span className="flex items-center border-r border-slate-200 bg-slate-50/80 px-3 text-[var(--color-r-orange)]">
                  <Mail className="h-5 w-5" strokeWidth={2} />
                </span>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta"
                  className="min-w-0 flex-1 border-0 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="sr-only">
                Şifre
              </label>
              <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-[var(--color-r-orange)]/25">
                <span className="flex items-center border-r border-slate-200 bg-slate-50/80 px-3 text-[var(--color-r-orange)]">
                  <Lock className="h-5 w-5" strokeWidth={2} />
                </span>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifre"
                  className="min-w-0 flex-1 border-0 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                {error}
              </div>
            ) : null}

            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[var(--color-r-orange)] focus:ring-[var(--color-r-orange)]"
              />
              Beni Hatırla
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[var(--color-r-orange)] py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-[var(--color-r-orange-hover)] disabled:opacity-60"
            >
              {loading ? 'Giriş yapılıyor…' : 'Giriş yap'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Hesabın yok mu?{' '}
            <Link to="/kayit" className="font-semibold text-[var(--color-r-orange)] hover:underline">
              Kayıt ol
            </Link>
          </p>
        </AuthFormCard>
      </main>

      <SiteFooter />
    </div>
  )
}
