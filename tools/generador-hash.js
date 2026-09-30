'use client'

import { useEffect, useState } from 'react'
import { bytesToHex, md5 } from '@/lib/calc/dev'
import { CopyButton, inputClass, Tabs } from '@/components/calc-ui'

const ALGORITMOS = [
  { id: 'MD5', nota: 'Obsoleto para seguridad; útil para verificar descargas antiguas.' },
  { id: 'SHA-1', nota: 'Obsoleto para seguridad (colisiones demostradas en 2017).' },
  { id: 'SHA-256', nota: 'Recomendado: estándar actual para integridad de archivos.' },
  { id: 'SHA-384', nota: 'Familia SHA-2, salida de 384 bits.' },
  { id: 'SHA-512', nota: 'Familia SHA-2, salida de 512 bits.' },
]
const MAX_ARCHIVO = 200 * 1024 * 1024

async function calcularHashes(bytes) {
  const out = {}
  for (const a of ALGORITMOS) {
    out[a.id] = a.id === 'MD5' ? md5(bytes) : bytesToHex(new Uint8Array(await crypto.subtle.digest(a.id, bytes)))
  }
  return out
}

export default function GeneradorHash() {
  const [modo, setModo] = useState('texto')
  const [texto, setTexto] = useState('')
  const [archivo, setArchivo] = useState(null)
  const [hashes, setHashes] = useState(null)
  const [comparar, setComparar] = useState('')
  const [mayus, setMayus] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (modo !== 'texto') return
    let vigente = true
    calcularHashes(new TextEncoder().encode(texto)).then((h) => vigente && setHashes(h))
    return () => {
      vigente = false
    }
  }, [texto, modo])

  async function onArchivo(e) {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > MAX_ARCHIVO) return setError('El archivo supera los 200 MB.')
    setError('')
    setHashes(null)
    setArchivo({ nombre: f.name, tamano: f.size, calculando: true })
    const h = await calcularHashes(new Uint8Array(await f.arrayBuffer()))
    setArchivo({ nombre: f.name, tamano: f.size })
    setHashes(h)
  }

  const objetivo = comparar.trim().toLowerCase().replace(/\s/g, '')
  const coincide = objetivo && hashes ? Object.entries(hashes).find(([, v]) => v === objetivo)?.[0] : null

  return (
    <div className="space-y-4">
      <Tabs
        tabs={[
          { id: 'texto', label: 'Texto' },
          { id: 'archivo', label: 'Archivo' },
        ]}
        value={modo}
        onChange={(m) => {
          setModo(m)
          setHashes(null)
        }}
      />
      {modo === 'texto' ? (
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={4}
          placeholder="Escribe o pega el texto (se codifica en UTF-8)"
          className={`${inputClass} font-mono text-sm`}
        />
      ) : (
        <div className="space-y-1">
          <input type="file" onChange={onArchivo} className="block text-sm" />
          <p className="text-xs text-gray-500">Hasta 200 MB. El archivo se procesa en tu navegador y no se sube a ningún servidor.</p>
          {archivo && (
            <p className="text-sm text-gray-700">
              {archivo.nombre} · {(archivo.tamano / 1024 / 1024).toFixed(2)} MB {archivo.calculando && '· calculando…'}
            </p>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      )}
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={mayus} onChange={(e) => setMayus(e.target.checked)} /> Mostrar en mayúsculas
      </label>

      {hashes && (
        <div className="space-y-2">
          {ALGORITMOS.map((a) => {
            const valor = mayus ? hashes[a.id].toUpperCase() : hashes[a.id]
            return (
              <div key={a.id} className={`rounded-lg border p-3 ${coincide === a.id ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-800">{a.id}</span>
                  <CopyButton text={valor} />
                </div>
                <p className="font-mono text-xs break-all text-gray-800">{valor}</p>
                <p className="text-xs text-gray-500 mt-1">{a.nota}</p>
              </div>
            )
          })}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Verificar: pega el hash publicado por el sitio de descarga</label>
        <input value={comparar} onChange={(e) => setComparar(e.target.value)} spellCheck={false} className={`${inputClass} font-mono text-sm`} />
        {objetivo && hashes && (
          <p className={`text-sm mt-2 font-semibold ${coincide ? 'text-green-700' : 'text-red-600'}`}>
            {coincide ? `✓ Coincide con el ${coincide}: el contenido es idéntico.` : '✗ No coincide con ningún algoritmo: el contenido es distinto o el hash está mal copiado.'}
          </p>
        )}
      </div>
    </div>
  )
}
