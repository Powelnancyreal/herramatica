'use client'

import { useMemo, useState } from 'react'

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

function categoriaLdl(ldl) {
  if (ldl < 100) return { label: 'Óptimo', color: 'text-green-700 bg-green-50 border-green-200' }
  if (ldl < 130) return { label: 'Casi óptimo', color: 'text-lime-700 bg-lime-50 border-lime-200' }
  if (ldl < 160) return { label: 'Límite alto', color: 'text-amber-700 bg-amber-50 border-amber-200' }
  if (ldl < 190) return { label: 'Alto', color: 'text-orange-700 bg-orange-50 border-orange-200' }
  return { label: 'Muy alto', color: 'text-red-700 bg-red-50 border-red-200' }
}

export default function CalculadoraLdl() {
  const [ct, setCt] = useState('')
  const [hdl, setHdl] = useState('')
  const [tg, setTg] = useState('')

  const resultado = useMemo(() => {
    const vct = parseFloat(ct)
    const vhdl = parseFloat(hdl)
    const vtg = parseFloat(tg)
    if (isNaN(vct) || isNaN(vhdl) || isNaN(vtg)) return null
    if (vtg > 400) return { error: 'La fórmula de Friedewald no es válida con triglicéridos por encima de 400 mg/dL. Se requiere una medición directa de LDL.' }
    return { ldl: vct - vhdl - vtg / 5 }
  }, [ct, hdl, tg])

  return (
    <div className="space-y-5">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
        ⚕️ <strong>Aviso médico:</strong> Esta herramienta es solo para fines educativos e informativos. Consulta
        siempre con un profesional de la salud antes de tomar decisiones médicas.
      </div>
      <p className="text-sm text-gray-600">Introduce los valores en mg/dL, tal como aparecen en tu perfil lipídico.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Colesterol total</label>
          <input type="number" inputMode="decimal" min="0" value={ct} onChange={(e) => setCt(e.target.value)} placeholder="Ej: 200" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Colesterol HDL</label>
          <input type="number" inputMode="decimal" min="0" value={hdl} onChange={(e) => setHdl(e.target.value)} placeholder="Ej: 50" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Triglicéridos</label>
          <input type="number" inputMode="decimal" min="0" value={tg} onChange={(e) => setTg(e.target.value)} placeholder="Ej: 150" className={inputClass} />
        </div>
      </div>

      {resultado?.error && <p className="text-sm text-red-600">{resultado.error}</p>}

      {resultado && !resultado.error && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Colesterol LDL estimado</p>
          <p className="text-4xl font-bold text-blue-700">{resultado.ldl.toFixed(1)} mg/dL</p>
          <span className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full border ${categoriaLdl(resultado.ldl).color}`}>
            {categoriaLdl(resultado.ldl).label}
          </span>
        </div>
      )}

      <p className="text-xs text-gray-500">
        ⚠️ Calculado con la fórmula de Friedewald (LDL = Colesterol total − HDL − Triglicéridos/5), la más usada en
        laboratorios clínicos. Es una herramienta educativa: la interpretación clínica de tu perfil lipídico debe
        hacerla un profesional de la salud, considerando tu historial y factores de riesgo individuales.
      </p>
    </div>
  )
}
