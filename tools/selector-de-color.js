'use client'

import { useEffect, useMemo, useState } from 'react'
import { contraste, fmtHsl, fmtRgb, hexARgb, nivelWCAG, rgbACmyk, rgbAHex, rgbAHsl, rgbAHsv, tonos } from '@/lib/calc/color'
import { CopyButton, formatNumber, inputClass } from '@/components/calc-ui'

function Insignia({ ok, texto }) {
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded ${ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>{ok ? '✓' : '✗'} {texto}</span>
}

export default function SelectorDeColor() {
  const [hex, setHex] = useState('#7C3AED')
  const [texto, setTexto] = useState('#7C3AED')
  const [cuentaGotero, setCuentaGotero] = useState(0)
  const [hayGotero, setHayGotero] = useState(false)
  useEffect(() => setHayGotero('EyeDropper' in window), [])
  const rgb = hexARgb(hex)

  const d = useMemo(() => {
    if (!rgb) return null
    const hsl = rgbAHsl(rgb)
    const hsv = rgbAHsv(rgb)
    const cmyk = rgbACmyk(rgb)
    return {
      formatos: [
        ['HEX', rgbAHex(rgb)],
        ['RGB', fmtRgb(rgb)],
        ['HSL', fmtHsl(hsl)],
        ['HSV', `hsv(${Math.round(hsv.h)}, ${Math.round(hsv.s)}%, ${Math.round(hsv.v)}%)`],
        ['CMYK', `cmyk(${Math.round(cmyk.c)}%, ${Math.round(cmyk.m)}%, ${Math.round(cmyk.y)}%, ${Math.round(cmyk.k)}%)`],
      ],
      blanco: contraste(rgb, { r: 255, g: 255, b: 255 }),
      negro: contraste(rgb, { r: 0, g: 0, b: 0 }),
      tonos: tonos(hex),
    }
  }, [hex, rgb])

  function elegir(v) {
    setHex(v.toUpperCase())
    setTexto(v.toUpperCase())
  }

  async function gotero() {
    try {
      // EyeDropper existe en Chrome y Edge de escritorio.
      const r = await new window.EyeDropper().open()
      elegir(r.sRGBHex)
      setCuentaGotero((c) => c + 1)
    } catch {}
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-4">
        <input type="color" value={rgb ? rgbAHex(rgb).slice(0, 7) : '#000000'} onChange={(e) => elegir(e.target.value)} className="w-full sm:w-48 h-40 rounded-xl border border-gray-300 cursor-pointer" aria-label="Selector de color" />
        <div className="flex-1 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Escribe un color HEX</label>
            <input
              value={texto}
              onChange={(e) => {
                setTexto(e.target.value)
                if (hexARgb(e.target.value)) setHex(rgbAHex(hexARgb(e.target.value)))
              }}
              className={`${inputClass} font-mono uppercase`}
            />
          </div>
          {hayGotero && (
            <button type="button" onClick={gotero} className="text-sm text-blue-600 font-medium">
              💧 Tomar un color de la pantalla{cuentaGotero ? ` (${cuentaGotero})` : ''}
            </button>
          )}
          {d && (
            <div className="rounded-lg border border-gray-200 divide-y divide-gray-100">
              {d.formatos.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-2 px-3 py-2">
                  <span className="text-xs font-semibold text-gray-500 w-12">{k}</span>
                  <code className="flex-1 text-sm">{v}</code>
                  <CopyButton text={v} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {d && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              ['Texto blanco', '#FFFFFF', d.blanco],
              ['Texto negro', '#000000', d.negro],
            ].map(([t, color, ratio]) => {
              const n = nivelWCAG(ratio)
              return (
                <div key={t} className="rounded-xl p-4 space-y-2" style={{ background: hex, color }}>
                  <p className="font-bold">{t} · {formatNumber(ratio, 2)}:1</p>
                  <div className="flex flex-wrap gap-1">
                    <Insignia ok={n.aaNormal} texto="AA" />
                    <Insignia ok={n.aaGrande} texto="AA grande" />
                    <Insignia ok={n.aaaNormal} texto="AAA" />
                  </div>
                </div>
              )
            })}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Tonos del claro al oscuro (clic para elegir)</p>
            <div className="flex rounded-lg overflow-hidden border border-gray-200">
              {d.tonos.map((t) => (
                <button key={t} type="button" onClick={() => elegir(t)} className="flex-1 h-12" style={{ background: t }} title={t} aria-label={`Elegir ${t}`} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
