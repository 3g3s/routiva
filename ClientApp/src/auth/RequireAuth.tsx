import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const loc = useLocation()

  if (loading) return <div className="min-h-screen bg-[var(--color-r-bg)]" />
  if (!user) return <Navigate to="/giris" replace state={{ from: loc.pathname + loc.search }} />
  return <>{children}</>
}

export function RequireRole({
  role,
  children,
}: {
  role: 'tasiyici' | 'yukveren'
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()

  if (loading) return <div className="min-h-screen bg-[var(--color-r-bg)]" />
  if (!user) return <Navigate to="/giris" replace />
  if (user.role !== role) return <Navigate to="/panel" replace />
  return <>{children}</>
}

