'use client'

import { useState } from 'react'
import { canvasABlob, cargarImagen, crearIco, descargarBlob } from '@/lib/calc/imagen'
import { buttonClass, CopyButton, secondaryButtonClass } from '@/components/calc-ui'

const TAMANOS = [
  { t: 16, nombre: 'favicon-16x16.png', uso: 'Pestaña del navegador' },
  { t: 32, nombre: 'favicon-32x32.png', uso: 'Pestaña en pantallas de alta densidad' },
  { t: 48, nombre: 'favicon-48x48.png', uso: 'Resultados de búsqueda de Google' },
  { t: 180, nombre: 'apple-touch-icon.png', uso: 'Acceso directo en iPhone y iPad' },
  { t: 192, nombre: 'android-chrome-192x192.png', uso: 'Android y manifiesto web' },
  { t: 512, nombre: 'android-chrome-512x512.png', uso: 'Pantalla de inicio y PWA' },
]

const HTML = `<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`

export default function GeneradorFavicon() {
  const [img, setImg] = useState(null)
  const [fondo, setFondo] = useState('transparente')
  const [color, setColor] = useState('#ffffff')
  const [margen, setMargen] = useState('0')
  const [redondeo, setRedondeo] = useState('0')
  const [salida, setSalida] = useState(null)
  const [error, setError] = useState('')

  async function elegir(f) {
    if (!f || !f.type.startsWith('image/')) return setError('Elige una imagen PNG, JPG, SVG o WebP.')
    setError('')
    setImg(await cargarImagen(f))
    setSalida(null)
  }

  function dibujar(t) {
    const c = document.createElement('canvas')
    c.width = t
    c.height = t
    const ctx = c.getContext('2d')
    ctx.imageSmoothingQuality = 'high'
    const r = (parseInt(redondeo, 10) / 100) * (t / 2)
    if (fondo === 'color') {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.roundRect ? ctx.roundRect(0, 0, t, t, r) : ctx.rect(0, 0, t, t)
      ctx.fill()
    }
    const m = (parseInt(margen, 10) / 100) * t
    const area = t - 2 * m
    const esc = Math.min(area / img.ancho, area / img.alto)
    const w = img.ancho * esc
    const h = img.alto * esc
    ctx.drawImage(img.img, (t - w) / 2, (t - h) / 2, w, h)
    return c
  }

  async function generar() {
    const pngs = []
    for (const s of TAMANOS) {
      const blob = await canvasABlob(dibujar(s.t), 'image/png')
      pngs.push({ ...s, tamano: s.t, blob, vista: URL.createObjectURL(blob) })
    }
    const ico = await crearIco(pngs.filter((p) => p.t <= 48))
    setSalida({ pngs, ico })
  }

  const manifiesto = JSON.stringify({ name: 'Mi sitio', short_name: 'Mi sitio', icons: [{ src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' }, { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }], theme_color: color, background_color: color, display: 'standalone' }, null, 2)

  return (
    <div className="space-y-5">
      <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl p-6 cursor-pointer text-center">
        <span className="text-3xl">⭐</span>
        <span className="text-sm text-gray-700">{img ? `Imagen cargada: ${img.ancho}×${img.alto} px` : 'Sube tu logo (ideal: cuadrado, PNG o SVG de al menos 512 px)'}</span>
        <input type="file" accept="image/*" className="hidden" onChange={(e) => elegir(e.target.files?.[0])} />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}

      {img && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <label className="block font-medium text-gray-700 mb-1.5">Fondo</label>
              <div className="flex gap-2 items-center">
                <select value={fondo} onChange={(e) => setFondo(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2.5 bg-white flex-1">
                  <option value="transparente">Transparente</option>
                  <option value="color">Color sólido</option>
                </select>
                {fondo === 'color' && <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-11 w-12 rounded border border-gray-300" />}
              </div>
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1.5">Margen interior: {margen}%</label>
              <input type="range" min="0" max="25" value={margen} onChange={(e) => setMargen(e.target.value)} className="w-full" />
            </div>
            {fondo === 'color' && (
              <div>
                <label className="block font-medium text-gray-700 mb-1.5">Esquinas redondeadas: {redondeo}%</label>
                <input type="range" min="0" max="100" value={redondeo} onChange={(e) => setRedondeo(e.target.value)} className="w-full" />
              </div>
            )}
          </div>
          <button type="button" onClick={generar} className={buttonClass}>Generar favicons</button>
        </>
      )}

      {salida && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => descargarBlob(salida.ico, 'favicon.ico')} className={buttonClass.replace('w-full', '')}>⬇ favicon.ico (16, 32 y 48 px)</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {salida.pngs.map((p) => (
              <div key={p.nombre} className="rounded-lg border border-gray-200 p-3 text-center space-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.vista} alt={`Favicon de ${p.t} píxeles`} width={Math.min(64, p.t)} height={Math.min(64, p.t)} className="mx-auto bg-[repeating-conic-gradient(#eee_0_25%,#fff_0_50%)] bg-[length:12px_12px]" />
                <p className="text-xs font-medium">{p.nombre}</p>
                <p className="text-xs text-gray-500">{p.uso}</p>
                <button type="button" onClick={() => descargarBlob(p.blob, p.nombre)} className={secondaryButtonClass}>Descargar</button>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center"><p className="text-sm font-semibold">Código para el &lt;head&gt; de tu sitio</p><CopyButton text={HTML} /></div>
            <pre className="text-xs bg-gray-50 border border-gray-200 rounded p-3 overflow-x-auto">{HTML}</pre>
            <div className="flex justify-between items-center"><p className="text-sm font-semibold">site.webmanifest</p><CopyButton text={manifiesto} /></div>
            <pre className="text-xs bg-gray-50 border border-gray-200 rounded p-3 overflow-x-auto">{manifiesto}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
