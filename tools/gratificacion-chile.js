'use client'

import { useState } from 'react'
import { CHILE, gratificacionChile } from '@/lib/calc/latam'
import { clp } from '@/components/calc-ui-eur'
import { buttonClass, ErrorText, Field, Note, NumberInput, ResultBox, Row, Rows, Tabs } from '@/components/calc-ui'

const MODOS = [
  { id: 'art50', label: '25% con tope (art. 50)' },
  { id: 'art47', label: '30% de utilidades (art. 47)' },
]

export default function GratificacionChile() {
  const [modo, setModo] = useState('art50')
  const [sueldo, setSueldo] = useState('')
  const [meses, setMeses] = useState('12')
  const [imm, setImm] = useState(String(CHILE.imm))
  const [utilidad, setUtilidad] = useState('')
  const [remTotal, setRemTotal] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const s = parseFloat(sueldo)
    const m = Math.min(12, Math.max(1, parseInt(meses, 10) || 12))
    if (!(s > 0)) return setError('Ingresa tu remuneración mensual.')
    setError('')
    if (modo === 'art50') {
      const g = gratificacionChile({ sueldoMensual: s, imm: parseFloat(imm) || CHILE.imm })
      setResult({ modo, ...g, anual: Math.min(s * 0.25 * m, g.topeAnual * (m / 12)), m })
    } else {
      const u = parseFloat(utilidad)
      const rt = parseFloat(remTotal)
      if (!(u > 0 && rt > 0)) return setError('Ingresa la utilidad líquida de la empresa y el total de remuneraciones anuales de la plantilla.')
      const fondo = u * 0.3
      const anual = fondo * ((s * m) / rt)
      setResult({ modo, fondo, anual, m })
    }
  }

  const r = result
  return (
    <div className="space-y-5">
      <Tabs tabs={MODOS} value={modo} onChange={(m) => { setModo(m); setResult(null) }} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Remuneración mensual"><NumberInput value={sueldo} onChange={setSueldo} prefix="$" min="0" placeholder="Ej: 900000" /></Field>
        <Field label="Meses trabajados en el año"><NumberInput value={meses} onChange={setMeses} min="1" max="12" step="1" /></Field>
        {modo === 'art50' ? (
          <Field label="Ingreso mínimo mensual" hint="Desde mayo de 2026: $553.553."><NumberInput value={imm} onChange={setImm} prefix="$" min="0" /></Field>
        ) : (
          <>
            <Field label="Utilidad líquida de la empresa"><NumberInput value={utilidad} onChange={setUtilidad} prefix="$" min="0" /></Field>
            <Field label="Remuneraciones anuales de todos los trabajadores"><NumberInput value={remTotal} onChange={setRemTotal} prefix="$" min="0" /></Field>
          </>
        )}
      </div>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular gratificación</button>

      {r && r.modo === 'art50' && (
        <ResultBox label="Gratificación mensual" value={clp(r.mensual)}>
          <Rows>
            <Row label="25% de tu remuneración" value={clp(r.veinticinco)} />
            <Row label="Tope mensual (4.75 IMM ÷ 12)" value={clp(r.topeMensual)} />
            <Row label="Tope anual (4.75 IMM)" value={clp(r.topeAnual)} />
            <Row label={`Gratificación en ${r.m} meses`} value={clp(r.anual)} bold highlight />
          </Rows>
          <Note>{r.topado ? 'Tu 25% supera el tope, así que recibes el tope.' : 'Tu 25% está por debajo del tope, así que recibes el 25% completo.'} La gratificación es imponible: paga AFP, salud e impuesto.</Note>
        </ResultBox>
      )}
      {r && r.modo === 'art47' && (
        <ResultBox label="Gratificación anual estimada" value={clp(r.anual)}>
          <Rows>
            <Row label="30% de la utilidad líquida" value={clp(r.fondo)} />
            <Row label="Tu proporción según remuneraciones" value={clp(r.anual)} bold />
          </Rows>
          <Note>En la modalidad del art. 47 se reparte el 30% de la utilidad líquida entre los trabajadores en proporción a lo que ganó cada uno. La mayoría de las empresas prefiere pagar según el art. 50 porque tiene un tope.</Note>
        </ResultBox>
      )}
    </div>
  )
}
