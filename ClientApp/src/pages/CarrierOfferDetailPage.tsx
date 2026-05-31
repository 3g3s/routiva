import { ArrowLeft, CheckCircle2, Clock, MapPin, Phone, Shield, Star, Truck, User } from 'lucide-react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { SiteFooter } from '../components/SiteFooter'
import {
  buildChatUrl,
  carrierOffersForSearch,
  getVehicleImageByType,
  getVehicleTypeById,
  parseCarrierOfferQuery,
} from '../data/mock'
import { getCity } from '../lib/geo'

export function CarrierOfferDetailPage() {
  const { slot } = useParams()
  const { search } = useLocation()
  const idx = Number.parseInt(slot ?? '', 10)
  const parsed = parseCarrierOfferQuery(search)
  const offers = carrierOffersForSearch({ ...parsed, limit: 12 })
  const offer = Number.isFinite(idx) ? offers[idx] : undefined

  if (!offer) {
    return <Navigate to="/yuk-olustur" replace />
  }

  const from = getCity(parsed.fromId)
  const to = getCity(parsed.toId)
  const vehicleType = getVehicleTypeById(offer.vehicleTypeId)
  const vehicleImage = getVehicleImageByType(offer.vehicleTypeId)

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-r-bg)]">
      <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
        <Link
          to={`/yuk-olustur`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-r-orange)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Tekliflere dön
        </Link>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-lg sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Taşıyıcı teklifi</p>
              <h1 className="mt-1 text-2xl font-bold text-[var(--color-r-navy)]">{offer.company}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                <Truck className="h-4 w-4 text-[var(--color-r-orange)]" />
                {offer.route}
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[var(--color-r-navy)]">{offer.price}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                Tahmini süre: {offer.eta}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
              {offer.rating} · {offer.completedJobs.toLocaleString('tr-TR')} tamamlanan sefer
            </span>
            {offer.fitsCargo ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Yükünüzün kg ve desi aralığına uygun
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-950">
                Sınırda — maks. {offer.maxKg} kg / {offer.maxDesi} desi
              </span>
            )}
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
            <img
              src={vehicleImage}
              alt={`${vehicleType.label} görseli`}
              className="h-44 w-full bg-white p-4 object-contain"
              loading="lazy"
            />
            <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-white px-4 py-2.5">
              <p className="text-xs font-medium text-slate-500">Araç tipi</p>
              <p className="text-sm font-semibold text-[var(--color-r-navy)]">{vehicleType.label}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
              <p className="text-xs font-medium text-slate-500">Firma kimlik & logo</p>
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={offer.companyLogoUrl}
                  alt={`${offer.company} logo`}
                  className="h-14 w-14 rounded-xl bg-white object-cover"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[var(--color-r-navy)]">{offer.company}</p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-500">Ticari kimlik</p>
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-800">{offer.companyIdNumber}</p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
              <p className="text-xs font-medium text-slate-500">Sürücü kimlik & foto</p>
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={offer.driverPhotoUrl}
                  alt={`${offer.driverName} foto`}
                  className="h-14 w-14 rounded-xl bg-white object-cover"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[var(--color-r-navy)]">{offer.driverName}</p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-500">TC kimlik numarası</p>
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-800">{offer.driverIdNumber}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
              <p className="text-xs font-medium text-slate-500">Sizin aramanız</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {parsed.weightKg} kg · {parsed.desi} desi
              </p>
              <p className="mt-2 text-xs text-slate-500">Taşıyıcı üst limit: {offer.maxKg} kg / {offer.maxDesi} desi</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
              <p className="text-xs font-medium text-slate-500">Geçerlilik</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{offer.validUntil}</p>
              <p className="mt-2 text-xs text-slate-500">{offer.insurance}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 rounded-xl border border-slate-100 p-4">
            <h2 className="text-sm font-semibold text-[var(--color-r-navy)]">Operasyon &amp; iletişim</h2>
            <p className="flex items-center gap-2 text-sm text-slate-700">
              <User className="h-4 w-4 text-slate-400" />
              Sürücü: {offer.driverName}
            </p>
            <p className="flex items-center gap-2 text-sm text-slate-700">
              <Phone className="h-4 w-4 text-slate-400" />
              <a href={`tel:${offer.phone.replace(/\s/g, '')}`} className="font-medium text-[var(--color-r-orange)] hover:underline">
                {offer.phone}
              </a>
            </p>
            <p className="flex items-center gap-2 text-sm text-slate-700">
              <Truck className="h-4 w-4 text-slate-400" />
              {vehicleType.label} plaka: <span className="font-mono font-semibold">{offer.plate}</span>
            </p>
            <p className="flex items-start gap-2 text-sm text-slate-700">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <span>
                Çıkış: {from.label} ({from.detail}) — Varış: {to.label} ({to.detail})
              </span>
            </p>
            <p className="flex items-start gap-2 text-sm text-slate-700">
              <Shield className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              {offer.notes}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to={buildChatUrl({
                partner: offer.company,
                mod: 'tasiyici',
                rota: offer.route,
                ozet: `${offer.price} · ${offer.eta}`,
              })}
              className="flex flex-1 items-center justify-center rounded-xl bg-[var(--color-r-orange)] py-3 text-sm font-semibold text-white shadow-md hover:bg-[var(--color-r-orange-hover)]"
            >
              Taşıyıcı ile yazış
            </Link>
            <Link
              to="/yuk-olustur"
              className="flex flex-1 items-center justify-center rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Listeye dön
            </Link>
          </div>
          <p className="mt-4 text-center text-xs text-slate-400">
            Onay, ödeme ve KVKK adımları canlı ortamda bu sohbetten sonra tamamlanır (SignalR ile anlık).
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
