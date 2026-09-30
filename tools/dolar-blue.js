'use client'

import { useEffect, useMemo, useState } from 'react'
import { ars } from '@/components/calc-ui-eur'
import { formatNumber, inputClass, NumberInput, ResultBox, secondaryButtonClass } from '@/components/calc-ui'

const API = 'https://dolarapi.com/v1/dolares'
const NOMBRES = { oficial: 'Oficial', blue: 'Blue', bolsa: 'MEP (bolsa)', contadoconliqui: 'Contado con liqui', mayorista: 'Mayorista', cripto: 'Cripto', tarjeta: 'Tarjeta' }

export default function DolarBlue() {
  const [cotizaciones, setCotizaciones] = useState([])
  const [estado, setEstado] = useState('cargando')
  const [casa, setCasa] = useState('blue')
  const [monto, setMonto] = useState('100')
  const [aPesos, setAPesos] = useState(true)
  const [manual, setManual] = useState('')

  useEffect(() => {
    let vigente = true
    fetch(API)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (!vigente) return
        setCotizaciones(d.filter((x) => NOMBRES[x.casa]))
        setEstado('listo')
      })
      .catch(() => vigente && setEstado('error'))
    return () => {
      vigente = false
    }
  }, [])

  const c = cotizaciones.find((x) => x.casa === casa)
  const precio = parseFloat(manual) > 0 ? { compra: parseFloat(manual), venta: parseFloat(manual) } : c
  const resultado = useMemo(() => {
    const v = parseFloat(monto)
    if (!precio || isNaN(v)) return null
    // Si vendés dólares te pagan el precio de compra; si comprás, pagás el de venta.
    return aPesos ? v * precio.compra : v / precio.venta
  }, [monto, precio, aPesos])

  const oficial = cotizaciones.find((x) => x.casa === 'oficial')
  const blue = cotizaciones.find((x) => x.casa === 'blue')

  return (
    <div className="space-y-5">
      {estado === 'error' && <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">No se pudo cargar la cotización. Escribí el valor que quieras usar en «Cotización personalizada».</div>}
      {estado === 'cargando' && <p className="text-sm text-gray-500">Cargando cotizaciones…</p>}

      {cotizaciones.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {cotizaciones.map((x) => (
            <button key={x.casa} type="button" onClick={() => setCasa(x.casa)} className={`rounded-xl border-2 p-3 text-left ${casa === x.casa ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <p className="text-xs font-semibold text-gray-500 uppercase">{NOMBRES[x.casa]}</p>
              <p className="text-sm">Compra <strong>{x.compra ? ars(x.compra) : '—'}</strong></p>
              <p className="text-sm">Venta <strong>{ars(x.venta)}</strong></p>
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{aPesos ? 'Dólares a vender (USD)' : 'Pesos para comprar dólares (ARS)'}</label>
          <div className="flex gap-2">
            <NumberInput value={monto} onChange={setMonto} min="0" prefix="$" />
            <button type="button" onClick={() => setAPesos((x) => !x)} className={`${secondaryButtonClass} py-2.5`} aria-label="Invertir conversión">⇄</button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Cotización personalizada (opcional)</label>
          <input type="number" value={manual} onChange={(e) => setManual(e.target.value)} className={inputClass} placeholder="Ej: 1500" />
        </div>
      </div>

      {resultado !== null && (
        <ResultBox label={aPesos ? `Recibís (dólar ${NOMBRES[casa] || 'personalizado'}, precio de compra)` : `Podés comprar (dólar ${NOMBRES[casa] || 'personalizado'}, precio de venta)`} value={aPesos ? ars(resultado) : `US$ ${formatNumber(resultado, 2)}`}>
          {blue && oficial && (
            <p className="text-sm text-gray-700">Brecha entre el blue y el oficial: <strong>{formatNumber((blue.venta / oficial.venta - 1) * 100, 1)}%</strong> (precios de venta).</p>
          )}
          {c?.fechaActualizacion && !manual && <p className="text-xs text-gray-600">Actualizado: {new Date(c.fechaActualizacion).toLocaleString('es-AR')}. Fuente: DolarApi.</p>}
        </ResultBox>
      )}
      <p className="text-xs text-gray-500">Las cotizaciones del dólar blue son informativas y surgen del mercado informal; pueden variar según la zona y el momento.</p>
    </div>
  )
}
