'use client'

import { useState } from 'react'
import { TABLA_ISR_MENSUAL } from './calculadora-isr'
import {
  calcularSubsidioEmpleo,
  isrTarifaMensual,
  LIMITE_INGRESO_SUBSIDIO,
  SM_GENERAL_2026,
  SUBSIDIO_2026,
} from '@/lib/calc/mexico-laboral'
import { buttonClass, ErrorText, Field, formatMXN, inputClass, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

const PERIODOS = [
  { id: 'mensual', label: 'Mensual', dias: 30.4 },
  { id: 'quincenal', label: 'Quincenal', dias: 15 },
  { id: 'semanal', label: 'Semanal', dias: 7 },
]

export default function CalcularSubsidioEmpleo() {
  const [ingreso, setIngreso] = useState('')
  const [periodoId, setPeriodoId] = useState('mensual')
  const [mes, setMes] = useState('febreroDiciembre')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const monto = parseFloat(ingreso)
    if (!(monto > 0)) return setError('Introduce tu ingreso gravable del periodo.')
    setError('')
    const periodo = PERIODOS.find((p) => p.id === periodoId)
    const factor = 30.4 / periodo.dias
    const mensual = monto * factor
    const isrMensual = isrTarifaMensual(TABLA_ISR_MENSUAL, mensual)
    const s = calcularSubsidioEmpleo({ ingresoMensual: mensual, isrMensual, mes })
    const esMinimo = mensual <= SM_GENERAL_2026 * 30.4 + 0.01
    setResult({ periodo, factor, mensual, isrMensual, s, esMinimo })
  }

  const r = result
  const p = (x) => formatMXN(x / (r?.factor || 1))

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Ingreso gravable del periodo" hint="Sueldo más percepciones gravadas, sin la parte exenta.">
          <NumberInput value={ingreso} onChange={setIngreso} prefix="$" min="0" placeholder="Ej: 10000" />
        </Field>
        <Field label="Periodo de pago">
          <select value={periodoId} onChange={(e) => setPeriodoId(e.target.value)} className={inputClass}>
            {PERIODOS.map((x) => (
              <option key={x.id} value={x.id}>{x.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Mes de 2026">
          <select value={mes} onChange={(e) => setMes(e.target.value)} className={inputClass}>
            <option value="febreroDiciembre">Febrero a diciembre</option>
            <option value="enero">Enero</option>
          </select>
        </Field>
      </div>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular subsidio al empleo</button>

      {r && (
        <ResultBox
          label={r.s.aplica ? `Subsidio al empleo ${r.periodo.label.toLowerCase()}` : 'Subsidio al empleo'}
          value={r.s.aplica ? p(r.s.aplicado) : 'No aplica'}
        >
          <Rows>
            <Row label="Ingreso mensual equivalente" value={formatMXN(r.mensual)} />
            <Row label="Límite de ingresos para el subsidio" value={formatMXN(LIMITE_INGRESO_SUBSIDIO)} />
            <Row label={`ISR ${r.periodo.label.toLowerCase()} antes del subsidio`} value={p(r.isrMensual)} />
            <Row label="Subsidio que corresponde" value={p(r.s.subsidio)} />
            {r.s.noAplicado > 0.005 && <Row label="Subsidio que no se puede aplicar" value={p(r.s.noAplicado)} />}
            <Row label={`ISR a retener ${r.periodo.label.toLowerCase()}`} value={p(r.s.isrFinal)} bold highlight />
          </Rows>
          {!r.s.aplica && (
            <Note>
              Tu ingreso mensual supera {formatMXN(LIMITE_INGRESO_SUBSIDIO)}, así que no tienes derecho al subsidio y se te
              retiene el ISR completo de la tarifa.
            </Note>
          )}
          {r.esMinimo && (
            <Note>
              Tu ingreso no supera el salario mínimo general. Según el artículo 96 de la LISR, a quien gana el salario mínimo
              no se le retiene ISR, sin importar el subsidio.
            </Note>
          )}
          <Note>
            Subsidio mensual 2026: {formatMXN(SUBSIDIO_2026.enero)} en enero y {formatMXN(SUBSIDIO_2026.febreroDiciembre)} de
            febrero a diciembre. Para periodos menores al mes se usa la proporción de días (periodo ÷ 30.4). El subsidio solo
            reduce el ISR; si es mayor que el impuesto, la diferencia no se paga en efectivo.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
