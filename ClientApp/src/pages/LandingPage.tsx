import type { CSSProperties } from 'react'
import { ArrowRight, Clock, Shield, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LandingHeader } from '../components/LandingHeader'
import { SiteFooter } from '../components/SiteFooter'

const HERO_IMG =
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <section id="anasayfa" className="relative min-h-[88vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/70" />
        <LandingHeader />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 pb-24 pt-36 text-center sm:pt-44">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">ROUTIVA</h1>
          <p className="mt-3 text-xl font-semibold text-white/95 sm:text-2xl">Yük &amp; Araç Eşleştirme</p>
          <p className="mt-4 max-w-xl text-base text-white/85 sm:text-lg">
            Türkiye genelinde yükünü ekle, en uygun aracı bul.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              to="/yuk-olustur"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-r-orange)] px-8 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-[var(--color-r-orange-hover)]"
            >
              Hemen Başla
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/arac-ilani"
              className="inline-flex items-center gap-2 rounded-xl border border-white/70 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Taşıyıcıyım
            </Link>
          </div>
        </div>
      </section>

      <section id="nasil" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--color-r-navy)] sm:text-3xl">Nasıl Çalışır?</h2>
          <p className="mx-auto mt-2 max-w-2xl text-slate-600">
            3 adımda yükünüz veya aracınız için en uygun eşi bulun.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch">
          {[
            {
              n: '1',
              color: 'bg-[var(--color-r-blue-accent)]',
              title: 'Yük / Araç Ekle',
              text: 'Yük bilgilerini veya boş aracınızı sisteme girin.',
            },
            {
              n: '2',
              color: 'bg-[var(--color-r-orange)]',
              title: 'Sistem Eşleştirir',
              text: 'Yükleri ve boş araçları saniyeler içinde en uygun şekilde eşleştiririz.',
            },
            {
              n: '3',
              color: 'bg-[var(--color-r-blue-accent)]',
              title: 'Teklifleri Gör',
              text: 'Gelen teklifleri inceleyin ve en iyi seçeneği değerlendirin.',
            },
          ].map((step, i) => (
            <div key={step.n} className="contents md:contents">
              <div className="flex flex-col items-center rounded-2xl border border-slate-100 bg-[var(--color-r-bg)] p-6 text-center shadow-sm">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white ${step.color}`}
                >
                  {step.n}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-[var(--color-r-navy)]">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.text}</p>
              </div>
              {i < 2 ? (
                <div className="hidden items-center justify-center text-2xl font-light text-slate-300 md:flex">
                  ›
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section id="hakkimizda" className="border-y border-slate-100 bg-[var(--color-r-bg)] py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:grid-cols-2 sm:px-6 sm:items-center">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-r-navy)] sm:text-3xl">Biz Kimiz?</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Routiva, Türkiye karayolu taşımacılığında boş dönüş ve eksik kapasite kayıplarını azaltmak için
              tasarlanmış akıllı bir eşleştirme platformudur. Yük konsolidasyonu ve geri dönüş (backhauling)
              ile maliyetleri düşürür, operasyonel verimliliği artırırız.
            </p>
          </div>
          <TurkeyIllustration />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Truck,
              title: 'Karayolu Odaklı',
              text: 'Yurt içi kara taşımacılığına özel süreçler ve eşleştirme mantığı.',
              accent: 'text-[var(--color-r-orange)]',
            },
            {
              icon: Clock,
              title: 'Hızlı Eşleşme',
              text: 'Uygun yük ve araçları kısa sürede listeleyin; teklifleri karşılaştırın.',
              accent: 'text-[var(--color-r-orange)]',
            },
            {
              icon: Shield,
              title: 'Güvenli Eşleşme',
              text: 'Kullanıcı ve işlem bilgilerinizi kurumsal standartlarda yönetmeyi hedefliyoruz.',
              accent: 'text-[var(--color-r-blue-accent)]',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-100 bg-[var(--color-r-bg)] p-6 shadow-sm"
            >
              <f.icon className={`h-10 w-10 ${f.accent}`} strokeWidth={1.5} />
              <h3 className="mt-4 text-lg font-semibold text-[var(--color-r-navy)]">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="iletisim" className="border-t border-slate-100 bg-[var(--color-r-bg)] py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 sm:px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[var(--color-r-navy)]">İletişime Geçin</h2>
            <ul className="mt-6 space-y-4 text-sm text-slate-600">
              <li className="flex gap-3">
                <span className="mt-0.5 text-[var(--color-r-orange)]">●</span>
                <span>İstanbul, Türkiye</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 text-[var(--color-r-orange)]">●</span>
                <span>+90 555 000 00 00</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 text-[var(--color-r-orange)]">●</span>
                <a href="mailto:info@routiva.com" className="font-medium text-[var(--color-r-navy)] hover:underline">
                  info@routiva.com
                </a>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-slate-500 shadow-inner">
            <p className="text-sm font-medium text-slate-700">İletişim formu</p>
            <p className="mt-2 text-sm">Bu alan backend entegrasyonu ile aktif edilebilir.</p>
          </div>
        </div>
      </section>

      <SiteFooter variant="landing" />
    </div>
  )
}

function TurkeyIllustration() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-8 shadow-inner">
      <p className="text-center text-xs font-medium uppercase tracking-wide text-slate-400">Türkiye ağı</p>
      <div className="relative mx-auto mt-6 aspect-[4/3] max-w-md">
        <svg viewBox="0 0 400 300" className="h-full w-full text-slate-300" aria-hidden>
          <path
            fill="currentColor"
            fillOpacity="0.15"
            stroke="currentColor"
            strokeWidth="1"
            d="M80 200 Q120 80 200 100 T360 140 Q340 220 260 240 L100 230 Z"
          />
        </svg>
        <div className="absolute inset-0">
          <RouteDot label="İstanbul" style={{ left: '18%', top: '42%' }} />
          <RouteDot label="İzmir" style={{ left: '12%', top: '58%' }} />
          <RouteDot label="Antalya" style={{ left: '22%', top: '72%' }} />
          <RouteDot label="Gaziantep" style={{ left: '78%', top: '62%' }} />
          <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
            <line x1="72" y1="126" x2="48" y2="174" stroke="#f37021" strokeWidth="2" strokeDasharray="4 6" />
            <line x1="88" y1="126" x2="88" y2="216" stroke="#f37021" strokeWidth="2" strokeDasharray="4 6" />
            <line x1="312" y1="186" x2="88" y2="126" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 5" />
          </svg>
        </div>
      </div>
    </div>
  )
}

function RouteDot({ label, style }: { label: string; style: CSSProperties }) {
  return (
    <div className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1" style={style}>
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-[10px] shadow">🚚</span>
      <span className="whitespace-nowrap rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-slate-700 shadow-sm">
        {label}
      </span>
    </div>
  )
}
