'use client'

import { useMemo, useRef, useState } from 'react'

const COLORES = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

function polarAPunto(cx, cy, r, anguloGrados) {
  const rad = ((anguloGrados - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describirSector(cx, cy, r, anguloInicio, anguloFin) {
  const inicio = polarAPunto(cx, cy, r, anguloFin)
  const fin = polarAPunto(cx, cy, r, anguloInicio)
  const largeArc = anguloFin - anguloInicio <= 180 ? '0' : '1'
  return `M ${cx} ${cy} L ${inicio.x} ${inicio.y} A ${r} ${r} 0 ${largeArc} 0 ${fin.x} ${fin.y} Z`
}

export default function RuletaAleatoriaOnline() {
  const [texto, setTexto] = useState('Pizza\nSushi\nTacos\nHamburguesa\nEnsalada\nPasta')
  const [eliminarGanador, setEliminarGanador] = useState(false)
  const [rotacion, setRotacion] = useState(0)
  const [girando, setGirando] = useState(false)
  const [ganador, setGanador] = useState(null)
  const timeoutRef = useRef(null)

  const opciones = useMemo(() => texto.split('\n').map((l) => l.trim()).filter(Boolean), [texto])
  const n = opciones.length
  const anguloSegmento = n > 0 ? 360 / n : 0
  const radio = 150
  const centro = 160

  function girar() {
    if (girando || n < 2) return
    setGirando(true)
    setGanador(null)
    const indiceObjetivo = Math.floor(Math.random() * n)
    const centroSegmento = indiceObjetivo * anguloSegmento + anguloSegmento / 2
    const actualMod = ((rotacion % 360) + 360) % 360
    const deltaNecesario = (((360 - centroSegmento) - actualMod) % 360 + 360) % 360
    const nuevaRotacion = rotacion + 6 * 360 + deltaNecesario
    setRotacion(nuevaRotacion)

    timeoutRef.current = setTimeout(() => {
      setGanador(opciones[indiceObjetivo])
      setGirando(false)
      if (eliminarGanador) {
        const restantes = opciones.slice()
        restantes.splice(indiceObjetivo, 1)
        setTexto(restantes.join('\n'))
      }
    }, 4200)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Opciones (una por línea)</label>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={8}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-y font-mono text-sm"
          />
          <label className="flex items-center gap-2 text-sm text-gray-700 mt-3">
            <input type="checkbox" checked={eliminarGanador} onChange={(e) => setEliminarGanador(e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            Eliminar la opción ganadora después de cada giro
          </label>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="relative" style={{ width: 320, height: 320 }}>
            <div
              className="absolute left-1/2 -translate-x-1/2 z-10"
              style={{ top: -6, width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: '24px solid #1f2937' }}
            />
            {n >= 2 ? (
              <svg
                width="320"
                height="320"
                viewBox="0 0 320 320"
                style={{ transform: `rotate(${rotacion}deg)`, transition: girando ? 'transform 4.2s cubic-bezier(0.15, 0.65, 0.15, 1)' : 'none' }}
              >
                {opciones.map((opcion, i) => {
                  const inicio = i * anguloSegmento
                  const fin = (i + 1) * anguloSegmento
                  const centroTexto = polarAPunto(centro, centro, radio * 0.62, inicio + anguloSegmento / 2)
                  return (
                    <g key={i}>
                      <path d={describirSector(centro, centro, radio, inicio, fin)} fill={COLORES[i % COLORES.length]} stroke="white" strokeWidth="2" />
                      <text
                        x={centroTexto.x}
                        y={centroTexto.y}
                        fill="white"
                        fontSize="13"
                        fontWeight="600"
                        textAnchor="middle"
                        transform={`rotate(${inicio + anguloSegmento / 2}, ${centroTexto.x}, ${centroTexto.y})`}
                      >
                        {opcion.length > 14 ? opcion.slice(0, 13) + '…' : opcion}
                      </text>
                    </g>
                  )
                })}
                <circle cx={centro} cy={centro} r="14" fill="#1f2937" />
              </svg>
            ) : (
              <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm text-center p-6">
                Añade al menos 2 opciones para girar la ruleta
              </div>
            )}
          </div>

          <button
            onClick={girar}
            disabled={girando || n < 2}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            {girando ? 'Girando...' : '🎯 Girar'}
          </button>

          {ganador && (
            <div className="w-full text-center bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Resultado</p>
              <p className="text-2xl font-bold text-green-700">{ganador}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
