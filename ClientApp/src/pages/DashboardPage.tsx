import { ArrowRight, MapPinned, PackageSearch, Truck } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { AppHeader } from '../components/AppHeader'
import { SiteFooter } from '../components/SiteFooter'

export function DashboardPage() {
  const { user, loading } = useAuth()

  if (loading) return <div className="min-h-screen bg-[var(--color-r-bg)]" />
  if (!user) return <Navigate to="/giris" replace />

  const isCarrier = user.role === 'tasiyici'

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-r-bg)]">
      <AppHeader
        title="Panel"
        subtitle={isCarrier ? 'Taşıyıcı kontrol paneli' : 'Yük veren kontrol paneli'}
      />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-lg sm:p-8">
          <div className="rounded-2xl bg-gradient-to-r from-[var(--color-r-navy)] to-[var(--color-r-navy-soft)] px-6 py-7 text-white shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">Panel</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">Hoş geldin, {user.displayName}</h1>
            <p className="mt-3 max-w-2xl text-sm font-medium text-white/85 sm:text-base">
              {isCarrier
                ? 'Konumunu seç, uygun yükleri haritada ve listede daha hızlı bul.'
                : 'Yük oluştur, teklifleri karşılaştır ve taşıyıcılarla sohbet et.'}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
            <div className="rounded-2xl bg-[var(--color-r-bg)] px-5 py-4">
              <p className="text-xs font-semibold text-slate-500">Hızlı aksiyon</p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {isCarrier ? 'Konum seç → yük bul' : 'Yük oluştur → teklif al'}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {isCarrier ? (
              <>
                <QuickCard
                  icon={MapPinned}
                  title="Taşıyıcı merkezi"
                  text="Haritada A/B noktası, kayıt ve yük listesi tek yerde."
                  to="/tasiyici"
                />
                <QuickCard
                  icon={PackageSearch}
                  title="Güzergâhım"
                  text="Kayıtlı çıkış ve varış özetini gör."
                  to="/guzergahim"
                />
                <QuickCard
                  icon={Truck}
                  title="Araç ilanı / yük bul"
                  text="Kapasite ve rota ile uygun yükleri listele."
                  to="/arac-ilani"
                />
              </>
            ) : (
              <>
                <QuickCard
                  icon={Truck}
                  title="Yük oluştur"
                  text="Rota + kg/desi + yük tipi ile teklif al."
                  to="/yuk-olustur"
                />
                <QuickCard
                  icon={MapPinned}
                  title="Güzergâhım"
                  text="Tercih ettiğin çıkış ve varışı haritada kaydet."
                  to="/guzergahim"
                />
                <QuickCard
                  icon={PackageSearch}
                  title="Teklifleri karşılaştır"
                  text="En uygun taşıyıcıyı seç."
                  to="/yuk-olustur"
                />
              </>
            )}
          </div>

          <div className="mt-8 rounded-2xl border border-orange-200/70 bg-orange-50 px-5 py-4">
            <p className="text-sm font-bold text-orange-900">Yeni</p>
            <p className="mt-1 text-sm text-orange-900/90">
              Haritada çıkış ve varış noktalarını işaretleyip profiline kaydedebilirsin; özet için Güzergâhım sayfasını
              kullan.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to={isCarrier ? '/tasiyici' : '/yuk-olustur'}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-r-orange)] py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-[var(--color-r-orange-hover)]"
            >
              Başla <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/hesabim"
              className="flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Hesabım
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

function QuickCard({
  icon: Icon,
  title,
  text,
  to,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  title: string
  text: string
  to: string
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-slate-100 bg-[var(--color-r-bg)] p-5 shadow-sm transition hover:border-orange-200/70 hover:bg-white hover:shadow-md"
    >
      <Icon className="h-8 w-8 text-[var(--color-r-orange)]" strokeWidth={1.5} />
      <p className="mt-3 text-base font-bold text-[var(--color-r-navy)]">{title}</p>
      <p className="mt-1 text-sm text-slate-600">{text}</p>
      <p className="mt-4 text-sm font-bold text-[var(--color-r-orange)] opacity-0 transition group-hover:opacity-100">
        Aç →
      </p>
    </Link>
  )
}

