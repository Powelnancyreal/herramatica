'use client'

import { useState } from 'react'
import { barajar } from '@/lib/calc/dev'
import { buttonClass, CopyButton, inputClass } from '@/components/calc-ui'

const TEMAS = {
  comida: ['comida', 'foodie', 'recetas', 'cocinaencasa', 'comidamexicana', 'antojo', 'delicioso', 'foodporn', 'instafood', 'hechoencasa', 'postres', 'saludable'],
  viajes: ['viajes', 'viajar', 'travel', 'turismo', 'mochilero', 'wanderlust', 'vacaciones', 'playa', 'aventura', 'pueblosmagicos', 'viajeros', 'destinos'],
  fitness: ['fitness', 'gym', 'entrenamiento', 'vidasaludable', 'motivacion', 'fit', 'workout', 'nutricion', 'running', 'crossfit', 'deporte', 'bienestar'],
  moda: ['moda', 'outfit', 'estilo', 'fashion', 'look', 'ootd', 'tendencias', 'modafemenina', 'streetstyle', 'ropa', 'accesorios', 'moda2026'],
  belleza: ['belleza', 'maquillaje', 'makeup', 'skincare', 'cuidadodelapiel', 'uñas', 'cabello', 'beauty', 'tutorialmaquillaje', 'glow', 'nails', 'estetica'],
  negocios: ['emprendimiento', 'emprendedores', 'negocios', 'marketingdigital', 'pymes', 'emprender', 'ventas', 'exito', 'negociolocal', 'compralocal', 'marca', 'finanzas'],
  mascotas: ['perros', 'gatos', 'mascotas', 'perrosdeinstagram', 'gatosdeinstagram', 'adoptanocompres', 'petlovers', 'cachorro', 'michi', 'lomito', 'animales', 'rescate'],
  fotografia: ['fotografia', 'photography', 'foto', 'retrato', 'paisaje', 'atardecer', 'fotografo', 'naturaleza', 'blancoynegro', 'streetphotography', 'luz', 'momentos'],
  musica: ['musica', 'music', 'cantante', 'guitarra', 'musicos', 'envivo', 'concierto', 'cover', 'rock', 'reggaeton', 'musicamexicana', 'artista'],
  gaming: ['gaming', 'gamer', 'videojuegos', 'twitch', 'streamer', 'playstation', 'xbox', 'nintendo', 'pcgaming', 'freefire', 'fortnite', 'esports'],
}
const LUGARES = ['', 'mexico', 'cdmx', 'guadalajara', 'monterrey', 'españa', 'colombia', 'argentina', 'latam']

const limpiar = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, (m, i, str) => (str[i - 1] === 'n' && m === '̃' ? m : ''))
    .normalize('NFC')
    .replace(/[^a-z0-9ñ\s]/g, '')

export default function GeneradorHashtags() {
  const [palabras, setPalabras] = useState('')
  const [tema, setTema] = useState('comida')
  const [lugar, setLugar] = useState('')
  const [cantidad, setCantidad] = useState('10')
  const [etiquetas, setEtiquetas] = useState([])
  const [seleccion, setSeleccion] = useState([])

  function generar() {
    const n = parseInt(cantidad, 10)
    const kws = limpiar(palabras).split(/[\s,]+/).filter((x) => x.length > 1)
    const propias = []
    if (kws.length) {
      propias.push(kws.join(''))
      for (const k of kws) propias.push(k)
      if (lugar) propias.push(`${kws[0]}${lugar}`)
      propias.push(`${kws[0]}${tema === 'negocios' ? 'emprendedor' : 'lovers'}`)
    }
    const delTema = barajar(TEMAS[tema])
    const locales = lugar ? [`${tema === 'comida' ? 'comida' : tema}${lugar}`, lugar] : []
    const todas = [...new Set([...propias, ...locales, ...delTema])].slice(0, Math.max(n, 5) + 10)
    setEtiquetas(todas)
    setSeleccion(todas.slice(0, n))
  }

  const toggle = (h) => setSeleccion((s) => (s.includes(h) ? s.filter((x) => x !== h) : [...s, h]))
  const texto = seleccion.map((h) => `#${h}`).join(' ')

  return (
    <div className="space-y-5">
      <input value={palabras} onChange={(e) => setPalabras(e.target.value)} className={inputClass} placeholder="¿De qué trata tu publicación? Ej: tacos al pastor" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select value={tema} onChange={(e) => setTema(e.target.value)} className={inputClass} aria-label="Temática">
          {Object.keys(TEMAS).map((t) => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
        <select value={lugar} onChange={(e) => setLugar(e.target.value)} className={inputClass} aria-label="Ubicación">
          {LUGARES.map((l) => (
            <option key={l} value={l}>{l ? `Ubicación: ${l}` : 'Sin ubicación'}</option>
          ))}
        </select>
        <select value={cantidad} onChange={(e) => setCantidad(e.target.value)} className={inputClass} aria-label="Cantidad">
          <option value="5">5 hashtags (Instagram)</option>
          <option value="10">10 hashtags</option>
          <option value="20">20 hashtags</option>
        </select>
      </div>
      <button type="button" onClick={generar} className={buttonClass}># Generar hashtags</button>

      {etiquetas.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Toca un hashtag para añadirlo o quitarlo ({seleccion.length} elegidos).</p>
          <div className="flex flex-wrap gap-2">
            {etiquetas.map((h) => (
              <button key={h} type="button" onClick={() => toggle(h)} className={`px-3 py-1.5 rounded-full text-sm border ${seleccion.includes(h) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}>
                #{h}
              </button>
            ))}
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 space-y-2">
            <p className="text-sm text-gray-900 break-words">{texto || 'Elige al menos un hashtag.'}</p>
            <CopyButton text={texto} label="Copiar hashtags" />
          </div>
        </div>
      )}
    </div>
  )
}
