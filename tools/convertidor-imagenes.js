'use client'

import { useRef, useState } from 'react'

const FORMATOS = [
  { id: 'image/png', label: 'PNG', ext: 'png' },
  { id: 'image/jpeg', label: 'JPG', ext: 'jpg' },
  { id: 'image/webp', label: 'WEBP', ext: 'webp' },
]

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function ConvertidorImagenes() {
  const [archivos, setArchivos] = useState([]) // { id, nombre, pesoOriginal, url, width, height }
  const [formatoDestino, setFormatoDestino] = useState('image/png')
  const [calidad, setCalidad] = useState(0.92)
  const [error, setError] = useState('')
  const canvasRef = useRef(null)
  const idRef = useRef(0)

  function handleArchivos(fileList) {
    setError('')
    const nuevos = []
    for (const file of fileList) {
      if (!file.type.startsWith('image/')) continue
      const id = idRef.current++
      const url = URL.createObjectURL(file)
      nuevos.push({ id, nombre: file.name, pesoOriginal: file.size, url, tipoOriginal: file.type })
    }
    if (nuevos.length === 0) {
      setError('Selecciona uno o más archivos de imagen válidos.')
      return
    }
    setArchivos((prev) => [...prev, ...nuevos])
  }

  async function convertirYDescargar(item) {
    try {
      const img = new Image()
      img.src = item.url
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = () => reject(new Error('No se pudo leer esta imagen (formato no compatible con tu navegador).'))
      })

      const canvas = canvasRef.current
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (formatoDestino === 'image/jpeg') {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      ctx.drawImage(img, 0, 0)

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, formatoDestino, calidad))
      if (!blob) throw new Error('No se pudo convertir esta imagen.')

      const ext = FORMATOS.find((f) => f.id === formatoDestino).ext
      const nombreSalida = item.nombre.replace(/\.[^.]+$/, '') + '.' + ext
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = nombreSalida
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      setError(e.message || 'Ocurrió un error al convertir la imagen.')
    }
  }

  function quitar(id) {
    setArchivos((prev) => prev.filter((a) => a.id !== id))
  }

  const mostrarCalidad = formatoDestino === 'image/jpeg' || formatoDestino === 'image/webp'

  return (
    <div className="space-y-5">
      <canvas ref={canvasRef} className="hidden" />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Convertir a</label>
        <div className="grid grid-cols-3 gap-2">
          {FORMATOS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFormatoDestino(f.id)}
              className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                formatoDestino === f.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {mostrarCalidad && (
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <label className="font-medium text-gray-700">Calidad</label>
            <span className="font-semibold text-gray-900">{Math.round(calidad * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.01"
            value={calidad}
            onChange={(e) => setCalidad(parseFloat(e.target.value))}
            className="w-full accent-blue-600"
          />
        </div>
      )}

      <label className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleArchivos(e.target.files)}
        />
        <p className="text-gray-500 text-sm">
          Arrastra imágenes aquí o <span className="text-blue-600 font-medium">haz clic para seleccionar</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP, GIF, BMP y más (según tu navegador)</p>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {archivos.length > 0 && (
        <div className="space-y-2">
          {archivos.map((item) => (
            <div key={item.id} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
              <img src={item.url} alt={item.nombre} className="w-12 h-12 object-cover rounded-md flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.nombre}</p>
                <p className="text-xs text-gray-400">{formatBytes(item.pesoOriginal)}</p>
              </div>
              <button
                onClick={() => convertirYDescargar(item)}
                className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Convertir
              </button>
              <button onClick={() => quitar(item.id)} className="flex-shrink-0 text-gray-400 hover:text-red-500 p-1" title="Quitar">
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400">
        Las imágenes se procesan en tu navegador; nunca se suben a ningún servidor. Algunos formatos de origen (como
        HEIC) pueden no ser compatibles con todos los navegadores.
      </p>
    </div>
  )
}
