'use client'

import { useEffect, useMemo, useState } from 'react'

// Monedas con tipo de referencia del Banco Central Europeo (vía frankfurter.dev).
const MONEDAS_BCE = {
  MXN: 'Peso mexicano',
  USD: 'Dólar estadounidense',
  EUR: 'Euro',
  GBP: 'Libra esterlina',
  CAD: 'Dólar canadiense',
  JPY: 'Yen japonés',
  BRL: 'Real brasileño',
  CHF: 'Franco suizo',
}

// Monedas que el BCE no publica: se toman de ExchangeRate-API (acceso abierto, pide atribución).
const MONEDAS_LATAM = {
  COP: 'Peso colombiano',
  PEN: 'Sol peruano',
  ARS: 'Peso argentino',
  CLP: 'Peso chileno',
  UYU: 'Peso uruguayo',
  BOB: 'Boliviano',
  PYG: 'Guaraní paraguayo',
  DOP: 'Peso dominicano',
  GTQ: 'Quetzal guatemalteco',
  CRC: 'Colón costarricense',
  HNL: 'Lempira hondureño',
  NIO: 'Córdoba nicaragüense',
}

const API_BCE = 'https://api.frankfurter.dev/v1/latest?base=USD'
const API_LATAM = 'https://open.er-api.com/v6/latest/USD'

// Punto decimal y coma de miles, como en el resto de calculadoras generales del sitio.
function formatNum(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

async function leer(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('bad response')
  return res.json()
}

export default function ConvertidorMoneda() {
  const [rates, setRates] = useState(null) // valor de 1 USD en cada moneda
  const [fuentes, setFuentes] = useState({ bce: '', latam: '' })
  const [status, setStatus] = useState('cargando') // 'cargando' | 'listo' | 'error'

  const [monto, setMonto] = useState('100')
  const [desde, setDesde] = useState('USD')
  const [hasta, setHasta] = useState('MXN')

  useEffect(() => {
    let cancelado = false
    async function cargar() {
      const [bce, latam] = await Promise.allSettled([leer(API_BCE), leer(API_LATAM)])
      if (cancelado) return
      const nuevas = { USD: 1 }
      const info = { bce: '', latam: '' }
      if (latam.status === 'fulfilled' && latam.value.result === 'success') {
        // Si falla el BCE, ExchangeRate-API también cubre sus monedas.
        const codigos = bce.status === 'fulfilled' ? Object.keys(MONEDAS_LATAM) : [...Object.keys(MONEDAS_LATAM), ...Object.keys(MONEDAS_BCE)]
        for (const c of codigos) if (latam.value.rates[c]) nuevas[c] = latam.value.rates[c]
        info.latam = new Date(latam.value.time_last_update_unix * 1000).toISOString().slice(0, 10)
      }
      if (bce.status === 'fulfilled') {
        Object.assign(nuevas, bce.value.rates, { USD: 1 })
        info.bce = bce.value.date
      }
      if (Object.keys(nuevas).length <= 1) return setStatus('error')
      setRates(nuevas)
      setFuentes(info)
      setStatus('listo')
    }
    cargar()
    return () => {
      cancelado = true
    }
  }, [])

  const disponibles = (codigo) => !rates || rates[codigo] !== undefined

  const resultado = useMemo(() => {
    if (!rates || !rates[desde] || !rates[hasta]) return null
    const v = parseFloat(monto)
    if (isNaN(v)) return null
    return (v / rates[desde]) * rates[hasta]
  }, [rates, monto, desde, hasta])

  const tasaUnitaria = rates && rates[desde] && rates[hasta] ? rates[hasta] / rates[desde] : null

  function swap() {
    setDesde(hasta)
    setHasta(desde)
  }

  const opciones = (
    <>
      <optgroup label="Principales monedas">
        {Object.entries(MONEDAS_BCE).map(([code, name]) => (
          <option key={code} value={code} disabled={!disponibles(code)}>
            {code} — {name}
          </option>
        ))}
      </optgroup>
      <optgroup label="Latinoamérica">
        {Object.entries(MONEDAS_LATAM).map(([code, name]) => (
          <option key={code} value={code} disabled={!disponibles(code)}>
            {code} — {name}
          </option>
        ))}
      </optgroup>
    </>
  )

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
            {opciones}
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
            {opciones}
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

      {status === 'listo' && (
        <p className="text-xs text-gray-400 text-center">
          {fuentes.bce && <>Tasas de referencia del Banco Central Europeo del {fuentes.bce} (vía frankfurter.dev). </>}
          {fuentes.latam && (
            <>
              {fuentes.bce ? 'Monedas latinoamericanas' : 'Tasas'} del {fuentes.latam}:{' '}
              <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer" className="underline">
                Rates By Exchange Rate API
              </a>
              .{' '}
            </>
          )}
          Solo para fines informativos.
        </p>
      )}
    </div>
  )
}
