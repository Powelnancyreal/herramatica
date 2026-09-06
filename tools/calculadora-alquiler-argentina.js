'use client'

import { useMemo, useState } from 'react'

function formatMoney(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return n.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalculadoraAlquilerArgentina() {
  const [alquilerActual, setAlquilerActual] = useState('')
  const [modo, setModo] = useState('coeficiente')
  const [coeficiente, setCoeficiente] = useState('')
  const [porcentaje, setPorcentaje] = useState('')

  const resultado = useMemo(() => {
    const base = parseFloat(alquilerActual)
    if (isNaN(base) || base <= 0) return null
    if (modo === 'coeficiente') {
      const c = parseFloat(coeficiente)
      if (isNaN(c) || c <= 0) return null
      return { nuevoAlquiler: base * c, aumento: base * c - base, variacionPct: (c - 1) * 100 }
    }
    const p = parseFloat(porcentaje)
    if (isNaN(p)) return null
    return { nuevoAlquiler: base * (1 + p / 100), aumento: base * (p / 100), variacionPct: p }
  }, [alquilerActual, modo, coeficiente, porcentaje])

  return (
    <div className="space-y-6">
      <div>
        <label className={labelClass}>Alquiler actual</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            value={alquilerActual}
            onChange={(e) => setAlquilerActual(e.target.value)}
            placeholder="Ej: 350000"
            className={`${inputClass} pl-7`}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setModo('coeficiente')}
          className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            modo === 'coeficiente' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Tengo el coeficiente (ICL/IPC/CVS)
        </button>
        <button
          onClick={() => setModo('porcentaje')}
          className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            modo === 'porcentaje' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Tengo el % de aumento pactado
        </button>
      </div>

      {modo === 'coeficiente' ? (
        <div>
          <label className={labelClass}>Coeficiente de ajuste publicado</label>
          <input
            type="number"
            inputMode="decimal"
            step="0.0001"
            min="0"
            value={coeficiente}
            onChange={(e) => setCoeficiente(e.target.value)}
            placeholder="Ej: 1.2853"
            className={inputClass}
          />
          <p className="text-xs text-gray-500 mt-1.5">
            Obtén el coeficiente vigente para tu fecha de contrato en el simulador oficial del BCRA (índice ICL) o en
            el INDEC (IPC), según lo que indique tu contrato.
          </p>
        </div>
      ) : (
        <div>
          <label className={labelClass}>Porcentaje de aumento (%)</label>
          <input
            type="number"
            inputMode="decimal"
            value={porcentaje}
            onChange={(e) => setPorcentaje(e.target.value)}
            placeholder="Ej: 28.5"
            className={inputClass}
          />
        </div>
      )}

      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Nuevo alquiler</p>
        <p className="text-4xl font-bold text-blue-700 leading-none mb-3">{resultado ? `$${formatMoney(resultado.nuevoAlquiler)}` : '—'}</p>
        {resultado && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded-lg px-3 py-2 border border-blue-100">
              <p className="text-gray-500">Aumento en pesos</p>
              <p className="font-semibold text-gray-900">${formatMoney(resultado.aumento)}</p>
            </div>
            <div className="bg-white rounded-lg px-3 py-2 border border-blue-100">
              <p className="text-gray-500">Variación</p>
              <p className="font-semibold text-gray-900">+{resultado.variacionPct.toFixed(2)}%</p>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500">
        ⚠️ Esta calculadora no publica el coeficiente ICL/IPC del mes, ya que ese valor lo actualiza el BCRA/INDEC
        periódicamente. Consulta el valor vigente en la fuente oficial correspondiente a tu contrato e introdúcelo
        aquí para obtener tu nuevo alquiler.
      </p>
    </div>
  )
}
