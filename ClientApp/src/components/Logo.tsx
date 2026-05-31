import { Link } from 'react-router-dom'

type Props = { variant?: 'light' | 'dark'; className?: string; to?: string }

export function Logo({ variant = 'dark', className = '', to = '/' }: Props) {
  const text = variant === 'light' ? 'text-white' : 'text-[var(--color-r-navy)]'
  return (
    <Link to={to} className={`inline-flex items-center gap-2 font-semibold tracking-tight ${text} ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-r-orange)] text-lg font-bold text-white shadow-sm">
        R
      </span>
      <span className="text-xl">Routiva</span>
    </Link>
  )
}
