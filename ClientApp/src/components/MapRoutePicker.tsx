import { useMemo } from 'react'
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export type RoutePoint = { lat: number; lng: number }

export type RouteLeg = 'origin' | 'destination'

type Props = {
  origin: RoutePoint | null
  destination: RoutePoint | null
  activeLeg: RouteLeg
  onChangeOrigin: (p: RoutePoint) => void
  onChangeDestination: (p: RoutePoint) => void
  height?: number
  /** Kısa bilgi şeridi */
  hint?: string
}

function ClickRouter({
  activeLeg,
  onPickOrigin,
  onPickDest,
}: {
  activeLeg: RouteLeg
  onPickOrigin: (p: RoutePoint) => void
  onPickDest: (p: RoutePoint) => void
}) {
  useMapEvents({
    click(e) {
      const p = { lat: e.latlng.lat, lng: e.latlng.lng }
      if (activeLeg === 'origin') onPickOrigin(p)
      else onPickDest(p)
    },
  })
  return null
}

export function MapRoutePicker({
  origin,
  destination,
  activeLeg,
  onChangeOrigin,
  onChangeDestination,
  height = 440,
  hint,
}: Props) {
  const center: [number, number] = useMemo(() => {
    if (origin) return [origin.lat, origin.lng]
    if (destination) return [destination.lat, destination.lng]
    return [39.2, 32.8]
  }, [origin, destination])

  const line = useMemo((): [number, number][] | null => {
    if (!origin || !destination) return null
    return [
      [origin.lat, origin.lng],
      [destination.lat, destination.lng],
    ]
  }, [origin, destination])

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner"
      style={{ height }}
    >
      {hint ? (
        <div className="pointer-events-none absolute left-1/2 top-4 z-[500] max-w-[min(100%,28rem)] -translate-x-1/2 rounded-xl border border-slate-200 bg-white/95 px-4 py-2.5 text-center text-xs font-semibold leading-snug text-slate-800 shadow-md">
          {hint}
        </div>
      ) : null}

      <div className="pointer-events-none absolute bottom-3 left-1/2 z-[500] -translate-x-1/2 rounded-full bg-black/65 px-3 py-1.5 text-[11px] font-medium text-white">
        {activeLeg === 'origin' ? 'Çıkış noktasını işaretliyorsun' : 'Varış noktasını işaretliyorsun'}
      </div>

      <MapContainer center={center} zoom={6} className="h-full w-full" scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickRouter
          activeLeg={activeLeg}
          onPickOrigin={onChangeOrigin}
          onPickDest={onChangeDestination}
        />
        {line ? (
          <Polyline positions={line} pathOptions={{ color: '#f37021', weight: 3, opacity: 0.85, dashArray: '10 6' }} />
        ) : null}
        {origin ? (
          <CircleMarker
            center={[origin.lat, origin.lng]}
            radius={11}
            pathOptions={{ color: '#c2410c', fillColor: '#f37021', fillOpacity: 1, weight: 2 }}
          >
            <Popup>
              <strong>Çıkış</strong>
              <br />
              {origin.lat.toFixed(5)}, {origin.lng.toFixed(5)}
            </Popup>
          </CircleMarker>
        ) : null}
        {destination ? (
          <CircleMarker
            center={[destination.lat, destination.lng]}
            radius={11}
            pathOptions={{ color: '#1d4ed8', fillColor: '#3b82f6', fillOpacity: 1, weight: 2 }}
          >
            <Popup>
              <strong>Varış</strong>
              <br />
              {destination.lat.toFixed(5)}, {destination.lng.toFixed(5)}
            </Popup>
          </CircleMarker>
        ) : null}
      </MapContainer>
    </div>
  )
}
