'use client'

import { useState } from 'react'
import { contarSemanasPeriodos, semanasRequeridasLey97 } from '@/lib/calc/mexico-laboral'
import { hoyISO } from '@/lib/calc/fechas'
import { buttonClass, ErrorText, formatNumber, inputClass, Note, ResultBox, Row, Rows, secondaryButtonClass } from '@/components/calc-ui'

const nuevo = () => ({ id: Math.random().toString(36).slice(2), empresa: '', inicio: '', fin: '', actual: false })

export default function SemanasCotizadasIMSS() {
  const [periodos, setPeriodos] = useState([nuevo()])
  const [regimen, setRegimen] = useState('97')
  const [anioRetiro, setAnioRetiro] = useState(String(new Date().getFullYear()))
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const actualizar = (id, campo, valor) => setPeriodos((ps) => ps.map((p) => (p.id === id ? { ...p, [campo]: valor } : p)))

  function calcular() {
    const hoy = hoyISO()
    const lista = periodos.map((p) => ({ ...p, fin: p.actual ? hoy : p.fin }))
    if (lista.some((p) => !p.inicio || !p.fin)) return setError('Completa la fecha de alta y de baja de cada periodo (o marca «sigo trabajando»).')
    if (lista.some((p) => p.fin < p.inicio)) return setError('Hay un periodo con la fecha de baja anterior a la de alta.')
    setError('')
    const c = contarSemanasPeriodos(lista)
    const requeridas = regimen === '73' ? 500 : semanasRequeridasLey97(parseInt(anioRetiro, 10) || new Date().getFullYear())
    const faltan = Math.max(0, requeridas - c.semanas)
    const fechaMeta = new Date(Date.now() + faltan * 7 * 86400000)
    setResult({ ...c, requeridas, faltan, fechaMeta })
  }

  const r = result

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        {periodos.map((p, i) => (
          <div key={p.id} className="rounded-lg border border-gray-200 p-3 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Empleo {i + 1}</label>
              <input value={p.empresa} onChange={(e) => actualizar(p.id, 'empresa', e.target.value)} className={inputClass} placeholder="Empresa (opcional)" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Fecha de alta</label>
              <input type="date" value={p.inicio} onChange={(e) => actualizar(p.id, 'inicio', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Fecha de baja</label>
              <input type="date" value={p.actual ? '' : p.fin} disabled={p.actual} onChange={(e) => actualizar(p.id, 'fin', e.target.value)} className={inputClass} />
            </div>
            <div className="flex items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={p.actual} onChange={(e) => actualizar(p.id, 'actual', e.target.checked)} /> Sigo trabajando
              </label>
              {periodos.length > 1 && (
                <button type="button" onClick={() => setPeriodos((ps) => ps.filter((x) => x.id !== p.id))} className="text-red-600 text-sm" aria-label="Eliminar periodo">
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
        <button type="button" onClick={() => setPeriodos((ps) => [...ps, nuevo()])} className={secondaryButtonClass}>+ Añadir otro empleo</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Régimen de pensión</label>
          <select value={regimen} onChange={(e) => setRegimen(e.target.value)} className={inputClass}>
            <option value="97">Ley 97 (empezaste a cotizar desde el 1/7/1997)</option>
            <option value="73">Ley 73 (cotizabas antes del 1/7/1997)</option>
          </select>
        </div>
        {regimen === '97' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Año en que piensas pensionarte</label>
            <input type="number" value={anioRetiro} onChange={(e) => setAnioRetiro(e.target.value)} min="2021" max="2080" className={inputClass} />
          </div>
        )}
      </div>

      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular semanas cotizadas</button>

      {r && (
        <ResultBox label="Semanas cotizadas estimadas" value={formatNumber(r.semanas, 0)}>
          <Rows>
            <Row label="Días cotizados" value={formatNumber(r.dias, 0)} />
            {r.traslapeDias > 0 && <Row label="Días traslapados (no se cuentan dos veces)" value={formatNumber(r.traslapeDias, 0)} />}
            <Row label="Semanas requeridas para pensionarte" value={formatNumber(r.requeridas, 0)} />
            <Row label="Te faltan" value={r.faltan > 0 ? `${formatNumber(r.faltan, 0)} semanas` : '¡Ya las tienes!'} bold highlight />
            {r.faltan > 0 && (
              <Row label="Las completarías cotizando sin interrupción hacia" value={r.fechaMeta.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })} />
            )}
          </Rows>
          <Note>
            Estimación a partir de tus fechas: el IMSS solo reconoce las semanas en que tu patrón te dio de alta y pagó cuotas,
            así que tu constancia oficial puede diferir. Descárgala gratis en el portal del IMSS con tu CURP y tu NSS.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
