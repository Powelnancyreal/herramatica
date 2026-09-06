'use client'

import { useMemo, useState } from 'react'

const TABS = [
  { id: 'ritmo', label: 'Calcular Ritmo' },
  { id: 'tiempo', label: 'Calcular Tiempo' },
  { id: 'distancia', label: 'Calcular Distancia' },
]

const DISTANCIAS_CARRERA = [
  { label: '5K', km: 5 },
  { label: '10K', km: 10 },
  { label: 'Media maratón', km: 21.0975 },
  { label: 'Maratón', km: 42.195 },
]

const MI_A_KM = 1.609344

function pad(n) {
  return String(n).padStart(2, '0')
}

// segundos totales -> "H:MM:SS" o "MM:SS" si dura menos de una hora
function formatDuracion(segundosTotales) {
  if (segundosTotales === null || isNaN(segundosTotales) || segundosTotales < 0) return '—'
  const s = Math.round(segundosTotales)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const seg = s % 60
  return h > 0 ? `${h}:${pad(m)}:${pad(seg)}` : `${m}:${pad(seg)}`
}

// segundos por km -> "M:SS /km"
function formatRitmo(segundosPorKm) {
  if (segundosPorKm === null || isNaN(segundosPorKm) || segundosPorKm < 0) return '—'
  const s = Math.round(segundosPorKm)
  const m = Math.floor(s / 60)
  const seg = s % 60
  return `${m}:${pad(seg)}`
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

function CampoTiempo({ label, h, m, s, onH, onM, onS }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="grid grid-cols-3 gap-2">
        <input type="number" inputMode="numeric" min="0" value={h} onChange={(e) => onH(e.target.value)} placeholder="hh" className={inputClass} />
        <input type="number" inputMode="numeric" min="0" max="59" value={m} onChange={(e) => onM(e.target.value)} placeholder="mm" className={inputClass} />
        <input type="number" inputMode="numeric" min="0" max="59" value={s} onChange={(e) => onS(e.target.value)} placeholder="ss" className={inputClass} />
      </div>
    </div>
  )
}

function ResultBox({ children }) {
  return <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">{children}</div>
}

export default function CalcularRitmo() {
  const [tab, setTab] = useState('ritmo')

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3.5 py-2 rounded-lg font-semibold text-sm transition-all ${
              tab === t.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'ritmo' && <CalcularRitmoTab />}
      {tab === 'tiempo' && <CalcularTiempoTab />}
      {tab === 'distancia' && <CalcularDistanciaTab />}
    </div>
  )
}

// ─── Tab 1: Ritmo = Tiempo / Distancia ──────────────────────────────

function CalcularRitmoTab() {
  const [distancia, setDistancia] = useState('')
  const [h, setH] = useState('')
  const [m, setM] = useState('')
  const [s, setS] = useState('')

  const resultado = useMemo(() => {
    const d = parseFloat(distancia)
    const hh = parseFloat(h) || 0
    const mm = parseFloat(m) || 0
    const ss = parseFloat(s) || 0
    const segundosTotales = hh * 3600 + mm * 60 + ss
    if (isNaN(d) || d <= 0 || segundosTotales <= 0) return null
    const segPorKm = segundosTotales / d
    return { segPorKm, segPorMi: segPorKm * MI_A_KM, kmh: 3600 / segPorKm }
  }, [distancia, h, m, s])

  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Distancia recorrida (km)</label>
        <input type="number" inputMode="decimal" min="0" value={distancia} onChange={(e) => setDistancia(e.target.value)} placeholder="Ej: 10" className={inputClass} />
      </div>
      <CampoTiempo label="Tiempo empleado" h={h} m={m} s={s} onH={setH} onM={setM} onS={setS} />

      <ResultBox>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Tu ritmo</p>
        <p className="text-4xl font-bold text-blue-700">{resultado ? `${formatRitmo(resultado.segPorKm)} /km` : '—'}</p>
      </ResultBox>
      {resultado && (
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-500">Ritmo por milla</p>
            <p className="font-semibold text-gray-900">{formatRitmo(resultado.segPorMi)} /mi</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-500">Velocidad</p>
            <p className="font-semibold text-gray-900">{resultado.kmh.toFixed(2)} km/h</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Tab 2: Tiempo = Ritmo × Distancia ──────────────────────────────

function CalcularTiempoTab() {
  const [ritmoMin, setRitmoMin] = useState('')
  const [ritmoSeg, setRitmoSeg] = useState('')
  const [distancia, setDistancia] = useState('')

  const resultado = useMemo(() => {
    const rm = parseFloat(ritmoMin) || 0
    const rs = parseFloat(ritmoSeg) || 0
    const d = parseFloat(distancia)
    const segPorKm = rm * 60 + rs
    if (segPorKm <= 0 || isNaN(d) || d <= 0) return null
    return { tiempoSegundos: segPorKm * d, segPorKm }
  }, [ritmoMin, ritmoSeg, distancia])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Ritmo (min:seg por km)</label>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" inputMode="numeric" min="0" value={ritmoMin} onChange={(e) => setRitmoMin(e.target.value)} placeholder="min" className={inputClass} />
            <input type="number" inputMode="numeric" min="0" max="59" value={ritmoSeg} onChange={(e) => setRitmoSeg(e.target.value)} placeholder="seg" className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Distancia (km)</label>
          <input type="number" inputMode="decimal" min="0" value={distancia} onChange={(e) => setDistancia(e.target.value)} placeholder="Ej: 10" className={inputClass} />
        </div>
      </div>

      <ResultBox>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Tiempo estimado</p>
        <p className="text-4xl font-bold text-blue-700">{resultado ? formatDuracion(resultado.tiempoSegundos) : '—'}</p>
      </ResultBox>

      {resultado && (
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">A este ritmo, terminarías...</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {DISTANCIAS_CARRERA.map((carrera) => (
              <div key={carrera.label} className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">{carrera.label}</p>
                <p className="font-semibold text-gray-900">{formatDuracion(resultado.segPorKm * carrera.km)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Tab 3: Distancia = Tiempo / Ritmo ──────────────────────────────

function CalcularDistanciaTab() {
  const [ritmoMin, setRitmoMin] = useState('')
  const [ritmoSeg, setRitmoSeg] = useState('')
  const [h, setH] = useState('')
  const [m, setM] = useState('')
  const [s, setS] = useState('')

  const resultado = useMemo(() => {
    const rm = parseFloat(ritmoMin) || 0
    const rs = parseFloat(ritmoSeg) || 0
    const segPorKm = rm * 60 + rs
    const hh = parseFloat(h) || 0
    const mm = parseFloat(m) || 0
    const ss = parseFloat(s) || 0
    const segundosTotales = hh * 3600 + mm * 60 + ss
    if (segPorKm <= 0 || segundosTotales <= 0) return null
    return { distanciaKm: segundosTotales / segPorKm }
  }, [ritmoMin, ritmoSeg, h, m, s])

  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Ritmo (min:seg por km)</label>
        <div className="grid grid-cols-2 gap-2">
          <input type="number" inputMode="numeric" min="0" value={ritmoMin} onChange={(e) => setRitmoMin(e.target.value)} placeholder="min" className={inputClass} />
          <input type="number" inputMode="numeric" min="0" max="59" value={ritmoSeg} onChange={(e) => setRitmoSeg(e.target.value)} placeholder="seg" className={inputClass} />
        </div>
      </div>
      <CampoTiempo label="Tiempo total" h={h} m={m} s={s} onH={setH} onM={setM} onS={setS} />

      <ResultBox>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Distancia recorrida</p>
        <p className="text-4xl font-bold text-blue-700">{resultado ? `${resultado.distanciaKm.toFixed(2)} km` : '—'}</p>
      </ResultBox>
    </div>
  )
}
