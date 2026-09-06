'use client'

import { useMemo, useState } from 'react'

const L_CODE = {
  0: '0001101', 1: '0011001', 2: '0010011', 3: '0111101', 4: '0100011',
  5: '0110001', 6: '0101111', 7: '0111011', 8: '0110111', 9: '0001011',
}
const G_CODE = {
  0: '0100111', 1: '0110011', 2: '0011011', 3: '0100001', 4: '0011101',
  5: '0111001', 6: '0000101', 7: '0010001', 8: '0001001', 9: '0010111',
}
const R_CODE = Object.fromEntries(
  Object.entries(L_CODE).map(([d, code]) => [d, code.split('').map((b) => (b === '0' ? '1' : '0')).join('')])
)
const PARIDAD = {
  0: 'LLLLLL', 1: 'LLGLGG', 2: 'LLGGLG', 3: 'LLGGGL', 4: 'LGLLGG',
  5: 'LGGLLG', 6: 'LGGGLL', 7: 'LGLGLG', 8: 'LGLGGL', 9: 'LGGLGL',
}

export function calcularDigitoControlEAN13(digitos12) {
  let sum = 0
  for (let i = 0; i < 12; i++) {
    const d = parseInt(digitos12[i], 10)
    sum += i % 2 === 0 ? d : d * 3
  }
  return (10 - (sum % 10)) % 10
}

export function codificarEAN13(codigo13) {
  const first = parseInt(codigo13[0], 10)
  const izquierda = codigo13.slice(1, 7)
  const derecha = codigo13.slice(7, 13)
  const paridad = PARIDAD[first]

  let bits = '101'
  for (let i = 0; i < 6; i++) {
    const d = izquierda[i]
    bits += paridad[i] === 'L' ? L_CODE[d] : G_CODE[d]
  }
  bits += '01010'
  for (let i = 0; i < 6; i++) {
    bits += R_CODE[derecha[i]]
  }
  bits += '101'
  return bits
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white font-mono'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function GeneradorCodigoDeBarras() {
  const [entrada, setEntrada] = useState('590123412345')

  const resultado = useMemo(() => {
    const soloDigitos = entrada.replace(/\D/g, '')
    if (soloDigitos.length < 12) return { error: 'Introduce al menos 12 dígitos.' }
    const digitos12 = soloDigitos.slice(0, 12)
    const check = calcularDigitoControlEAN13(digitos12)
    const codigo13 = digitos12 + check
    const bits = codificarEAN13(codigo13)
    return { codigo13, bits }
  }, [entrada])

  function descargar() {
    if (resultado.error) return
    const svg = document.getElementById('barcode-svg')
    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(svg)
    const canvas = document.createElement('canvas')
    const scale = 3
    canvas.width = svg.viewBox.baseVal.width * scale
    canvas.height = svg.viewBox.baseVal.height * scale
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const img = new Image()
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
      a.download = `codigo-barras-${resultado.codigo13}.png`
      a.click()
    }
    img.src = url
  }

  const moduleWidth = 2.2
  const barHeight = 90
  const totalWidth = 95 * moduleWidth + 20

  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Código (12 dígitos, el 13º se calcula automáticamente)</label>
        <input
          type="text"
          inputMode="numeric"
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          placeholder="Ej: 590123412345"
          maxLength={13}
          className={inputClass}
        />
      </div>

      {resultado.error ? (
        <p className="text-sm text-red-600">{resultado.error}</p>
      ) : (
        <div className="space-y-4">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4 flex justify-center overflow-x-auto">
            <svg id="barcode-svg" viewBox={`0 0 ${totalWidth} ${barHeight + 30}`} width={totalWidth} height={barHeight + 30}>
              <rect x="0" y="0" width={totalWidth} height={barHeight + 30} fill="white" />
              {resultado.bits.split('').map((bit, i) =>
                bit === '1' ? (
                  <rect key={i} x={10 + i * moduleWidth} y="0" width={moduleWidth} height={barHeight} fill="black" />
                ) : null
              )}
              <text x={totalWidth / 2} y={barHeight + 20} textAnchor="middle" fontFamily="monospace" fontSize="16" fill="black" letterSpacing="2">
                {resultado.codigo13}
              </text>
            </svg>
          </div>
          <button onClick={descargar} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
            Descargar imagen (PNG)
          </button>
        </div>
      )}

      <p className="text-xs text-gray-500">
        ⚠️ Genera códigos de barras EAN-13 estándar, el formato usado en la mayoría de productos comerciales. Antes
        de usarlo en un producto real, verifica que escanee correctamente con un lector de tu punto de venta.
      </p>
    </div>
  )
}
