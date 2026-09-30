'use client'

import { useState } from 'react'
import { barajar, enteroAleatorio } from '@/lib/calc/dev'
import { buttonClass, CopyButton, inputClass, NumberInput } from '@/components/calc-ui'

const NOMBRES_EQUIPO = ['Águilas', 'Jaguares', 'Halcones', 'Tiburones', 'Lobos', 'Pumas', 'Rayos', 'Titanes', 'Cometas', 'Dragones', 'Coyotes', 'Toros', 'Osos', 'Cóndores', 'Delfines', 'Leones']
const COLORES = ['bg-blue-50 border-blue-200', 'bg-red-50 border-red-200', 'bg-green-50 border-green-200', 'bg-amber-50 border-amber-200', 'bg-purple-50 border-purple-200', 'bg-pink-50 border-pink-200', 'bg-teal-50 border-teal-200', 'bg-orange-50 border-orange-200']

export default function GeneradorEquipos() {
  const [texto, setTexto] = useState('')
  const [modo, setModo] = useState('equipos')
  const [numero, setNumero] = useState('2')
  const [capitanes, setCapitanes] = useState(false)
  const [equipos, setEquipos] = useState([])
  const [error, setError] = useState('')

  const personas = [...new Set(texto.split(/[\n,]+/).map((x) => x.trim()).filter(Boolean))]

  function formar() {
    const n = parseInt(numero, 10)
    if (personas.length < 2) return setError('Escribe al menos dos nombres (uno por línea o separados por comas).')
    if (!(n >= 1)) return setError('Indica un número válido.')
    const k = modo === 'equipos' ? Math.min(n, personas.length) : Math.max(1, Math.ceil(personas.length / n))
    if (modo === 'equipos' && n < 2) return setError('Se necesitan al menos 2 equipos.')
    setError('')
    const mezcla = barajar(personas)
    const grupos = Array.from({ length: k }, () => [])
    // Reparto en serpentina: la diferencia de tamaño entre equipos nunca es mayor que 1.
    mezcla.forEach((p, i) => grupos[i % k].push(p))
    const nombres = barajar(NOMBRES_EQUIPO)
    setEquipos(grupos.map((g, i) => ({ nombre: nombres[i % nombres.length] ?? `Equipo ${i + 1}`, miembros: g, capitan: capitanes ? enteroAleatorio(0, g.length - 1) : -1 })))
  }

  const textoCopiar = equipos.map((e) => `${e.nombre}: ${e.miembros.map((m, i) => (i === e.capitan ? `${m} (capitán)` : m)).join(', ')}`).join('\n')

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Participantes ({personas.length})</label>
        <textarea value={texto} onChange={(e) => setTexto(e.target.value)} rows={7} className={inputClass} placeholder={'Ana\nLuis\nSofía\nCarlos\n…'} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <select value={modo} onChange={(e) => setModo(e.target.value)} className={inputClass} aria-label="Cómo repartir">
          <option value="equipos">Número de equipos</option>
          <option value="personas">Personas por equipo</option>
        </select>
        <NumberInput value={numero} onChange={setNumero} min="1" step="1" aria-label={modo === 'equipos' ? 'Número de equipos' : 'Personas por equipo'} />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={capitanes} onChange={(e) => setCapitanes(e.target.checked)} /> Elegir capitán al azar
        </label>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="button" onClick={formar} className={buttonClass}>🎲 Formar equipos</button>

      {equipos.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {equipos.map((e, i) => (
              <div key={e.nombre + i} className={`rounded-xl border-2 p-4 ${COLORES[i % COLORES.length]}`}>
                <p className="font-bold text-gray-900 mb-2">{e.nombre} <span className="text-xs font-normal text-gray-500">({e.miembros.length})</span></p>
                <ul className="text-sm space-y-1">
                  {e.miembros.map((m, j) => (
                    <li key={m}>{j === e.capitan ? '⭐ ' : '• '}{m}{j === e.capitan && <span className="text-xs text-gray-500"> capitán</span>}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <CopyButton text={textoCopiar} label="Copiar equipos" />
            <button type="button" onClick={formar} className="text-sm text-blue-600 font-medium">Volver a mezclar</button>
          </div>
        </>
      )}
    </div>
  )
}
