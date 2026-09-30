'use client'

import { useCallback, useEffect, useState } from 'react'
import { generarLorem } from '@/lib/calc/dev'
import { buttonClass, CopyButton, Field, inputClass, NumberInput } from '@/components/calc-ui'

export default function GeneradorLoremIpsum() {
  const [tipo, setTipo] = useState('parrafos')
  const [cantidad, setCantidad] = useState('3')
  const [empezar, setEmpezar] = useState(true)
  const [html, setHtml] = useState(false)
  const [bloques, setBloques] = useState([])

  const generar = useCallback(() => {
    const max = tipo === 'palabras' ? 2000 : tipo === 'oraciones' ? 200 : 50
    const n = Math.min(Math.max(parseInt(cantidad, 10) || 1, 1), max)
    setBloques(generarLorem({ tipo, cantidad: n, empezarConLorem: empezar }))
  }, [tipo, cantidad, empezar])

  useEffect(() => {
    generar()
  }, [generar])

  const texto = html ? bloques.map((b) => `<p>${b}</p>`).join('\n') : bloques.join('\n\n')
  const palabras = bloques.join(' ').split(/\s+/).filter(Boolean).length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Generar">
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className={inputClass}>
            <option value="parrafos">Párrafos</option>
            <option value="oraciones">Oraciones</option>
            <option value="palabras">Palabras</option>
          </select>
        </Field>
        <Field label="Cantidad">
          <NumberInput value={cantidad} onChange={setCantidad} min="1" step="1" />
        </Field>
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-gray-700">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={empezar} onChange={(e) => setEmpezar(e.target.checked)} /> Empezar con «Lorem ipsum dolor sit amet»
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={html} onChange={(e) => setHtml(e.target.checked)} /> Envolver en etiquetas &lt;p&gt;
        </label>
      </div>
      <button onClick={generar} className={buttonClass}>Generar otro texto</button>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">{palabras.toLocaleString('es-MX')} palabras · {texto.length.toLocaleString('es-MX')} caracteres</p>
          <CopyButton text={texto} />
        </div>
        {html ? (
          <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm whitespace-pre-wrap max-h-96 overflow-auto">{texto}</pre>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-700 space-y-3 max-h-96 overflow-auto">
            {bloques.map((b, i) => (
              <p key={i}>{b}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
