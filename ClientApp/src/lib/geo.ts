/** Türkiye illeri — harita pimi ve rota için yaklaşık merkez koordinatları */
export const CITIES = [
  { id: 'adana', label: 'Adana', detail: 'Merkez / Çukurova', lat: 37.0, lng: 35.3213 },
  { id: 'adiyaman', label: 'Adıyaman', detail: 'Merkez', lat: 37.7648, lng: 38.2786 },
  { id: 'ankara', label: 'Ankara', detail: 'Başkent / Çankaya', lat: 39.9334, lng: 32.8597 },
  { id: 'antalya', label: 'Antalya', detail: 'Muratpaşa / Konyaaltı', lat: 36.8969, lng: 30.7133 },
  { id: 'aydin', label: 'Aydın', detail: 'Efeler', lat: 37.856, lng: 27.8416 },
  { id: 'balikesir', label: 'Balıkesir', detail: 'Karesi', lat: 39.6484, lng: 27.8826 },
  { id: 'bursa', label: 'Bursa', detail: 'Osmangazi / Nilüfer', lat: 40.1826, lng: 29.0665 },
  { id: 'denizli', label: 'Denizli', detail: 'Merkezefendi', lat: 37.7765, lng: 29.0864 },
  { id: 'diyarbakir', label: 'Diyarbakır', detail: 'Bağlar / Sur', lat: 37.9144, lng: 40.2306 },
  { id: 'elazig', label: 'Elazığ', detail: 'Merkez', lat: 38.681, lng: 39.2264 },
  { id: 'erzurum', label: 'Erzurum', detail: 'Yakutiye', lat: 39.9043, lng: 41.2678 },
  { id: 'eskisehir', label: 'Eskişehir', detail: 'Odunpazarı', lat: 39.7767, lng: 30.5206 },
  { id: 'gaziantep', label: 'Gaziantep', detail: 'Şahinbey', lat: 37.0662, lng: 37.3833 },
  { id: 'hatay', label: 'Hatay', detail: 'Antakya / İskenderun', lat: 36.4018, lng: 36.3498 },
  { id: 'istanbul', label: 'İstanbul', detail: 'Avrupa / Anadolu', lat: 41.0082, lng: 28.9784 },
  { id: 'izmir', label: 'İzmir', detail: 'Konak / Bornova', lat: 38.4237, lng: 27.1428 },
  { id: 'kahramanmaras', label: 'Kahramanmaraş', detail: 'Dulkadiroğlu', lat: 37.5858, lng: 36.9371 },
  { id: 'kayseri', label: 'Kayseri', detail: 'Melikgazi', lat: 38.7312, lng: 35.4787 },
  { id: 'kocaeli', label: 'Kocaeli', detail: 'İzmit', lat: 40.8533, lng: 29.8815 },
  { id: 'konya', label: 'Konya', detail: 'Selçuklu', lat: 37.8667, lng: 32.4833 },
  { id: 'malatya', label: 'Malatya', detail: 'Battalgazi', lat: 38.3552, lng: 38.3095 },
  { id: 'manisa', label: 'Manisa', detail: 'Şehzadeler', lat: 38.6191, lng: 27.4289 },
  { id: 'mersin', label: 'Mersin', detail: 'Yenişehir / Toroslar', lat: 36.8, lng: 34.6333 },
  { id: 'mugla', label: 'Muğla', detail: 'Menteşe / Bodrum hattı', lat: 37.2153, lng: 28.3636 },
  { id: 'sakarya', label: 'Sakarya', detail: 'Adapazarı', lat: 40.694, lng: 30.4358 },
  { id: 'samsun', label: 'Samsun', detail: 'İlkadım / Atakum', lat: 41.2867, lng: 36.33 },
  { id: 'sanliurfa', label: 'Şanlıurfa', detail: 'Eyyübiye / Haliliye', lat: 37.1591, lng: 38.7969 },
  { id: 'tekirdag', label: 'Tekirdağ', detail: 'Süleymanpaşa', lat: 40.9833, lng: 27.5167 },
  { id: 'trabzon', label: 'Trabzon', detail: 'Ortahisar', lat: 41.0015, lng: 39.7178 },
  { id: 'van', label: 'Van', detail: 'İpekyolu', lat: 38.4891, lng: 43.4089 },
] as const

export type CityId = (typeof CITIES)[number]['id']

export function getCity(id: string) {
  return CITIES.find((c) => c.id === id) ?? CITIES.find((c) => c.id === 'istanbul')!
}

export function routeLabel(fromId: string, toId: string) {
  const a = getCity(fromId)
  const b = getCity(toId)
  return `${a.label} → ${b.label}`
}
