'use client'

import { useMemo, useState } from 'react'
import { NOMBRES_BEBE, ORIGENES } from '@/lib/data/nombres-bebe'
import { barajar } from '@/lib/calc/dev'
import { buttonClass, inputClass } from '@/components/calc-ui'

const SEXOS = [
  { id: 'todos', label: 'Todos' },
  { id: 'f', label: 'Niña' },
  { id: 'm', label: 'Niño' },
  { id: 'u', label: 'Unisex' },
]
const quitarAcentos = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export default function GeneradorNombresBebe() {
  const [sexo, setSexo] = useState('todos')
  const [origen, setOrigen] = useState('')
  const [inicial, setInicial] = useState('')
  const [buscar, setBuscar] = useState('')
  const [apellido, setApellido] = useState('')
  const [sugeridos, setSugeridos] = useState(null)
  const [favoritos, setFavoritos] = useState([])

  const filtrados = useMemo(
    () =>
      NOMBRES_BEBE.filter(([n, s, o, sig]) => {
        if (sexo !== 'todos' && s !== sexo && !(s === 'u' && sexo !== 'u')) return false
        if (origen && o !== origen) return false
        if (inicial && quitarAcentos(n)[0] !== inicial) return false
        if (buscar && !quitarAcentos(`${n} ${sig}`).includes(quitarAcentos(buscar))) return false
        return true
      }),
    [sexo, origen, inicial, buscar]
  )

  const lista = sugeridos ?? filtrados
  const toggleFav = (n) => setFavoritos((f) => (f.includes(n) ? f.filter((x) => x !== n) : [...f, n]))
  const letras = [...new Set(NOMBRES_BEBE.map(([n]) => quitarAcentos(n)[0]))].sort()

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <select value={sexo} onChange={(e) => { setSexo(e.target.value); setSugeridos(null) }} className={inputClass} aria-label="Sexo">
          {SEXOS.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
        <select value={origen} onChange={(e) => { setOrigen(e.target.value); setSugeridos(null) }} className={inputClass} aria-label="Origen">
          <option value="">Cualquier origen</option>
          {ORIGENES.map((o) => (
            <option key={o} value={o}>Origen {o}</option>
          ))}
        </select>
        <select value={inicial} onChange={(e) => { setInicial(e.target.value); setSugeridos(null) }} className={inputClass} aria-label="Letra inicial">
          <option value="">Cualquier letra</option>
          {letras.map((l) => (
            <option key={l} value={l}>Empieza con {l.toUpperCase()}</option>
          ))}
        </select>
        <input value={buscar} onChange={(e) => { setBuscar(e.target.value); setSugeridos(null) }} className={inputClass} placeholder="Buscar: luz, paz, fuerte…" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input value={apellido} onChange={(e) => setApellido(e.target.value)} className={inputClass} placeholder="Tu apellido, para ver cómo suena (opcional)" />
        <button type="button" onClick={() => setSugeridos(barajar(filtrados).slice(0, 6))} disabled={!filtrados.length} className={buttonClass}>
          🎲 Sugerir 6 nombres al azar
        </button>
      </div>

      {favoritos.length > 0 && (
        <div className="rounded-xl border border-pink-200 bg-pink-50 p-3 text-sm">
          <strong>❤️ Tus favoritos:</strong> {favoritos.map((f) => `${f}${apellido ? ` ${apellido}` : ''}`).join(' · ')}
        </div>
      )}

      <p className="text-sm text-gray-600">
        {sugeridos ? 'Sugerencias al azar' : `${filtrados.length} nombres`}
        {sugeridos && (
          <button type="button" onClick={() => setSugeridos(null)} className="ml-2 text-blue-600 font-medium">Ver todos</button>
        )}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {lista.map(([n, s, o, sig]) => (
          <div key={n} className={`rounded-xl border p-4 ${s === 'f' ? 'border-pink-200' : s === 'm' ? 'border-sky-200' : 'border-violet-200'}`}>
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="text-xl font-bold text-gray-900">{n}{apellido && <span className="font-normal text-gray-500"> {apellido}</span>}</p>
                <p className="text-xs text-gray-500">{s === 'f' ? 'Niña' : s === 'm' ? 'Niño' : 'Unisex'} · origen {o}</p>
              </div>
              <button type="button" onClick={() => toggleFav(n)} className="text-xl" aria-label={favoritos.includes(n) ? `Quitar ${n} de favoritos` : `Guardar ${n} en favoritos`}>
                {favoritos.includes(n) ? '❤️' : '🤍'}
              </button>
            </div>
            <p className="text-sm text-gray-700 mt-2">Significa: <em>{sig}</em></p>
          </div>
        ))}
      </div>
      {!lista.length && <p className="text-sm text-gray-500">No hay nombres con esos filtros. Prueba con otra letra u origen.</p>}
    </div>
  )
}
