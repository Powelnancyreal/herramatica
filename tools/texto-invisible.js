'use client'

import { useState } from 'react'

const CHAR_TYPES = [
  { label: 'Espacio de ancho cero (U+200B)', value: '\u200B', name: 'zero-width-space' },
  { label: 'No-unificador de ancho cero (U+200C)', value: '\u200C', name: 'zero-width-non-joiner' },
  { label: 'Unificador de ancho cero (U+200D)', value: '\u200D', name: 'zero-width-joiner' },
  { label: 'Espacio de no separación (U+00A0)', value: '\u00A0', name: 'non-breaking-space' },
  { label: 'Espacio ideográfico (U+3000)', value: '\u3000', name: 'ideographic-space' },
]

export default function TextoInvisible() {
  const [charType, setCharType] = useState(0)
  const [count, setCount] = useState(10)
  const [generated, setGenerated] = useState('')
  const [copied, setCopied] = useState(false)

  function handleGenerate() {
    const char = CHAR_TYPES[charType].value
    setGenerated(char.repeat(count))
    setCopied(false)
  }

  async function handleCopy() {
    if (!generated) return
    try {
      await navigator.clipboard.writeText(generated)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea')
      el.value = generated
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-5">
      {/* Type selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Tipo de carácter invisible
        </label>
        <select
          value={charType}
          onChange={(e) => setCharType(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          {CHAR_TYPES.map((type, i) => (
            <option key={i} value={i}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Count */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Cantidad de caracteres: <span className="text-blue-600 font-bold">{count}</span>
        </label>
        <input
          type="range"
          min={1}
          max={200}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>1</span>
          <span>200</span>
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Generar texto invisible
      </button>

      {/* Output */}
      {generated && (
        <div className="space-y-3">
          <div className="relative">
            <div className="w-full min-h-[80px] border border-gray-200 rounded-lg bg-gray-50 px-4 py-3 flex items-center">
              <span className="text-sm text-gray-500 italic">
                {count} carácter{count !== 1 ? 'es' : ''} invisible{count !== 1 ? 's' : ''} generado{count !== 1 ? 's' : ''} — seleccionado automáticamente
              </span>
            </div>
            {/* Hidden textarea to hold actual content */}
            <textarea
              readOnly
              value={generated}
              aria-hidden="true"
              className="sr-only"
            />
          </div>

          <button
            onClick={handleCopy}
            className={`w-full font-semibold py-3 px-6 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              copied
                ? 'bg-green-500 text-white focus:ring-green-400'
                : 'bg-gray-900 hover:bg-gray-800 text-white focus:ring-gray-700'
            }`}
          >
            {copied ? '¡Copiado!' : 'Copiar al portapapeles'}
          </button>

          <p className="text-xs text-center text-gray-500">
            Pega el texto copiado directamente en WhatsApp, Instagram u otras apps.
          </p>
        </div>
      )}
    </div>
  )
}
