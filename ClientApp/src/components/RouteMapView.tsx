import { useEffect } from 'react'
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export type MapPoint = { lat: number; lng: number; label: string }

type Props = {
  from: MapPoint
  to: MapPoint
  showRoute: boolean
  statusBar?: string
  overlayTitle?: string
  overlayHint?: string
  empty?: boolean
}

function FitBounds({ points }: { points: L.LatLngExpression[] }) {
  const map = useMap()
  useEffect(() => {
    if (points.length < 2) return
    const b = L.latLngBounds(points)
    map.fitBounds(b, { padding: [40, 40], maxZoom: 7 })
  }, [map, points])
  return null
}

export function RouteMapView({ from, to, showRoute, statusBar, overlayTitle, overlayHint, empty }: Props) {
  const center: [number, number] = [39.2, 32.8]
  const positions: [number, number][] = [
    [from.lat, from.lng],
    [to.lat, to.lng],
  ]

  return (
    <div className="relative h-[320px] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-inner sm:h-[380px]">
      {empty ? (
        <div className="absolute inset-0 z-[500] flex flex-col items-center justify-center gap-2 bg-white/85 px-6 text-center backdrop-blur-sm">
          <div className="rounded-full bg-slate-100 p-3 text-[var(--color-r-orange)]">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.125-7.5 11.25-7.5 11.25S4.5 17.625 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
          </div>
          <p className="text-sm font-semibold text-slate-800">{overlayTitle ?? 'Rota henüz oluşturulmadı'}</p>
          <p className="max-w-xs text-xs text-slate-600">
            {overlayHint ?? 'Yük veya araç bilgilerinizi girdikten sonra rota burada görüntülenecektir.'}
          </p>
        </div>
      ) : null}

      <MapContainer center={center} zoom={6} className="h-full w-full" scrollWheelZoom={false}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitBounds points={positions} />
        {showRoute ? (
          <Polyline
            positions={positions}
            pathOptions={{
              color: '#f37021',
              weight: 4,
              dashArray: '10 14',
              lineCap: 'round',
            }}
          />
        ) : null}
        <CircleMarker
          center={[from.lat, from.lng]}
          radius={9}
          pathOptions={{ color: '#2563eb', fillColor: '#2563eb', fillOpacity: 1, weight: 2 }}
        >
          <Popup>{from.label}</Popup>
        </CircleMarker>
        <CircleMarker
          center={[to.lat, to.lng]}
          radius={9}
          pathOptions={{ color: '#f37021', fillColor: '#f37021', fillOpacity: 1, weight: 2 }}
        >
          <Popup>{to.label}</Popup>
        </CircleMarker>
      </MapContainer>

      {!empty && overlayTitle ? (
        <div className="pointer-events-none absolute left-1/2 top-4 z-[400] -translate-x-1/2 rounded-lg border border-slate-200/80 bg-white/95 px-4 py-2 text-center text-xs font-medium text-slate-800 shadow-md sm:text-sm">
          {overlayTitle}
        </div>
      ) : null}

      {statusBar ? (
        <div className="absolute bottom-0 left-0 right-0 z-[400] border-t border-emerald-200/80 bg-emerald-50/95 px-3 py-2 text-center text-xs font-medium text-emerald-800 sm:text-sm">
          {statusBar}
        </div>
      ) : null}
    </div>
  )
}
