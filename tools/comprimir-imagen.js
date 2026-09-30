'use client'

import { useState } from 'react'
import { canvasABlob, cargarImagen, descargarBlob, dibujarRedimensionada, nombreSinExtension, tamanoLegible } from '@/lib/calc/imagen'
import { buttonClass, formatNumber, inputClass, secondaryButtonClass } from '@/components/calc-ui'

const FORMATOS = [
  { id: 'image/webp', label: 'WebP (recomendado)', ext: 'webp' },
  { id: 'image/jpeg', label: 'JPG', ext: 'jpg' },
]

export default function ComprimirImagen() {
  const [archivos, setArchivos] = useState([])
  const [calidad, setCalidad] = useState('75')
  const [formato, setFormato] = useState('image/webp')
  const [maxAncho, setMaxAncho] = useState('1920')
  const [resultados, setResultados] = useState([])
  const [procesando, setProcesando] = useState(false)
  const [error, setError] = useState('')

  function elegir(lista) {
    const imgs = [...lista].filter((f) => f.type.startsWith('image/') && !f.type.includes('svg'))
    if (!imgs.length) return setError('Elige imágenes JPG, PNG, WebP o GIF.')
    setError('')
    setArchivos(imgs.slice(0, 20))
    setResultados([])
  }

  async function comprimir() {
    setProcesando(true)
    const f = FORMATOS.find((x) => x.id === formato)
    const out = []
    for (const archivo of archivos) {
      try {
        const { img, url } = await cargarImagen(archivo)
        const limite = parseInt(maxAncho, 10) || 0
        const escala = limite && img.naturalWidth > limite ? limite / img.naturalWidth : 1
        const w = Math.round(img.naturalWidth * escala)
        const h = Math.round(img.naturalHeight * escala)
        // JPG no admite transparencia: se rellena con blanco.
        const canvas = dibujarRedimensionada(img, w, h, 'estirar', formato === 'image/jpeg' ? '#ffffff' : 'transparente')
        const blob = await canvasABlob(canvas, formato, parseInt(calidad, 10) / 100)
        URL.revokeObjectURL(url)
        out.push({ nombre: `${nombreSinExtension(archivo.name)}-comprimida.${f.ext}`, antes: archivo.size, despues: blob.size, blob, w, h, vista: URL.createObjectURL(blob) })
      } catch (e) {
        out.push({ nombre: archivo.name, error: e.message })
      }
    }
    setResultados(out)
    setProcesando(false)
  }

  const totalAntes = resultados.reduce((s, r) => s + (r.antes || 0), 0)
  const totalDespues = resultados.reduce((s, r) => s + (r.despues || 0), 0)

  return (
    <div className="space-y-5">
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          elegir(e.dataTransfer.files)
        }}
        className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-xl p-8 cursor-pointer text-center"
      >
        <span className="text-3xl">🗜️</span>
        <span className="text-sm text-gray-700">Arrastra hasta 20 imágenes o <strong className="text-blue-600">elige archivos</strong></span>
        <span className="text-xs text-gray-500">Se comprimen en tu navegador: no se suben a ningún servidor.</span>
        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => elegir(e.target.files)} />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {archivos.length > 0 && (
        <>
          <p className="text-sm text-gray-700">{archivos.length} {archivos.length === 1 ? 'imagen seleccionada' : 'imágenes seleccionadas'} · {tamanoLegible(archivos.reduce((s, a) => s + a.size, 0))}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Calidad: {calidad}%</label>
              <input type="range" min="30" max="95" value={calidad} onChange={(e) => setCalidad(e.target.value)} className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Formato de salida</label>
              <select value={formato} onChange={(e) => setFormato(e.target.value)} className={inputClass}>
                {FORMATOS.map((f) => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Ancho máximo</label>
              <select value={maxAncho} onChange={(e) => setMaxAncho(e.target.value)} className={inputClass}>
                <option value="0">Mantener tamaño original</option>
                <option value="2560">2560 px</option>
                <option value="1920">1920 px (web)</option>
                <option value="1280">1280 px</option>
                <option value="800">800 px</option>
              </select>
            </div>
          </div>
          <button type="button" onClick={comprimir} disabled={procesando} className={buttonClass}>{procesando ? 'Comprimiendo…' : 'Comprimir imágenes'}</button>
        </>
      )}

      {resultados.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-900">
            {tamanoLegible(totalAntes)} → {tamanoLegible(totalDespues)} · ahorro del {formatNumber(totalAntes ? (1 - totalDespues / totalAntes) * 100 : 0, 1)}%
          </p>
          {resultados.map((r) => (
            <div key={r.nombre} className="flex items-center gap-3 rounded-lg border border-gray-200 p-2">
              {r.vista && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.vista} alt={`Vista previa de ${r.nombre}`} className="w-14 h-14 object-cover rounded" />
              )}
              <div className="flex-1 text-sm min-w-0">
                <p className="font-medium truncate">{r.nombre}</p>
                {r.error ? (
                  <p className="text-red-600">{r.error}</p>
                ) : (
                  <p className="text-gray-600">
                    {tamanoLegible(r.antes)} → {tamanoLegible(r.despues)} ({r.w}×{r.h}){' '}
                    <span className={r.despues < r.antes ? 'text-green-700' : 'text-amber-700'}>{r.despues < r.antes ? `−${formatNumber((1 - r.despues / r.antes) * 100, 0)}%` : 'más grande: baja la calidad'}</span>
                  </p>
                )}
              </div>
              {r.blob && <button type="button" onClick={() => descargarBlob(r.blob, r.nombre)} className={secondaryButtonClass}>Descargar</button>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
