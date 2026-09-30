'use client'

import { useState } from 'react'
import {
  calcularCuotasIMSSCompletas,
  calcularSDI,
  diasVacacionesPorAntiguedad,
  PRIMAS_RIESGO,
  SM_GENERAL_2026,
} from '@/lib/calc/mexico-laboral'
import { buttonClass, ErrorText, Field, formatMXN, inputClass, Note, NumberInput, ResultBox } from '@/components/calc-ui'

const PERIODOS = [
  { id: 'mensual', label: 'Mensual', dias: 30.4 },
  { id: 'bimestral', label: 'Bimestral', dias: 61 },
  { id: 'quincenal', label: 'Quincenal', dias: 15 },
  { id: 'semanal', label: 'Semanal', dias: 7 },
]

export default function CalcularCuotaIMSS() {
  const [modo, setModo] = useState('salario')
  const [valor, setValor] = useState('')
  const [anios, setAnios] = useState('1')
  const [periodoId, setPeriodoId] = useState('mensual')
  const [prima, setPrima] = useState('0.54355')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const v = parseFloat(valor)
    const pr = parseFloat(prima)
    if (!(v > 0)) return setError(modo === 'salario' ? 'Introduce el salario mensual.' : 'Introduce el salario base de cotización diario.')
    if (!(pr >= 0.5 && pr <= 15)) return setError('La prima de riesgo de trabajo debe estar entre 0.5% y 15%.')
    setError('')
    let sbc = v
    let factor = null
    if (modo === 'salario') {
      const n = Math.max(1, parseInt(anios, 10) || 1)
      const s = calcularSDI({ salarioDiario: v / 30.4, diasAguinaldo: 15, diasVacaciones: diasVacacionesPorAntiguedad(n), porcentajePrima: 25 })
      sbc = s.sdi
      factor = s.factor
    }
    const periodo = PERIODOS.find((p) => p.id === periodoId)
    const salarioMinimo = sbc / (factor || 1) <= SM_GENERAL_2026 + 0.01
    const c = calcularCuotasIMSSCompletas({ sbcDiario: sbc, diasPeriodo: periodo.dias, primaRiesgo: pr, salarioMinimo })
    setResult({ c, periodo, factor, salarioMinimo })
  }

  const r = result

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="radio" checked={modo === 'salario'} onChange={() => setModo('salario')} /> Conozco el salario mensual
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" checked={modo === 'sbc'} onChange={() => setModo('sbc')} /> Conozco el SBC diario
        </label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={modo === 'salario' ? 'Salario mensual bruto' : 'Salario base de cotización diario'}>
          <NumberInput value={valor} onChange={setValor} prefix="$" min="0" placeholder={modo === 'salario' ? 'Ej: 15000' : 'Ej: 520.50'} />
        </Field>
        {modo === 'salario' ? (
          <Field label="Años de antigüedad" hint="Se integra con prestaciones de ley: 15 días de aguinaldo y 25% de prima vacacional.">
            <NumberInput value={anios} onChange={setAnios} min="1" step="1" />
          </Field>
        ) : (
          <div />
        )}
        <Field label="Periodo">
          <select value={periodoId} onChange={(e) => setPeriodoId(e.target.value)} className={inputClass}>
            {PERIODOS.map((p) => (
              <option key={p.id} value={p.id}>{p.label} ({p.dias} días)</option>
            ))}
          </select>
        </Field>
        <Field label="Prima de riesgo de trabajo (%)" hint="Empresas nuevas usan la prima media de su clase.">
          <select value={prima} onChange={(e) => setPrima(e.target.value)} className={inputClass}>
            {PRIMAS_RIESGO.map((p) => (
              <option key={p.clase} value={String(p.prima)}>Clase {p.clase} · {p.prima}% · {p.ejemplo}</option>
            ))}
          </select>
        </Field>
      </div>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular cuotas IMSS</button>

      {r && (
        <ResultBox label={`Total de cuotas ${r.periodo.label.toLowerCase()} (patrón + trabajador)`} value={formatMXN(r.c.total)}>
          <div className="overflow-x-auto bg-white rounded-lg border border-blue-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-3 py-2">Rama de seguro</th>
                  <th className="text-right px-3 py-2">Patrón</th>
                  <th className="text-right px-3 py-2">Trabajador</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {r.c.filas.map((f) => (
                  <tr key={f.rama}>
                    <td className="px-3 py-2 text-gray-700">{f.rama}</td>
                    <td className="px-3 py-2 text-right">{formatMXN(f.patron)}</td>
                    <td className="px-3 py-2 text-right">{formatMXN(f.obrero)}</td>
                  </tr>
                ))}
                <tr className="bg-blue-50 font-semibold">
                  <td className="px-3 py-2">Total</td>
                  <td className="px-3 py-2 text-right">{formatMXN(r.c.totalPatron)}</td>
                  <td className="px-3 py-2 text-right">{formatMXN(r.c.totalObrero)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <Note>
            SBC usado: {formatMXN(r.c.sbc)} diarios{r.factor ? ` (factor de integración ${r.factor.toFixed(4)})` : ''}
            {r.c.topado ? ', limitado al tope de 25 UMA' : ''}. Cesantía y vejez patronal con la tabla 2026 de la reforma de
            pensiones. Retiro, cesantía y vejez e Infonavit se pagan bimestralmente, aunque aquí se muestran en el periodo
            elegido.{r.salarioMinimo ? ' Como el salario es el mínimo, el patrón absorbe la cuota obrera (art. 36 LSS).' : ''}
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
