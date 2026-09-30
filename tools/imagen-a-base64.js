'use client'

import { useState } from 'react'
import { CopyButton, formatNumber, inputClass, Tabs } from '@/components/calc-ui'

const MODOS = [
  { id: 'codificar', label: 'Imagen → Base64' },
  { id: 'decodificar', label: 'Base64 → Imagen' },
]
const MAX_MB = 10

function tamano(n) {
  return n < 1024 * 1024 ? `${formatNumber(n / 1024, 1)} KB` : `${formatNumber(n / 1024 / 1024, 2)} MB`
}

export default function ImagenABase64() {
  const [modo, setModo] = useState('codificar')
  const [archivo, setArchivo] = useState(null)
  const [dataUri, setDataUri] = useState('')
  const [error, setError] = useState('')
  const [pegado, setPegado] = useState('')
  const [arrastrando, setArrastrando] = useState(false)

  function leer(f) {
    setError('')
    if (!f) return
    if (!f.type.startsWith('image/')) return setError('El archivo no es una imagen (PNG, JPG, GIF, WebP, SVG o ICO).')
    if (f.size > MAX_MB * 1024 * 1024) return setError(`La imagen pesa más de ${MAX_MB} MB. Para imágenes grandes, Base64 no es buena idea: usa un archivo normal.`)
    const lector = new FileReader()
    lector.onload = () => {
      setArchivo({ nombre: f.name, tipo: f.type, tamano: f.size })
      setDataUri(String(lector.result))
    }
    lector.readAsDataURL(f)
  }

  const base64 = dataUri.split(',')[1] || ''
  const salidas = dataUri
    ? [
        ['Data URI', dataUri],
        ['Solo Base64', base64],
        ['HTML <img>', `<img src="${dataUri}" alt="">`],
        ['CSS background', `background-image: url("${dataUri}");`],
        ['Markdown', `![imagen](${dataUri})`],
      ]
    : []

  const decodificado = (() => {
    const t = pegado.trim()
    if (!t) return null
    if (t.startsWith('data:image/')) return t
    const limpio = t.replace(/\s/g, '')
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(limpio)) return 'invalido'
    const tipo = limpio.startsWith('/9j/') ? 'jpeg' : limpio.startsWith('iVBOR') ? 'png' : limpio.startsWith('R0lGOD') ? 'gif' : limpio.startsWith('UklGR') ? 'webp' : limpio.startsWith('PHN2Zy') || limpio.startsWith('PD94bW') ? 'svg+xml' : 'png'
    return `data:image/${tipo};base64,${limpio}`
  })()

  return (
    <div className="space-y-5">
      <Tabs tabs={MODOS} value={modo} onChange={setModo} />
      {modo === 'codificar' ? (
        <>
          <label
            onDragOver={(e) => {
              e.preventDefault()
              setArrastrando(true)
            }}
            onDragLeave={() => setArrastrando(false)}
            onDrop={(e) => {
              e.preventDefault()
              setArrastrando(false)
              leer(e.dataTransfer.files?.[0])
            }}
            className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-8 cursor-pointer text-center ${arrastrando ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
          >
            <span className="text-3xl">🖼️</span>
            <span className="text-sm text-gray-700">Arrastra una imagen aquí o <strong className="text-blue-600">elige un archivo</strong></span>
            <span className="text-xs text-gray-500">La imagen no se sube a ningún servidor: se convierte en tu navegador.</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => leer(e.target.files?.[0])} />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {archivo && (
            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={dataUri} alt={`Vista previa de ${archivo.nombre}`} className="w-24 h-24 object-contain rounded-lg border border-gray-200 bg-gray-50" />
                <div className="text-sm text-gray-700 space-y-0.5">
                  <p className="font-semibold text-gray-900 break-all">{archivo.nombre}</p>
                  <p>{archivo.tipo} · original {tamano(archivo.tamano)}</p>
                  <p>Base64: {tamano(base64.length)} (+{formatNumber((base64.length / archivo.tamano - 1) * 100, 0)}%)</p>
                </div>
              </div>
              {salidas.map(([t, v]) => (
                <div key={t}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-gray-700">{t}</p>
                    <CopyButton text={v} />
                  </div>
                  <textarea readOnly value={v.length > 5000 ? `${v.slice(0, 5000)}… (usa «Copiar» para el texto completo)` : v} rows={2} className={`${inputClass} font-mono text-xs bg-gray-50`} />
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <textarea value={pegado} onChange={(e) => setPegado(e.target.value)} rows={6} className={`${inputClass} font-mono text-xs`} placeholder="Pega un data URI (data:image/png;base64,...) o solo el texto Base64" spellCheck={false} />
          {decodificado === 'invalido' && <p className="text-sm text-red-600">El texto contiene caracteres que no son Base64.</p>}
          {decodificado && decodificado !== 'invalido' && (
            <div className="space-y-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={decodificado} alt="Imagen decodificada desde Base64" className="max-h-80 rounded-lg border border-gray-200 bg-gray-50" />
              <a href={decodificado} download="imagen" className="inline-block text-sm text-blue-600 font-medium">⬇ Descargar imagen</a>
            </div>
          )}
        </>
      )}
    </div>
  )
}
