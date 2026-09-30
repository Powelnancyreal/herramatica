'use client'

import { useEffect, useState } from 'react'
import { ARMONIAS, generarArmonia, hexARgb, hslARgb, luminancia, rgbAHex } from '@/lib/calc/color'
import { enteroAleatorio } from '@/lib/calc/dev'
import { buttonClass, CopyButton, inputClass, secondaryButtonClass } from '@/components/calc-ui'

function aleatoria() {
  const h = enteroAleatorio(0, 359)
  const s = enteroAleatorio(45, 85)
  return [enteroAleatorio(80, 92), enteroAleatorio(62, 72), enteroAleatorio(45, 55), enteroAleatorio(30, 38), enteroAleatorio(15, 22)].map((l, i) =>
    rgbAHex(hslARgb({ h: h + i * enteroAleatorio(8, 24), s: s - i * 3, l }))
  )
}

function textoSobre(hex) {
  const rgb = hexARgb(hex)
  return rgb && luminancia(rgb) > 0.4 ? '#111827' : '#FFFFFF'
}

export default function GeneradorPaletaColores() {
  const [base, setBase] = useState('#2563EB')
  const [armonia, setArmonia] = useState('analoga')
  const [colores, setColores] = useState(() => generarArmonia('#2563EB', 'analoga'))
  const [bloqueados, setBloqueados] = useState([])
  const [copiado, setCopiado] = useState('')

  useEffect(() => {
    if (!hexARgb(base) || armonia === 'aleatoria') return
    const nuevos = generarArmonia(base, armonia)
    setColores((prev) => nuevos.map((c, i) => (bloqueados.includes(i) && prev[i] ? prev[i] : c)))
    // Solo se regenera al cambiar el color base o la armonía.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, armonia])

  function sorprender() {
    const nuevos = aleatoria()
    setArmonia('aleatoria')
    setColores((prev) => nuevos.map((c, i) => (bloqueados.includes(i) && prev[i] ? prev[i] : c)))
  }

  async function copiar(hex) {
    try {
      await navigator.clipboard.writeText(hex)
      setCopiado(hex)
      setTimeout(() => setCopiado(''), 1200)
    } catch {}
  }

  const cssVars = `:root {\n${colores.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')}\n}`

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Color base</label>
          <div className="flex gap-2">
            <input type="color" value={hexARgb(base) ? rgbAHex(hexARgb(base)).slice(0, 7) : '#000000'} onChange={(e) => setBase(e.target.value.toUpperCase())} className="h-11 w-14 rounded border border-gray-300 cursor-pointer" aria-label="Elegir color base" />
            <input value={base} onChange={(e) => setBase(e.target.value)} className={`${inputClass} font-mono uppercase`} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Armonía de color</label>
          <select value={armonia} onChange={(e) => setArmonia(e.target.value)} className={inputClass}>
            {ARMONIAS.map((a) => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
            {armonia === 'aleatoria' && <option value="aleatoria">Aleatoria</option>}
          </select>
        </div>
        <button type="button" onClick={sorprender} className={buttonClass}>🎲 Paleta aleatoria</button>
      </div>

      <div className="flex flex-col sm:flex-row rounded-xl overflow-hidden border border-gray-200 min-h-[14rem]">
        {colores.map((c, i) => (
          <div key={i} className="flex-1 flex sm:flex-col justify-between items-center p-3 min-h-[4rem]" style={{ background: c, color: textoSobre(c) }}>
            <button type="button" onClick={() => setBloqueados((b) => (b.includes(i) ? b.filter((x) => x !== i) : [...b, i]))} className="text-lg" aria-label={bloqueados.includes(i) ? 'Desbloquear color' : 'Bloquear color'} title="Bloquear este color al regenerar">
              {bloqueados.includes(i) ? '🔒' : '🔓'}
            </button>
            <button type="button" onClick={() => copiar(c)} className="font-mono font-semibold text-sm">
              {copiado === c ? '¡Copiado!' : c}
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 p-4 space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold text-gray-900">Variables CSS</p>
          <div className="flex gap-2">
            <CopyButton text={cssVars} label="Copiar CSS" />
            <CopyButton text={colores.join(', ')} label="Copiar HEX" />
          </div>
        </div>
        <pre className="text-xs bg-gray-50 rounded p-3 overflow-x-auto">{cssVars}</pre>
      </div>
      <button type="button" onClick={() => setBloqueados([])} className={secondaryButtonClass} disabled={!bloqueados.length}>Desbloquear todos</button>
    </div>
  )
}
