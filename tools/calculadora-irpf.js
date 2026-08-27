'use client'

import { useState } from 'react'

// ─────────────────────────────────────────────────────────────────
// Motor de cálculo IRPF España 2026 (Ley 35/2006 y modificaciones)
// Escala general estatal (Art. 63 LIRPF), sin cambios respecto a 2025.
// Se aproxima la cuota autonómica duplicando la cuota estatal, ya que
// cada Comunidad Autónoma fija su propia escala (17 tablas distintas);
// esta calculadora lo señala explícitamente como una estimación.
// ─────────────────────────────────────────────────────────────────

const ESCALA_ESTATAL = [
  { hasta: 12450, tipo: 0.095 },
  { hasta: 20200, tipo: 0.12 },
  { hasta: 35200, tipo: 0.15 },
  { hasta: 60000, tipo: 0.185 },
  { hasta: 300000, tipo: 0.225 },
  { hasta: Infinity, tipo: 0.245 },
]

// Cotización a la Seguridad Social del trabajador 2026 (contrato indefinido):
// contingencias comunes 4.70% + desempleo 1.55% + formación profesional 0.10% + MEI 0.15%
const TIPO_SS_TRABAJADOR = 0.065
const BASE_MAXIMA_SS_MENSUAL = 5101.2
const BASE_MAXIMA_SS_ANUAL = BASE_MAXIMA_SS_MENSUAL * 12

const GASTOS_OTROS_ART19 = 2000

function aplicarEscala(base) {
  if (base <= 0) return 0
  let cuota = 0
  let anterior = 0
  for (const tramo of ESCALA_ESTATAL) {
    if (base <= anterior) break
    const enEsteTramo = Math.min(base, tramo.hasta) - anterior
    cuota += enEsteTramo * tramo.tipo
    anterior = tramo.hasta
  }
  return cuota
}

function reduccionArt20(rendimientoNeto) {
  if (rendimientoNeto <= 14852) return 7302
  if (rendimientoNeto <= 17673.52) return Math.max(0, 7302 - 1.75 * (rendimientoNeto - 14852))
  if (rendimientoNeto <= 19747.5) return Math.max(0, 2364.34 - 1.14 * (rendimientoNeto - 17673.52))
  return 0
}

function minimoPersonal(edad) {
  if (edad >= 75) return 8100
  if (edad >= 65) return 6700
  return 5550
}

const MINIMO_DESCENDIENTE = [2400, 2700, 4000, 4500] // 1º, 2º, 3º, 4º y siguientes
const INCREMENTO_MENOR_3 = 2800

function minimoDescendientes(numHijos, numMenoresDe3) {
  let total = 0
  for (let i = 0; i < numHijos; i++) {
    total += MINIMO_DESCENDIENTE[Math.min(i, 3)]
  }
  total += Math.min(numMenoresDe3, numHijos) * INCREMENTO_MENOR_3
  return total
}

export function calcularIRPF({ salarioBruto, edad, numHijos, numMenoresDe3 }) {
  const baseCotizacionSS = Math.min(salarioBruto, BASE_MAXIMA_SS_ANUAL)
  const cotizacionSS = baseCotizacionSS * TIPO_SS_TRABAJADOR

  const rendimientoIntegro = salarioBruto
  const gastosDeducibles = cotizacionSS + GASTOS_OTROS_ART19
  const rendimientoNeto = Math.max(0, rendimientoIntegro - gastosDeducibles)

  const reduccion = reduccionArt20(rendimientoNeto)
  const rendimientoNetoReducido = Math.max(0, rendimientoNeto - reduccion)

  const baseLiquidableGeneral = rendimientoNetoReducido

  const minPersonal = minimoPersonal(edad)
  const minDescendientes = minimoDescendientes(numHijos, numMenoresDe3)
  const minimoTotal = minPersonal + minDescendientes

  const cuotaSobreBase = aplicarEscala(baseLiquidableGeneral)
  const cuotaSobreMinimo = aplicarEscala(Math.min(minimoTotal, baseLiquidableGeneral))
  const cuotaEstatal = Math.max(0, cuotaSobreBase - cuotaSobreMinimo)

  // Aproximación: la cuota autonómica se estima igual a la estatal (ver nota de la calculadora)
  const cuotaAutonomicaEstimada = cuotaEstatal
  const cuotaIntegraTotal = cuotaEstatal + cuotaAutonomicaEstimada

  const irpfAnual = cuotaIntegraTotal
  const netoAnual = salarioBruto - cotizacionSS - irpfAnual
  const tasaEfectiva = salarioBruto > 0 ? (irpfAnual / salarioBruto) * 100 : 0

  return {
    cotizacionSS,
    rendimientoIntegro,
    gastosDeducibles,
    rendimientoNeto,
    reduccion,
    baseLiquidableGeneral,
    minPersonal,
    minDescendientes,
    minimoTotal,
    cuotaEstatal,
    cuotaAutonomicaEstimada,
    irpfAnual,
    netoAnual,
    tasaEfectiva,
  }
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

export default function CalculadoraIRPF() {
  const [salarioBruto, setSalarioBruto] = useState('')
  const [edad, setEdad] = useState('30')
  const [numHijos, setNumHijos] = useState('0')
  const [numMenoresDe3, setNumMenoresDe3] = useState('0')
  const [pagas, setPagas] = useState('14')

  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function handleCalcular() {
    const salario = parseFloat(salarioBruto)
    if (!salarioBruto || isNaN(salario) || salario <= 0) return setError('Introduce un salario bruto anual válido.')
    const e = parseInt(edad, 10)
    if (!edad || isNaN(e) || e < 16 || e > 100) return setError('Introduce una edad válida.')
    const hijos = parseInt(numHijos, 10) || 0
    const menores3 = parseInt(numMenoresDe3, 10) || 0
    if (menores3 > hijos) return setError('El número de hijos menores de 3 años no puede superar el número total de hijos.')

    setError('')
    setResult(calcularIRPF({ salarioBruto: salario, edad: e, numHijos: hijos, numMenoresDe3: menores3 }))
  }

  const numPagas = parseInt(pagas, 10)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Salario bruto anual</label>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              min="0"
              value={salarioBruto}
              onChange={(e) => setSalarioBruto(e.target.value)}
              placeholder="Ej: 30000"
              className={`${inputClass} pr-10`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
          </div>
        </div>
        <div>
          <label className={labelClass}>Edad</label>
          <input type="number" inputMode="numeric" min="16" max="100" value={edad} onChange={(e) => setEdad(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Hijos a cargo</label>
          <input type="number" inputMode="numeric" min="0" value={numHijos} onChange={(e) => setNumHijos(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>De ellos, menores de 3 años</label>
          <input type="number" inputMode="numeric" min="0" value={numMenoresDe3} onChange={(e) => setNumMenoresDe3(e.target.value)} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Número de pagas</label>
          <select value={pagas} onChange={(e) => setPagas(e.target.value)} className={inputClass}>
            <option value="14">14 pagas (12 + 2 extra)</option>
            <option value="12">12 pagas (extras prorrateadas)</option>
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleCalcular}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Calcular IRPF
      </button>

      {result && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 space-y-4">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Salario neto estimado</p>
            <p className="text-4xl font-bold text-blue-700 leading-none">{formatEUR(result.netoAnual)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {formatEUR(result.netoAnual / numPagas)} por paga ({numPagas} pagas) · Tasa efectiva de IRPF: {result.tasaEfectiva.toFixed(2)}%
            </p>
          </div>

          <div className="bg-white rounded-lg border border-blue-100 divide-y divide-gray-100 text-sm">
            <Row label="Salario bruto anual" value={parseFloat(salarioBruto)} bold />
            <Row label="Cotización a la Seguridad Social (6,50%)" value={-result.cotizacionSS} />
            <Row label="Gastos deducibles (SS + 2.000 € genéricos)" value={null} note={formatEUR(result.gastosDeducibles)} />
            <Row label="Rendimiento neto del trabajo" value={null} note={formatEUR(result.rendimientoNeto)} />
            <Row label="Reducción por rendimientos del trabajo (Art. 20 LIRPF)" value={null} note={formatEUR(result.reduccion)} />
            <Row label="Base liquidable general" value={null} note={formatEUR(result.baseLiquidableGeneral)} />
            <Row label="Mínimo personal y familiar" value={null} note={formatEUR(result.minimoTotal)} />
            <Row label="Cuota estatal" value={null} note={formatEUR(result.cuotaEstatal)} />
            <Row label="Cuota autonómica (estimada)" value={null} note={formatEUR(result.cuotaAutonomicaEstimada)} />
            <Row label="IRPF anual estimado" value={-result.irpfAnual} bold highlight />
            <Row label="Salario neto anual estimado" value={result.netoAnual} bold />
          </div>

          <p className="text-xs text-gray-600 bg-white/70 border border-blue-100 rounded-lg px-3 py-2">
            ⚠️ <strong>Estimación orientativa.</strong> La cuota autonómica se aproxima duplicando la cuota estatal, ya
            que cada Comunidad Autónoma aplica su propia escala (hasta 17 tablas distintas): tu resultado real puede
            variar varios puntos porcentuales según dónde resides. No incluye deducciones autonómicas, aportaciones a
            planes de pensiones, tributación conjunta ni otras rentas. Consulta siempre a un asesor fiscal o la
            Agencia Tributaria para tu declaración oficial.
          </p>
        </div>
      )}
    </div>
  )
}

function Row({ label, value, note, bold, highlight }) {
  return (
    <div className={`flex items-center justify-between gap-4 px-4 py-2.5 ${highlight ? 'bg-blue-50' : ''}`}>
      <span className={`text-gray-600 ${bold ? 'font-semibold text-gray-900' : ''}`}>{label}</span>
      <span className={`flex-shrink-0 ${bold ? 'font-bold text-gray-900' : 'text-gray-700'} ${highlight ? 'text-blue-700' : ''}`}>
        {value !== null ? formatEUR(value) : note}
      </span>
    </div>
  )
}
