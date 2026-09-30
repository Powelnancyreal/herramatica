'use client'

import { useState } from 'react'
import { PERU, rentaQuinta } from '@/lib/calc/latam'
import { pen } from '@/components/calc-ui-eur'
import { buttonClass, ErrorText, Field, formatNumber, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

export default function RentaQuintaCategoria() {
  const [sueldo, setSueldo] = useState('')
  const [meses, setMeses] = useState('12')
  const [grati, setGrati] = useState(true)
  const [eps, setEps] = useState(false)
  const [otros, setOtros] = useState('')
  const [gastos, setGastos] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const s = parseFloat(sueldo)
    if (!(s > 0)) return setError('Ingresa tu remuneración mensual bruta.')
    setError('')
    const r = rentaQuinta({ remuneracion: s, meses: parseInt(meses, 10) || 12, gratificaciones: grati ? 2 : 0, bonificacion9: grati && !eps, otros: parseFloat(otros) || 0, deduccionAdicional: parseFloat(gastos) || 0 })
    // Con EPS, la bonificación extraordinaria es del 6.75% de la gratificación.
    if (grati && eps) {
      const extra = s * 2 * 0.0675
      Object.assign(r, rentaQuinta({ remuneracion: s, meses: parseInt(meses, 10) || 12, gratificaciones: 2, bonificacion9: false, otros: (parseFloat(otros) || 0) + extra, deduccionAdicional: parseFloat(gastos) || 0 }))
    }
    setResult(r)
  }

  const r = result
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Remuneración mensual bruta"><NumberInput value={sueldo} onChange={setSueldo} prefix="S/" min="0" placeholder="Ej: 5000" /></Field>
        <Field label="Meses de remuneración en el año"><NumberInput value={meses} onChange={setMeses} min="1" max="12" step="1" /></Field>
        <Field label="Otros ingresos anuales (bonos, utilidades, horas extra)"><NumberInput value={otros} onChange={setOtros} prefix="S/" min="0" placeholder="0" /></Field>
        <Field label="Gastos deducibles adicionales (hasta 3 UIT)" hint="Alquiler, honorarios médicos, restaurantes, EsSalud de trabajadores del hogar, etc."><NumberInput value={gastos} onChange={setGastos} prefix="S/" min="0" placeholder="0" /></Field>
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-gray-700">
        <label className="flex items-center gap-2"><input type="checkbox" checked={grati} onChange={(e) => setGrati(e.target.checked)} /> Recibo gratificaciones de julio y diciembre</label>
        {grati && <label className="flex items-center gap-2"><input type="checkbox" checked={eps} onChange={(e) => setEps(e.target.checked)} /> Estoy afiliado a una EPS</label>}
      </div>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular renta de quinta categoría</button>

      {r && (
        <ResultBox label="Impuesto anual estimado" value={pen(r.impuesto)}>
          <Rows>
            <Row label="Renta bruta anual proyectada" value={pen(r.bruta)} bold />
            <Row label="Deducción de 7 UIT" value={`−${pen(r.siete)}`} />
            {r.adicional > 0 && <Row label="Deducción adicional por gastos" value={`−${pen(r.adicional)}`} />}
            <Row label="Renta neta imponible" value={pen(r.neta)} />
            {r.detalle.map((d) => (
              <Row key={d.tasa} label={`Tramo al ${d.tasa}% sobre ${pen(d.monto)}`} value={pen(d.impuesto)} />
            ))}
            <Row label="Retención mensual promedio" value={pen(r.mensual)} highlight />
            <Row label="Tasa efectiva" value={`${formatNumber(r.tasaEfectiva, 2)}%`} />
          </Rows>
          <Note>
            UIT 2026: {pen(PERU.uit)}. Escala progresiva del art. 53 de la Ley del Impuesto a la Renta: 8% hasta 5 UIT, 14% hasta 20,
            17% hasta 35, 20% hasta 45 y 30% por encima. El empleador reparte la retención a lo largo del año con el procedimiento
            del art. 40 del reglamento, por lo que el monto de cada mes puede variar. La deducción adicional de hasta 3 UIT se
            aplica en la declaración anual.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
