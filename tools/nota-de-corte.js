'use client'

import { useMemo, useState } from 'react'
import { notaAcceso } from '@/lib/calc/espana'
import { Field, formatNumber, NumberInput, ResultBox, Row, Rows, secondaryButtonClass, Note } from '@/components/calc-ui'

export default function NotaDeCorte() {
  const [bach, setBach] = useState('')
  const [general, setGeneral] = useState('')
  const [especificas, setEspecificas] = useState([
    { nombre: 'Materia 1', nota: '', ponderacion: '0.2' },
    { nombre: 'Materia 2', nota: '', ponderacion: '0.2' },
  ])
  const [corte, setCorte] = useState('')

  const cambiar = (i, k, v) => setEspecificas((e) => e.map((x, j) => (j === i ? { ...x, [k]: v } : x)))

  const r = useMemo(() => {
    const b = parseFloat(bach)
    const g = parseFloat(general)
    if (!(b >= 5 && b <= 10 && g >= 0 && g <= 10)) return null
    return notaAcceso({
      bachillerato: b,
      faseGeneral: g,
      especificas: especificas.map((e) => ({ nombre: e.nombre, nota: parseFloat(e.nota) || 0, ponderacion: parseFloat(e.ponderacion) || 0 })),
    })
  }, [bach, general, especificas])

  const c = parseFloat(corte)
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Nota media de Bachillerato"><NumberInput value={bach} onChange={setBach} min="5" max="10" step="0.01" placeholder="Ej: 8.25" /></Field>
        <Field label="Nota de la fase de acceso (general)" hint="Media de los exámenes obligatorios de la PAU."><NumberInput value={general} onChange={setGeneral} min="0" max="10" step="0.01" placeholder="Ej: 7.1" /></Field>
        <Field label="Nota de corte de la carrera (opcional)"><NumberInput value={corte} onChange={setCorte} min="5" max="14" step="0.001" placeholder="Ej: 11.9" /></Field>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Exámenes de la fase de admisión (específica)</p>
        {especificas.map((e, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-center">
            <input value={e.nombre} onChange={(ev) => cambiar(i, 'nombre', ev.target.value)} className="col-span-12 sm:col-span-5 border border-gray-300 rounded-lg px-3 py-2.5" aria-label="Materia" />
            <div className="col-span-6 sm:col-span-3"><NumberInput value={e.nota} onChange={(v) => cambiar(i, 'nota', v)} min="0" max="10" step="0.01" placeholder="Nota" /></div>
            <select value={e.ponderacion} onChange={(ev) => cambiar(i, 'ponderacion', ev.target.value)} className="col-span-6 sm:col-span-4 border border-gray-300 rounded-lg px-3 py-2.5 bg-white" aria-label="Ponderación">
              <option value="0.2">Pondera 0.2</option>
              <option value="0.15">Pondera 0.15</option>
              <option value="0.1">Pondera 0.1</option>
              <option value="0">No pondera</option>
            </select>
          </div>
        ))}
        {especificas.length < 4 && (
          <button type="button" onClick={() => setEspecificas((e) => [...e, { nombre: `Materia ${e.length + 1}`, nota: '', ponderacion: '0.1' }])} className={secondaryButtonClass}>+ Añadir materia</button>
        )}
      </div>

      {r && (
        <ResultBox label="Nota de admisión (sobre 14)" value={formatNumber(r.admision, 3)}>
          <Rows>
            <Row label="Nota de acceso: 0.6 × Bachillerato + 0.4 × fase general" value={formatNumber(r.acceso, 3)} bold />
            {r.mejores.map((m) => (
              <Row key={m.nombre} label={`${m.nombre}: ${formatNumber(m.nota, 2)} × ${m.ponderacion}`} value={`+ ${formatNumber(m.puntos, 3)}`} />
            ))}
            {!isNaN(c) && (
              <Row label={`Nota de corte ${formatNumber(c, 3)}`} value={r.admision >= c ? `✓ La superas por ${formatNumber(r.admision - c, 3)}` : `✗ Te faltan ${formatNumber(c - r.admision, 3)}`} highlight />
            )}
          </Rows>
          {!r.aprobada && <Note>Para aprobar la PAU necesitas al menos un 4 en la fase general y una nota de acceso de 5 o más.</Note>}
          <Note>Solo cuentan las dos materias de la fase de admisión que más puntos sumen, con nota de 5 o más. Las ponderaciones dependen de la universidad y el grado: consulta las tablas oficiales de tu comunidad.</Note>
        </ResultBox>
      )}
    </div>
  )
}
