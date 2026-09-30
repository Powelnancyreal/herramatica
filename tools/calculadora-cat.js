'use client'

import { useState } from 'react'
import { calcularCAT, pagoPeriodico, PERIODICIDADES } from '@/lib/calc/mexico-laboral'
import {
  buttonClass,
  ErrorText,
  Field,
  formatMXN,
  inputClass,
  Note,
  NumberInput,
  ResultBox,
  Row,
  Rows,
  Tabs,
} from '@/components/calc-ui'

export default function CalculadoraCAT() {
  const [modo, setModo] = useState('pago')
  const [monto, setMonto] = useState('')
  const [comision, setComision] = useState('')
  const [comisionTipo, setComisionTipo] = useState('pct')
  const [pago, setPago] = useState('')
  const [tasa, setTasa] = useState('')
  const [numeroPagos, setNumeroPagos] = useState('')
  const [periodicidad, setPeriodicidad] = useState('mensual')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const m = parseFloat(monto)
    const n = parseInt(numeroPagos, 10)
    const porAnio = PERIODICIDADES.find((p) => p.id === periodicidad).porAnio
    if (!(m > 0)) return setError('Introduce el monto del crédito.')
    if (!(n > 0)) return setError('Introduce el número de pagos.')
    const c = parseFloat(comision) || 0
    const comisionMonto = comisionTipo === 'pct' ? (m * c) / 100 : c
    if (comisionMonto >= m) return setError('La comisión no puede ser igual o mayor que el crédito.')

    let p
    if (modo === 'pago') {
      p = parseFloat(pago)
      if (!(p > 0)) return setError('Introduce el pago periódico.')
    } else {
      const t = parseFloat(tasa)
      if (!(t >= 0)) return setError('Introduce la tasa de interés anual.')
      p = pagoPeriodico({ monto: m, tasaAnual: t, numeroPagos: n, porAnio })
    }
    const r = calcularCAT({ monto: m, comisionApertura: comisionMonto, pago: p, numeroPagos: n, porAnio })
    if (!r) return setError('Revisa los datos: el crédito neto debe ser positivo.')
    setError('')
    setResult({ ...r, pago: p, comisionMonto, porAnio, tasaNominal: r.tasaPeriodo * porAnio })
  }

  return (
    <div className="space-y-5">
      <Tabs
        tabs={[
          { id: 'pago', label: 'Conozco el pago' },
          { id: 'tasa', label: 'Conozco la tasa' },
        ]}
        value={modo}
        onChange={setModo}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Monto del crédito">
          <NumberInput value={monto} onChange={setMonto} prefix="$" min="0" placeholder="Ej: 100000" />
        </Field>
        <Field label="Periodicidad de pago">
          <select value={periodicidad} onChange={(e) => setPeriodicidad(e.target.value)} className={inputClass}>
            {PERIODICIDADES.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Número de pagos">
          <NumberInput value={numeroPagos} onChange={setNumeroPagos} min="1" step="1" placeholder="Ej: 24" />
        </Field>
        {modo === 'pago' ? (
          <Field label="Pago periódico (sin IVA)" hint="Incluye intereses, capital y seguros obligatorios.">
            <NumberInput value={pago} onChange={setPago} prefix="$" min="0" />
          </Field>
        ) : (
          <Field label="Tasa de interés anual" hint="La tasa ordinaria que anuncia el banco.">
            <NumberInput value={tasa} onChange={setTasa} min="0" suffix="%" />
          </Field>
        )}
        <Field label="Comisión por apertura (opcional)">
          <div className="flex gap-2">
            <NumberInput value={comision} onChange={setComision} min="0" />
            <select value={comisionTipo} onChange={(e) => setComisionTipo(e.target.value)} className={`${inputClass} w-28`}>
              <option value="pct">%</option>
              <option value="monto">$</option>
            </select>
          </div>
        </Field>
      </div>

      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular CAT</button>

      {result && (
        <ResultBox label="Costo Anual Total (CAT) sin IVA" value={`${(result.cat * 100).toFixed(2)}%`}>
          <Rows>
            <Row label="Pago periódico" value={formatMXN(result.pago)} />
            <Row label="Comisión por apertura" value={formatMXN(result.comisionMonto)} />
            <Row label="Total a pagar" value={formatMXN(result.totalPagado)} />
            <Row label="Costo total del crédito (lo que pagas de más)" value={formatMXN(result.costoTotal)} bold />
            <Row label="Tasa efectiva por periodo" value={`${(result.tasaPeriodo * 100).toFixed(4)}%`} />
            <Row label="Tasa nominal anual equivalente" value={`${(result.tasaNominal * 100).toFixed(2)}%`} />
            <Row label="CAT" value={`${(result.cat * 100).toFixed(2)}%`} bold highlight />
          </Rows>
          <Note>
            Calculado con la metodología del Banco de México: la tasa que iguala el dinero que realmente recibes (monto menos
            comisiones) con el valor presente de tus pagos, anualizada de forma compuesta. Úsalo para comparar créditos
            con el mismo plazo; el CAT oficial de cada banco puede incluir conceptos adicionales.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
