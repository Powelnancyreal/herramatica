'use client'

import { useMemo, useState } from 'react'

function analizarTexto(texto) {
  const trimmed = texto.trim()
  const palabras = trimmed ? trimmed.split(/\s+/) : []
  const caracteresConEspacios = texto.length
  const caracteresSinEspacios = texto.replace(/\s/g, '').length
  const oraciones = trimmed ? (trimmed.match(/[^.!?]+[.!?]+|\S+$/g) || []).filter((s) => s.trim()) : []
  const parrafos = trimmed ? trimmed.split(/\n+/).filter((p) => p.trim()) : []
  const tiempoLecturaMin = palabras.length / 200 // ~200 palabras por minuto

  const frecuencia = {}
  const stopwords = new Set(['el', 'la', 'los', 'las', 'de', 'del', 'y', 'a', 'en', 'que', 'un', 'una', 'es', 'por', 'con', 'para', 'su', 'se', 'lo', 'al', 'no', 'como', 'más', 'o', 'si', 'ya', 'sus'])
  for (const w of palabras) {
    const clean = w.toLowerCase().replace(/[^a-záéíóúñü0-9]/gi, '')
    if (clean.length < 3 || stopwords.has(clean)) continue
    frecuencia[clean] = (frecuencia[clean] || 0) + 1
  }
  const topPalabras = Object.entries(frecuencia)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return {
    palabras: palabras.length,
    caracteresConEspacios,
    caracteresSinEspacios,
    oraciones: oraciones.length,
    parrafos: parrafos.length,
    tiempoLecturaMin,
    topPalabras,
  }
}

function StatCard({ label, value }) {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
      <div className="text-2xl sm:text-3xl font-bold text-blue-600">{value}</div>
      <div className="text-xs font-medium text-gray-600 mt-1">{label}</div>
    </div>
  )
}

export default function ContadorPalabras() {
  const [texto, setTexto] = useState('')
  const stats = useMemo(() => analizarTexto(texto), [texto])

  return (
    <div className="space-y-5">
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribe o pega tu texto aquí..."
        rows={10}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-y"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Palabras" value={stats.palabras.toLocaleString('es')} />
        <StatCard label="Caracteres" value={stats.caracteresConEspacios.toLocaleString('es')} />
        <StatCard label="Sin espacios" value={stats.caracteresSinEspacios.toLocaleString('es')} />
        <StatCard label="Oraciones" value={stats.oraciones.toLocaleString('es')} />
        <StatCard label="Párrafos" value={stats.parrafos.toLocaleString('es')} />
        <StatCard
          label="Tiempo de lectura"
          value={stats.tiempoLecturaMin < 1 ? '< 1 min' : `${Math.ceil(stats.tiempoLecturaMin)} min`}
        />
      </div>

      {stats.topPalabras.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Palabras más repetidas</h3>
          <div className="flex flex-wrap gap-2">
            {stats.topPalabras.map(([palabra, veces]) => (
              <span key={palabra} className="bg-white border border-gray-200 rounded-full px-3 py-1 text-sm text-gray-700">
                {palabra} <span className="text-gray-400">×{veces}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
