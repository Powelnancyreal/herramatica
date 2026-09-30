'use client'

import { useCallback, useEffect, useState } from 'react'
import { uuidv4, uuidv7 } from '@/lib/calc/dev'
import { buttonClass, CopyButton, Field, inputClass, NumberInput } from '@/components/calc-ui'

export default function GeneradorUUID() {
  const [version, setVersion] = useState('4')
  const [cantidad, setCantidad] = useState('5')
  const [mayusculas, setMayusculas] = useState(false)
  const [sinGuiones, setSinGuiones] = useState(false)
  const [lista, setLista] = useState([])

  const generar = useCallback(() => {
    const n = Math.min(Math.max(parseInt(cantidad, 10) || 1, 1), 1000)
    const gen = version === '7' ? uuidv7 : uuidv4
    setLista(
      Array.from({ length: n }, () => {
        let u = gen()
        if (sinGuiones) u = u.replace(/-/g, '')
        return mayusculas ? u.toUpperCase() : u
      })
    )
  }, [version, cantidad, mayusculas, sinGuiones])

  useEffect(() => {
    generar()
  }, [generar])

  const texto = lista.join('\n')

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Versión">
          <select value={version} onChange={(e) => setVersion(e.target.value)} className={inputClass}>
            <option value="4">UUID v4 (aleatorio)</option>
            <option value="7">UUID v7 (ordenado por tiempo)</option>
          </select>
        </Field>
        <Field label="Cantidad" hint="Hasta 1000 a la vez.">
          <NumberInput value={cantidad} onChange={setCantidad} min="1" max="1000" step="1" />
        </Field>
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-gray-700">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={mayusculas} onChange={(e) => setMayusculas(e.target.checked)} /> Mayúsculas
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={sinGuiones} onChange={(e) => setSinGuiones(e.target.checked)} /> Sin guiones
        </label>
      </div>
      <button onClick={generar} className={buttonClass}>Generar de nuevo</button>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">{lista.length} UUID generado{lista.length === 1 ? '' : 's'}</p>
          <CopyButton text={texto} label="Copiar todos" />
        </div>
        <pre className="bg-gray-900 text-green-300 text-sm rounded-lg p-4 overflow-auto max-h-96 font-mono">{texto}</pre>
      </div>
      <p className="text-xs text-gray-500">
        Generados con el generador criptográfico de tu navegador (crypto.getRandomValues). No se guardan ni se envían.
      </p>
    </div>
  )
}
