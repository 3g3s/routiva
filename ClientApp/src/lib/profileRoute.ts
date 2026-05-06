export type ProfileGeoPoint = { lat: number; lng: number; label?: string | null }

export type ProfileSavedRoute = {
  origin: ProfileGeoPoint | null
  destination: ProfileGeoPoint | null
}

export async function fetchProfileRoute(): Promise<ProfileSavedRoute | null> {
  const res = await fetch('/api/profile/route', { credentials: 'include' })
  if (!res.ok) return null
  return (await res.json()) as ProfileSavedRoute | null
}

export async function saveProfileRoute(body: {
  origin: ProfileGeoPoint
  destination: ProfileGeoPoint
}): Promise<ProfileSavedRoute> {
  const res = await fetch('/api/profile/route', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      origin: { lat: body.origin.lat, lng: body.origin.lng, label: body.origin.label ?? null },
      destination: {
        lat: body.destination.lat,
        lng: body.destination.lng,
        label: body.destination.label ?? null,
      },
    }),
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(t || 'Kaydedilemedi.')
  }
  return (await res.json()) as ProfileSavedRoute
}

/** Tüm güzergâhı (A + B) siler. */
export async function deleteProfileRoute(): Promise<void> {
  const res = await fetch('/api/profile/route', { method: 'DELETE', credentials: 'include' })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(t || 'Silinemedi.')
  }
}

/** Yalnızca varış (B) kaydını siler; A kalır. */
export async function deleteProfileRouteDestination(): Promise<ProfileSavedRoute | null> {
  const res = await fetch('/api/profile/route/destination', { method: 'DELETE', credentials: 'include' })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(t || 'Varış silinemedi.')
  }
  return (await res.json()) as ProfileSavedRoute | null
}
