'use client'

import { useMemo, useState } from 'react'
import {
  diaDelAnio,
  diferenciaDias,
  formatoLargo,
  hoyISO,
  parseISO,
  semanaISO,
  sumarDias,
  sumarMeses,
  toISO,
} from '@/lib/calc/fechas'
import { Field, inputClass, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

const UNIDADES = [
  { id: 'dias', label: 'días' },
  { id: 'semanas', label: 'semanas' },
  { id: 'meses', label: 'meses' },
  { id: 'anios', label: 'años' },
]

const ATAJOS = [
  { n: 30, u: 'dias' },
  { n: 60, u: 'dias' },
  { n: 90, u: 'dias' },
  { n: 180, u: 'dias' },
  { n: 6, u: 'meses' },
  { n: 1, u: 'anios' },
]

export default function CalcularFechaFutura() {
  const [inicio, setInicio] = useState(hoyISO())
  const [cantidad, setCantidad] = useState('90')
  const [unidad, setUnidad] = useState('dias')
  const [sentido, setSentido] = useState('1')

  const r = useMemo(() => {
    const n = parseInt(cantidad, 10)
    if (!inicio || isNaN(n) || Math.abs(n) > 100000) return null
    const a = parseISO(inicio)
    const s = Number(sentido) * n
    let fecha
    if (unidad === 'dias') fecha = sumarDias(a, s)
    else if (unidad === 'semanas') fecha = sumarDias(a, s * 7)
    else if (unidad === 'meses') fecha = sumarMeses(a, s)
    else fecha = sumarMeses(a, s * 12)
    const ajustado = (unidad === 'meses' || unidad === 'anios') && fecha.getUTCDate() !== a.getUTCDate()
    return { fecha, dias: diferenciaDias(a, fecha), ajustado }
  }, [inicio, cantidad, unidad, sentido])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Field label="Fecha de partida">
          <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Operación">
          <select value={sentido} onChange={(e) => setSentido(e.target.value)} className={inputClass}>
            <option value="1">Sumar</option>
            <option value="-1">Restar</option>
          </select>
        </Field>
        <Field label="Cantidad">
          <NumberInput value={cantidad} onChange={setCantidad} min="0" step="1" />
        </Field>
        <Field label="Unidad">
          <select value={unidad} onChange={(e) => setUnidad(e.target.value)} className={inputClass}>
            {UNIDADES.map((u) => (
              <option key={u.id} value={u.id}>{u.label}</option>
            ))}
          </select>
        </Field>
      </div>
      <div className="flex flex-wrap gap-2">
        {ATAJOS.map((a) => (
          <button
            key={`${a.n}${a.u}`}
            type="button"
            onClick={() => {
              setCantidad(String(a.n))
              setUnidad(a.u)
              setSentido('1')
            }}
            className="px-3 py-1.5 rounded-full text-sm border bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            +{a.n} {UNIDADES.find((u) => u.id === a.u).label}
          </button>
        ))}
      </div>

      {r && (
        <ResultBox label="La fecha resultante es" value={toISO(r.fecha)}>
          <p className="text-lg font-semibold text-gray-800 capitalize">{formatoLargo(r.fecha)}</p>
          <Rows>
            <Row label="Días naturales de diferencia" value={Math.abs(r.dias)} />
            <Row label="Día del año" value={diaDelAnio(r.fecha)} />
            <Row label="Semana ISO" value={semanaISO(r.fecha)} />
          </Rows>
          {r.ajustado && (
            <p className="text-xs text-gray-600">
              El mes de destino no tiene ese día, así que la fecha se ajustó al último día del mes (por ejemplo, 31 de enero
              + 1 mes = 28 o 29 de febrero).
            </p>
          )}
        </ResultBox>
      )}
    </div>
  )
}
