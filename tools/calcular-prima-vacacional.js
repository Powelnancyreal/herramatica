'use client'

import { useState } from 'react'
import { calcularISR } from './calculadora-isr'
import {
  calcularPrimaVacacional,
  diasVacacionesPorAntiguedad,
  EXENCION_PRIMA_VACACIONAL,
} from '@/lib/calc/mexico-laboral'
import {
  buttonClass,
  ErrorText,
  Field,
  formatMXN,
  Note,
  NumberInput,
  ResultBox,
  Row,
  Rows,
} from '@/components/calc-ui'

export default function CalcularPrimaVacacional() {
  const [salarioMensual, setSalarioMensual] = useState('')
  const [anios, setAnios] = useState('1')
  const [dias, setDias] = useState('12')
  const [porcentaje, setPorcentaje] = useState('25')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function onAnios(v) {
    setAnios(v)
    const n = parseInt(v, 10)
    if (n >= 1) setDias(String(diasVacacionesPorAntiguedad(n)))
  }

  function calcular() {
    const salario = parseFloat(salarioMensual)
    const diasVac = parseFloat(dias)
    const pct = parseFloat(porcentaje)
    if (!(salario > 0)) return setError('Introduce tu salario mensual bruto.')
    if (!(diasVac > 0)) return setError('Introduce los días de vacaciones que vas a disfrutar.')
    if (!(pct > 0)) return setError('Introduce el porcentaje de prima vacacional.')
    setError('')

    const salarioDiario = salario / 30
    const r = calcularPrimaVacacional({ salarioDiario, diasVacaciones: diasVac, porcentajePrima: pct })
    const isrBase = calcularISR({ ingreso: salario, periodoId: 'mensual', ingresosExentos: 0 }).isrPeriodo
    const isrConPrima = calcularISR({ ingreso: salario + r.gravable, periodoId: 'mensual', ingresosExentos: 0 }).isrPeriodo
    const isr = Math.max(0, isrConPrima - isrBase)
    setResult({ ...r, salarioDiario, isr, neto: r.prima - isr })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Salario mensual bruto">
          <NumberInput value={salarioMensual} onChange={setSalarioMensual} prefix="$" min="0" placeholder="Ej: 15000" />
        </Field>
        <Field label="Años de antigüedad cumplidos" hint="Rellena automáticamente los días según la tabla de la LFT.">
          <NumberInput value={anios} onChange={onAnios} min="1" step="1" inputMode="numeric" />
        </Field>
        <Field label="Días de vacaciones" hint="Puedes ajustarlos si tu empresa da más días que la ley.">
          <NumberInput value={dias} onChange={setDias} min="1" suffix="días" />
        </Field>
        <Field label="Porcentaje de prima vacacional" hint="Mínimo legal: 25% (art. 80 LFT).">
          <NumberInput value={porcentaje} onChange={setPorcentaje} min="0" suffix="%" />
        </Field>
      </div>

      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular prima vacacional</button>

      {result && (
        <ResultBox label="Prima vacacional neta estimada" value={formatMXN(result.neto)}>
          <Rows>
            <Row label="Salario diario (mensual ÷ 30)" value={formatMXN(result.salarioDiario)} />
            <Row label={`Pago de ${dias} días de vacaciones`} value={formatMXN(result.pagoVacaciones)} />
            <Row label={`Prima vacacional bruta (${porcentaje}%)`} value={formatMXN(result.prima)} bold />
            <Row label={`Parte exenta de ISR (15 UMA = ${formatMXN(EXENCION_PRIMA_VACACIONAL)})`} value={formatMXN(result.exento)} />
            <Row label="Parte gravable" value={formatMXN(result.gravable)} />
            <Row label="ISR estimado sobre la parte gravable" value={formatMXN(-result.isr)} />
            <Row label="Prima vacacional neta" value={formatMXN(result.neto)} bold highlight />
          </Rows>
          <Note>
            ⚠️ Cálculo <strong>orientativo</strong>. El ISR se estima sumando la parte gravable a tu salario mensual y
            aplicando la tarifa ISR 2026 del SAT. El pago de los días de vacaciones es tu salario normal y no forma parte
            de la prima.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
