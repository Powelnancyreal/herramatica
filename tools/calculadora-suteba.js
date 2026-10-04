'use client'

import { useState } from 'react'
import {
  ANTIGUEDAD_DOCENTE_PBA, calcularSueldoDocentePBA, DOCENTES_PBA_CARGOS, DOCENTES_PBA_COMPENSACION,
  DOCENTES_PBA_VALOR_INDICE, DOCENTES_PBA_VIGENCIA, porcentajeAntiguedadDocente,
} from '@/lib/calc/latam'
import { buttonClass, ErrorText, Field, inputClass, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

const ars = (n) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 }).format(n)

export default function CalculadoraSuteba() {
  const inicial = DOCENTES_PBA_CARGOS[0]
  const [cargoId, setCargoId] = useState(inicial.id)
  const [valorIndice, setValorIndice] = useState(String(DOCENTES_PBA_VALOR_INDICE))
  const [indice, setIndice] = useState(String(inicial.indice))
  const [cod438, setCod438] = useState(String(inicial.cod438))
  const [cod455, setCod455] = useState(String(inicial.cod455))
  const [compensacion, setCompensacion] = useState(String(DOCENTES_PBA_COMPENSACION))
  const [anios, setAnios] = useState('0')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function elegirCargo(id) {
    const c = DOCENTES_PBA_CARGOS.find((x) => x.id === id)
    setCargoId(id)
    setIndice(String(c.indice))
    setCod438(String(c.cod438))
    setCod455(String(c.cod455))
    setResult(null)
  }

  function calcular() {
    const nums = [valorIndice, indice, cod438, cod455, compensacion, anios].map((v) => parseFloat(v || '0'))
    if (!(nums[0] > 0) || !(nums[1] > 0)) return setError('Revisá el valor del índice y el índice de tu cargo.')
    if (nums.some((n) => !(n >= 0))) return setError('Los montos y los años no pueden ser negativos.')
    setError('')
    setResult(calcularSueldoDocentePBA({ valorIndice: nums[0], indice: nums[1], cod438: nums[2], cod455: nums[3], compensacion: nums[4], anios: nums[5] }))
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Cargo" id="sb-cargo">
          <select id="sb-cargo" value={cargoId} onChange={(e) => elegirCargo(e.target.value)} className={inputClass}>
            {DOCENTES_PBA_CARGOS.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </Field>
        <Field label="Años de antigüedad docente" id="sb-anios" hint={`Te corresponde un ${porcentajeAntiguedadDocente(parseFloat(anios) || 0)}% de bonificación.`}>
          <NumberInput id="sb-anios" value={anios} onChange={setAnios} min="0" step="1" suffix="años" />
        </Field>
        <Field label="Valor del índice (cargo testigo)" id="sb-valor" hint={`Referencia de ${DOCENTES_PBA_VIGENCIA}.`}>
          <NumberInput id="sb-valor" value={valorIndice} onChange={setValorIndice} prefix="$" min="0" />
        </Field>
        <Field label="Índice de tu cargo" id="sb-indice">
          <NumberInput id="sb-indice" value={indice} onChange={setIndice} min="0" step="0.01" />
        </Field>
        <Field label="Bonificación código 438" id="sb-438">
          <NumberInput id="sb-438" value={cod438} onChange={setCod438} prefix="$" min="0" />
        </Field>
        <Field label="Bonificación código 455" id="sb-455">
          <NumberInput id="sb-455" value={cod455} onChange={setCod455} prefix="$" min="0" />
        </Field>
        <Field label="Compensación provincial (ex FONID)" id="sb-comp" hint="No tiene descuentos.">
          <NumberInput id="sb-comp" value={compensacion} onChange={setCompensacion} prefix="$" min="0" />
        </Field>
      </div>

      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular sueldo docente</button>

      <div aria-live="polite">
        {result && (
          <ResultBox label="Sueldo neto estimado" value={ars(result.neto)}>
            <Rows>
              <Row label={`Básico: ${indice} × ${ars(parseFloat(valorIndice))}`} value={ars(result.basico)} />
              <Row label={`Antigüedad (${result.pct}% del básico)`} value={ars(result.antiguedad)} />
              <Row label="Código 438" value={ars(parseFloat(cod438) || 0)} />
              <Row label="Código 455" value={ars(parseFloat(cod455) || 0)} />
              <Row label="Total remunerativo" value={ars(result.remunerativo)} bold />
              <Row label="Compensación provincial (ex FONID)" value={ars(result.compensacion)} />
              <Row label="Sueldo bruto" value={ars(result.bruto)} bold />
              <Row label="IPS (16%)" value={ars(-result.ips)} />
              <Row label="IOMA (4,8%)" value={ars(-result.ioma)} />
              <Row label="Sueldo neto" value={ars(result.neto)} bold highlight />
            </Rows>
            <Note>
              Estimación con montos de referencia de {DOCENTES_PBA_VIGENCIA} y aportes de IPS e IOMA sobre lo remunerativo. Tu recibo
              puede incluir otros códigos (ruralidad, desfavorabilidad, cargos jerárquicos, módulos) y la cuota sindical si estás
              afiliado/a. Compará cada código con tu recibo y corregí los montos si hubo un nuevo acuerdo paritario.
            </Note>
          </ResultBox>
        )}
      </div>

      <details className="text-sm text-gray-700">
        <summary className="cursor-pointer font-medium">Tabla de bonificación por antigüedad</summary>
        <table className="mt-2 w-full border border-gray-200">
          <thead className="bg-gray-50"><tr><th className="text-left px-3 py-1.5">Antigüedad</th><th className="text-left px-3 py-1.5">Bonificación</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {ANTIGUEDAD_DOCENTE_PBA.map(([desde, pct], i) => {
              const hasta = ANTIGUEDAD_DOCENTE_PBA[i + 1]?.[0]
              return <tr key={desde}><td className="px-3 py-1.5">{hasta ? `${desde} a ${hasta - 1} años` : `${desde} años o más`}</td><td className="px-3 py-1.5">{pct}%</td></tr>
            })}
          </tbody>
        </table>
      </details>
    </div>
  )
}
