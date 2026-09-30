'use client'

import { useEffect, useRef, useState } from 'react'
import { buttonClass, Field, inputClass, NumberInput, secondaryButtonClass, Tabs } from '@/components/calc-ui'

const PRESETS = [1, 3, 5, 10, 15, 25, 30, 60]

function formatear(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return `${h ? String(h).padStart(2, '0') + ':' : ''}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function desglose(ms) {
  const t = Math.max(0, Math.floor(ms / 1000))
  return { d: Math.floor(t / 86400), h: Math.floor((t % 86400) / 3600), m: Math.floor((t % 3600) / 60), s: t % 60 }
}

export default function TemporizadorOnline() {
  const [modo, setModo] = useState('temporizador')
  const [h, setH] = useState('0')
  const [m, setM] = useState('5')
  const [s, setS] = useState('0')
  const [fin, setFin] = useState(null)
  const [restantePausa, setRestantePausa] = useState(null)
  const [ahora, setAhora] = useState(Date.now())
  const [terminado, setTerminado] = useState(false)
  const [fechaObjetivo, setFechaObjetivo] = useState('')
  const audio = useRef(null)
  const tituloOriginal = useRef('')

  const restante = restantePausa ?? (fin ? fin - ahora : null)

  useEffect(() => {
    tituloOriginal.current = document.title
    return () => {
      document.title = tituloOriginal.current
    }
  }, [])

  useEffect(() => {
    const activo = (modo === 'temporizador' && fin && restantePausa === null) || (modo === 'fecha' && fechaObjetivo)
    if (!activo) return
    const id = setInterval(() => setAhora(Date.now()), 250)
    return () => clearInterval(id)
  }, [modo, fin, restantePausa, fechaObjetivo])

  useEffect(() => {
    if (modo !== 'temporizador' || !fin || restantePausa !== null) return
    if (restante <= 0 && !terminado) {
      setTerminado(true)
      pitar()
      document.title = '⏰ ¡Tiempo!'
    } else if (restante > 0) document.title = `${formatear(restante)} · Temporizador`
  })

  function pitar() {
    const ctx = audio.current
    if (!ctx) return
    ;[0, 0.35, 0.7, 1.05].forEach((t) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.3, ctx.currentTime + t)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.3)
      osc.connect(gain).connect(ctx.destination)
      osc.start(ctx.currentTime + t)
      osc.stop(ctx.currentTime + t + 0.3)
    })
  }

  function iniciar(msOverride) {
    const ms = msOverride ?? ((parseInt(h, 10) || 0) * 3600 + (parseInt(m, 10) || 0) * 60 + (parseInt(s, 10) || 0)) * 1000
    if (ms <= 0) return
    if (!audio.current) {
      const AC = window.AudioContext || window.webkitAudioContext
      if (AC) audio.current = new AC()
    }
    audio.current?.resume()
    setTerminado(false)
    setRestantePausa(null)
    setAhora(Date.now())
    setFin(Date.now() + ms)
  }

  function pausar() {
    if (restantePausa !== null) {
      setFin(Date.now() + restantePausa)
      setAhora(Date.now())
      setRestantePausa(null)
    } else setRestantePausa(fin - Date.now())
  }

  function reiniciar() {
    setFin(null)
    setRestantePausa(null)
    setTerminado(false)
    document.title = tituloOriginal.current
  }

  const objetivoTs = fechaObjetivo ? new Date(fechaObjetivo).getTime() : null
  const cuenta = objetivoTs ? desglose(objetivoTs - ahora) : null

  return (
    <div className="space-y-5">
      <Tabs
        tabs={[
          { id: 'temporizador', label: 'Temporizador' },
          { id: 'fecha', label: 'Cuenta regresiva a una fecha' },
        ]}
        value={modo}
        onChange={setModo}
      />

      {modo === 'temporizador' ? (
        <>
          <div
            className={`rounded-2xl p-8 text-center font-mono text-6xl sm:text-7xl font-bold tabular-nums ${
              terminado ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-900 text-green-300'
            }`}
            aria-live="polite"
          >
            {terminado ? '¡Tiempo!' : formatear(restante ?? ((parseInt(h, 10) || 0) * 3600 + (parseInt(m, 10) || 0) * 60 + (parseInt(s, 10) || 0)) * 1000)}
          </div>
          {!fin && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Horas"><NumberInput value={h} onChange={setH} min="0" max="99" /></Field>
                <Field label="Minutos"><NumberInput value={m} onChange={setM} min="0" max="59" /></Field>
                <Field label="Segundos"><NumberInput value={s} onChange={setS} min="0" max="59" /></Field>
              </div>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button key={p} type="button" onClick={() => iniciar(p * 60000)} className={secondaryButtonClass}>
                    {p} min
                  </button>
                ))}
              </div>
              <button onClick={() => iniciar()} className={buttonClass}>▶ Iniciar</button>
            </>
          )}
          {fin && (
            <div className="grid grid-cols-2 gap-3">
              {!terminado && (
                <button onClick={pausar} className={buttonClass}>{restantePausa !== null ? '▶ Reanudar' : '⏸ Pausar'}</button>
              )}
              <button onClick={reiniciar} className={`${secondaryButtonClass} py-3 ${terminado ? 'col-span-2' : ''}`}>↺ Reiniciar</button>
            </div>
          )}
          <p className="text-xs text-gray-500">
            Sonará una alarma al terminar y el tiempo restante aparece en la pestaña del navegador. Sigue contando aunque cambies
            de pestaña.
          </p>
        </>
      ) : (
        <>
          <Field label="Fecha y hora objetivo">
            <input type="datetime-local" value={fechaObjetivo} onChange={(e) => setFechaObjetivo(e.target.value)} className={inputClass} />
          </Field>
          {cuenta && (
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                ['Días', cuenta.d],
                ['Horas', cuenta.h],
                ['Minutos', cuenta.m],
                ['Segundos', cuenta.s],
              ].map(([l, v]) => (
                <div key={l} className="rounded-xl bg-gray-900 text-green-300 py-4">
                  <p className="text-3xl sm:text-5xl font-bold font-mono tabular-nums">{String(v).padStart(2, '0')}</p>
                  <p className="text-xs text-gray-400 mt-1">{l}</p>
                </div>
              ))}
            </div>
          )}
          {objetivoTs && objetivoTs <= ahora && <p className="text-center text-lg font-semibold text-red-600">¡La fecha ya llegó!</p>}
        </>
      )}
    </div>
  )
}
