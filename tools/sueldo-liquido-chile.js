'use client'

import { useState } from 'react'
import { CHILE, gratificacionChile, sueldoLiquidoChile } from '@/lib/calc/latam'
import { AvisoIndicadores, useIndicadoresChile } from '@/components/useIndicadoresChile'
import { clp } from '@/components/calc-ui-eur'
import { buttonClass, ErrorText, Field, formatNumber, inputClass, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

export default function SueldoLiquidoChile() {
  const ind = useIndicadoresChile()
  const [base, setBase] = useState('')
  const [otrosImp, setOtrosImp] = useState('')
  const [noImp, setNoImp] = useState('')
  const [grati, setGrati] = useState(true)
  const [afp, setAfp] = useState('1.27')
  const [salud, setSalud] = useState('fonasa')
  const [plan, setPlan] = useState('')
  const [contrato, setContrato] = useState('indefinido')
  const [ufManual, setUfManual] = useState('')
  const [utmManual, setUtmManual] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const b = parseFloat(base)
    const uf = parseFloat(ufManual) || ind.uf
    const utm = parseFloat(utmManual) || ind.utm
    if (!(b > 0)) return setError('Ingresa tu sueldo base mensual.')
    if (!(uf > 0 && utm > 0)) return setError('Falta el valor de la UF y la UTM: escríbelos manualmente.')
    setError('')
    const g = grati ? gratificacionChile({ sueldoMensual: b }).mensual : 0
    const imponible = b + g + (parseFloat(otrosImp) || 0)
    const r = sueldoLiquidoChile({ imponible, noImponible: parseFloat(noImp) || 0, uf, utm, comisionAfp: parseFloat(afp), salud, planIsapreUF: parseFloat(plan) || 0, indefinido: contrato === 'indefinido' })
    setResult({ ...r, imponible, g, uf, utm })
  }

  const r = result
  return (
    <div className="space-y-5">
      <AvisoIndicadores datos={ind} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Sueldo base mensual (bruto)"><NumberInput value={base} onChange={setBase} prefix="$" min="0" placeholder="Ej: 900000" /></Field>
        <Field label="Otros haberes imponibles (bonos, horas extra, comisiones)"><NumberInput value={otrosImp} onChange={setOtrosImp} prefix="$" min="0" placeholder="0" /></Field>
        <Field label="Haberes no imponibles (colación, movilización)"><NumberInput value={noImp} onChange={setNoImp} prefix="$" min="0" placeholder="0" /></Field>
        <Field label="AFP">
          <select value={afp} onChange={(e) => setAfp(e.target.value)} className={inputClass}>
            {CHILE.afps.map((a) => (
              <option key={a.nombre} value={a.comision}>AFP {a.nombre} (comisión {a.comision}%)</option>
            ))}
          </select>
        </Field>
        <Field label="Sistema de salud">
          <select value={salud} onChange={(e) => setSalud(e.target.value)} className={inputClass}>
            <option value="fonasa">Fonasa (7%)</option>
            <option value="isapre">Isapre</option>
          </select>
        </Field>
        {salud === 'isapre' && <Field label="Valor de tu plan de Isapre"><NumberInput value={plan} onChange={setPlan} min="0" step="0.01" suffix="UF" /></Field>}
        <Field label="Tipo de contrato">
          <select value={contrato} onChange={(e) => setContrato(e.target.value)} className={inputClass}>
            <option value="indefinido">Indefinido (pagas 0.6% de seguro de cesantía)</option>
            <option value="plazo">Plazo fijo u obra (no pagas seguro de cesantía)</option>
          </select>
        </Field>
        <Field label="UF y UTM (opcional)" hint={ind.uf ? `Hoy: UF ${clp(ind.uf)} · UTM ${clp(ind.utm)}` : undefined}>
          <div className="flex gap-2">
            <NumberInput value={ufManual} onChange={setUfManual} min="0" placeholder="UF" />
            <NumberInput value={utmManual} onChange={setUtmManual} min="0" placeholder="UTM" />
          </div>
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={grati} onChange={(e) => setGrati(e.target.checked)} /> Recibo gratificación legal mensual (25% con tope de 4.75 ingresos mínimos al año)
      </label>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular sueldo líquido</button>

      {r && (
        <ResultBox label="Sueldo líquido mensual" value={clp(r.liquido)}>
          <Rows>
            {r.g > 0 && <Row label="Gratificación legal" value={clp(r.g)} />}
            <Row label="Total imponible" value={clp(r.imponible)} bold />
            <Row label={`AFP (10% + ${afp}% de comisión)`} value={`−${clp(r.afp)}`} />
            <Row label={salud === 'fonasa' ? 'Salud Fonasa (7%)' : 'Salud Isapre'} value={`−${clp(r.salud)}`} />
            {r.cesantia > 0 && <Row label="Seguro de cesantía (0.6%)" value={`−${clp(r.cesantia)}`} />}
            <Row label={`Impuesto único (${formatNumber(r.enUTM, 1)} UTM de base)`} value={`−${clp(r.impuesto)}`} />
            <Row label="Total descuentos" value={`−${clp(r.descuentos)}`} bold />
          </Rows>
          <Note>
            Topes imponibles 2026: {CHILE.topeAfpUF} UF para AFP y salud y {CHILE.topeCesantiaUF} UF para el seguro de cesantía
            {r.topado ? ' (tu sueldo supera el tope de AFP)' : ''}. El impuesto único se calcula con la tabla mensual del SII en UTM.
            El empleador paga aparte el seguro de invalidez y sobrevivencia, su parte del seguro de cesantía y la cotización
            adicional de la reforma de pensiones.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
