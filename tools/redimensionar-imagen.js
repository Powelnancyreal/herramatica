'use client'

import { useState } from 'react'
import { canvasABlob, cargarImagen, descargarBlob, dibujarRedimensionada, nombreSinExtension, tamanoLegible } from '@/lib/calc/imagen'
import { buttonClass, inputClass, NumberInput } from '@/components/calc-ui'

const PRESETS = [
  ['Personalizado', 0, 0],
  ['Instagram: publicación cuadrada', 1080, 1080],
  ['Instagram: vertical 4:5', 1080, 1350],
  ['Instagram y TikTok: historia o reel', 1080, 1920],
  ['Facebook: publicación', 1200, 630],
  ['Facebook: portada', 820, 312],
  ['YouTube: miniatura', 1280, 720],
  ['X (Twitter): encabezado', 1500, 500],
  ['LinkedIn: portada de perfil', 1584, 396],
  ['WhatsApp: foto de perfil', 500, 500],
  ['Full HD', 1920, 1080],
]
const FORMATOS = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }

export default function RedimensionarImagen() {
  const [original, setOriginal] = useState(null)
  const [preset, setPreset] = useState('0')
  const [ancho, setAncho] = useState('')
  const [alto, setAlto] = useState('')
  const [proporcion, setProporcion] = useState(true)
  const [modo, setModo] = useState('recortar')
  const [formato, setFormato] = useState('image/jpeg')
  const [fondo, setFondo] = useState('#ffffff')
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState('')

  async function elegir(f) {
    if (!f || !f.type.startsWith('image/')) return setError('Elige una imagen JPG, PNG, WebP o GIF.')
    setError('')
    const o = await cargarImagen(f)
    setOriginal({ ...o, nombre: f.name, peso: f.size })
    setAncho(String(o.ancho))
    setAlto(String(o.alto))
    setResultado(null)
  }

  function cambiarAncho(v) {
    setAncho(v)
    if (proporcion && original && preset === '0') setAlto(String(Math.round((parseFloat(v) || 0) * (original.alto / original.ancho))))
  }

  function elegirPreset(i) {
    setPreset(i)
    const [, w, h] = PRESETS[parseInt(i, 10)]
    if (w) {
      setAncho(String(w))
      setAlto(String(h))
    }
  }

  async function redimensionar() {
    const w = parseInt(ancho, 10)
    const h = parseInt(alto, 10)
    if (!(w > 0 && h > 0 && w <= 8000 && h <= 8000)) return setError('Usa un tamaño entre 1 y 8000 píxeles.')
    setError('')
    const canvas = dibujarRedimensionada(original.img, w, h, preset === '0' && proporcion ? 'estirar' : modo, formato === 'image/jpeg' || modo === 'ajustar' ? fondo : 'transparente')
    const blob = await canvasABlob(canvas, formato, 0.9)
    if (resultado?.vista) URL.revokeObjectURL(resultado.vista)
    setResultado({ blob, vista: URL.createObjectURL(blob), w, h, nombre: `${nombreSinExtension(original.nombre)}-${w}x${h}.${FORMATOS[formato]}` })
  }

  return (
    <div className="space-y-5">
      <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl p-6 cursor-pointer text-center">
        <span className="text-3xl">📐</span>
        <span className="text-sm text-gray-700">{original ? `${original.nombre} · ${original.ancho}×${original.alto} px · ${tamanoLegible(original.peso)}` : 'Elige una imagen para redimensionar'}</span>
        <input type="file" accept="image/*" className="hidden" onChange={(e) => elegir(e.target.files?.[0])} />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}

      {original && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tamaño predefinido</label>
              <select value={preset} onChange={(e) => elegirPreset(e.target.value)} className={inputClass}>
                {PRESETS.map(([n, w, h], i) => (
                  <option key={n} value={i}>{n}{w ? ` (${w}×${h})` : ''}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Ancho</label><NumberInput value={ancho} onChange={cambiarAncho} min="1" suffix="px" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Alto</label><NumberInput value={alto} onChange={setAlto} min="1" suffix="px" /></div>
            </div>
            {preset === '0' ? (
              <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={proporcion} onChange={(e) => setProporcion(e.target.checked)} /> Mantener proporción</label>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Si la proporción no coincide</label>
                <select value={modo} onChange={(e) => setModo(e.target.value)} className={inputClass}>
                  <option value="recortar">Recortar el sobrante (llena todo el espacio)</option>
                  <option value="ajustar">Ajustar con bordes (se ve la imagen completa)</option>
                  <option value="estirar">Estirar (deforma la imagen)</option>
                </select>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Formato</label>
                <select value={formato} onChange={(e) => setFormato(e.target.value)} className={inputClass}>
                  <option value="image/jpeg">JPG</option>
                  <option value="image/png">PNG</option>
                  <option value="image/webp">WebP</option>
                </select>
              </div>
              {modo === 'ajustar' && preset !== '0' && (
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Color de bordes</label><input type="color" value={fondo} onChange={(e) => setFondo(e.target.value)} className="h-11 w-full rounded border border-gray-300" /></div>
              )}
            </div>
          </div>
          <button type="button" onClick={redimensionar} className={buttonClass}>Redimensionar imagen</button>
        </>
      )}

      {resultado && (
        <div className="space-y-3 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={resultado.vista} alt={`Imagen redimensionada a ${resultado.w} por ${resultado.h} píxeles`} className="max-h-80 mx-auto rounded-lg border border-gray-200" />
          <p className="text-sm text-gray-700">{resultado.w}×{resultado.h} px · {tamanoLegible(resultado.blob.size)}</p>
          <button type="button" onClick={() => descargarBlob(resultado.blob, resultado.nombre)} className={buttonClass}>⬇ Descargar {resultado.nombre}</button>
        </div>
      )}
    </div>
  )
}
