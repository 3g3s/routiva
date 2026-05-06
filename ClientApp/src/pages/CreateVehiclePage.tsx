import { ArrowRight, Bus, MapPin, Package, Pin, Truck } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { AppHeader } from '../components/AppHeader'
import { RouteMapView } from '../components/RouteMapView'
import { SiteFooter } from '../components/SiteFooter'
import { AdrHazardMark } from '../components/AdrHazardMark'
import { buildLoadListingQuery, CAPACITIES, loadCardsForVehicleSearch, VEHICLE_TYPES } from '../data/mock'
import { CITIES, getCity, getNearestCityId } from '../lib/geo'
import { fetchProfileRoute } from '../lib/profileRoute'

export function CreateVehiclePage() {
  const { user } = useAuth()
  const [fromId, setFromId] = useState('istanbul')
  const [toId, setToId] = useState('ankara')
  const [vehicleType, setVehicleType] = useState('tir')
  const [capacity, setCapacity] = useState('10 ton')
  const [searched, setSearched] = useState(false)
  const [profileBaseLabel, setProfileBaseLabel] = useState<string | null>(null)

  const from = getCity(fromId)
  const to = getCity(toId)
  const vehicleLabel = VEHICLE_TYPES.find((v) => v.id === vehicleType)?.label ?? 'Tır'

  useEffect(() => {
    if (user?.role !== 'tasiyici') return
    ;(async () => {
      try {
        const data = await fetchProfileRoute()
        if (!data?.origin) return
        setFromId(getNearestCityId(data.origin.lat, data.origin.lng))
        setProfileBaseLabel(data.origin.label ?? `${data.origin.lat.toFixed(4)}, ${data.origin.lng.toFixed(4)}`)
        if (data.destination) {
          setToId(getNearestCityId(data.destination.lat, data.destination.lng))
        }
      } catch {
        // ignore
      }
    })()
  }, [user?.role])

  const matchedLoads = useMemo(
    () =>
      searched
        ? loadCardsForVehicleSearch({
            fromId,
            toId,
            capacityLabel: capacity,
            vehicleTypeId: vehicleType,
            limit: 12,
          })
        : [],
    [searched, fromId, toId, capacity, vehicleType],
  )

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-r-bg)]">
      <AppHeader
        title="Araç İlanı Oluştur"
        subtitle="Boş kapasitenizi girin, uygun yükleri bulun"
      />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xl sm:p-6">
          {profileBaseLabel && user?.role === 'tasiyici' ? (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
              <div className="flex items-center gap-2">
                <Pin className="h-4 w-4" />
                Haritadan seçilen konum ilanlarda kullanılacak: {profileBaseLabel}
              </div>
            </div>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:items-end">
            <label className="lg:col-span-1">
              <span className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-r-orange)]">
                <MapPin className="h-4 w-4" strokeWidth={2} />
                Nereden?
              </span>
              <select
                value={fromId}
                onChange={(e) => setFromId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-800 shadow-sm outline-none ring-[var(--color-r-orange)]/20 focus:ring-2"
              >
                {CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="lg:col-span-1">
              <span className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-r-orange)]">
                <MapPin className="h-4 w-4" strokeWidth={2} />
                Nereye?
              </span>
              <select
                value={toId}
                onChange={(e) => setToId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-800 shadow-sm outline-none ring-[var(--color-r-orange)]/20 focus:ring-2"
              >
                {CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="lg:col-span-1">
              <span className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-r-orange)]">
                <Bus className="h-4 w-4" strokeWidth={2} />
                Araç Tipi
              </span>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-800 shadow-sm outline-none ring-[var(--color-r-orange)]/20 focus:ring-2"
              >
                {VEHICLE_TYPES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="lg:col-span-1">
              <span className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-r-orange)]">
                <Package className="h-4 w-4" strokeWidth={2} />
                Kapasite
              </span>
              <select
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-800 shadow-sm outline-none ring-[var(--color-r-orange)]/20 focus:ring-2"
              >
                {CAPACITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <div className="lg:col-span-2">
              <span className="mb-2 hidden text-xs font-semibold uppercase tracking-wide text-transparent lg:block">
                Ara
              </span>
              <button
                type="button"
                onClick={() => {
                  setSearched(true)
                  void fetch('/api/logistics/load-search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      fromId,
                      toId,
                      vehicleTypeId: vehicleType,
                      capacityLabel: capacity,
                    }),
                  })
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-r-orange)] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-[var(--color-r-orange-hover)]"
              >
                Yük Bul
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-lg">
            <h2 className="text-base font-semibold text-[var(--color-r-navy)]">Araç Özeti</h2>
            {!searched ? (
              <div className="mt-6 flex flex-col items-center py-6 text-center">
                <div className="rounded-2xl bg-slate-50 p-5 text-slate-300">
                  <Truck className="h-14 w-14" strokeWidth={1.25} />
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-800">Henüz araç bilgisi girilmedi</p>
                <p className="mt-1 max-w-xs text-xs text-slate-500">Güzergâh ve kapasite seçerek yük araması başlatın.</p>
                <div className="mt-6 w-full rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-left text-xs text-amber-900">
                  Arama sonrası uygun yükler bu sayfada listelenir.
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-r-orange)]" />
                    <div>
                      <p className="text-xs font-medium text-slate-500">Çıkış Noktası</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {from.label}{' '}
                        <span className="font-normal text-slate-500">({from.detail})</span>
                      </p>
                    </div>
                  </div>
                  <div className="my-3 ml-1 border-l-2 border-dashed border-slate-200 pl-4" />
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-r-blue-accent)]" />
                    <div>
                      <p className="text-xs font-medium text-slate-500">Varış Noktası</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {to.label} <span className="font-normal text-slate-500">({to.detail})</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
                    <p className="text-xs text-slate-500">Araç Tipi</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{vehicleLabel}</p>
                  </div>
                  <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
                    <p className="text-xs text-slate-500">Kapasite</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{capacity}</p>
                  </div>
                </div>
                <div className="rounded-lg border border-orange-200/80 bg-orange-50/90 px-3 py-2.5 text-xs text-orange-900">
                  Sistem size uygun yükleri eşleştirdi, teklifleri inceleyin.
                </div>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-lg">
            <h2 className="text-base font-semibold text-[var(--color-r-navy)]">Rota Haritası</h2>
            <div className="mt-4">
              <RouteMapView
                from={{ lat: from.lat, lng: from.lng, label: 'Çıkış Noktası' }}
                to={{ lat: to.lat, lng: to.lng, label: 'Varış Noktası' }}
                showRoute={searched}
                empty={!searched}
                overlayTitle={searched ? `${from.label} → ${to.label} | ${capacity} kapasite` : undefined}
                statusBar={
                  searched ? '✓ Rota oluşturuldu. Uygun yükler gösteriliyor.' : undefined
                }
              />
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-lg">
          <h2 className="text-base font-semibold text-[var(--color-r-navy)]">Uygun Yükler</h2>
          {!searched ? (
            <div className="flex flex-col items-center py-14 text-center">
              <Package className="h-12 w-12 text-slate-300" strokeWidth={1.25} />
              <p className="mt-4 text-sm font-semibold text-slate-700">Henüz yük listelenmedi</p>
              <p className="mt-1 max-w-md text-xs text-slate-500">Yük Bul ile arama yaptığınızda sonuçlar burada görünür.</p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(() => {
                const q = buildLoadListingQuery({ fromId, toId, capacity, vehicleType })
                return matchedLoads.map((load, idx) => (
                  <article
                    key={load.id}
                    className="flex flex-col rounded-xl border border-slate-100 bg-[var(--color-r-bg)]/50 p-4 shadow-sm transition hover:border-orange-200/80 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-[var(--color-r-navy)]">{load.company}</h3>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{load.route}</p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span className="inline-flex items-center gap-1.5 text-slate-700">
                        <Package className="h-4 w-4 shrink-0 text-[var(--color-r-orange)]" />
                        {load.kind}
                      </span>
                      {/\bADR\b/i.test(load.kind) ? (
                        <span className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">
                          <AdrHazardMark size="sm" />
                          ADR
                        </span>
                      ) : null}
                      <div className="text-right text-xs sm:text-sm">
                        <p className="font-semibold text-slate-800">{load.weight}</p>
                        <p className="text-slate-500">{load.desi} desi</p>
                      </div>
                    </div>
                    <p
                      className={
                        load.fitsCapacity
                          ? 'mt-2 text-xs font-medium text-emerald-700'
                          : 'mt-2 text-xs font-medium text-amber-800'
                      }
                    >
                      {load.fitsCapacity ? '✓ Kapasiteye uygun tonaj' : '⚠ Kapasite üstü — görüş önerilir'}
                    </p>
                    <Link
                      to={`/yuk-ilan/${idx}?${q}`}
                      className="mt-4 block w-full rounded-lg bg-[var(--color-r-orange)] py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[var(--color-r-orange-hover)]"
                    >
                      Detayı Gör
                    </Link>
                  </article>
                ))
              })()}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
