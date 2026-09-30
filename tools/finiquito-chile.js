'use client'

import { useState } from 'react'
import { finiquitoChile } from '@/lib/calc/latam'
import { AvisoIndicadores, useIndicadoresChile } from '@/components/useIndicadoresChile'
import { clp } from '@/components/calc-ui-eur'
import { buttonClass, ErrorText, Field, formatNumber, inputClass, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

const CAUSALES = [
  { id: 'necesidades', label: 'Necesidades de la empresa (art. 161)' },
  { id: 'desahucio', label: 'Desahucio del empleador (art. 161, inciso 2)' },
  { id: 'injustificado', label: 'Despido declarado injustificado (art. 168)' },
  { id: 'renuncia', label: 'Renuncia voluntaria (art. 159 n.º 2)' },
  { id: 'mutuo', label: 'Mutuo acuerdo (art. 159 n.º 1)' },
  { id: 'plazo', label: 'Término del plazo o de la obra (art. 159 n.º 4 y 5)' },
]

export default function FiniquitoChile() {
  const ind = useIndicadoresChile()
  const [sueldo, setSueldo] = useState('')
  const [ingreso, setIngreso] = useState('')
  const [termino, setTermino] = useState('')
  const [causal, setCausal] = useState('necesidades')
  const [aviso, setAviso] = useState(false)
  const [pendientes, setPendientes] = useState('')
  const [recargo, setRecargo] = useState('30')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const s = parseFloat(sueldo)
    if (!(s > 0)) return setError('Ingresa tu última remuneración mensual (incluye gratificación y haberes fijos).')
    if (!ingreso || !termino || termino < ingreso) return setError('Ingresa la fecha de inicio y de término del contrato.')
    if (!ind.uf) return setError('Aún no se carga el valor de la UF; espera unos segundos.')
    setError('')
    const a = new Date(ingreso + 'T00:00:00Z')
    const b = new Date(termino + 'T00:00:00Z')
    let meses = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth()) - (b.getUTCDate() < a.getUTCDate() ? 1 : 0)
    meses = Math.max(0, meses)
    const anios = Math.floor(meses / 12)
    setResult(finiquitoChile({ sueldo: s, anios, meses: meses % 12, uf: ind.uf, causal, vacacionesPendientes: parseFloat(pendientes) || 0, recargoPct: parseFloat(recargo), avisoDado: aviso }))
  }

  const r = result
  return (
    <div className="space-y-5">
      <AvisoIndicadores datos={ind} que="la UF" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Última remuneración mensual"><NumberInput value={sueldo} onChange={setSueldo} prefix="$" min="0" placeholder="Ej: 1100000" /></Field>
        <Field label="Causal de término">
          <select value={causal} onChange={(e) => setCausal(e.target.value)} className={inputClass}>
            {CAUSALES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Fecha de inicio del contrato"><input type="date" value={ingreso} onChange={(e) => setIngreso(e.target.value)} className={inputClass} /></Field>
        <Field label="Fecha de término"><input type="date" value={termino} onChange={(e) => setTermino(e.target.value)} className={inputClass} /></Field>
        <Field label="Días hábiles de vacaciones pendientes (de años anteriores)"><NumberInput value={pendientes} onChange={setPendientes} min="0" placeholder="0" /></Field>
        {causal === 'injustificado' && (
          <Field label="Recargo del art. 168">
            <select value={recargo} onChange={(e) => setRecargo(e.target.value)} className={inputClass}>
              <option value="30">30% (necesidades de la empresa improcedente)</option>
              <option value="50">50% (causal sin fundamento)</option>
              <option value="80">80% (causal del art. 160 improcedente)</option>
              <option value="100">100% (art. 160 sin motivo plausible)</option>
            </select>
          </Field>
        )}
      </div>
      {['necesidades', 'desahucio', 'injustificado'].includes(causal) && (
        <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={aviso} onChange={(e) => setAviso(e.target.checked)} /> Me avisaron con 30 días de anticipación</label>
      )}
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular finiquito</button>

      {r && (
        <ResultBox label="Total estimado del finiquito" value={clp(r.total)}>
          <Rows>
            <Row label="Base de cálculo (tope 90 UF)" value={clp(r.base)} />
            {r.indemnizacion > 0 && <Row label={`Indemnización por años de servicio (${r.aniosIndemn} ${r.aniosIndemn === 1 ? 'año' : 'años'})`} value={clp(r.indemnizacion)} />}
            {r.aviso > 0 && <Row label="Indemnización sustitutiva del aviso previo" value={clp(r.aviso)} />}
            {r.recargo > 0 && <Row label="Recargo legal" value={clp(r.recargo)} />}
            <Row label={`Feriado proporcional y pendiente (${formatNumber(r.diasCorridos, 1)} días corridos)`} value={clp(r.feriado)} />
          </Rows>
          <Note>
            Código del Trabajo: 30 días de la última remuneración por año de servicio y fracción superior a 6 meses, con tope de
            11 años y de 90 UF por mes. Las vacaciones se generan a razón de 15 días hábiles por año (1.25 por mes) y se pagan en
            días corridos; aquí se aproxima con un factor de 7/5. No incluye remuneraciones del último mes ni otros haberes
            pendientes. El finiquito debe firmarse ante un ministro de fe.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
