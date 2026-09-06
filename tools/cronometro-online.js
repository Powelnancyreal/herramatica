'use client'

import { useEffect, useRef, useState } from 'react'

function pad(n, len = 2) {
  return String(n).padStart(len, '0')
}

function formatTiempo(ms) {
  const totalCentesimas = Math.floor(ms / 10)
  const centesimas = totalCentesimas % 100
  const totalSegundos = Math.floor(totalCentesimas / 100)
  const segundos = totalSegundos % 60
  const totalMinutos = Math.floor(totalSegundos / 60)
  const minutos = totalMinutos % 60
  const horas = Math.floor(totalMinutos / 60)
  return `${pad(horas)}:${pad(minutos)}:${pad(segundos)}.${pad(centesimas)}`
}

export default function CronometroOnline() {
  const [enMarcha, setEnMarcha] = useState(false)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [vueltas, setVueltas] = useState([])

  const inicioRef = useRef(null)
  const acumuladoRef = useRef(0)
  const rafRef = useRef(null)

  useEffect(() => {
    function tick() {
      setElapsedMs(acumuladoRef.current + (performance.now() - inicioRef.current))
      rafRef.current = requestAnimationFrame(tick)
    }
    if (enMarcha) {
      inicioRef.current = performance.now()
      rafRef.current = requestAnimationFrame(tick)
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [enMarcha])

  function iniciarPausar() {
    if (enMarcha) {
      acumuladoRef.current = elapsedMs
      setEnMarcha(false)
    } else {
      setEnMarcha(true)
    }
  }

  function reiniciar() {
    setEnMarcha(false)
    acumuladoRef.current = 0
    setElapsedMs(0)
    setVueltas([])
  }

  function marcarVuelta() {
    setVueltas((prev) => {
      const ultimaTotal = prev.length > 0 ? prev[0].total : 0
      return [{ numero: prev.length + 1, total: elapsedMs, split: elapsedMs - ultimaTotal }, ...prev]
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-2xl py-10 px-4 text-center">
        <p className="text-white text-4xl sm:text-6xl font-mono font-bold tracking-tight tabular-nums">
          {formatTiempo(elapsedMs)}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={iniciarPausar}
          className={`flex-1 font-semibold py-3.5 rounded-lg transition-colors text-white ${
            enMarcha ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {enMarcha ? 'Pausar' : elapsedMs > 0 ? 'Reanudar' : 'Iniciar'}
        </button>
        <button
          onClick={marcarVuelta}
          disabled={!enMarcha}
          className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold py-3.5 rounded-lg transition-colors"
        >
          Marcar vuelta
        </button>
        <button
          onClick={reiniciar}
          disabled={elapsedMs === 0 && !enMarcha}
          className="flex-1 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed text-red-600 font-semibold py-3.5 rounded-lg transition-colors"
        >
          Reiniciar
        </button>
      </div>

      {vueltas.length > 0 && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-3 py-2 text-left">Vuelta</th>
                <th className="px-3 py-2 text-right">Parcial</th>
                <th className="px-3 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vueltas.map((v) => (
                <tr key={v.numero}>
                  <td className="px-3 py-2 text-gray-600">{v.numero}</td>
                  <td className="px-3 py-2 text-right font-mono text-gray-900">{formatTiempo(v.split)}</td>
                  <td className="px-3 py-2 text-right font-mono text-gray-600">{formatTiempo(v.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
