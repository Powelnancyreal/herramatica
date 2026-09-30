'use client'

import { useMemo, useState } from 'react'
import {
  construirFeriados,
  contarDiasHabiles,
  feriadosMexico,
  formatoLargo,
  hoyISO,
  parseISO,
  sumarDiasHabiles,
  toISO,
} from '@/lib/calc/fechas'
import { Field, inputClass, NumberInput, ResultBox, Row, Rows, Tabs } from '@/components/calc-ui'

export default function CalculadoraDiasHabiles() {
  const [modo, setModo] = useState('contar')
  const [inicio, setInicio] = useState(hoyISO())
  const [fin, setFin] = useState('')
  const [dias, setDias] = useState('10')
  const [pais, setPais] = useState('mx')
  const [sabadoHabil, setSabadoHabil] = useState(false)
  const [extra, setExtra] = useState('')

  const personalizados = useMemo(
    () => extra.split(/[\s,;]+/).filter((s) => /^\d{4}-\d{2}-\d{2}$/.test(s)),
    [extra]
  )

  const r = useMemo(() => {
    if (!inicio) return null
    const a = parseISO(inicio)
    if (modo === 'contar') {
      if (!fin) return null
      const b = parseISO(fin)
      const [y1, y2] = [Math.min(a.getUTCFullYear(), b.getUTCFullYear()), Math.max(a.getUTCFullYear(), b.getUTCFullYear())]
      if (y2 - y1 > 50) return null
      const feriados = construirFeriados({ pais, anioInicio: y1, anioFin: y2, personalizados })
      return { tipo: 'contar', ...contarDiasHabiles(a, b, { sabadoHabil, feriados }) }
    }
    const n = parseInt(dias, 10)
    if (!n || Math.abs(n) > 5000) return null
    const y = a.getUTCFullYear()
    const feriados = construirFeriados({ pais, anioInicio: y - 20, anioFin: y + 20, personalizados })
    const resultado = sumarDiasHabiles(a, n, { sabadoHabil, feriados })
    return { tipo: 'sumar', fecha: resultado, iso: toISO(resultado) }
  }, [modo, inicio, fin, dias, pais, sabadoHabil, personalizados])

  const anio = (inicio || hoyISO()).slice(0, 4)

  return (
    <div className="space-y-5">
      <Tabs
        tabs={[
          { id: 'contar', label: 'Contar días hábiles entre fechas' },
          { id: 'sumar', label: 'Sumar días hábiles a una fecha' },
        ]}
        value={modo}
        onChange={setModo}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Fecha de inicio">
          <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} className={inputClass} />
        </Field>
        {modo === 'contar' ? (
          <Field label="Fecha final">
            <input type="date" value={fin} onChange={(e) => setFin(e.target.value)} className={inputClass} />
          </Field>
        ) : (
          <Field label="Días hábiles a sumar" hint="Usa un número negativo para contar hacia atrás.">
            <NumberInput value={dias} onChange={setDias} step="1" />
          </Field>
        )}
        <Field label="Días festivos">
          <select value={pais} onChange={(e) => setPais(e.target.value)} className={inputClass}>
            <option value="mx">México (descanso obligatorio LFT)</option>
            <option value="ninguno">Sin festivos (solo fines de semana)</option>
          </select>
        </Field>
        <Field label="Festivos adicionales (opcional)" hint="Fechas AAAA-MM-DD separadas por comas, p. ej. vacaciones de la empresa.">
          <input value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="2026-12-24, 2026-12-31" className={inputClass} />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={sabadoHabil} onChange={(e) => setSabadoHabil(e.target.checked)} />
        El sábado es día hábil
      </label>

      {r?.tipo === 'contar' && (
        <ResultBox label="Días hábiles" value={r.habiles}>
          <Rows>
            <Row label="Días naturales (incluyendo ambas fechas)" value={r.naturales} />
            <Row label={sabadoHabil ? 'Domingos' : 'Sábados y domingos'} value={r.findes} />
            <Row label="Festivos que caen en día laborable" value={r.feriadosEnRango} />
            <Row label="Días hábiles" value={r.habiles} bold highlight />
          </Rows>
        </ResultBox>
      )}
      {r?.tipo === 'sumar' && (
        <ResultBox label={`${dias} días hábiles después`} value={r.iso}>
          <p className="text-sm text-gray-700 capitalize">{formatoLargo(r.fecha)}</p>
        </ResultBox>
      )}

      {pais === 'mx' && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Días de descanso obligatorio en México {anio}</h3>
          <ul className="text-sm text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-1">
            {feriadosMexico(Number(anio)).map((f) => (
              <li key={toISO(f.fecha)}>
                <span className="font-medium">{toISO(f.fecha)}</span> · {f.nombre}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
