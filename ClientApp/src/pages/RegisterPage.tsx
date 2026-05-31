import { Box, ChevronDown, Lock, Mail, Truck } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import {
  AuthFormCard,
  AuthFormHeading,
  AuthStepper,
  fieldClass,
  selectFieldClass,
} from '../components/AuthFormCard'
import { PhoneFieldTR } from '../components/PhoneFieldTR'
import { SiteFooter } from '../components/SiteFooter'
import { ThemeToggle } from '../components/ThemeToggle'
import { VEHICLE_TYPES } from '../data/mock'
import { CITIES, type CityId } from '../lib/geo'

type VehicleTypeId = (typeof VEHICLE_TYPES)[number]['id']

type Role = 'yukveren' | 'tasiyici'

const trailerOptions = ['Tenteli', 'Frigofirik', 'Lowbed', 'Sal Kasa', 'Kapalı Kasa']

export function RegisterPage() {
  const [role, setRole] = useState<Role>('yukveren')
  const [step, setStep] = useState<1 | 2>(1)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const { setUser } = useAuth()

  const [company, setCompany] = useState('')
  const [cityId, setCityId] = useState<CityId>('istanbul')
  const [address, setAddress] = useState('')

  const [vehicleType, setVehicleType] = useState<VehicleTypeId>('tir')
  const [plate, setPlate] = useState('')
  const [capacityTon, setCapacityTon] = useState('')
  const [trailer, setTrailer] = useState('')
  const [vehicleCityId, setVehicleCityId] = useState<CityId>('istanbul')

  const stepLabels: [string, string] =
    role === 'yukveren' ? ['Kişisel Bilgiler', 'Firma/Adres'] : ['Kişisel Bilgiler', 'Araç Bilgileri']

  const title = role === 'yukveren' ? 'Yük Veren Kaydı' : 'Taşıyıcı Kaydı'
  const subtitle =
    role === 'yukveren'
      ? 'Yüklerini taşımak için hesabını oluştur'
      : 'Taşıma yapmak için hesabını oluştur'

  const illustration =
    role === 'yukveren' ? (
      <Box className="h-14 w-14 text-slate-300" strokeWidth={1.25} />
    ) : (
      <Truck className="h-14 w-14 text-slate-300" strokeWidth={1.25} />
    )

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)]">
      <header className="flex items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 transition-colors duration-300">
        <Link to="/" className="inline-flex items-center gap-2 font-semibold text-[var(--color-r-navy)]">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-r-orange)] text-lg font-bold text-white shadow-sm">
            R
          </span>
          <span className="text-xl">Routiva</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <AuthFormCard>
          <AuthFormHeading title={title} subtitle={subtitle} illustration={illustration} />

          <div className="mb-8 flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setRole('yukveren')
                setStep(1)
              }}
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
              onClick={() => {
                setRole('tasiyici')
                setStep(1)
              }}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                role === 'tasiyici'
                  ? 'bg-white text-[var(--color-r-navy)] shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Taşıyıcı
            </button>
          </div>

          <AuthStepper step={step} labels={stepLabels} />

          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault()
              if (step === 1) return
              setError(null)
              const displayName = `${firstName} ${lastName}`.trim()
              if (displayName.length < 2) {
                setError('Ad soyad zorunlu.')
                return
              }
              if (!email.includes('@')) {
                setError('Geçerli bir e-posta girin.')
                return
              }
              if (password.length < 4) {
                setError('Şifre en az 4 karakter olmalı.')
                return
              }
              if (password !== password2) {
                setError('Şifreler aynı olmalı.')
                return
              }

              setLoading(true)
              try {
                const resp = await fetch('/api/auth/register', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({
                    displayName,
                    email,
                    password,
                    phone,
                    role,
                  }),
                })
                if (!resp.ok) {
                  const t = await resp.text()
                  throw new Error(t || 'Kayıt başarısız.')
                }
                const u = await resp.json()
                setUser(u)
                nav('/')
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Kayıt başarısız.')
              } finally {
                setLoading(false)
              }
            }}
          >
            {step === 1 ? (
              <>
                <input
                  className={fieldClass()}
                  placeholder="Ad"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                />
                <input
                  className={fieldClass()}
                  placeholder="Soyad"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                />
                <PhoneFieldTR value={phone} onChange={setPhone} />
                <div
                  className={`flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-[var(--color-r-orange)]/25`}
                >
                  <span className="flex items-center border-r border-slate-200 bg-slate-50/80 px-3 text-[var(--color-r-orange)]">
                    <Mail className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <input
                    type="email"
                    className="min-w-0 flex-1 border-0 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-400"
                    placeholder="E-posta"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>

                <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-[var(--color-r-orange)]/25">
                  <span className="flex items-center border-r border-slate-200 bg-slate-50/80 px-3 text-[var(--color-r-orange)]">
                    <Lock className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <input
                    type="password"
                    className="min-w-0 flex-1 border-0 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-400"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>

                <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-[var(--color-r-orange)]/25">
                  <span className="flex items-center border-r border-slate-200 bg-slate-50/80 px-3 text-[var(--color-r-orange)]">
                    <Lock className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <input
                    type="password"
                    className="min-w-0 flex-1 border-0 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-400"
                    placeholder="Şifre (tekrar)"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
              </>
            ) : role === 'yukveren' ? (
              <>
                <input
                  className={fieldClass()}
                  placeholder="Firma Adı (Opsiyonel)"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
                <div className="relative">
                  <select
                    className={`${selectFieldClass()} w-full`}
                    value={cityId}
                    onChange={(e) => setCityId(e.target.value as CityId)}
                  >
                    {CITIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
                <PhoneFieldTR value={phone} onChange={setPhone} />
                <textarea
                  className={`${fieldClass()} min-h-[96px] resize-y`}
                  placeholder="Adres"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </>
            ) : (
              <>
                <div className="relative">
                  <select
                    className={`${selectFieldClass()} w-full`}
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value as VehicleTypeId)}
                  >
                    {VEHICLE_TYPES.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
                <input
                  className={fieldClass()}
                  placeholder="Plaka"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  autoComplete="off"
                />
                <input
                  className={fieldClass()}
                  placeholder="Kapasite (Ton)"
                  inputMode="decimal"
                  value={capacityTon}
                  onChange={(e) => setCapacityTon(e.target.value)}
                />
                <div className="relative">
                  <select
                    className={`${selectFieldClass()} w-full`}
                    value={trailer}
                    onChange={(e) => setTrailer(e.target.value)}
                  >
                    <option value="">Dorse Tipi (Opsiyonel)</option>
                    {trailerOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
                <div className="relative">
                  <select
                    className={`${selectFieldClass()} w-full`}
                    value={vehicleCityId}
                    onChange={(e) => setVehicleCityId(e.target.value as CityId)}
                  >
                    {CITIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </>
            )}

            {step === 1 ? (
              <button
                type="button"
                onClick={() => {
                  setError(null)
                  if (!email.includes('@')) {
                    setError('Geçerli bir e-posta girin.')
                    return
                  }
                  if (password.length < 4) {
                    setError('Şifre en az 4 karakter olmalı.')
                    return
                  }
                  if (password !== password2) {
                    setError('Şifreler aynı olmalı.')
                    return
                  }
                  setStep(2)
                }}
                className="mt-2 w-full rounded-xl bg-[var(--color-r-orange)] py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-[var(--color-r-orange-hover)]"
              >
                Devam et
              </button>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:w-1/3"
                >
                  Geri
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[var(--color-r-orange)] py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-[var(--color-r-orange-hover)] sm:flex-1"
                >
                  {loading ? 'Kaydediliyor…' : 'Kaydı Tamamla'}
                </button>
              </div>
            )}

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                {error}
              </div>
            ) : null}
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Zaten hesabın var mı?{' '}
            <Link to="/giris" className="font-semibold text-[var(--color-r-orange)] hover:underline">
              Giriş yap
            </Link>
          </p>
        </AuthFormCard>
      </main>

      <SiteFooter />
    </div>
  )
}
