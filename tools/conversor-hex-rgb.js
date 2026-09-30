'use client'

import { useMemo, useState } from 'react'
import { fmtHsl, fmtRgb, hexARgb, parseRgb, rgbAHex, rgbAHsl } from '@/lib/calc/color'
import { CopyButton, inputClass, Tabs } from '@/components/calc-ui'

const MODOS = [
  { id: 'hex', label: 'HEX → RGB' },
  { id: 'rgb', label: 'RGB → HEX' },
]

function convertirLinea(linea, modo) {
  const t = linea.trim()
  if (!t) return null
  const rgb = modo === 'hex' ? hexARgb(t) : parseRgb(t)
  if (!rgb) return { entrada: t, error: true }
  return { entrada: t, rgb, hex: rgbAHex(rgb), rgbTexto: fmtRgb(rgb), hsl: fmtHsl(rgbAHsl(rgb), rgb.a) }
}

export default function ConversorHexRgb() {
  const [modo, setModo] = useState('hex')
  const [texto, setTexto] = useState('#FF5733\n#1E90FF\n#2ECC71\n#FFF\n#00000080')

  const filas = useMemo(() => texto.split('\n').map((l) => convertirLinea(l, modo)).filter(Boolean), [texto, modo])
  const validas = filas.filter((f) => !f.error)
  const salidaTexto = validas.map((f) => (modo === 'hex' ? f.rgbTexto : f.hex)).join('\n')

  function cambiar(m) {
    if (validas.length) setTexto(validas.map((f) => (m === 'rgb' ? f.rgbTexto : f.hex)).join('\n'))
    setModo(m)
  }

  return (
    <div className="space-y-4">
      <Tabs tabs={MODOS} value={modo} onChange={cambiar} />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {modo === 'hex' ? 'Colores HEX (uno por línea: #RGB, #RRGGBB o #RRGGBBAA)' : 'Colores RGB (uno por línea: rgb(255, 87, 51) o 255 87 51)'}
        </label>
        <textarea value={texto} onChange={(e) => setTexto(e.target.value)} rows={6} className={`${inputClass} font-mono text-sm`} spellCheck={false} />
      </div>

      {filas.length > 0 && (
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex justify-between items-center px-3 py-2 bg-gray-50">
            <p className="text-sm font-semibold text-gray-900">{validas.length} {validas.length === 1 ? 'color convertido' : 'colores convertidos'}</p>
            <CopyButton text={salidaTexto} label="Copiar todos" />
          </div>
          <div className="divide-y divide-gray-100">
            {filas.map((f, i) =>
              f.error ? (
                <p key={i} className="px-3 py-2 text-sm text-red-600">«{f.entrada}» no es un color {modo === 'hex' ? 'HEX' : 'RGB'} válido</p>
              ) : (
                <div key={i} className="flex items-center gap-3 px-3 py-2 text-sm">
                  <span className="w-10 h-10 rounded-lg border border-gray-200 flex-shrink-0" style={{ background: f.rgbTexto.startsWith('rgba') ? f.rgbTexto : f.hex }} />
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-1 font-mono text-xs sm:text-sm">
                    <span>{f.hex}</span>
                    <span>{f.rgbTexto}</span>
                    <span className="text-gray-500">{f.hsl}</span>
                  </div>
                  <CopyButton text={modo === 'hex' ? f.rgbTexto : f.hex} />
                </div>
              )
            )}
          </div>
        </div>
      )}
      <p className="text-xs text-gray-500">
        Cada par de dígitos hexadecimales es un canal de 0 a 255: #FF5733 → FF = 255 (rojo), 57 = 87 (verde), 33 = 51 (azul).
      </p>
    </div>
  )
}
