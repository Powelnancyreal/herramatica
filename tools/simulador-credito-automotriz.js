'use client'

import { useState } from 'react'
import { tablaAmortizacion } from '@/lib/calc/finanzas'
import { calcularCAT } from '@/lib/calc/mexico-laboral'
import { buttonClass, ErrorText, Field, formatMXN, formatNumber, inputClass, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

const PLAZOS = [12, 24, 36, 48, 60, 72]

export default function SimuladorCreditoAutomotriz() {
  const [precio, setPrecio] = useState('')
  const [enganche, setEnganche] = useState('20')
  const [plazo, setPlazo] = useState('48')
  const [tasa, setTasa] = useState('')
  const [comision, setComision] = useState('2')
  const [seguro, setSeguro] = useState('')
  const [iva, setIva] = useState(true)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const p = parseFloat(precio)
    const e = parseFloat(enganche)
    const t = parseFloat(tasa)
    const n = parseInt(plazo, 10)
    const c = parseFloat(comision) || 0
    const s = parseFloat(seguro) || 0
    if (!(p > 0)) return setError('Introduce el precio del auto.')
    if (!(e >= 0 && e < 100)) return setError('El enganche debe estar entre 0% y 99%.')
    if (!(t >= 0 && t < 100)) return setError('Introduce la tasa de interés anual del crédito.')
    setError('')
    const engancheMonto = (p * e) / 100
    const financiado = p - engancheMonto
    const comisionMonto = (financiado * c) / 100
    const tabla = tablaAmortizacion({ monto: financiado, tasaAnual: t, pagos: n, porAnio: 12, ivaInteres: iva ? 16 : 0 })
    const seguroMensual = s / 12
    const mensualidad = tabla.primerPago + seguroMensual
    const sinIva = tablaAmortizacion({ monto: financiado, tasaAnual: t, pagos: n, porAnio: 12 })
    const cat = calcularCAT({ monto: financiado, comisionApertura: comisionMonto, pago: sinIva.primerPago, numeroPagos: n, porAnio: 12 })
    const desembolsoInicial = engancheMonto + comisionMonto
    const total = desembolsoInicial + tabla.pagado + s * (n / 12)
    setResult({ engancheMonto, financiado, comisionMonto, tabla, mensualidad, seguroMensual, cat, desembolsoInicial, total, sobreprecio: total - p, n })
  }

  const r = result

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Precio del auto">
          <NumberInput value={precio} onChange={setPrecio} prefix="$" min="0" placeholder="Ej: 380000" />
        </Field>
        <Field label="Enganche" hint="La mayoría de las financieras piden entre 10% y 35%.">
          <NumberInput value={enganche} onChange={setEnganche} min="0" max="99" step="1" suffix="%" />
        </Field>
        <Field label="Plazo">
          <select value={plazo} onChange={(e) => setPlazo(e.target.value)} className={inputClass}>
            {PLAZOS.map((p) => (
              <option key={p} value={p}>{p} meses ({p / 12} {p === 12 ? 'año' : 'años'})</option>
            ))}
          </select>
        </Field>
        <Field label="Tasa de interés anual (sin IVA)">
          <NumberInput value={tasa} onChange={setTasa} min="0" step="0.01" suffix="%" placeholder="Ej: 13.9" />
        </Field>
        <Field label="Comisión por apertura">
          <NumberInput value={comision} onChange={setComision} min="0" step="0.1" suffix="%" />
        </Field>
        <Field label="Seguro del auto anual (opcional)" hint="Se suma a la mensualidad si lo pagas en parcialidades.">
          <NumberInput value={seguro} onChange={setSeguro} prefix="$" min="0" placeholder="Ej: 14000" />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={iva} onChange={(e) => setIva(e.target.checked)} /> Incluir IVA del 16% sobre intereses (así cobran los créditos automotrices en México)
      </label>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Simular crédito automotriz</button>

      {r && (
        <ResultBox label="Mensualidad estimada" value={formatMXN(r.mensualidad)}>
          <Rows>
            <Row label="Enganche" value={formatMXN(r.engancheMonto)} />
            <Row label="Comisión por apertura" value={formatMXN(r.comisionMonto)} />
            <Row label="Pago inicial total" value={formatMXN(r.desembolsoInicial)} bold />
            <Row label="Monto financiado" value={formatMXN(r.financiado)} />
            <Row label="Pago de crédito (capital + interés + IVA)" value={formatMXN(r.tabla.primerPago)} />
            {r.seguroMensual > 0 && <Row label="Seguro mensual" value={formatMXN(r.seguroMensual)} />}
            <Row label="Intereses totales" value={formatMXN(r.tabla.intereses)} />
            {r.tabla.iva > 0 && <Row label="IVA de intereses" value={formatMXN(r.tabla.iva)} />}
            <Row label="CAT estimado (sin IVA)" value={r.cat ? `${formatNumber(r.cat.cat * 100, 1)}%` : '—'} />
            <Row label="Costo total del auto" value={formatMXN(r.total)} bold highlight />
            <Row label="Pagas de más frente al precio de contado" value={formatMXN(r.sobreprecio)} />
          </Rows>
          <Note>
            Estimación con pagos fijos (sistema francés). Algunas agencias suman seguro de vida o de desempleo, GPS o
            accesorios al financiamiento. Pide siempre la tabla de amortización y compara el CAT de varias opciones.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
