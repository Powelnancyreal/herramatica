'use client'

import { useState } from 'react'

const MS_POR_DIA = 1000 * 60 * 60 * 24

function calcularAntiguedad(ingreso, egreso) {
  const inicio = new Date(ingreso)
  const fin = new Date(egreso)
  let anios = fin.getFullYear() - inicio.getFullYear()
  const aniversarioEsteAnio = new Date(fin.getFullYear(), inicio.getMonth(), inicio.getDate())
  if (fin < aniversarioEsteAnio) anios--
  const ultimoAniversario = new Date(inicio.getFullYear() + anios, inicio.getMonth(), inicio.getDate())
  const diasFraccion = Math.round((fin - ultimoAniversario) / MS_POR_DIA)
  const mesesFraccion = diasFraccion / 30.44
  const aniosParaIndemnizacion = mesesFraccion > 3 ? anios + 1 : Math.max(anios, 1)
  return { anios, mesesFraccion, aniosParaIndemnizacion }
}

function diasVacacionesSegunAntiguedad(anios) {
  if (anios < 5) return 14
  if (anios < 10) return 21
  if (anios < 20) return 28
  return 35
}

function formatMoney(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return n.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

const TABS = [
  { id: 'indemnizacion', label: 'Indemnización por Despido' },
  { id: 'liquidacion', label: 'Liquidación Final' },
]

export default function CalcularIndemnizacionDespido() {
  const [tab, setTab] = useState('indemnizacion')
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
      {tab === 'indemnizacion' ? <Indemnizacion /> : <LiquidacionFinal />}
      <p className="text-xs text-gray-500">
        ⚠️ Cálculo orientativo basado en la Ley de Contrato de Trabajo (LCT) argentina. No reemplaza el asesoramiento
        de un abogado laboralista o contador, especialmente en casos con convenios colectivos particulares.
      </p>
    </div>
  )
}

function Indemnizacion() {
  const [mejorSueldo, setMejorSueldo] = useState('')
  const [ingreso, setIngreso] = useState('')
  const [egreso, setEgreso] = useState('')
  const [preavisoOtorgado, setPreavisoOtorgado] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const sueldo = parseFloat(mejorSueldo)
    if (!sueldo || sueldo <= 0) return setError('Introduce la mejor remuneración mensual, normal y habitual.')
    if (!ingreso || !egreso) return setError('Introduce la fecha de ingreso y la fecha de egreso.')
    if (new Date(egreso) <= new Date(ingreso)) return setError('La fecha de egreso debe ser posterior a la de ingreso.')

    setError('')
    const { anios, aniosParaIndemnizacion } = calcularAntiguedad(ingreso, egreso)
    const indemnizacionAntiguedad = sueldo * aniosParaIndemnizacion

    let preaviso = 0
    if (!preavisoOtorgado) preaviso = anios < 5 ? sueldo : sueldo * 2

    const fin = new Date(egreso)
    const diasEnElMes = new Date(fin.getFullYear(), fin.getMonth() + 1, 0).getDate()
    const diasRestantes = diasEnElMes - fin.getDate()
    const integracionMes = (sueldo / diasEnElMes) * diasRestantes

    const total = indemnizacionAntiguedad + preaviso + integracionMes

    setResult({ anios, aniosParaIndemnizacion, indemnizacionAntiguedad, preaviso, integracionMes, total })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Mejor remuneración mensual, normal y habitual</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input type="number" inputMode="decimal" min="0" value={mejorSueldo} onChange={(e) => setMejorSueldo(e.target.value)} placeholder="Ej: 800000" className={`${inputClass} pl-7`} />
          </div>
        </div>
        <div>
          <label className={labelClass}>¿Se otorgó preaviso?</label>
          <select value={preavisoOtorgado ? 'si' : 'no'} onChange={(e) => setPreavisoOtorgado(e.target.value === 'si')} className={inputClass}>
            <option value="no">No</option>
            <option value="si">Sí</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Fecha de ingreso</label>
          <input type="date" value={ingreso} onChange={(e) => setIngreso(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Fecha de egreso (despido)</label>
          <input type="date" value={egreso} onChange={(e) => setEgreso(e.target.value)} className={inputClass} />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button onClick={calcular} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
        Calcular indemnización
      </button>

      {result && (
        <div className="space-y-3">
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total estimado</p>
            <p className="text-4xl font-bold text-blue-700 leading-none mb-1">${formatMoney(result.total)}</p>
            <p className="text-xs text-gray-500">Antigüedad: {result.anios} años completos ({result.aniosParaIndemnizacion} años computados para el Art. 245)</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
              <p className="text-gray-500">Indemnización antigüedad</p>
              <p className="font-semibold text-gray-900">${formatMoney(result.indemnizacionAntiguedad)}</p>
            </div>
            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
              <p className="text-gray-500">Preaviso no otorgado</p>
              <p className="font-semibold text-gray-900">${formatMoney(result.preaviso)}</p>
            </div>
            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
              <p className="text-gray-500">Integración mes despido</p>
              <p className="font-semibold text-gray-900">${formatMoney(result.integracionMes)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function LiquidacionFinal() {
  const [sueldo, setSueldo] = useState('')
  const [ingreso, setIngreso] = useState('')
  const [egreso, setEgreso] = useState('')
  const [diasVacacionesGozados, setDiasVacacionesGozados] = useState('0')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const s = parseFloat(sueldo)
    if (!s || s <= 0) return setError('Introduce el sueldo mensual.')
    if (!ingreso || !egreso) return setError('Introduce la fecha de ingreso y la fecha de egreso.')
    if (new Date(egreso) <= new Date(ingreso)) return setError('La fecha de egreso debe ser posterior a la de ingreso.')

    setError('')
    const finDate = new Date(egreso)
    const inicioAño = new Date(finDate.getFullYear(), 0, 1)
    const inicioComputo = new Date(ingreso) > inicioAño ? new Date(ingreso) : inicioAño
    const diasTrabajadosEnElAño = Math.round((finDate - inicioComputo) / MS_POR_DIA) + 1

    const { anios } = calcularAntiguedad(ingreso, egreso)
    const diasVacacionesTotales = diasVacacionesSegunAntiguedad(anios)
    const diasVacacionesProporcionales = Math.round((diasVacacionesTotales / 365) * diasTrabajadosEnElAño)
    const vacacionesProporcionales = (s / 25) * Math.max(diasVacacionesProporcionales - (parseFloat(diasVacacionesGozados) || 0), 0)

    const mesActual = finDate.getMonth()
    const semestreInicio = mesActual < 6 ? new Date(finDate.getFullYear(), 0, 1) : new Date(finDate.getFullYear(), 6, 1)
    const inicioComputoSac = new Date(ingreso) > semestreInicio ? new Date(ingreso) : semestreInicio
    const diasTrabajadosSemestre = Math.round((finDate - inicioComputoSac) / MS_POR_DIA) + 1
    const diasTotalesSemestre = Math.round((new Date(finDate.getFullYear(), mesActual < 6 ? 5 : 11, mesActual < 6 ? 30 : 31) - semestreInicio) / MS_POR_DIA) + 1
    const sacProporcional = (s / 2) * (diasTrabajadosSemestre / diasTotalesSemestre)

    const total = vacacionesProporcionales + sacProporcional

    setResult({ vacacionesProporcionales, sacProporcional, diasVacacionesProporcionales, total })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Sueldo mensual</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
            <input type="number" inputMode="decimal" min="0" value={sueldo} onChange={(e) => setSueldo(e.target.value)} placeholder="Ej: 800000" className={`${inputClass} pl-7`} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Días de vacaciones ya gozados este año</label>
          <input type="number" inputMode="numeric" min="0" value={diasVacacionesGozados} onChange={(e) => setDiasVacacionesGozados(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Fecha de ingreso</label>
          <input type="date" value={ingreso} onChange={(e) => setIngreso(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Fecha de egreso (renuncia o despido)</label>
          <input type="date" value={egreso} onChange={(e) => setEgreso(e.target.value)} className={inputClass} />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button onClick={calcular} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
        Calcular liquidación final
      </button>

      {result && (
        <div className="space-y-3">
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total estimado</p>
            <p className="text-4xl font-bold text-blue-700 leading-none">${formatMoney(result.total)}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
              <p className="text-gray-500">SAC (aguinaldo) proporcional</p>
              <p className="font-semibold text-gray-900">${formatMoney(result.sacProporcional)}</p>
            </div>
            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
              <p className="text-gray-500">Vacaciones no gozadas ({result.diasVacacionesProporcionales} días proporcionales)</p>
              <p className="font-semibold text-gray-900">${formatMoney(result.vacacionesProporcionales)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
