'use client'

import { useState } from 'react'

// Los dos primeros ocupan espacio y la mayoría de apps no los borran: son los que sirven para nombres y
// mensajes «en blanco». Los de ancho cero no dejan hueco visible.
const CHAR_TYPES = [
  { label: 'Relleno hangul (U+3164)', corto: 'U+3164', value: 'ㅤ', uso: 'El más usado para nombres en blanco en Free Fire, WhatsApp o Instagram.' },
  { label: 'Braille en blanco (U+2800)', corto: 'U+2800', value: '⠀', uso: 'Para mensajes, bios y apodos vacíos. Funciona donde se admite el alfabeto braille.' },
  { label: 'Espacio de ancho cero (U+200B)', corto: 'U+200B', value: '​', uso: 'No deja hueco: sirve para separar palabras o enlaces sin que se note.' },
  { label: 'No unificador de ancho cero (U+200C)', corto: 'U+200C', value: '‌', uso: 'No deja hueco: evita que dos letras o emojis se unan.' },
  { label: 'Unificador de ancho cero (U+200D)', corto: 'U+200D', value: '‍', uso: 'No deja hueco: une emojis compuestos.' },
  { label: 'Espacio de no separación (U+00A0)', corto: 'U+00A0', value: ' ', uso: 'Un espacio normal que no parte la línea y que muchas apps no eliminan.' },
  { label: 'Espacio ideográfico (U+3000)', corto: 'U+3000', value: '　', uso: 'Un espacio ancho, del tamaño de un carácter chino o japonés.' },
]

async function copiar(texto) {
  try {
    await navigator.clipboard.writeText(texto)
  } catch {
    // Navegadores antiguos o sin permiso de portapapeles
    const el = document.createElement('textarea')
    el.value = texto
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
}

export default function TextoInvisible() {
  const [charType, setCharType] = useState(0)
  const [count, setCount] = useState(10)
  const [generated, setGenerated] = useState('')
  const [copiado, setCopiado] = useState('')

  async function avisarCopiado(texto, clave) {
    await copiar(texto)
    setCopiado(clave)
    setTimeout(() => setCopiado(''), 2000)
  }

  function handleGenerate() {
    setGenerated(CHAR_TYPES[charType].value.repeat(count))
    setCopiado('')
  }

  const tipo = CHAR_TYPES[charType]

  return (
    <div className="space-y-6">
      {/* Copia rápida de un solo carácter */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Copia rápida: un carácter invisible</p>
        <div className="grid grid-cols-2 gap-2">
          {CHAR_TYPES.slice(0, 2).map((t) => (
            <button
              key={t.corto}
              type="button"
              onClick={() => avisarCopiado(t.value, t.corto)}
              className={`rounded-xl border px-3 py-3 text-left transition-colors ${copiado === t.corto ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
            >
              <span className="block text-sm font-semibold text-gray-900">{copiado === t.corto ? '¡Copiado!' : `Copiar ${t.corto}`}</span>
              <span className="block text-xs text-gray-500">{t.label.split(' (')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-5 space-y-5">
        <div>
          <label htmlFor="ti-tipo" className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de carácter invisible</label>
          <select
            id="ti-tipo"
            value={charType}
            onChange={(e) => { setCharType(Number(e.target.value)); setGenerated('') }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            {CHAR_TYPES.map((t, i) => <option key={t.corto} value={i}>{t.label}</option>)}
          </select>
          <p className="mt-1.5 text-xs text-gray-500">{tipo.uso}</p>
        </div>

        <div>
          <label htmlFor="ti-cantidad" className="block text-sm font-medium text-gray-700 mb-1.5">
            Cantidad de caracteres: <span className="text-blue-600 font-bold">{count}</span>
          </label>
          <input id="ti-cantidad" type="range" min={1} max={200} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full accent-blue-600" />
          <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1</span><span>200</span></div>
        </div>

        <button
          onClick={handleGenerate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Generar texto invisible
        </button>
      </div>

      <div aria-live="polite">
        {generated && (
          <div className="space-y-3">
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3">
              <p className="text-sm text-gray-600">
                {count} {count === 1 ? 'carácter' : 'caracteres'} {tipo.corto} listos para copiar. El recuadro de abajo los contiene aunque no se vean:
              </p>
              <p className="mt-2 rounded bg-white border border-gray-200 px-2 py-1 font-mono text-sm text-gray-400 break-all">
                [<span className="bg-blue-100 text-gray-900">{generated}</span>]
              </p>
            </div>
            <button
              onClick={() => avisarCopiado(generated, 'generado')}
              className={`w-full font-semibold py-3 px-6 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${copiado === 'generado' ? 'bg-green-500 text-white focus:ring-green-400' : 'bg-gray-900 hover:bg-gray-800 text-white focus:ring-gray-700'}`}
            >
              {copiado === 'generado' ? '¡Copiado!' : 'Copiar al portapapeles'}
            </button>
            <p className="text-xs text-center text-gray-500">Pega el texto copiado en WhatsApp, Instagram, tu juego u otra app.</p>
          </div>
        )}
      </div>
    </div>
  )
}
