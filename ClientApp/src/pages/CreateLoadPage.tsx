import { ArrowRight, Box, Clock, MapPin, Package, Star, Truck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { RouteMapView } from '../components/RouteMapView'
import { SiteFooter } from '../components/SiteFooter'
import { buildCarrierOfferQuery, carrierOffersForSearch, getLoadTypeById, LOAD_TYPES } from '../data/mock'
import { CITIES, getCity } from '../lib/geo'

export function CreateLoadPage() {
  const [fromId, setFromId] = useState('istanbul')
  const [toId, setToId] = useState('ankara')
  const [loadType, setLoadType] = useState('ftl')
  const [weightKg, setWeightKg] = useState('500')
  const [desi, setDesi] = useState('42')
  const [searched, setSearched] = useState(false)

  const from = getCity(fromId)
  const to = getCity(toId)
  const loadMeta = getLoadTypeById(loadType)
  const loadLabel = loadMeta.label

  const offers = useMemo(() => {
    if (!searched) return []
    return carrierOffersForSearch({
      fromId,
      toId,
      weightKg: Number.parseInt(weightKg, 10) || 0,
      desi: Number.parseFloat(desi.replace(',', '.')) || 0,
      loadTypeId: loadType,
      limit: 12,
    })
  }, [searched, fromId, toId, weightKg, desi, loadType])

  const handleSearch = () => {
    setSearched(true)
    void fetch('/api/logistics/carrier-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromId,
        toId,
        loadTypeId: loadType,
        weightKg: Number.parseInt(weightKg, 10) || 0,
        desi: Number.parseFloat(desi.replace(',', '.')) || 0,
      }),
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-r-bg)]">
      <AppHeader
        title="Yük Oluştur"
        subtitle="Türkiye geneli yükünü gir, en uygun taşıyıcıları bul"
        userName="Murat Yıldırım"
        userRole="Yük Veren"
        userInitial="M"
      />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-12 xl:items-end">
            <label className="xl:col-span-2">
              <span className="mb-1.5 flex items-center gap-1 text-xs font-medium text-slate-500">
                <MapPin className="h-3.5 w-3.5 text-[var(--color-r-orange)]" />
                Nereden?
              </span>
              <select
                value={fromId}
                onChange={(e) => setFromId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none ring-[var(--color-r-orange)] focus:ring-2"
              >
                {CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="xl:col-span-2">
              <span className="mb-1.5 flex items-center gap-1 text-xs font-medium text-slate-500">
                <MapPin className="h-3.5 w-3.5 text-[var(--color-r-orange)]" />
                Nereye?
              </span>
              <select
                value={toId}
                onChange={(e) => setToId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none ring-[var(--color-r-orange)] focus:ring-2"
              >
                {CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="xl:col-span-4">
              <span className="mb-1.5 flex items-center gap-1 text-xs font-medium text-slate-500">
                <Package className="h-3.5 w-3.5 text-slate-400" />
                Yük Tipi
              </span>
              <select
                value={loadType}
                onChange={(e) => setLoadType(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none ring-[var(--color-r-orange)] focus:ring-2"
              >
                {LOAD_TYPES.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-[11px] leading-snug text-slate-500">{loadMeta.description}</p>
            </label>
            <label className="xl:col-span-2">
              <span className="mb-1.5 text-xs font-medium text-slate-500">Ağırlık</span>
              <div className="flex rounded-lg border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-[var(--color-r-orange)]">
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full min-w-0 rounded-l-lg border-0 bg-transparent px-3 py-2.5 text-sm font-medium outline-none"
                />
                <span className="flex items-center border-l border-slate-200 px-3 text-xs font-semibold text-slate-500">
                  kg
                </span>
              </div>
            </label>
            <label className="xl:col-span-2">
              <span className="mb-1.5 text-xs font-medium text-slate-500">Hacim (desi)</span>
              <div className="flex flex-col gap-1">
                <div className="flex rounded-lg border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-[var(--color-r-orange)]">
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    value={desi}
                    onChange={(e) => setDesi(e.target.value)}
                    className="w-full min-w-0 rounded-l-lg border-0 bg-transparent px-3 py-2.5 text-sm font-medium outline-none"
                  />
                  <span className="flex items-center border-l border-slate-200 px-3 text-xs font-semibold text-slate-500">
                    desi
                  </span>
                </div>
                <span className="text-[10px] leading-snug text-slate-400">
                  Tipik: (cm en × boy × yük) ÷ 3000. Hacimli yüklerde taşıyıcı planlaması için kullanılır.
                </span>
              </div>
            </label>
            <div className="sm:col-span-2 xl:col-span-2">
              <button
                type="button"
                onClick={handleSearch}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-r-orange)] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[var(--color-r-orange-hover)]"
              >
                Taşıyıcı Ara
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-[var(--color-r-navy)]">Yük Özeti</h2>
            {!searched ? (
              <div className="mt-6 flex flex-col items-center py-6 text-center">
                <div className="rounded-2xl bg-slate-50 p-5 text-slate-300">
                  <Box className="h-14 w-14" strokeWidth={1.25} />
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-800">Henüz yük bilgisi girilmedi</p>
                <p className="mt-1 max-w-xs text-xs text-slate-500">Yük bilgilerinizi girerek arama başlatabilirsiniz.</p>
                <div className="mt-6 w-full rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-left text-xs text-amber-900">
                  Arama yaptığınızda uygun teklifler aşağıda listelenecektir.
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-r-blue-accent)]" />
                    <div>
                      <p className="text-xs font-medium text-slate-500">Çıkış</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {from.label}{' '}
                        <span className="font-normal text-slate-500">({from.detail})</span>
                      </p>
                    </div>
                  </div>
                  <div className="my-3 ml-1 border-l-2 border-dashed border-slate-200 pl-4" />
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-r-orange)]" />
                    <div>
                      <p className="text-xs font-medium text-slate-500">Varış</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {to.label} <span className="font-normal text-slate-500">({to.detail})</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
                  <div className="col-span-2 rounded-lg border border-slate-100 bg-white p-3 shadow-sm sm:col-span-6">
                    <p className="text-xs text-slate-500">Yük Tipi</p>
                    <p className="mt-1 text-sm font-semibold leading-snug text-slate-800">{loadLabel}</p>
                    <p className="mt-1 text-[11px] leading-snug text-slate-500">{loadMeta.description}</p>
                  </div>
                  <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm sm:col-span-3">
                    <p className="text-xs text-slate-500">Ağırlık</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{weightKg} kg</p>
                  </div>
                  <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm sm:col-span-3">
                    <p className="text-xs text-slate-500">Hacim</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{desi} desi</p>
                  </div>
                </div>
                <div className="rounded-lg border border-orange-200/80 bg-orange-50/90 px-3 py-2.5 text-xs text-orange-900">
                  Sistem eşleşme sağladı, teklifleri gözden geçirin.
                </div>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-[var(--color-r-navy)]">Rota Haritası</h2>
            <div className="mt-4">
              <RouteMapView
                from={{ lat: from.lat, lng: from.lng, label: 'Başlangıç' }}
                to={{ lat: to.lat, lng: to.lng, label: 'Varış' }}
                showRoute={searched}
                empty={!searched}
                overlayTitle={
                  searched
                    ? `${from.label} → ${to.label} · ${weightKg} kg · ${desi} desi`
                    : undefined
                }
                statusBar={
                  searched
                    ? '✓ Rota oluşturuldu. Uygun taşıyıcılar teklif sunacaktır.'
                    : undefined
                }
              />
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-[var(--color-r-navy)]">Teklifler</h2>
          {!searched ? (
            <div className="flex flex-col items-center py-14 text-center">
              <Truck className="h-12 w-12 text-slate-300" strokeWidth={1.25} />
              <p className="mt-4 text-sm font-semibold text-slate-700">Henüz teklif bulunmamaktadır</p>
              <p className="mt-1 max-w-md text-xs text-slate-500">
                Taşıyıcı araması yapıldığında uygun teklifler burada listelenecektir.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(() => {
                const q = buildCarrierOfferQuery({ fromId, toId, weightKg, desi, loadType })
                return offers.map((o, idx) => (
                  <article
                    key={o.id}
                    className="flex flex-col rounded-xl border border-slate-100 bg-[var(--color-r-bg)]/50 p-4 shadow-sm transition hover:border-orange-200/80 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-[var(--color-r-navy)]">{o.company}</h3>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                      <Truck className="h-3.5 w-3.5 shrink-0 text-[var(--color-r-orange)]" />
                      <span className="leading-snug">{o.route}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                      <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                        <Star className="h-4 w-4 text-amber-500" fill="currentColor" />
                        {o.price}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3.5 w-3.5" />
                        {o.eta}
                      </span>
                    </div>
                    <p
                      className={
                        o.fitsCargo
                          ? 'mt-2 text-xs font-medium text-emerald-700'
                          : 'mt-2 text-xs font-medium text-amber-800'
                      }
                    >
                      {o.fitsCargo ? '✓ Kapasite uygun' : '⚠ Sınırda — detayda limitleri görün'}
                    </p>
                    <Link
                      to={`/teklif/${idx}?${q}`}
                      className="mt-4 block w-full rounded-lg bg-[var(--color-r-orange)] py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[var(--color-r-orange-hover)]"
                    >
                      Teklifi seç
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
