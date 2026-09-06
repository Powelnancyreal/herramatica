'use client'

import { useMemo, useState } from 'react'

// Excepciones documentadas en el bloque Unicode "Mathematical Alphanumeric Symbols":
// Doble rayado (double-struck) mayúsculas: C, H, N, P, Q, R, Z usan símbolos ya existentes en Unicode.
const DOBLE_RAYADO_EXCEPCIONES = { C: 0x2102, H: 0x210d, N: 0x2115, P: 0x2119, Q: 0x211a, R: 0x211d, Z: 0x2124 }
// Cursiva (italic) minúscula: la "h" usa el símbolo de la constante de Planck en lugar del rango matemático.
const ITALICA_EXCEPCION_H = 0x210e

function generarEstilo({ upperBase, lowerBase, digitBase, excepcionesUpper }) {
  return (texto) =>
    [...texto]
      .map((ch) => {
        const code = ch.codePointAt(0)
        if (ch >= 'A' && ch <= 'Z') {
          if (excepcionesUpper && excepcionesUpper[ch]) return String.fromCodePoint(excepcionesUpper[ch])
          return upperBase !== null ? String.fromCodePoint(upperBase + (code - 65)) : ch
        }
        if (ch >= 'a' && ch <= 'z') {
          if (ch === 'h' && lowerBase === 0x1d44e) return String.fromCodePoint(ITALICA_EXCEPCION_H)
          return lowerBase !== null ? String.fromCodePoint(lowerBase + (code - 97)) : ch
        }
        if (ch >= '0' && ch <= '9' && digitBase !== null && digitBase !== undefined) {
          return String.fromCodePoint(digitBase + (code - 48))
        }
        return ch
      })
      .join('')
}

const CIRCULO_DIGITOS = ['⓪', ...Array.from({ length: 9 }, (_, i) => String.fromCodePoint(0x2460 + i))]
function circulado(texto) {
  return [...texto]
    .map((ch) => {
      if (ch >= 'A' && ch <= 'Z') return String.fromCodePoint(0x24b6 + (ch.charCodeAt(0) - 65))
      if (ch >= 'a' && ch <= 'z') return String.fromCodePoint(0x24d0 + (ch.charCodeAt(0) - 97))
      if (ch >= '0' && ch <= '9') return CIRCULO_DIGITOS[ch.charCodeAt(0) - 48]
      return ch
    })
    .join('')
}

const MAPA_VOLTEADO = {
  a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ', j: 'ɾ',
  k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ',
  u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z',
  '.': '˙', ',': "'", "'": ',', '?': '¿', '!': '¡', '"': ',,',
}
function voltear(texto) {
  return [...texto]
    .reverse()
    .map((ch) => MAPA_VOLTEADO[ch.toLowerCase()] || ch)
    .join('')
}

function combinando(marca) {
  return (texto) => [...texto].map((ch) => (ch === ' ' ? ch : ch + marca)).join('')
}

const ESTILOS_BASE = [
  { id: 'negrita', label: 'Negrita', fn: generarEstilo({ upperBase: 0x1d400, lowerBase: 0x1d41a, digitBase: 0x1d7ce }) },
  { id: 'cursiva', label: 'Italica', fn: generarEstilo({ upperBase: 0x1d434, lowerBase: 0x1d44e, digitBase: null }) },
  { id: 'negrita_cursiva', label: 'Negrita cursiva', fn: generarEstilo({ upperBase: 0x1d468, lowerBase: 0x1d482, digitBase: null }) },
  { id: 'script', label: 'Script elegante', fn: generarEstilo({ upperBase: 0x1d4d0, lowerBase: 0x1d4ea, digitBase: null }) },
  { id: 'gotico', label: 'Gotico', fn: generarEstilo({ upperBase: 0x1d56c, lowerBase: 0x1d586, digitBase: null }) },
  {
    id: 'doble_rayado',
    label: 'Doble rayado',
    fn: generarEstilo({ upperBase: 0x1d538, lowerBase: 0x1d552, digitBase: 0x1d7d8, excepcionesUpper: DOBLE_RAYADO_EXCEPCIONES }),
  },
  { id: 'sans', label: 'Sans serif', fn: generarEstilo({ upperBase: 0x1d5a0, lowerBase: 0x1d5ba, digitBase: 0x1d7e2 }) },
  { id: 'monoespaciado', label: 'Monoespaciado', fn: generarEstilo({ upperBase: 0x1d670, lowerBase: 0x1d68a, digitBase: 0x1d7f6 }) },
  { id: 'ancho_completo', label: 'Ancho completo', fn: generarEstilo({ upperBase: 0xff21, lowerBase: 0xff41, digitBase: 0xff10 }) },
  { id: 'circulado', label: 'Circulado', fn: circulado },
  { id: 'volteado', label: 'Volteado', fn: voltear },
  { id: 'tachado', label: 'Tachado', fn: combinando('̶') },
  { id: 'subrayado', label: 'Subrayado', fn: combinando('̲') },
]

const ESTILOS = ESTILOS_BASE.map((e) => ({ ...e, label: e.fn(e.label) }))

export default function TipografiaParaInstagram() {
  const [texto, setTexto] = useState('Herramatica')
  const [copiadoId, setCopiadoId] = useState(null)

  const resultados = useMemo(() => ESTILOS.map((e) => ({ id: e.id, label: e.label, valor: e.fn(texto) })), [texto])

  async function copiar(id, valor) {
    try {
      await navigator.clipboard.writeText(valor)
      setCopiadoId(id)
      setTimeout(() => setCopiadoId(null), 1500)
    } catch {
      // portapapeles no disponible
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Escribe tu texto</label>
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Ej: Herramatica"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        />
      </div>

      <div className="space-y-2">
        {resultados.map((r) => (
          <button
            key={r.id}
            onClick={() => copiar(r.id, r.valor)}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-colors flex items-center justify-between gap-3 ${
              copiadoId === r.id ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <span className="text-lg text-gray-900 break-all">{r.valor || texto}</span>
            <span className="flex-shrink-0 text-xs font-semibold text-gray-400">{copiadoId === r.id ? '¡Copiado!' : 'Copiar'}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
