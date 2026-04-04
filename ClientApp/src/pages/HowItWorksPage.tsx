import { MarketingLayout } from '../components/MarketingLayout'

export function HowItWorksPage() {
  return (
    <MarketingLayout title="Nasıl Çalışır?">
      <p className="font-medium text-slate-800">Üç adımda yük veya araç eşleştirmesi</p>
      <ol className="list-decimal space-y-3 pl-5">
        <li>
          <strong className="text-slate-800">Yük veya araç girin.</strong> Çıkış / varış şehirlerini seçin; yük
          için ağırlık (kg) ve hacim (desi), araç için kapasite ve araç tipini belirtin.
        </li>
        <li>
          <strong className="text-slate-800">Sistem eşleştirsin.</strong> Güzergâh ve yük özelliklerine göre
          uygun taşıyıcı veya yük ilanları listelenir; haritada rota önizlemesi gösterilir.
        </li>
        <li>
          <strong className="text-slate-800">Teklifleri karşılaştırın.</strong> Fiyat, süre ve kapasite uygunluğuna
          göre en iyi seçeneği seçin — ileride anlık teklif ve pazarlık akışları eklenebilir.
        </li>
      </ol>
      <p>
        <strong>Desi nedir?</strong> Kargo sektöründe hacimsel ağırlık birimidir; kabaca{' '}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">(en × boy × yük cm) ÷ 3000</code> ile
        hesaplanır. Taşıyıcı, hem kg hem desi ile kapasite planı yapabilir.
      </p>
    </MarketingLayout>
  )
}
