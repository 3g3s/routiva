import { ArrowLeft, MapPin, Package, Phone, Truck } from 'lucide-react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { SiteFooter } from '../components/SiteFooter'
import { buildChatUrl, loadCardsForVehicleSearch, parseLoadListingQuery } from '../data/mock'

export function LoadListingDetailPage() {
  const { slot } = useParams()
  const { search } = useLocation()
  const idx = Number.parseInt(slot ?? '', 10)
  const parsed = parseLoadListingQuery(search)
  const loads = loadCardsForVehicleSearch({ ...parsed, limit: 12 })
  const load = Number.isFinite(idx) ? loads[idx] : undefined

  if (!load) {
    return <Navigate to="/arac-ilani" replace />
  }

  const cap = parsed.capacityLabel

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-r-bg)]">
      <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
        <Link
          to="/arac-ilani"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-r-orange)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Yük listesine dön
        </Link>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Yük ilanı</p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--color-r-navy)]">{load.company}</h1>
          <p className="mt-2 text-sm text-slate-600">{load.route}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-[var(--color-r-bg)] p-4">
              <p className="text-xs text-slate-500">Yük cinsi</p>
              <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Package className="h-4 w-4 text-[var(--color-r-orange)]" />
                {load.kind}
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-[var(--color-r-bg)] p-4">
              <p className="text-xs text-slate-500">Ağırlık &amp; hacim</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {load.weight} · {load.desi} desi
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-100 p-4">
            <p className="text-xs font-medium text-slate-500">Sizin aracınız</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              Kapasite: {cap} · Liste, bu kapasite ve güzergâha göre üretildi.
            </p>
            {load.fitsCapacity ? (
              <p className="mt-2 text-xs font-medium text-emerald-700">✓ Yük ağırlığı araç kapasitesi içinde</p>
            ) : (
              <p className="mt-2 text-xs font-medium text-amber-800">Ağırlık kapasiteye yakın — detay görüşün.</p>
            )}
          </div>

          <div className="mt-6 space-y-3 border-t border-slate-100 pt-6">
            <h2 className="text-sm font-semibold text-[var(--color-r-navy)]">Zaman &amp; ödeme</h2>
            <p className="text-sm text-slate-700">
              <span className="font-medium text-slate-800">Yükleme penceresi:</span> {load.pickupWindow}
            </p>
            <p className="text-sm text-slate-700">
              <span className="font-medium text-slate-800">Ödeme:</span> {load.paymentTerms}
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <h2 className="text-sm font-semibold text-[var(--color-r-navy)]">Adresler</h2>
            <p className="flex items-start gap-2 text-sm text-slate-700">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-r-blue-accent)]" />
              <span>
                <span className="font-medium">Yükleme:</span> {load.loadingNote}
              </span>
            </p>
            <p className="flex items-start gap-2 text-sm text-slate-700">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-r-orange)]" />
              <span>
                <span className="font-medium">Boşaltma:</span> {load.unloadingNote}
              </span>
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
            <p className="text-xs font-medium text-slate-500">Yük veren iletişim (demo)</p>
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Phone className="h-4 w-4 text-slate-400" />
              <a href={`tel:${load.contactPhone.replace(/\s/g, '')}`} className="text-[var(--color-r-orange)] hover:underline">
                {load.contactPhone}
              </a>
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to={buildChatUrl({
                partner: load.company,
                mod: 'yukveren',
                rota: load.route,
                ozet: `${load.weight} · ${load.desi} desi · ${load.kind}`,
              })}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-r-orange)] py-3 text-sm font-semibold text-white shadow-md hover:bg-[var(--color-r-orange-hover)]"
            >
              <Truck className="h-4 w-4" />
              Yük verenle yazış
            </Link>
            <Link
              to="/arac-ilani"
              className="flex flex-1 items-center justify-center rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Listeye dön
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
