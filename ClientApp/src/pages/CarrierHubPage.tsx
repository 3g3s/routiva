import {
  ArrowRight,
  Bus,
  CheckCircle2,
  CircleDot,
  Flag,
  MapPin,
  Package,
  Pin,
  Save,
  Signpost,
  Sparkles,
  Trash2,
  Truck,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { AppHeader } from '../components/AppHeader'
import { MapRoutePicker, type RouteLeg, type RoutePoint } from '../components/MapRoutePicker'
import { RouteMapView } from '../components/RouteMapView'
import { SiteFooter } from '../components/SiteFooter'
import { AdrHazardMark } from '../components/AdrHazardMark'
import { buildLoadListingQuery, CAPACITIES, loadCardsForVehicleSearch, VEHICLE_TYPES } from '../data/mock'
import { CITIES, getCity, getNearestCityId } from '../lib/geo'
import { fetchProfileRoute, saveProfileRoute } from '../lib/profileRoute'

function approxLabel(p: RoutePoint) {
  return `${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}`
}

export function CarrierHubPage() {
  const { user } = useAuth()
  const isCarrier = user?.role === 'tasiyici'

  const [fromId, setFromId] = useState('istanbul')
  const [toId, setToId] = useState('ankara')
  const [vehicleType, setVehicleType] = useState('tir')
  const [capacity, setCapacity] = useState('10 ton')
  const [searched, setSearched] = useState(false)

  const [origin, setOrigin] = useState<RoutePoint | null>(null)
  const [destination, setDestination] = useState<RoutePoint | null>(null)
  const [activeLeg, setActiveLeg] = useState<RouteLeg>('origin')
  const [originLabel, setOriginLabel] = useState('')
  const [destLabel, setDestLabel] = useState('')

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveOk, setSaveOk] = useState(false)
  const [profileLine, setProfileLine] = useState<string | null>(null)

  const from = getCity(fromId)
  const to = getCity(toId)
  const vehicleLabel = VEHICLE_TYPES.find((v) => v.id === vehicleType)?.label ?? 'Tır'

  const pointsDone = Boolean(origin && destination)
  const canSaveProfile = Boolean(user && origin && destination && !saving)

  const mapHint = useMemo(() => {
    if (activeLeg === 'origin') {
      if (!origin) return 'Aşağıdan «Çıkış A» seçili — haritaya tıkla'
      const c = getCity(getNearestCityId(origin.lat, origin.lng))
      return `Çıkış: ${origin.lat.toFixed(4)}, ${origin.lng.toFixed(4)} · ${c.label}`
    }
    if (!destination) return '«Varış B» seçili — haritaya tıkla'
    const c = getCity(getNearestCityId(destination.lat, destination.lng))
    return `Varış: ${destination.lat.toFixed(4)}, ${destination.lng.toFixed(4)} · ${c.label}`
  }, [activeLeg, origin, destination])

  useEffect(() => {
    if (!user) return
    ;(async () => {
      try {
        const data = await fetchProfileRoute()
        if (!data?.origin) return
        setOrigin({ lat: data.origin.lat, lng: data.origin.lng })
        setOriginLabel(data.origin.label ?? approxLabel({ lat: data.origin.lat, lng: data.origin.lng }))
        if (data.destination) {
          setDestination({ lat: data.destination.lat, lng: data.destination.lng })
          setDestLabel(data.destination.label ?? approxLabel({ lat: data.destination.lat, lng: data.destination.lng }))
          const a = getCity(getNearestCityId(data.origin.lat, data.origin.lng)).label
          const b = getCity(getNearestCityId(data.destination.lat, data.destination.lng)).label
          setProfileLine(`${a} → ${b}`)
        } else {
          setProfileLine(null)
        }
      } catch {
        // ignore
      }
    })()
  }, [user])

  useEffect(() => {
    if (!origin) return
    setFromId(getNearestCityId(origin.lat, origin.lng))
  }, [origin])

  useEffect(() => {
    if (!destination) return
    setToId(getNearestCityId(destination.lat, destination.lng))
  }, [destination])

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

  const roleLine =
    user?.role === 'tasiyici'
      ? 'Taşıyıcı hesabı'
      : user?.role === 'yukveren'
        ? 'Yük veren hesabı'
        : user
          ? 'Giriş yapıldı'
          : 'Misafir'

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-r-bg)]">
      <AppHeader
        title="Taşıyıcı Merkezi"
        subtitle="İki nokta işaretle, profiline kaydet, uygun yükleri listele"
      />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        {/* Üst gezinme şeridi */}
        <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/90 p-2 shadow-sm backdrop-blur">
          {(
            [
              { to: '/', label: 'Ana sayfa', needUser: false, active: false },
              { to: '/panel', label: 'Panel', needUser: true, active: false },
              { to: '/guzergahim', label: 'Güzergâhım', needUser: true, active: false },
              { to: '/tasiyici', label: 'Taşıyıcı merkezi', needUser: false, active: true },
            ] as const
          )
            .filter((x) => !x.needUser || user)
            .map((x) => (
              <Link
                key={x.label}
                to={x.to}
                className={`rounded-xl px-3 py-2 text-xs font-bold sm:text-sm ${
                  x.active ? 'bg-[var(--color-r-navy)] text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {x.label}
              </Link>
            ))}
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-br from-[var(--color-r-navy)] via-slate-900 to-slate-950 p-6 text-white shadow-xl sm:p-8">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[var(--color-r-orange)]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-[var(--color-r-blue-accent)]/20 blur-3xl" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white/85">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                Harita + ilanlar
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">Çift nokta: çıkış ve varış</h2>
              <p className="mt-2 max-w-2xl text-sm font-medium text-white/80">
                Önce turuncu <strong>çıkış</strong>, sonra mavi <strong>varış</strong> noktasını işaretle. Giriş yaptıysan
                güzergâhı tek tıkla profiline yaz; aşağıdaki şehir seçimleri haritayla senkron kalır.
              </p>
              <p className="mt-3 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-xs font-semibold text-white/90">
                <Signpost className="h-4 w-4 shrink-0 text-amber-200" />
                Durum: {roleLine}
                {pointsDone ? (
                  <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/25 px-2 py-0.5 text-emerald-100">
                    <CheckCircle2 className="h-3.5 w-3.5" /> 2/2 nokta hazır
                  </span>
                ) : (
                  <span className="ml-2 text-white/70">
                    {[origin, destination].filter(Boolean).length}/2 nokta
                  </span>
                )}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              {!user ? (
                <>
                  <Link
                    to="/giris"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[var(--color-r-navy)] shadow-lg hover:bg-slate-100"
                  >
                    Giriş yap
                  </Link>
                  <Link
                    to="/kayit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/35 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur hover:bg-white/15"
                  >
                    Kayıt ol
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/guzergahim"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-r-orange)] px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-[var(--color-r-orange-hover)]"
                  >
                    Güzergâhımı aç
                  </Link>
                  <Link
                    to="/panel"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/35 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur hover:bg-white/15"
                  >
                    Panele dön
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Adım göstergesi */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { n: '1', t: 'Haritada A ve B', d: 'Çıkış / varış işaretle', ok: pointsDone },
            { n: '2', t: 'Profil & filtre', d: 'Kaydet veya elle düzelt', ok: Boolean(saveOk || profileLine) },
            { n: '3', t: 'Yük bul', d: 'Listeyi doldur', ok: searched },
          ].map((s) => (
            <div
              key={s.n}
              className={`flex gap-3 rounded-2xl border p-4 shadow-sm ${
                s.ok ? 'border-emerald-200 bg-emerald-50/80' : 'border-slate-100 bg-white'
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                  s.ok ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {s.n}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{s.t}</p>
                <p className="mt-0.5 text-xs text-slate-600">{s.d}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          <section className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-lg sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-black text-[var(--color-r-navy)]">Harita stüdyosu</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Hangi noktayı işaretleyeceğini seç; haritaya tıkla. İkisini de seçtikten sonra kayıt düğmesi
                    etkinleşir.
                  </p>
                </div>
                {user ? (
                  <Link
                    to="/guzergahim"
                    className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-center text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    Kayıtlı rotam
                  </Link>
                ) : null}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveLeg('origin')}
                  className={`inline-flex flex-1 min-w-[140px] items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition sm:flex-none ${
                    activeLeg === 'origin'
                      ? 'border-orange-300 bg-orange-50 text-orange-950 ring-2 ring-[var(--color-r-orange)]/30'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <CircleDot className="h-4 w-4 text-[var(--color-r-orange)]" />
                  Çıkış A
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLeg('destination')}
                  className={`inline-flex flex-1 min-w-[140px] items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition sm:flex-none ${
                    activeLeg === 'destination'
                      ? 'border-blue-300 bg-blue-50 text-blue-950 ring-2 ring-blue-400/30'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Flag className="h-4 w-4 text-blue-600" />
                  Varış B
                </button>
                <div className="flex w-full gap-2 sm:ml-auto sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setOrigin(null)
                      setOriginLabel('')
                      setSaveOk(false)
                    }}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 sm:flex-none"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> A
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDestination(null)
                      setDestLabel('')
                      setSaveOk(false)
                    }}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 sm:flex-none"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> B
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <MapRoutePicker
                  origin={origin}
                  destination={destination}
                  activeLeg={activeLeg}
                  height={400}
                  hint={mapHint}
                  onChangeOrigin={(p) => {
                    setOrigin(p)
                    setOriginLabel(approxLabel(p))
                    setSaveOk(false)
                  }}
                  onChangeDestination={(p) => {
                    setDestination(p)
                    setDestLabel(approxLabel(p))
                    setSaveOk(false)
                  }}
                />
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Çıkış etiketi</span>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-3 shadow-sm focus-within:ring-2 focus-within:ring-[var(--color-r-orange)]/25">
                    <MapPin className="h-5 w-5 shrink-0 text-[var(--color-r-orange)]" />
                    <input
                      value={originLabel}
                      onChange={(e) => setOriginLabel(e.target.value)}
                      placeholder="Depo, rampa…"
                      className="min-w-0 flex-1 border-0 bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Varış etiketi</span>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-400/25">
                    <MapPin className="h-5 w-5 shrink-0 text-blue-600" />
                    <input
                      value={destLabel}
                      onChange={(e) => setDestLabel(e.target.value)}
                      placeholder="Teslim noktası…"
                      className="min-w-0 flex-1 border-0 bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
                    />
                  </div>
                </label>
              </div>

              <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
                <button
                  type="button"
                  disabled={!canSaveProfile}
                  onClick={async () => {
                    if (!user || !origin || !destination) return
                    setSaveError(null)
                    setSaveOk(false)
                    setSaving(true)
                    try {
                      await saveProfileRoute({
                        origin: { lat: origin.lat, lng: origin.lng, label: originLabel },
                        destination: { lat: destination.lat, lng: destination.lng, label: destLabel },
                      })
                      setSaveOk(true)
                      const a = getCity(getNearestCityId(origin.lat, origin.lng)).label
                      const b = getCity(getNearestCityId(destination.lat, destination.lng)).label
                      setProfileLine(`${a} → ${b}`)
                    } catch (e) {
                      setSaveError(e instanceof Error ? e.message : 'Kaydedilemedi.')
                    } finally {
                      setSaving(false)
                    }
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-r-navy)] px-6 py-4 text-sm font-black text-white shadow-lg transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Kaydediliyor…' : 'Güzergâhı profilime kaydet'}
                </button>
                {!user ? (
                  <p className="text-center text-sm text-slate-600 sm:text-left">
                    Kayıt için{' '}
                    <Link to="/giris" className="font-bold text-[var(--color-r-orange)] underline-offset-2 hover:underline">
                      giriş
                    </Link>{' '}
                    veya{' '}
                    <Link to="/kayit" className="font-bold text-[var(--color-r-orange)] underline-offset-2 hover:underline">
                      hesap oluştur
                    </Link>
                    .
                  </p>
                ) : !pointsDone ? (
                  <p className="flex-1 text-sm font-medium text-slate-600">
                    Kaydetmek için haritada <strong className="text-slate-900">hem A hem B</strong> seçili olmalı.
                  </p>
                ) : isCarrier ? (
                  <p className="flex-1 text-sm text-slate-600">
                    Kayıt sonrası <strong className="text-slate-900">Araç ilanı / yük arama</strong> ekranlarında şehirler
                    bu güzergâha göre önerilir.
                  </p>
                ) : (
                  <p className="flex-1 text-sm text-slate-600">
                    Yük veren olarak da güzergâhını saklayabilirsin; ileride yük ilanı akışında kullanılabilir.
                  </p>
                )}
              </div>

              {saveError ? (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                  {saveError}
                </div>
              ) : null}
              {saveOk ? (
                <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Güzergâh kaydedildi.
                  <Link to="/guzergahim" className="font-bold text-emerald-800 underline-offset-2 hover:underline">
                    Özeti gör
                  </Link>
                </div>
              ) : null}
            </div>
          </section>

          <aside className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-lg">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-black text-[var(--color-r-navy)]">Canlı özet</h3>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-[var(--color-r-orange)]">
                  Senkron
                </span>
              </div>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="rounded-xl border border-slate-100 bg-slate-50/90 px-4 py-3">
                  <dt className="text-xs font-bold text-slate-500">Çıkış (harita → şehir)</dt>
                  <dd className="mt-1 font-bold text-slate-900">
                    {from.label}
                    {origin ? (
                      <span className="ml-1 font-mono text-xs font-normal text-slate-500">
                        {origin.lat.toFixed(3)}, {origin.lng.toFixed(3)}
                      </span>
                    ) : null}
                  </dd>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/90 px-4 py-3">
                  <dt className="text-xs font-bold text-slate-500">Varış (harita → şehir)</dt>
                  <dd className="mt-1 font-bold text-slate-900">
                    {to.label}
                    {destination ? (
                      <span className="ml-1 font-mono text-xs font-normal text-slate-500">
                        {destination.lat.toFixed(3)}, {destination.lng.toFixed(3)}
                      </span>
                    ) : null}
                  </dd>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/90 px-4 py-3">
                  <dt className="text-xs font-bold text-slate-500">Profilde kayıtlı güzergâh</dt>
                  <dd className="mt-1 font-bold text-slate-900">{profileLine ?? '—'}</dd>
                </div>
                <div className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
                  <dt className="text-xs font-bold text-slate-500">Araç</dt>
                  <dd className="mt-1 flex items-center gap-2 font-bold text-slate-900">
                    <Truck className="h-4 w-4 text-[var(--color-r-orange)]" />
                    {vehicleLabel} · {capacity}
                  </dd>
                </div>
              </dl>
              <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-3 py-3 text-xs leading-relaxed text-slate-600">
                A ve B hazırsa aşağıda <strong className="text-slate-800">Yük Bul</strong> ile ilanları doldur. Şehir
                listesini istersen elle değiştirebilirsin; harita tekrar tıklanınca güncellenir.
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-xl sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">Adım 2</span>
              <h3 className="mt-2 text-lg font-black text-[var(--color-r-navy)]">Güzergâh ve kapasite</h3>
              <p className="mt-1 text-sm text-slate-600">Haritadan gelen şehirleri düzeltebilir veya kapasiteyi seçebilirsin.</p>
            </div>
          </div>
          {profileLine ? (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
              <div className="flex items-center gap-2">
                <Pin className="h-4 w-4 shrink-0" />
                Son kayıtlı profil güzergâhı: {profileLine}
              </div>
            </div>
          ) : null}
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:items-end">
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
            <h2 className="text-base font-bold text-[var(--color-r-navy)]">Araç özeti</h2>
            {!searched ? (
              <div className="mt-6 flex flex-col items-center py-6 text-center">
                <div className="rounded-2xl bg-slate-50 p-5 text-slate-300">
                  <Truck className="h-14 w-14" strokeWidth={1.25} />
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-800">Sıradaki adım</p>
                <p className="mt-1 max-w-xs text-xs text-slate-500">Haritayı tamamla veya şehirleri seç; sonra Yük Bul.</p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-r-orange)]" />
                    <div>
                      <p className="text-xs font-medium text-slate-500">Çıkış</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {from.label} <span className="font-normal text-slate-500">({from.detail})</span>
                      </p>
                    </div>
                  </div>
                  <div className="my-3 ml-1 border-l-2 border-dashed border-slate-200 pl-4" />
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-r-blue-accent)]" />
                    <div>
                      <p className="text-xs font-medium text-slate-500">Varış</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {to.label} <span className="font-normal text-slate-500">({to.detail})</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
                    <p className="text-xs text-slate-500">Araç</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{vehicleLabel}</p>
                  </div>
                  <div className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
                    <p className="text-xs text-slate-500">Kapasite</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{capacity}</p>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-lg">
            <h2 className="text-base font-bold text-[var(--color-r-navy)]">Rota haritası</h2>
            <div className="mt-4">
              <RouteMapView
                from={{ lat: from.lat, lng: from.lng, label: 'Çıkış' }}
                to={{ lat: to.lat, lng: to.lng, label: 'Varış' }}
                showRoute={searched}
                empty={!searched}
                overlayTitle={searched ? `${from.label} → ${to.label} | ${capacity}` : undefined}
                statusBar={searched ? '✓ Rota hazır. Uygun yükler aşağıda.' : undefined}
              />
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-lg">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-bold text-[var(--color-r-navy)]">Uygun yükler</h2>
            <span className="text-xs font-semibold text-slate-500">Adım 3 — sonuçlar</span>
          </div>
          {!searched ? (
            <div className="flex flex-col items-center py-14 text-center">
              <Package className="h-12 w-12 text-slate-300" strokeWidth={1.25} />
              <p className="mt-4 text-sm font-semibold text-slate-700">Liste için Yük Bul&apos;a bas</p>
              <p className="mt-1 max-w-md text-xs text-slate-500">Filtreleri ayarladıktan sonra uygun yükler burada listelenir.</p>
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
