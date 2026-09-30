'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Field, inputClass, NumberInput, secondaryButtonClass } from '@/components/calc-ui'

const MONEDAS_CRIPTO = [
  { id: 'bitcoin', simbolo: 'BTC', nombre: 'Bitcoin' },
  { id: 'ethereum', simbolo: 'ETH', nombre: 'Ethereum' },
  { id: 'tether', simbolo: 'USDT', nombre: 'Tether' },
  { id: 'binancecoin', simbolo: 'BNB', nombre: 'BNB' },
  { id: 'solana', simbolo: 'SOL', nombre: 'Solana' },
  { id: 'ripple', simbolo: 'XRP', nombre: 'XRP' },
  { id: 'usd-coin', simbolo: 'USDC', nombre: 'USD Coin' },
  { id: 'dogecoin', simbolo: 'DOGE', nombre: 'Dogecoin' },
  { id: 'cardano', simbolo: 'ADA', nombre: 'Cardano' },
  { id: 'tron', simbolo: 'TRX', nombre: 'TRON' },
]
const FIAT = [
  { id: 'mxn', nombre: 'Peso mexicano (MXN)' },
  { id: 'usd', nombre: 'Dólar estadounidense (USD)' },
  { id: 'eur', nombre: 'Euro (EUR)' },
  { id: 'ars', nombre: 'Peso argentino (ARS)' },
  { id: 'clp', nombre: 'Peso chileno (CLP)' },
  { id: 'brl', nombre: 'Real brasileño (BRL)' },
]
const API =
  'https://api.coingecko.com/api/v3/simple/price?ids=' +
  MONEDAS_CRIPTO.map((m) => m.id).join(',') +
  '&vs_currencies=' +
  FIAT.map((f) => f.id).join(',') +
  '&include_24hr_change=true&include_last_updated_at=true'

function fmt(n, max = 8) {
  return new Intl.NumberFormat('es-MX', { maximumFractionDigits: n >= 1 ? 2 : max }).format(n)
}

export default function ConversorCriptomonedas() {
  const [precios, setPrecios] = useState(null)
  const [estado, setEstado] = useState('cargando')
  const [cripto, setCripto] = useState('bitcoin')
  const [fiat, setFiat] = useState('mxn')
  const [cantidad, setCantidad] = useState('1')
  const [inverso, setInverso] = useState(false)

  const cargar = useCallback(async () => {
    setEstado('cargando')
    try {
      const res = await fetch(API)
      if (!res.ok) throw new Error(String(res.status))
      setPrecios(await res.json())
      setEstado('ok')
    } catch {
      setEstado('error')
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  const info = precios?.[cripto]
  const precio = info?.[fiat]
  const cambio = info?.[`${fiat}_24h_change`]
  const resultado = useMemo(() => {
    const c = parseFloat(cantidad)
    if (!precio || isNaN(c)) return null
    return inverso ? c / precio : c * precio
  }, [precio, cantidad, inverso])

  const cm = MONEDAS_CRIPTO.find((m) => m.id === cripto)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Criptomoneda">
          <select value={cripto} onChange={(e) => setCripto(e.target.value)} className={inputClass}>
            {MONEDAS_CRIPTO.map((m) => (
              <option key={m.id} value={m.id}>{m.nombre} ({m.simbolo})</option>
            ))}
          </select>
        </Field>
        <Field label="Moneda">
          <select value={fiat} onChange={(e) => setFiat(e.target.value)} className={inputClass}>
            {FIAT.map((f) => (
              <option key={f.id} value={f.id}>{f.nombre}</option>
            ))}
          </select>
        </Field>
        <Field label={`Cantidad en ${inverso ? fiat.toUpperCase() : cm.simbolo}`}>
          <NumberInput value={cantidad} onChange={setCantidad} min="0" />
        </Field>
      </div>
      <button type="button" onClick={() => setInverso((v) => !v)} className={secondaryButtonClass}>
        ⇄ Invertir: {inverso ? `${fiat.toUpperCase()} → ${cm.simbolo}` : `${cm.simbolo} → ${fiat.toUpperCase()}`}
      </button>

      {estado === 'cargando' && <p className="text-sm text-gray-500">Obteniendo precios en tiempo real…</p>}
      {estado === 'error' && (
        <p className="text-sm text-red-600">
          No se pudieron obtener los precios en este momento.{' '}
          <button className="underline" onClick={cargar}>Reintentar</button>
        </p>
      )}
      {estado === 'ok' && resultado !== null && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 space-y-2">
          <p className="text-sm text-gray-600">
            {fmt(parseFloat(cantidad))} {inverso ? fiat.toUpperCase() : cm.simbolo} =
          </p>
          <p className="text-4xl font-bold text-blue-700 break-words">
            {fmt(resultado)} {inverso ? cm.simbolo : fiat.toUpperCase()}
          </p>
          <p className="text-sm text-gray-700">
            1 {cm.simbolo} = {fmt(precio)} {fiat.toUpperCase()}
            {typeof cambio === 'number' && (
              <span className={cambio >= 0 ? 'text-green-700' : 'text-red-600'}>
                {' '}({cambio >= 0 ? '+' : ''}{cambio.toFixed(2)}% en 24 h)
              </span>
            )}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Actualizado: {info.last_updated_at ? new Date(info.last_updated_at * 1000).toLocaleString('es-MX') : '—'} · Fuente: CoinGecko</span>
            <button className="underline" onClick={cargar}>Actualizar</button>
          </div>
        </div>
      )}
      <p className="text-xs text-gray-500">
        Precios de referencia del mercado; tu exchange aplicará su propio precio de compra/venta y comisiones. No es una
        recomendación de inversión.
      </p>
    </div>
  )
}
