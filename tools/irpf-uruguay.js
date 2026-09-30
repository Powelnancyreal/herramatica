'use client'

import { useState } from 'react'
import { irpfUruguay, URUGUAY } from '@/lib/calc/latam'
import { uyu } from '@/components/calc-ui-eur'
import { buttonClass, ErrorText, Field, formatNumber, inputClass, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

const FONASA = [
  { v: '3', label: 'Hasta 2.5 BPC (3%)' },
  { v: '4.5', label: 'Sin hijos ni cónyuge a cargo (4.5%)' },
  { v: '6', label: 'Con hijos a cargo (6%)' },
  { v: '6.5', label: 'Con cónyuge a cargo (6.5%)' },
  { v: '8', label: 'Con hijos y cónyuge a cargo (8%)' },
]

export default function IrpfUruguay() {
  const [nominal, setNominal] = useState('')
  const [fonasa, setFonasa] = useState('4.5')
  const [hijos, setHijos] = useState('0')
  const [hijosDisc, setHijosDisc] = useState('0')
  const [fondo, setFondo] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const n = parseFloat(nominal)
    if (!(n > 0)) return setError('Ingresá tu sueldo nominal mensual.')
    setError('')
    setResult(irpfUruguay({ nominal: n, fonasaPct: parseFloat(fonasa), hijos: parseInt(hijos, 10) || 0, hijosDiscapacidad: parseInt(hijosDisc, 10) || 0, fondoSolidaridad: parseFloat(fondo) || 0 }))
  }

  const r = result
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Sueldo nominal mensual"><NumberInput value={nominal} onChange={setNominal} prefix="$" min="0" placeholder="Ej: 90000" /></Field>
        <Field label="Aporte FONASA">
          <select value={fonasa} onChange={(e) => setFonasa(e.target.value)} className={inputClass}>
            {FONASA.map((f) => (
              <option key={f.v} value={f.v}>{f.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Hijos menores a cargo"><NumberInput value={hijos} onChange={setHijos} min="0" step="1" /></Field>
        <Field label="Hijos con discapacidad a cargo"><NumberInput value={hijosDisc} onChange={setHijosDisc} min="0" step="1" /></Field>
        <Field label="Fondo de Solidaridad mensual (opcional)"><NumberInput value={fondo} onChange={setFondo} prefix="$" min="0" placeholder="0" /></Field>
      </div>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular IRPF</button>

      {r && (
        <ResultBox label="IRPF mensual a retener" value={uyu(r.irpf)}>
          <Rows>
            <Row label={r.base > parseFloat(nominal) ? 'Base de cálculo (nominal + 6%)' : 'Base de cálculo'} value={uyu(r.base)} />
            {r.detalle.map((d) => (
              <Row key={d.tasa} label={`Franja al ${d.tasa}% sobre ${uyu(d.monto)}`} value={uyu(d.impuesto)} />
            ))}
            <Row label="Impuesto por franjas" value={uyu(r.impuesto)} bold />
            <Row label="Deducciones (aportes BPS, FONASA, FRL, hijos)" value={uyu(r.deducciones)} />
            <Row label={`Crédito por deducciones (${r.tasaDeduccion}%)`} value={`−${uyu(r.credito)}`} />
            <Row label="Sueldo líquido estimado" value={uyu(r.liquido)} highlight />
            <Row label="Tasa efectiva de IRPF" value={`${formatNumber((r.irpf / parseFloat(nominal)) * 100, 2)}%`} />
          </Rows>
          <Note>
            BPC 2026: {uyu(URUGUAY.bpc)}. Franjas mensuales: 0% hasta 7 BPC, luego 10%, 15%, 24%, 25%, 27%, 31% y 36%. Si el nominal supera
            10 BPC, la base se incrementa un 6% para anticipar el IRPF del aguinaldo y el salario vacacional. Las deducciones se
            descuentan al 14% si ganás hasta 15 BPC y al 8% si ganás más. Cada hijo a cargo deduce 20 BPC al año ({uyu((20 * URUGUAY.bpc) / 12)} al
            mes). No considera topes de aportación ni otras deducciones particulares.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
