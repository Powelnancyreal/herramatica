'use client'

import { useState } from 'react'
import { barajar } from '@/lib/calc/dev'
import { buttonClass, CopyButton, ErrorText, Field, inputClass, NumberInput } from '@/components/calc-ui'

export default function SorteoOnline() {
  const [lista, setLista] = useState('')
  const [ganadores, setGanadores] = useState('1')
  const [suplentes, setSuplentes] = useState('0')
  const [sinDuplicados, setSinDuplicados] = useState(true)
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState('')

  const participantes = (() => {
    const nombres = lista.split('\n').map((s) => s.trim()).filter(Boolean)
    return sinDuplicados ? [...new Map(nombres.map((n) => [n.toLowerCase(), n])).values()] : nombres
  })()

  function sortear() {
    const g = parseInt(ganadores, 10)
    const s = parseInt(suplentes, 10) || 0
    if (participantes.length < 2) return setError('Escribe al menos 2 participantes, uno por línea.')
    if (!(g >= 1)) return setError('Indica cuántos ganadores quieres.')
    if (g + s > participantes.length) return setError(`Solo hay ${participantes.length} participantes para ${g + s} premios y suplentes.`)
    setError('')
    const orden = barajar(participantes)
    setResultado({
      ganadores: orden.slice(0, g),
      suplentes: orden.slice(g, g + s),
      total: participantes.length,
      fecha: new Date(),
    })
  }

  const resumen = resultado
    ? [
        `Sorteo realizado el ${resultado.fecha.toLocaleString('es-MX')} entre ${resultado.total} participantes.`,
        'Ganadores:',
        ...resultado.ganadores.map((n, i) => `${i + 1}. ${n}`),
        ...(resultado.suplentes.length ? ['Suplentes:', ...resultado.suplentes.map((n, i) => `${i + 1}. ${n}`)] : []),
        'Hecho con https://herramatica.com/sorteo-online',
      ].join('\n')
    : ''

  return (
    <div className="space-y-4">
      <Field label={`Participantes (uno por línea) · ${participantes.length} válidos`}>
        <textarea
          value={lista}
          onChange={(e) => setLista(e.target.value)}
          rows={8}
          placeholder={'Ana García\n@luis_perez\nMaría\nCarlos'}
          className={inputClass}
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Ganadores">
          <NumberInput value={ganadores} onChange={setGanadores} min="1" step="1" />
        </Field>
        <Field label="Suplentes">
          <NumberInput value={suplentes} onChange={setSuplentes} min="0" step="1" />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={sinDuplicados} onChange={(e) => setSinDuplicados(e.target.checked)} />
        Quitar participantes duplicados (una sola oportunidad por persona)
      </label>
      <ErrorText>{error}</ErrorText>
      <button onClick={sortear} className={buttonClass}>🎉 Realizar sorteo</button>

      {resultado && (
        <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-5 space-y-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {resultado.ganadores.length === 1 ? 'Ganador' : 'Ganadores'}
          </p>
          <ol className="space-y-1">
            {resultado.ganadores.map((n, i) => (
              <li key={i} className="text-2xl font-bold text-purple-700">{i + 1}. {n}</li>
            ))}
          </ol>
          {resultado.suplentes.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Suplentes</p>
              <ol className="text-gray-800">
                {resultado.suplentes.map((n, i) => (
                  <li key={i}>{i + 1}. {n}</li>
                ))}
              </ol>
            </div>
          )}
          <p className="text-xs text-gray-600">
            {resultado.fecha.toLocaleString('es-MX')} · {resultado.total} participantes · aleatoriedad criptográfica del navegador
          </p>
          <CopyButton text={resumen} label="Copiar resultado para publicar" />
        </div>
      )}
    </div>
  )
}
