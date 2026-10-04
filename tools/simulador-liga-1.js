'use client'

import { useMemo, useState } from 'react'
import { LIGA1_ACTUALIZADA, LIGA1_CLAUSURA_2026, LIGA1_FECHAS_TOTALES, tablaConPartidos } from '@/lib/data/liga1-2026'
import { buttonClass, ErrorText, inputClass, secondaryButtonClass } from '@/components/calc-ui'

const EQUIPOS = LIGA1_CLAUSURA_2026.map((e) => e.equipo).sort((a, b) => a.localeCompare(b, 'es'))
const posicionesBase = new Map(tablaConPartidos(LIGA1_CLAUSURA_2026, []).map((e, i) => [e.equipo, i + 1]))

export default function SimuladorLiga1() {
  const [partidos, setPartidos] = useState([])
  const [local, setLocal] = useState(EQUIPOS[0])
  const [visita, setVisita] = useState(EQUIPOS[1])
  const [gl, setGl] = useState('1')
  const [gv, setGv] = useState('0')
  const [error, setError] = useState('')

  const tabla = useMemo(() => tablaConPartidos(LIGA1_CLAUSURA_2026, partidos), [partidos])
  const jugados = (equipo) => tabla.find((e) => e.equipo === equipo).pj

  function agregar() {
    const a = parseInt(gl, 10)
    const b = parseInt(gv, 10)
    if (local === visita) return setError('Elige dos equipos distintos.')
    if (!(a >= 0) || !(b >= 0)) return setError('Escribe los goles de cada equipo (0 o más).')
    if (jugados(local) >= LIGA1_FECHAS_TOTALES || jugados(visita) >= LIGA1_FECHAS_TOTALES) return setError(`Cada equipo juega ${LIGA1_FECHAS_TOTALES} partidos en el Clausura.`)
    if (partidos.some((p) => [p.local, p.visita].includes(local) && [p.local, p.visita].includes(visita))) return setError('Ese partido ya está en tu simulación.')
    setError('')
    setPartidos((x) => [...x, { local, visita, gl: a, gv: b }])
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-gray-200 p-4 space-y-3">
        <p className="text-sm font-semibold text-gray-900">Agrega un resultado</p>
        <div className="grid grid-cols-[1fr_4rem] sm:grid-cols-[1fr_4rem_auto_4rem_1fr] gap-2 items-center">
          <select aria-label="Equipo local" value={local} onChange={(e) => setLocal(e.target.value)} className={inputClass}>
            {EQUIPOS.map((e) => <option key={e}>{e}</option>)}
          </select>
          <input aria-label="Goles del local" type="number" min="0" inputMode="numeric" value={gl} onChange={(e) => setGl(e.target.value)} className={`${inputClass} text-center`} />
          <span className="hidden sm:block text-gray-400 text-center">vs</span>
          <input aria-label="Goles del visitante" type="number" min="0" inputMode="numeric" value={gv} onChange={(e) => setGv(e.target.value)} className={`${inputClass} text-center order-4 sm:order-none`} />
          <select aria-label="Equipo visitante" value={visita} onChange={(e) => setVisita(e.target.value)} className={`${inputClass} order-3 sm:order-none`}>
            {EQUIPOS.map((e) => <option key={e}>{e}</option>)}
          </select>
        </div>
        <ErrorText>{error}</ErrorText>
        <button onClick={agregar} className={buttonClass}>Simular resultado</button>
      </div>

      {partidos.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">Tus resultados simulados ({partidos.length})</p>
            <button type="button" onClick={() => setPartidos([])} className={secondaryButtonClass}>Reiniciar</button>
          </div>
          <ul className="flex flex-wrap gap-2">
            {partidos.map((p, i) => (
              <li key={i} className="flex items-center gap-2 rounded-full bg-gray-100 pl-3 pr-1 py-1 text-sm">
                {p.local} {p.gl}-{p.gv} {p.visita}
                <button type="button" aria-label={`Quitar ${p.local} contra ${p.visita}`} onClick={() => setPartidos((x) => x.filter((_, j) => j !== i))} className="w-6 h-6 rounded-full hover:bg-gray-200 text-gray-500">×</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div aria-live="polite" className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <caption className="text-left text-xs text-gray-500 px-3 py-2">Torneo Clausura 2026 · base actualizada al {LIGA1_ACTUALIZADA}</caption>
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-2 py-2 text-left">#</th>
              <th className="px-2 py-2 text-left">Equipo</th>
              {['PJ', 'G', 'E', 'P', 'GF', 'GC', 'DG', 'Pts'].map((h) => <th key={h} className="px-2 py-2 text-right">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tabla.map((e, i) => {
              const cambio = posicionesBase.get(e.equipo) - (i + 1)
              return (
                <tr key={e.equipo} className={i === 0 ? 'bg-green-50' : ''}>
                  <td className="px-2 py-2 font-semibold">
                    {i + 1}
                    {cambio !== 0 && <span className={`ml-1 text-xs ${cambio > 0 ? 'text-green-600' : 'text-red-600'}`}>{cambio > 0 ? `▲${cambio}` : `▼${-cambio}`}</span>}
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">{e.equipo}{e.ajuste ? <span className="text-xs text-red-600"> ({e.ajuste} pts)</span> : null}</td>
                  {[e.pj, e.pg, e.pe, e.pp, e.gf, e.gc, e.dg > 0 ? `+${e.dg}` : e.dg].map((v, j) => <td key={j} className="px-2 py-2 text-right tabular-nums">{v}</td>)}
                  <td className="px-2 py-2 text-right font-bold tabular-nums">{e.pts}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500">
        Orden por puntos, diferencia de goles y goles a favor. Si dos equipos siguen empatados, las bases del torneo usan el resultado
        entre ellos, el fair play y, por último, un sorteo, que el simulador no aplica. Las flechas muestran el cambio frente a la tabla real.
      </p>
    </div>
  )
}
