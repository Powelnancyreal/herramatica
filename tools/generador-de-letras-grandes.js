'use client'

import { Bungee, Great_Vibes, Anton } from 'next/font/google'
import { useEffect, useRef, useState } from 'react'

const bungee = Bungee({ weight: '400', subsets: ['latin'], display: 'swap' })
const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'], display: 'swap' })
const anton = Anton({ weight: '400', subsets: ['latin'], display: 'swap' })

const ESTILOS = [
  {
    id: 'grafiti',
    label: 'Grafiti',
    font: bungee,
    fondo: '#111827',
    color: '#facc15',
    contorno: '#ef4444',
    tamanoBase: 90,
  },
  {
    id: 'tatuaje',
    label: 'Tatuaje / Script',
    font: greatVibes,
    fondo: '#ffffff',
    color: '#111111',
    contorno: null,
    tamanoBase: 110,
  },
  {
    id: 'molde',
    label: 'Molde para Imprimir',
    font: anton,
    fondo: '#ffffff',
    color: '#111111',
    contorno: null,
    tamanoBase: 130,
    outline: true,
  },
]

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function GeneradorDeLetrasGrandes() {
  const [estiloId, setEstiloId] = useState('grafiti')
  const [texto, setTexto] = useState('Herramatica')
  const [soloContorno, setSoloContorno] = useState(false)
  const canvasRef = useRef(null)

  const estilo = ESTILOS.find((e) => e.id === estiloId)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const contenido = texto || ' '

    const fontFamily = estilo.font.style.fontFamily
    const ancho = canvas.width
    const alto = canvas.height

    function dibujar() {
      ctx.clearRect(0, 0, ancho, alto)
      ctx.fillStyle = estilo.fondo
      ctx.fillRect(0, 0, ancho, alto)

      let tamano = estilo.tamanoBase
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `${tamano}px "${fontFamily}"`
      while (ctx.measureText(contenido).width > ancho * 0.88 && tamano > 20) {
        tamano -= 2
        ctx.font = `${tamano}px "${fontFamily}"`
      }

      const modoContorno = estilo.outline && soloContorno
      if (modoContorno) {
        ctx.strokeStyle = estilo.color
        ctx.lineWidth = 2
        ctx.strokeText(contenido, ancho / 2, alto / 2)
      } else if (estilo.contorno) {
        ctx.lineJoin = 'round'
        ctx.miterLimit = 2
        ctx.strokeStyle = estilo.contorno
        ctx.lineWidth = Math.max(6, tamano * 0.08)
        ctx.strokeText(contenido, ancho / 2, alto / 2)
        ctx.fillStyle = estilo.color
        ctx.fillText(contenido, ancho / 2, alto / 2)
      } else {
        ctx.fillStyle = estilo.color
        ctx.fillText(contenido, ancho / 2, alto / 2)
      }
    }

    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.load(`${estilo.tamanoBase}px "${fontFamily}"`).then(dibujar).catch(dibujar)
    } else {
      dibujar()
    }
  }, [texto, estilo, soloContorno])

  function descargar() {
    const canvas = canvasRef.current
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `${(texto || 'letras').replace(/\s+/g, '-').toLowerCase()}-${estiloId}.png`
    a.click()
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap">
        {ESTILOS.map((e) => (
          <button
            key={e.id}
            onClick={() => setEstiloId(e.id)}
            className={`px-3.5 py-2 rounded-lg font-semibold text-sm transition-all ${
              estiloId === e.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {e.label}
          </button>
        ))}
      </div>

      <div>
        <label className={labelClass}>Tu texto</label>
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value.slice(0, 20))}
          placeholder="Escribe una palabra o nombre corto"
          className={inputClass}
        />
        <p className="text-xs text-gray-400 mt-1">Funciona mejor con palabras cortas (hasta 20 caracteres).</p>
      </div>

      {estilo.outline && (
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={soloContorno} onChange={(e) => setSoloContorno(e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          Solo contorno (ahorra tinta, ideal para recortar)
        </label>
      )}

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex justify-center p-2">
        <canvas ref={canvasRef} width={800} height={280} className="max-w-full h-auto" />
      </div>

      <button onClick={descargar} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
        Descargar imagen (PNG)
      </button>
    </div>
  )
}
