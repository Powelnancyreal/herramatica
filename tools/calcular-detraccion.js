'use client'

import { useMemo, useState } from 'react'

function formatMoney(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return n.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalcularDetraccion() {
  const [precioVenta, setPrecioVenta] = useState('')
  const [porcentaje, setPorcentaje] = useState('12')

  const resultado = useMemo(() => {
    const v = parseFloat(precioVenta)
    const p = parseFloat(porcentaje)
    if (isNaN(v) || v <= 0 || isNaN(p) || p < 0) return null
    const monto = v * (p / 100)
    return { monto, neto: v - monto }
  }, [precioVenta, porcentaje])

  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Precio de venta (incluye IGV)</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">S/</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            value={precioVenta}
            onChange={(e) => setPrecioVenta(e.target.value)}
            placeholder="Ej: 1000"
            className={`${inputClass} pl-9`}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Porcentaje de detracción de tu categoría</label>
        <input
          type="number"
          inputMode="decimal"
          min="0"
          max="100"
          value={porcentaje}
          onChange={(e) => setPorcentaje(e.target.value)}
          placeholder="Ej: 12"
          className={inputClass}
        />
        <p className="text-xs text-gray-500 mt-1.5">
          El porcentaje varía según el tipo de bien o servicio (4%, 10%, 12%, entre otros). Consulta el anexo
          vigente de SUNAT para saber el porcentaje exacto de tu categoría.
        </p>
      </div>

      {resultado && (
        <div className="space-y-3">
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Monto a detraer</p>
            <p className="text-4xl font-bold text-blue-700">S/ {formatMoney(resultado.monto)}</p>
          </div>
          <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 text-center">
            <p className="text-xs text-gray-500">Monto que recibe el proveedor (después de la detracción)</p>
            <p className="font-semibold text-gray-900">S/ {formatMoney(resultado.neto)}</p>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500">
        ⚠️ Esta calculadora no fija el porcentaje de detracción, ya que varía según el bien o servicio y SUNAT
        actualiza periódicamente el listado de categorías. Introduce el porcentaje que corresponda a tu operación
        según el anexo vigente.
      </p>
    </div>
  )
}
