'use client'

import { useState } from 'react'

// ─────────────────────────────────────────────────────────────────
// Basado en el prospecto oficial de Apiretal 100 mg/ml solución oral
// (AEMPS/CIMA): 15 mg/kg por toma (= 0,15 ml/kg), cada 6-8 horas,
// máximo 4 tomas al día, sin superar 60 mg/kg/día.
// El prospecto recomienda consultar a un médico antes de administrar
// a niños de menos de 4 kg o menores de 3 años.
// ─────────────────────────────────────────────────────────────────

const MG_POR_ML = 100
const MG_POR_KG_POR_TOMA = 15
const ML_POR_KG_POR_TOMA = MG_POR_KG_POR_TOMA / MG_POR_ML // 0.15
const MG_MAXIMO_POR_KG_DIA = 60
const PESO_MINIMO_KG = 4

function redondearA(valor, decimales) {
  const factor = Math.pow(10, decimales)
  return Math.round(valor * factor) / factor
}

export function calcularDosisApiretal(pesoKg) {
  if (pesoKg < PESO_MINIMO_KG) {
    return { requiereConsultaMedica: true }
  }
  const tomasMaximasDia = 4
  const mlPorToma = redondearA(pesoKg * ML_POR_KG_POR_TOMA, 1)
  const mgPorToma = redondearA(mlPorToma * MG_POR_ML, 0)
  // El máximo diario se deriva de la dosis por toma ya redondeada, para que ambas cifras
  // sean siempre coherentes entre sí (lo que el padre/madre realmente administraría).
  const mlMaximoDiario = redondearA(mlPorToma * tomasMaximasDia, 1)
  const mgMaximoDiario = redondearA(mlMaximoDiario * MG_POR_ML, 0)

  return {
    requiereConsultaMedica: false,
    mlPorToma,
    mgPorToma,
    mlMaximoDiario,
    mgMaximoDiario,
    tomasMaximasDia,
  }
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'

export default function CalculadoraApiretal() {
  const [peso, setPeso] = useState('')
  const [edad, setEdad] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function handleCalcular() {
    const p = parseFloat(peso)
    if (!peso || isNaN(p) || p <= 0) return setError('Introduce el peso del niño o niña en kilogramos.')
    if (p > 60) return setError('Para pesos superiores a 60 kg, consulta la dosis de adultos con tu médico o farmacéutico.')
    setError('')
    setResult(calcularDosisApiretal(p))
  }

  return (
    <div className="space-y-5">
      {/* Aviso de seguridad, siempre visible */}
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-sm text-red-800">
        <p className="font-semibold mb-1">⚠️ Antes de usar esta calculadora</p>
        <p>
          Esta herramienta es solo una referencia basada en el prospecto oficial de{' '}
          <strong>Apiretal 100 mg/ml solución oral</strong>. No sustituye la indicación de tu pediatra o farmacéutico.
          Usa siempre la jeringa dosificadora que viene con el medicamento, nunca una cuchara casera. Ante cualquier
          duda, fiebre persistente o síntomas de alarma, consulta con un profesional sanitario.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Peso del niño o niña</label>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.1"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              placeholder="Ej: 15"
              className={`${inputClass} pr-10`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">kg</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Edad (opcional, orientativo)</label>
          <input type="text" value={edad} onChange={(e) => setEdad(e.target.value)} placeholder="Ej: 3 años" className={inputClass} />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleCalcular}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Calcular dosis
      </button>

      {result && result.requiereConsultaMedica && (
        <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-5 text-center">
          <p className="text-amber-800 font-semibold">Consulta a tu pediatra antes de administrar</p>
          <p className="text-sm text-gray-700 mt-2">
            Para bebés de menos de {PESO_MINIMO_KG} kg (aproximadamente hasta los 3 meses), el prospecto de Apiretal
            recomienda consultar siempre con un médico antes de administrar paracetamol, ya que la dosis debe
            ajustarse con supervisión profesional.
          </p>
        </div>
      )}

      {result && !result.requiereConsultaMedica && (
        <div className="space-y-4">
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Dosis por toma</p>
            <p className="text-4xl font-bold text-blue-700 leading-none">{result.mlPorToma} ml</p>
            <p className="text-sm text-gray-500 mt-1">({result.mgPorToma} mg de paracetamol) · cada 6-8 horas</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100 text-sm">
            <div className="flex justify-between px-4 py-2.5">
              <span className="text-gray-600">Máximo de tomas al día</span>
              <span className="font-semibold text-gray-900">{result.tomasMaximasDia}</span>
            </div>
            <div className="flex justify-between px-4 py-2.5">
              <span className="text-gray-600">Cantidad máxima diaria</span>
              <span className="font-semibold text-gray-900">
                {result.mlMaximoDiario} ml ({result.mgMaximoDiario} mg)
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-600 bg-white/70 border border-gray-200 rounded-lg px-3 py-2">
            Deja pasar al menos 6 horas entre tomas (mínimo 4 horas si tu pediatra lo indica así). Si la fiebre o el
            dolor persisten más de 3 días, o el niño tiene menos de 3 años, consulta con tu pediatra. En caso de
            sobredosis o ingestión accidental, llama al Servicio de Información Toxicológica:{' '}
            <strong>91 562 04 20</strong> o al 112.
          </p>
        </div>
      )}
    </div>
  )
}
