import { ArrowRight, CircleDot, MapPin, Navigation, Pencil, Signpost } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { AppHeader } from '../components/AppHeader'
import { ProfileRouteSettingsBar } from '../components/ProfileRouteSettingsBar'
import { RouteMapView } from '../components/RouteMapView'
import { SiteFooter } from '../components/SiteFooter'
import { fetchProfileRoute, type ProfileSavedRoute } from '../lib/profileRoute'
import { getCity, getNearestCityId } from '../lib/geo'

export function MyRoutePage() {
  const { user, loading } = useAuth()
  const [route, setRoute] = useState<ProfileSavedRoute | null | undefined>(undefined)
  const [err, setErr] = useState<string | null>(null)

  const reloadRoute = useCallback(async () => {
    try {
      const r = await fetchProfileRoute()
      setRoute(r ?? { origin: null, destination: null })
      setErr(null)
    } catch {
      setErr('Güzergâh bilgisi alınamadı.')
      setRoute(null)
    }
  }, [])

  useEffect(() => {
    if (!user) return
    void reloadRoute()
  }, [user, reloadRoute])

  if (loading) return <div className="min-h-screen bg-[var(--color-r-bg)]" />
  if (!user) return <Navigate to="/giris" replace />

  const hasOrigin = Boolean(route?.origin)
  const hasDestination = Boolean(route?.destination)
  const fromCity = route?.origin ? getCity(getNearestCityId(route.origin.lat, route.origin.lng)) : null
  const toCity = route?.destination ? getCity(getNearestCityId(route.destination.lat, route.destination.lng)) : null

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-r-bg)]">
      <AppHeader title="Güzergâhım" subtitle="Kayıtlı çıkış ve varış noktaların" />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl">
          <div className="relative bg-gradient-to-br from-[var(--color-r-navy)] via-slate-900 to-slate-950 px-6 py-8 text-white sm:px-10 sm:py-10">
            <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-[var(--color-r-orange)]/20 blur-3xl" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white/90">
                  <Signpost className="h-3.5 w-3.5" />
                  Profil güzergâhı
                </p>
                <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">Haritada kaydettiğin rota</h1>
                <p className="mt-2 max-w-xl text-sm font-medium text-white/80">
                  Aşağıdan ayarları açıp varışı veya tüm kaydı silebilir, haritada yeniden düzenleyebilirsin.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/tasiyici"
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-r-orange)] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-black/25 hover:bg-[var(--color-r-orange-hover)]"
                >
                  <Pencil className="h-4 w-4" />
                  Haritada düzenle
                </Link>
                <Link
                  to="/panel"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur hover:bg-white/15"
                >
                  Panel <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {err ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
                {err}
              </div>
            ) : null}

            {route === undefined ? (
              <div className="py-16 text-center text-sm font-medium text-slate-500">Yükleniyor…</div>
            ) : hasOrigin || hasDestination ? (
              <div className="space-y-6">
                <ProfileRouteSettingsBar
                  defaultOpen
                  hasOrigin={hasOrigin}
                  hasDestination={hasDestination}
                  onUpdated={reloadRoute}
                />

                {!hasOrigin ? null : !hasDestination ? (
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
                      <p className="text-sm font-black text-amber-950">Eksik: sadece çıkış (A) var</p>
                      <p className="mt-2 text-sm text-amber-900/90">
                        Tam rota ve harita önizlemesi için taşıyıcı merkezinde <strong>Varış B</strong> seçip tekrar
                        kaydet.
                      </p>
                      <Link
                        to="/tasiyici"
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--color-r-orange)] px-4 py-2.5 text-sm font-bold text-white hover:bg-[var(--color-r-orange-hover)]"
                      >
                        B noktasını ekle <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                    <div className="rounded-2xl border border-orange-100 bg-slate-50 p-5">
                      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-orange-800">
                        <CircleDot className="h-4 w-4" />
                        Çıkış (A)
                      </p>
                      <p className="mt-2 text-xl font-black text-slate-900">{fromCity?.label}</p>
                      <p className="mt-1 text-sm text-slate-600">{route!.origin!.label ?? 'Özel konum'}</p>
                      <p className="mt-3 font-mono text-xs text-slate-500">
                        {route!.origin!.lat.toFixed(5)}, {route!.origin!.lng.toFixed(5)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-8 lg:grid-cols-2">
                    <div className="space-y-4">
                      <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Özet</h2>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-100 bg-slate-50/90 p-4">
                          <p className="flex items-center gap-2 text-xs font-bold text-[var(--color-r-orange)]">
                            <MapPin className="h-4 w-4" /> Çıkış
                          </p>
                          <p className="mt-2 text-lg font-black text-slate-900">{fromCity?.label}</p>
                          <p className="mt-1 text-xs text-slate-500">{route!.origin!.label ?? 'Özel konum'}</p>
                          <p className="mt-2 font-mono text-[11px] text-slate-400">
                            {route!.origin!.lat.toFixed(5)}, {route!.origin!.lng.toFixed(5)}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-slate-50/90 p-4">
                          <p className="flex items-center gap-2 text-xs font-bold text-blue-600">
                            <MapPin className="h-4 w-4" /> Varış
                          </p>
                          <p className="mt-2 text-lg font-black text-slate-900">{toCity?.label}</p>
                          <p className="mt-1 text-xs text-slate-500">{route!.destination!.label ?? 'Özel konum'}</p>
                          <p className="mt-2 font-mono text-[11px] text-slate-400">
                            {route!.destination!.lat.toFixed(5)}, {route!.destination!.lng.toFixed(5)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Rota</h2>
                      <div className="mt-3 overflow-hidden rounded-2xl border border-slate-100 shadow-inner">
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
                          statusBar="Kayıtlı güzergâh (şehir merkezlerine yaklaşık rota)"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
                <Navigation className="mx-auto h-12 w-12 text-slate-300" strokeWidth={1.25} />
                <p className="mt-4 text-base font-bold text-slate-800">Henüz tam güzergâh kaydı yok</p>
                <p className="mt-2 text-sm text-slate-600">
                  Haritada hem çıkış hem varış noktasını seçip &quot;Güzergâhı profilime kaydet&quot; ile kaydetmen
                  gerekir.
                </p>
                <Link
                  to="/tasiyici"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--color-r-orange)] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-[var(--color-r-orange-hover)]"
                >
                  Taşıyıcı merkezine git <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
