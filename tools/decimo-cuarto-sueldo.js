'use client'

import { useState } from 'react'
import { ECUADOR } from '@/lib/calc/latam'
import { usd } from '@/components/calc-ui-eur'
import { buttonClass, ErrorText, Field, formatNumber, inputClass, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

const REGIONES = {
  sierra: { label: 'Sierra y Amazonía', periodo: '1 de agosto al 31 de julio', pago: '15 de agosto' },
  costa: { label: 'Costa y Galápagos', periodo: '1 de marzo al 28 de febrero', pago: '15 de marzo' },
}

export default function DecimoCuartoSueldo() {
  const [region, setRegion] = useState('sierra')
  const [dias, setDias] = useState('360')
  const [jornada, setJornada] = useState('40')
  const [sbu, setSbu] = useState(String(ECUADOR.sbu))
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const d = Math.min(360, Math.max(0, parseFloat(dias) || 0))
    const h = Math.min(40, Math.max(1, parseFloat(jornada) || 40))
    const s = parseFloat(sbu) || ECUADOR.sbu
    if (!(d > 0)) return setError('Ingresa los días trabajados en el periodo.')
    setError('')
    const valor = ((s * d) / 360) * (h / 40)
    setResult({ valor, d, h, s, mensual: (s / 12) * (h / 40) })
  }

  const r = result
  const reg = REGIONES[region]
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Región">
          <select value={region} onChange={(e) => setRegion(e.target.value)} className={inputClass}>
            {Object.entries(REGIONES).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </Field>
        <Field label={`Días trabajados del ${reg.periodo}`} hint="Año completo = 360 días."><NumberInput value={dias} onChange={setDias} min="0" max="360" step="1" /></Field>
        <Field label="Horas de trabajo a la semana" hint="Con jornada parcial se paga en proporción."><NumberInput value={jornada} onChange={setJornada} min="1" max="40" step="1" /></Field>
        <Field label="Salario básico unificado"><NumberInput value={sbu} onChange={setSbu} prefix="$" min="0" /></Field>
      </div>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular décimo cuarto sueldo</button>

      {r && (
        <ResultBox label="Décimo cuarto sueldo" value={usd(r.valor)}>
          <Rows>
            <Row label="Salario básico unificado 2026" value={usd(r.s)} />
            <Row label={`Proporción por días (${formatNumber(r.d, 0)} de 360)`} value={`${formatNumber((r.d / 360) * 100, 1)}%`} />
            {r.h < 40 && <Row label={`Proporción por jornada (${r.h} de 40 horas)`} value={`${formatNumber((r.h / 40) * 100, 1)}%`} />}
            <Row label="Valor mensualizado" value={usd(r.mensual)} />
            <Row label="Fecha límite de pago" value={reg.pago} bold highlight />
          </Rows>
          <Note>
            Art. 113 del Código del Trabajo: un salario básico unificado al año para todos los trabajadores, sin importar su
            sueldo. En 2026 el SBU es de {usd(ECUADOR.sbu)}. Puede cobrarse mensualizado si lo solicitas. No paga aportes al IESS ni
            impuesto a la renta.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
