import { MarketingLayout } from '../components/MarketingLayout'

const items = [
  {
    q: 'Routiva hangi taşıma türlerini kapsıyor?',
    a: 'Şu an odak karayolu (şehirler arası) taşımacılığıdır. İleride multimodal ve depo entegrasyonları değerlendirilebilir.',
  },
  {
    q: 'Desi ile kg farkı ne?',
    a: 'Kg gerçek ağırlıktır; desi ise paketin kapladığı hacmin taşıma birimidir. Hacimli ama hafif yüklerde fiyatlandırma desiye göre yapılabilir.',
  },
  {
    q: 'Haritada rota gerçek yol mu?',
    a: 'Arayüzde görünen rota görselleştirmedir. Üretimde .NET tarafında yol ağı / mesafe API’si ile kesin mesafe ve süre hesaplanacaktır.',
  },
  {
    q: 'Ödeme platform üzerinden mi?',
    a: 'Bu prototipte ödeme yoktur. Canlıya geçişte escrow veya fatura entegrasyonu ayrıca tasarlanmalıdır.',
  },
  {
    q: 'Hangi şehirler destekleniyor?',
    a: 'Türkiye geneli iller listesi genişletilmiştir; talebe göre ilçe ve OSRM/OSM detayı eklenebilir.',
  },
]

export function FaqPage() {
  return (
    <MarketingLayout title="Sıkça Sorulan Sorular">
      <ul className="space-y-6">
        {items.map((item) => (
          <li key={item.q} className="border-b border-slate-200 pb-6 last:border-0">
            <p className="font-semibold text-[var(--color-r-navy)]">{item.q}</p>
            <p className="mt-2 text-slate-600">{item.a}</p>
          </li>
        ))}
      </ul>
    </MarketingLayout>
  )
}
