'use client'

import { useState } from 'react'
import { CHILE } from '@/lib/calc/latam'
import { AvisoIndicadores, useIndicadoresChile } from '@/components/useIndicadoresChile'
import { clp } from '@/components/calc-ui-eur'
import { buttonClass, ErrorText, Field, formatNumber, Note, NumberInput, ResultBox } from '@/components/calc-ui'

export default function CotizacionAfp() {
  const ind = useIndicadoresChile()
  const [imponible, setImponible] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const s = parseFloat(imponible)
    if (!(s > 0)) return setError('Ingresa tu remuneración imponible mensual.')
    if (!ind.uf) return setError('Aún no se carga la UF; espera unos segundos.')
    setError('')
    const tope = CHILE.topeAfpUF * ind.uf
    const base = Math.min(s, tope)
    const filas = CHILE.afps.map((a) => ({ ...a, obligatoria: base * 0.1, comisionMonto: (base * a.comision) / 100, total: base * (0.1 + a.comision / 100) })).sort((x, y) => x.total - y.total)
    setResult({ base, tope, filas, topado: s > tope })
  }

  const r = result
  return (
    <div className="space-y-5">
      <AvisoIndicadores datos={ind} que="la UF" />
      <Field label="Remuneración imponible mensual"><NumberInput value={imponible} onChange={setImponible} prefix="$" min="0" placeholder="Ej: 1100000" /></Field>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular cotización AFP</button>

      {r && (
        <ResultBox label="Cotización obligatoria (10%) a tu cuenta" value={clp(r.filas[0].obligatoria)}>
          <div className="overflow-x-auto bg-white rounded-lg border border-blue-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr><th className="text-left px-3 py-2">AFP</th><th className="text-right px-3 py-2">Comisión</th><th className="text-right px-3 py-2">Descuento total</th><th className="text-right px-3 py-2">Al año</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {r.filas.map((f, i) => (
                  <tr key={f.nombre} className={i === 0 ? 'bg-green-50' : ''}>
                    <td className="px-3 py-2 font-medium">{f.nombre}</td>
                    <td className="px-3 py-2 text-right">{formatNumber(f.comision, 2)}% ({clp(f.comisionMonto)})</td>
                    <td className="px-3 py-2 text-right font-semibold">{clp(f.total)}</td>
                    <td className="px-3 py-2 text-right">{clp(f.total * 12)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Note>
            Base imponible usada: {clp(r.base)}{r.topado ? ` (tope de ${CHILE.topeAfpUF} UF)` : ''}. Todas las AFP depositan el mismo 10%
            en tu cuenta individual; la diferencia está en la comisión, que se descuenta aparte. Entre la AFP más cara y la más
            barata hay {clp((r.filas[r.filas.length - 1].total - r.filas[0].total) * 12)} al año. El empleador paga además el seguro de
            invalidez y sobrevivencia y la cotización adicional de la reforma de pensiones. Comisiones de referencia 2026:
            confírmalas en spensiones.cl.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
