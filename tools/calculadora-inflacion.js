'use client'

import { useState } from 'react'
import { parseNumeros } from '@/lib/calc/mates'
import { buttonClass, ErrorText, Field, formatNumber, inputClass, Note, NumberInput, ResultBox, Row, Rows, Tabs } from '@/components/calc-ui'

const MODOS = [
  { id: 'mensual', label: 'Tasas mensuales' },
  { id: 'constante', label: 'Tasa constante' },
]

export default function CalculadoraInflacion() {
  const [modo, setModo] = useState('mensual')
  const [tasas, setTasas] = useState('2.5, 2.2, 3.1, 2.8, 2.4, 2.0')
  const [tasa, setTasa] = useState('')
  const [periodos, setPeriodos] = useState('12')
  const [unidad, setUnidad] = useState('meses')
  const [monto, setMonto] = useState('100000')
  const [aumento, setAumento] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    let lista
    if (modo === 'mensual') {
      lista = parseNumeros(tasas).numeros
      if (!lista.length) return setError('Escribí al menos una tasa de inflación (en %).')
    } else {
      const t = parseFloat(tasa)
      const n = parseInt(periodos, 10)
      if (isNaN(t) || !(n >= 1)) return setError('Escribí la tasa y la cantidad de periodos.')
      lista = Array(n).fill(t)
    }
    if (lista.some((x) => x <= -100)) return setError('Una tasa no puede ser de −100% o menos.')
    setError('')
    const factor = lista.reduce((f, x) => f * (1 + x / 100), 1)
    const m = parseFloat(monto) || 0
    const a = parseFloat(aumento)
    const meses = modo === 'mensual' || unidad === 'meses' ? lista.length : lista.length * 12
    setResult({
      acumulada: (factor - 1) * 100,
      promedio: (Math.pow(factor, 1 / lista.length) - 1) * 100,
      anualizada: meses > 0 ? (Math.pow(factor, 12 / meses) - 1) * 100 : 0,
      factor,
      ajustado: m * factor,
      poder: m / factor,
      perdida: (1 - 1 / factor) * 100,
      real: isNaN(a) ? null : ((1 + a / 100) / factor - 1) * 100,
      n: lista.length,
      m,
    })
  }

  const r = result
  return (
    <div className="space-y-5">
      <Tabs tabs={MODOS} value={modo} onChange={setModo} />
      {modo === 'mensual' ? (
        <Field label="Tasas de inflación de cada periodo (%)" hint="Separadas por comas o espacios; por ejemplo, las tasas mensuales del índice de precios de tu país.">
          <textarea value={tasas} onChange={(e) => setTasas(e.target.value)} rows={3} className={inputClass} />
        </Field>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Tasa de inflación por periodo"><NumberInput value={tasa} onChange={setTasa} step="0.01" suffix="%" placeholder="Ej: 3" /></Field>
          <Field label="Cantidad de periodos">
            <div className="flex gap-2">
              <NumberInput value={periodos} onChange={setPeriodos} min="1" step="1" />
              <select value={unidad} onChange={(e) => setUnidad(e.target.value)} className={`${inputClass} max-w-[8rem]`}>
                <option value="meses">Meses</option>
                <option value="anios">Años</option>
              </select>
            </div>
          </Field>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Monto a actualizar (opcional)"><NumberInput value={monto} onChange={setMonto} prefix="$" min="0" /></Field>
        <Field label="Aumento de sueldo o rendimiento en el mismo periodo (opcional)"><NumberInput value={aumento} onChange={setAumento} step="0.1" suffix="%" placeholder="Ej: 20" /></Field>
      </div>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular inflación acumulada</button>

      {r && (
        <ResultBox label={`Inflación acumulada en ${r.n} periodos`} value={`${formatNumber(r.acumulada, 2)}%`}>
          <Rows>
            <Row label="Promedio por periodo (geométrico)" value={`${formatNumber(r.promedio, 2)}%`} />
            {(modo === 'mensual' || unidad === 'meses') && <Row label="Equivalente anualizado" value={`${formatNumber(r.anualizada, 2)}%`} />}
            {r.m > 0 && <Row label={`$${formatNumber(r.m, 2)} de antes equivalen hoy a`} value={`$${formatNumber(r.ajustado, 2)}`} bold />}
            {r.m > 0 && <Row label={`$${formatNumber(r.m, 2)} de hoy compran lo que antes`} value={`$${formatNumber(r.poder, 2)}`} />}
            <Row label="Pérdida de poder adquisitivo" value={`${formatNumber(r.perdida, 2)}%`} />
            {r.real !== null && <Row label="Variación real de tu aumento" value={`${r.real >= 0 ? '+' : ''}${formatNumber(r.real, 2)}%`} highlight />}
          </Rows>
          <Note>La inflación se acumula multiplicando, no sumando: 3% y 3% dan 6.09%, no 6%. Usá las tasas oficiales de tu país (en Argentina, el IPC del INDEC).</Note>
        </ResultBox>
      )}
    </div>
  )
}
