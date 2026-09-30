'use client'

import { useEffect, useState } from 'react'
import { inputClass } from '@/components/calc-ui'

// [id, nombre, mes (0-11), día, emoji]
const EVENTOS = [
  ['navidad', 'Navidad', 11, 25, '🎄'],
  ['nochebuena', 'Nochebuena', 11, 24, '⭐'],
  ['anio-nuevo', 'Año Nuevo', 0, 1, '🎆'],
  ['reyes', 'Día de Reyes', 0, 6, '👑'],
  ['san-valentin', 'San Valentín', 1, 14, '❤️'],
  ['halloween', 'Halloween', 9, 31, '🎃'],
  ['muertos', 'Día de Muertos', 10, 2, '💀'],
]

function proximo(mes, dia, ahora) {
  let d = new Date(ahora.getFullYear(), mes, dia)
  if (d.getTime() + 86400000 <= ahora.getTime()) d = new Date(ahora.getFullYear() + 1, mes, dia)
  return d
}

export default function DiasParaNavidad() {
  const [ahora, setAhora] = useState(null)
  const [evento, setEvento] = useState('navidad')
  const [propia, setPropia] = useState('')

  useEffect(() => {
    setAhora(new Date())
    const id = setInterval(() => setAhora(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const e = EVENTOS.find((x) => x[0] === evento)
  const objetivo = ahora ? (evento === 'propia' && propia ? new Date(propia + 'T00:00:00') : e ? proximo(e[2], e[3], ahora) : null) : null
  const ms = objetivo ? objetivo.getTime() - ahora.getTime() : 0
  const hoyEs = objetivo && ms <= 0 && ms > -86400000
  const partes = [
    ['días', Math.max(0, Math.floor(ms / 86400000))],
    ['horas', Math.max(0, Math.floor((ms / 3600000) % 24))],
    ['minutos', Math.max(0, Math.floor((ms / 60000) % 60))],
    ['segundos', Math.max(0, Math.floor((ms / 1000) % 60))],
  ]
  const nombre = evento === 'propia' ? 'tu fecha' : e[1]
  const diasNaturales = objetivo ? Math.ceil(ms / 86400000) : 0

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {EVENTOS.map(([id, n, , , emoji]) => (
          <button key={id} type="button" onClick={() => setEvento(id)} className={`px-3 py-1.5 rounded-full text-sm border ${evento === id ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700 border-gray-300'}`}>
            {emoji} {n}
          </button>
        ))}
        <button type="button" onClick={() => setEvento('propia')} className={`px-3 py-1.5 rounded-full text-sm border ${evento === 'propia' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700 border-gray-300'}`}>📅 Otra fecha</button>
      </div>
      {evento === 'propia' && <input type="date" value={propia} onChange={(ev) => setPropia(ev.target.value)} className={`${inputClass} max-w-xs`} aria-label="Fecha del evento" />}

      <div className="rounded-2xl bg-gradient-to-br from-red-600 to-green-700 text-white p-6 text-center space-y-4" aria-live="polite">
        {!ahora || !objetivo ? (
          <p className="text-lg">{evento === 'propia' ? 'Elige una fecha' : 'Calculando…'}</p>
        ) : hoyEs ? (
          <p className="text-3xl font-bold">¡Hoy es {nombre}! {e?.[4] || '🎉'}</p>
        ) : ms < 0 ? (
          <p className="text-lg">Esa fecha ya pasó.</p>
        ) : (
          <>
            <p className="text-lg">Faltan para {nombre} {e?.[4] || ''}</p>
            <div className="grid grid-cols-4 gap-2">
              {partes.map(([k, v]) => (
                <div key={k} className="bg-white/15 rounded-xl py-3">
                  <p className="text-3xl sm:text-5xl font-black tabular-nums">{String(v).padStart(2, '0')}</p>
                  <p className="text-xs uppercase tracking-wide">{k}</p>
                </div>
              ))}
            </div>
            <p className="text-sm">{objetivo.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </>
        )}
      </div>
      {ahora && objetivo && ms > 0 && (
        <p className="text-sm text-gray-700 text-center">
          Son {diasNaturales} días naturales, unas {Math.floor(diasNaturales / 7)} semanas{evento === 'navidad' && diasNaturales > 30 ? '. ¡Buen momento para organizar el amigo invisible!' : '.'}
        </p>
      )}
    </div>
  )
}
