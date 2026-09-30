'use client'

import { useState } from 'react'
import { calcularPlusvalia, COEFICIENTES_PLUSVALIA, etiquetaCoeficiente } from '@/lib/calc/espana'
import { eur } from '@/components/calc-ui-eur'
import { buttonClass, ErrorText, Field, formatNumber, inputClass, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

export default function CalcularPlusvalia() {
  const [compra, setCompra] = useState('')
  const [venta, setVenta] = useState('')
  const [suelo, setSuelo] = useState('')
  const [total, setTotal] = useState('')
  const [anios, setAnios] = useState('8')
  const [coef, setCoef] = useState('')
  const [tipo, setTipo] = useState('30')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const coefMax = COEFICIENTES_PLUSVALIA[Math.min(20, parseInt(anios, 10) || 0)]

  function calcular() {
    const pc = parseFloat(compra)
    const pv = parseFloat(venta)
    const vs = parseFloat(suelo)
    const vt = parseFloat(total)
    const t = parseFloat(tipo)
    if (!(pc > 0 && pv > 0)) return setError('Introduce el precio de compra y el de venta (de las escrituras).')
    if (!(vs > 0 && vt >= vs)) return setError('Introduce el valor catastral del suelo y el total (vienen en el recibo del IBI).')
    if (!(t > 0 && t <= 30)) return setError('El tipo impositivo debe estar entre 0 y 30%.')
    setError('')
    const c = parseFloat(coef) > 0 ? Math.min(parseFloat(coef), coefMax) : coefMax
    setResult({ ...calcularPlusvalia({ catastralSuelo: vs, catastralTotal: vt, anios: parseInt(anios, 10), coeficiente: c, tipo: t, precioCompra: pc, precioVenta: pv }), c })
  }

  const r = result
  const mejor = r && !r.noSujeta ? Math.min(r.cuotaObjetiva, r.cuotaReal) : 0
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Precio de compra (escritura)"><NumberInput value={compra} onChange={setCompra} suffix="€" min="0" placeholder="Ej: 150000" /></Field>
        <Field label="Precio de venta (escritura)"><NumberInput value={venta} onChange={setVenta} suffix="€" min="0" placeholder="Ej: 210000" /></Field>
        <Field label="Valor catastral del suelo (recibo del IBI)"><NumberInput value={suelo} onChange={setSuelo} suffix="€" min="0" placeholder="Ej: 40000" /></Field>
        <Field label="Valor catastral total"><NumberInput value={total} onChange={setTotal} suffix="€" min="0" placeholder="Ej: 100000" /></Field>
        <Field label="Años completos entre compra y venta">
          <select value={anios} onChange={(e) => setAnios(e.target.value)} className={inputClass}>
            {COEFICIENTES_PLUSVALIA.map((c, i) => (
              <option key={i} value={i}>{etiquetaCoeficiente(i)} (coef. máx. {c})</option>
            ))}
          </select>
        </Field>
        <Field label="Coeficiente de tu ayuntamiento (opcional)" hint={`Si lo dejas vacío se usa el máximo legal: ${coefMax}.`}>
          <NumberInput value={coef} onChange={setCoef} min="0" step="0.01" placeholder={String(coefMax)} />
        </Field>
        <Field label="Tipo de gravamen de tu ayuntamiento" hint="Máximo legal: 30%. Consulta la ordenanza fiscal municipal.">
          <NumberInput value={tipo} onChange={setTipo} min="0" max="30" step="0.1" suffix="%" />
        </Field>
      </div>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular plusvalía municipal</button>

      {r && (
        <ResultBox label="Plusvalía municipal a pagar" value={r.noSujeta ? 'No sujeta' : eur(mejor)}>
          {r.noSujeta ? (
            <Note>Vendes por menos (o igual) de lo que compraste: no hay incremento de valor y la operación no está sujeta al impuesto, según la reforma del RDL 26/2021. Debes acreditarlo con las escrituras.</Note>
          ) : (
            <>
              <Rows>
                <Row label={`Método objetivo: suelo × ${r.c}`} value={`${eur(r.objetiva)} de base`} />
                <Row label={`Cuota método objetivo (${tipo}%)`} value={eur(r.cuotaObjetiva)} highlight={r.cuotaObjetiva <= r.cuotaReal} />
                <Row label={`Método real: ganancia ${eur(r.ganancia)} × ${formatNumber(r.proporcionSuelo * 100, 1)}% de suelo`} value={`${eur(r.real)} de base`} />
                <Row label={`Cuota método real (${tipo}%)`} value={eur(r.cuotaReal)} highlight={r.cuotaReal < r.cuotaObjetiva} />
              </Rows>
              <Note>
                Te conviene el método {r.cuotaObjetiva <= r.cuotaReal ? 'objetivo' : 'real'}. El método real debe solicitarse al
                presentar la autoliquidación. Coeficientes máximos del RDL 8/2023, vigentes en 2026. Los gastos de compraventa
                (notaría, ITP, inmobiliaria) no se descuentan de la ganancia.
              </Note>
            </>
          )}
        </ResultBox>
      )}
    </div>
  )
}
