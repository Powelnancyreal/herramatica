'use client'

import { useState } from 'react'
import { calcularVacaciones, TABLA_VACACIONES } from '@/lib/calc/mexico-laboral'
import {
  buttonClass,
  ErrorText,
  Field,
  formatMXN,
  formatNumber,
  inputClass,
  Note,
  NumberInput,
  ResultBox,
  Row,
  Rows,
} from '@/components/calc-ui'

function hoyISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function rangoDeAnios(anios) {
  return TABLA_VACACIONES.find((r) => {
    if (!r.rango.includes('-')) return Number(r.rango) === anios
    const [a, b] = r.rango.split('-').map(Number)
    return anios >= a && anios <= b
  })?.rango
}

export default function CalcularVacaciones() {
  const [fechaIngreso, setFechaIngreso] = useState('')
  const [fechaReferencia, setFechaReferencia] = useState(hoyISO())
  const [salarioMensual, setSalarioMensual] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    if (!fechaIngreso) return setError('Introduce tu fecha de ingreso a la empresa.')
    if (!fechaReferencia || fechaReferencia < fechaIngreso) return setError('La fecha de cálculo debe ser posterior a tu ingreso.')
    setError('')
    const salario = parseFloat(salarioMensual)
    setResult({ ...calcularVacaciones({ fechaIngreso, fechaReferencia }), salarioDiario: salario > 0 ? salario / 30 : null })
  }

  const rangoActivo = result && result.anios >= 1 ? rangoDeAnios(result.anios) : null

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Fecha de ingreso">
          <input type="date" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Fecha de cálculo" hint="Hoy, o tu último día si dejas la empresa.">
          <input type="date" value={fechaReferencia} onChange={(e) => setFechaReferencia(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Salario mensual (opcional)" hint="Para calcular cuánto valen tus días.">
          <NumberInput value={salarioMensual} onChange={setSalarioMensual} prefix="$" min="0" placeholder="Ej: 15000" />
        </Field>
      </div>

      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular mis vacaciones</button>

      {result && (
        <ResultBox
          label={result.anios >= 1 ? `Días de vacaciones por tu ${result.anios}.º año` : 'Aún no cumples tu primer año'}
          value={result.anios >= 1 ? `${result.diasAnioActual} días` : `${formatNumber(result.proporcionales)} días acumulados`}
        >
          <Rows>
            <Row label="Antigüedad cumplida" value={`${result.anios} año${result.anios === 1 ? '' : 's'}`} />
            {result.anios >= 1 && <Row label="Días que te corresponden este periodo" value={`${result.diasAnioActual} días`} bold />}
            <Row label="Días que tendrás al cumplir el siguiente año" value={`${result.diasProximoAnio} días`} />
            <Row label="Días transcurridos desde tu último aniversario" value={`${result.diasTranscurridos} días`} />
            <Row label="Vacaciones proporcionales acumuladas del año en curso" value={`${formatNumber(result.proporcionales)} días`} />
            {result.salarioDiario && result.anios >= 1 && (
              <Row label="Valor de tus días de este periodo" value={formatMXN(result.salarioDiario * result.diasAnioActual)} highlight />
            )}
            {result.salarioDiario && (
              <Row label="Valor de las vacaciones proporcionales" value={formatMXN(result.salarioDiario * result.proporcionales)} />
            )}
          </Rows>
          <Note>
            Las vacaciones proporcionales se pagan en tu finiquito si dejas la empresa antes de tu próximo aniversario
            (art. 79 LFT). Además de estos días, te corresponde una prima vacacional de al menos el 25%.
          </Note>
        </ResultBox>
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Tabla de vacaciones por antigüedad (LFT, reforma 2023)</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-sm">
          {TABLA_VACACIONES.map((r) => (
            <div
              key={r.rango}
              className={`rounded-lg border px-2 py-2 text-center ${
                r.rango === rangoActivo ? 'border-blue-500 bg-blue-50 text-blue-800 font-semibold' : 'border-gray-200 text-gray-700'
              }`}
            >
              <div className="text-xs text-gray-500">Año {r.rango}</div>
              <div>{r.dias} días</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
