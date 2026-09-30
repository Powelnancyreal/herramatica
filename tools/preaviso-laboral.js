'use client'

import { useState } from 'react'
import { preavisoArgentina } from '@/lib/calc/latam'
import { ars } from '@/components/calc-ui-eur'
import { buttonClass, ErrorText, Field, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

export default function PreavisoLaboral() {
  const [sueldo, setSueldo] = useState('')
  const [ingreso, setIngreso] = useState('')
  const [despido, setDespido] = useState('')
  const [prueba, setPrueba] = useState(false)
  const [otorgado, setOtorgado] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const s = parseFloat(sueldo)
    if (!(s > 0)) return setError('Ingresá tu mejor remuneración mensual, normal y habitual.')
    if (!ingreso || !despido || despido < ingreso) return setError('Ingresá la fecha de ingreso y la de despido.')
    setError('')
    const a = new Date(ingreso + 'T00:00:00Z')
    const b = new Date(despido + 'T00:00:00Z')
    const meses = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth()) - (b.getUTCDate() < a.getUTCDate() ? 1 : 0)
    setResult({ ...preavisoArgentina({ sueldo: s, antiguedadMeses: meses, fechaDespido: despido, periodoPrueba: prueba, otorgado }), antig: meses })
  }

  const r = result
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Remuneración mensual bruta"><NumberInput value={sueldo} onChange={setSueldo} prefix="$" min="0" placeholder="Ej: 1200000" /></Field>
        <Field label="Fecha de ingreso"><input type="date" value={ingreso} onChange={(e) => setIngreso(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5" /></Field>
        <Field label="Fecha de despido"><input type="date" value={despido} onChange={(e) => setDespido(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5" /></Field>
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-gray-700">
        <label className="flex items-center gap-2"><input type="checkbox" checked={prueba} onChange={(e) => setPrueba(e.target.checked)} /> Estaba en período de prueba</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={otorgado} onChange={(e) => setOtorgado(e.target.checked)} /> Me dieron el preaviso por escrito y lo trabajé</label>
      </div>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular preaviso</button>

      {r && (
        <ResultBox label="Total por preaviso e integración" value={ars(r.total)}>
          <Rows>
            <Row label="Antigüedad" value={`${Math.floor(r.antig / 12)} años y ${r.antig % 12} meses`} />
            <Row label="Plazo de preaviso que correspondía" value={r.meses === 0.5 ? '15 días' : `${r.meses} ${r.meses === 1 ? 'mes' : 'meses'}`} bold />
            <Row label="Indemnización sustitutiva del preaviso (art. 232)" value={ars(r.sustitutiva)} />
            <Row label={`Integración del mes de despido (art. 233, ${r.diasIntegracion} días)`} value={ars(r.integracion)} />
            <Row label="SAC sobre preaviso e integración (1/12)" value={ars(r.sac)} />
          </Rows>
          <Note>
            Ley de Contrato de Trabajo: el empleador debe preavisar con 15 días en el período de prueba, 1 mes si la antigüedad
            no supera los 5 años y 2 meses si es mayor. Si no lo hace, paga la indemnización sustitutiva. El trabajador que
            renuncia debe preavisar con 15 días. Esta calculadora no incluye la indemnización por antigüedad; para eso usá
            nuestra calculadora de indemnización por despido.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
