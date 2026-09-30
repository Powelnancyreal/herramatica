'use client'

import { useMemo, useState } from 'react'
import { formatNumber, inputClass, NumberInput, ResultBox, secondaryButtonClass } from '@/components/calc-ui'

// Conversor bidireccional entre dos unidades con tabla de equivalencias.
// variantes: [{ id, label, ida: (x) => y, vuelta: (y) => x, nota }] — la primera es la predeterminada.
export default function UnitConverter({ desde: desdeBase, hacia: haciaBase, variantes, tabla, decimales = 3, inicial = '1', extra, children }) {
  const [varianteId, setVarianteId] = useState(variantes[0].id)
  const [invertido, setInvertido] = useState(false)
  const [valor, setValor] = useState(inicial)
  const v = variantes.find((x) => x.id === varianteId)
  const desde = v.desde || desdeBase
  const hacia = v.hacia || haciaBase
  const origen = invertido ? hacia : desde
  const destino = invertido ? desde : hacia
  const convertir = invertido ? v.vuelta : v.ida

  const resultado = useMemo(() => {
    const n = parseFloat(valor)
    if (isNaN(n)) return null
    return convertir(n)
  }, [valor, convertir])

  return (
    <div className="space-y-4">
      {variantes.length > 1 && (
        <select value={varianteId} onChange={(e) => setVarianteId(e.target.value)} className={`${inputClass} sm:max-w-md`}>
          {variantes.map((x) => (
            <option key={x.id} value={x.id}>{x.label}</option>
          ))}
        </select>
      )}
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{origen.nombre}</label>
          <NumberInput value={valor} onChange={setValor} suffix={origen.simbolo} step="any" />
        </div>
        <button type="button" onClick={() => setInvertido((x) => !x)} className={`${secondaryButtonClass} py-2.5`} aria-label="Invertir conversión">
          ⇄
        </button>
      </div>
      {resultado !== null && (
        <ResultBox label="Equivale a" value={`${formatNumber(resultado, decimales)} ${destino.simbolo}`}>
          {extra && extra(resultado, invertido, parseFloat(valor)) && <p className="text-sm text-gray-700">{extra(resultado, invertido, parseFloat(valor))}</p>}
          <p className="text-xs text-gray-600">{v.nota}</p>
        </ResultBox>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-3 py-2">{desde.nombre}</th>
              <th className="text-left px-3 py-2">{hacia.nombre}</th>
              <th className="text-left px-3 py-2">{hacia.nombre}</th>
              <th className="text-left px-3 py-2">{desde.nombre}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tabla.map((n) => (
              <tr key={n}>
                <td className="px-3 py-1.5">{formatNumber(n, 2)} {desde.simbolo}</td>
                <td className="px-3 py-1.5 font-medium">{formatNumber(v.ida(n), 2)} {hacia.simbolo}</td>
                <td className="px-3 py-1.5">{formatNumber(n, 2)} {hacia.simbolo}</td>
                <td className="px-3 py-1.5 font-medium">{formatNumber(v.vuelta(n), 2)} {desde.simbolo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {children}
    </div>
  )
}
