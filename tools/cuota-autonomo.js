'use client'

import { useState } from 'react'
import { TIPO_AUTONOMOS_2026, TRAMOS_AUTONOMOS, tramoAutonomo } from '@/lib/calc/espana'
import { eur } from '@/components/calc-ui-eur'
import { buttonClass, ErrorText, Field, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

export default function CuotaAutonomo() {
  const [ingresos, setIngresos] = useState('')
  const [gastos, setGastos] = useState('')
  const [periodo, setPeriodo] = useState('anual')
  const [societario, setSocietario] = useState(false)
  const [tarifaPlana, setTarifaPlana] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const i = parseFloat(ingresos)
    const g = parseFloat(gastos) || 0
    if (!(i >= 0) || ingresos === '') return setError('Introduce tus ingresos previstos.')
    setError('')
    const factor = periodo === 'anual' ? 12 : 1
    const neto = (i - g) / factor
    // Deducción por gastos genéricos: 7% (3% si eres autónomo societario).
    const rendimiento = Math.max(0, neto * (1 - (societario ? 0.03 : 0.07)))
    const t = tramoAutonomo(rendimiento)
    const cuotaMin = (t.baseMin * TIPO_AUTONOMOS_2026) / 100
    const cuotaMax = (t.baseMax * TIPO_AUTONOMOS_2026) / 100
    setResult({ neto, rendimiento, t, cuotaMin, cuotaMax, tarifaPlana, anual: (tarifaPlana ? 80 : cuotaMin) * 12 })
  }

  const r = result
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Ingresos de tu actividad (sin IVA)">
          <NumberInput value={ingresos} onChange={setIngresos} suffix="€" min="0" placeholder="Ej: 30000" />
        </Field>
        <Field label="Gastos deducibles">
          <NumberInput value={gastos} onChange={setGastos} suffix="€" min="0" placeholder="Ej: 6000" />
        </Field>
        <Field label="Los importes son">
          <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white">
            <option value="anual">Anuales</option>
            <option value="mensual">Mensuales</option>
          </select>
        </Field>
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-gray-700">
        <label className="flex items-center gap-2"><input type="checkbox" checked={societario} onChange={(e) => setSocietario(e.target.checked)} /> Soy autónomo societario</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={tarifaPlana} onChange={(e) => setTarifaPlana(e.target.checked)} /> Estoy en mi primer año (tarifa plana)</label>
      </div>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular mi cuota de autónomo</button>

      {r && (
        <ResultBox label={r.tarifaPlana ? 'Cuota con tarifa plana' : 'Cuota mínima mensual de tu tramo'} value={r.tarifaPlana ? '80,00 €/mes' : `${eur(r.cuotaMin)}/mes`}>
          <Rows>
            <Row label="Rendimiento neto mensual computable" value={eur(r.rendimiento)} bold />
            <Row label="Tramo" value={`${r.t.tabla} (hasta ${isFinite(r.t.hasta) ? eur(r.t.hasta) : 'sin límite'})`} />
            <Row label="Base mínima y máxima" value={`${eur(r.t.baseMin)} – ${eur(r.t.baseMax)}`} />
            <Row label={`Cuota mínima (${TIPO_AUTONOMOS_2026}%)`} value={eur(r.cuotaMin)} />
            <Row label="Cuota si eliges la base máxima" value={eur(r.cuotaMax)} />
            <Row label="Coste anual estimado" value={eur(r.anual)} highlight />
          </Rows>
          <Note>
            En 2026 se mantienen las bases de 2025. El tipo del {TIPO_AUTONOMOS_2026}% incluye contingencias comunes (28.30%),
            profesionales (1.30%), cese de actividad (0.90%), formación (0.10%) y MEI (0.90%). La tarifa plana de 80 € dura 12
            meses. La Seguridad Social regulariza la cuota cuando Hacienda conoce tus rendimientos reales.
          </Note>
        </ResultBox>
      )}

      <details className="text-sm">
        <summary className="cursor-pointer font-medium text-blue-600">Ver la tabla completa de tramos 2026</summary>
        <div className="overflow-x-auto mt-2">
          <table className="w-full border border-gray-200">
            <thead className="bg-gray-50 text-gray-600">
              <tr><th className="text-left px-3 py-2">Rendimiento neto mensual</th><th className="text-right px-3 py-2">Base mínima</th><th className="text-right px-3 py-2">Cuota mínima</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {TRAMOS_AUTONOMOS.map((t, i) => (
                <tr key={i}>
                  <td className="px-3 py-1.5">{i === 0 ? `Hasta ${eur(t.hasta)}` : isFinite(t.hasta) ? `${eur(TRAMOS_AUTONOMOS[i - 1].hasta)} – ${eur(t.hasta)}` : `Más de ${eur(TRAMOS_AUTONOMOS[i - 1].hasta)}`}</td>
                  <td className="px-3 py-1.5 text-right">{eur(t.baseMin)}</td>
                  <td className="px-3 py-1.5 text-right font-medium">{eur((t.baseMin * TIPO_AUTONOMOS_2026) / 100)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}
