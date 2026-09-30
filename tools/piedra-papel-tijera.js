'use client'

import { useState } from 'react'
import { enteroAleatorio } from '@/lib/calc/dev'
import { secondaryButtonClass, Tabs } from '@/components/calc-ui'

const CLASICO = {
  piedra: { emoji: '✊', vence: { tijera: 'aplasta' } },
  papel: { emoji: '✋', vence: { piedra: 'envuelve' } },
  tijera: { emoji: '✌️', vence: { papel: 'corta' } },
}
const EXTENDIDO = {
  piedra: { emoji: '✊', vence: { tijera: 'aplasta', lagarto: 'aplasta' } },
  papel: { emoji: '✋', vence: { piedra: 'envuelve', spock: 'desautoriza' } },
  tijera: { emoji: '✌️', vence: { papel: 'corta', lagarto: 'decapita' } },
  lagarto: { emoji: '🦎', vence: { spock: 'envenena', papel: 'se come' } },
  spock: { emoji: '🖖', vence: { tijera: 'rompe', piedra: 'vaporiza' } },
}
const MODOS = [
  { id: 'clasico', label: 'Clásico' },
  { id: 'extendido', label: 'Lagarto y Spock' },
]
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

export default function PiedraPapelTijera() {
  const [modo, setModo] = useState('clasico')
  const [ronda, setRonda] = useState(null)
  const [marcador, setMarcador] = useState({ tu: 0, cpu: 0, empates: 0 })
  const [mejorDe, setMejorDe] = useState(0)
  const opciones = modo === 'clasico' ? CLASICO : EXTENDIDO
  const claves = Object.keys(opciones)
  const objetivo = mejorDe ? Math.ceil(mejorDe / 2) : null
  const terminado = objetivo && (marcador.tu >= objetivo || marcador.cpu >= objetivo)

  function jugar(tu) {
    if (terminado) return
    const cpu = claves[enteroAleatorio(0, claves.length - 1)]
    let resultado
    let frase
    if (tu === cpu) {
      resultado = 'empate'
      frase = 'Los dos eligieron lo mismo.'
    } else if (opciones[tu].vence[cpu]) {
      resultado = 'ganas'
      frase = `${cap(tu)} ${opciones[tu].vence[cpu]} a ${cpu}.`
    } else {
      resultado = 'pierdes'
      frase = `${cap(cpu)} ${opciones[cpu].vence[tu]} a ${tu}.`
    }
    setRonda({ tu, cpu, resultado, frase })
    setMarcador((m) => ({ tu: m.tu + (resultado === 'ganas'), cpu: m.cpu + (resultado === 'pierdes'), empates: m.empates + (resultado === 'empate') }))
  }

  function reiniciar() {
    setMarcador({ tu: 0, cpu: 0, empates: 0 })
    setRonda(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <Tabs tabs={MODOS} value={modo} onChange={(m) => { setModo(m); reiniciar() }} />
        <select value={mejorDe} onChange={(e) => { setMejorDe(Number(e.target.value)); reiniciar() }} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" aria-label="Formato de partida">
          <option value={0}>Partida libre</option>
          <option value={3}>Al mejor de 3</option>
          <option value={5}>Al mejor de 5</option>
          <option value={7}>Al mejor de 7</option>
        </select>
      </div>

      <div className="grid grid-cols-3 text-center rounded-xl border border-gray-200 py-3">
        <div><p className="text-xs text-gray-500">Tú</p><p className="text-3xl font-bold text-blue-700">{marcador.tu}</p></div>
        <div><p className="text-xs text-gray-500">Empates</p><p className="text-3xl font-bold text-gray-500">{marcador.empates}</p></div>
        <div><p className="text-xs text-gray-500">Computadora</p><p className="text-3xl font-bold text-red-600">{marcador.cpu}</p></div>
      </div>

      <div className="rounded-xl bg-gray-50 border border-gray-200 p-5 text-center min-h-[9rem] flex flex-col justify-center" aria-live="polite">
        {ronda ? (
          <>
            <p className="text-5xl">{opciones[ronda.tu].emoji} <span className="text-2xl text-gray-400 align-middle">vs</span> {opciones[ronda.cpu].emoji}</p>
            <p className={`text-xl font-bold mt-2 ${ronda.resultado === 'ganas' ? 'text-green-600' : ronda.resultado === 'pierdes' ? 'text-red-600' : 'text-gray-600'}`}>
              {ronda.resultado === 'ganas' ? '¡Ganaste!' : ronda.resultado === 'pierdes' ? 'Perdiste' : 'Empate'}
            </p>
            <p className="text-sm text-gray-600">{ronda.frase}</p>
          </>
        ) : (
          <p className="text-gray-500">Elige tu jugada para empezar</p>
        )}
        {terminado && <p className="mt-2 font-bold text-lg">{marcador.tu > marcador.cpu ? '🏆 ¡Ganaste la partida!' : '🤖 La computadora gana la partida'}</p>}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {claves.map((k) => (
          <button key={k} type="button" onClick={() => jugar(k)} disabled={terminado} className="flex flex-col items-center gap-1 w-24 py-3 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 disabled:opacity-40 transition-colors">
            <span className="text-4xl">{opciones[k].emoji}</span>
            <span className="text-sm font-medium text-gray-700">{cap(k)}</span>
          </button>
        ))}
      </div>
      <div className="text-center">
        <button type="button" onClick={reiniciar} className={secondaryButtonClass}>Reiniciar marcador</button>
      </div>
    </div>
  )
}
