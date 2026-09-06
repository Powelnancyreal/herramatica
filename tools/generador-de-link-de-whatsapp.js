'use client'

import { useMemo, useState } from 'react'

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function GeneradorDeLinkDeWhatsapp() {
  const [numero, setNumero] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [copiado, setCopiado] = useState(false)

  const digits = numero.replace(/[^\d]/g, '')

  const link = useMemo(() => {
    if (!digits) return null
    return `https://wa.me/${digits}${mensaje ? '?text=' + encodeURIComponent(mensaje) : ''}`
  }, [digits, mensaje])

  async function copiar() {
    if (!link) return
    try {
      await navigator.clipboard.writeText(link)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      // portapapeles no disponible
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Número de WhatsApp (con código de país, sin espacios ni signo +)</label>
        <input
          type="text"
          inputMode="numeric"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          placeholder="Ej: 5215512345678"
          className={inputClass}
        />
        <p className="text-xs text-gray-500 mt-1.5">
          Incluye el código de país sin el símbolo +. Por ejemplo, México: 52, Argentina: 54, España: 34.
        </p>
      </div>

      <div>
        <label className={labelClass}>Mensaje predefinido (opcional)</label>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          rows={3}
          placeholder="Ej: Hola, quisiera más información sobre..."
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-y"
        />
      </div>

      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-5">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Tu enlace de WhatsApp</p>
        <p className="text-sm font-mono text-gray-900 break-all min-h-[1.5rem]">{link || '—'}</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={copiar}
          disabled={!link}
          className={`flex-1 font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            copiado ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {copiado ? '¡Enlace copiado!' : 'Copiar enlace'}
        </button>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Probar enlace
          </a>
        )}
      </div>

      <p className="text-xs text-gray-500">
        ¿Necesitas un código QR para imprimir en un cartel o tarjeta? Usa nuestro generador de códigos QR, que
        también admite enlaces de WhatsApp directamente.
      </p>
    </div>
  )
}
