'use client'

import { useMemo, useState } from 'react'

const MS_POR_DIA = 1000 * 60 * 60 * 24

function formatFecha(date) {
  return date.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

const TABS = [
  { id: 'semanas', label: 'Semanas de Embarazo y Fecha de Parto' },
  { id: 'fertiles', label: 'Días Fértiles y Ovulación' },
]

export default function CalculadoraEmbarazo() {
  const [tab, setTab] = useState('semanas')
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
      {tab === 'semanas' ? <SemanasEmbarazo /> : <DiasFertiles />}
      <p className="text-xs text-gray-500">
        ⚠️ Estimación orientativa basada en la regla de Naegele, que asume un ciclo regular de 28 días. Tu médico u
        obstetra puede ajustar estas fechas con una ecografía, especialmente si tu ciclo es irregular.
      </p>
    </div>
  )
}

function SemanasEmbarazo() {
  const [fum, setFum] = useState('')

  const resultado = useMemo(() => {
    if (!fum) return null
    const inicio = new Date(fum)
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const diasTotales = Math.floor((hoy - inicio) / MS_POR_DIA)
    if (diasTotales < 0) return null

    const fpp = new Date(inicio)
    fpp.setDate(fpp.getDate() + 280)

    return {
      semanas: Math.floor(diasTotales / 7),
      dias: diasTotales % 7,
      fpp,
      trimestre: diasTotales < 98 ? 1 : diasTotales < 189 ? 2 : 3,
    }
  }, [fum])

  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Fecha de la última menstruación (FUM)</label>
        <input type="date" value={fum} onChange={(e) => setFum(e.target.value)} className={inputClass} />
      </div>

      {resultado && (
        <div className="space-y-3">
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Semanas de embarazo</p>
            <p className="text-4xl font-bold text-blue-700">
              {resultado.semanas} sem {resultado.dias > 0 && `+ ${resultado.dias} d`}
            </p>
            <p className="text-sm text-gray-500 mt-1">{resultado.trimestre}º trimestre</p>
          </div>
          <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 text-center">
            <p className="text-xs text-gray-500">Fecha probable de parto (40 semanas)</p>
            <p className="font-semibold text-gray-900">{formatFecha(resultado.fpp)}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function DiasFertiles() {
  const [fum, setFum] = useState('')
  const [duracionCiclo, setDuracionCiclo] = useState('28')

  const resultado = useMemo(() => {
    if (!fum) return null
    const ciclo = parseInt(duracionCiclo, 10) || 28
    const inicio = new Date(fum)
    const ovulacion = new Date(inicio)
    ovulacion.setDate(ovulacion.getDate() + (ciclo - 14))
    const inicioFertil = new Date(ovulacion)
    inicioFertil.setDate(inicioFertil.getDate() - 5)
    const finFertil = new Date(ovulacion)
    finFertil.setDate(finFertil.getDate() + 1)
    const proximaMenstruacion = new Date(inicio)
    proximaMenstruacion.setDate(proximaMenstruacion.getDate() + ciclo)

    return { ovulacion, inicioFertil, finFertil, proximaMenstruacion }
  }, [fum, duracionCiclo])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Fecha de inicio de tu último período</label>
          <input type="date" value={fum} onChange={(e) => setFum(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Duración habitual de tu ciclo (días)</label>
          <input type="number" inputMode="numeric" min="20" max="45" value={duracionCiclo} onChange={(e) => setDuracionCiclo(e.target.value)} className={inputClass} />
        </div>
      </div>

      {resultado && (
        <div className="space-y-3">
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Ventana fértil estimada</p>
            <p className="text-xl font-bold text-blue-700">
              {formatFecha(resultado.inicioFertil)} — {formatFecha(resultado.finFertil)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-center">
            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
              <p className="text-gray-500">Ovulación estimada</p>
              <p className="font-semibold text-gray-900">{formatFecha(resultado.ovulacion)}</p>
            </div>
            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
              <p className="text-gray-500">Próxima menstruación</p>
              <p className="font-semibold text-gray-900">{formatFecha(resultado.proximaMenstruacion)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
