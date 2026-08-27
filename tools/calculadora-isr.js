'use client'

import { useState } from 'react'

// ─────────────────────────────────────────────────────────────────
// Tabla ISR mensual 2026 (Anexo 8 de la Resolución Miscelánea Fiscal 2026, SAT México)
// Todos los demás periodos se derivan de esta tabla mediante el método
// de elevar al mes (procedimiento admitido por el Art. 96 de la LISR).
// ─────────────────────────────────────────────────────────────────

const TABLA_ISR_MENSUAL = [
  { limiteInferior: 0.01, limiteSuperior: 844.59, cuotaFija: 0.0, porcentaje: 1.92 },
  { limiteInferior: 844.6, limiteSuperior: 7168.51, cuotaFija: 16.22, porcentaje: 6.4 },
  { limiteInferior: 7168.52, limiteSuperior: 12598.02, cuotaFija: 420.95, porcentaje: 10.88 },
  { limiteInferior: 12598.03, limiteSuperior: 14644.64, cuotaFija: 1011.68, porcentaje: 16.0 },
  { limiteInferior: 14644.65, limiteSuperior: 17533.64, cuotaFija: 1339.14, porcentaje: 17.92 },
  { limiteInferior: 17533.65, limiteSuperior: 35362.83, cuotaFija: 1856.84, porcentaje: 21.36 },
  { limiteInferior: 35362.84, limiteSuperior: 55736.68, cuotaFija: 5665.16, porcentaje: 23.52 },
  { limiteInferior: 55736.69, limiteSuperior: 106410.5, cuotaFija: 10457.09, porcentaje: 30.0 },
  { limiteInferior: 106410.51, limiteSuperior: 141880.66, cuotaFija: 25659.23, porcentaje: 32.0 },
  { limiteInferior: 141880.67, limiteSuperior: 425641.99, cuotaFija: 37009.69, porcentaje: 34.0 },
  { limiteInferior: 425642.0, limiteSuperior: Infinity, cuotaFija: 133488.54, porcentaje: 35.0 },
]

// Subsidio para el empleo 2026 (Decreto DOF): monto fijo mensual $536.22
// para quien no exceda el límite mensual de ingresos de $11,492.66 (vigente feb-dic 2026)
const SUBSIDIO_MENSUAL = 536.22
const LIMITE_SUBSIDIO_MENSUAL = 11492.66

export const PERIODOS = [
  { id: 'diario', label: 'Diario', factor: 1 / 30.4 },
  { id: 'semanal', label: 'Semanal', factor: 7 / 30.4 },
  { id: 'quincenal', label: 'Quincenal', factor: 15 / 30.4 },
  { id: 'mensual', label: 'Mensual', factor: 1 },
  { id: 'anual', label: 'Anual', factor: 12 },
]

function buscarRango(ingresoMensual) {
  return TABLA_ISR_MENSUAL.find((r) => ingresoMensual >= r.limiteInferior && ingresoMensual <= r.limiteSuperior)
}

export function calcularISR({ ingreso, periodoId, ingresosExentos }) {
  const periodo = PERIODOS.find((p) => p.id === periodoId) || PERIODOS[3]
  const exento = ingresosExentos || 0
  const baseGravable = Math.max(0, ingreso - exento)

  // Elevar al mes: convertir el ingreso del periodo a su equivalente mensual
  const ingresoMensual = baseGravable / periodo.factor

  const rango = buscarRango(ingresoMensual)
  const excedente = ingresoMensual - rango.limiteInferior
  const impuestoMarginal = excedente * (rango.porcentaje / 100)
  const isrAntesSubsidio = rango.cuotaFija + impuestoMarginal

  const aplicaSubsidio = ingresoMensual <= LIMITE_SUBSIDIO_MENSUAL
  const subsidioMensual = aplicaSubsidio ? SUBSIDIO_MENSUAL : 0

  const isrMensualFinal = Math.max(0, isrAntesSubsidio - subsidioMensual)

  // Volver a expresar el ISR en el periodo original
  const isrPeriodo = isrMensualFinal * periodo.factor
  const subsidioPeriodo = subsidioMensual * periodo.factor

  const sueldoNeto = ingreso - isrPeriodo

  return {
    periodo,
    baseGravable,
    ingresoMensual,
    rango,
    excedente,
    impuestoMarginal,
    isrAntesSubsidio,
    aplicaSubsidio,
    subsidioMensual,
    subsidioPeriodo,
    isrMensualFinal,
    isrPeriodo,
    sueldoNeto,
    tasaEfectiva: ingreso > 0 ? (isrPeriodo / ingreso) * 100 : 0,
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

// ─────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalculadoraISR() {
  const [ingreso, setIngreso] = useState('')
  const [periodoId, setPeriodoId] = useState('mensual')
  const [ingresosExentos, setIngresosExentos] = useState('0')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function handleCalcular() {
    const ing = parseFloat(ingreso)
    if (!ingreso || isNaN(ing) || ing <= 0) return setError('Introduce un ingreso válido mayor que 0.')
    const exento = parseFloat(ingresosExentos) || 0
    if (exento < 0) return setError('Los ingresos exentos no pueden ser negativos.')
    if (exento >= ing) return setError('Los ingresos exentos no pueden ser mayores o iguales al ingreso total.')

    setError('')
    setResult(calcularISR({ ingreso: ing, periodoId, ingresosExentos: exento }))
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Ingreso bruto</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              value={ingreso}
              onChange={(e) => setIngreso(e.target.value)}
              placeholder="Ej: 15000"
              className={`${inputClass} pl-7`}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Periodo de pago</label>
          <select value={periodoId} onChange={(e) => setPeriodoId(e.target.value)} className={inputClass}>
            {PERIODOS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Ingresos exentos de ISR en este periodo (opcional)</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            value={ingresosExentos}
            onChange={(e) => setIngresosExentos(e.target.value)}
            placeholder="0"
            className={`${inputClass} pl-7`}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Por ejemplo, la parte exenta del aguinaldo, la prima vacacional o el fondo de ahorro, si aplica.
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleCalcular}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Calcular ISR
      </button>

      {result && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 space-y-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              ISR a retener ({result.periodo.label.toLowerCase()})
            </p>
            <p className="text-4xl font-bold text-blue-700 leading-none">{formatMXN(result.isrPeriodo)}</p>
            <p className="text-xs text-gray-500 mt-1">Tasa efectiva: {result.tasaEfectiva.toFixed(2)}%</p>
          </div>

          <div className="bg-white rounded-lg border border-blue-100 divide-y divide-gray-100 text-sm">
            {result.periodo.id !== 'mensual' && (
              <Row label="Ingreso mensual equivalente (elevado al mes)" value={result.ingresoMensual} />
            )}
            <Row label={`Rango aplicable: ${result.rango.porcentaje}% sobre excedente de ${formatMXN(result.rango.limiteInferior)}`} value={null} />
            <Row label="Cuota fija del rango" value={result.rango.cuotaFija} monthly={result.periodo.id !== 'mensual'} />
            <Row label="Impuesto marginal (excedente × %)" value={result.impuestoMarginal} monthly={result.periodo.id !== 'mensual'} />
            <Row label="ISR antes de subsidio" value={result.isrAntesSubsidio} monthly={result.periodo.id !== 'mensual'} bold />
            <Row
              label={result.aplicaSubsidio ? 'Subsidio al empleo aplicado' : 'Subsidio al empleo (no aplica, ingreso superior al límite)'}
              value={-result.subsidioPeriodo}
            />
            <Row label="ISR a retener" value={result.isrPeriodo} bold highlight />
            <Row label="Sueldo neto estimado" value={result.sueldoNeto} bold />
          </div>

          <p className="text-xs text-gray-600 bg-white/70 border border-blue-100 rounded-lg px-3 py-2">
            ⚠️ Cálculo <strong>orientativo</strong> basado en la tabla ISR mensual 2026 del SAT y el subsidio al empleo
            vigente. Los periodos distintos al mensual se calculan elevando el ingreso al mes (Art. 96 LISR) y no
            sustituyen el recibo de nómina oficial, que puede incluir otras percepciones, deducciones o el cálculo
            de IMSS.
          </p>
        </div>
      )}
    </div>
  )
}

function Row({ label, value, bold, highlight, monthly }) {
  return (
    <div className={`flex items-center justify-between gap-4 px-4 py-2.5 ${highlight ? 'bg-blue-50' : ''}`}>
      <span className={`text-gray-600 ${bold ? 'font-semibold text-gray-900' : ''}`}>{label}</span>
      {value !== null && (
        <span className={`flex-shrink-0 ${bold ? 'font-bold text-gray-900' : 'text-gray-700'} ${highlight ? 'text-blue-700' : ''}`}>
          {formatMXN(value)}
          {monthly && <span className="text-gray-400 font-normal"> /mes</span>}
        </span>
      )}
    </div>
  )
}
