'use client'

import { useEffect, useState } from 'react'
import { uyu } from '@/components/calc-ui-eur'
import { buttonClass, ErrorText, Field, Note, NumberInput, ResultBox, Row, Rows, Tabs } from '@/components/calc-ui'

const SEMESTRES = {
  junio: { label: 'Aguinaldo de junio', meses: ['Diciembre', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'], pago: 'antes del 30 de junio' },
  diciembre: { label: 'Aguinaldo de diciembre', meses: ['Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre'], pago: 'antes del 24 de diciembre' },
}
const MODOS = [
  { id: 'fijo', label: 'Sueldo fijo' },
  { id: 'variable', label: 'Mes a mes' },
]

export default function AguinaldoUruguay() {
  const [semestre, setSemestre] = useState('diciembre')
  const [modo, setModo] = useState('fijo')
  const [sueldo, setSueldo] = useState('')
  const [meses, setMeses] = useState('6')
  const [variables, setVariables] = useState(Array(6).fill(''))
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  // El semestre por defecto depende de la fecha del visitante.
  useEffect(() => setSemestre(new Date().getMonth() < 6 ? 'junio' : 'diciembre'), [])

  function calcular() {
    let total
    if (modo === 'fijo') {
      const s = parseFloat(sueldo)
      if (!(s > 0)) return setError('Ingresá tu sueldo nominal mensual.')
      total = s * Math.min(6, Math.max(0, parseFloat(meses) || 0))
    } else {
      total = variables.reduce((a, v) => a + (parseFloat(v) || 0), 0)
      if (!(total > 0)) return setError('Ingresá lo que cobraste cada mes del semestre.')
    }
    setError('')
    const bruto = total / 12
    const bps = bruto * 0.15
    const frl = bruto * 0.001
    setResult({ total, bruto, bps, frl, neto: bruto - bps - frl })
  }

  const s = SEMESTRES[semestre]
  const r = result
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        <Tabs tabs={Object.entries(SEMESTRES).map(([id, v]) => ({ id, label: v.label }))} value={semestre} onChange={setSemestre} />
        <Tabs tabs={MODOS} value={modo} onChange={setModo} />
      </div>
      {modo === 'fijo' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Sueldo nominal mensual" hint="Incluye horas extra, comisiones y otras partidas salariales."><NumberInput value={sueldo} onChange={setSueldo} prefix="$" min="0" placeholder="Ej: 45000" /></Field>
          <Field label={`Meses trabajados (${s.meses[0]} a ${s.meses[5]})`}><NumberInput value={meses} onChange={setMeses} min="0" max="6" step="0.5" /></Field>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {s.meses.map((m, i) => (
            <div key={m}>
              <label className="block text-xs text-gray-600 mb-1">{m}</label>
              <NumberInput value={variables[i]} onChange={(v) => setVariables((x) => x.map((y, j) => (j === i ? v : y)))} prefix="$" min="0" />
            </div>
          ))}
        </div>
      )}
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular aguinaldo</button>

      {r && (
        <ResultBox label={`${s.label} (nominal)`} value={uyu(r.bruto)}>
          <Rows>
            <Row label="Total nominal cobrado en el semestre" value={uyu(r.total)} />
            <Row label="Aguinaldo = total ÷ 12" value={uyu(r.bruto)} bold />
            <Row label="Aporte jubilatorio (15%)" value={`−${uyu(r.bps)}`} />
            <Row label="Fondo de Reconversión Laboral (0.1%)" value={`−${uyu(r.frl)}`} />
            <Row label="Aguinaldo líquido estimado" value={uyu(r.neto)} highlight />
          </Rows>
          <Note>
            Ley 12.840: el aguinaldo es la doceava parte de lo ganado en el semestre y se paga {s.pago}. No descuenta FONASA. El
            IRPF del aguinaldo se va reteniendo durante el año con el incremento del 6% de la base, así que normalmente no se
            descuenta al cobrarlo.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
