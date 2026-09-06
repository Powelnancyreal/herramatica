'use client'

import { useMemo, useState } from 'react'

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalculadoraReglaDeTres() {
  const [tipo, setTipo] = useState('directa')
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [c, setC] = useState('')

  const resultado = useMemo(() => {
    const va = parseFloat(a)
    const vb = parseFloat(b)
    const vc = parseFloat(c)
    if (isNaN(va) || isNaN(vb) || isNaN(vc) || va === 0 || vc === 0) return null
    return tipo === 'directa' ? (vb * vc) / va : (va * vb) / vc
  }, [tipo, a, b, c])

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <button
          onClick={() => setTipo('directa')}
          className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${tipo === 'directa' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Regla de 3 directa
        </button>
        <button
          onClick={() => setTipo('inversa')}
          className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${tipo === 'inversa' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Regla de 3 inversa
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 text-center font-mono text-gray-700">
        A ({a || 'a'}) —— B ({b || 'b'})
        <br />
        C ({c || 'c'}) —— X (?)
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>A</label>
          <input type="number" inputMode="decimal" value={a} onChange={(e) => setA(e.target.value)} placeholder="Ej: 2" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>B</label>
          <input type="number" inputMode="decimal" value={b} onChange={(e) => setB(e.target.value)} placeholder="Ej: 10" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>C</label>
          <input type="number" inputMode="decimal" value={c} onChange={(e) => setC(e.target.value)} placeholder="Ej: 5" className={inputClass} />
        </div>
      </div>

      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">X</p>
        <p className="text-4xl font-bold text-blue-700">{resultado !== null ? parseFloat(resultado.toFixed(6)) : '—'}</p>
      </div>

      <p className="text-xs text-gray-500">
        {tipo === 'directa'
          ? 'Regla de 3 directa: cuando ambas cantidades aumentan o disminuyen en la misma proporción (a más A, más B).'
          : 'Regla de 3 inversa: cuando una cantidad aumenta mientras la otra disminuye en la misma proporción (a más A, menos B).'}
      </p>
    </div>
  )
}
