import { MarketingLayout } from '../components/MarketingLayout'

export function AboutPage() {
  return (
    <MarketingLayout title="Hakkımızda">
      <p>
        Routiva, Türkiye karayolu lojistiğinde <strong>boş dönüş</strong> ve <strong>eksik kapasite</strong>{' '}
        kayıplarını azaltmak için tasarlanmış bir eşleştirme platformudur. Yük verenler ile taşıyıcıları aynı
        güzergâh ve zaman penceresinde buluşturarak hem maliyeti düşürmeyi hem de çevresel etkiyi iyileştirmeyi
        hedefleriz.
      </p>
      <p>
        Ürün yol haritamızda; gerçek yol mesafesine dayalı fiyat önerileri, konsolidasyon (aynı yöne giden
        yükleri bir araca toplama), <strong>backhauling</strong> (dönüşte boş kalan kapasiteyi doldurma) ve
        ileride SignalR ile anlık bildirimler yer almaktadır.
      </p>
      <p>
        Ekibimiz; ASP.NET Core (.NET 10) ve React ile güvenli, ölçeklenebilir bir mimari kurmaktadır. Veri
        katmanında PostgreSQL veya SQL Server (mekânsal / coğrafi sorgular) kullanımı planlanmaktadır.
      </p>
      <p className="text-xs text-slate-500">
        Bu sayfa tanıtım metnidir; resmi kurumsal bilgiler yayın öncesi güncellenebilir.
      </p>
    </MarketingLayout>
  )
}
