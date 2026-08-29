'use client'

import { useMemo, useState } from 'react'

const MODOS_CONSUMO = [
  { id: 'l100km', label: 'L / 100 km' },
  { id: 'kml', label: 'km / L' },
]

function formatNum(n, decimales = 2) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return parseFloat(n.toFixed(decimales)).toLocaleString('es', { maximumFractionDigits: decimales })
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalcularGasolina() {
  const [distancia, setDistancia] = useState('')
  const [idaYVuelta, setIdaYVuelta] = useState(false)
  const [modoConsumo, setModoConsumo] = useState('l100km')
  const [consumo, setConsumo] = useState('')
  const [precio, setPrecio] = useState('')
  const [personas, setPersonas] = useState('1')

  const resultado = useMemo(() => {
    const d = parseFloat(distancia)
    const c = parseFloat(consumo)
    const p = parseFloat(precio)
    const n = parseInt(personas, 10) || 1
    if (isNaN(d) || d <= 0 || isNaN(c) || c <= 0 || isNaN(p) || p < 0) return null

    const distanciaTotal = idaYVuelta ? d * 2 : d
    const kmPorLitro = modoConsumo === 'l100km' ? 100 / c : c
    const litros = distanciaTotal / kmPorLitro
    const costoTotal = litros * p
    const costoPorKm = costoTotal / distanciaTotal
    const costoPorPersona = costoTotal / Math.max(n, 1)

    return { distanciaTotal, litros, costoTotal, costoPorKm, costoPorPersona, n }
  }, [distancia, idaYVuelta, modoConsumo, consumo, precio, personas])

  return (
    <div className="space-y-6">
      <div>
        <label className={labelClass}>Distancia del trayecto</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="number"
              inputMode="decimal"
              min="0"
              value={distancia}
              onChange={(e) => setDistancia(e.target.value)}
              placeholder="Ej: 250"
              className={inputClass}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">km</span>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600 mt-2">
          <input
            type="checkbox"
            checked={idaYVuelta}
            onChange={(e) => setIdaYVuelta(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Viaje de ida y vuelta (duplica la distancia)
        </label>
      </div>

      <div>
        <label className={labelClass}>Consumo del vehículo</label>
        <div className="flex gap-2 mb-2">
          {MODOS_CONSUMO.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setModoConsumo(m.id)
                setConsumo('')
              }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                modoConsumo === m.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.1"
          value={consumo}
          onChange={(e) => setConsumo(e.target.value)}
          placeholder={modoConsumo === 'l100km' ? 'Ej: 7.5' : 'Ej: 13.3'}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Precio del combustible (por litro)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="Ej: 1.65"
              className={`${inputClass} pl-7`}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Número de personas (opcional)</label>
          <input
            type="number"
            inputMode="numeric"
            min="1"
            value={personas}
            onChange={(e) => setPersonas(e.target.value)}
            placeholder="1"
            className={inputClass}
          />
        </div>
      </div>

      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Costo total del viaje</p>
        <p className="text-4xl font-bold text-blue-700 leading-none mb-4">
          {resultado ? `$${formatNum(resultado.costoTotal)}` : '—'}
        </p>
        {resultado && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <div className="bg-white rounded-lg px-3 py-2 border border-blue-100">
              <p className="text-gray-500">Litros necesarios</p>
              <p className="font-semibold text-gray-900">{formatNum(resultado.litros)} L</p>
            </div>
            <div className="bg-white rounded-lg px-3 py-2 border border-blue-100">
              <p className="text-gray-500">Costo por km</p>
              <p className="font-semibold text-gray-900">${formatNum(resultado.costoPorKm)}</p>
            </div>
            {resultado.n > 1 && (
              <div className="bg-white rounded-lg px-3 py-2 border border-blue-100">
                <p className="text-gray-500">Por persona ({resultado.n})</p>
                <p className="font-semibold text-gray-900">${formatNum(resultado.costoPorPersona)}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
