'use client'

import { useState } from 'react'
import { dias360 } from '@/components/PrestacionColombia'
import { cop } from '@/components/calc-ui-eur'
import { buttonClass, ErrorText, Field, formatNumber, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

export default function VacacionesColombia() {
  const [salario, setSalario] = useState('')
  const [inicio, setInicio] = useState('')
  const [fin, setFin] = useState('')
  const [disfrutados, setDisfrutados] = useState('')
  const [integral, setIntegral] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const s = parseFloat(salario)
    if (!(s > 0)) return setError('Ingresa tu salario mensual (sin auxilio de transporte).')
    if (!inicio || !fin || fin < inicio) return setError('Ingresa la fecha de ingreso y la fecha de corte.')
    setError('')
    const dias = dias360(inicio, fin)
    const causados = (dias * 15) / 360
    const pendientes = Math.max(0, causados - (parseFloat(disfrutados) || 0))
    const base = integral ? s * 0.7 : s
    const diario = base / 30
    setResult({ dias, causados, pendientes, diario, valor: pendientes * diario, compensacion: (base * dias) / 720 })
  }

  const r = result
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Salario mensual (sin auxilio de transporte)"><NumberInput value={salario} onChange={setSalario} prefix="$" min="0" placeholder="Ej: 2500000" /></Field>
        <Field label="Días de vacaciones ya disfrutados"><NumberInput value={disfrutados} onChange={setDisfrutados} min="0" placeholder="0" /></Field>
        <Field label="Fecha de ingreso"><input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5" /></Field>
        <Field label="Fecha de corte o de retiro"><input type="date" value={fin} onChange={(e) => setFin(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5" /></Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={integral} onChange={(e) => setIntegral(e.target.checked)} /> Tengo salario integral (se toma el 70% como factor salarial)</label>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular vacaciones</button>

      {r && (
        <ResultBox label="Días de vacaciones pendientes" value={`${formatNumber(r.pendientes, 2)} días hábiles`}>
          <Rows>
            <Row label="Días trabajados (año de 360)" value={formatNumber(r.dias, 0)} />
            <Row label="Días de vacaciones causados" value={formatNumber(r.causados, 2)} />
            <Row label="Valor de un día de vacaciones" value={cop(r.diario)} />
            <Row label="Valor de los días pendientes" value={cop(r.valor)} bold highlight />
            <Row label="Compensación en dinero si terminas el contrato (salario × días ÷ 720)" value={cop(r.compensacion)} />
          </Rows>
          <Note>
            Art. 186 del Código Sustantivo del Trabajo: 15 días hábiles consecutivos de vacaciones remuneradas por cada año de
            servicio. Los domingos y festivos no cuentan como días de vacaciones. Solo puede compensarse en dinero hasta la mitad
            de las vacaciones durante el contrato, o la totalidad al terminarlo. El valor diario se calcula con el salario sin
            auxilio de transporte.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
