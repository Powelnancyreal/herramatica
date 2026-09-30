'use client'

import { useMemo, useState } from 'react'
import { Field, formatNumber, inputClass, NumberInput, ResultBox, Row, Rows, secondaryButtonClass } from '@/components/calc-ui'

const ESCALAS = [
  { id: '10', label: '0 a 10 (México, España, Argentina)', min: 0, max: 10, aprobado: 6 },
  { id: '20', label: '0 a 20 (Perú)', min: 0, max: 20, aprobado: 11 },
  { id: '5', label: '0 a 5 (Colombia)', min: 0, max: 5, aprobado: 3 },
  { id: '7', label: '1 a 7 (Chile)', min: 1, max: 7, aprobado: 4 },
  { id: '100', label: '0 a 100', min: 0, max: 100, aprobado: 60 },
]

let siguienteId = 3

export default function CalculadoraNotaNecesaria() {
  const [escalaId, setEscalaId] = useState('10')
  const escala = ESCALAS.find((e) => e.id === escalaId)
  const [objetivo, setObjetivo] = useState('6')
  const [evaluaciones, setEvaluaciones] = useState([
    { id: 1, nota: '', peso: '30' },
    { id: 2, nota: '', peso: '30' },
  ])

  function cambiarEscala(id) {
    const e = ESCALAS.find((x) => x.id === id)
    setEscalaId(id)
    setObjetivo(String(e.aprobado))
  }

  function actualizar(id, campo, valor) {
    setEvaluaciones((ev) => ev.map((e) => (e.id === id ? { ...e, [campo]: valor } : e)))
  }

  const r = useMemo(() => {
    const validas = evaluaciones
      .map((e) => ({ nota: parseFloat(e.nota), peso: parseFloat(e.peso) }))
      .filter((e) => !isNaN(e.nota) && e.peso > 0)
    const pesoHecho = validas.reduce((s, e) => s + e.peso, 0)
    const obj = parseFloat(objetivo)
    if (!validas.length || isNaN(obj) || pesoHecho >= 100) return null
    const puntos = validas.reduce((s, e) => s + e.nota * e.peso, 0)
    const pesoRestante = 100 - pesoHecho
    const necesaria = (obj * 100 - puntos) / pesoRestante
    return {
      promedioActual: puntos / pesoHecho,
      pesoHecho,
      pesoRestante,
      necesaria,
      imposible: necesaria > escala.max,
      asegurado: necesaria <= escala.min,
      notaMinimaFinal: (puntos + escala.min * pesoRestante) / 100,
      notaMaximaFinal: (puntos + escala.max * pesoRestante) / 100,
    }
  }, [evaluaciones, objetivo, escala])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Escala de calificación">
          <select value={escalaId} onChange={(e) => cambiarEscala(e.target.value)} className={inputClass}>
            {ESCALAS.map((e) => (
              <option key={e.id} value={e.id}>{e.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Nota final que quieres obtener" hint={`Aprobado habitual en esta escala: ${escala.aprobado}.`}>
          <NumberInput value={objetivo} onChange={setObjetivo} min={escala.min} max={escala.max} step="0.1" />
        </Field>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Evaluaciones que ya tienes</p>
        {evaluaciones.map((e, idx) => (
          <div key={e.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
            <NumberInput value={e.nota} onChange={(v) => actualizar(e.id, 'nota', v)} placeholder={`Nota ${idx + 1}`} step="0.1" />
            <NumberInput value={e.peso} onChange={(v) => actualizar(e.id, 'peso', v)} placeholder="Peso" suffix="%" />
            <button
              type="button"
              aria-label="Quitar evaluación"
              onClick={() => setEvaluaciones((ev) => ev.filter((x) => x.id !== e.id))}
              className="text-gray-400 hover:text-red-600 px-2"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          className={secondaryButtonClass}
          onClick={() => setEvaluaciones((ev) => [...ev, { id: siguienteId++, nota: '', peso: '' }])}
        >
          + Añadir evaluación
        </button>
      </div>

      {r && (
        <ResultBox
          label={`Nota necesaria en el ${formatNumber(r.pesoRestante)}% restante`}
          value={r.imposible ? 'No alcanzable' : r.asegurado ? '¡Ya lo tienes!' : formatNumber(r.necesaria)}
        >
          <Rows>
            <Row label="Tu promedio actual" value={formatNumber(r.promedioActual)} />
            <Row label="Porcentaje ya evaluado" value={`${formatNumber(r.pesoHecho)}%`} />
            <Row label="Porcentaje que falta" value={`${formatNumber(r.pesoRestante)}%`} />
            <Row label="Nota final si sacas el mínimo en lo que falta" value={formatNumber(r.notaMinimaFinal)} />
            <Row label="Nota final si sacas el máximo en lo que falta" value={formatNumber(r.notaMaximaFinal)} />
            {!r.imposible && !r.asegurado && <Row label="Nota que necesitas" value={formatNumber(r.necesaria)} bold highlight />}
          </Rows>
          {r.imposible && (
            <p className="text-sm text-gray-700">
              Aun sacando {escala.max} en todo lo que queda, tu nota final sería {formatNumber(r.notaMaximaFinal)}. Revisa si
              hay recuperación o trabajos extra.
            </p>
          )}
          {r.asegurado && (
            <p className="text-sm text-gray-700">Incluso con la nota mínima en lo que falta, alcanzas tu objetivo.</p>
          )}
        </ResultBox>
      )}
    </div>
  )
}
