import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Polygon, Tooltip, useMap } from 'react-leaflet'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import {
  parcels,
  cropCatalog,
  profitColors,
  mapCenter,
  mapZoom,
  formatNumber,
  formatUSD,
} from '../data/mockData'
import ParcelPanel from '../components/ParcelPanel'
import { Move, RotateCw, Spline, Pencil, Check, X } from '../components/Icons'

// Estilo de cada polígono según el modo de color activo
function styleFor(parcel, mode, selected, editing) {
  const color =
    mode === 'profit'
      ? parcel.rentable
        ? profitColors.rentable
        : profitColors.desvio
      : parcel.crop.color

  return {
    color: editing ? '#ffffff' : color,
    weight: selected ? 4 : editing ? 3 : 2,
    fillColor: color,
    fillOpacity: selected ? 0.6 : editing ? 0.35 : 0.4,
    opacity: 1,
    dashArray: editing ? '6 6' : undefined,
  }
}

/* Controla los modos de edición de leaflet-geoman según el estado de React */
function GeomanController({ editing, subMode }) {
  const map = useMap()

  useEffect(() => {
    if (!map?.pm) return
    const pm = map.pm
    const disableAll = () => {
      if (pm.globalEditModeEnabled?.()) pm.disableGlobalEditMode()
      if (pm.globalDragModeEnabled?.()) pm.disableGlobalDragMode()
      if (pm.globalRotateModeEnabled?.()) pm.disableGlobalRotateMode()
    }

    disableAll()
    if (editing) {
      if (subMode === 'move') pm.enableGlobalDragMode()
      else if (subMode === 'rotate') pm.enableGlobalRotateMode()
      else pm.enableGlobalEditMode({ allowSelfIntersection: false })
    }
    return disableAll
  }, [map, editing, subMode])

  return null
}

// Switch ver por cultivo / rentabilidad
function ModeToggle({ mode, onChange }) {
  return (
    <div className="pointer-events-auto inline-flex items-center gap-1 rounded-2xl border border-agro-border bg-agro-card/95 p-1 shadow-card backdrop-blur">
      {[
        { id: 'crop', label: 'Por cultivo' },
        { id: 'profit', label: 'Por rentabilidad' },
      ].map((opt) => {
        const active = mode === opt.id
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={[
              'cursor-pointer rounded-xl px-3 py-1.5 text-xs font-semibold transition-all sm:text-sm',
              active ? 'bg-agro-accent text-agro-bg shadow-glow' : 'text-agro-muted hover:text-agro-text',
            ].join(' ')}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

// Leyenda dinámica (cultivos o rentabilidad)
function Legend({ mode }) {
  const items =
    mode === 'profit'
      ? [
          { color: profitColors.rentable, label: 'Rentable' },
          { color: profitColors.desvio, label: 'Con desvío' },
        ]
      : Object.values(cropCatalog).map((c) => ({ color: c.color, label: c.label }))

  return (
    <div className="pointer-events-auto rounded-2xl border border-agro-border bg-agro-card/95 p-3 shadow-card backdrop-blur">
      <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-agro-muted">
        {mode === 'profit' ? 'Rentabilidad' : 'Cultivos'}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1.5">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-1.5">
            <span
              className="h-3 w-3 rounded-[4px] ring-1 ring-white/20"
              style={{ backgroundColor: it.color }}
            />
            <span className="text-xs font-medium text-agro-text">{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const SUBMODES = [
  { id: 'vertices', label: 'Vértices', Icon: Spline },
  { id: 'move', label: 'Mover', Icon: Move },
  { id: 'rotate', label: 'Rotar', Icon: RotateCw },
]

// Barra de herramientas de edición
function EditToolbar({ subMode, onSubMode, onSave, onCancel }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[850] flex justify-center p-3 sm:p-4">
      <div className="pointer-events-auto w-full max-w-2xl rounded-2xl border border-agro-accent/40 bg-agro-card/95 p-2.5 shadow-glow backdrop-blur">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1 rounded-xl bg-agro-card-soft p-1">
            {SUBMODES.map(({ id, label, Icon }) => {
              const active = subMode === id
              return (
                <button
                  key={id}
                  onClick={() => onSubMode(id)}
                  className={[
                    'flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all sm:flex-none',
                    active
                      ? 'bg-agro-accent text-agro-bg'
                      : 'text-agro-muted hover:text-agro-text',
                  ].join(' ')}
                >
                  <Icon size={15} />
                  {label}
                </button>
              )
            })}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-agro-border px-3 py-2 text-xs font-semibold text-agro-muted transition-colors hover:border-agro-danger/50 hover:text-agro-danger sm:flex-none"
            >
              <X size={15} /> Cancelar
            </button>
            <button
              onClick={onSave}
              className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-agro-accent px-3 py-2 text-xs font-bold text-agro-bg shadow-glow transition-transform hover:scale-[1.02] sm:flex-none"
            >
              <Check size={15} /> Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MapView() {
  const [mode, setMode] = useState('crop') // 'crop' | 'profit'
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(false)
  const [subMode, setSubMode] = useState('vertices')
  const [geomKey, setGeomKey] = useState(0)
  const [geometries, setGeometries] = useState(() =>
    Object.fromEntries(parcels.map((p) => [p.id, p.coordinates])),
  )

  const layerRefs = useRef({})
  const editingRef = useRef(editing)
  editingRef.current = editing

  const startEditing = () => {
    setSelected(null)
    setSubMode('vertices')
    setEditing(true)
  }

  const handleCancel = () => {
    setEditing(false)
    setGeomKey((k) => k + 1) // remonta los polígonos desde la geometría original
  }

  const handleSave = () => {
    setGeometries((prev) => {
      const next = { ...prev }
      for (const p of parcels) {
        const layer = layerRefs.current[p.id]
        if (layer?.getLatLngs) {
          const ring = layer.getLatLngs()[0] || []
          if (ring.length >= 3) next[p.id] = ring.map((ll) => [ll.lat, ll.lng])
        }
      }
      return next
    })
    setEditing(false)
    setGeomKey((k) => k + 1)
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        zoomControl={true}
        scrollWheelZoom={true}
        className="h-full w-full"
        style={{ height: '100%', width: '100%' }}
      >
        {/* Tiles satelitales ESRI World Imagery (gratuitos, sin API key) */}
        <TileLayer
          attribution="Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />

        <GeomanController editing={editing} subMode={subMode} />

        {parcels.map((p) => {
          const isSelected = selected?.id === p.id
          return (
            <Polygon
              key={`${p.id}-${mode}-${isSelected ? 'sel' : ''}-${geomKey}`}
              ref={(layer) => {
                if (layer) layerRefs.current[p.id] = layer
              }}
              positions={geometries[p.id]}
              pathOptions={styleFor(p, mode, isSelected, editing)}
              eventHandlers={{
                click: () => {
                  if (!editingRef.current) setSelected(p)
                },
              }}
            >
              {!editing && (
                <Tooltip direction="center" className="agro-tooltip" sticky>
                  <div className="text-center">
                    <div className="font-bold">{p.name}</div>
                    <div className="text-[11px] opacity-80">
                      {p.crop.label} · {formatNumber(p.hectareas)} ha
                    </div>
                    <div
                      className="text-[11px] font-bold"
                      style={{ color: p.rentable ? profitColors.rentable : profitColors.desvio }}
                    >
                      {formatUSD(p.rentabilidad)}
                    </div>
                  </div>
                </Tooltip>
              )}
            </Polygon>
          )
        })}
      </MapContainer>

      {/* Barra superior: título + toggle de color.
          pl-14/pl-16 deja libre el control de zoom (arriba a la izquierda);
          items-start evita que el toggle se estire a lo ancho en mobile. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[800] flex flex-col items-start gap-2 p-3 pl-14 sm:flex-row sm:items-start sm:justify-between sm:p-4 sm:pl-16">
        <div className="pointer-events-auto inline-flex max-w-max items-center gap-2 rounded-2xl border border-agro-border bg-agro-card/95 px-3 py-2 shadow-card backdrop-blur">
          <span
            className={`h-2 w-2 rounded-full ${editing ? 'bg-agro-warning' : 'animate-pulse bg-agro-accent'}`}
          />
          <span className="text-xs font-semibold text-agro-text sm:text-sm">
            {editing ? 'Modo edición' : 'Establecimiento Corrientes'}
          </span>
          <span className="hidden text-[11px] text-agro-muted sm:inline">
            {editing ? '· arrastrá vértices, mové o rotá los lotes' : '· 5 lotes · 618 ha'}
          </span>
        </div>
        {!editing && <ModeToggle mode={mode} onChange={setMode} />}
      </div>

      {/* Barra inferior: leyenda (izq.) + botón editar (der.) en una sola fila,
          con justify-between para que nunca se superpongan. pb-6 deja libre la
          atribución de Leaflet. */}
      {!editing && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[800] flex items-end justify-between gap-2 p-3 pb-6 sm:p-4 sm:pb-6">
          <Legend mode={mode} />
          <button
            onClick={startEditing}
            className="pointer-events-auto flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-agro-border bg-agro-card/95 px-3.5 py-2.5 text-sm font-semibold text-agro-text shadow-card backdrop-blur transition-colors hover:border-agro-accent/60 hover:text-agro-accent"
          >
            <Pencil size={16} />
            <span className="sm:hidden">Editar</span>
            <span className="hidden sm:inline">Editar parcelas</span>
          </button>
        </div>
      )}

      {/* Barra de edición */}
      {editing && (
        <EditToolbar
          subMode={subMode}
          onSubMode={setSubMode}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {/* Panel de detalle */}
      {selected && !editing && (
        <ParcelPanel parcel={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
