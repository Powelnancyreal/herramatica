'use client'

import { useState } from 'react'
import { pen } from '@/components/calc-ui-eur'
import { buttonClass, ErrorText, Field, formatNumber, Note, NumberInput, ResultBox, Row, Rows, Tabs } from '@/components/calc-ui'

const MODOS = [
  { id: 'truncas', label: 'Vacaciones truncas' },
  { id: 'completas', label: 'Vacaciones no gozadas' },
]

export default function VacacionesPeru() {
  const [modo, setModo] = useState('truncas')
  const [sueldo, setSueldo] = useState('')
  const [asignacion, setAsignacion] = useState(false)
  const [meses, setMeses] = useState('')
  const [dias, setDias] = useState('')
  const [periodos, setPeriodos] = useState('1')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const s = parseFloat(sueldo)
    if (!(s > 0)) return setError('Ingresa tu remuneración mensual.')
    setError('')
    const base = s + (asignacion ? 123 : 0)
    if (modo === 'truncas') {
      const m = Math.min(11, parseInt(meses, 10) || 0)
      const d = Math.min(29, parseInt(dias, 10) || 0)
      const valor = (base / 12) * m + (base / 360) * d
      setResult({ modo, base, valor, filas: [[`${m} meses × ${pen(base)} ÷ 12`, pen((base / 12) * m)], [`${d} días × ${pen(base)} ÷ 360`, pen((base / 360) * d)]] })
    } else {
      const p = Math.max(1, parseInt(periodos, 10) || 1)
      // Por cada periodo no gozado a tiempo: remuneración por el trabajo + remuneración vacacional + indemnización.
      const remuneracion = base * p
      const indemnizacion = base * p
      setResult({ modo, base, valor: remuneracion + indemnizacion, filas: [['Remuneración vacacional no gozada', pen(remuneracion)], ['Indemnización vacacional (art. 23, D. Leg. 713)', pen(indemnizacion)]], p })
    }
  }

  const r = result
  return (
    <div className="space-y-5">
      <Tabs tabs={MODOS} value={modo} onChange={(m) => { setModo(m); setResult(null) }} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Remuneración mensual"><NumberInput value={sueldo} onChange={setSueldo} prefix="S/" min="0" placeholder="Ej: 2500" /></Field>
        {modo === 'truncas' ? (
          <>
            <Field label="Meses completos desde tu último récord"><NumberInput value={meses} onChange={setMeses} min="0" max="11" step="1" /></Field>
            <Field label="Días adicionales"><NumberInput value={dias} onChange={setDias} min="0" max="29" step="1" /></Field>
          </>
        ) : (
          <Field label="Periodos vencidos sin gozar"><NumberInput value={periodos} onChange={setPeriodos} min="1" step="1" /></Field>
        )}
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={asignacion} onChange={(e) => setAsignacion(e.target.checked)} /> Recibo asignación familiar (10% de la RMV: S/ 123 desde octubre de 2026)</label>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular vacaciones</button>

      {r && (
        <ResultBox label={r.modo === 'truncas' ? 'Vacaciones truncas' : 'Pago por vacaciones no gozadas'} value={pen(r.valor)}>
          <Rows>
            <Row label="Remuneración computable" value={pen(r.base)} />
            {r.filas.map(([k, v]) => (
              <Row key={k} label={k} value={v} />
            ))}
          </Rows>
          <Note>
            {r.modo === 'truncas'
              ? 'Las vacaciones truncas se pagan al terminar el contrato por el tiempo trabajado sin completar un año de récord: un dozavo de la remuneración por mes y un treintavo de dozavo por día.'
              : `Si no gozaste tus vacaciones dentro del año siguiente al que las generaste, te corresponde la triple remuneración: la del trabajo realizado (ya pagada en tu sueldo), la vacacional y una indemnización equivalente. Aquí se muestran las dos últimas${r.p > 1 ? ` por ${r.p} periodos` : ''}.`}{' '}
            Según el D. Leg. 713, corresponden 30 días calendario por cada año completo de servicios con el récord vacacional
            cumplido. Pueden fraccionarse según el D. Leg. 1405. La asignación familiar usa la remuneración mínima vital vigente desde el 1 de octubre de 2026 (S/ 1,230, D. S. 015-2026-TR).
          </Note>
        </ResultBox>
      )}
      <p className="text-xs text-gray-500">{formatNumber(30, 0)} días de vacaciones por año · pago antes de iniciar el descanso.</p>
    </div>
  )
}
