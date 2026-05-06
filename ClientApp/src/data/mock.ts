import { getCity, routeLabel } from '../lib/geo'
import frigoSilhouette from '../assets/vehicle-silhouettes/frigo.svg'
import kamyonSilhouette from '../assets/vehicle-silhouettes/kamyon.svg'
import kamyonetSilhouette from '../assets/vehicle-silhouettes/kamyonet.svg'
import lowbedSilhouette from '../assets/vehicle-silhouettes/lowbed.svg'
import tirSilhouette from '../assets/vehicle-silhouettes/tir.png'

export const LOAD_TYPES = [
  {
    id: 'ftl',
    label: 'Paletli Taşıma (FTL / Komple)',
    description: 'Paletli, genelde aracı dolduran komple yükler',
  },
  {
    id: 'ltl',
    label: 'Parsiyel Taşıma (LTL / Parça Yük)',
    description: 'Aracı doldurmayan, kolili veya parça gönderiler',
  },
  {
    id: 'frigo',
    label: 'Frigofirik Taşıma (Reefer / Soğuk Zincir)',
    description: 'Isı kontrollü taşımacılık – gıda, ilaç vb.',
  },
  {
    id: 'bulk',
    label: 'Dökme Yük Taşımacılığı (Bulk)',
    description: 'Ambalajsız yükler – tahıl, kömür, kum, maden vb.',
  },
  {
    id: 'proje',
    label: 'Ağır Yük & Proje Taşımacılığı (Lowbed / Gabari Dışı)',
    description: 'İş makineleri, büyük ekipmanlar, standart dışı ölçüler',
  },
  {
    id: 'konteyner',
    label: 'Konteyner Taşımacılığı (FCL / LCL)',
    description: 'Liman bazlı, deniz/karayolu kombine taşımalar',
  },
  {
    id: 'adr',
    label: 'Tehlikeli Madde Taşımacılığı (ADR)',
    description: 'Yanıcı, patlayıcı, kimyasal ürünler',
  },
  {
    id: 'tanker',
    label: 'Sıvı Yük Taşımacılığı (Tanker)',
    description: 'Akaryakıt, kimyasal, gıda sıvıları',
  },
  {
    id: 'goh',
    label: 'Askılı Tekstil Taşımacılığı (Garment on Hanger)',
    description: 'Kırışmaması gereken tekstil ürünleri',
  },
  {
    id: 'volumetrik',
    label: 'Hacimli / Hafif Yük (Volumetrik Yük)',
    description: 'Ağırlıktan çok hacim kaplayan yükler',
  },
] as const

export type LoadTypeEntry = (typeof LOAD_TYPES)[number]

export function getLoadTypeById(id: string): LoadTypeEntry {
  return LOAD_TYPES.find((t) => t.id === id) ?? LOAD_TYPES[0]
}

function loadTypePricingMultiplier(loadTypeId: string): number {
  const m: Record<string, number> = {
    ftl: 1,
    ltl: 0.94,
    frigo: 1.16,
    bulk: 0.91,
    proje: 1.35,
    konteyner: 1.1,
    adr: 1.24,
    tanker: 1.2,
    goh: 1.08,
    volumetrik: 1.06,
  }
  return m[loadTypeId] ?? 1
}

function loadTypeCarrierNote(loadTypeId: string): string {
  const n: Record<string, string> = {
    ftl: 'Komple araç tahsisi; palet adedi ve yükleme süreleri teyit edilir.',
    ltl: 'Parsiyel hat; konsolidasyon ve aktarma süreleri eklenebilir.',
    frigo: 'Reefer set sıcaklığı ve veri kaydı talebe göre ayarlanır.',
    bulk: 'Dökme yükleme için silo / hammadde uygunluğu kontrol edilir.',
    proje: 'Gabari, izin ve lowbed ekipmanı proje bazında planlanır.',
    konteyner: 'FCL/LCL ve liman vardiya saatleri koordinasyonu gerekir.',
    adr: 'ADR sınıfı, belgeler ve uygun araç/şoför zorunludur.',
    tanker: 'Tank temizliği ve ürün uygunluğu önceden onaylanır.',
    goh: 'Askılı sistem uygunluğu ve tekstil özel istifleme.',
    volumetrik: 'Desi / hacim ağırlıktan baskın; fiyatlandırma hacimsel yapılır.',
  }
  return n[loadTypeId] ?? 'Standart yükleme / boşaltma pencereleri hafta içi 08:00–18:00.'
}

export const VEHICLE_TYPES = [
  { id: 'tir', label: 'Tır' },
  { id: 'kamyon', label: 'Kamyon' },
  { id: 'kamyonet', label: 'Kamyonet' },
  { id: 'frigo', label: 'Frigorifik' },
  { id: 'lowbed', label: 'Lowbed' },
] as const

export type VehicleTypeEntry = (typeof VEHICLE_TYPES)[number]

export function getVehicleTypeById(id: string): VehicleTypeEntry {
  return VEHICLE_TYPES.find((v) => v.id === id) ?? VEHICLE_TYPES[0]
}

export function getVehicleImageByType(vehicleTypeId: string): string {
  const map: Record<string, string> = {
    tir: tirSilhouette,
    kamyon: kamyonSilhouette,
    kamyonet: kamyonetSilhouette,
    frigo: frigoSilhouette,
    lowbed: lowbedSilhouette,
  }
  return map[vehicleTypeId] ?? map.tir
}

export const CAPACITIES = ['3 ton', '5 ton', '10 ton', '15 ton', '18 ton', '24 ton', '40 ton (TIR)'] as const

/* ─── deterministik “rastgele” (aynı girdiler → aynı liste) ─── */

function hashSeed(...parts: (string | number)[]): number {
  const s = parts.join('|')
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function routeDistanceKm(fromId: string, toId: string): number {
  const a = getCity(fromId)
  const b = getCity(toId)
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLon = ((b.lng - a.lng) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  return Math.max(1, Math.round(2 * R * Math.asin(Math.sqrt(x))))
}

function formatTl(n: number) {
  return `${n.toLocaleString('tr-TR')} TL`
}

function formatIdNumber(seedNumber: number, prefix = 'TR') {
  // Demo için deterministik “kimlik/verg. no” üretir (11 haneli gibi görünür).
  const base = Math.floor(seedNumber % 90000000000) // 0..89999999999
  const digits = (base + 10000000000).toString().slice(-11)
  return `${prefix} ${digits}`
}

function avatarLogoUrl(seed: string, background: string) {
  // Proje demo amaçlı; görseller internet üzerinden.
  return `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${encodeURIComponent(background)}`
}

function avatarDriverUrl(seed: string, background: string) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${encodeURIComponent(background)}`
}

const DRIVER_FULL_NAMES = ['Mehmet Yılmaz', 'Ahmet Şahin', 'Ayşe Demir', 'Burak Kaplan', 'Selin Koç', 'Can Şen'] as const

const NAKLIYAT_SIRKET = [
  'Denizci Taşımacılık',
  'Büyük Anadolu Nakliyat',
  'Yiğit Nakliyat',
  'Kuzey Lojistik',
  'Ege Hattı Taşımacılık',
  'Merkez Kargo Filo',
  'Arkas Routiva Ortak Filo',
  'Horoz Partner Nakliyat',
  'Borusan Lojistik Ağı',
  'CEVA Türkiye Hat',
  'Ulusoy Karayolu',
  'Sertrans Express',
  'Netlog Taşımacılık',
  'Mars Lojistik',
  'Omsan Karayolu',
  'Ekol Filo Partner',
  'Aktif Hat Nakliyat',
  'Çetiloğlu Taşımacılık',
  'Transit Anadolu Lojistik',
  'Alpnak Karayolu',
  'Cantek Lojistik',
  'Dalgıçlar Nakliyat',
  'Ezen Trans',
  'Kınalı Kardeşler Nakliyat',
  'LojistikPlus',
  'Boğaz Köprü Lojistik',
  'Toros Dağı Taşımacılık',
  'Kapıkule Ekspres',
  'Otoyol Filo Hizmetleri',
  'Yeşilırmak Lojistik',
  'Fırat Trans',
  'Van Gölü Taşımacılık',
  'Karadeniz Hat Lojistik',
  'Akdeniz Rota Nakliyat',
  'İç Anadolu Birlik Filo',
  'Güneydoğu Trans',
  'Atlas Yük Taşımacılık',
  'Pamukkale Nakliyat',
  'Uludağ Rota Lojistik',
  'Salda Gölü Trans',
] as const

const YUK_VEREN_ORNEK = [
  'ABC Mobilya A.Ş.',
  'Ege Gıda San.',
  'Karadeniz Tekstil',
  'Marmara Kimya',
  'Anadolu Yapı Malzemeleri',
  'Akdeniz İhracat',
  'Trakya Gıda',
  'Bursa Otomotiv Yan San.',
  'Mersin Liman Lojistik',
  'Van Ticaret',
  'Erzurum Tekstil',
  'Hatay Narenciye',
  'Sakarya Beyaz Eşya',
  'Denizli Havlu Üretim',
  'Balıkesir Zeytin',
  'Muğla Turizm Supply',
  'Şanlıurfa Tekstil',
  'Malatya Kayısı İşl.',
  'Trabzon Çay İhracat',
  'Eskişehir Savunma San.',
  'Kahramanmaraş Biber',
  'Manisa Şarapçılık',
  'Aydın İncir Kooperatifi',
  'Gaziantep Baklava',
  'Antalya Seracılık',
  'Kayseri Halı',
  'Samsun Un Fabrikası',
  'İzmir Kimya',
  'Konya Tarım Mak.',
  'Diyarbakır Hububat',
  'Elazığ Mermer',
  'Adıyaman Fıstık',
] as const

const YUK_TURLERI = LOAD_TYPES.map((t) => t.label)

function shuffleIndices(n: number, rng: () => number): number[] {
  const a = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export type CarrierOfferDetail = {
  slot: number
  id: string
  company: string
  companyIdNumber: string
  companyLogoUrl: string
  route: string
  price: string
  priceValue: number
  eta: string
  etaHours: number
  rating: number
  completedJobs: number
  driverName: string
  driverIdNumber: string
  driverPhotoUrl: string
  plate: string
  phone: string
  contactName: string
  maxKg: number
  maxDesi: number
  insurance: string
  validUntil: string
  notes: string
  loadTypeId: string
  vehicleTypeId: string
  /** kullanıcı girdisiyle uyum */
  fitsCargo: boolean
}

function pickVehicleTypeForLoad(loadTypeId: string, rng: () => number): string {
  if (loadTypeId === 'frigo') return 'frigo'
  if (loadTypeId === 'proje') return 'lowbed'
  const pool = ['tir', 'kamyon', 'kamyonet', 'tir', 'kamyon']
  return pool[Math.floor(rng() * pool.length)] ?? 'tir'
}

/** Yük oluştur ekranı: kg + desi + rota + yük tipine göre teklif listesi (her seferinde farklı kombinasyon) */
export function carrierOffersForSearch(params: {
  fromId: string
  toId: string
  weightKg: number
  desi: number
  loadTypeId: string
  limit?: number
}): CarrierOfferDetail[] {
  const { fromId, toId, weightKg, desi, loadTypeId } = params
  const limit = params.limit ?? 12
  const route = routeLabel(fromId, toId)
  const km = routeDistanceKm(fromId, toId)
  const seed = hashSeed(fromId, toId, Math.round(weightKg), Math.round(desi * 10) / 10, loadTypeId)
  const rng = mulberry32(seed)
  const order = shuffleIndices(NAKLIYAT_SIRKET.length, rng)

  const loadMult = loadTypePricingMultiplier(loadTypeId)
  const volBoost = loadTypeId === 'volumetrik' ? 1 + desi / 500 : 1

  const out: CarrierOfferDetail[] = []
  for (let slot = 0; slot < limit; slot++) {
    const name = NAKLIYAT_SIRKET[order[slot % NAKLIYAT_SIRKET.length]]
    const jitter = rng() * 900 + rng() * 400
    const base = 1200 + km * 18 + weightKg * 3.2 + desi * 11
    const priceValue = Math.round((base * loadMult * volBoost + jitter) / 50) * 50
    const etaHours = 4 + Math.floor(rng() * 10)
    const maxKg = Math.round(weightKg + 150 + rng() * 2200)
    const maxDesi = Math.round(desi + 8 + rng() * 120)
    const fitsCargo = maxKg >= weightKg && maxDesi >= desi
    const vehicleTypeId = pickVehicleTypeForLoad(loadTypeId, rng)
    const driverName = DRIVER_FULL_NAMES[Math.floor(rng() * DRIVER_FULL_NAMES.length)]
    const companyIdNumber = formatIdNumber(seed + slot * 791 + Math.floor(rng() * 1000), 'TR')
    const driverIdNumber = formatIdNumber(seed + slot * 353 + Math.floor(rng() * 1000), 'TR')
    const companyLogoUrl = avatarLogoUrl(name, 'f37021')
    const driverPhotoUrl = avatarDriverUrl(driverName, '0c1929')
    const plate = `${34 + Math.floor(rng() * 47)} ${String.fromCharCode(65 + Math.floor(rng() * 26))}${String.fromCharCode(65 + Math.floor(rng() * 26))} ${100 + Math.floor(rng() * 899)}`
    const phone = `+90 5${Math.floor(rng() * 9)}${Math.floor(rng() * 10)} ${100 + Math.floor(rng() * 900)} ${10 + Math.floor(rng() * 89)} ${10 + Math.floor(rng() * 89)}`

    out.push({
      slot,
      id: `t-${seed}-${slot}`,
      company: name,
      route,
      price: formatTl(priceValue),
      priceValue,
      eta: `${etaHours} saat`,
      etaHours,
      rating: Math.round((3.6 + rng() * 1.35) * 10) / 10,
      completedJobs: 120 + Math.floor(rng() * 2400),
      companyIdNumber,
      companyLogoUrl,
      driverName,
      driverIdNumber,
      driverPhotoUrl,
      plate,
      phone,
      contactName: driverName,
      maxKg,
      maxDesi,
      insurance: rng() > 0.35 ? 'Tam kasko + yük sigortası' : 'Yük sigortası (temel)',
      validUntil: `Bugünden itibaren ${6 + Math.floor(rng() * 8)} gün`,
      notes: loadTypeCarrierNote(loadTypeId),
      loadTypeId,
      vehicleTypeId,
      fitsCargo,
    })
  }

  return out.sort((a, b) => {
    if (a.fitsCargo !== b.fitsCargo) return a.fitsCargo ? -1 : 1
    return a.priceValue - b.priceValue
  }).map((o, i) => ({ ...o, slot: i, id: `t-${seed}-${i}` }))
}

export type LoadCardData = {
  id: string
  company: string
  fromId: string
  toId: string
  kind: string
  weight: string
  desi: number
  tonNumeric: number
}

export type LoadListingDetail = LoadCardData & {
  route: string
  slot: number
  pickupWindow: string
  paymentTerms: string
  contactPhone: string
  loadingNote: string
  unloadingNote: string
  fitsCapacity: boolean
}

export function parseTonFromLabel(weight: string): number {
  const m = weight.match(/(\d+(?:\.\d+)?)/)
  return m ? Number(m[1]) : 0
}

export function parseCapacityTons(capacityLabel: string): number {
  const m = capacityLabel.match(/(\d+(?:\.\d+)?)/)
  return m ? Number(m[1]) : 10
}

/** Araç ilanı: kapasite (ton) + rota + araç tipine göre uygun yükler */
export function loadCardsForVehicleSearch(params: {
  fromId: string
  toId: string
  capacityLabel: string
  vehicleTypeId: string
  limit?: number
}): LoadListingDetail[] {
  const { fromId, toId, capacityLabel, vehicleTypeId } = params
  const limit = params.limit ?? 12
  const cap = parseCapacityTons(capacityLabel)
  const route = routeLabel(fromId, toId)
  const seed = hashSeed(fromId, toId, capacityLabel, vehicleTypeId)
  const rng = mulberry32(seed)

  const rows: LoadListingDetail[] = []
  let guard = 0
  while (rows.length < limit && guard < 80) {
    guard++
    const ton = Math.round((cap * (0.22 + rng() * 0.78)) * 10) / 10
    if (ton < 0.5 || ton > cap + 0.01) continue

    const desi = Math.max(12, Math.round(25 + rng() * 260 * (ton / Math.max(cap, 1))))
    const shipper = YUK_VEREN_ORNEK[Math.floor(rng() * YUK_VEREN_ORNEK.length)]
    let kind = YUK_TURLERI[Math.floor(rng() * YUK_TURLERI.length)]
    if (vehicleTypeId === 'frigo' && rng() > 0.35) {
      kind = LOAD_TYPES.find((t) => t.id === 'frigo')!.label
    }
    if (vehicleTypeId === 'lowbed' && rng() > 0.45) {
      kind = LOAD_TYPES.find((t) => t.id === 'proje')!.label
    }

    const fitsCapacity = ton <= cap
    const id = `y-${seed}-${rows.length}`

    rows.push({
      id,
      slot: rows.length,
      company: shipper,
      fromId,
      toId,
      kind,
      weight: `${ton} ton`,
      desi,
      tonNumeric: ton,
      route,
      pickupWindow:
        rng() > 0.5
          ? 'Yarın 09:00–17:00'
          : `${2 + Math.floor(rng() * 4)} gün içinde esnek`,
      paymentTerms: rng() > 0.45 ? 'Teslimatta nakit / 7 gün vade' : 'Fatura 15 gün',
      contactPhone: `+90 3${Math.floor(rng() * 3)}${Math.floor(rng() * 10)} ${200 + Math.floor(rng() * 800)} ${1000 + Math.floor(rng() * 8999)}`,
      loadingNote: `${getCity(fromId).label} · ${getCity(fromId).detail} civarı depo / fabrika`,
      unloadingNote: `${getCity(toId).label} · varış noktası detayı teklif sonrası`,
      fitsCapacity,
    })
  }

  return rows
    .sort((a, b) => {
      if (a.fitsCapacity !== b.fitsCapacity) return a.fitsCapacity ? -1 : 1
      return b.tonNumeric - a.tonNumeric
    })
    .map((o, i) => ({ ...o, slot: i, id: `y-${seed}-${i}` }))
}

/** Taşıyıcı detay URL sorgusu */
export function buildCarrierOfferQuery(p: {
  fromId: string
  toId: string
  weightKg: string
  desi: string
  loadType: string
}) {
  const q = new URLSearchParams({
    from: p.fromId,
    to: p.toId,
    kg: p.weightKg,
    desi: p.desi,
    loadType: p.loadType,
  })
  return q.toString()
}

export function parseCarrierOfferQuery(search: string) {
  const raw = search.startsWith('?') ? search.slice(1) : search
  const q = new URLSearchParams(raw)
  return {
    fromId: q.get('from') ?? 'istanbul',
    toId: q.get('to') ?? 'ankara',
    weightKg: Number.parseInt(q.get('kg') ?? '0', 10) || 0,
    desi: Number.parseFloat((q.get('desi') ?? '0').replace(',', '.')) || 0,
    loadTypeId: q.get('loadType') ?? 'ftl',
  }
}

/** Yük ilanı detay URL sorgusu */
export function buildLoadListingQuery(p: {
  fromId: string
  toId: string
  capacity: string
  vehicleType: string
}) {
  const q = new URLSearchParams({
    from: p.fromId,
    to: p.toId,
    cap: p.capacity,
    vehicle: p.vehicleType,
  })
  return q.toString()
}

export function parseLoadListingQuery(search: string) {
  const raw = search.startsWith('?') ? search.slice(1) : search
  const q = new URLSearchParams(raw)
  return {
    fromId: q.get('from') ?? 'istanbul',
    toId: q.get('to') ?? 'ankara',
    capacityLabel: q.get('cap') ?? '10 ton',
    vehicleTypeId: q.get('vehicle') ?? 'tir',
  }
}

/** Sohbet sayfası URL’si (UTF-8 güvenli) */
export function buildChatUrl(p: {
  partner: string
  mod: 'tasiyici' | 'yukveren'
  rota?: string
  ozet?: string
}) {
  const q = new URLSearchParams()
  q.set('partner', p.partner)
  q.set('mod', p.mod)
  if (p.rota) q.set('rota', p.rota)
  if (p.ozet) q.set('ozet', p.ozet)
  return `/sohbet?${q.toString()}`
}

export function parseChatQuery(search: string) {
  const raw = search.startsWith('?') ? search.slice(1) : search
  const q = new URLSearchParams(raw)
  return {
    partner: q.get('partner') ?? 'Firma',
    mod: (q.get('mod') === 'yukveren' ? 'yukveren' : 'tasiyici') as 'tasiyici' | 'yukveren',
    rota: q.get('rota') ?? '',
    ozet: q.get('ozet') ?? '',
  }
}
