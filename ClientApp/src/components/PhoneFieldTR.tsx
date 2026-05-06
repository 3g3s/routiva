type Props = {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function PhoneFieldTR({ id, value, onChange, placeholder = 'Telefon Numarası', className = '' }: Props) {
  return (
    <div
      className={`flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-[var(--color-r-orange)]/30 ${className}`}
    >
      <div className="flex shrink-0 items-center gap-2 border-r border-slate-200 bg-slate-50/80 px-3 py-3 text-sm text-slate-700">
        <span className="text-lg leading-none" aria-hidden>
          🇹🇷
        </span>
        <span className="font-semibold tabular-nums text-slate-800">+90</span>
      </div>
      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 border-0 bg-white px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
      />
    </div>
  )
}
