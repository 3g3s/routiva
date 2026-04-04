import { MarketingLayout } from '../components/MarketingLayout'

export function TermsPage() {
  return (
    <MarketingLayout title="Kullanım Koşulları">
      <p>
        Bu belge <strong>örnek metin</strong>dir. Routiva platformunu kullanmadan önce nihai kullanım koşulları,
        üyelik sözleşmesi ve KVKK aydınlatma metinleri hukuk danışmanlığı ile hazırlanmalıdır.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Platform üzerinde paylaşılan yük ve araç bilgilerinin doğruluğundan kullanıcılar sorumludur.</li>
        <li>Taşıma sözleşmesi taraflar arasında yapılır; Routiva aracı rolünde tanımlanmalıdır.</li>
        <li>Hizmet kesintileri, bakım ve geliştirme çalışmaları için önceden duyurulabilir.</li>
        <li>Kötüye kullanım, sahte ilan ve dolandırıcılık girişimleri hesap kapatma ile sonuçlanabilir.</li>
      </ul>
    </MarketingLayout>
  )
}
