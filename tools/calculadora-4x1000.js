'use client'

import { useState } from 'react'
import { calcularGMF, COLOMBIA, GMF_EXENCION_MENSUAL } from '@/lib/calc/latam'
import { buttonClass, ErrorText, Field, NumberInput, Note, ResultBox, Row, Rows } from '@/components/calc-ui'

const cop = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Math.round(n))

export default function Calculadora4x1000() {
  const [monto, setMonto] = useState('')
  const [exenta, setExenta] = useState(false)
  const [previos, setPrevios] = useState('0')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const m = parseFloat(monto)
    const p = parseFloat(previos || '0')
    if (!(m > 0)) return setError('Escribe el valor del retiro, pago o transferencia en pesos.')
    if (exenta && !(p >= 0)) return setError('Los retiros previos del mes no pueden ser negativos.')
    setError('')
    setResult(calcularGMF({ monto: m, exenta, retirosPreviosMes: exenta ? p : 0 }))
  }

  return (
    <div className="space-y-5">
      <Field label="Valor del retiro o transferencia" id="gmf-monto">
        <NumberInput id="gmf-monto" value={monto} onChange={setMonto} prefix="$" min="0" placeholder="Ej: 2000000" />
      </Field>

      <label className="flex items-start gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={exenta} onChange={(e) => setExenta(e.target.checked)} className="mt-1" />
        La cuenta está marcada como exenta del 4x1000 en mi banco
      </label>

      {exenta && (
        <Field label="Retiros que ya hiciste este mes desde esa cuenta" id="gmf-previos" hint={`El cupo exento es de 350 UVT al mes: ${cop(GMF_EXENCION_MENSUAL)} en 2026.`}>
          <NumberInput id="gmf-previos" value={previos} onChange={setPrevios} prefix="$" min="0" />
        </Field>
      )}

      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular 4x1000</button>

      <div aria-live="polite">
        {result && (
          <ResultBox label="Gravamen (4x1000) a pagar" value={cop(result.gmf)}>
            <Rows>
              <Row label="Valor del movimiento" value={cop(result.monto)} />
              {exenta && <Row label="Cupo exento disponible este mes" value={cop(result.cupo)} />}
              {exenta && <Row label="Parte exenta" value={cop(result.exento)} />}
              <Row label="Parte gravada" value={cop(result.gravado)} />
              <Row label="4x1000: parte gravada × 0.004" value={cop(result.gmf)} bold />
              <Row label="Total que sale de tu cuenta" value={cop(result.totalDebitado)} bold highlight />
              {exenta && <Row label="Cupo exento que te queda este mes" value={cop(result.cupoRestante)} />}
            </Rows>
            <Note>
              Cálculo con la UVT 2026 de {cop(COLOMBIA.uvt)}. El banco cobra el impuesto por cada movimiento y lo redondea según
              sus propios sistemas, por lo que puede haber diferencias de unos pesos.
            </Note>
          </ResultBox>
        )}
      </div>
    </div>
  )
}
