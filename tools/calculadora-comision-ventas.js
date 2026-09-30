'use client'

import { useState } from 'react'
import { buttonClass, ErrorText, Field, formatMXN, formatNumber, NumberInput, ResultBox, Row, Rows, secondaryButtonClass, Tabs } from '@/components/calc-ui'

const MODOS = [
  { id: 'fija', label: 'Porcentaje fijo' },
  { id: 'escalonada', label: 'Por tramos' },
  { id: 'meta', label: 'Con meta y bono' },
]

export default function CalculadoraComisionVentas() {
  const [modo, setModo] = useState('fija')
  const [ventas, setVentas] = useState('')
  const [base, setBase] = useState('')
  const [pct, setPct] = useState('5')
  const [tramos, setTramos] = useState([
    { hasta: '50000', pct: '3' },
    { hasta: '100000', pct: '5' },
    { hasta: '', pct: '7' },
  ])
  const [meta, setMeta] = useState('')
  const [bono, setBono] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const v = parseFloat(ventas)
    const b = parseFloat(base) || 0
    if (!(v >= 0)) return setError('Introduce el monto de tus ventas.')
    setError('')
    const detalle = []
    let comision = 0
    if (modo === 'escalonada') {
      let desde = 0
      for (const t of tramos) {
        const hasta = parseFloat(t.hasta) || Infinity
        const p = parseFloat(t.pct) || 0
        const tramo = Math.max(0, Math.min(v, hasta) - desde)
        if (tramo > 0) {
          detalle.push({ label: `${formatMXN(desde)} a ${hasta === Infinity ? 'en adelante' : formatMXN(hasta)} al ${p}%`, valor: (tramo * p) / 100 })
          comision += (tramo * p) / 100
        }
        desde = hasta
        if (hasta === Infinity) break
      }
    } else {
      comision = (v * (parseFloat(pct) || 0)) / 100
      detalle.push({ label: `${formatMXN(v)} × ${pct}%`, valor: comision })
    }
    let bonoGanado = 0
    const m = parseFloat(meta)
    if (modo === 'meta' && m > 0 && v >= m) bonoGanado = parseFloat(bono) || 0
    const total = b + comision + bonoGanado
    setResult({ v, b, comision, detalle, bonoGanado, total, avanceMeta: modo === 'meta' && m > 0 ? v / m : null, faltaMeta: m > 0 ? Math.max(0, m - v) : 0 })
  }

  const r = result

  return (
    <div className="space-y-5">
      <Tabs tabs={MODOS} value={modo} onChange={(v) => { setModo(v); setResult(null) }} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Ventas del periodo">
          <NumberInput value={ventas} onChange={setVentas} prefix="$" min="0" placeholder="Ej: 120000" />
        </Field>
        <Field label="Sueldo base (opcional)">
          <NumberInput value={base} onChange={setBase} prefix="$" min="0" placeholder="0" />
        </Field>
        {modo !== 'escalonada' && (
          <Field label="Porcentaje de comisión">
            <NumberInput value={pct} onChange={setPct} min="0" step="0.1" suffix="%" />
          </Field>
        )}
        {modo === 'meta' && (
          <>
            <Field label="Meta de ventas">
              <NumberInput value={meta} onChange={setMeta} prefix="$" min="0" placeholder="Ej: 100000" />
            </Field>
            <Field label="Bono al alcanzar la meta">
              <NumberInput value={bono} onChange={setBono} prefix="$" min="0" placeholder="Ej: 3000" />
            </Field>
          </>
        )}
      </div>
      {modo === 'escalonada' && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Tramos (cada porcentaje se aplica solo a la parte de la venta dentro del tramo)</p>
          {tramos.map((t, i) => (
            <div key={i} className="flex gap-2 items-center text-sm">
              <span className="w-16 text-gray-500">Hasta</span>
              <NumberInput value={t.hasta} onChange={(v) => setTramos((x) => x.map((y, j) => (j === i ? { ...y, hasta: v } : y)))} prefix="$" placeholder="Sin límite" />
              <NumberInput value={t.pct} onChange={(v) => setTramos((x) => x.map((y, j) => (j === i ? { ...y, pct: v } : y)))} suffix="%" />
            </div>
          ))}
          <button type="button" onClick={() => setTramos((x) => [...x.slice(0, -1), { hasta: '', pct: '' }, x[x.length - 1]])} className={secondaryButtonClass}>+ Añadir tramo</button>
        </div>
      )}
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular comisión</button>

      {r && (
        <ResultBox label="Ingreso total del periodo" value={formatMXN(r.total)}>
          <Rows>
            {r.b > 0 && <Row label="Sueldo base" value={formatMXN(r.b)} />}
            {r.detalle.map((d) => (
              <Row key={d.label} label={`Comisión: ${d.label}`} value={formatMXN(d.valor)} />
            ))}
            <Row label="Comisión total" value={formatMXN(r.comision)} bold />
            <Row label="Comisión efectiva sobre ventas" value={`${formatNumber(r.v ? (r.comision / r.v) * 100 : 0, 2)}%`} />
            {r.avanceMeta !== null && <Row label="Avance de la meta" value={`${formatNumber(r.avanceMeta * 100, 1)}%`} />}
            {r.avanceMeta !== null && <Row label={r.bonoGanado ? 'Bono ganado' : 'Te falta vender para el bono'} value={formatMXN(r.bonoGanado || r.faltaMeta)} highlight />}
          </Rows>
        </ResultBox>
      )}
    </div>
  )
}
