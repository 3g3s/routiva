import { MarketingLayout } from '../components/MarketingLayout'

export function ContactPage() {
  return (
    <MarketingLayout title="İletişim">
      <p>
        Bize <a href="mailto:info@routiva.com" className="font-semibold text-[var(--color-r-orange)] hover:underline">info@routiva.com</a>{' '}
        adresinden ulaşabilir veya aşağıdaki formu doldurabilirsiniz (form gönderimi backend bağlantısı sonrası
        aktif edilecektir).
      </p>
      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="block text-xs font-medium text-slate-500">
          Ad Soyad
          <input
            type="text"
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-[var(--color-r-orange)] focus:ring-2"
            placeholder="Adınız"
            disabled
          />
        </label>
        <label className="block text-xs font-medium text-slate-500">
          E-posta
          <input
            type="email"
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-[var(--color-r-orange)] focus:ring-2"
            placeholder="ornek@firma.com"
            disabled
          />
        </label>
        <label className="block text-xs font-medium text-slate-500">
          Mesaj
          <textarea
            rows={4}
            className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-[var(--color-r-orange)] focus:ring-2"
            placeholder="Kısaca talebinizi yazın..."
            disabled
          />
        </label>
        <button
          type="button"
          disabled
          className="rounded-lg bg-slate-200 py-2.5 text-sm font-semibold text-slate-500"
        >
          Gönder (yakında)
        </button>
      </div>
      <p className="text-xs text-slate-500">Telefon: +90 555 000 00 00 · Adres: İstanbul, Türkiye</p>
    </MarketingLayout>
  )
}
