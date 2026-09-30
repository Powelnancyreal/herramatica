'use client'

import { useEffect, useRef, useState } from 'react'
import { barajar } from '@/lib/calc/dev'
import { buttonClass, inputClass, secondaryButtonClass, Tabs } from '@/components/calc-ui'

const MODOS = [
  { id: 'tombola', label: 'Tómbola' },
  { id: 'cartones', label: 'Cartones de bingo' },
]
const LETRAS = ['B', 'I', 'N', 'G', 'O']

const etiqueta = (n, total) => (total === 75 ? `${LETRAS[Math.floor((n - 1) / 15)]}-${n}` : String(n))

function carton75() {
  // Columna B: 1-15, I: 16-30, N: 31-45 (centro libre), G: 46-60, O: 61-75.
  const cols = LETRAS.map((_, c) => barajar(Array.from({ length: 15 }, (_, i) => c * 15 + i + 1)).slice(0, 5).sort((a, b) => a - b))
  cols[2][2] = null
  return Array.from({ length: 5 }, (_, f) => cols.map((col) => col[f]))
}

export default function TombolaOnline() {
  const [modo, setModo] = useState('tombola')
  const [total, setTotal] = useState(75)
  const [bolsa, setBolsa] = useState(() => barajar(Array.from({ length: 75 }, (_, i) => i + 1)))
  const [salidas, setSalidas] = useState([])
  const [girando, setGirando] = useState(false)
  const [auto, setAuto] = useState(false)
  const [segundos, setSegundos] = useState('5')
  const [voz, setVoz] = useState(true)
  const [cartones, setCartones] = useState([])
  const [numCartones, setNumCartones] = useState('4')
  const temporizador = useRef(null)

  function reiniciar(t = total) {
    setTotal(t)
    setBolsa(barajar(Array.from({ length: t }, (_, i) => i + 1)))
    setSalidas([])
    setAuto(false)
  }

  function sacar() {
    if (girando || !bolsa.length) return
    setGirando(true)
    setTimeout(() => {
      const [n, ...resto] = bolsa
      setBolsa(resto)
      setSalidas((s) => [n, ...s])
      setGirando(false)
      if (voz && 'speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(total === 75 ? `${LETRAS[Math.floor((n - 1) / 15)]}, ${n}` : String(n))
        u.lang = 'es-MX'
        window.speechSynthesis.speak(u)
      }
    }, 700)
  }

  useEffect(() => {
    if (!auto || !bolsa.length) {
      if (auto && !bolsa.length) setAuto(false)
      return
    }
    const ms = Math.max(2, parseInt(segundos, 10) || 5) * 1000
    temporizador.current = setTimeout(sacar, ms)
    return () => clearTimeout(temporizador.current)
    // sacar depende de la bolsa, que ya está en las dependencias.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, bolsa, segundos])

  const ultima = salidas[0]

  return (
    <div className="space-y-5">
      <Tabs tabs={MODOS} value={modo} onChange={setModo} />
      {modo === 'tombola' ? (
        <>
          <div className="flex flex-wrap gap-3 items-center">
            <select value={total} onChange={(e) => reiniciar(Number(e.target.value))} className={`${inputClass} max-w-[14rem]`} aria-label="Tipo de bingo">
              <option value={75}>Bingo de 75 bolas (B-I-N-G-O)</option>
              <option value={90}>Bingo de 90 bolas</option>
              <option value={100}>Tómbola de 1 a 100</option>
            </select>
            <label className="flex items-center gap-1.5 text-sm text-gray-700">
              <input type="checkbox" checked={voz} onChange={(e) => setVoz(e.target.checked)} /> Cantar en voz alta
            </label>
          </div>

          <div className="flex flex-col items-center gap-3 py-2">
            <div className={`w-36 h-36 rounded-full flex items-center justify-center shadow-lg border-8 ${girando ? 'animate-spin border-dashed border-blue-300' : 'border-blue-500'} bg-white`} aria-live="polite">
              <span className="text-4xl font-black text-blue-700">{girando ? '?' : ultima ? etiqueta(ultima, total) : '—'}</span>
            </div>
            <p className="text-sm text-gray-600">{salidas.length} de {total} bolas · quedan {bolsa.length}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button type="button" onClick={sacar} disabled={girando || !bolsa.length || auto} className={`${buttonClass} sm:col-span-1`}>🎱 Sacar bola</button>
            <div className="flex gap-2 items-center">
              <button type="button" onClick={() => setAuto((a) => !a)} disabled={!bolsa.length} className={`${secondaryButtonClass} flex-1 py-3`}>{auto ? '⏸ Pausar' : '▶ Automático'}</button>
              <input type="number" value={segundos} onChange={(e) => setSegundos(e.target.value)} min="2" max="60" className="w-16 border border-gray-300 rounded-lg px-2 py-2.5 text-sm" aria-label="Segundos entre bolas" />
              <span className="text-xs text-gray-500">s</span>
            </div>
            <button type="button" onClick={() => reiniciar()} className={`${secondaryButtonClass} py-3`}>↺ Nueva partida</button>
          </div>

          <div className={`grid gap-1 ${total === 75 ? 'grid-cols-[auto_repeat(15,minmax(0,1fr))]' : 'grid-cols-10'}`}>
            {total === 75
              ? LETRAS.flatMap((l, f) => [
                  <span key={l} className="text-xs font-black text-blue-700 flex items-center justify-center w-6">{l}</span>,
                  ...Array.from({ length: 15 }, (_, i) => {
                    const n = f * 15 + i + 1
                    return <span key={n} className={`aspect-square rounded text-[10px] sm:text-xs flex items-center justify-center font-semibold ${salidas.includes(n) ? (n === ultima ? 'bg-amber-400 text-white' : 'bg-blue-600 text-white') : 'bg-gray-100 text-gray-400'}`}>{n}</span>
                  }),
                ])
              : Array.from({ length: total }, (_, i) => i + 1).map((n) => (
                  <span key={n} className={`aspect-square rounded text-xs flex items-center justify-center font-semibold ${salidas.includes(n) ? (n === ultima ? 'bg-amber-400 text-white' : 'bg-blue-600 text-white') : 'bg-gray-100 text-gray-400'}`}>{n}</span>
                ))}
          </div>
          {salidas.length > 1 && <p className="text-sm text-gray-600">Últimas: {salidas.slice(1, 11).map((n) => etiqueta(n, total)).join(', ')}</p>}
        </>
      ) : (
        <>
          <div className="flex flex-wrap gap-3 items-center print:hidden">
            <input type="number" value={numCartones} onChange={(e) => setNumCartones(e.target.value)} min="1" max="60" className={`${inputClass} max-w-[7rem]`} aria-label="Número de cartones" />
            <button type="button" onClick={() => setCartones(Array.from({ length: Math.min(60, Math.max(1, parseInt(numCartones, 10) || 1)) }, carton75))} className={secondaryButtonClass}>Generar cartones de 75</button>
            {cartones.length > 0 && <button type="button" onClick={() => window.print()} className={secondaryButtonClass}>🖨️ Imprimir</button>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cartones.map((c, k) => (
              <table key={k} className="w-full border-2 border-blue-600 text-center break-inside-avoid">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    {LETRAS.map((l) => (
                      <th key={l} className="py-1 text-lg font-black">{l}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {c.map((fila, f) => (
                    <tr key={f}>
                      {fila.map((n, i) => (
                        <td key={i} className="border border-blue-200 h-10 font-bold text-gray-900">{n ?? '★'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                <caption className="caption-bottom text-xs text-gray-500 pt-1">Cartón {k + 1}</caption>
              </table>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
