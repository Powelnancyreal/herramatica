'use client'

import { useState } from 'react'

const MS_POR_DIA = 1000 * 60 * 60 * 24

function diasEntre(inicio, fin) {
  return Math.round((fin - inicio) / MS_POR_DIA) + 1
}

function formatMoney(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return n.toLocaleString('es', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

const TABS = [
  { id: 'cesantias', label: 'Cesantías + Intereses' },
  { id: 'prima', label: 'Prima de Servicios' },
  { id: 'vacaciones', label: 'Vacaciones' },
]

export default function CalculadoraLiquidacionLaboralColombia() {
  const [tab, setTab] = useState('cesantias')
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
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'cesantias' && <Cesantias />}
      {tab === 'prima' && <Prima />}
      {tab === 'vacaciones' && <Vacaciones />}
      <p className="text-xs text-gray-500">
        ⚠️ Cálculo orientativo basado en el Código Sustantivo del Trabajo colombiano. No incluye todos los factores
        salariales que pueden formar parte de la base de liquidación (comisiones habituales, horas extra
        recurrentes, etc.). Verifica el detalle exacto con tu área de Recursos Humanos.
      </p>
    </div>
  )
}

function Cesantias() {
  const [salario, setSalario] = useState('')
  const [auxilioTransporte, setAuxilioTransporte] = useState('0')
  const [fechaIngreso, setFechaIngreso] = useState('')
  const [fechaCorte, setFechaCorte] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const s = parseFloat(salario)
    const aux = parseFloat(auxilioTransporte) || 0
    if (!s || s <= 0) return setError('Introduce el salario mensual.')
    if (!fechaIngreso || !fechaCorte) return setError('Introduce la fecha de ingreso y la fecha de corte.')
    const ingreso = new Date(fechaIngreso)
    const corte = new Date(fechaCorte)
    if (corte <= ingreso) return setError('La fecha de corte debe ser posterior a la de ingreso.')

    setError('')
    const inicioAño = new Date(corte.getFullYear(), 0, 1)
    const inicioComputo = ingreso > inicioAño ? ingreso : inicioAño
    const dias = Math.min(360, diasEntre(inicioComputo, corte))
    const base = s + aux
    const cesantias = (base * dias) / 360
    const intereses = cesantias * (dias / 360) * 0.12

    setResult({ cesantias, intereses, total: cesantias + intereses, dias })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Salario mensual</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input type="number" inputMode="decimal" min="0" value={salario} onChange={(e) => setSalario(e.target.value)} placeholder="Ej: 2000000" className={`${inputClass} pl-7`} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Auxilio de transporte (si aplica)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input type="number" inputMode="decimal" min="0" value={auxilioTransporte} onChange={(e) => setAuxilioTransporte(e.target.value)} className={`${inputClass} pl-7`} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Fecha de ingreso (o inicio del año si ya trabajabas)</label>
          <input type="date" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Fecha de corte (31 dic o fecha de retiro)</label>
          <input type="date" value={fechaCorte} onChange={(e) => setFechaCorte(e.target.value)} className={inputClass} />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button onClick={calcular} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
        Calcular cesantías
      </button>

      {result && (
        <div className="space-y-3">
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total (cesantías + intereses)</p>
            <p className="text-4xl font-bold text-blue-700 leading-none mb-1">${formatMoney(result.total)}</p>
            <p className="text-xs text-gray-500">{result.dias} días computados</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
              <p className="text-gray-500">Cesantías</p>
              <p className="font-semibold text-gray-900">${formatMoney(result.cesantias)}</p>
            </div>
            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
              <p className="text-gray-500">Intereses (12% anual)</p>
              <p className="font-semibold text-gray-900">${formatMoney(result.intereses)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Prima() {
  const [salario, setSalario] = useState('')
  const [semestre, setSemestre] = useState('1')
  const [fechaIngreso, setFechaIngreso] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const s = parseFloat(salario)
    if (!s || s <= 0) return setError('Introduce el salario mensual.')

    setError('')
    const anio = new Date().getFullYear()
    const inicioSemestre = semestre === '1' ? new Date(anio, 0, 1) : new Date(anio, 6, 1)
    const finSemestre = semestre === '1' ? new Date(anio, 5, 30) : new Date(anio, 11, 31)

    let inicioComputo = inicioSemestre
    if (fechaIngreso) {
      const ingreso = new Date(fechaIngreso)
      if (ingreso > inicioSemestre && ingreso <= finSemestre) inicioComputo = ingreso
    }

    const dias = Math.min(180, diasEntre(inicioComputo, finSemestre))
    const prima = (s * dias) / 360

    setResult({ prima, dias })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Salario mensual</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input type="number" inputMode="decimal" min="0" value={salario} onChange={(e) => setSalario(e.target.value)} placeholder="Ej: 2000000" className={`${inputClass} pl-7`} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Semestre</label>
          <select value={semestre} onChange={(e) => setSemestre(e.target.value)} className={inputClass}>
            <option value="1">Primer semestre (pago 30 de junio)</option>
            <option value="2">Segundo semestre (pago 20 de diciembre)</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Fecha de ingreso (solo si empezaste este semestre)</label>
          <input type="date" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} className={inputClass} />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button onClick={calcular} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
        Calcular prima
      </button>

      {result && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Prima de servicios</p>
          <p className="text-4xl font-bold text-blue-700 leading-none mb-1">${formatMoney(result.prima)}</p>
          <p className="text-xs text-gray-500">{result.dias} de 180 días del semestre</p>
        </div>
      )}
    </div>
  )
}

function Vacaciones() {
  const [salario, setSalario] = useState('')
  const [dias, setDias] = useState('360')
  const [result, setResult] = useState(null)

  function calcular() {
    const s = parseFloat(salario)
    const d = parseFloat(dias)
    if (!s || s <= 0 || !d || d <= 0) return
    setResult({ compensacion: (s * d) / 720 })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Salario mensual</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input type="number" inputMode="decimal" min="0" value={salario} onChange={(e) => setSalario(e.target.value)} placeholder="Ej: 2000000" className={`${inputClass} pl-7`} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Días trabajados</label>
          <input type="number" inputMode="numeric" min="0" value={dias} onChange={(e) => setDias(e.target.value)} className={inputClass} />
        </div>
      </div>

      <button onClick={calcular} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
        Calcular vacaciones
      </button>

      {result && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Compensación en dinero por vacaciones</p>
          <p className="text-4xl font-bold text-blue-700">${formatMoney(result.compensacion)}</p>
        </div>
      )}
    </div>
  )
}
