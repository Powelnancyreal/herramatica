'use client'

import { useMemo, useState } from 'react'

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

const COLORES = [
  { id: 'azul', clase: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'verde', clase: 'bg-green-100 text-green-800 border-green-300' },
  { id: 'amarillo', clase: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'rosa', clase: 'bg-pink-100 text-pink-800 border-pink-300' },
  { id: 'morado', clase: 'bg-purple-100 text-purple-800 border-purple-300' },
  { id: 'gris', clase: 'bg-gray-100 text-gray-800 border-gray-300' },
]

function pad(n) {
  return String(n).padStart(2, '0')
}

function generarFranjas(horaInicio, horaFin, intervaloMin) {
  const franjas = []
  let minutos = horaInicio * 60
  const finMinutos = horaFin * 60
  while (minutos < finMinutos) {
    const h = Math.floor(minutos / 60)
    const m = minutos % 60
    franjas.push(`${pad(h)}:${pad(m)}`)
    minutos += intervaloMin
  }
  return franjas
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalculadorDeHorarios() {
  const [horaInicio, setHoraInicio] = useState('7')
  const [horaFin, setHoraFin] = useState('20')
  const [intervalo, setIntervalo] = useState('60')
  const [diasActivos, setDiasActivos] = useState(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'])
  const [celdas, setCeldas] = useState({})
  const [editando, setEditando] = useState(null)
  const [textoEdicion, setTextoEdicion] = useState('')
  const [colorEdicion, setColorEdicion] = useState('azul')

  const franjas = useMemo(
    () => generarFranjas(parseInt(horaInicio, 10), parseInt(horaFin, 10), parseInt(intervalo, 10)),
    [horaInicio, horaFin, intervalo]
  )

  function toggleDia(dia) {
    setDiasActivos((prev) => (prev.includes(dia) ? prev.filter((d) => d !== dia) : DIAS_SEMANA.filter((d) => prev.includes(d) || d === dia)))
  }

  function abrirCelda(clave) {
    const actual = celdas[clave]
    setEditando(clave)
    setTextoEdicion(actual?.texto || '')
    setColorEdicion(actual?.color || 'azul')
  }

  function guardarCelda() {
    setCeldas((prev) => {
      const nuevo = { ...prev }
      if (textoEdicion.trim()) {
        nuevo[editando] = { texto: textoEdicion.trim(), color: colorEdicion }
      } else {
        delete nuevo[editando]
      }
      return nuevo
    })
    setEditando(null)
  }

  function imprimir() {
    window.print()
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Hora de inicio</label>
          <input type="number" min="0" max="23" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Hora de fin</label>
          <input type="number" min="1" max="24" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Intervalo</label>
          <select value={intervalo} onChange={(e) => setIntervalo(e.target.value)} className={inputClass}>
            <option value="30">30 minutos</option>
            <option value="60">1 hora</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Días a mostrar</label>
        <div className="flex flex-wrap gap-2">
          {DIAS_SEMANA.map((dia) => (
            <button
              key={dia}
              onClick={() => toggleDia(dia)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                diasActivos.includes(dia) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {dia.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      <button onClick={imprimir} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors">
        🖨️ Imprimir horario
      </button>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm min-w-[600px]">
          <thead>
            <tr>
              <th className="border border-gray-200 bg-gray-50 p-2 w-20"></th>
              {diasActivos.map((dia) => (
                <th key={dia} className="border border-gray-200 bg-gray-50 p-2 font-semibold text-gray-700">
                  {dia}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {franjas.map((franja) => (
              <tr key={franja}>
                <td className="border border-gray-200 p-2 text-xs text-gray-500 font-mono text-center">{franja}</td>
                {diasActivos.map((dia) => {
                  const clave = `${dia}-${franja}`
                  const celda = celdas[clave]
                  const colorClase = COLORES.find((c) => c.id === celda?.color)?.clase || ''
                  return (
                    <td key={clave} className="border border-gray-200 p-0">
                      <button
                        onClick={() => abrirCelda(clave)}
                        className={`w-full h-12 px-2 text-xs font-medium transition-colors hover:opacity-80 ${
                          celda ? colorClase : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        {celda?.texto || ''}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editando && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 print:hidden" onClick={() => setEditando(null)}>
          <div className="bg-white rounded-xl p-5 w-full max-w-sm space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-gray-900">{editando.replace('-', ' — ')}</h3>
            <input
              type="text"
              value={textoEdicion}
              onChange={(e) => setTextoEdicion(e.target.value)}
              placeholder="Ej: Matemáticas"
              className={inputClass}
              autoFocus
            />
            <div className="flex gap-2">
              {COLORES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColorEdicion(c.id)}
                  className={`w-8 h-8 rounded-full border-2 ${c.clase} ${colorEdicion === c.id ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={guardarCelda} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg">
                Guardar
              </button>
              <button onClick={() => setEditando(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
