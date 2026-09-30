'use client'

import { useEffect, useMemo, useState } from 'react'
import { formatNumber, NumberInput, ResultBox, Row, Rows, secondaryButtonClass } from '@/components/calc-ui'

const API = 'https://api.frankfurter.dev/v1'
const TABLA = [1, 5, 10, 20, 50, 100, 200, 500, 1000, 5000]

function haceDias(n) {
  const d = new Date(Date.now() - n * 86400000)
  return d.toISOString().slice(0, 10)
}

export default function DolarAPesoMexicano() {
  const [tipo, setTipo] = useState(null)
  const [fecha, setFecha] = useState('')
  const [historial, setHistorial] = useState([])
  const [estado, setEstado] = useState('cargando')
  const [manual, setManual] = useState('')
  const [monto, setMonto] = useState('100')
  const [aPesos, setAPesos] = useState(true)
  const [margen, setMargen] = useState('0')

  useEffect(() => {
    let cancelado = false
    Promise.all([
      fetch(`${API}/latest?base=USD&symbols=MXN`).then((r) => (r.ok ? r.json() : Promise.reject())),
      fetch(`${API}/${haceDias(35)}..?base=USD&symbols=MXN`).then((r) => (r.ok ? r.json() : null)).catch(() => null),
    ])
      .then(([hoy, serie]) => {
        if (cancelado) return
        setTipo(hoy.rates.MXN)
        setFecha(hoy.date)
        if (serie?.rates) setHistorial(Object.entries(serie.rates).map(([d, v]) => ({ d, v: v.MXN })))
        setEstado('listo')
      })
      .catch(() => !cancelado && setEstado('error'))
    return () => {
      cancelado = true
    }
  }, [])

  const tasa = parseFloat(manual) > 0 ? parseFloat(manual) : tipo
  const m = parseFloat(margen) || 0
  const resultado = useMemo(() => {
    const v = parseFloat(monto)
    if (!tasa || isNaN(v)) return null
    // Una casa de cambio vende dólares más caros y los compra más baratos que el tipo de referencia.
    return aPesos ? v * tasa * (1 - m / 100) : v / (tasa * (1 + m / 100))
  }, [monto, tasa, aPesos, m])

  const stats = useMemo(() => {
    if (historial.length < 2) return null
    const vals = historial.map((h) => h.v)
    const min = Math.min(...vals)
    const max = Math.max(...vals)
    const puntos = vals.map((v, i) => `${(i / (vals.length - 1)) * 300},${60 - ((v - min) / (max - min || 1)) * 55 - 2.5}`).join(' ')
    return { min, max, primero: vals[0], ultimo: vals[vals.length - 1], puntos, desde: historial[0].d }
  }, [historial])

  return (
    <div className="space-y-5">
      {estado === 'error' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
          No se pudo cargar el tipo de cambio. Escribe abajo el tipo de cambio que quieras usar.
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{aPesos ? 'Dólares (USD)' : 'Pesos mexicanos (MXN)'}</label>
          <div className="flex gap-2">
            <NumberInput value={monto} onChange={setMonto} min="0" prefix="$" />
            <button type="button" onClick={() => setAPesos((v) => !v)} className={`${secondaryButtonClass} py-2.5`} aria-label="Invertir conversión">
              ⇄
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de cambio personalizado (opcional)</label>
          <NumberInput value={manual} onChange={setManual} min="0" step="0.0001" placeholder={tipo ? tipo.toFixed(4) : 'Ej: 18.50'} suffix="MXN" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Margen de la casa de cambio o banco</label>
          <NumberInput value={margen} onChange={setMargen} min="0" max="20" step="0.1" suffix="%" />
        </div>
      </div>

      {estado === 'cargando' && !manual && <p className="text-sm text-gray-500">Cargando tipo de cambio…</p>}

      {resultado !== null && (
        <ResultBox label="Equivale a" value={aPesos ? `$${formatNumber(resultado, 2)} MXN` : `US$${formatNumber(resultado, 2)}`}>
          <Rows>
            <Row label="1 dólar" value={`$${formatNumber(tasa, 4)} pesos`} />
            <Row label="1 peso" value={`US$${formatNumber(1 / tasa, 5)}`} />
            {fecha && !manual && <Row label="Tipo de cambio de referencia del" value={fecha} />}
          </Rows>
          {m > 0 && (
            <p className="text-xs text-gray-600">
              Con un margen del {formatNumber(m, 1)}%: {aPesos ? 'te compran' : 'te venden'} cada dólar a ${formatNumber(aPesos ? tasa * (1 - m / 100) : tasa * (1 + m / 100), 4)}.
            </p>
          )}
        </ResultBox>
      )}

      {stats && (
        <div className="rounded-xl border border-gray-200 p-4 space-y-2">
          <p className="font-semibold text-gray-900 text-sm">Dólar en pesos durante el último mes</p>
          <svg viewBox="0 0 300 60" className="w-full h-24" preserveAspectRatio="none" role="img" aria-label="Gráfica del tipo de cambio del último mes">
            <polyline points={stats.puntos} fill="none" stroke="#2563eb" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-600">
            <span>Mínimo: <strong>${formatNumber(stats.min, 4)}</strong></span>
            <span>Máximo: <strong>${formatNumber(stats.max, 4)}</strong></span>
            <span>Desde {stats.desde}: <strong>${formatNumber(stats.primero, 4)}</strong></span>
            <span>
              Variación: <strong>{formatNumber(((stats.ultimo / stats.primero) - 1) * 100, 2)}%</strong>
            </span>
          </div>
        </div>
      )}

      {tasa && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-3 py-2">Dólares</th>
                <th className="text-left px-3 py-2">Pesos</th>
                <th className="text-left px-3 py-2">Pesos</th>
                <th className="text-left px-3 py-2">Dólares</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {TABLA.map((n) => (
                <tr key={n}>
                  <td className="px-3 py-1.5">US${formatNumber(n, 0)}</td>
                  <td className="px-3 py-1.5 font-medium">${formatNumber(n * tasa, 2)}</td>
                  <td className="px-3 py-1.5">${formatNumber(n * 10, 0)}</td>
                  <td className="px-3 py-1.5 font-medium">US${formatNumber((n * 10) / tasa, 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-gray-500">
        Fuente: tipos de referencia del Banco Central Europeo vía Frankfurter, actualizados cada día hábil. Pueden diferir unos
        centavos del tipo de cambio FIX que publica Banxico.
      </p>
    </div>
  )
}
