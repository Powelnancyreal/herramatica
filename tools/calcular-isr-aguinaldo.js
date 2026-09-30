'use client'

import { useState } from 'react'
import { TABLA_ISR_MENSUAL } from './calculadora-isr'
import { calcularISRAguinaldo, EXENCION_AGUINALDO, isrTarifaMensual } from '@/lib/calc/mexico-laboral'
import { buttonClass, ErrorText, Field, formatMXN, formatNumber, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

const isrMensual = (x) => isrTarifaMensual(TABLA_ISR_MENSUAL, x)

export default function CalcularISRAguinaldo() {
  const [sueldo, setSueldo] = useState('')
  const [modo, setModo] = useState('dias')
  const [dias, setDias] = useState('15')
  const [monto, setMonto] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const s = parseFloat(sueldo)
    if (!(s > 0)) return setError('Introduce tu sueldo mensual bruto.')
    let aguinaldo
    if (modo === 'dias') {
      const d = parseFloat(dias)
      if (!(d >= 15)) return setError('La ley exige al menos 15 días de aguinaldo (art. 87 LFT).')
      aguinaldo = (s / 30) * d
    } else {
      aguinaldo = parseFloat(monto)
      if (!(aguinaldo > 0)) return setError('Introduce el monto bruto de tu aguinaldo.')
    }
    setError('')
    const r = calcularISRAguinaldo({ aguinaldo, sueldoMensual: s, isrMensual })
    const isr = Math.min(r.isr96, r.isr174)
    setResult({ ...r, aguinaldo, isr, neto: aguinaldo - isr })
  }

  const r = result

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Sueldo mensual bruto">
          <NumberInput value={sueldo} onChange={setSueldo} prefix="$" min="0" placeholder="Ej: 18000" />
        </Field>
        <Field label="Aguinaldo">
          <div className="flex gap-3 text-sm mb-2">
            <label className="flex items-center gap-1.5">
              <input type="radio" checked={modo === 'dias'} onChange={() => setModo('dias')} /> Por días
            </label>
            <label className="flex items-center gap-1.5">
              <input type="radio" checked={modo === 'monto'} onChange={() => setModo('monto')} /> Monto exacto
            </label>
          </div>
          {modo === 'dias' ? (
            <NumberInput value={dias} onChange={setDias} min="15" step="1" suffix="días" />
          ) : (
            <NumberInput value={monto} onChange={setMonto} prefix="$" min="0" placeholder="Ej: 9000" />
          )}
        </Field>
      </div>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular ISR del aguinaldo</button>

      {r && (
        <ResultBox label="Aguinaldo neto estimado" value={formatMXN(r.neto)}>
          <Rows>
            <Row label="Aguinaldo bruto" value={formatMXN(r.aguinaldo)} bold />
            <Row label="Parte exenta (30 UMA)" value={formatMXN(r.exento)} />
            <Row label="Parte gravada" value={formatMXN(r.gravado)} />
            <Row label="ISR con el método del art. 96 LISR" value={formatMXN(r.isr96)} highlight={r.mejor === '96'} />
            <Row label={`ISR con el art. 174 RLISR (tasa ${formatNumber(r.tasa174 * 100, 2)}%)`} value={formatMXN(r.isr174)} highlight={r.mejor === '174'} />
            <Row label="ISR retenido (el menor)" value={formatMXN(r.isr)} bold />
          </Rows>
          <Note>
            {r.gravado === 0
              ? `Tu aguinaldo no supera la exención de ${formatMXN(EXENCION_AGUINALDO)}, así que no paga ISR.`
              : Math.abs(r.isr96 - r.isr174) < 0.5
                ? 'Ambos métodos dan el mismo resultado porque tu sueldo y tu aguinaldo quedan en el mismo tramo de la tarifa.'
                : `El patrón puede elegir el método; el del ${r.mejor === '174' ? 'art. 174 del reglamento' : 'art. 96 de la ley'} te retiene menos.`}{' '}
            Cálculo con la tarifa mensual de ISR 2026 antes de subsidio. El ISR retenido de más se recupera en la declaración anual.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
