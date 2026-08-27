'use client'

import { useState } from 'react'

const DAYS_OF_WEEK = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
const MONTHS_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]
const MS_DAY = 86400000

function parseUTC(str) {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}
function todayUTC() {
  const now = new Date()
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
}
function todayISO() {
  const t = todayUTC()
  return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, '0')}-${String(t.getUTCDate()).padStart(2, '0')}`
}
function formatLong(date) {
  return `${date.getUTCDate()} de ${MONTHS_ES[date.getUTCMonth()]} de ${date.getUTCFullYear()}`
}

// Adds `n` months to a UTC date, clamping the day to the target month's length
// (e.g. Jan 31 + 1 month = Feb 28/29, not an overflowed Mar 2/3)
function addMonthsClamped(date, n) {
  const targetMonthIndex = date.getUTCMonth() + n
  const targetYear = date.getUTCFullYear() + Math.floor(targetMonthIndex / 12)
  const normalizedMonth = ((targetMonthIndex % 12) + 12) % 12
  const daysInTargetMonth = new Date(Date.UTC(targetYear, normalizedMonth + 1, 0)).getUTCDate()
  const day = Math.min(date.getUTCDate(), daysInTargetMonth)
  return new Date(Date.UTC(targetYear, normalizedMonth, day))
}

// Calendar-aware years/months/days breakdown between two UTC dates (from <= to).
// Finds the largest whole number of (clamped) months that fits between the dates,
// so the remaining days are always a small, non-negative amount.
function diffYMD(from, to) {
  let months = (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + (to.getUTCMonth() - from.getUTCMonth())
  let anchor = addMonthsClamped(from, months)
  if (anchor > to) {
    months--
    anchor = addMonthsClamped(from, months)
  }
  const days = Math.round((to - anchor) / MS_DAY)
  const years = Math.floor(months / 12)
  const remMonths = months - years * 12
  return { years, months: remMonths, days }
}

function countBusinessDays(from, to) {
  let count = 0
  const cur = new Date(from)
  while (cur < to) {
    const day = cur.getUTCDay()
    if (day !== 0 && day !== 6) count++
    cur.setUTCDate(cur.getUTCDate() + 1)
  }
  return count
}

function addBusinessDays(start, n) {
  const date = new Date(start)
  let remaining = Math.abs(n)
  const dir = n >= 0 ? 1 : -1
  while (remaining > 0) {
    date.setUTCDate(date.getUTCDate() + dir)
    const day = date.getUTCDay()
    if (day !== 0 && day !== 6) remaining--
  }
  return date
}

const TABS = [
  { id: 'diferencia', label: 'Diferencia entre fechas', icon: '📅' },
  { id: 'sumar_restar', label: 'Sumar / Restar días', icon: '➕' },
  { id: 'cuenta_regresiva', label: 'Días hasta una fecha', icon: '⏳' },
]

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalculadoraDias() {
  const [tab, setTab] = useState('diferencia')

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

      {tab === 'diferencia' && <DiferenciaFechas />}
      {tab === 'sumar_restar' && <SumarRestarDias />}
      {tab === 'cuenta_regresiva' && <CuentaRegresiva />}
    </div>
  )
}

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
      <div className="text-2xl sm:text-3xl font-bold text-blue-600">{value}</div>
      <div className="text-sm font-medium text-gray-700 mt-1">{label}</div>
      {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
    </div>
  )
}

// ─── Tab 1: Diferencia entre fechas ─────────────────────────────────

function DiferenciaFechas() {
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function handleCalcular() {
    if (!fechaInicio || !fechaFin) return setError('Introduce ambas fechas.')
    let from = parseUTC(fechaInicio)
    let to = parseUTC(fechaFin)
    const invertido = from > to
    if (invertido) [from, to] = [to, from]

    setError('')
    const ymd = diffYMD(from, to)
    const totalDays = Math.round((to - from) / MS_DAY)
    const businessDays = countBusinessDays(from, to)
    setResult({
      ymd,
      totalDays,
      totalWeeks: (totalDays / 7).toFixed(1),
      totalMonths: (totalDays / 30.44).toFixed(1),
      businessDays,
      weekendDays: totalDays - businessDays,
      invertido,
    })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Fecha inicial</label>
          <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Fecha final</label>
          <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className={inputClass} />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleCalcular}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Calcular diferencia
      </button>

      {result && (
        <div className="space-y-5 pt-2">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 text-white text-center">
            <p className="text-blue-100 text-sm mb-1">Diferencia total</p>
            <p className="text-4xl font-bold">
              {result.ymd.years} <span className="text-2xl font-semibold">años</span>
            </p>
            <p className="text-blue-200 mt-1">
              {result.ymd.months} {result.ymd.months === 1 ? 'mes' : 'meses'} y {result.ymd.days}{' '}
              {result.ymd.days === 1 ? 'día' : 'días'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatCard label="Días totales" value={result.totalDays.toLocaleString('es')} />
            <StatCard label="Semanas" value={result.totalWeeks.toLocaleString('es')} sub="aprox." />
            <StatCard label="Meses" value={result.totalMonths.toLocaleString('es')} sub="aprox." />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Días hábiles (lun-vie)</span>
              <span className="text-sm font-semibold text-gray-900">{result.businessDays.toLocaleString('es')}</span>
            </div>
            <div className="border-t border-gray-200" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Días de fin de semana</span>
              <span className="text-sm font-semibold text-gray-900">{result.weekendDays.toLocaleString('es')}</span>
            </div>
          </div>

          {result.invertido && (
            <p className="text-xs text-gray-500">
              ⓘ La fecha final era anterior a la inicial, así que se han ordenado automáticamente.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Tab 2: Sumar / Restar días ──────────────────────────────────────

const UNIDADES = [
  { id: 'dias', label: 'Días' },
  { id: 'semanas', label: 'Semanas' },
  { id: 'meses', label: 'Meses' },
  { id: 'anios', label: 'Años' },
]

function SumarRestarDias() {
  const [fechaBase, setFechaBase] = useState(todayISO())
  const [operacion, setOperacion] = useState('sumar')
  const [cantidad, setCantidad] = useState('')
  const [unidad, setUnidad] = useState('dias')
  const [soloHabiles, setSoloHabiles] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function handleCalcular() {
    if (!fechaBase) return setError('Introduce una fecha inicial.')
    const cant = parseInt(cantidad, 10)
    if (!cantidad || isNaN(cant) || cant <= 0) return setError('Introduce una cantidad válida mayor que 0.')

    setError('')
    const signo = operacion === 'sumar' ? 1 : -1
    const base = parseUTC(fechaBase)
    let resultado

    if (unidad === 'dias' && soloHabiles) {
      resultado = addBusinessDays(base, cant * signo)
    } else if (unidad === 'dias') {
      resultado = new Date(base)
      resultado.setUTCDate(resultado.getUTCDate() + cant * signo)
    } else if (unidad === 'semanas') {
      resultado = new Date(base)
      resultado.setUTCDate(resultado.getUTCDate() + cant * 7 * signo)
    } else if (unidad === 'meses') {
      resultado = new Date(base)
      resultado.setUTCMonth(resultado.getUTCMonth() + cant * signo)
    } else {
      resultado = new Date(base)
      resultado.setUTCFullYear(resultado.getUTCFullYear() + cant * signo)
    }

    setResult({ fecha: resultado, diaSemana: DAYS_OF_WEEK[resultado.getUTCDay()] })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Fecha inicial</label>
          <input type="date" value={fechaBase} onChange={(e) => setFechaBase(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Operación</label>
          <select value={operacion} onChange={(e) => setOperacion(e.target.value)} className={inputClass}>
            <option value="sumar">Sumar</option>
            <option value="restar">Restar</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Cantidad</label>
          <input
            type="number"
            inputMode="numeric"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            placeholder="Ej: 30"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Unidad</label>
          <select value={unidad} onChange={(e) => setUnidad(e.target.value)} className={inputClass}>
            {UNIDADES.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {unidad === 'dias' && (
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={soloHabiles}
            onChange={(e) => setSoloHabiles(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Contar solo días hábiles (omitir sábados y domingos)
        </label>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleCalcular}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Calcular fecha
      </button>

      {result && (
        <div className="rounded-xl border-2 border-green-200 bg-green-50 p-5 text-center">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Fecha resultante</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-700 capitalize">{formatLong(result.fecha)}</p>
          <p className="text-sm text-gray-500 mt-1 capitalize">{result.diaSemana}</p>
        </div>
      )}
    </div>
  )
}

// ─── Tab 3: Cuenta regresiva ──────────────────────────────────────────

function CuentaRegresiva() {
  const [fechaObjetivo, setFechaObjetivo] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function handleCalcular() {
    if (!fechaObjetivo) return setError('Introduce una fecha.')
    setError('')

    const hoy = todayUTC()
    const objetivo = parseUTC(fechaObjetivo)
    const totalDays = Math.round((objetivo - hoy) / MS_DAY)

    if (totalDays === 0) {
      setResult({ esHoy: true, diaSemana: DAYS_OF_WEEK[objetivo.getUTCDay()] })
      return
    }

    const futura = totalDays > 0
    const from = futura ? hoy : objetivo
    const to = futura ? objetivo : hoy
    const ymd = diffYMD(from, to)

    setResult({
      esHoy: false,
      futura,
      totalDays: Math.abs(totalDays),
      ymd,
      diaSemana: DAYS_OF_WEEK[objetivo.getUTCDay()],
      fechaFormateada: formatLong(objetivo),
    })
  }

  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Fecha objetivo</label>
        <input type="date" value={fechaObjetivo} onChange={(e) => setFechaObjetivo(e.target.value)} className={inputClass} />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleCalcular}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Calcular
      </button>

      {result && result.esHoy && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
          <p className="text-2xl font-bold text-blue-700">¡Es hoy!</p>
          <p className="text-sm text-gray-500 mt-1 capitalize">{result.diaSemana}</p>
        </div>
      )}

      {result && !result.esHoy && (
        <div className="space-y-5 pt-2">
          <div className={`rounded-xl p-5 text-white text-center bg-gradient-to-r ${result.futura ? 'from-blue-600 to-blue-700' : 'from-gray-500 to-gray-600'}`}>
            <p className="text-blue-100 text-sm mb-1">{result.futura ? 'Faltan' : 'Han pasado'}</p>
            <p className="text-4xl font-bold">
              {result.totalDays.toLocaleString('es')} <span className="text-2xl font-semibold">días</span>
            </p>
            <p className="text-blue-100 mt-1">
              ({result.ymd.years} años, {result.ymd.months} meses y {result.ymd.days} días)
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">{result.fechaFormateada} cae en</span>
            <span className="text-sm font-semibold text-gray-900 capitalize">{result.diaSemana}</span>
          </div>
        </div>
      )}
    </div>
  )
}
