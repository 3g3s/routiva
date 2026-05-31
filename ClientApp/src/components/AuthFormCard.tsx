import type { ReactNode } from 'react'

export function AuthMark() {
  return (
    <div
      className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-r-navy)] text-lg font-bold text-[var(--color-r-orange)] shadow-md"
      aria-hidden
    >
      R
    </div>
  )
}

type CardProps = {
  children: ReactNode
  className?: string
}

export function AuthFormCard({ children, className = '' }: CardProps) {
  return (
    <div
      className={`mx-auto w-full max-w-md rounded-2xl border border-slate-100/80 bg-white p-8 shadow-xl sm:p-10 ${className}`}
    >
      {children}
    </div>
  )
}

type HeadProps = {
  title: string
  subtitle: string
  illustration?: ReactNode
}

export function AuthFormHeading({ title, subtitle, illustration }: HeadProps) {
  return (
    <div className="mb-8 text-center">
      <AuthMark />
      <h1 className="mt-5 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
      {illustration ? <div className="mt-6 flex justify-center opacity-90">{illustration}</div> : null}
    </div>
  )
}

type StepperProps = {
  step: 1 | 2
  labels: [string, string]
}

export function AuthStepper({ step, labels }: StepperProps) {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-center gap-0 sm:gap-1">
        <div className="flex flex-1 flex-col items-center">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm ${
              step === 1 ? 'bg-[var(--color-r-orange)]' : 'bg-slate-300'
            }`}
          >
            1
          </span>
          <span
            className={`mt-2 text-center text-xs font-semibold sm:text-sm ${
              step === 1 ? 'text-slate-900' : 'text-slate-400'
            }`}
          >
            {labels[0]}
          </span>
        </div>
        <div className="mx-1 mt-5 h-0.5 min-w-[2rem] flex-1 max-w-[4rem] rounded-full bg-slate-200 sm:mx-2" aria-hidden />
        <div className="flex flex-1 flex-col items-center">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm ${
              step === 2 ? 'bg-[var(--color-r-orange)]' : 'bg-slate-200 text-slate-600'
            }`}
          >
            2
          </span>
          <span
            className={`mt-2 text-center text-xs font-semibold sm:text-sm ${
              step === 2 ? 'text-[var(--color-r-orange)]' : 'text-slate-400'
            }`}
          >
            {labels[1]}
          </span>
        </div>
      </div>
    </div>
  )
}

export function fieldClass() {
  return 'w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-[var(--color-r-orange)]/25'
}

export function selectFieldClass() {
  return `${fieldClass()} appearance-none bg-[length:1rem_1rem] bg-[right_0.75rem_center] bg-no-repeat pr-9`
}
