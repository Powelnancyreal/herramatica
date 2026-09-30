'use client'

import { useState } from 'react'
import { FRECUENCIAS, tablaAmortizacion } from '@/lib/calc/finanzas'
import { buttonClass, ErrorText, Field, formatMXN, inputClass, NumberInput, ResultBox, Row, Rows, secondaryButtonClass } from '@/components/calc-ui'

const SISTEMAS = [
  { id: 'frances', label: 'Francés (pago fijo)' },
  { id: 'aleman', label: 'Alemán (abono a capital fijo)' },
  { id: 'americano', label: 'Americano (capital al final)' },
]

function descargarCSV(filas) {
  const lineas = ['Pago,Cuota,Capital,Interés,IVA,Saldo', ...filas.map((f) => [f.n, f.pago, f.capital, f.interes, f.iva, f.saldo].map((x, i) => (i === 0 ? x : x.toFixed(2))).join(','))]
  const blob = new Blob(['﻿' + lineas.join('\n')], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'tabla-de-amortizacion.csv'
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function TablaDeAmortizacion() {
  const [monto, setMonto] = useState('')
  const [tasa, setTasa] = useState('')
  const [plazo, setPlazo] = useState('')
  const [frecuenciaId, setFrecuenciaId] = useState('mensual')
  const [sistema, setSistema] = useState('frances')
  const [extra, setExtra] = useState('')
  const [iva, setIva] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const m = parseFloat(monto)
    const t = parseFloat(tasa)
    const n = parseInt(plazo, 10)
    if (!(m > 0)) return setError('Introduce el monto del préstamo.')
    if (!(t >= 0 && t < 500)) return setError('Introduce la tasa de interés anual.')
    if (!(n >= 1 && n <= 1200)) return setError('Introduce el número de pagos (entre 1 y 1200).')
    setError('')
    const f = FRECUENCIAS.find((x) => x.id === frecuenciaId)
    setResult({ f, ...tablaAmortizacion({ monto: m, tasaAnual: t, pagos: n, porAnio: f.porAnio, sistema, ivaInteres: iva ? 16 : 0, abonoExtra: parseFloat(extra) || 0 }), n })
  }

  const r = result

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Monto del préstamo">
          <NumberInput value={monto} onChange={setMonto} prefix="$" min="0" placeholder="Ej: 250000" />
        </Field>
        <Field label="Tasa de interés anual">
          <NumberInput value={tasa} onChange={setTasa} min="0" step="0.01" suffix="%" placeholder="Ej: 12" />
        </Field>
        <Field label="Número de pagos">
          <NumberInput value={plazo} onChange={setPlazo} min="1" step="1" placeholder="Ej: 36" />
        </Field>
        <Field label="Frecuencia de pago">
          <select value={frecuenciaId} onChange={(e) => setFrecuenciaId(e.target.value)} className={inputClass}>
            {FRECUENCIAS.map((f) => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Sistema de amortización">
          <select value={sistema} onChange={(e) => setSistema(e.target.value)} className={inputClass}>
            {SISTEMAS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Abono extra a capital por pago (opcional)">
          <NumberInput value={extra} onChange={setExtra} prefix="$" min="0" placeholder="0" />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={iva} onChange={(e) => setIva(e.target.checked)} /> Sumar IVA del 16% a los intereses (créditos de consumo en México)
      </label>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Generar tabla de amortización</button>

      {r && (
        <>
          <ResultBox label={sistema === 'frances' ? `Pago ${r.f.label.toLowerCase()}` : 'Primer pago'} value={formatMXN(r.primerPago)}>
            <Rows>
              <Row label="Total pagado" value={formatMXN(r.pagado)} bold />
              <Row label="Total de intereses" value={formatMXN(r.intereses)} />
              {r.iva > 0 && <Row label="IVA sobre intereses" value={formatMXN(r.iva)} />}
              <Row label="Número de pagos realizados" value={`${r.filas.length}${r.filas.length < r.n ? ` (ahorras ${r.n - r.filas.length} con el abono extra)` : ''}`} />
            </Rows>
          </ResultBox>
          <div className="flex gap-2 print:hidden">
            <button type="button" onClick={() => descargarCSV(r.filas)} className={secondaryButtonClass}>Descargar CSV (Excel)</button>
            <button type="button" onClick={() => window.print()} className={secondaryButtonClass}>Imprimir</button>
          </div>
          <div className="overflow-x-auto max-h-[32rem] overflow-y-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 sticky top-0">
                <tr>
                  <th className="text-left px-3 py-2">#</th>
                  <th className="text-right px-3 py-2">Pago</th>
                  <th className="text-right px-3 py-2">Capital</th>
                  <th className="text-right px-3 py-2">Interés</th>
                  {r.iva > 0 && <th className="text-right px-3 py-2">IVA</th>}
                  <th className="text-right px-3 py-2">Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {r.filas.map((f) => (
                  <tr key={f.n}>
                    <td className="px-3 py-1.5">{f.n}</td>
                    <td className="px-3 py-1.5 text-right">{formatMXN(f.pago)}</td>
                    <td className="px-3 py-1.5 text-right">{formatMXN(f.capital)}</td>
                    <td className="px-3 py-1.5 text-right">{formatMXN(f.interes)}</td>
                    {r.iva > 0 && <td className="px-3 py-1.5 text-right">{formatMXN(f.iva)}</td>}
                    <td className="px-3 py-1.5 text-right">{formatMXN(f.saldo)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
