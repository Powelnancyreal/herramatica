'use client'

import { useState } from 'react'

// ─────────────────────────────────────────────────────────────────
// Calculation engine (Estatuto de los Trabajadores, España)
// ─────────────────────────────────────────────────────────────────

const FECHA_CORTE_2012 = '2012-02-11' // último día con indemnización de 45 días/año
const FECHA_INICIO_33_DIAS = '2012-02-12'

function parseISO(str) {
  const [y, m, d] = str.split('-').map(Number)
  return Date.UTC(y, m - 1, d)
}

// Inclusive day count between two 'YYYY-MM-DD' dates (both ends count)
function daysBetween(startStr, endStr) {
  const diff = parseISO(endStr) - parseISO(startStr)
  return Math.round(diff / 86400000) + 1
}

export const DISMISSAL_TYPES = [
  {
    id: 'voluntaria',
    label: 'Baja voluntaria',
    diasPorAnio: 0,
    topeMeses: null,
    info: 'La baja voluntaria no genera derecho a indemnización, solo al finiquito (salario pendiente, vacaciones y pagas extra no disfrutadas).',
  },
  {
    id: 'disciplinario_procedente',
    label: 'Despido disciplinario procedente',
    diasPorAnio: 0,
    topeMeses: null,
    info: 'Un despido disciplinario declarado procedente por un juez no genera derecho a indemnización.',
  },
  {
    id: 'fin_temporal',
    label: 'Fin de contrato temporal',
    diasPorAnio: 12,
    topeMeses: null,
    info: '12 días de salario por año trabajado (salvo excepciones legales como los contratos de interinidad, que no generan indemnización).',
  },
  {
    id: 'objetivo',
    label: 'Despido objetivo procedente (causas económicas, técnicas, organizativas o de producción)',
    diasPorAnio: 20,
    topeMeses: 12,
    info: '20 días de salario por año trabajado, con un máximo de 12 mensualidades.',
  },
  {
    id: 'colectivo',
    label: 'Despido colectivo (ERE)',
    diasPorAnio: 20,
    topeMeses: 12,
    info: '20 días de salario por año trabajado, con un máximo de 12 mensualidades, igual que el despido objetivo.',
  },
  {
    id: 'fuerza_mayor',
    label: 'Extinción por fuerza mayor',
    diasPorAnio: 20,
    topeMeses: 12,
    info: '20 días de salario por año trabajado, con un máximo de 12 mensualidades.',
  },
  {
    id: 'improcedente',
    label: 'Despido improcedente',
    diasPorAnio: 33,
    topeMeses: 24,
    info: '33 días de salario por año trabajado desde el 12/02/2012. Si el contrato es anterior a esa fecha, el periodo previo se indemniza a 45 días/año, con un tope conjunto de 42 mensualidades.',
  },
  {
    id: 'art49',
    label: 'Fallecimiento, jubilación o incapacidad del empresario (art. 49.1.g ET)',
    diasPorAnio: null,
    topeMeses: null,
    fixedMonths: 1,
    info: 'Da derecho a una indemnización equivalente a una mensualidad del salario.',
  },
]

export function calcularFiniquito({
  fechaInicio,
  fechaFin,
  salarioMensual,
  numPagasExtra,
  extraProrrateada,
  diasVacacionesPendientes,
  motivoExtincion,
  otrosConceptos,
  irpfPct,
}) {
  const diasTrabajadosTotal = daysBetween(fechaInicio, fechaFin)
  const salarioDiario = salarioMensual / 30

  // 1. Salario pendiente del último mes trabajado
  const [yFin, , dFin] = fechaFin.split('-').map(Number)
  const mismoMes = fechaInicio.slice(0, 7) === fechaFin.slice(0, 7)
  const diasTrabajadosUltimoMes = mismoMes ? diasTrabajadosTotal : dFin
  const salarioPendiente = salarioDiario * diasTrabajadosUltimoMes

  // 2. Vacaciones no disfrutadas
  const vacacionesImporte = salarioDiario * diasVacacionesPendientes

  // 3. Parte proporcional de pagas extra (si no están prorrateadas mes a mes)
  let pagasExtraImporte = 0
  if (!extraProrrateada && numPagasExtra > 0) {
    const inicioAnio = `${yFin}-01-01`
    const inicioDevengo = fechaInicio > inicioAnio ? fechaInicio : inicioAnio
    const diasDevengo = daysBetween(inicioDevengo, fechaFin)
    pagasExtraImporte = ((salarioMensual * numPagasExtra) / 365) * diasDevengo
  }

  // Salario regulador diario (incluye la parte proporcional de pagas extra) para la indemnización
  const salarioAnualBruto = extraProrrateada ? salarioMensual * 12 : salarioMensual * (12 + numPagasExtra)
  const salarioReguladorDiario = salarioAnualBruto / 365
  const mensualidadReferencia = salarioReguladorDiario * 30

  // 4. Indemnización por extinción del contrato
  const tipo = DISMISSAL_TYPES.find((t) => t.id === motivoExtincion) || DISMISSAL_TYPES[0]
  let indemnizacion = 0
  let indemnizacionDetalle = null

  if (tipo.fixedMonths) {
    indemnizacion = mensualidadReferencia * tipo.fixedMonths
  } else if (tipo.id === 'improcedente' && fechaInicio <= FECHA_CORTE_2012) {
    const diasPeriodo1 = daysBetween(fechaInicio, FECHA_CORTE_2012)
    const diasPeriodo2 = daysBetween(FECHA_INICIO_33_DIAS, fechaFin)
    const indemn1 = salarioReguladorDiario * 45 * (diasPeriodo1 / 365)
    const indemn2 = salarioReguladorDiario * 33 * (diasPeriodo2 / 365)
    const bruta = indemn1 + indemn2
    const tope = mensualidadReferencia * 42
    indemnizacionDetalle = { diasPeriodo1, diasPeriodo2, indemn1, indemn2, tope, aplicaTope: bruta > tope }
    indemnizacion = Math.min(bruta, tope)
  } else if (tipo.diasPorAnio > 0) {
    const bruta = salarioReguladorDiario * tipo.diasPorAnio * (diasTrabajadosTotal / 365)
    if (tipo.topeMeses) {
      const tope = mensualidadReferencia * tipo.topeMeses
      indemnizacionDetalle = { tope, aplicaTope: bruta > tope }
      indemnizacion = Math.min(bruta, tope)
    } else {
      indemnizacion = bruta
    }
  }

  const otros = otrosConceptos || 0
  const subtotalSujetoIRPF = salarioPendiente + vacacionesImporte + pagasExtraImporte + otros
  const totalBruto = subtotalSujetoIRPF + indemnizacion
  const retencionIRPF = subtotalSujetoIRPF * ((irpfPct || 0) / 100)
  const totalNeto = totalBruto - retencionIRPF

  return {
    diasTrabajadosTotal,
    salarioDiario,
    salarioPendiente,
    diasTrabajadosUltimoMes,
    vacacionesImporte,
    pagasExtraImporte,
    salarioReguladorDiario,
    mensualidadReferencia,
    indemnizacion,
    indemnizacionDetalle,
    otros,
    subtotalSujetoIRPF,
    totalBruto,
    retencionIRPF,
    totalNeto,
    tipo,
  }
}

function formatEUR(n) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
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

export default function CalculadoraFiniquito() {
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [salarioMensual, setSalarioMensual] = useState('')
  const [numPagasExtra, setNumPagasExtra] = useState('2')
  const [extraProrrateada, setExtraProrrateada] = useState(false)
  const [diasVacacionesPendientes, setDiasVacacionesPendientes] = useState('0')
  const [motivoExtincion, setMotivoExtincion] = useState('voluntaria')
  const [otrosConceptos, setOtrosConceptos] = useState('0')
  const [irpfPct, setIrpfPct] = useState('2')

  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function handleCalcular() {
    if (!fechaInicio || !fechaFin) return setError('Introduce la fecha de inicio y la fecha de fin del contrato.')
    if (fechaFin < fechaInicio) return setError('La fecha de fin no puede ser anterior a la fecha de inicio.')
    const salario = parseFloat(salarioMensual)
    if (!salarioMensual || isNaN(salario) || salario <= 0) return setError('Introduce un salario bruto mensual válido.')
    const vacaciones = parseFloat(diasVacacionesPendientes) || 0
    if (vacaciones < 0) return setError('Los días de vacaciones pendientes no pueden ser negativos.')
    const otros = parseFloat(otrosConceptos) || 0
    if (otros < 0) return setError('Otros conceptos pendientes no pueden ser negativos.')
    const irpf = parseFloat(irpfPct)
    if (isNaN(irpf) || irpf < 0 || irpf > 100) return setError('Introduce un porcentaje de retención IRPF válido (0-100).')

    setError('')
    setResult(
      calcularFiniquito({
        fechaInicio,
        fechaFin,
        salarioMensual: salario,
        numPagasExtra: parseInt(numPagasExtra, 10),
        extraProrrateada,
        diasVacacionesPendientes: vacaciones,
        motivoExtincion,
        otrosConceptos: otros,
        irpfPct: irpf,
      })
    )
  }

  return (
    <div className="space-y-6">
      {/* Datos del contrato */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Datos del contrato</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Fecha de inicio del contrato</label>
            <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Fecha de fin (último día trabajado)</label>
            <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Salario bruto mensual (€)</label>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              value={salarioMensual}
              onChange={(e) => setSalarioMensual(e.target.value)}
              placeholder="Ej: 1800"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Número de pagas extra al año</label>
            <select value={numPagasExtra} onChange={(e) => setNumPagasExtra(e.target.value)} className={inputClass}>
              <option value="0">0 (salario ya incluye todo)</option>
              <option value="1">1</option>
              <option value="2">2 (lo habitual: verano y Navidad)</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700 mt-3">
          <input
            type="checkbox"
            checked={extraProrrateada}
            onChange={(e) => setExtraProrrateada(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Mi salario ya incluye las pagas extra prorrateadas cada mes
        </label>
      </div>

      {/* Vacaciones */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Vacaciones</h3>
        <div>
          <label className={labelClass}>Días de vacaciones pendientes de disfrutar</label>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            value={diasVacacionesPendientes}
            onChange={(e) => setDiasVacacionesPendientes(e.target.value)}
            placeholder="Ej: 8"
            className={inputClass}
          />
        </div>
      </div>

      {/* Extinción */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Motivo de extinción del contrato</h3>
        <select value={motivoExtincion} onChange={(e) => setMotivoExtincion(e.target.value)} className={inputClass}>
          {DISMISSAL_TYPES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-2">
          {DISMISSAL_TYPES.find((t) => t.id === motivoExtincion)?.info}
        </p>
      </div>

      {/* Otros conceptos */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Otros conceptos (opcional)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Otros importes pendientes (horas extra, incentivos...)</label>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              value={otrosConceptos}
              onChange={(e) => setOtrosConceptos(e.target.value)}
              placeholder="0"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>% Retención IRPF estimada</label>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              max="100"
              value={irpfPct}
              onChange={(e) => setIrpfPct(e.target.value)}
              placeholder="2"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleCalcular}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Calcular finiquito
      </button>

      {/* Result */}
      {result && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 space-y-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total neto estimado</p>
            <p className="text-4xl font-bold text-blue-700 leading-none">{formatEUR(result.totalNeto)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {result.diasTrabajadosTotal} días trabajados en total · Total bruto: {formatEUR(result.totalBruto)}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-blue-100 divide-y divide-gray-100 text-sm">
            <Row label={`Salario pendiente (${result.diasTrabajadosUltimoMes} días del último mes)`} value={result.salarioPendiente} />
            <Row label="Vacaciones no disfrutadas" value={result.vacacionesImporte} />
            <Row label="Parte proporcional de pagas extra" value={result.pagasExtraImporte} />
            {result.otros > 0 && <Row label="Otros conceptos pendientes" value={result.otros} />}
            <Row label="Subtotal (sujeto a retención IRPF)" value={result.subtotalSujetoIRPF} bold />
            <Row label="Indemnización por extinción (exenta de IRPF hasta 180.000 €)" value={result.indemnizacion} />
            <Row label="Total bruto" value={result.totalBruto} bold />
            <Row label={`Retención IRPF estimada (${irpfPct}%)`} value={-result.retencionIRPF} />
            <Row label="Total neto estimado" value={result.totalNeto} bold highlight />
          </div>

          {result.indemnizacionDetalle?.aplicaTope && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              ⓘ La indemnización calculada supera el tope legal para este tipo de extinción, por lo que se ha aplicado el máximo permitido.
            </p>
          )}

          <p className="text-xs text-gray-600 bg-white/70 border border-blue-100 rounded-lg px-3 py-2">
            ⚠️ Este resultado es una <strong>estimación orientativa</strong> basada en el Estatuto de los Trabajadores y no
            sustituye el asesoramiento de un graduado social o abogado laboralista. Tu convenio colectivo puede establecer
            condiciones distintas (más días de vacaciones, indemnizaciones superiores, etc.).
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
        {formatEUR(value)}
      </span>
    </div>
  )
}
