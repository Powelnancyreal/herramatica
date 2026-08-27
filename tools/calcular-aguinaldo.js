'use client'

import { useState } from 'react'
import { calcularISR } from './calculadora-isr'

// UMA diaria 2026 (Instituto Nacional de Estadística y Geografía / INEGI): $117.31
// Exención de ISR sobre aguinaldo: 30 UMA (art. 93, fracción XIV LISR)
const UMA_DIARIA_2026 = 117.31
const EXENCION_AGUINALDO = 30 * UMA_DIARIA_2026

function parseISO(str) {
  const [y, m, d] = str.split('-').map(Number)
  return Date.UTC(y, m - 1, d)
}

function daysBetween(startStr, endStr) {
  return Math.round((parseISO(endStr) - parseISO(startStr)) / 86400000) + 1
}

export function calcularAguinaldo({ salarioMensual, diasAguinaldo, fechaIngreso, fechaCorte }) {
  const anioObjetivo = fechaCorte.slice(0, 4)
  const inicioAnio = `${anioObjetivo}-01-01`
  const inicioConteo = fechaIngreso > inicioAnio ? fechaIngreso : inicioAnio

  const diasTrabajadosRaw = daysBetween(inicioConteo, fechaCorte)
  const diasTrabajados = Math.min(Math.max(diasTrabajadosRaw, 0), 365)
  const proporcion = diasTrabajados / 365

  const salarioDiario = salarioMensual / 30
  const aguinaldoBruto = salarioDiario * diasAguinaldo * proporcion

  const montoExento = Math.min(aguinaldoBruto, EXENCION_AGUINALDO)
  const montoGravable = Math.max(0, aguinaldoBruto - EXENCION_AGUINALDO)

  const isrSinAguinaldo = calcularISR({ ingreso: salarioMensual, periodoId: 'mensual', ingresosExentos: 0 }).isrPeriodo
  const isrConAguinaldo = calcularISR({
    ingreso: salarioMensual + montoGravable,
    periodoId: 'mensual',
    ingresosExentos: 0,
  }).isrPeriodo
  const isrSobreAguinaldo = Math.max(0, isrConAguinaldo - isrSinAguinaldo)

  const aguinaldoNeto = aguinaldoBruto - isrSobreAguinaldo

  return {
    anioObjetivo,
    diasTrabajados,
    proporcion,
    salarioDiario,
    aguinaldoBruto,
    montoExento,
    montoGravable,
    isrSobreAguinaldo,
    aguinaldoNeto,
  }
}

function formatMXN(n) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

function defaultFechaCorte() {
  const year = new Date().getFullYear()
  return `${year}-12-31`
}

// ─────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalcularAguinaldo() {
  const [salarioMensual, setSalarioMensual] = useState('')
  const [diasAguinaldo, setDiasAguinaldo] = useState('15')
  const [fechaIngreso, setFechaIngreso] = useState('')
  const [fechaCorte, setFechaCorte] = useState(defaultFechaCorte())

  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function handleCalcular() {
    const salario = parseFloat(salarioMensual)
    if (!salarioMensual || isNaN(salario) || salario <= 0) return setError('Introduce un salario mensual bruto válido.')
    const dias = parseFloat(diasAguinaldo)
    if (!diasAguinaldo || isNaN(dias) || dias <= 0) return setError('Introduce el número de días de aguinaldo.')
    if (!fechaIngreso) return setError('Introduce tu fecha de ingreso a la empresa.')
    if (!fechaCorte) return setError('Introduce la fecha de corte para el cálculo.')
    if (fechaCorte < fechaIngreso) return setError('La fecha de corte no puede ser anterior a tu fecha de ingreso.')

    setError('')
    setResult(calcularAguinaldo({ salarioMensual: salario, diasAguinaldo: dias, fechaIngreso, fechaCorte }))
  }

  const diasMenosDe15 = parseFloat(diasAguinaldo) < 15

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Salario mensual bruto</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              value={salarioMensual}
              onChange={(e) => setSalarioMensual(e.target.value)}
              placeholder="Ej: 15000"
              className={`${inputClass} pl-7`}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Días de aguinaldo</label>
          <input
            type="number"
            inputMode="numeric"
            min="1"
            value={diasAguinaldo}
            onChange={(e) => setDiasAguinaldo(e.target.value)}
            placeholder="15"
            className={inputClass}
          />
          {diasMenosDe15 && (
            <p className="text-xs text-amber-600 mt-1">La Ley Federal del Trabajo exige un mínimo de 15 días.</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Fecha de ingreso a la empresa</label>
          <input type="date" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Fecha de corte del cálculo</label>
          <input type="date" value={fechaCorte} onChange={(e) => setFechaCorte(e.target.value)} className={inputClass} />
          <p className="text-xs text-gray-500 mt-1">Por defecto, el 31 de diciembre de este año. Cámbiala si ya no laboras en la empresa.</p>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleCalcular}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Calcular aguinaldo
      </button>

      {result && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 space-y-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Aguinaldo neto estimado ({result.anioObjetivo})
            </p>
            <p className="text-4xl font-bold text-blue-700 leading-none">{formatMXN(result.aguinaldoNeto)}</p>
          </div>

          {/* Days-worked progress bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>
                {result.diasTrabajados} de 365 días trabajados en {result.anioObjetivo}
              </span>
              <span className="font-semibold text-gray-700">{(result.proporcion * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 rounded-full bg-white border border-blue-100 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${Math.min(result.proporcion * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-blue-100 divide-y divide-gray-100 text-sm">
            <Row label="Aguinaldo bruto" value={result.aguinaldoBruto} bold />
            <Row label={`Parte exenta de ISR (hasta 30 UMA = ${formatMXN(EXENCION_AGUINALDO)})`} value={result.montoExento} />
            <Row label="Parte gravable" value={result.montoGravable} />
            <Row label="ISR estimado sobre la parte gravable" value={-result.isrSobreAguinaldo} />
            <Row label="Aguinaldo neto estimado" value={result.aguinaldoNeto} bold highlight />
          </div>

          <p className="text-xs text-gray-600 bg-white/70 border border-blue-100 rounded-lg px-3 py-2">
            ⚠️ Cálculo <strong>orientativo</strong>. El ISR se estima sumando la parte gravable del aguinaldo a tu
            salario mensual ordinario y comparando la retención resultante, siguiendo la tabla ISR 2026 del SAT. Tu
            recibo de nómina real puede variar según el método exacto que use tu empresa y otras percepciones o
            deducciones del periodo.
          </p>
        </div>
      )}
    </div>
  )
}

function Row({ label, value, bold, highlight }) {
  return (
    <div className={`flex items-center justify-between gap-4 px-4 py-2.5 ${highlight ? 'bg-blue-50' : ''}`}>
      <span className={`text-gray-600 ${bold ? 'font-semibold text-gray-900' : ''}`}>{label}</span>
      <span className={`flex-shrink-0 ${bold ? 'font-bold text-gray-900' : 'text-gray-700'} ${highlight ? 'text-blue-700' : ''}`}>
        {formatMXN(value)}
      </span>
    </div>
  )
}
