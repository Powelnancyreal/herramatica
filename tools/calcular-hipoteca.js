'use client'

import { useState } from 'react'

// ─────────────────────────────────────────────────────────────────
// Motor de cálculo de hipoteca (sistema de amortización francés,
// con soporte para tipo fijo, variable y mixto multi-fase)
// ─────────────────────────────────────────────────────────────────

function cuotaFrancesa(capital, tasaAnualPct, mesesRestantes) {
  const r = tasaAnualPct / 100 / 12
  if (r === 0) return capital / mesesRestantes
  return (capital * r * Math.pow(1 + r, mesesRestantes)) / (Math.pow(1 + r, mesesRestantes) - 1)
}

// fases: [{ meses, tasaAnualPct, nombre }] — cubren el plazo total en orden
export function generarAmortizacion(capitalInicial, fases) {
  const plazoTotalMeses = fases.reduce((acc, f) => acc + f.meses, 0)
  let saldo = capitalInicial
  let mesGlobal = 0
  const tabla = []
  const resumenFases = []

  for (const fase of fases) {
    const mesesRestantesTotales = plazoTotalMeses - mesGlobal
    const cuotaFase = cuotaFrancesa(saldo, fase.tasaAnualPct, mesesRestantesTotales)
    resumenFases.push({ nombre: fase.nombre, tasaAnualPct: fase.tasaAnualPct, cuota: cuotaFase, meses: fase.meses })

    for (let i = 0; i < fase.meses; i++) {
      mesGlobal++
      const r = fase.tasaAnualPct / 100 / 12
      const interes = saldo * r
      let capitalPago = cuotaFase - interes
      if (mesGlobal === plazoTotalMeses) capitalPago = saldo
      saldo = Math.max(0, saldo - capitalPago)
      tabla.push({ mes: mesGlobal, fase: fase.nombre, cuota: capitalPago + interes, capital: capitalPago, interes, saldo })
    }
  }

  const totalPagado = tabla.reduce((acc, r) => acc + r.cuota, 0)
  const totalIntereses = totalPagado - capitalInicial

  return { tabla, resumenFases, totalPagado, totalIntereses, plazoTotalMeses }
}

export function estimarGastosCompra({ precioVivienda, esNueva }) {
  const tasacion = 300
  const gastosCompraventa = esNueva ? precioVivienda * 0.11 : precioVivienda * 0.08 + 1000
  return { tasacion, gastosCompraventa, total: tasacion + gastosCompraventa }
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

export default function CalcularHipoteca() {
  const [precioVivienda, setPrecioVivienda] = useState('')
  const [entrada, setEntrada] = useState('')
  const [plazoAnios, setPlazoAnios] = useState('30')
  const [tipoHipoteca, setTipoHipoteca] = useState('fijo')
  const [tinFijo, setTinFijo] = useState('')
  const [euribor, setEuribor] = useState('2.8')
  const [diferencial, setDiferencial] = useState('1')
  const [aniosFijosMixta, setAniosFijosMixta] = useState('5')
  const [tinFijoMixta, setTinFijoMixta] = useState('')
  const [esNueva, setEsNueva] = useState(false)
  const [ingresosMensuales, setIngresosMensuales] = useState('')

  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [mostrarTabla, setMostrarTabla] = useState(false)

  function handleCalcular() {
    const precio = parseFloat(precioVivienda)
    const ahorro = parseFloat(entrada)
    const plazo = parseInt(plazoAnios, 10)
    if (!precioVivienda || isNaN(precio) || precio <= 0) return setError('Introduce el precio de la vivienda.')
    if (!entrada || isNaN(ahorro) || ahorro < 0) return setError('Introduce el importe de entrada disponible.')
    if (ahorro >= precio) return setError('La entrada no puede ser igual o mayor que el precio de la vivienda.')
    if (!plazoAnios || isNaN(plazo) || plazo <= 0) return setError('Introduce un plazo válido en años.')

    const capital = precio - ahorro
    const plazoMeses = plazo * 12
    let fases = []

    if (tipoHipoteca === 'fijo') {
      const tin = parseFloat(tinFijo)
      if (tinFijo === '' || isNaN(tin) || tin < 0) return setError('Introduce el TIN fijo.')
      fases = [{ nombre: 'Fijo', meses: plazoMeses, tasaAnualPct: tin }]
    } else if (tipoHipoteca === 'variable') {
      const eur = parseFloat(euribor)
      const dif = parseFloat(diferencial)
      if (isNaN(eur) || isNaN(dif)) return setError('Introduce el euríbor y el diferencial.')
      fases = [{ nombre: 'Variable', meses: plazoMeses, tasaAnualPct: eur + dif }]
    } else {
      const aniosFijos = parseInt(aniosFijosMixta, 10)
      const tinM = parseFloat(tinFijoMixta)
      const eur = parseFloat(euribor)
      const dif = parseFloat(diferencial)
      if (!aniosFijosMixta || isNaN(aniosFijos) || aniosFijos <= 0 || aniosFijos >= plazo) {
        return setError('Los años a tipo fijo deben ser menores que el plazo total.')
      }
      if (isNaN(tinM) || isNaN(eur) || isNaN(dif)) return setError('Completa el TIN fijo inicial, el euríbor y el diferencial.')
      const mesesFijos = aniosFijos * 12
      fases = [
        { nombre: `Fijo (${aniosFijos} años)`, meses: mesesFijos, tasaAnualPct: tinM },
        { nombre: 'Variable (resto)', meses: plazoMeses - mesesFijos, tasaAnualPct: eur + dif },
      ]
    }

    setError('')
    setMostrarTabla(false)
    const amortizacion = generarAmortizacion(capital, fases)
    const gastos = estimarGastosCompra({ precioVivienda: precio, esNueva })
    const porcentajeFinanciado = (capital / precio) * 100
    const ingresos = parseFloat(ingresosMensuales)
    const esfuerzo = !isNaN(ingresos) && ingresos > 0 ? (amortizacion.resumenFases[0].cuota / ingresos) * 100 : null

    setResult({ capital, precio, amortizacion, gastos, porcentajeFinanciado, esfuerzo, ahorroTotalNecesario: ahorro + gastos.total })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Precio de la vivienda</label>
          <div className="relative">
            <input type="number" inputMode="decimal" min="0" value={precioVivienda} onChange={(e) => setPrecioVivienda(e.target.value)} placeholder="Ej: 200000" className={`${inputClass} pr-8`} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
          </div>
        </div>
        <div>
          <label className={labelClass}>Entrada (ahorro disponible)</label>
          <div className="relative">
            <input type="number" inputMode="decimal" min="0" value={entrada} onChange={(e) => setEntrada(e.target.value)} placeholder="Ej: 40000" className={`${inputClass} pr-8`} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
          </div>
        </div>
        <div>
          <label className={labelClass}>Plazo (años)</label>
          <input type="number" inputMode="numeric" min="1" max="40" value={plazoAnios} onChange={(e) => setPlazoAnios(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Ingresos netos mensuales (opcional)</label>
          <div className="relative">
            <input type="number" inputMode="decimal" min="0" value={ingresosMensuales} onChange={(e) => setIngresosMensuales(e.target.value)} placeholder="Ej: 2200" className={`${inputClass} pr-8`} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
          </div>
        </div>
      </div>

      <div>
        <label className={labelClass}>Tipo de hipoteca</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'fijo', label: 'Fija' },
            { id: 'variable', label: 'Variable' },
            { id: 'mixta', label: 'Mixta' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTipoHipoteca(t.id)}
              className={`py-2 rounded-lg text-sm font-semibold transition-all ${tipoHipoteca === t.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tipoHipoteca === 'fijo' && (
        <div>
          <label className={labelClass}>TIN fijo</label>
          <div className="relative">
            <input type="number" inputMode="decimal" step="0.01" value={tinFijo} onChange={(e) => setTinFijo(e.target.value)} placeholder="Ej: 3.2" className={`${inputClass} pr-8`} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
          </div>
        </div>
      )}

      {tipoHipoteca === 'variable' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Euríbor actual</label>
            <div className="relative">
              <input type="number" inputMode="decimal" step="0.01" value={euribor} onChange={(e) => setEuribor(e.target.value)} className={`${inputClass} pr-8`} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
            </div>
          </div>
          <div>
            <label className={labelClass}>Diferencial</label>
            <div className="relative">
              <input type="number" inputMode="decimal" step="0.01" value={diferencial} onChange={(e) => setDiferencial(e.target.value)} placeholder="Ej: 1" className={`${inputClass} pr-8`} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
            </div>
          </div>
        </div>
      )}

      {tipoHipoteca === 'mixta' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Años a tipo fijo</label>
            <input type="number" inputMode="numeric" min="1" value={aniosFijosMixta} onChange={(e) => setAniosFijosMixta(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>TIN fijo (primeros años)</label>
            <div className="relative">
              <input type="number" inputMode="decimal" step="0.01" value={tinFijoMixta} onChange={(e) => setTinFijoMixta(e.target.value)} placeholder="Ej: 2.5" className={`${inputClass} pr-8`} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
            </div>
          </div>
          <div>
            <label className={labelClass}>Euríbor (después)</label>
            <div className="relative">
              <input type="number" inputMode="decimal" step="0.01" value={euribor} onChange={(e) => setEuribor(e.target.value)} className={`${inputClass} pr-8`} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
            </div>
          </div>
          <div>
            <label className={labelClass}>Diferencial (después)</label>
            <div className="relative">
              <input type="number" inputMode="decimal" step="0.01" value={diferencial} onChange={(e) => setDiferencial(e.target.value)} placeholder="Ej: 1" className={`${inputClass} pr-8`} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
            </div>
          </div>
        </div>
      )}

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={esNueva} onChange={(e) => setEsNueva(e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
        La vivienda es de obra nueva (si no, se estima como de segunda mano)
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleCalcular}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Calcular hipoteca
      </button>

      {result && (
        <div className="space-y-4">
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Cuota mensual{result.amortizacion.resumenFases.length > 1 ? ' (fase inicial)' : ''}
            </p>
            <p className="text-4xl font-bold text-blue-700 leading-none mb-4">{formatEUR(result.amortizacion.resumenFases[0].cuota)}</p>

            {result.amortizacion.resumenFases.length > 1 && (
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                {result.amortizacion.resumenFases.map((f, i) => (
                  <div key={i} className="bg-white rounded-lg px-3 py-2 border border-blue-100">
                    <p className="text-gray-500">{f.nombre} ({f.tasaAnualPct.toFixed(2)}%)</p>
                    <p className="font-semibold text-gray-900">{formatEUR(f.cuota)}/mes</p>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white rounded-lg px-3 py-2 border border-blue-100">
                <p className="text-gray-500">Importe financiado</p>
                <p className="font-semibold text-gray-900">
                  {formatEUR(result.capital)} ({result.porcentajeFinanciado.toFixed(1)}%)
                </p>
              </div>
              <div className="bg-white rounded-lg px-3 py-2 border border-blue-100">
                <p className="text-gray-500">Total de intereses</p>
                <p className="font-semibold text-gray-900">{formatEUR(result.amortizacion.totalIntereses)}</p>
              </div>
            </div>

            {result.porcentajeFinanciado > 80 && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3">
                ⓘ Estás financiando más del 80% del precio de la vivienda. La mayoría de bancos en España limitan la
                financiación al 80% (o al 100% en viviendas propiedad del propio banco), por lo que podrías necesitar
                una entrada mayor.
              </p>
            )}

            {result.esfuerzo !== null && (
              <p
                className={`text-xs rounded-lg px-3 py-2 mt-3 border ${
                  result.esfuerzo <= 30 ? 'text-green-700 bg-green-50 border-green-200' : result.esfuerzo <= 40 ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-red-700 bg-red-50 border-red-200'
                }`}
              >
                Esfuerzo hipotecario: <strong>{result.esfuerzo.toFixed(1)}%</strong> de tus ingresos netos mensuales
                {result.esfuerzo > 35 && ' — por encima del 35% recomendado por los bancos'}
              </p>
            )}
          </div>

          <div className="rounded-xl border-2 border-gray-200 bg-white p-5">
            <p className="text-sm font-semibold text-gray-900 mb-3">¿Cuánto necesitas ahorrado en total?</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Entrada</span>
                <span className="font-medium text-gray-900">{formatEUR(parseFloat(entrada))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tasación (estimado)</span>
                <span className="font-medium text-gray-900">{formatEUR(result.gastos.tasacion)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Impuestos y gastos de compraventa (estimado)</span>
                <span className="font-medium text-gray-900">{formatEUR(result.gastos.gastosCompraventa)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2 font-semibold">
                <span className="text-gray-900">Total ahorro necesario</span>
                <span className="text-blue-700">{formatEUR(result.ahorroTotalNecesario)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setMostrarTabla((s) => !s)}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            {mostrarTabla ? 'Ocultar tabla de amortización' : 'Ver tabla de amortización completa'}
          </button>

          {mostrarTabla && (
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-sm min-w-[520px]">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <tr>
                    <th className="px-3 py-2 text-left">Mes</th>
                    <th className="px-3 py-2 text-left">Fase</th>
                    <th className="px-3 py-2 text-right">Cuota</th>
                    <th className="px-3 py-2 text-right">Capital</th>
                    <th className="px-3 py-2 text-right">Interés</th>
                    <th className="px-3 py-2 text-right">Saldo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {result.amortizacion.tabla.map((row) => (
                    <tr key={row.mes}>
                      <td className="px-3 py-2 text-gray-600">{row.mes}</td>
                      <td className="px-3 py-2 text-gray-500 text-xs">{row.fase}</td>
                      <td className="px-3 py-2 text-right text-gray-900">{formatEUR(row.cuota)}</td>
                      <td className="px-3 py-2 text-right text-gray-600">{formatEUR(row.capital)}</td>
                      <td className="px-3 py-2 text-right text-gray-600">{formatEUR(row.interes)}</td>
                      <td className="px-3 py-2 text-right text-gray-600">{formatEUR(row.saldo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-xs text-gray-500">
            ⚠️ Cálculo orientativo. Los gastos de compraventa varían según tu Comunidad Autónoma; el euríbor variará
            durante la vida real de una hipoteca variable o mixta. Consulta siempre la oferta vinculante de tu banco.
          </p>
        </div>
      )}
    </div>
  )
}
