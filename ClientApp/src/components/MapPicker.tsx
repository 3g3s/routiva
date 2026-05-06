import { useEffect, useMemo, useState } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export type PickedPoint = { lat: number; lng: number }

function ClickToPick({ onPick }: { onPick: (p: PickedPoint) => void }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

type Props = {
  value: PickedPoint | null
  onChange: (p: PickedPoint) => void
  height?: number
  hint?: string
}

export function MapPicker({ value, onChange, height = 420, hint }: Props) {
  const center: [number, number] = value ? [value.lat, value.lng] : [39.2, 32.8]
  const selected = useMemo(() => (value ? ([value.lat, value.lng] as [number, number]) : null), [value])
  const [dragHint, setDragHint] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setDragHint(true), 600)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-inner"
      style={{ height }}
    >
      {hint ? (
        <div className="pointer-events-none absolute left-1/2 top-4 z-[500] -translate-x-1/2 rounded-xl border border-slate-200 bg-white/95 px-4 py-2 text-center text-xs font-semibold text-slate-800 shadow-md">
          {hint}
        </div>
      ) : null}

      {dragHint && !value ? (
        <div className="pointer-events-none absolute bottom-3 left-1/2 z-[500] -translate-x-1/2 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-medium text-white">
          Haritaya tıklayıp konum seçebilirsin
        </div>
      ) : null}

      <MapContainer center={center} zoom={6} className="h-full w-full" scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickToPick onPick={onChange} />
        {selected ? (
          <CircleMarker
            center={selected}
            radius={10}
            pathOptions={{ color: '#f37021', fillColor: '#f37021', fillOpacity: 1, weight: 2 }}
          >
            <Popup>
              Seçilen nokta:
              <br />
              {selected[0].toFixed(5)}, {selected[1].toFixed(5)}
            </Popup>
          </CircleMarker>
        ) : null}
      </MapContainer>
    </div>
  )
}

