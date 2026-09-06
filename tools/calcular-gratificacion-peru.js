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

export default function CalcularGratificacionPeru() {
  const [sueldo, setSueldo] = useState('')
  const [periodo, setPeriodo] = useState('jul')
  const [fechaIngreso, setFechaIngreso] = useState('')
  const [regimen, setRegimen] = useState('essalud')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const s = parseFloat(sueldo)
    if (!s || s <= 0) return setError('Introduce tu remuneración mensual.')

    setError('')
    const anioActual = new Date().getFullYear()
    const inicioPeriodo = periodo === 'jul' ? new Date(anioActual, 0, 1) : new Date(anioActual, 6, 1)
    const finPeriodo = periodo === 'jul' ? new Date(anioActual, 5, 30) : new Date(anioActual, 11, 31)

    let inicioComputo = inicioPeriodo
    if (fechaIngreso) {
      const ingreso = new Date(fechaIngreso)
      if (ingreso > inicioPeriodo && ingreso <= finPeriodo) inicioComputo = ingreso
    }

    const diasTotales = Math.round((finPeriodo - inicioPeriodo) / MS_POR_DIA) + 1
    const diasTrabajados = Math.round((finPeriodo - inicioComputo) / MS_POR_DIA) + 1
    const meses = Math.min(6, Math.round(diasTrabajados / 30))

    const proporcional = (s / 6) * meses
    const tasaBono = regimen === 'essalud' ? 0.09 : 0.0675
    const bono = proporcional * tasaBono

    setResult({ proporcional, bono, total: proporcional + bono, meses, completo: meses >= 6 })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Remuneración mensual</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">S/</span>
            <input type="number" inputMode="decimal" min="0" value={sueldo} onChange={(e) => setSueldo(e.target.value)} placeholder="Ej: 2000" className={`${inputClass} pl-9`} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Gratificación</label>
          <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} className={inputClass}>
            <option value="jul">Fiestas Patrias (julio)</option>
            <option value="dic">Navidad (diciembre)</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Régimen de salud</label>
          <select value={regimen} onChange={(e) => setRegimen(e.target.value)} className={inputClass}>
            <option value="essalud">EsSalud (bonificación 9%)</option>
            <option value="eps">EPS (bonificación 6.75%)</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Fecha de ingreso (solo si empezaste en este semestre)</label>
          <input type="date" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} className={inputClass} />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button onClick={calcular} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
        Calcular gratificación
      </button>

      {result && (
        <div className="space-y-3">
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total a recibir</p>
            <p className="text-4xl font-bold text-blue-700 leading-none mb-1">S/ {formatMoney(result.total)}</p>
            <p className="text-xs text-gray-500">{result.completo ? 'Semestre completo (6 meses)' : `${result.meses} de 6 meses trabajados`}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
              <p className="text-gray-500">Gratificación</p>
              <p className="font-semibold text-gray-900">S/ {formatMoney(result.proporcional)}</p>
            </div>
            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
              <p className="text-gray-500">Bonificación extraordinaria</p>
              <p className="font-semibold text-gray-900">S/ {formatMoney(result.bono)}</p>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500">
        ⚠️ Cálculo orientativo según la Ley N.º 27735 y la bonificación extraordinaria de la Ley N.º 29351. No
        incluye otros conceptos remunerativos variables. Verifica el detalle exacto con tu área de Recursos Humanos.
      </p>
    </div>
  )
}
