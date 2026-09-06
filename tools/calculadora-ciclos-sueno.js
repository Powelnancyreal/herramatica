'use client'

import { useMemo, useState } from 'react'

const DURACION_CICLO_MIN = 90
const TIEMPO_DORMIRSE_MIN = 15
const CICLOS = [3, 4, 5, 6]

function pad(n) {
  return String(n).padStart(2, '0')
}
function formatHora(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

const TABS = [
  { id: 'despertar', label: '¿A qué hora despertar?' },
  { id: 'dormir', label: '¿A qué hora dormir?' },
]

export default function CalculadoraCiclosSueno() {
  const [tab, setTab] = useState('despertar')
  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              tab === t.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'despertar' ? <QuieroDormirAhora /> : <QuieroDespertarA />}
      <p className="text-xs text-gray-500">
        Basado en ciclos de sueño de ~90 minutos y un margen de {TIEMPO_DORMIRSE_MIN} minutos para conciliar el
        sueño. Despertar al final de un ciclo completo (no a mitad de uno) ayuda a sentirte más descansado.
      </p>
    </div>
  )
}

function QuieroDormirAhora() {
  const opciones = useMemo(() => {
    const ahora = new Date()
    return CICLOS.map((n) => {
      const despertar = new Date(ahora.getTime() + (TIEMPO_DORMIRSE_MIN + n * DURACION_CICLO_MIN) * 60000)
      return { n, despertar }
    })
  }, [])

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Si te duermes ahora, estas son tus horas ideales para despertar:</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {opciones.map((o) => (
          <div key={o.n} className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">{o.n} ciclos ({(o.n * 1.5).toFixed(1)}h)</p>
            <p className="text-xl font-bold text-blue-700">{formatHora(o.despertar)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function QuieroDespertarA() {
  const [horaDespertar, setHoraDespertar] = useState('07:00')

  const opciones = useMemo(() => {
    if (!horaDespertar) return []
    const [h, m] = horaDespertar.split(':').map(Number)
    const despertar = new Date()
    despertar.setHours(h, m, 0, 0)
    return CICLOS.slice()
      .reverse()
      .map((n) => {
        const dormir = new Date(despertar.getTime() - (TIEMPO_DORMIRSE_MIN + n * DURACION_CICLO_MIN) * 60000)
        return { n, dormir }
      })
  }, [horaDespertar])

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Hora a la que quieres despertar</label>
        <input type="time" value={horaDespertar} onChange={(e) => setHoraDespertar(e.target.value)} className={inputClass} />
      </div>
      <p className="text-sm text-gray-600">Para despertar descansado, deberías dormirte a estas horas:</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {opciones.map((o) => (
          <div key={o.n} className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">{o.n} ciclos ({(o.n * 1.5).toFixed(1)}h)</p>
            <p className="text-xl font-bold text-blue-700">{formatHora(o.dormir)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
