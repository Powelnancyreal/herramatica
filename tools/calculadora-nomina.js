'use client'

import { useState } from 'react'
import { calcularISR } from './calculadora-isr'
import { calcularCuotasIMSS, calcularSDI, diasVacacionesPorAntiguedad } from '@/lib/calc/mexico-laboral'
import {
  buttonClass,
  ErrorText,
  Field,
  formatMXN,
  inputClass,
  Note,
  NumberInput,
  ResultBox,
  Row,
  Rows,
} from '@/components/calc-ui'

const PERIODOS = [
  { id: 'semanal', label: 'Semanal', dias: 7 },
  { id: 'quincenal', label: 'Quincenal', dias: 15 },
  { id: 'mensual', label: 'Mensual', dias: 30.4 },
]

export default function CalculadoraNomina() {
  const [salarioMensual, setSalarioMensual] = useState('')
  const [periodoId, setPeriodoId] = useState('quincenal')
  const [anios, setAnios] = useState('1')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const salario = parseFloat(salarioMensual)
    const n = parseInt(anios, 10)
    if (!(salario > 0)) return setError('Introduce tu salario mensual bruto.')
    if (!(n >= 1)) return setError('Introduce tu antigüedad (mínimo 1 año).')
    setError('')

    const periodo = PERIODOS.find((p) => p.id === periodoId)
    const salarioDiario = salario / 30.4
    const bruto = salarioDiario * periodo.dias
    const { sbc, factor } = calcularSDI({
      salarioDiario,
      diasAguinaldo: 15,
      diasVacaciones: diasVacacionesPorAntiguedad(n),
      porcentajePrima: 25,
    })
    const imss = calcularCuotasIMSS({ sbcDiario: sbc, diasPeriodo: periodo.dias })
    const isr = calcularISR({ ingreso: bruto, periodoId, ingresosExentos: 0 })
    const neto = bruto - isr.isrPeriodo - imss.total
    setResult({ periodo, bruto, sbc, factor, imss, isr, neto })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Salario mensual bruto">
          <NumberInput value={salarioMensual} onChange={setSalarioMensual} prefix="$" min="0" placeholder="Ej: 20000" />
        </Field>
        <Field label="Periodo de pago">
          <select value={periodoId} onChange={(e) => setPeriodoId(e.target.value)} className={inputClass}>
            {PERIODOS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Años de antigüedad" hint="Afecta el salario base de cotización del IMSS.">
          <NumberInput value={anios} onChange={setAnios} min="1" step="1" inputMode="numeric" />
        </Field>
      </div>

      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular mi sueldo neto</button>

      {result && (
        <ResultBox label={`Sueldo neto ${result.periodo.label.toLowerCase()} estimado`} value={formatMXN(result.neto)}>
          <Rows>
            <Row label={`Sueldo bruto ${result.periodo.label.toLowerCase()} (${result.periodo.dias} días)`} value={formatMXN(result.bruto)} bold />
            <Row label="ISR antes de subsidio" value={formatMXN(-result.isr.isrAntesSubsidio * result.isr.periodo.factor)} />
            {result.isr.aplicaSubsidio && <Row label="Subsidio para el empleo" value={formatMXN(result.isr.subsidioPeriodo)} />}
            <Row label="ISR retenido" value={formatMXN(-result.isr.isrPeriodo)} />
            {result.imss.desglose.map((c) => (
              <Row key={c.concepto} label={`IMSS · ${c.concepto}`} value={formatMXN(-c.importe)} />
            ))}
            <Row label="Total cuotas obreras IMSS" value={formatMXN(-result.imss.total)} />
            <Row label="Sueldo neto" value={formatMXN(result.neto)} bold highlight />
          </Rows>
          <Note>
            Salario base de cotización: {formatMXN(result.sbc)} diarios (factor de integración {result.factor.toFixed(4)} con
            prestaciones de ley). Cálculo orientativo con la tarifa ISR y el subsidio para el empleo 2026. Si ganas el
            salario mínimo, tu patrón paga tu cuota del IMSS y tu ISR es cero. No incluye Infonavit, fonacot, pensión
            alimenticia ni otras deducciones personales.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
