'use client'

import { useState } from 'react'
import { calcularHorasExtra, JORNADAS, SM_GENERAL_2026 } from '@/lib/calc/mexico-laboral'
import { buttonClass, ErrorText, Field, formatMXN, formatNumber, inputClass, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

export default function CalcularHorasExtras() {
  const [tipoSueldo, setTipoSueldo] = useState('mensual')
  const [sueldo, setSueldo] = useState('')
  const [jornadaId, setJornadaId] = useState('diurna')
  const [horas, setHoras] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const s = parseFloat(sueldo)
    const h = parseFloat(horas)
    if (!(s > 0)) return setError('Introduce tu sueldo.')
    if (!(h > 0 && h <= 60)) return setError('Introduce las horas extra trabajadas en la semana (entre 0.5 y 60).')
    setError('')
    const diario = tipoSueldo === 'mensual' ? s / 30 : tipoSueldo === 'semanal' ? s / 7 : s
    const jornada = JORNADAS.find((j) => j.id === jornadaId)
    const ganaMinimo = diario <= SM_GENERAL_2026 + 0.01
    setResult({ ...calcularHorasExtra({ salarioDiario: diario, horasJornada: jornada.horas, horasExtraSemana: h, ganaSalarioMinimo: ganaMinimo }), diario, ganaMinimo, h })
  }

  const r = result

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Sueldo">
          <div className="flex gap-2">
            <NumberInput value={sueldo} onChange={setSueldo} prefix="$" min="0" placeholder="Ej: 12000" />
            <select value={tipoSueldo} onChange={(e) => setTipoSueldo(e.target.value)} className={`${inputClass} max-w-[9rem]`}>
              <option value="mensual">Mensual</option>
              <option value="semanal">Semanal</option>
              <option value="diario">Diario</option>
            </select>
          </div>
        </Field>
        <Field label="Tipo de jornada (art. 61 LFT)">
          <select value={jornadaId} onChange={(e) => setJornadaId(e.target.value)} className={inputClass}>
            {JORNADAS.map((j) => (
              <option key={j.id} value={j.id}>{j.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Horas extra trabajadas en la semana" hint="La LFT permite hasta 3 horas diarias, 3 veces por semana (9 horas).">
          <NumberInput value={horas} onChange={setHoras} min="0" step="0.5" suffix="h" placeholder="Ej: 12" />
        </Field>
      </div>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular pago de horas extra</button>

      {r && (
        <ResultBox label="Pago semanal por horas extra" value={formatMXN(r.total)}>
          <Rows>
            <Row label="Salario diario" value={formatMXN(r.diario)} />
            <Row label="Valor de tu hora ordinaria" value={formatMXN(r.valorHora)} />
            <Row label={`${formatNumber(r.dobles, 1)} horas dobles (× 2)`} value={formatMXN(r.pagoDobles)} />
            <Row label={`${formatNumber(r.triples, 1)} horas triples (× 3)`} value={formatMXN(r.pagoTriples)} />
            <Row label="Parte exenta de ISR" value={formatMXN(r.exento)} />
            <Row label="Parte gravada de ISR" value={formatMXN(r.gravado)} bold />
          </Rows>
          {r.triples > 0 && (
            <Note>
              Trabajaste más de 9 horas extra en la semana: el excedente se paga al triple (art. 68 LFT). El patrón no puede
              exigirte más de ese límite; hacerlo es una infracción.
            </Note>
          )}
          <Note>
            {r.ganaMinimo
              ? 'Como ganas el salario mínimo, las horas dobles están exentas de ISR en su totalidad.'
              : `Está exento el 50% de las horas dobles, sin pasar de 5 UMA por semana (${formatMXN(r.topeExento)}). Las horas triples se gravan completas.`}{' '}
            Salario diario calculado con 30 días al mes (criterio de la LFT).
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
