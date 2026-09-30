'use client'

import { useState } from 'react'
import { calcularCetes } from '@/lib/calc/finanzas'
import { buttonClass, ErrorText, Field, formatMXN, formatNumber, inputClass, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

const PLAZOS = [28, 91, 182, 364]

export default function CalculadoraCetes() {
  const [monto, setMonto] = useState('')
  const [plazo, setPlazo] = useState('28')
  const [tasa, setTasa] = useState('')
  const [reinversiones, setReinversiones] = useState('1')
  const [retencion, setRetencion] = useState('0.50')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const m = parseFloat(monto)
    const t = parseFloat(tasa)
    const k = parseInt(reinversiones, 10)
    const ret = parseFloat(retencion) || 0
    if (!(m >= 100)) return setError('En Cetesdirecto el monto mínimo es de $100.')
    if (!(t > 0 && t < 50)) return setError('Introduce la tasa anual de la última subasta (por ejemplo, 7.25).')
    if (!(k >= 1 && k <= 100)) return setError('Las reinversiones deben estar entre 1 y 100.')
    setError('')
    const p = parseInt(plazo, 10)
    const r = calcularCetes({ monto: m, tasaAnual: t, plazo: p, reinversiones: k, retencionAnual: ret })
    const sinRet = calcularCetes({ monto: m, tasaAnual: t, plazo: p, reinversiones: k, retencionAnual: 0 })
    setResult({ ...r, m, p, k, sinRet })
  }

  const r = result

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Monto a invertir">
          <NumberInput value={monto} onChange={setMonto} prefix="$" min="100" placeholder="Ej: 10000" />
        </Field>
        <Field label="Plazo">
          <select value={plazo} onChange={(e) => setPlazo(e.target.value)} className={inputClass}>
            {PLAZOS.map((p) => (
              <option key={p} value={p}>CETES a {p} días</option>
            ))}
          </select>
        </Field>
        <Field label="Tasa anual de la subasta" hint="Consulta la tasa vigente en cetesdirecto.com o en Banxico; cambia cada semana.">
          <NumberInput value={tasa} onChange={setTasa} min="0" step="0.01" suffix="%" placeholder="Ej: 7.25" />
        </Field>
        <Field label="Número de periodos (reinversión automática)" hint="Ej: 13 periodos de 28 días ≈ un año.">
          <NumberInput value={reinversiones} onChange={setReinversiones} min="1" max="100" step="1" />
        </Field>
        <Field label="Retención anual de ISR" hint="Tasa fijada en la Ley de Ingresos de la Federación; verifica la del año en curso.">
          <NumberInput value={retencion} onChange={setRetencion} min="0" step="0.01" suffix="%" />
        </Field>
      </div>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular rendimiento de CETES</button>

      {r && (
        <ResultBox label={`Ganancia neta en ${r.dias} días`} value={formatMXN(r.neto)}>
          <Rows>
            <Row label="Monto final" value={formatMXN(r.montoFinal)} bold />
            <Row label="Intereses brutos" value={formatMXN(r.interesBruto)} />
            <Row label="Retención de ISR" value={formatMXN(-r.retencion)} />
            <Row label="Rendimiento anual neto aproximado" value={`${formatNumber(r.rendimientoAnualNeto, 2)}%`} />
            <Row label="Precio por título (primer periodo)" value={`$${r.periodos[0].precio.toFixed(6)}`} />
            <Row label="Títulos comprados (primer periodo)" value={formatNumber(r.periodos[0].titulos, 0)} />
            <Row label="Remanente sin invertir" value={formatMXN(r.m - r.periodos[0].invertido)} />
          </Rows>
          <Note>
            Los CETES tienen un valor nominal de $10 y se compran con descuento: precio = 10 ÷ (1 + tasa × días ÷ 360). Solo se
            compran títulos completos, por eso queda un remanente. La proyección con reinversión supone que la tasa no cambia,
            aunque en realidad varía en cada subasta.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
