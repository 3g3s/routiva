import type { ComponentType, CSSProperties } from 'react'
import { useEffect } from 'react'
import {
  ArrowRight,
  Bot,
  Clock,
  FileQuestion,
  LayoutGrid,
  MapPinned,
  MessageCircle,
  Route,
  Shield,
  Sparkles,
  Truck,
  Users,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { LandingHeader } from '../components/LandingHeader'
import { SiteFooter } from '../components/SiteFooter'
import { TurkeyMapSvg } from '../components/TurkeyMapSvg'

const HERO_IMG =
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80'

export function LandingPage() {
  const location = useLocation()
  const { user, loading } = useAuth()

  useEffect(() => {
    const raw = location.hash?.replace(/^#/, '') ?? ''
    if (!raw) return
    const el = document.getElementById(raw)
    if (!el) return
    const t = window.setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
    return () => window.clearTimeout(t)
  }, [location.pathname, location.hash])

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
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/90 backdrop-blur">
            <Sparkles className="h-4 w-4 text-amber-300" />
            Akıllı eşleştirme · Harita · Sohbet
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">ROUTIVA</h1>
          <p className="mt-3 text-xl font-semibold text-white/95 sm:text-2xl">Yük &amp; Araç Eşleştirme</p>
          <p className="mt-4 max-w-xl text-base text-white/85 sm:text-lg">
            Türkiye genelinde yükünü ekle, en uygun aracı bul.
          </p>
          {!loading && user ? (
            <div className="mt-6 rounded-3xl border border-white/20 bg-white/10 px-6 py-5 text-left text-white shadow-lg backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Aktif Oturum</p>
              <p className="mt-2 text-2xl font-black sm:text-4xl">Hoş geldin, {user.displayName}</p>
              <p className="mt-2 text-sm font-medium text-white/85">
                Panelinden işlemlerine devam edebilirsin.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to="/panel"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-4 py-2 text-sm font-bold text-white hover:bg-white/20"
                >
                  Panele git <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/guzergahim"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/35 bg-white/15 px-4 py-2 text-sm font-bold text-white hover:bg-white/20"
                >
                  Güzergâhım <MapPinned className="h-4 w-4" />
                </Link>
                {user.role === 'tasiyici' ? (
                  <Link
                    to="/tasiyici"
                    className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-r-orange)] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-black/25 hover:bg-[var(--color-r-orange-hover)]"
                  >
                    Taşıyıcı merkezi <Truck className="h-4 w-4" />
                  </Link>
                ) : null}
              </div>
            </div>
          ) : null}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              to={user ? '/panel' : '/yuk-olustur'}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-r-orange)] px-8 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-[var(--color-r-orange-hover)]"
            >
              {user ? 'Panele Git' : 'Hemen Başla'}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/tasiyici"
              className="inline-flex items-center gap-2 rounded-xl border border-white/70 bg-white/10 px-6 py-3.5 text-base font-semibold text-white shadow-md shadow-black/20 backdrop-blur-sm transition hover:bg-white/20"
            >
              Taşıyıcıyım
            </Link>
          </div>

          <div className="mt-10 grid w-full max-w-3xl grid-cols-3 gap-3 sm:gap-4">
            {[
              { k: '3.200+', t: 'Aylık teklif', i: Truck },
              { k: '1.100+', t: 'Taşıyıcı', i: Users },
              { k: '15 dk', t: 'Ortalama eşleşme', i: Clock },
            ].map((x) => (
              <div
                key={x.t}
                className="rounded-2xl border border-white/10 bg-white/10 px-3 py-3 text-left text-white/90 shadow-sm backdrop-blur sm:px-4"
              >
                <x.i className="h-5 w-5 text-white/80" />
                <p className="mt-2 text-lg font-black sm:text-xl">{x.k}</p>
                <p className="text-xs font-semibold text-white/75">{x.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="hizli" className="border-b border-slate-100 bg-[var(--color-r-bg)] py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[var(--color-r-navy)] sm:text-3xl">Hızlı erişim</h2>
            <p className="mx-auto mt-2 max-w-2xl text-slate-600">
              Sık kullanılan sayfalara tek tıkla git; giriş yaptıysan panel ve güzergâh araçları açılır.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <LandingQuickLink
              to="/tasiyici"
              icon={MapPinned}
              title="Taşıyıcı merkezi"
              desc="Haritada A/B işaretle, yük ara."
            />
            <LandingQuickLink
              to={user ? '/guzergahim' : '/giris'}
              icon={Route}
              title={user ? 'Güzergâhım' : 'Güzergâh (giriş)'}
              desc={user ? 'Kayıtlı rotanı gör.' : 'Giriş yap, rotanı kaydet.'}
            />
            <LandingQuickLink
              to="/sohbet"
              icon={Bot}
              title="Routiva Asistan"
              desc="Sohbet ile yük ve rota sor."
            />
            <LandingQuickLink
              to="/sss"
              icon={FileQuestion}
              title="SSS"
              desc="Sık sorulan sorular."
            />
            <LandingQuickLink
              to="/nasil-calisir"
              icon={LayoutGrid}
              title="Nasıl çalışır?"
              desc="Süreç rehberi."
            />
            <LandingQuickLink
              to="/iletisim"
              icon={MessageCircle}
              title="İletişim"
              desc="Bize yazın."
            />
            {user ? (
              <LandingQuickLink
                to="/panel"
                icon={Users}
                title="Panel"
                desc="Özet ve kısayollar."
              />
            ) : (
              <>
                <LandingQuickLink to="/giris" icon={Users} title="Giriş" desc="Hesabına gir." />
                <LandingQuickLink to="/kayit" icon={Sparkles} title="Kayıt ol" desc="Ücretsiz hesap aç." />
              </>
            )}
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

      <section id="ozellikler" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--color-r-navy)] sm:text-3xl">Platform özellikleri</h2>
          <p className="mx-auto mt-2 max-w-2xl text-slate-600">
            Operasyonu hızlandıran araçlar; hepsi gerçek sayfalara bağlıdır.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: MapPinned,
              title: 'Çift nokta haritası',
              text: 'Çıkış ve varışı işaretleyip profiline kaydet; ilan aramasıyla senkron.',
              to: '/tasiyici',
            },
            {
              icon: Route,
              title: 'Güzergâh özeti',
              text: 'Kaydettiğin rotayı tek sayfada gör, düzenlemek için merkeze dön.',
              to: user ? '/guzergahim' : '/giris',
            },
            {
              icon: Truck,
              title: 'Yük & araç ilanı',
              text: 'Yük oluştur veya boş kapasiteyi gir; eşleşmeyi başlat.',
              to: '/yuk-olustur',
            },
            {
              icon: Bot,
              title: 'AI sohbet',
              text: 'Routiva asistanı ile yük türü, rota ve süreç sorularını sor.',
              to: '/sohbet',
            },
            {
              icon: Shield,
              title: 'ADR görünürlüğü',
              text: 'Tehlikeli madde ilanlarında uyarı ve levha gösterimi.',
              to: '/sss',
            },
            {
              icon: Clock,
              title: 'Panel & hesap',
              text: 'Giriş yaptıktan sonra panelden tüm akışlara eriş.',
              to: user ? '/panel' : '/kayit',
            },
          ].map((x) => (
            <Link
              key={x.title}
              to={x.to}
              className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-sm transition hover:border-orange-200/80 hover:shadow-md"
            >
              <x.icon className="h-9 w-9 text-[var(--color-r-orange)] transition group-hover:scale-105" strokeWidth={1.5} />
              <h3 className="mt-4 text-base font-bold text-[var(--color-r-navy)]">{x.title}</h3>
              <p className="mt-2 flex-1 text-sm text-slate-600">{x.text}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[var(--color-r-orange)]">
                Aç <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
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

      <section className="border-y border-slate-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Sabit konum (taşıyıcı)',
                text: 'Haritadan başlangıç noktanı seç; sistemde hesabına kaydolur.',
              },
              { title: 'Sohbet + AI', text: 'Teklif ve ilan detaylarından hızlı iletişim kur.' },
              { title: 'ADR farkındalığı', text: 'Tehlikeli yüklerde ADR levhası ve uyarılar.' },
            ].map((b) => (
              <div key={b.title} className="rounded-2xl border border-slate-100 bg-[var(--color-r-bg)] p-6 shadow-sm">
                <p className="text-base font-black text-[var(--color-r-navy)]">{b.title}</p>
                <p className="mt-2 text-sm text-slate-600">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="sss" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--color-r-navy)] sm:text-3xl">Sık sorulan sorular</h2>
          <p className="mx-auto mt-2 max-w-2xl text-slate-600">
            Tıklayarak yanıtları aç. Tüm SSS için sayfamıza gidebilirsiniz.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {[
            {
              q: 'Haritada A ve B ne işe yarar?',
              a: 'A çıkış, B varış noktasıdır. İkisini kaydettiğinizde profilinizde ve hesabım sayfasında özetlenir; taşıyıcı akışında şehir seçimleri bu güzergâha göre önerilir.',
            },
            {
              q: 'Ücretli mi?',
              a: 'Demo sürümünde kayıt ve temel akışlar ücretsizdir. Ticari model ayrıca duyurulur.',
            },
            {
              q: 'Yük veren haritayı kullanabilir mi?',
              a: 'Evet. Giriş yaptıktan sonra taşıyıcı merkezinden iki noktayı işaretleyip güzergâhı profilinize kaydedebilirsiniz.',
            },
            {
              q: 'ADR yükleri nasıl görünür?',
              a: 'İlan detaylarında ADR uyarısı ve levha stili gösterilir; taşıyıcı eşleşmesinde dikkat çekmesi için işaretlenir.',
            },
          ].map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm open:border-orange-200/80 open:shadow-md"
            >
              <summary className="cursor-pointer list-none text-left font-bold text-[var(--color-r-navy)] marker:hidden [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-3">
                  {item.q}
                  <span className="text-slate-400 transition group-open:rotate-90">›</span>
                </span>
              </summary>
              <p className="mt-3 border-t border-slate-100 pt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/sss"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-sm hover:border-orange-200"
          >
            Tüm SSS sayfası <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-gradient-to-r from-[var(--color-r-navy)] to-slate-900 py-12 text-white sm:py-14">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 text-center sm:flex-row sm:px-6 sm:text-left">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Hazır mısınız?</p>
            <p className="mt-2 text-xl font-black sm:text-2xl">Yükünüzü veya aracınızı bugün listelemeye başlayın.</p>
            <p className="mt-2 max-w-xl text-sm text-white/80">
              Harita, panel ve asistan tek ekosistemde. Kayıt sonrası güzergâhını kaydetmeyi unutmayın.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 sm:justify-end">
            <Link
              to={user ? '/tasiyici' : '/kayit'}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-r-orange)] px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-[var(--color-r-orange-hover)]"
            >
              {user ? 'Taşıyıcı merkezi' : 'Kayıt ol'} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to={user ? '/yuk-olustur' : '/giris'}
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur hover:bg-white/15"
            >
              {user ? 'Yük oluştur' : 'Giriş yap'}
            </Link>
          </div>
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

function LandingQuickLink({
  to,
  icon: Icon,
  title,
  desc,
}: {
  to: string
  icon: ComponentType<{ className?: string; strokeWidth?: number }>
  title: string
  desc: string
}) {
  return (
    <Link
      to={to}
      className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-orange-200/80 hover:shadow-md"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[var(--color-r-orange)]">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <p className="font-bold text-[var(--color-r-navy)]">{title}</p>
        <p className="mt-1 text-xs text-slate-600">{desc}</p>
      </div>
    </Link>
  )
}

function TurkeyIllustration() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/60 dark:to-slate-950/60 p-8 shadow-inner transition-colors duration-300">
      <p className="text-center text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">Türkiye ağı</p>
      <div className="relative mx-auto mt-6 aspect-[1005/490] max-w-md">
        <TurkeyMapSvg className="h-full w-full opacity-70 dark:opacity-40" />
        <div className="absolute inset-0">
          <RouteDot label="İstanbul" style={{ left: '21%', top: '24%' }} />
          <RouteDot label="İzmir" style={{ left: '11%', top: '53%' }} />
          <RouteDot label="Antalya" style={{ left: '28%', top: '73%' }} />
          <RouteDot label="Gaziantep" style={{ left: '68%', top: '72%' }} />
          <svg viewBox="0 0 1000 500" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
            <line x1="210" y1="120" x2="110" y2="265" stroke="#f37021" strokeWidth="3" strokeDasharray="5 7" />
            <line x1="210" y1="120" x2="280" y2="365" stroke="#f37021" strokeWidth="3" strokeDasharray="5 7" />
            <line x1="680" y1="360" x2="210" y2="120" stroke="#cbd5e1" strokeWidth="2.5" strokeDasharray="4 6" />
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
