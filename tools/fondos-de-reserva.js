'use client'

import { useState } from 'react'
import { usd } from '@/components/calc-ui-eur'
import { buttonClass, ErrorText, Field, formatNumber, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

export default function FondosDeReserva() {
  const [sueldo, setSueldo] = useState('')
  const [ingreso, setIngreso] = useState('')
  const [meses, setMeses] = useState('12')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const s = parseFloat(sueldo)
    if (!(s > 0)) return setError('Ingresa tu remuneración mensual aportada al IESS.')
    setError('')
    const mensual = s * 0.0833
    let mesesConDerecho = parseFloat(meses) || 0
    let aviso = ''
    if (ingreso) {
      const a = new Date(ingreso + 'T00:00:00Z')
      const hoy = new Date()
      const trabajados = (hoy.getFullYear() - a.getUTCFullYear()) * 12 + (hoy.getMonth() - a.getUTCMonth())
      if (trabajados < 12) aviso = `Llevas ${trabajados} meses: tendrás derecho a fondos de reserva a partir del mes 13.`
    }
    setResult({ mensual, anual: mensual * Math.min(12, mesesConDerecho), aviso })
  }

  const r = result
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Remuneración mensual (aportada al IESS)"><NumberInput value={sueldo} onChange={setSueldo} prefix="$" min="0" placeholder="Ej: 900" /></Field>
        <Field label="Fecha de ingreso (opcional)"><input type="date" value={ingreso} onChange={(e) => setIngreso(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5" /></Field>
        <Field label="Meses con derecho en el año"><NumberInput value={meses} onChange={setMeses} min="0" max="12" step="1" /></Field>
      </div>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular fondos de reserva</button>

      {r && (
        <ResultBox label="Fondos de reserva mensuales" value={usd(r.mensual)}>
          <Rows>
            <Row label="Porcentaje (1/12 de la remuneración)" value="8.33%" />
            <Row label="Total en el año" value={usd(r.anual)} bold highlight />
            <Row label="Meses con derecho considerados" value={formatNumber(Math.min(12, parseFloat(meses) || 0), 0)} />
          </Rows>
          {r.aviso && <Note>{r.aviso}</Note>}
          <Note>
            Ley de Seguridad Social y Código del Trabajo (art. 196): después del primer año con el mismo empleador, recibes cada mes
            el 8.33% de tu remuneración. Puedes cobrarlo en tu rol de pagos o pedir que se deposite en el IESS, donde genera
            intereses y sirve como garantía de préstamos. No paga aportes ni impuesto a la renta.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
