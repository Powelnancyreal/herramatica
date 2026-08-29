'use client'

import { useMemo, useState } from 'react'

const TABS = [
  { id: 'tiempo', label: 'Calcular Tiempo' },
  { id: 'velocidad', label: 'Calcular Velocidad' },
  { id: 'distancia', label: 'Calcular Distancia' },
]

// Factores de conversión a unidades base: metros, segundos, m/s
const DIST_A_METROS = { km: 1000, m: 1, mi: 1609.344 }
const TIEMPO_A_SEGUNDOS = { h: 3600, min: 60, s: 1 }
const VEL_A_MS = { kmh: 1 / 3.6, ms: 1, mph: 0.44704 }

const DIST_UNIDADES = [
  { id: 'km', label: 'km' },
  { id: 'm', label: 'm' },
  { id: 'mi', label: 'millas' },
]
const TIEMPO_UNIDADES = [
  { id: 'h', label: 'horas' },
  { id: 'min', label: 'minutos' },
  { id: 's', label: 'segundos' },
]
const VEL_UNIDADES = [
  { id: 'kmh', label: 'km/h' },
  { id: 'ms', label: 'm/s' },
  { id: 'mph', label: 'mph' },
]

function formatNum(n, decimales = 2) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return parseFloat(n.toFixed(decimales)).toLocaleString('es', { maximumFractionDigits: decimales })
}

function formatTiempo(segundosTotales) {
  if (segundosTotales === null || isNaN(segundosTotales) || segundosTotales < 0) return '—'
  const h = Math.floor(segundosTotales / 3600)
  const m = Math.floor((segundosTotales % 3600) / 60)
  const s = Math.round(segundosTotales % 60)
  const partes = []
  if (h > 0) partes.push(`${h}h`)
  if (m > 0 || h > 0) partes.push(`${m}min`)
  partes.push(`${s}s`)
  return partes.join(' ')
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const selectClass = inputClass
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

function CampoConUnidad({ label, valor, onValor, unidad, onUnidad, unidades, placeholder }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex gap-2">
        <input
          type="number"
          inputMode="decimal"
          min="0"
          value={valor}
          onChange={(e) => onValor(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
        <select value={unidad} onChange={(e) => onUnidad(e.target.value)} className={`${selectClass} max-w-[7.5rem]`}>
          {unidades.map((u) => (
            <option key={u.id} value={u.id}>
              {u.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

function ResultBox({ children }) {
  return <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">{children}</div>
}

export default function CalcularVelocidadDistanciaTiempo() {
  const [tab, setTab] = useState('tiempo')

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

      {tab === 'tiempo' && <CalcularTiempo />}
      {tab === 'velocidad' && <CalcularVelocidad />}
      {tab === 'distancia' && <CalcularDistancia />}
    </div>
  )
}

// ─── Tab 1: Tiempo = Distancia / Velocidad ──────────────────────────

function CalcularTiempo() {
  const [distancia, setDistancia] = useState('')
  const [uDistancia, setUDistancia] = useState('km')
  const [velocidad, setVelocidad] = useState('')
  const [uVelocidad, setUVelocidad] = useState('kmh')

  const resultado = useMemo(() => {
    const d = parseFloat(distancia)
    const v = parseFloat(velocidad)
    if (isNaN(d) || isNaN(v) || v <= 0) return null
    const metros = d * DIST_A_METROS[uDistancia]
    const ms = v * VEL_A_MS[uVelocidad]
    const segundos = metros / ms
    return { segundos, horasDecimal: segundos / 3600 }
  }, [distancia, uDistancia, velocidad, uVelocidad])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CampoConUnidad
          label="Distancia"
          valor={distancia}
          onValor={setDistancia}
          unidad={uDistancia}
          onUnidad={setUDistancia}
          unidades={DIST_UNIDADES}
          placeholder="Ej: 120"
        />
        <CampoConUnidad
          label="Velocidad"
          valor={velocidad}
          onValor={setVelocidad}
          unidad={uVelocidad}
          onUnidad={setUVelocidad}
          unidades={VEL_UNIDADES}
          placeholder="Ej: 90"
        />
      </div>
      <ResultBox>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Tiempo estimado</p>
        <p className="text-4xl font-bold text-blue-700">{resultado ? formatTiempo(resultado.segundos) : '—'}</p>
        {resultado && <p className="text-sm text-gray-500 mt-2">({formatNum(resultado.horasDecimal)} horas en formato decimal)</p>}
      </ResultBox>
    </div>
  )
}

// ─── Tab 2: Velocidad = Distancia / Tiempo ──────────────────────────

function CalcularVelocidad() {
  const [distancia, setDistancia] = useState('')
  const [uDistancia, setUDistancia] = useState('km')
  const [tiempo, setTiempo] = useState('')
  const [uTiempo, setUTiempo] = useState('h')

  const resultado = useMemo(() => {
    const d = parseFloat(distancia)
    const t = parseFloat(tiempo)
    if (isNaN(d) || isNaN(t) || t <= 0) return null
    const metros = d * DIST_A_METROS[uDistancia]
    const segundos = t * TIEMPO_A_SEGUNDOS[uTiempo]
    const ms = metros / segundos
    return { kmh: ms * 3.6, ms, mph: ms / 0.44704 }
  }, [distancia, uDistancia, tiempo, uTiempo])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CampoConUnidad
          label="Distancia"
          valor={distancia}
          onValor={setDistancia}
          unidad={uDistancia}
          onUnidad={setUDistancia}
          unidades={DIST_UNIDADES}
          placeholder="Ej: 120"
        />
        <CampoConUnidad
          label="Tiempo"
          valor={tiempo}
          onValor={setTiempo}
          unidad={uTiempo}
          onUnidad={setUTiempo}
          unidades={TIEMPO_UNIDADES}
          placeholder="Ej: 1.5"
        />
      </div>
      <ResultBox>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Velocidad media</p>
        <p className="text-4xl font-bold text-blue-700">{resultado ? `${formatNum(resultado.kmh)} km/h` : '—'}</p>
      </ResultBox>
      {resultado && (
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-500">m/s</p>
            <p className="font-semibold text-gray-900">{formatNum(resultado.ms)}</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-500">mph</p>
            <p className="font-semibold text-gray-900">{formatNum(resultado.mph)}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Tab 3: Distancia = Velocidad × Tiempo ──────────────────────────

function CalcularDistancia() {
  const [velocidad, setVelocidad] = useState('')
  const [uVelocidad, setUVelocidad] = useState('kmh')
  const [tiempo, setTiempo] = useState('')
  const [uTiempo, setUTiempo] = useState('h')

  const resultado = useMemo(() => {
    const v = parseFloat(velocidad)
    const t = parseFloat(tiempo)
    if (isNaN(v) || isNaN(t) || v < 0 || t < 0) return null
    const ms = v * VEL_A_MS[uVelocidad]
    const segundos = t * TIEMPO_A_SEGUNDOS[uTiempo]
    const metros = ms * segundos
    return { km: metros / 1000, m: metros, mi: metros / 1609.344 }
  }, [velocidad, uVelocidad, tiempo, uTiempo])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CampoConUnidad
          label="Velocidad"
          valor={velocidad}
          onValor={setVelocidad}
          unidad={uVelocidad}
          onUnidad={setUVelocidad}
          unidades={VEL_UNIDADES}
          placeholder="Ej: 90"
        />
        <CampoConUnidad
          label="Tiempo"
          valor={tiempo}
          onValor={setTiempo}
          unidad={uTiempo}
          onUnidad={setUTiempo}
          unidades={TIEMPO_UNIDADES}
          placeholder="Ej: 2"
        />
      </div>
      <ResultBox>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Distancia recorrida</p>
        <p className="text-4xl font-bold text-blue-700">{resultado ? `${formatNum(resultado.km)} km` : '—'}</p>
      </ResultBox>
      {resultado && (
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-500">metros</p>
            <p className="font-semibold text-gray-900">{formatNum(resultado.m)}</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-500">millas</p>
            <p className="font-semibold text-gray-900">{formatNum(resultado.mi)}</p>
          </div>
        </div>
      )}
    </div>
  )
}
