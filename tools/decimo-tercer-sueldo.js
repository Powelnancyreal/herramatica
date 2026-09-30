'use client'

import { useState } from 'react'
import { usd } from '@/components/calc-ui-eur'
import { buttonClass, ErrorText, Field, Note, NumberInput, ResultBox, Row, Rows, Tabs } from '@/components/calc-ui'

const MODOS = [
  { id: 'fijo', label: 'Sueldo fijo' },
  { id: 'variable', label: 'Ingresos variables' },
]
const MESES = ['Diciembre', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre']

export default function DecimoTercerSueldo() {
  const [modo, setModo] = useState('fijo')
  const [sueldo, setSueldo] = useState('')
  const [meses, setMeses] = useState('12')
  const [variables, setVariables] = useState(Array(12).fill(''))
  const [mensualizado, setMensualizado] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    let total
    if (modo === 'fijo') {
      const s = parseFloat(sueldo)
      const m = Math.min(12, Math.max(0, parseFloat(meses) || 0))
      if (!(s > 0)) return setError('Ingresa tu remuneración mensual.')
      total = s * m
    } else {
      total = variables.reduce((acc, v) => acc + (parseFloat(v) || 0), 0)
      if (!(total > 0)) return setError('Ingresa lo que ganaste en cada mes del periodo.')
    }
    setError('')
    setResult({ total, decimo: total / 12 })
  }

  const r = result
  return (
    <div className="space-y-5">
      <Tabs tabs={MODOS} value={modo} onChange={setModo} />
      {modo === 'fijo' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Remuneración mensual" hint="Sueldo más horas extra, comisiones y bonos habituales."><NumberInput value={sueldo} onChange={setSueldo} prefix="$" min="0" placeholder="Ej: 800" /></Field>
          <Field label="Meses trabajados entre el 1 de diciembre y el 30 de noviembre"><NumberInput value={meses} onChange={setMeses} min="0" max="12" step="0.5" /></Field>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {MESES.map((m, i) => (
            <div key={m}>
              <label className="block text-xs text-gray-600 mb-1">{m}</label>
              <NumberInput value={variables[i]} onChange={(v) => setVariables((x) => x.map((y, j) => (j === i ? v : y)))} prefix="$" min="0" />
            </div>
          ))}
        </div>
      )}
      <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={mensualizado} onChange={(e) => setMensualizado(e.target.checked)} /> Lo cobro mensualizado en mi rol de pagos</label>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular décimo tercer sueldo</button>

      {r && (
        <ResultBox label={mensualizado ? 'Décimo tercero mensual' : 'Décimo tercer sueldo (diciembre)'} value={usd(mensualizado ? r.decimo / 12 : r.decimo)}>
          <Rows>
            <Row label="Total ganado en el periodo" value={usd(r.total)} />
            <Row label="Décimo tercero anual (total ÷ 12)" value={usd(r.decimo)} bold />
            <Row label="Equivalente mensualizado" value={usd(r.decimo / 12)} />
          </Rows>
          <Note>
            Art. 111 del Código del Trabajo: la doceava parte de todo lo percibido entre el 1 de diciembre del año anterior y el
            30 de noviembre, pagada hasta el 24 de diciembre. Puede recibirse de forma mensual si lo solicitas por escrito. No paga
            aportes al IESS ni impuesto a la renta.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
