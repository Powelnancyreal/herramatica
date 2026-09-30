'use client'

import { useState } from 'react'
import { barajar, enteroAleatorio } from '@/lib/calc/dev'
import { buttonClass, CopyButton, ErrorText, Field, inputClass, NumberInput, Tabs } from '@/components/calc-ui'

const CARAS_DADO = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']

export default function GeneradorNumerosAleatorios() {
  const [modo, setModo] = useState('numeros')
  const [min, setMin] = useState('1')
  const [max, setMax] = useState('100')
  const [cantidad, setCantidad] = useState('1')
  const [unicos, setUnicos] = useState(true)
  const [ordenar, setOrdenar] = useState(false)
  const [dados, setDados] = useState('2')
  const [caras, setCaras] = useState('6')
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState('')

  function generar() {
    if (modo === 'dados') {
      const n = Math.min(Math.max(parseInt(dados, 10) || 1, 1), 20)
      const c = parseInt(caras, 10)
      const tiradas = Array.from({ length: n }, () => enteroAleatorio(1, c))
      setError('')
      return setResultado({ tipo: 'dados', valores: tiradas, caras: c, suma: tiradas.reduce((a, b) => a + b, 0) })
    }
    const a = parseInt(min, 10)
    const b = parseInt(max, 10)
    const n = parseInt(cantidad, 10)
    if (isNaN(a) || isNaN(b) || a > b) return setError('El mínimo debe ser menor o igual que el máximo.')
    if (!(n >= 1) || n > 10000) return setError('Puedes generar entre 1 y 10,000 números.')
    const rango = b - a + 1
    if (rango > 2 ** 32) return setError('El rango es demasiado grande (máximo ~4 mil millones de valores).')
    if (unicos && n > rango) return setError(`Solo hay ${rango} números distintos entre ${a} y ${b}.`)
    let valores
    if (unicos && rango <= 100000) valores = barajar(Array.from({ length: rango }, (_, i) => a + i)).slice(0, n)
    else if (unicos) {
      const set = new Set()
      while (set.size < n) set.add(enteroAleatorio(a, b))
      valores = [...set]
    } else valores = Array.from({ length: n }, () => enteroAleatorio(a, b))
    if (ordenar) valores.sort((x, y) => x - y)
    setError('')
    setResultado({ tipo: 'numeros', valores })
  }

  return (
    <div className="space-y-4">
      <Tabs
        tabs={[
          { id: 'numeros', label: 'Números aleatorios' },
          { id: 'dados', label: 'Lanzar dados' },
        ]}
        value={modo}
        onChange={(m) => {
          setModo(m)
          setResultado(null)
        }}
      />
      {modo === 'numeros' ? (
        <>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Mínimo">
              <NumberInput value={min} onChange={setMin} step="1" />
            </Field>
            <Field label="Máximo">
              <NumberInput value={max} onChange={setMax} step="1" />
            </Field>
            <Field label="Cantidad">
              <NumberInput value={cantidad} onChange={setCantidad} min="1" step="1" />
            </Field>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-700">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={unicos} onChange={(e) => setUnicos(e.target.checked)} /> Sin repetir
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={ordenar} onChange={(e) => setOrdenar(e.target.checked)} /> Ordenar de menor a mayor
            </label>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Número de dados">
            <NumberInput value={dados} onChange={setDados} min="1" max="20" step="1" />
          </Field>
          <Field label="Tipo de dado">
            <select value={caras} onChange={(e) => setCaras(e.target.value)} className={inputClass}>
              {[4, 6, 8, 10, 12, 20, 100].map((c) => (
                <option key={c} value={c}>d{c} ({c} caras)</option>
              ))}
            </select>
          </Field>
        </div>
      )}
      <ErrorText>{error}</ErrorText>
      <button onClick={generar} className={buttonClass}>{modo === 'dados' ? '🎲 Lanzar' : 'Generar'}</button>

      {resultado?.tipo === 'numeros' && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 space-y-3">
          {resultado.valores.length === 1 ? (
            <p className="text-6xl font-bold text-blue-700 text-center">{resultado.valores[0]}</p>
          ) : (
            <div className="flex flex-wrap gap-2 max-h-80 overflow-auto">
              {resultado.valores.map((v, i) => (
                <span key={i} className="bg-white border border-blue-100 rounded-lg px-3 py-1.5 font-semibold text-blue-800">{v}</span>
              ))}
            </div>
          )}
          <CopyButton text={resultado.valores.join(', ')} />
        </div>
      )}
      {resultado?.tipo === 'dados' && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center space-y-2">
          <div className="flex flex-wrap justify-center gap-3">
            {resultado.valores.map((v, i) =>
              resultado.caras === 6 ? (
                <span key={i} className="text-6xl text-blue-700 leading-none">{CARAS_DADO[v - 1]}</span>
              ) : (
                <span key={i} className="text-3xl font-bold bg-white border border-blue-100 rounded-lg w-16 h-16 flex items-center justify-center text-blue-700">{v}</span>
              )
            )}
          </div>
          {resultado.valores.length > 1 && <p className="text-lg font-semibold text-gray-800">Suma: {resultado.suma}</p>}
        </div>
      )}
    </div>
  )
}
