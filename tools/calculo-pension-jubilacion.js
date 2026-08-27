'use client'

import { useState } from 'react'

// ─────────────────────────────────────────────────────────────────
// Estimador simplificado de pensión de jubilación (España, 2026)
//
// La base reguladora real se calcula con hasta 25-27 años de bases de
// cotización mensuales reales (y desde 2026, comparando dos métodos
// distintos). Esa información solo la tiene la Seguridad Social. Esta
// calculadora usa el salario declarado como una aproximación de la
// base reguladora, tal como hacen la mayoría de simuladores públicos
// que no requieren identificación oficial (Cl@ve PIN).
// ─────────────────────────────────────────────────────────────────

const MESES_MINIMO = 180 // 15 años: umbral de acceso a la pensión, da derecho al 50%
const MESES_FIN_TRAMO1 = 300 // 25 años: cambio de pendiente en la escala
const MESES_MAXIMO = 438 // 36 años y 6 meses: 100% de la base reguladora
const TASA_TRAMO1 = 0.19 // % por mes cotizado, de los 15 a los 25 años (cifra oficial)
const PORCENTAJE_A_25_ANIOS = 50 + (MESES_FIN_TRAMO1 - MESES_MINIMO) * TASA_TRAMO1
// La segunda pendiente se deriva para que el resultado sea exactamente 100% a los 36 años y 6 meses,
// el otro extremo confirmado de la escala oficial.
const TASA_TRAMO2 = (100 - PORCENTAJE_A_25_ANIOS) / (MESES_MAXIMO - MESES_FIN_TRAMO1)

export function porcentajePorMesesCotizados(meses) {
  if (meses < MESES_MINIMO) return 0
  if (meses <= MESES_FIN_TRAMO1) return 50 + (meses - MESES_MINIMO) * TASA_TRAMO1
  if (meses < MESES_MAXIMO) return PORCENTAJE_A_25_ANIOS + (meses - MESES_FIN_TRAMO1) * TASA_TRAMO2
  return 100
}

// Pensión mínima contributiva 2026 (65 años o más), anual en 14 pagas
const MINIMOS_2026 = {
  sin_conyuge: 12441.8,
  unipersonal: 13106.8,
  con_conyuge: 17592.4,
}
const MAXIMA_ANUAL_2026 = 47034.4 // 3.359,60 €/mes x 14 pagas

export function estimarPension({ baseReguladoraMensual, mesesCotizados, situacionFamiliar }) {
  const porcentaje = porcentajePorMesesCotizados(mesesCotizados)
  if (porcentaje === 0) return { cumpleMinimo: false }

  let pensionMensual = baseReguladoraMensual * (porcentaje / 100)
  let pensionAnual = pensionMensual * 14

  const minimoAnual = MINIMOS_2026[situacionFamiliar]
  let aplicaMinimo = false
  let aplicaMaximo = false

  if (pensionAnual < minimoAnual) {
    pensionAnual = minimoAnual
    aplicaMinimo = true
  } else if (pensionAnual > MAXIMA_ANUAL_2026) {
    pensionAnual = MAXIMA_ANUAL_2026
    aplicaMaximo = true
  }
  pensionMensual = pensionAnual / 14

  return { cumpleMinimo: true, porcentaje, pensionMensual, pensionAnual, aplicaMinimo, aplicaMaximo }
}

function formatEUR(n) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
}

// ─────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalculoPensionJubilacion() {
  const [salario, setSalario] = useState('')
  const [aniosCotizados, setAniosCotizados] = useState('')
  const [mesesAdicionales, setMesesAdicionales] = useState('0')
  const [situacionFamiliar, setSituacionFamiliar] = useState('sin_conyuge')

  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function handleCalcular() {
    const sal = parseFloat(salario)
    const anios = parseInt(aniosCotizados, 10)
    const meses = parseInt(mesesAdicionales, 10) || 0
    if (!salario || isNaN(sal) || sal <= 0) return setError('Introduce tu salario bruto mensual (o el promedio estimado de tu carrera).')
    if (aniosCotizados === '' || isNaN(anios) || anios < 0) return setError('Introduce los años cotizados.')
    if (meses < 0 || meses > 11) return setError('Los meses adicionales deben estar entre 0 y 11.')

    setError('')
    const mesesTotales = anios * 12 + meses
    const r = estimarPension({ baseReguladoraMensual: sal, mesesCotizados: mesesTotales, situacionFamiliar })
    setResult({ ...r, mesesTotales, anios })
  }

  const edadOrdinaria =
    result && result.mesesTotales >= 38 * 12 + 3 ? '65 años' : result ? '66 años y 10 meses' : null

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Salario bruto mensual (o promedio estimado de tu carrera)</label>
          <div className="relative">
            <input type="number" inputMode="decimal" min="0" value={salario} onChange={(e) => setSalario(e.target.value)} placeholder="Ej: 2200" className={`${inputClass} pr-8`} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelClass}>Años cotizados</label>
            <input type="number" inputMode="numeric" min="0" value={aniosCotizados} onChange={(e) => setAniosCotizados(e.target.value)} placeholder="Ej: 32" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>+ Meses</label>
            <input type="number" inputMode="numeric" min="0" max="11" value={mesesAdicionales} onChange={(e) => setMesesAdicionales(e.target.value)} className={inputClass} />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Situación familiar</label>
          <select value={situacionFamiliar} onChange={(e) => setSituacionFamiliar(e.target.value)} className={inputClass}>
            <option value="sin_conyuge">Sin cónyuge a cargo</option>
            <option value="con_conyuge">Con cónyuge a cargo</option>
            <option value="unipersonal">Unidad económica unipersonal</option>
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleCalcular}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Estimar pensión
      </button>

      {result && !result.cumpleMinimo && (
        <div className="rounded-xl border-2 border-red-200 bg-red-50 p-5 text-center">
          <p className="text-red-700 font-semibold">No alcanzas el mínimo de 15 años cotizados</p>
          <p className="text-sm text-gray-600 mt-1">Se requieren al menos 15 años cotizados para tener derecho a pensión contributiva de jubilación.</p>
        </div>
      )}

      {result && result.cumpleMinimo && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 space-y-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Pensión mensual estimada (paga)</p>
            <p className="text-4xl font-bold text-blue-700 leading-none">{formatEUR(result.pensionMensual)}</p>
            <p className="text-xs text-gray-500 mt-1">{formatEUR(result.pensionAnual)} al año, en 14 pagas · {result.porcentaje.toFixed(2)}% de la base reguladora estimada</p>
          </div>

          {result.aplicaMinimo && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              ⓘ El cálculo bruto quedaba por debajo del mínimo, así que se ha aplicado la pensión mínima contributiva 2026 para tu situación familiar.
            </p>
          )}
          {result.aplicaMaximo && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              ⓘ El cálculo bruto superaba el máximo legal, así que se ha aplicado el tope de pensión máxima 2026.
            </p>
          )}

          <div className="bg-white rounded-lg border border-blue-100 px-4 py-3 text-sm flex items-center justify-between">
            <span className="text-gray-600">Edad ordinaria de jubilación estimada (2026)</span>
            <span className="font-semibold text-gray-900">{edadOrdinaria}</span>
          </div>

          <p className="text-xs text-gray-600 bg-white/70 border border-blue-100 rounded-lg px-3 py-2">
            ⚠️ <strong>Estimación simplificada, no un cálculo oficial.</strong> Usa tu salario como aproximación de la
            base reguladora real, que se calcula con hasta 25-27 años de tus bases de cotización reales. No incluye
            coeficientes reductores por jubilación anticipada ni incrementos por jubilación demorada. Para un cálculo
            oficial y exacto, consulta tu vida laboral y el simulador de la Seguridad Social con Cl@ve PIN.
          </p>
        </div>
      )}
    </div>
  )
}
