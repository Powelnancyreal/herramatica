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

export default function CalculadoraCtsPeru() {
  const [sueldo, setSueldo] = useState('')
  const [gratificacion, setGratificacion] = useState('')
  const [periodo, setPeriodo] = useState('nov-abr')
  const [fechaIngreso, setFechaIngreso] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const s = parseFloat(sueldo)
    const g = parseFloat(gratificacion) || 0
    if (!s || s <= 0) return setError('Introduce tu remuneración mensual.')

    setError('')
    const remuneracionComputable = s + g / 6

    const anioActual = new Date().getFullYear()
    const inicioPeriodo = periodo === 'nov-abr' ? new Date(anioActual - (new Date().getMonth() < 10 ? 1 : 0), 10, 1) : new Date(anioActual, 4, 1)
    const finPeriodo = periodo === 'nov-abr' ? new Date(inicioPeriodo.getFullYear() + 1, 3, 30) : new Date(anioActual, 9, 31)

    let inicioComputo = inicioPeriodo
    if (fechaIngreso) {
      const ingreso = new Date(fechaIngreso)
      if (ingreso > inicioPeriodo && ingreso <= finPeriodo) inicioComputo = ingreso
    }

    const diasTotales = Math.round((finPeriodo - inicioPeriodo) / MS_POR_DIA) + 1
    const diasTrabajados = Math.round((finPeriodo - inicioComputo) / MS_POR_DIA) + 1
    const meses = Math.floor(diasTrabajados / 30)
    const dias = diasTrabajados % 30

    const montoCompleto = remuneracionComputable / 2
    const montoProporcional = (remuneracionComputable / 12) * meses + (remuneracionComputable / 360) * dias

    setResult({
      remuneracionComputable,
      monto: diasTrabajados >= diasTotales ? montoCompleto : montoProporcional,
      meses,
      dias,
      completo: diasTrabajados >= diasTotales,
    })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Remuneración mensual (sueldo básico)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">S/</span>
            <input type="number" inputMode="decimal" min="0" value={sueldo} onChange={(e) => setSueldo(e.target.value)} placeholder="Ej: 2000" className={`${inputClass} pl-9`} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Última gratificación recibida (opcional)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">S/</span>
            <input type="number" inputMode="decimal" min="0" value={gratificacion} onChange={(e) => setGratificacion(e.target.value)} placeholder="Ej: 2000" className={`${inputClass} pl-9`} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Periodo de depósito</label>
          <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} className={inputClass}>
            <option value="nov-abr">Noviembre a abril (depósito en mayo)</option>
            <option value="may-oct">Mayo a octubre (depósito en noviembre)</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Fecha de ingreso (solo si empezaste en este periodo)</label>
          <input type="date" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} className={inputClass} />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button onClick={calcular} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
        Calcular CTS
      </button>

      {result && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            {result.completo ? 'Depósito de CTS del periodo' : 'CTS proporcional'}
          </p>
          <p className="text-4xl font-bold text-blue-700 leading-none mb-1">S/ {formatMoney(result.monto)}</p>
          <p className="text-xs text-gray-500">
            Remuneración computable: S/ {formatMoney(result.remuneracionComputable)}
            {!result.completo && ` · ${result.meses} meses y ${result.dias} días trabajados en el periodo`}
          </p>
        </div>
      )}

      <p className="text-xs text-gray-500">
        ⚠️ Cálculo orientativo basado en la fórmula estándar de CTS peruana. No incluye conceptos remunerativos
        adicionales que puedan formar parte de tu remuneración computable (horas extra habituales, comisiones, etc.).
        Verifica el detalle exacto con tu área de Recursos Humanos.
      </p>
    </div>
  )
}
