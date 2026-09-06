'use client'

import { useMemo, useState } from 'react'

function nivelEngagement(pct) {
  if (pct < 1) return { label: 'Bajo', color: 'text-red-600 bg-red-50 border-red-200' }
  if (pct < 3.5) return { label: 'Promedio', color: 'text-amber-600 bg-amber-50 border-amber-200' }
  if (pct < 6) return { label: 'Alto', color: 'text-green-600 bg-green-50 border-green-200' }
  return { label: 'Excelente', color: 'text-blue-600 bg-blue-50 border-blue-200' }
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

const TABS = [
  { id: 'publicacion', label: 'Por Publicación' },
  { id: 'promedio', label: 'Promedio de Varias Publicaciones' },
]

export default function CalculadoraEngagementInstagram() {
  const [tab, setTab] = useState('publicacion')
  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3.5 py-2 rounded-lg font-semibold text-sm transition-all ${
              tab === t.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'publicacion' ? <PorPublicacion /> : <Promedio />}
      <p className="text-xs text-gray-500">
        Referencia general: menos de 1% se considera bajo, entre 1% y 3.5% es un promedio saludable, entre 3.5% y 6% es
        alto, y más de 6% se considera excelente. Estos rangos varían según el nicho y el tamaño de la cuenta.
      </p>
    </div>
  )
}

function PorPublicacion() {
  const [seguidores, setSeguidores] = useState('')
  const [likes, setLikes] = useState('')
  const [comentarios, setComentarios] = useState('')
  const [guardados, setGuardados] = useState('0')
  const [compartidos, setCompartidos] = useState('0')

  const resultado = useMemo(() => {
    const f = parseFloat(seguidores)
    const l = parseFloat(likes) || 0
    const c = parseFloat(comentarios) || 0
    const g = parseFloat(guardados) || 0
    const s = parseFloat(compartidos) || 0
    if (isNaN(f) || f <= 0) return null
    const interacciones = l + c + g + s
    return { pct: (interacciones / f) * 100, interacciones }
  }, [seguidores, likes, comentarios, guardados, compartidos])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Seguidores totales</label>
          <input type="number" inputMode="numeric" min="0" value={seguidores} onChange={(e) => setSeguidores(e.target.value)} placeholder="Ej: 10000" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Me gusta (likes)</label>
          <input type="number" inputMode="numeric" min="0" value={likes} onChange={(e) => setLikes(e.target.value)} placeholder="Ej: 450" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Comentarios</label>
          <input type="number" inputMode="numeric" min="0" value={comentarios} onChange={(e) => setComentarios(e.target.value)} placeholder="Ej: 30" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Guardados (opcional)</label>
          <input type="number" inputMode="numeric" min="0" value={guardados} onChange={(e) => setGuardados(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Compartidos (opcional)</label>
          <input type="number" inputMode="numeric" min="0" value={compartidos} onChange={(e) => setCompartidos(e.target.value)} className={inputClass} />
        </div>
      </div>

      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Tasa de engagement</p>
        <p className="text-4xl font-bold text-blue-700">{resultado ? `${resultado.pct.toFixed(2)}%` : '—'}</p>
        {resultado && (
          <span className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full border ${nivelEngagement(resultado.pct).color}`}>
            {nivelEngagement(resultado.pct).label}
          </span>
        )}
      </div>
    </div>
  )
}

function Promedio() {
  const [seguidores, setSeguidores] = useState('')
  const [texto, setTexto] = useState('450, 30\n380, 25\n520, 40\n290, 18')

  const resultado = useMemo(() => {
    const f = parseFloat(seguidores)
    if (isNaN(f) || f <= 0) return null
    const filas = texto
      .split('\n')
      .map((linea) => linea.split(',').map((v) => parseFloat(v.trim())))
      .filter((fila) => fila.length === 2 && !isNaN(fila[0]) && !isNaN(fila[1]))
    if (filas.length === 0) return null

    const tasas = filas.map(([likes, comentarios]) => ((likes + comentarios) / f) * 100)
    const promedio = tasas.reduce((a, b) => a + b, 0) / tasas.length
    return { promedio, publicaciones: filas.length }
  }, [seguidores, texto])

  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Seguidores totales</label>
        <input type="number" inputMode="numeric" min="0" value={seguidores} onChange={(e) => setSeguidores(e.target.value)} placeholder="Ej: 10000" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Una publicación por línea: likes, comentarios</label>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={6}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-y font-mono text-sm"
        />
      </div>

      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Engagement promedio</p>
        <p className="text-4xl font-bold text-blue-700">{resultado ? `${resultado.promedio.toFixed(2)}%` : '—'}</p>
        {resultado && <p className="text-sm text-gray-500 mt-2">Calculado sobre {resultado.publicaciones} publicaciones</p>}
      </div>
    </div>
  )
}
