'use client'

import { useState } from 'react'

const MS_POR_DIA = 1000 * 60 * 60 * 24

function formatMoney(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return n.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalcularSacArgentina() {
  const [cuota, setCuota] = useState('2')
  const [anio, setAnio] = useState(new Date().getFullYear().toString())
  const [mejorSueldo, setMejorSueldo] = useState('')
  const [fechaIngreso, setFechaIngreso] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const sueldo = parseFloat(mejorSueldo)
    const year = parseInt(anio, 10)
    if (!sueldo || sueldo <= 0) return setError('Introduce la mejor remuneración mensual del semestre.')

    setError('')
    const inicioSemestre = cuota === '1' ? new Date(year, 0, 1) : new Date(year, 6, 1)
    const finSemestre = cuota === '1' ? new Date(year, 5, 30) : new Date(year, 11, 31)
    const diasTotalesSemestre = Math.round((finSemestre - inicioSemestre) / MS_POR_DIA) + 1

    let diasTrabajados = diasTotalesSemestre
    if (fechaIngreso) {
      const ingreso = new Date(fechaIngreso)
      if (ingreso > inicioSemestre && ingreso <= finSemestre) {
        diasTrabajados = Math.round((finSemestre - ingreso) / MS_POR_DIA) + 1
      } else if (ingreso > finSemestre) {
        return setError('La fecha de ingreso es posterior al semestre seleccionado.')
      }
    }

    const sacCompleto = sueldo * 0.5
    const sacProporcional = sacCompleto * (diasTrabajados / diasTotalesSemestre)

    setResult({ sacCompleto, sacProporcional, diasTrabajados, diasTotalesSemestre })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Cuota del SAC</label>
          <select value={cuota} onChange={(e) => setCuota(e.target.value)} className={inputClass}>
            <option value="1">1ª cuota (enero–junio, se cobra en junio)</option>
            <option value="2">2ª cuota (julio–diciembre, se cobra en diciembre)</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Año</label>
          <input type="number" inputMode="numeric" value={anio} onChange={(e) => setAnio(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Mejor remuneración mensual del semestre</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input type="number" inputMode="decimal" min="0" value={mejorSueldo} onChange={(e) => setMejorSueldo(e.target.value)} placeholder="Ej: 800000" className={`${inputClass} pl-7`} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Fecha de ingreso (solo si empezaste este semestre)</label>
          <input type="date" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} className={inputClass} />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button onClick={calcular} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
        Calcular SAC
      </button>

      {result && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            {result.diasTrabajados < result.diasTotalesSemestre ? 'SAC proporcional a cobrar' : 'SAC a cobrar'}
          </p>
          <p className="text-4xl font-bold text-blue-700 leading-none mb-1">
            ${formatMoney(result.diasTrabajados < result.diasTotalesSemestre ? result.sacProporcional : result.sacCompleto)}
          </p>
          {result.diasTrabajados < result.diasTotalesSemestre && (
            <p className="text-xs text-gray-500">
              Trabajaste {result.diasTrabajados} de {result.diasTotalesSemestre} días del semestre. SAC completo del semestre: $
              {formatMoney(result.sacCompleto)}
            </p>
          )}
        </div>
      )}

      <p className="text-xs text-gray-500">
        ⚠️ Cálculo orientativo según la Ley 23.041. Si tu remuneración varió durante el semestre, usa la más alta
        percibida en ese período. No reemplaza la liquidación oficial de tu empleador.
      </p>
    </div>
  )
}
