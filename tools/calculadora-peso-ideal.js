'use client'

import { useMemo, useState } from 'react'

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalculadoraPesoIdeal() {
  const [altura, setAltura] = useState('')

  const resultado = useMemo(() => {
    const cm = parseFloat(altura)
    if (isNaN(cm) || cm <= 0) return null
    const m = cm / 100
    return { min: 18.5 * m * m, max: 24.9 * m * m, medio: 21.7 * m * m }
  }, [altura])

  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Tu altura (cm)</label>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          value={altura}
          onChange={(e) => setAltura(e.target.value)}
          placeholder="Ej: 170"
          className={inputClass}
        />
      </div>

      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Rango de peso saludable</p>
        <p className="text-4xl font-bold text-blue-700">
          {resultado ? `${resultado.min.toFixed(1)} – ${resultado.max.toFixed(1)} kg` : '—'}
        </p>
        {resultado && <p className="text-sm text-gray-500 mt-2">Peso de referencia: {resultado.medio.toFixed(1)} kg</p>}
      </div>

      <p className="text-xs text-gray-500">
        Este rango corresponde a un Índice de Masa Corporal (IMC) saludable (entre 18.5 y 24.9) para tu altura, el
        criterio más usado y respaldado actualmente por organismos de salud. No existe un único "peso ideal" exacto:
        depende también de tu composición corporal, masa muscular y edad. ¿Quieres calcular tu IMC actual? Usa
        nuestra calculadora de IMC.
      </p>
    </div>
  )
}
