'use client'

import { useState } from 'react'

const TABS = [
  { id: 'trabajadas', label: 'Horas trabajadas', icon: '🕐' },
  { id: 'sumar_restar', label: 'Sumar / Restar', icon: '➕' },
  { id: 'decimal', label: 'Convertir a decimal', icon: '🔢' },
]

// "HH:MM" -> minutes since midnight
function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function pad(n) {
  return String(n).padStart(2, '0')
}

function minutesToTime(mins) {
  const normalized = ((mins % 1440) + 1440) % 1440
  return `${pad(Math.floor(normalized / 60))}:${pad(normalized % 60)}`
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalculadoraHoras() {
  const [tab, setTab] = useState('trabajadas')

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3.5 py-2 rounded-lg font-semibold text-sm transition-all ${
              tab === t.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'trabajadas' && <HorasTrabajadas />}
      {tab === 'sumar_restar' && <SumarRestar />}
      {tab === 'decimal' && <ConvertirDecimal />}
    </div>
  )
}

// ─── Tab 1: Horas trabajadas (diferencia entre horarios) ───────────

function HorasTrabajadas() {
  const [entrada, setEntrada] = useState('09:00')
  const [salida, setSalida] = useState('17:30')
  const [descanso, setDescanso] = useState('0')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function handleCalcular() {
    if (!entrada || !salida) {
      setError('Introduce la hora de entrada y de salida.')
      return
    }
    const desc = parseInt(descanso, 10) || 0
    if (desc < 0) {
      setError('Los minutos de descanso no pueden ser negativos.')
      return
    }

    const startMin = timeToMinutes(entrada)
    const endMin = timeToMinutes(salida)
    let diff = endMin - startMin
    const crossesMidnight = diff <= 0
    if (crossesMidnight) diff += 24 * 60

    diff -= desc
    if (diff < 0) {
      setError('El descanso indicado es mayor que el tiempo total del turno.')
      return
    }

    setError('')
    setResult({
      horas: Math.floor(diff / 60),
      minutos: diff % 60,
      totalMinutos: diff,
      decimal: (diff / 60).toFixed(2),
      crossesMidnight,
    })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Hora de entrada</label>
          <input type="time" value={entrada} onChange={(e) => setEntrada(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Hora de salida</label>
          <input type="time" value={salida} onChange={(e) => setSalida(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Descanso (minutos)</label>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={descanso}
            onChange={(e) => setDescanso(e.target.value)}
            placeholder="Ej: 30"
            className={inputClass}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleCalcular}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Calcular horas trabajadas
      </button>

      {result && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Tiempo trabajado</p>
          <p className="text-4xl font-bold text-blue-700 leading-none mb-4">
            {result.horas}h {pad(result.minutos)}min
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded-lg px-3 py-2 border border-blue-100">
              <p className="text-gray-500">Total en minutos</p>
              <p className="font-semibold text-gray-900">{result.totalMinutos} min</p>
            </div>
            <div className="bg-white rounded-lg px-3 py-2 border border-blue-100">
              <p className="text-gray-500">Formato decimal</p>
              <p className="font-semibold text-gray-900">{result.decimal} h</p>
            </div>
          </div>
          {result.crossesMidnight && (
            <p className="text-xs text-gray-600 mt-3">
              ⓘ Turno nocturno detectado: la hora de salida es anterior a la de entrada, así que se ha calculado
              cruzando la medianoche.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Tab 2: Sumar / Restar horas a una hora concreta ────────────────

function SumarRestar() {
  const [horaInicial, setHoraInicial] = useState('12:00')
  const [operacion, setOperacion] = useState('sumar')
  const [horas, setHoras] = useState('')
  const [minutos, setMinutos] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function handleCalcular() {
    if (!horaInicial) {
      setError('Introduce una hora de inicio.')
      return
    }
    const h = parseInt(horas, 10) || 0
    const m = parseInt(minutos, 10) || 0
    if (h === 0 && m === 0) {
      setError('Introduce la cantidad de horas o minutos a sumar o restar.')
      return
    }

    setError('')
    const startMin = timeToMinutes(horaInicial)
    const deltaMin = h * 60 + m
    const totalMin = operacion === 'sumar' ? startMin + deltaMin : startMin - deltaMin
    const dayOffset = Math.floor(totalMin / 1440)

    setResult({
      hora: minutesToTime(totalMin),
      dayOffset,
    })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Hora inicial</label>
          <input
            type="time"
            value={horaInicial}
            onChange={(e) => setHoraInicial(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Operación</label>
          <select value={operacion} onChange={(e) => setOperacion(e.target.value)} className={inputClass}>
            <option value="sumar">Sumar</option>
            <option value="restar">Restar</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Horas</label>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={horas}
            onChange={(e) => setHoras(e.target.value)}
            placeholder="Ej: 2"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Minutos</label>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={minutos}
            onChange={(e) => setMinutos(e.target.value)}
            placeholder="Ej: 45"
            className={inputClass}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleCalcular}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Calcular hora resultante
      </button>

      {result && (
        <div className="rounded-xl border-2 border-green-200 bg-green-50 p-5 text-center">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Hora resultante</p>
          <p className="text-4xl font-bold text-green-700 leading-none">{result.hora}</p>
          {result.dayOffset !== 0 && (
            <p className="text-xs text-gray-600 mt-3">
              ⓘ {result.dayOffset > 0
                ? `Corresponde a ${result.dayOffset === 1 ? 'el día siguiente' : `${result.dayOffset} días después`}`
                : `Corresponde a ${result.dayOffset === -1 ? 'el día anterior' : `${Math.abs(result.dayOffset)} días antes`}`}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Tab 3: Convertir horas:minutos <-> decimal ─────────────────────

function ConvertirDecimal() {
  const [hmHoras, setHmHoras] = useState('')
  const [hmMinutos, setHmMinutos] = useState('')
  const [decimalInput, setDecimalInput] = useState('')

  const hVal = parseFloat(hmHoras)
  const mVal = parseFloat(hmMinutos)
  const showHmResult = hmHoras !== '' || hmMinutos !== ''
  const decimalResult = showHmResult ? ((isNaN(hVal) ? 0 : hVal) + (isNaN(mVal) ? 0 : mVal) / 60).toFixed(2) : null

  const decVal = parseFloat(decimalInput)
  const showDecResult = decimalInput !== '' && !isNaN(decVal)
  const absVal = Math.abs(decVal)
  const hmFromDecimal = showDecResult
    ? {
        sign: decVal < 0 ? '-' : '',
        h: Math.floor(absVal),
        m: Math.round((absVal - Math.floor(absVal)) * 60),
      }
    : null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Horas:minutos -> decimal */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">De horas y minutos a decimal</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Horas</label>
            <input
              type="number"
              inputMode="numeric"
              value={hmHoras}
              onChange={(e) => setHmHoras(e.target.value)}
              placeholder="Ej: 7"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Minutos</label>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              max="59"
              value={hmMinutos}
              onChange={(e) => setHmMinutos(e.target.value)}
              placeholder="Ej: 30"
              className={inputClass}
            />
          </div>
        </div>
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 text-center min-h-[84px] flex flex-col justify-center">
          {decimalResult !== null ? (
            <>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Horas decimales</p>
              <p className="text-3xl font-bold text-blue-700">{decimalResult} h</p>
            </>
          ) : (
            <p className="text-sm text-gray-400">Introduce horas y/o minutos</p>
          )}
        </div>
      </div>

      {/* Decimal -> horas:minutos */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">De decimal a horas y minutos</h3>
        <div>
          <label className={labelClass}>Horas decimales</label>
          <input
            type="number"
            step="0.01"
            inputMode="decimal"
            value={decimalInput}
            onChange={(e) => setDecimalInput(e.target.value)}
            placeholder="Ej: 7.5"
            className={inputClass}
          />
        </div>
        <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4 text-center min-h-[84px] flex flex-col justify-center">
          {hmFromDecimal ? (
            <>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Horas y minutos</p>
              <p className="text-3xl font-bold text-green-700">
                {hmFromDecimal.sign}{hmFromDecimal.h}h {pad(hmFromDecimal.m)}min
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-400">Introduce un número decimal</p>
          )}
        </div>
      </div>
    </div>
  )
}
