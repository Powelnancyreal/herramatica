'use client'

import { useState } from 'react'
import { calcularPTU, EXENCION_PTU } from '@/lib/calc/mexico-laboral'
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
  Tabs,
} from '@/components/calc-ui'

export default function CalcularPTU() {
  const [modo, setModo] = useState('ptu')
  const [montoEmpresa, setMontoEmpresa] = useState('')
  const [diasTotales, setDiasTotales] = useState('')
  const [salariosTotales, setSalariosTotales] = useState('')
  const [diasTrabajador, setDiasTrabajador] = useState('365')
  const [salarioAnual, setSalarioAnual] = useState('')
  const [salarioMensual, setSalarioMensual] = useState('')
  const [promedio, setPromedio] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const monto = parseFloat(montoEmpresa)
    const ptuTotal = modo === 'renta' ? monto * 0.1 : monto
    const dT = parseFloat(diasTotales)
    const sT = parseFloat(salariosTotales)
    const dW = parseFloat(diasTrabajador)
    const sA = parseFloat(salarioAnual)
    const sM = parseFloat(salarioMensual)
    if (!(ptuTotal > 0)) return setError(modo === 'renta' ? 'Introduce la renta gravable de la empresa.' : 'Introduce el monto total de PTU a repartir.')
    if (!(dT > 0) || !(sT > 0)) return setError('Introduce los días y salarios totales de todos los trabajadores.')
    if (!(dW > 0) || !(sA > 0) || !(sM > 0)) return setError('Completa tus días trabajados, tu salario anual y tu salario mensual.')
    if (dW > dT || sA > sT) return setError('Tus días o tu salario no pueden ser mayores que los totales de la plantilla.')
    setError('')
    setResult({
      ptuTotal,
      ...calcularPTU({
        ptuTotal,
        diasTotalesTrabajadores: dT,
        salariosTotalesTrabajadores: sT,
        diasTrabajador: dW,
        salarioAnualTrabajador: sA,
        salarioMensualTrabajador: sM,
        promedioPtuTresAnios: parseFloat(promedio) || 0,
      }),
    })
  }

  return (
    <div className="space-y-5">
      <Tabs
        tabs={[
          { id: 'ptu', label: 'Conozco la PTU a repartir' },
          { id: 'renta', label: 'Conozco la renta gravable' },
        ]}
        value={modo}
        onChange={setModo}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label={modo === 'renta' ? 'Renta gravable de la empresa' : 'PTU total a repartir'}
          hint={modo === 'renta' ? 'Se reparte el 10% (art. 117 LFT).' : 'El 10% de la renta gravable que declaró la empresa.'}
        >
          <NumberInput value={montoEmpresa} onChange={setMontoEmpresa} prefix="$" min="0" />
        </Field>
        <Field label="Días trabajados por toda la plantilla" hint="Suma de los días de todos los trabajadores con derecho.">
          <NumberInput value={diasTotales} onChange={setDiasTotales} min="0" />
        </Field>
        <Field label="Salarios totales de la plantilla en el año" hint="Solo salario por cuota diaria, sin horas extra ni bonos.">
          <NumberInput value={salariosTotales} onChange={setSalariosTotales} prefix="$" min="0" />
        </Field>
        <Field label="Tus días trabajados en el año">
          <NumberInput value={diasTrabajador} onChange={setDiasTrabajador} min="0" max="366" />
        </Field>
        <Field label="Tu salario devengado en el año">
          <NumberInput value={salarioAnual} onChange={setSalarioAnual} prefix="$" min="0" />
        </Field>
        <Field label="Tu salario mensual actual" hint="Se usa para el tope de 3 meses de salario.">
          <NumberInput value={salarioMensual} onChange={setSalarioMensual} prefix="$" min="0" />
        </Field>
        <Field label="Promedio de PTU recibida en los últimos 3 años (opcional)" hint="Si es mayor que 3 meses de salario, se usa como tope.">
          <NumberInput value={promedio} onChange={setPromedio} prefix="$" min="0" />
        </Field>
      </div>

      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular mi PTU</button>

      {result && (
        <ResultBox label="Tu reparto de utilidades (PTU)" value={formatMXN(result.ptu)}>
          <Rows>
            <Row label="PTU total a repartir" value={formatMXN(result.ptuTotal)} />
            <Row label="Parte por días trabajados (50%)" value={formatMXN(result.porDias)} />
            <Row label="Parte por salario devengado (50%)" value={formatMXN(result.porSalario)} />
            <Row label="PTU antes del tope" value={formatMXN(result.ptuSinTope)} bold />
            <Row label="Tope legal aplicable (art. 127 fr. VIII)" value={formatMXN(result.tope)} />
            <Row label={`Parte exenta de ISR (15 UMA = ${formatMXN(EXENCION_PTU)})`} value={formatMXN(result.exento)} />
            <Row label="Parte gravable" value={formatMXN(result.gravable)} />
            <Row label="PTU que te corresponde" value={formatMXN(result.ptu)} bold highlight />
          </Rows>
          {result.topado && (
            <Note>
              Tu PTU se limitó al tope legal: el mayor entre 3 meses de salario y el promedio de tus últimos 3 años de PTU.
            </Note>
          )}
          <Note>
            Factor por día: {formatMXN(result.factorDias)} · Factor por peso de salario: {result.factorSalario.toFixed(6)}. Cálculo
            orientativo; la empresa debe entregarte la declaración anual y la lista de reparto para verificarlo.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
