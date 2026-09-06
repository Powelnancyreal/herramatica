'use client'

import { useMemo, useState } from 'react'

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

function interpretacion(pafi) {
  if (pafi > 400) return { label: 'Normal', color: 'text-green-700 bg-green-50 border-green-200' }
  if (pafi > 300) return { label: 'Alteración leve de la oxigenación', color: 'text-lime-700 bg-lime-50 border-lime-200' }
  if (pafi > 200) return { label: 'Alteración moderada (compatible con SDRA leve-moderado)', color: 'text-amber-700 bg-amber-50 border-amber-200' }
  if (pafi > 100) return { label: 'Alteración severa (SDRA moderado)', color: 'text-orange-700 bg-orange-50 border-orange-200' }
  return { label: 'Alteración muy severa (SDRA severo)', color: 'text-red-700 bg-red-50 border-red-200' }
}

const FIO2_COMUNES = [
  { label: 'Aire ambiente', valor: 21 },
  { label: 'Cánula nasal 2L/min', valor: 28 },
  { label: 'Cánula nasal 4L/min', valor: 36 },
  { label: 'Mascarilla simple', valor: 40 },
  { label: 'Mascarilla con reservorio', valor: 60 },
  { label: 'Ventilación mecánica 100%', valor: 100 },
]

export default function CalculadoraPafi() {
  const [pao2, setPao2] = useState('')
  const [fio2, setFio2] = useState('21')

  const resultado = useMemo(() => {
    const vpao2 = parseFloat(pao2)
    const vfio2 = parseFloat(fio2)
    if (isNaN(vpao2) || isNaN(vfio2) || vfio2 <= 0) return null
    return vpao2 / (vfio2 / 100)
  }, [pao2, fio2])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>PaO₂ (mmHg, de la gasometría arterial)</label>
          <input type="number" inputMode="decimal" min="0" value={pao2} onChange={(e) => setPao2(e.target.value)} placeholder="Ej: 90" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>FiO₂ (%)</label>
          <input type="number" inputMode="decimal" min="0" max="100" value={fio2} onChange={(e) => setFio2(e.target.value)} className={inputClass} />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {FIO2_COMUNES.map((f) => (
              <button
                key={f.label}
                onClick={() => setFio2(String(f.valor))}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded-full"
              >
                {f.label} ({f.valor}%)
              </button>
            ))}
          </div>
        </div>
      </div>

      {resultado !== null && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Índice PaFi (PaO₂/FiO₂)</p>
          <p className="text-4xl font-bold text-blue-700">{resultado.toFixed(0)}</p>
          <span className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full border ${interpretacion(resultado).color}`}>
            {interpretacion(resultado).label}
          </span>
        </div>
      )}

      <p className="text-xs text-gray-500">
        ⚠️ El índice PaFi es un indicador de oxigenación usado en los criterios de Berlín para el diagnóstico de
        SDRA, pero ese diagnóstico también requiere otros criterios clínicos (inicio agudo, opacidades bilaterales en
        imagen, PEEP mínima, exclusión de causa cardiogénica). Esta herramienta es educativa y no reemplaza el
        juicio clínico.
      </p>
    </div>
  )
}
