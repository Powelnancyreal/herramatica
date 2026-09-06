'use client'

import { useMemo, useState } from 'react'

function formatMoney(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return n.toLocaleString('es', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

const TABS = [
  { id: 'empleado', label: 'Empleado (dependiente)' },
  { id: 'independiente', label: 'Independiente (por honorarios)' },
]

export default function CalculadoraSeguridadSocialColombia() {
  const [tab, setTab] = useState('empleado')
  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              tab === t.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'empleado' ? <Empleado /> : <Independiente />}
      <p className="text-xs text-gray-500">
        ⚠️ Usa los porcentajes estándar vigentes para trabajadores dependientes e independientes en Colombia. No
        incluye el aporte adicional al Fondo de Solidaridad Pensional aplicable a ingresos superiores a 4 SMLMV, ni
        ARL. Verifica tu caso específico con tu operador de seguridad social.
      </p>
    </div>
  )
}

function Empleado() {
  const [salario, setSalario] = useState('')

  const resultado = useMemo(() => {
    const s = parseFloat(salario)
    if (isNaN(s) || s <= 0) return null
    const salud = s * 0.04
    const pension = s * 0.04
    return { salud, pension, neto: s - salud - pension }
  }, [salario])

  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Salario mensual (IBC)</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
          <input type="number" inputMode="decimal" min="0" value={salario} onChange={(e) => setSalario(e.target.value)} placeholder="Ej: 2000000" className={`${inputClass} pl-7`} />
        </div>
      </div>

      {resultado && (
        <div className="space-y-3">
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Salario neto (después de aportes)</p>
            <p className="text-4xl font-bold text-blue-700">${formatMoney(resultado.neto)}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-center">
            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
              <p className="text-gray-500">Aporte salud (4%)</p>
              <p className="font-semibold text-gray-900">${formatMoney(resultado.salud)}</p>
            </div>
            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
              <p className="text-gray-500">Aporte pensión (4%)</p>
              <p className="font-semibold text-gray-900">${formatMoney(resultado.pension)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Independiente() {
  const [ingresos, setIngresos] = useState('')

  const resultado = useMemo(() => {
    const i = parseFloat(ingresos)
    if (isNaN(i) || i <= 0) return null
    const ibc = i * 0.4
    const salud = ibc * 0.125
    const pension = ibc * 0.16
    return { ibc, salud, pension, totalAportes: salud + pension, neto: i - salud - pension }
  }, [ingresos])

  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Ingresos mensuales por honorarios</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
          <input type="number" inputMode="decimal" min="0" value={ingresos} onChange={(e) => setIngresos(e.target.value)} placeholder="Ej: 3000000" className={`${inputClass} pl-7`} />
        </div>
        <p className="text-xs text-gray-500 mt-1.5">El IBC para independientes se calcula sobre el 40% de tus ingresos mensuales.</p>
      </div>

      {resultado && (
        <div className="space-y-3">
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Ingreso neto (después de aportes)</p>
            <p className="text-4xl font-bold text-blue-700">${formatMoney(resultado.neto)}</p>
            <p className="text-xs text-gray-500 mt-1">IBC: ${formatMoney(resultado.ibc)}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-center">
            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
              <p className="text-gray-500">Aporte salud (12.5% del IBC)</p>
              <p className="font-semibold text-gray-900">${formatMoney(resultado.salud)}</p>
            </div>
            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
              <p className="text-gray-500">Aporte pensión (16% del IBC)</p>
              <p className="font-semibold text-gray-900">${formatMoney(resultado.pension)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
