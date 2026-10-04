'use client'

import { useState } from 'react'
import { notaPorEvaluaciones, promedioPorCreditos, redondear } from '@/lib/calc/notas'
import { ErrorText, formatNumber, inputClass, Note, ResultBox, Row, Rows, secondaryButtonClass, Tabs } from '@/components/calc-ui'

// Calculadora de notas reutilizable: nota de un curso por evaluaciones ponderadas y promedio del ciclo por créditos.
// escala: { minimo, maximo, aprobatoria, umbral (nota sin redondear que ya aprueba), decimales (redondeo de la nota final), paso }
export default function CalculadoraNotas({ escala, plantilla, etiquetaFila = 'Evaluación', notaRedondeo, notaPlantilla }) {
  const [tab, setTab] = useState('curso')
  return (
    <div className="space-y-5">
      <Tabs tabs={[{ id: 'curso', label: 'Nota del curso' }, { id: 'ciclo', label: 'Promedio por créditos' }]} value={tab} onChange={setTab} />
      {tab === 'curso' ? (
        <NotaCurso escala={escala} plantilla={plantilla} etiquetaFila={etiquetaFila} notaRedondeo={notaRedondeo} notaPlantilla={notaPlantilla} />
      ) : (
        <PromedioCiclo escala={escala} />
      )}
    </div>
  )
}

const fuera = (n, e) => n < e.minimo || n > e.maximo

function NotaCurso({ escala, plantilla, etiquetaFila, notaRedondeo, notaPlantilla }) {
  const [filas, setFilas] = useState(plantilla.map((p) => ({ ...p, peso: String(p.peso), nota: '' })))
  const set = (i, campo, v) => setFilas((f) => f.map((x, j) => (j === i ? { ...x, [campo]: v } : x)))
  const pesos = filas.map((f) => parseFloat(f.peso))
  const notas = filas.map((f) => (f.nota === '' ? null : parseFloat(f.nota)))

  let error = ''
  if (pesos.some((p) => !(p >= 0))) error = 'Revisa los porcentajes: deben ser números positivos.'
  else if (Math.abs(pesos.reduce((s, p) => s + p, 0) - 100) > 0.01) error = `Los porcentajes suman ${formatNumber(pesos.reduce((s, p) => s + p, 0))}%; deben sumar 100%.`
  else if (notas.some((n) => n !== null && (isNaN(n) || fuera(n, escala)))) error = `Las notas deben estar entre ${escala.minimo} y ${escala.maximo}.`

  const r = !error && notas.some((n) => n !== null)
    ? notaPorEvaluaciones(filas.map((f, i) => ({ nombre: f.nombre, peso: pesos[i], nota: notas[i] })), { ...escala, aprobatoria: escala.umbral ?? escala.aprobatoria })
    : null
  const finalRedondeada = r && r.final !== null ? redondear(r.final, escala.decimales) : null

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_5.5rem_5.5rem_2rem] gap-2 text-xs font-medium text-gray-500 px-1">
          <span>{etiquetaFila}</span><span>Peso (%)</span><span>Nota</span><span />
        </div>
        {filas.map((f, i) => (
          <div key={i} className="grid grid-cols-[1fr_5.5rem_5.5rem_2rem] gap-2 items-center">
            <input aria-label={`Nombre de la evaluación ${i + 1}`} value={f.nombre} onChange={(e) => set(i, 'nombre', e.target.value)} className={inputClass} />
            <input aria-label={`Peso de ${f.nombre}`} type="number" inputMode="decimal" min="0" max="100" value={f.peso} onChange={(e) => set(i, 'peso', e.target.value)} className={inputClass} />
            <input aria-label={`Nota de ${f.nombre}`} type="number" inputMode="decimal" min={escala.minimo} max={escala.maximo} step={escala.paso} placeholder="—" value={f.nota} onChange={(e) => set(i, 'nota', e.target.value)} className={inputClass} />
            <button type="button" aria-label={`Quitar ${f.nombre}`} onClick={() => setFilas((x) => x.filter((_, j) => j !== i))} disabled={filas.length <= 1} className="text-gray-400 hover:text-red-600 disabled:opacity-30 text-xl">×</button>
          </div>
        ))}
        <button type="button" onClick={() => setFilas((x) => [...x, { nombre: `${etiquetaFila} ${x.length + 1}`, peso: '0', nota: '' }])} className={secondaryButtonClass}>
          + Añadir evaluación
        </button>
        <p className="text-xs text-gray-500">{notaPlantilla} Deja en blanco las notas que aún no tienes.</p>
      </div>

      <ErrorText>{error}</ErrorText>

      <div aria-live="polite">
        {r && (
          <ResultBox
            label={r.final !== null ? 'Nota final del curso' : 'Nota necesaria en lo que falta'}
            value={r.final !== null ? formatNumber(finalRedondeada, escala.decimales) : r.imposible ? 'No alcanza' : r.asegurada ? 'Ya aprobaste' : formatNumber(r.necesaria, 2)}
          >
            <Rows>
              <Row label={`Puntos acumulados (${formatNumber(r.pesoRendido)}% evaluado)`} value={formatNumber(r.acumulado, 2)} />
              {r.final !== null ? (
                <>
                  <Row label="Nota sin redondear" value={formatNumber(r.final, 2)} />
                  <Row label="Nota redondeada" value={formatNumber(finalRedondeada, escala.decimales)} bold />
                  <Row label="Resultado" value={finalRedondeada >= escala.aprobatoria ? '✅ Aprobado' : '❌ Desaprobado'} bold highlight />
                </>
              ) : (
                <>
                  <Row label="Peso pendiente" value={`${formatNumber(r.pesoPendiente)}%`} />
                  <Row
                    label={`Promedio que necesitas en lo pendiente para aprobar (${formatNumber(escala.umbral ?? escala.aprobatoria, 2)} sin redondear)`}
                    value={r.imposible ? `Más de ${escala.maximo}` : r.asegurada ? 'Cualquier nota' : formatNumber(r.necesaria, 2)}
                    bold
                    highlight
                  />
                </>
              )}
            </Rows>
            <Note>{notaRedondeo}</Note>
          </ResultBox>
        )}
      </div>
    </div>
  )
}

function PromedioCiclo({ escala }) {
  const [cursos, setCursos] = useState([1, 2, 3, 4].map((n) => ({ nombre: `Curso ${n}`, nota: '', creditos: '' })))
  const set = (i, campo, v) => setCursos((c) => c.map((x, j) => (j === i ? { ...x, [campo]: v } : x)))
  const validos = cursos
    .map((c) => ({ nombre: c.nombre, nota: parseFloat(c.nota), creditos: parseFloat(c.creditos) }))
    .filter((c) => !isNaN(c.nota) && c.creditos > 0)
  const error = validos.some((c) => fuera(c.nota, escala)) ? `Las notas deben estar entre ${escala.minimo} y ${escala.maximo}.` : ''
  const r = !error && validos.length ? promedioPorCreditos(validos, escala.aprobatoria) : null

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_5.5rem_5.5rem_2rem] gap-2 text-xs font-medium text-gray-500 px-1">
          <span>Curso</span><span>Nota final</span><span>Créditos</span><span />
        </div>
        {cursos.map((c, i) => (
          <div key={i} className="grid grid-cols-[1fr_5.5rem_5.5rem_2rem] gap-2 items-center">
            <input aria-label={`Nombre del curso ${i + 1}`} value={c.nombre} onChange={(e) => set(i, 'nombre', e.target.value)} className={inputClass} />
            <input aria-label={`Nota de ${c.nombre}`} type="number" inputMode="decimal" min={escala.minimo} max={escala.maximo} step={escala.paso} value={c.nota} onChange={(e) => set(i, 'nota', e.target.value)} className={inputClass} />
            <input aria-label={`Créditos de ${c.nombre}`} type="number" inputMode="numeric" min="0" step="1" value={c.creditos} onChange={(e) => set(i, 'creditos', e.target.value)} className={inputClass} />
            <button type="button" aria-label={`Quitar ${c.nombre}`} onClick={() => setCursos((x) => x.filter((_, j) => j !== i))} disabled={cursos.length <= 1} className="text-gray-400 hover:text-red-600 disabled:opacity-30 text-xl">×</button>
          </div>
        ))}
        <button type="button" onClick={() => setCursos((x) => [...x, { nombre: `Curso ${x.length + 1}`, nota: '', creditos: '' }])} className={secondaryButtonClass}>
          + Añadir curso
        </button>
      </div>

      <ErrorText>{error}</ErrorText>

      <div aria-live="polite">
        {r && (
          <ResultBox label="Promedio ponderado del ciclo" value={formatNumber(r.promedio, 2)}>
            <Rows>
              <Row label="Suma de (nota × créditos)" value={formatNumber(r.suma, 2)} />
              <Row label="Total de créditos" value={formatNumber(r.creditos, 0)} />
              <Row label="Promedio = suma ÷ créditos" value={formatNumber(r.promedio, 2)} bold highlight />
              <Row label={`Créditos aprobados (nota ≥ ${escala.aprobatoria})`} value={formatNumber(r.creditosAprobados, 0)} />
            </Rows>
          </ResultBox>
        )}
      </div>
    </div>
  )
}
