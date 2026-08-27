'use client'

import { useState } from 'react'
import { jsPDF } from 'jspdf'

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function cargarImagen(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => resolve({ img, url, width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = () => reject(new Error(`No se pudo leer "${file.name}"`))
    img.src = url
  })
}

export default function ImagenesAPDF() {
  const [archivos, setArchivos] = useState([]) // { id, file, nombre, peso, url, width, height }
  const [orientacion, setOrientacion] = useState('auto') // auto | portrait | landscape
  const [margen, setMargen] = useState('normal') // sin | normal
  const [error, setError] = useState('')
  const [generando, setGenerando] = useState(false)
  const idRef = { current: 0 }

  function handleArchivos(fileList) {
    setError('')
    const nuevos = [...fileList]
      .filter((f) => f.type.startsWith('image/'))
      .map((file, i) => ({ id: `${Date.now()}-${i}`, file, nombre: file.name, peso: file.size, url: URL.createObjectURL(file) }))
    if (nuevos.length === 0) {
      setError('Selecciona uno o más archivos de imagen válidos.')
      return
    }
    setArchivos((prev) => [...prev, ...nuevos])
  }

  function quitar(id) {
    setArchivos((prev) => prev.filter((a) => a.id !== id))
  }

  function mover(id, direccion) {
    setArchivos((prev) => {
      const idx = prev.findIndex((a) => a.id === id)
      const nuevoIdx = idx + direccion
      if (nuevoIdx < 0 || nuevoIdx >= prev.length) return prev
      const copia = [...prev]
      ;[copia[idx], copia[nuevoIdx]] = [copia[nuevoIdx], copia[idx]]
      return copia
    })
  }

  async function generarPDF() {
    if (archivos.length === 0) return
    setGenerando(true)
    setError('')
    try {
      const doc = new jsPDF({ unit: 'mm' })
      let primera = true

      for (const item of archivos) {
        const { img, width, height } = await cargarImagen(item.file)
        const esApaisada = width > height
        const orientacionPagina = orientacion === 'auto' ? (esApaisada ? 'l' : 'p') : orientacion === 'landscape' ? 'l' : 'p'

        if (!primera) doc.addPage(undefined, orientacionPagina)
        else {
          doc.deletePage(1)
          doc.addPage(undefined, orientacionPagina)
        }
        primera = false

        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()
        const margenMm = margen === 'sin' ? 0 : 10

        const maxW = pageWidth - margenMm * 2
        const maxH = pageHeight - margenMm * 2
        const escala = Math.min(maxW / width, maxH / height)
        const imgW = width * escala
        const imgH = height * escala
        const x = (pageWidth - imgW) / 2
        const y = (pageHeight - imgH) / 2

        const formato = item.file.type === 'image/png' ? 'PNG' : 'JPEG'
        doc.addImage(img, formato, x, y, imgW, imgH)
      }

      doc.save('imagenes.pdf')
    } catch (e) {
      setError(e.message || 'Ocurrió un error al generar el PDF.')
    } finally {
      setGenerando(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Orientación de página</label>
          <select
            value={orientacion}
            onChange={(e) => setOrientacion(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="auto">Automática (según cada imagen)</option>
            <option value="portrait">Vertical</option>
            <option value="landscape">Horizontal</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Márgenes</label>
          <select
            value={margen}
            onChange={(e) => setMargen(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="normal">Con margen</option>
            <option value="sin">Sin margen</option>
          </select>
        </div>
      </div>

      <label className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleArchivos(e.target.files)} />
        <p className="text-gray-500 text-sm">
          Arrastra imágenes aquí o <span className="text-blue-600 font-medium">haz clic para seleccionar</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">Cada imagen se convertirá en una página del PDF, en el orden que elijas</p>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {archivos.length > 0 && (
        <div className="space-y-2">
          {archivos.map((item, i) => (
            <div key={item.id} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
              <span className="text-xs font-semibold text-gray-400 w-5 text-center flex-shrink-0">{i + 1}</span>
              <img src={item.url} alt={item.nombre} className="w-12 h-12 object-cover rounded-md flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.nombre}</p>
                <p className="text-xs text-gray-400">{formatBytes(item.peso)}</p>
              </div>
              <div className="flex-shrink-0 flex gap-1">
                <button onClick={() => mover(item.id, -1)} disabled={i === 0} className="text-gray-400 hover:text-blue-600 disabled:opacity-30 p-1" title="Subir">
                  ↑
                </button>
                <button onClick={() => mover(item.id, 1)} disabled={i === archivos.length - 1} className="text-gray-400 hover:text-blue-600 disabled:opacity-30 p-1" title="Bajar">
                  ↓
                </button>
                <button onClick={() => quitar(item.id)} className="text-gray-400 hover:text-red-500 p-1" title="Quitar">
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={generarPDF}
        disabled={archivos.length === 0 || generando}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        {generando ? 'Generando PDF…' : `Descargar PDF (${archivos.length} ${archivos.length === 1 ? 'imagen' : 'imágenes'})`}
      </button>

      <p className="text-xs text-gray-400">
        Todo el proceso ocurre en tu navegador; tus imágenes nunca se suben a ningún servidor.
      </p>
    </div>
  )
}
