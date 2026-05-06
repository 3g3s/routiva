import { CircleDot, Flag, LogOut, Mail, MapPinned, Pencil, Phone, ShieldCheck } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { ProfileRouteSettingsBar } from '../components/ProfileRouteSettingsBar'
import { RouteMapView } from '../components/RouteMapView'
import { SiteFooter } from '../components/SiteFooter'
import { UserAvatar } from '../components/UserAvatar'
import { fetchProfileRoute, type ProfileSavedRoute } from '../lib/profileRoute'
import { getCity, getNearestCityId } from '../lib/geo'

export function AccountPage() {
  const { user, loading, logout } = useAuth()
  const nav = useNavigate()
  const [route, setRoute] = useState<ProfileSavedRoute | null | undefined>(undefined)
  const [routeErr, setRouteErr] = useState<string | null>(null)

  const reloadRoute = useCallback(async () => {
    try {
      const r = await fetchProfileRoute()
      setRoute(r ?? { origin: null, destination: null })
      setRouteErr(null)
    } catch {
      setRouteErr('Güzergâh bilgisi yüklenemedi.')
      setRoute(null)
    }
  }, [])

  useEffect(() => {
    void reloadRoute()
  }, [reloadRoute])

  if (loading) {
    return <div className="min-h-screen bg-[var(--color-r-bg)]" />
  }
  if (!user) return <Navigate to="/giris" replace />

  const roleLabel = user.role === 'tasiyici' ? 'Taşıyıcı' : 'Yük Veren'
  const hasOrigin = Boolean(route?.origin)
  const hasDestination = Boolean(route?.destination)
  const fromCity =
    route?.origin ? getCity(getNearestCityId(route.origin.lat, route.origin.lng)) : null
  const toCity =
    route?.destination ? getCity(getNearestCityId(route.destination.lat, route.destination.lng)) : null

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-r-bg)]">
      <header className="border-b border-slate-200/80 bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link to="/" className="text-sm font-semibold text-[var(--color-r-orange)] hover:underline">
              ← Anasayfa
            </Link>
            <span className="hidden text-slate-300 sm:inline">|</span>
            <Link to="/panel" className="text-sm font-semibold text-slate-600 hover:text-[var(--color-r-navy)]">
              Panel
            </Link>
            <Link to="/guzergahim" className="text-sm font-semibold text-slate-600 hover:text-[var(--color-r-navy)]">
              Güzergâhım
            </Link>
          </div>
          <button
            type="button"
            onClick={async () => {
              await logout()
              nav('/')
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            Çıkış
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-lg sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <UserAvatar user={user} size="lg" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Hesabım</p>
                <h1 className="mt-1 text-xl font-bold text-[var(--color-r-navy)] sm:text-2xl">{user.displayName}</h1>
                <p className="mt-1 text-sm font-semibold text-slate-600">{roleLabel}</p>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium text-slate-500">Kullanıcı adı</p>
              <p className="mt-1 max-w-[220px] truncate font-mono text-sm font-semibold text-slate-800 sm:max-w-xs">
                {user.userName}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-[var(--color-r-bg)] p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-[var(--color-r-navy)]">
                <Mail className="h-4 w-4 text-[var(--color-r-orange)]" />
                E-posta
              </p>
              <p className="mt-2 text-sm font-medium text-slate-700">{user.email || '—'}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-[var(--color-r-bg)] p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-[var(--color-r-navy)]">
                <Phone className="h-4 w-4 text-[var(--color-r-orange)]" />
                Telefon
              </p>
              <p className="mt-2 text-sm font-medium text-slate-700">{user.phone || '—'}</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 shrink-0" />
              Oturum açık. Bu hesabın simgesi üst barda görünür; güzergâhın aşağıda özetlenir.
            </div>
          </div>

          {/* Kayıtlı harita güzergâhı A → B */}
          <div className="mt-10 border-t border-slate-100 pt-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-[var(--color-r-orange)]">
                  <MapPinned className="h-3.5 w-3.5" />
                  Harita — kayıtlı noktalar
                </p>
                <h2 className="mt-2 text-lg font-black text-[var(--color-r-navy)] sm:text-xl">Çıkış (A) ve varış (B)</h2>
                <p className="mt-1 max-w-xl text-sm text-slate-600">
                  Taşıyıcı merkezinde işaretleyip kaydettiğin iki nokta burada listelenir; rota şehir merkezlerine göre
                  yaklaşık gösterilir.
                </p>
              </div>
              <Link
                to="/tasiyici"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--color-r-navy)] px-4 py-3 text-sm font-bold text-white shadow-md hover:opacity-95"
              >
                <Pencil className="h-4 w-4" />
                Haritada düzenle
              </Link>
            </div>

            {routeErr ? (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
                {routeErr}
              </div>
            ) : null}

            {route === undefined ? (
              <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50 py-12 text-center text-sm font-medium text-slate-500">
                Güzergâh yükleniyor…
              </div>
            ) : !hasOrigin ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-center">
                <MapPinned className="mx-auto h-10 w-10 text-slate-300" strokeWidth={1.25} />
                <p className="mt-3 text-base font-bold text-slate-800">Henüz A ve B kaydı yok</p>
                <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
                  Haritada turuncu <strong>çıkış</strong> ve mavi <strong>varış</strong> noktalarını seçip
                  &quot;Güzergâhı profilime kaydet&quot; dediğinde burada görünecek.
                </p>
                <Link
                  to="/tasiyici"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--color-r-orange)] px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-[var(--color-r-orange-hover)]"
                >
                  Taşıyıcı merkezine git
                </Link>
              </div>
            ) : hasOrigin && !hasDestination ? (
              <div className="mt-6 space-y-4">
                <ProfileRouteSettingsBar
                  compact
                  hasOrigin={hasOrigin}
                  hasDestination={hasDestination}
                  onUpdated={reloadRoute}
                />
                <div className="rounded-2xl border border-orange-200 bg-orange-50/60 px-4 py-4">
                  <p className="text-sm font-bold text-orange-950">Sadece çıkış (A) kayıtlı</p>
                  <p className="mt-1 text-sm text-orange-900/90">
                    Tam güzergâh için taşıyıcı merkezinde <strong>Varış B</strong> noktasını işaretleyip tekrar kaydet.
                  </p>
                  <Link
                    to="/tasiyici"
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[var(--color-r-orange)] px-4 py-2.5 text-sm font-bold text-white hover:bg-[var(--color-r-orange-hover)]"
                  >
                    B noktasını ekle
                  </Link>
                </div>
                <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50/90 to-white p-4 shadow-sm">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-orange-800">
                    <CircleDot className="h-4 w-4" />
                    Nokta A — çıkış
                  </p>
                  <p className="mt-2 text-lg font-black text-slate-900">{fromCity?.label}</p>
                  <p className="mt-1 text-xs text-slate-600">
                    {route!.origin!.label?.trim() || 'Özel konum'}
                  </p>
                  <p className="mt-3 font-mono text-[11px] text-slate-500">
                    {route!.origin!.lat.toFixed(5)}, {route!.origin!.lng.toFixed(5)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <ProfileRouteSettingsBar
                  compact
                  hasOrigin={hasOrigin}
                  hasDestination={hasDestination}
                  onUpdated={reloadRoute}
                />
                <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50/90 to-white p-4 shadow-sm">
                      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-orange-800">
                        <CircleDot className="h-4 w-4" />
                        Nokta A — çıkış
                      </p>
                      <p className="mt-2 text-lg font-black text-slate-900">{fromCity?.label}</p>
                      <p className="mt-1 text-xs text-slate-600">
                        {route!.origin!.label?.trim() || 'Özel konum'}
                      </p>
                      <p className="mt-3 font-mono text-[11px] leading-relaxed text-slate-500">
                        {route!.origin!.lat.toFixed(5)}, {route!.origin!.lng.toFixed(5)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/90 to-white p-4 shadow-sm">
                      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-blue-800">
                        <Flag className="h-4 w-4" />
                        Nokta B — varış
                      </p>
                      <p className="mt-2 text-lg font-black text-slate-900">{toCity?.label}</p>
                      <p className="mt-1 text-xs text-slate-600">
                        {route!.destination!.label?.trim() || 'Özel konum'}
                      </p>
                      <p className="mt-3 font-mono text-[11px] leading-relaxed text-slate-500">
                        {route!.destination!.lat.toFixed(5)}, {route!.destination!.lng.toFixed(5)}
                      </p>
                    </div>
                  </div>
                  <p className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-600">
                    İlan aramasında şehir seçimleri bu güzergâha göre önerilir. Tam özet için{' '}
                    <Link to="/guzergahim" className="font-bold text-[var(--color-r-orange)] underline-offset-2 hover:underline">
                      Güzergâhım
                    </Link>{' '}
                    sayfasını açabilirsin.
                  </p>
                </div>
                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-inner">
                  <p className="border-b border-slate-100 bg-white px-4 py-2 text-xs font-bold text-slate-500">
                    Rota önizlemesi
                  </p>
                  <div className="p-2 sm:p-3">
                    <RouteMapView
                      from={{
                        lat: fromCity!.lat,
                        lng: fromCity!.lng,
                        label: 'Çıkış',
                      }}
                      to={{
                        lat: toCity!.lat,
                        lng: toCity!.lng,
                        label: 'Varış',
                      }}
                      showRoute
                      empty={false}
                      overlayTitle={`${fromCity!.label} → ${toCity!.label}`}
                      statusBar="Profiline kayıtlı güzergâh (yaklaşık şehir rotası)"
                    />
                  </div>
                </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 border-t border-slate-100 pt-8">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Hızlı işlemler</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                to="/guzergahim"
                className="rounded-xl border border-slate-200 bg-white py-3 text-center text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Güzergâhım
              </Link>
              <Link
                to="/tasiyici"
                className="rounded-xl border border-slate-200 bg-white py-3 text-center text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Taşıyıcı merkezi
              </Link>
              <Link
                to="/yuk-olustur"
                className="rounded-xl bg-[var(--color-r-orange)] py-3 text-center text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-[var(--color-r-orange-hover)]"
              >
                Yük Oluştur
              </Link>
              <Link
                to="/arac-ilani"
                className="rounded-xl border border-slate-200 bg-white py-3 text-center text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Araç İlanı
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
