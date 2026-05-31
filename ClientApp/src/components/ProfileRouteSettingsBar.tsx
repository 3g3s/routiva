import { Loader2, Pencil, Settings2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteProfileRoute, deleteProfileRouteDestination } from '../lib/profileRoute'

type Props = {
  /** Kayıtlı çıkış (A) var mı */
  hasOrigin: boolean
  /** Kayıtlı varış (B) var mı */
  hasDestination: boolean
  /** Veri yenileme (silme sonrası) */
  onUpdated: () => void | Promise<void>
  /** Daha sıkı yerleşim (hesap sayfası kart içi) */
  compact?: boolean
  /** İlk açılışta panel açık (ör. Güzergâhım sayfası) */
  defaultOpen?: boolean
}

export function ProfileRouteSettingsBar({
  hasOrigin,
  hasDestination,
  onUpdated,
  compact,
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [confirmDeleteB, setConfirmDeleteB] = useState(false)
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false)

  if (!hasOrigin && !hasDestination) return null

  const run = async (fn: () => Promise<void>) => {
    setErr(null)
    setBusy(true)
    try {
      await fn()
      await onUpdated()
      setConfirmDeleteB(false)
      setConfirmDeleteAll(false)
      setOpen(false)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'İşlem başarısız.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-slate-50/90 ${compact ? 'p-3 sm:p-4' : 'p-4 sm:p-5'}`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="inline-flex items-center gap-2 text-sm font-black text-[var(--color-r-navy)]">
          <Settings2 className="h-4 w-4 shrink-0 text-[var(--color-r-orange)]" />
          Güzergâh ayarları
        </span>
        <span className="text-xs font-bold text-slate-500">{open ? 'Gizle ▲' : 'Aç ▼'}</span>
      </button>

      {open ? (
        <div className="mt-4 space-y-4 border-t border-slate-200/80 pt-4">
          <p className="text-xs leading-relaxed text-slate-600">
            Haritada noktaları yeniden işaretlemek için taşıyıcı merkezine gidin. Silme işlemleri geri alınamaz; tümünü
            silmek A ve B&apos;yi birlikte kaldırır.
          </p>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/tasiyici"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-r-navy)] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-95"
            >
              <Pencil className="h-4 w-4" />
              Haritada düzenle
            </Link>
          </div>

          {hasDestination ? (
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3 py-3">
              {!confirmDeleteB ? (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-semibold text-amber-950">Sadece varış (B) kaydını kaldır</p>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setConfirmDeleteB(true)}
                    className="rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100 disabled:opacity-50"
                  >
                    B&apos;yi sil…
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-amber-950">Varış noktası silinsin mi? Çıkış (A) kalır.</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        void run(async () => {
                          await deleteProfileRouteDestination()
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-amber-700 px-3 py-2 text-xs font-bold text-white hover:bg-amber-800 disabled:opacity-50"
                    >
                      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      Evet, B&apos;yi sil
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setConfirmDeleteB(false)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Vazgeç
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {hasOrigin ? (
            <div className="rounded-xl border border-red-200/80 bg-red-50/80 px-3 py-3">
              {!confirmDeleteAll ? (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-semibold text-red-950">Tüm güzergâh kaydını sil (A ve B)</p>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setConfirmDeleteAll(true)}
                    className="rounded-lg border border-red-300 bg-white px-3 py-2 text-xs font-bold text-red-800 hover:bg-red-100 disabled:opacity-50"
                  >
                    Tümünü sil…
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-red-950">
                    Profildeki harita güzergâhı tamamen silinsin mi? Bu işlem geri alınamaz.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void run(async () => deleteProfileRoute())}
                      className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      Evet, tümünü sil
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setConfirmDeleteAll(false)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Vazgeç
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {err ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-800">
              {err}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
