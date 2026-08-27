'use client'

import { useState } from 'react'

// Sistema de amortización francés: cuota fija, con interés decreciente y capital creciente.
export function calcularPrestamo({ monto, tasaAnual, plazoMeses }) {
  const r = tasaAnual / 100 / 12
  const n = plazoMeses

  const cuotaMensual = r === 0 ? monto / n : (monto * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)

  const tabla = []
  let saldo = monto
  for (let mes = 1; mes <= n; mes++) {
    const interes = saldo * r
    let capital = cuotaMensual - interes
    if (mes === n) capital = saldo // ajusta el último pago para liquidar exactamente el saldo
    saldo = Math.max(0, saldo - capital)
    tabla.push({ mes, cuota: capital + interes, capital, interes, saldo })
  }

  const totalPagado = tabla.reduce((acc, row) => acc + row.cuota, 0)
  const totalIntereses = totalPagado - monto

  return { cuotaMensual, totalPagado, totalIntereses, tabla }
}

function formatMoney(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return n.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalculadoraPrestamo() {
  const [monto, setMonto] = useState('')
  const [tasaAnual, setTasaAnual] = useState('')
  const [plazo, setPlazo] = useState('')
  const [unidadPlazo, setUnidadPlazo] = useState('meses')

  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [mostrarTabla, setMostrarTabla] = useState(false)

  function handleCalcular() {
    const m = parseFloat(monto)
    const t = parseFloat(tasaAnual)
    const p = parseInt(plazo, 10)
    if (!monto || isNaN(m) || m <= 0) return setError('Introduce un monto de préstamo válido.')
    if (tasaAnual === '' || isNaN(t) || t < 0) return setError('Introduce una tasa de interés anual válida.')
    if (!plazo || isNaN(p) || p <= 0) return setError('Introduce un plazo válido.')

    setError('')
    setMostrarTabla(false)
    const plazoMeses = unidadPlazo === 'anios' ? p * 12 : p
    setResult(calcularPrestamo({ monto: m, tasaAnual: t, plazoMeses }))
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Monto del préstamo</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input type="number" inputMode="decimal" min="0" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="Ej: 100000" className={`${inputClass} pl-7`} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Tasa de interés anual</label>
          <div className="relative">
            <input type="number" inputMode="decimal" min="0" step="0.01" value={tasaAnual} onChange={(e) => setTasaAnual(e.target.value)} placeholder="Ej: 12" className={`${inputClass} pr-8`} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
          </div>
        </div>
        <div>
          <label className={labelClass}>Plazo</label>
          <input type="number" inputMode="numeric" min="1" value={plazo} onChange={(e) => setPlazo(e.target.value)} placeholder="Ej: 36" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Unidad del plazo</label>
          <select value={unidadPlazo} onChange={(e) => setUnidadPlazo(e.target.value)} className={inputClass}>
            <option value="meses">Meses</option>
            <option value="anios">Años</option>
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleCalcular}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Calcular préstamo
      </button>

      {result && (
        <div className="space-y-4">
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Pago mensual estimado</p>
            <p className="text-4xl font-bold text-blue-700 leading-none mb-4">${formatMoney(result.cuotaMensual)}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white rounded-lg px-3 py-2 border border-blue-100">
                <p className="text-gray-500">Total a pagar</p>
                <p className="font-semibold text-gray-900">${formatMoney(result.totalPagado)}</p>
              </div>
              <div className="bg-white rounded-lg px-3 py-2 border border-blue-100">
                <p className="text-gray-500">Total de intereses</p>
                <p className="font-semibold text-gray-900">${formatMoney(result.totalIntereses)}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setMostrarTabla((s) => !s)}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            {mostrarTabla ? 'Ocultar tabla de amortización' : 'Ver tabla de amortización completa'}
          </button>

          {mostrarTabla && (
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-sm min-w-[480px]">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-3 py-2 text-left">Mes</th>
                    <th className="px-3 py-2 text-right">Cuota</th>
                    <th className="px-3 py-2 text-right">Capital</th>
                    <th className="px-3 py-2 text-right">Interés</th>
                    <th className="px-3 py-2 text-right">Saldo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {result.tabla.map((row) => (
                    <tr key={row.mes}>
                      <td className="px-3 py-2 text-gray-600">{row.mes}</td>
                      <td className="px-3 py-2 text-right text-gray-900">${formatMoney(row.cuota)}</td>
                      <td className="px-3 py-2 text-right text-gray-600">${formatMoney(row.capital)}</td>
                      <td className="px-3 py-2 text-right text-gray-600">${formatMoney(row.interes)}</td>
                      <td className="px-3 py-2 text-right text-gray-600">${formatMoney(row.saldo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-xs text-gray-500">
            ⚠️ Cálculo orientativo basado en el sistema de amortización francés (cuota fija). Tu institución financiera
            puede aplicar comisiones, seguros u otros cargos adicionales no incluidos aquí.
          </p>
        </div>
      )}
    </div>
  )
}
