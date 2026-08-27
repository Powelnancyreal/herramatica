'use client'

import { useEffect, useMemo, useState } from 'react'

const MONEDAS = {
  MXN: 'Peso mexicano',
  USD: 'Dólar estadounidense',
  EUR: 'Euro',
  GBP: 'Libra esterlina',
  CAD: 'Dólar canadiense',
  JPY: 'Yen japonés',
  BRL: 'Real brasileño',
  CHF: 'Franco suizo',
}

const API_URL = 'https://api.frankfurter.dev/v1/latest?base=USD'

function formatNum(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return n.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function ConvertidorMoneda() {
  const [rates, setRates] = useState(null) // { USD: 1, MXN: x, EUR: y, ... } — value of 1 USD in that currency
  const [fecha, setFecha] = useState('')
  const [status, setStatus] = useState('cargando') // 'cargando' | 'listo' | 'error'

  const [monto, setMonto] = useState('100')
  const [desde, setDesde] = useState('USD')
  const [hasta, setHasta] = useState('MXN')

  useEffect(() => {
    let cancelado = false
    async function cargar() {
      try {
        const res = await fetch(API_URL)
        if (!res.ok) throw new Error('bad response')
        const data = await res.json()
        if (cancelado) return
        setRates({ USD: 1, ...data.rates })
        setFecha(data.date)
        setStatus('listo')
      } catch {
        if (!cancelado) setStatus('error')
      }
    }
    cargar()
    return () => {
      cancelado = true
    }
  }, [])

  const resultado = useMemo(() => {
    if (!rates) return null
    const v = parseFloat(monto)
    if (isNaN(v)) return null
    const enUSD = v / rates[desde]
    return enUSD * rates[hasta]
  }, [rates, monto, desde, hasta])

  const tasaUnitaria = rates ? rates[hasta] / rates[desde] : null

  function swap() {
    setDesde(hasta)
    setHasta(desde)
  }

  return (
    <div className="space-y-5">
      {status === 'error' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
          No se pudieron cargar las tasas de cambio en este momento. Comprueba tu conexión e inténtalo de nuevo.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
        <div>
          <label className={labelClass}>De</label>
          <select value={desde} onChange={(e) => setDesde(e.target.value)} className={inputClass}>
            {Object.entries(MONEDAS).map(([code, name]) => (
              <option key={code} value={code}>
                {code} — {name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={swap}
          className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 mb-0.5"
          title="Invertir"
        >
          ⇄
        </button>

        <div>
          <label className={labelClass}>A</label>
          <select value={hasta} onChange={(e) => setHasta(e.target.value)} className={inputClass}>
            {Object.entries(MONEDAS).map(([code, name]) => (
              <option key={code} value={code}>
                {code} — {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Monto</label>
        <input type="number" inputMode="decimal" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="100" className={inputClass} />
      </div>

      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Resultado</p>
        {status === 'cargando' ? (
          <p className="text-lg text-gray-400">Cargando tasas de cambio…</p>
        ) : (
          <>
            <p className="text-4xl font-bold text-blue-700 break-all">
              {formatNum(resultado)} <span className="text-xl font-semibold">{hasta}</span>
            </p>
            {tasaUnitaria !== null && (
              <p className="text-sm text-gray-500 mt-2">
                1 {desde} = {formatNum(tasaUnitaria)} {hasta}
              </p>
            )}
          </>
        )}
      </div>

      {fecha && (
        <p className="text-xs text-gray-400 text-center">
          Tasas de referencia del {fecha} (Banco Central Europeo, vía frankfurter.dev). Solo para fines informativos.
        </p>
      )}
    </div>
  )
}
