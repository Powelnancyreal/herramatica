'use client'

import { useState } from 'react'
import { bytesToBase64, codificarBase64, decodificarBase64 } from '@/lib/calc/dev'
import { CopyButton, inputClass, Tabs } from '@/components/calc-ui'

const MAX_ARCHIVO = 10 * 1024 * 1024

export default function CodificadorBase64() {
  const [modo, setModo] = useState('codificar')
  const [entrada, setEntrada] = useState('')
  const [urlSafe, setUrlSafe] = useState(false)
  const [archivo, setArchivo] = useState(null)

  let salida = ''
  let error = ''
  if (modo === 'codificar') salida = entrada ? codificarBase64(entrada, urlSafe) : ''
  else if (modo === 'decodificar' && entrada.trim()) {
    try {
      salida = decodificarBase64(entrada)
    } catch (e) {
      error =
        e instanceof TypeError || e.name === 'TypeError'
          ? 'El contenido decodificado no es texto UTF-8 (probablemente es un archivo binario, como una imagen).'
          : e.message
    }
  }

  async function onArchivo(e) {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > MAX_ARCHIVO) return setArchivo({ error: 'El archivo supera 10 MB.' })
    const bytes = new Uint8Array(await f.arrayBuffer())
    const b64 = bytesToBase64(bytes)
    setArchivo({ nombre: f.name, tipo: f.type || 'application/octet-stream', tamano: f.size, dataUri: `data:${f.type || 'application/octet-stream'};base64,${b64}` })
  }

  return (
    <div className="space-y-4">
      <Tabs
        tabs={[
          { id: 'codificar', label: 'Codificar texto' },
          { id: 'decodificar', label: 'Decodificar' },
          { id: 'archivo', label: 'Archivo a Base64' },
        ]}
        value={modo}
        onChange={setModo}
      />

      {modo !== 'archivo' ? (
        <>
          <textarea
            value={entrada}
            onChange={(e) => setEntrada(e.target.value)}
            rows={6}
            spellCheck={false}
            placeholder={modo === 'codificar' ? 'Escribe o pega el texto a codificar' : 'Pega el texto en Base64'}
            className={`${inputClass} font-mono text-sm`}
          />
          {modo === 'codificar' && (
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={urlSafe} onChange={(e) => setUrlSafe(e.target.checked)} />
              Base64 seguro para URL (usa - y _ y quita el relleno =)
            </label>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {salida && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">Resultado ({salida.length.toLocaleString('es-MX')} caracteres)</p>
                <CopyButton text={salida} />
              </div>
              <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm whitespace-pre-wrap break-all max-h-80 overflow-auto">{salida}</pre>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-3">
          <input type="file" onChange={onArchivo} className="block text-sm" />
          <p className="text-xs text-gray-500">Máximo 10 MB. El archivo no sale de tu dispositivo.</p>
          {archivo?.error && <p className="text-sm text-red-600">{archivo.error}</p>}
          {archivo?.dataUri && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-gray-700">
                  {archivo.nombre} · {(archivo.tamano / 1024).toFixed(1)} KB → {(archivo.dataUri.length / 1024).toFixed(1)} KB en Base64
                </p>
                <CopyButton text={archivo.dataUri} label="Copiar data URI" />
              </div>
              {archivo.tipo.startsWith('image/') && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={archivo.dataUri} alt={`Vista previa de ${archivo.nombre}`} className="max-h-48 rounded border" />
              )}
              <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs whitespace-pre-wrap break-all max-h-60 overflow-auto">
                {archivo.dataUri.slice(0, 5000)}
                {archivo.dataUri.length > 5000 && '…'}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
