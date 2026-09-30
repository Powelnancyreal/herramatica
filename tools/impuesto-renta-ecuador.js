'use client'

import { useState } from 'react'
import { CANASTAS_POR_CARGAS, ECUADOR, impuestoRentaEcuador, TABLA_IR_ECUADOR_2026 } from '@/lib/calc/latam'
import { usd } from '@/components/calc-ui-eur'
import { buttonClass, ErrorText, Field, formatNumber, inputClass, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

export default function ImpuestoRentaEcuador() {
  const [ingreso, setIngreso] = useState('')
  const [periodo, setPeriodo] = useState('mensual')
  const [gastos, setGastos] = useState('')
  const [cargas, setCargas] = useState('0')
  const [iess, setIess] = useState(true)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const i = parseFloat(ingreso)
    if (!(i > 0)) return setError('Ingresa tus ingresos gravados (sin décimos ni fondos de reserva).')
    setError('')
    const anual = periodo === 'mensual' ? i * 12 : i
    setResult(impuestoRentaEcuador({ ingresosAnuales: anual, gastosPersonales: parseFloat(gastos) || 0, cargas: parseInt(cargas, 10), aporteIess: iess }))
  }

  const r = result
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Ingresos gravados">
          <div className="flex gap-2">
            <NumberInput value={ingreso} onChange={setIngreso} prefix="$" min="0" placeholder="Ej: 2500" />
            <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} className={`${inputClass} max-w-[8rem]`}>
              <option value="mensual">Mensual</option>
              <option value="anual">Anual</option>
            </select>
          </div>
        </Field>
        <Field label="Gastos personales del año" hint="Vivienda, alimentación, salud, educación, vestimenta y turismo."><NumberInput value={gastos} onChange={setGastos} prefix="$" min="0" placeholder="Ej: 5000" /></Field>
        <Field label="Cargas familiares">
          <select value={cargas} onChange={(e) => setCargas(e.target.value)} className={inputClass}>
            {CANASTAS_POR_CARGAS.map((c, i) => (
              <option key={i} value={i}>{i === 5 ? '5 o más' : i} ({c} canastas básicas)</option>
            ))}
          </select>
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={iess} onChange={(e) => setIess(e.target.checked)} /> Soy trabajador en relación de dependencia (resto el aporte personal al IESS del 9.45%)</label>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular impuesto a la renta</button>

      {r && (
        <ResultBox label="Impuesto a la renta anual" value={usd(r.aPagar)}>
          <Rows>
            {r.aporte > 0 && <Row label="Aporte personal al IESS (9.45%)" value={`−${usd(r.aporte)}`} />}
            <Row label="Base imponible" value={usd(r.base)} bold />
            <Row label={`Tramo: desde ${usd(r.fila[0])}, ${r.fila[3]}% sobre el excedente`} value={usd(r.causado)} />
            <Row label={`Rebaja por gastos personales (18% de hasta ${usd(r.topeGastos)})`} value={`−${usd(r.rebaja)}`} />
            <Row label="Retención mensual aproximada" value={usd(r.mensual)} highlight />
            <Row label="Tasa efectiva" value={`${formatNumber(r.base ? (r.aPagar / (r.base + r.aporte)) * 100 : 0, 2)}%`} />
          </Rows>
          <Note>
            Tabla 2026 del SRI (Resolución NAC-DGERCGC25-00000043): fracción básica exenta de {usd(TABLA_IR_ECUADOR_2026[0][1])}.
            La rebaja por gastos personales es el 18% del menor valor entre tus gastos y {r.canastas} canastas familiares básicas
            ({usd(ECUADOR.canasta)} cada una). El décimo tercero, el décimo cuarto y los fondos de reserva no pagan impuesto.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
