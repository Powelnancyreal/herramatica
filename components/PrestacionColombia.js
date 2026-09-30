'use client'

import { useEffect, useState } from 'react'
import { COLOMBIA, tieneAuxilio } from '@/lib/calc/latam'
import { cop } from '@/components/calc-ui-eur'
import { buttonClass, ErrorText, Field, formatNumber, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

const MS_DIA = 86400000

// Días según el calendario laboral colombiano de 360 días (meses de 30 días).
export function dias360(inicio, fin) {
  const a = new Date(inicio + 'T00:00:00Z')
  const b = new Date(fin + 'T00:00:00Z')
  const d1 = Math.min(30, a.getUTCDate())
  const d2 = Math.min(30, b.getUTCDate())
  return (b.getUTCFullYear() - a.getUTCFullYear()) * 360 + (b.getUTCMonth() - a.getUTCMonth()) * 30 + (d2 - d1) + 1
}

// Formulario común de prestaciones en Colombia: salario, auxilio de transporte y periodo.
export default function PrestacionColombia({ titulo, boton, periodoPorDefecto, calcular: fn, nota, conIntereses = false }) {
  const [salario, setSalario] = useState('')
  const [variable, setVariable] = useState('')
  const [auxilio, setAuxilio] = useState('auto')
  const [inicio, setInicio] = useState('')
  const [fin, setFin] = useState('')
  // El periodo por defecto depende de la fecha del visitante, así que se fija en el cliente.
  useEffect(() => {
    const [a, b] = periodoPorDefecto()
    setInicio(a)
    setFin(b)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [cesantiasPrevias, setCesantiasPrevias] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function enviar() {
    const s = parseFloat(salario)
    if (!(s > 0)) return setError('Ingresa tu salario mensual.')
    if (!inicio || !fin || fin < inicio) return setError('Revisa las fechas del periodo.')
    setError('')
    const dias = Math.min(360, dias360(inicio, fin))
    const conAux = auxilio === 'si' || (auxilio === 'auto' && tieneAuxilio(s))
    const base = s + (parseFloat(variable) || 0) + (conAux ? COLOMBIA.auxilio : 0)
    setResult({ ...fn({ base, dias, cesantias: parseFloat(cesantiasPrevias) || 0 }), base, dias, conAux })
  }

  const r = result
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Salario mensual"><NumberInput value={salario} onChange={setSalario} prefix="$" min="0" placeholder="Ej: 2500000" /></Field>
        <Field label="Promedio de pagos variables (opcional)" hint="Horas extra, recargos o comisiones del periodo."><NumberInput value={variable} onChange={setVariable} prefix="$" min="0" placeholder="0" /></Field>
        <Field label="Desde"><input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5" /></Field>
        <Field label="Hasta"><input type="date" value={fin} onChange={(e) => setFin(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5" /></Field>
        <Field label="Auxilio de transporte" hint={`Aplica si ganas hasta 2 salarios mínimos (${cop(2 * COLOMBIA.smmlv)}).`}>
          <select value={auxilio} onChange={(e) => setAuxilio(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white">
            <option value="auto">Automático según mi salario</option>
            <option value="si">Sí lo recibo</option>
            <option value="no">No lo recibo</option>
          </select>
        </Field>
        {conIntereses && <Field label="Cesantías del periodo (si ya las conoces)" hint="Si lo dejas vacío, se calculan con tu salario."><NumberInput value={cesantiasPrevias} onChange={setCesantiasPrevias} prefix="$" min="0" /></Field>}
      </div>
      <ErrorText>{error}</ErrorText>
      <button onClick={enviar} className={buttonClass}>{boton}</button>

      {r && (
        <ResultBox label={titulo} value={cop(r.valor)}>
          <Rows>
            <Row label="Base de liquidación" value={`${cop(r.base)}${r.conAux ? ' (con auxilio)' : ''}`} />
            <Row label="Días trabajados en el periodo (año de 360)" value={formatNumber(r.dias, 0)} />
            {r.filas?.map(([k, v]) => (
              <Row key={k} label={k} value={v} />
            ))}
          </Rows>
          <Note>{nota} Valores 2026: salario mínimo {cop(COLOMBIA.smmlv)} y auxilio de transporte {cop(COLOMBIA.auxilio)}.</Note>
        </ResultBox>
      )}
    </div>
  )
}

export { MS_DIA }
