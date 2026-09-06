'use client'

import { useMemo, useState } from 'react'

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

let nextId = 1
function nuevoCurso() {
  return { id: nextId++, nombre: '', nota: '', creditos: '' }
}

export default function CalculadoraPromedioPonderado() {
  const [cursos, setCursos] = useState(() => [nuevoCurso(), nuevoCurso(), nuevoCurso()])

  function actualizar(id, campo, valor) {
    setCursos((prev) => prev.map((c) => (c.id === id ? { ...c, [campo]: valor } : c)))
  }
  function agregarCurso() {
    setCursos((prev) => [...prev, nuevoCurso()])
  }
  function quitarCurso(id) {
    setCursos((prev) => prev.filter((c) => c.id !== id))
  }

  const resultado = useMemo(() => {
    const validos = cursos
      .map((c) => ({ ...c, notaNum: parseFloat(c.nota), creditosNum: parseFloat(c.creditos) }))
      .filter((c) => !isNaN(c.notaNum) && !isNaN(c.creditosNum) && c.creditosNum > 0)
    if (validos.length === 0) return null

    const sumaPonderada = validos.reduce((acc, c) => acc + c.notaNum * c.creditosNum, 0)
    const totalCreditos = validos.reduce((acc, c) => acc + c.creditosNum, 0)
    const promedioSimple = validos.reduce((acc, c) => acc + c.notaNum, 0) / validos.length

    return {
      promedioPonderado: sumaPonderada / totalCreditos,
      promedioSimple,
      totalCreditos,
      cursosContados: validos.length,
    }
  }, [cursos])

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="hidden sm:grid grid-cols-[1fr_100px_100px_40px] gap-2 text-xs font-medium text-gray-500 px-1">
          <span>Curso (opcional)</span>
          <span>Nota</span>
          <span>Créditos</span>
          <span></span>
        </div>
        {cursos.map((curso) => (
          <div key={curso.id} className="grid grid-cols-1 sm:grid-cols-[1fr_100px_100px_40px] gap-2 items-center">
            <input
              type="text"
              value={curso.nombre}
              onChange={(e) => actualizar(curso.id, 'nombre', e.target.value)}
              placeholder="Ej: Cálculo I"
              className={inputClass}
            />
            <input
              type="number"
              inputMode="decimal"
              value={curso.nota}
              onChange={(e) => actualizar(curso.id, 'nota', e.target.value)}
              placeholder="Nota"
              className={inputClass}
            />
            <input
              type="number"
              inputMode="numeric"
              value={curso.creditos}
              onChange={(e) => actualizar(curso.id, 'creditos', e.target.value)}
              placeholder="Créditos"
              className={inputClass}
            />
            <button
              onClick={() => quitarCurso(curso.id)}
              className="text-gray-400 hover:text-red-500 font-bold text-lg justify-self-center"
              aria-label="Quitar curso"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button onClick={agregarCurso} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg transition-colors">
        + Añadir curso
      </button>

      {resultado && (
        <div className="space-y-3">
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Promedio ponderado</p>
            <p className="text-4xl font-bold text-blue-700">{resultado.promedioPonderado.toFixed(2)}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-center">
            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
              <p className="text-gray-500">Total de créditos</p>
              <p className="font-semibold text-gray-900">{resultado.totalCreditos}</p>
            </div>
            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
              <p className="text-gray-500">Promedio simple (sin créditos)</p>
              <p className="font-semibold text-gray-900">{resultado.promedioSimple.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500">
        ⚠️ Usa la fórmula estándar de promedio ponderado por créditos, la misma que aplica la mayoría de
        universidades. Verifica con tu propia universidad la nota mínima aprobatoria y las reglas de redondeo
        específicas de tu carrera, ya que pueden variar entre instituciones.
      </p>
    </div>
  )
}
