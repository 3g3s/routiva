import { Navigate } from 'react-router-dom'

/** Eski URL; taşıyıcı akışı tek merkezde toplandı. */
export function CarrierMapPage() {
  return <Navigate to="/tasiyici" replace />
}
