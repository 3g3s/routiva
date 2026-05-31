import type { AuthUser } from '../auth/types'

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const a = parts[0]?.[0] ?? 'U'
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : ''
  return (a + b).toUpperCase()
}

export function UserAvatar({
  user,
  size = 'md',
  variant = 'dark',
}: {
  user: AuthUser
  size?: 'sm' | 'md' | 'lg'
  variant?: 'dark' | 'light'
}) {
  const dims = size === 'sm' ? 'h-8 w-8 text-xs' : size === 'lg' ? 'h-12 w-12 text-base' : 'h-9 w-9 text-sm'
  const bg = variant === 'light' ? 'bg-white/15 text-white ring-white/20' : 'bg-[var(--color-r-navy)] text-white ring-slate-200'
  return (
    <div className={`flex ${dims} items-center justify-center rounded-full ${bg} font-bold ring-1`}>
      {initialsFromName(user.displayName || user.userName)}
    </div>
  )
}

