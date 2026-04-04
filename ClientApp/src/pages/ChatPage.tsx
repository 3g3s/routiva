import { ArrowLeft, Loader2, Send, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { parseChatQuery } from '../data/mock'

type Msg = { id: string; from: 'me' | 'them'; text: string; time: string }

type ChatApiResponse = { reply: string; usedAi: boolean; hint?: string | null }

function nowTime() {
  return new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
}

export function ChatPage() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const { partner, mod, rota, ozet } = parseChatQuery(search || '?')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Msg[]>([])
  const [sending, setSending] = useState(false)
  const [usedAiLast, setUsedAiLast] = useState<boolean | null>(null)
  const [setupHint, setSetupHint] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const title = partner
  const subtitle =
    mod === 'tasiyici'
      ? 'Taşıyıcı · ' + (rota || 'Güzergâh')
      : 'Yük veren · ' + (rota || 'İlan')

  useEffect(() => {
    const welcome =
      mod === 'tasiyici'
        ? `Merhaba, ben ${partner} operasyon hattındayım.${rota ? ` ${rota} güzergâhı` : ''} için Routiva sohbetine hoş geldiniz.${ozet ? ` Bağlam: ${ozet}.` : ''} Sorularınızı yazın; yanıtlar yapay zeka ile üretilir (ücretsiz Gemini kotası) veya anahtar yoksa akıllı yedek mod devreye girer.`
        : `Merhaba, ${partner} adına yük tarafındayım.${rota ? ` Rota: ${rota}.` : ''}${ozet ? ` Özet: ${ozet}.` : ''} Araç kapasitesi ve müsaitlik için yazabilirsiniz.`

    setMessages([{ id: 'welcome', from: 'them', text: welcome, time: nowTime() }])
    setUsedAiLast(null)
    setSetupHint(null)
  }, [mod, partner, rota, ozet])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  const send = async () => {
    const t = input.trim()
    if (!t || sending) return

    const history = messages.map((m) => ({
      role: m.from === 'me' ? ('user' as const) : ('assistant' as const),
      text: m.text,
    }))

    setInput('')
    setSending(true)
    const userMsg: Msg = { id: `me-${Date.now()}`, from: 'me', text: t, time: nowTime() }
    setMessages((m) => [...m, userMsg])

    try {
      const res = await fetch('/api/chat/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          partner,
          mod,
          rota: rota || null,
          ozet: ozet || null,
          history,
          message: t,
        }),
      })

      if (!res.ok) {
        throw new Error(String(res.status))
      }

      const data = (await res.json()) as ChatApiResponse
      const reply = typeof data.reply === 'string' ? data.reply : 'Yanıt alınamadı.'
      setUsedAiLast(data.usedAi === true)
      if (data.hint && !setupHint) setSetupHint(data.hint)

      setMessages((m) => [
        ...m,
        { id: `them-${Date.now()}`, from: 'them', text: reply, time: nowTime() },
      ])
    } catch {
      setUsedAiLast(false)
      setMessages((m) => [
        ...m,
        {
          id: `them-err-${Date.now()}`,
          from: 'them',
          text: 'Sunucuya bağlanılamadı. .NET uygulamasının çalıştığından ve ağın açık olduğundan emin olun.',
          time: nowTime(),
        },
      ])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-slate-100">
      <header className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Geri"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-bold text-[var(--color-r-navy)]">{title}</h1>
          <p className="truncate text-xs text-slate-500">{subtitle}</p>
        </div>
        {usedAiLast === true ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-violet-900">
            <Sparkles className="h-3 w-3" />
            Gemini
          </span>
        ) : usedAiLast === false ? (
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-700">
            Yedek mod
          </span>
        ) : (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
            Routiva
          </span>
        )}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto mb-3 max-w-lg space-y-2">
          <p className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-center text-[11px] leading-snug text-violet-950">
            Yanıtlar sunucuda <strong>Google Gemini</strong> ile üretilir (AI Studio ücretsiz kotası). Anahtar
            yoksa veya API hata verirse mesajınıza göre <strong>akıllı yedek</strong> cevap döner.
          </p>
          {setupHint ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-snug text-amber-950">
              {setupHint}
            </p>
          ) : null}
        </div>
        <div className="mx-auto flex max-w-lg flex-col gap-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm ${
                  msg.from === 'me'
                    ? 'rounded-br-md bg-[var(--color-r-orange)] text-white'
                    : 'rounded-bl-md border border-slate-200 bg-white text-slate-800'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                <p
                  className={`mt-1 text-[10px] ${msg.from === 'me' ? 'text-white/80' : 'text-slate-400'}`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
          {sending ? (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-[var(--color-r-orange)]" />
                Yanıt hazırlanıyor…
              </div>
            </div>
          ) : null}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="shrink-0 border-t border-slate-200 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-lg gap-2">
          <input
            type="text"
            value={input}
            disabled={sending}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), void send())}
            placeholder="Mesajınızı yazın…"
            className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-[var(--color-r-orange)] focus:ring-2 disabled:bg-slate-50"
          />
          <button
            type="button"
            disabled={sending || !input.trim()}
            onClick={() => void send()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-r-navy)] text-white shadow-md transition hover:bg-[var(--color-r-navy-soft)] disabled:opacity-50"
            aria-label="Gönder"
          >
            {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  )
}
