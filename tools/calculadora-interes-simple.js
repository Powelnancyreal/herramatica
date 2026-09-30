'use client'

import { useState } from 'react'
import { interesSimple } from '@/lib/calc/finanzas'
import { buttonClass, ErrorText, Field, formatMXN, formatNumber, inputClass, Note, NumberInput, ResultBox, Row, Rows, Tabs } from '@/components/calc-ui'

const OBJETIVOS = [
  { id: 'interes', label: 'Interés' },
  { id: 'capital', label: 'Capital' },
  { id: 'tasa', label: 'Tasa' },
  { id: 'tiempo', label: 'Tiempo' },
]

const UNIDADES = [
  { id: 'anios', label: 'Años' },
  { id: 'meses', label: 'Meses' },
  { id: 'dias', label: 'Días' },
]

export default function CalculadoraInteresSimple() {
  const [objetivo, setObjetivo] = useState('interes')
  const [capital, setCapital] = useState('')
  const [tasa, setTasa] = useState('')
  const [tiempo, setTiempo] = useState('')
  const [unidad, setUnidad] = useState('anios')
  const [base, setBase] = useState('365')
  const [interes, setInteres] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const aAnios = (t) => (unidad === 'anios' ? t : unidad === 'meses' ? t / 12 : t / parseInt(base, 10))

  function calcular() {
    const C = objetivo === 'capital' ? null : parseFloat(capital)
    const r = objetivo === 'tasa' ? null : parseFloat(tasa)
    const t = objetivo === 'tiempo' ? null : parseFloat(tiempo)
    const I = objetivo === 'interes' ? null : parseFloat(interes)
    const faltan = [C, r, t, I].filter((v) => v !== null && !(v > 0))
    if (faltan.length) return setError('Completa todos los campos con números mayores que cero.')
    setError('')
    const res = interesSimple({ capital: C, tasaAnual: r, anios: t === null ? null : aAnios(t), interes: I })
    setResult({ ...res, unidad, base })
  }

  const r = result
  const tiempoEnUnidad = r ? (r.unidad === 'anios' ? r.anios : r.unidad === 'meses' ? r.anios * 12 : r.anios * parseInt(r.base, 10)) : 0
  const principal = r
    ? { interes: formatMXN(r.interes), capital: formatMXN(r.capital), tasa: `${formatNumber(r.tasaAnual, 4)}% anual`, tiempo: `${formatNumber(tiempoEnUnidad, 2)} ${UNIDADES.find((u) => u.id === r.unidad).label.toLowerCase()}` }[objetivo]
    : ''

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">¿Qué quieres calcular?</p>
        <Tabs tabs={OBJETIVOS} value={objetivo} onChange={(v) => { setObjetivo(v); setResult(null) }} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {objetivo !== 'capital' && (
          <Field label="Capital inicial (C)">
            <NumberInput value={capital} onChange={setCapital} prefix="$" min="0" placeholder="Ej: 10000" />
          </Field>
        )}
        {objetivo !== 'tasa' && (
          <Field label="Tasa de interés anual (r)">
            <NumberInput value={tasa} onChange={setTasa} min="0" step="0.01" suffix="%" placeholder="Ej: 8" />
          </Field>
        )}
        {objetivo !== 'tiempo' && (
          <Field label="Tiempo (t)">
            <div className="flex gap-2">
              <NumberInput value={tiempo} onChange={setTiempo} min="0" step="any" placeholder="Ej: 18" />
              <select value={unidad} onChange={(e) => setUnidad(e.target.value)} className={`${inputClass} max-w-[8rem]`}>
                {UNIDADES.map((u) => (
                  <option key={u.id} value={u.id}>{u.label}</option>
                ))}
              </select>
            </div>
          </Field>
        )}
        {objetivo === 'tiempo' && (
          <Field label="Expresar el tiempo en">
            <select value={unidad} onChange={(e) => setUnidad(e.target.value)} className={inputClass}>
              {UNIDADES.map((u) => (
                <option key={u.id} value={u.id}>{u.label}</option>
              ))}
            </select>
          </Field>
        )}
        {objetivo !== 'interes' && (
          <Field label="Interés generado (I)">
            <NumberInput value={interes} onChange={setInteres} prefix="$" min="0" placeholder="Ej: 1200" />
          </Field>
        )}
        {unidad === 'dias' && (
          <Field label="Año base" hint="El año comercial (360 días) es el usual en bancos y en la escuela.">
            <select value={base} onChange={(e) => setBase(e.target.value)} className={inputClass}>
              <option value="360">Comercial (360 días)</option>
              <option value="365">Natural (365 días)</option>
            </select>
          </Field>
        )}
      </div>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular</button>

      {r && (
        <ResultBox label={OBJETIVOS.find((o) => o.id === objetivo).label} value={principal}>
          <Rows>
            <Row label="Capital (C)" value={formatMXN(r.capital)} />
            <Row label="Tasa anual (r)" value={`${formatNumber(r.tasaAnual, 4)}%`} />
            <Row label="Tiempo (t)" value={`${formatNumber(r.anios, 4)} años`} />
            <Row label="Interés (I)" value={formatMXN(r.interes)} />
            <Row label="Monto final (M = C + I)" value={formatMXN(r.montoFinal)} bold highlight />
          </Rows>
          <Note>
            Fórmula: I = C × r × t, con r en decimal y t en años. En el interés simple los intereses no se suman al capital, así
            que cada periodo genera la misma cantidad: {formatMXN(r.capital * (r.tasaAnual / 100))} por año.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
