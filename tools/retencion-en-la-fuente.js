'use client'

import { useState } from 'react'
import { COLOMBIA, retencionFuente } from '@/lib/calc/latam'
import { cop } from '@/components/calc-ui-eur'
import { buttonClass, ErrorText, Field, formatNumber, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

export default function RetencionEnLaFuente() {
  const [ingreso, setIngreso] = useState('')
  const [dependiente, setDependiente] = useState(false)
  const [prepagada, setPrepagada] = useState('')
  const [vivienda, setVivienda] = useState('')
  const [voluntarias, setVoluntarias] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const i = parseFloat(ingreso)
    if (!(i > 0)) return setError('Ingresa tu salario o ingreso laboral del mes.')
    setError('')
    setResult(retencionFuente({ ingreso: i, dependiente, prepagada: parseFloat(prepagada) || 0, interesesVivienda: parseFloat(vivienda) || 0, voluntarias: parseFloat(voluntarias) || 0 }))
  }

  const r = result
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Ingreso laboral mensual (salario, horas extra, bonos)"><NumberInput value={ingreso} onChange={setIngreso} prefix="$" min="0" placeholder="Ej: 8000000" /></Field>
        <Field label="Medicina prepagada mensual (tope 16 UVT)"><NumberInput value={prepagada} onChange={setPrepagada} prefix="$" min="0" placeholder="0" /></Field>
        <Field label="Intereses de crédito de vivienda mensuales (tope 100 UVT)"><NumberInput value={vivienda} onChange={setVivienda} prefix="$" min="0" placeholder="0" /></Field>
        <Field label="Aportes voluntarios a pensión o cuenta AFC"><NumberInput value={voluntarias} onChange={setVoluntarias} prefix="$" min="0" placeholder="0" /></Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={dependiente} onChange={(e) => setDependiente(e.target.checked)} /> Tengo dependientes económicos (deducción del 10%, tope 32 UVT)</label>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular retención en la fuente</button>

      {r && (
        <ResultBox label="Retención en la fuente mensual" value={cop(r.retencion)}>
          <Rows>
            <Row label="Aporte obligatorio a pensión (4%)" value={`−${cop(r.pension)}`} />
            <Row label="Aporte obligatorio a salud (4%)" value={`−${cop(r.salud)}`} />
            {r.fsp > 0 && <Row label={`Fondo de Solidaridad Pensional (${r.fspPct}%)`} value={`−${cop(r.fsp)}`} />}
            <Row label="Deducciones" value={`−${cop(r.deducciones)}`} />
            {r.exentaVoluntaria > 0 && <Row label="Aportes voluntarios exentos" value={`−${cop(r.exentaVoluntaria)}`} />}
            <Row label="Renta exenta del 25% (tope 790 UVT al año)" value={`−${cop(r.exenta25)}`} />
            <Row label="Beneficios aplicados (límite 40%, máx. 1.340 UVT al año)" value={cop(r.beneficios)} />
            <Row label={`Base gravable (${formatNumber(r.baseUVT, 2)} UVT)`} value={cop(r.base)} bold />
            <Row label="Tarifa marginal del art. 383" value={`${formatNumber(r.tarifa * 100, 0)}%`} highlight />
          </Rows>
          <Note>
            Procedimiento 1 con la tabla del artículo 383 del Estatuto Tributario y la UVT de 2026 ({cop(COLOMBIA.uvt)}). Si la
            base no supera 95 UVT ({cop(95 * COLOMBIA.uvt)}) no hay retención. El valor se redondea al múltiplo de mil más cercano.
            La retención es un anticipo del impuesto de renta: en la declaración anual se calcula el impuesto definitivo.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
