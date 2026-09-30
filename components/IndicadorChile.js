'use client'

import { useState } from 'react'
import { AvisoIndicadores, useIndicadoresChile } from '@/components/useIndicadoresChile'
import { clp } from '@/components/calc-ui-eur'
import { formatNumber, NumberInput, ResultBox, secondaryButtonClass } from '@/components/calc-ui'

// Conversor entre una unidad chilena (UF o UTM) y pesos, con el valor del día.
export default function IndicadorChile({ clave, sigla, nombre, tabla, extra }) {
  const ind = useIndicadoresChile()
  const [manual, setManual] = useState('')
  const [valor, setValor] = useState('1')
  const [aPesos, setAPesos] = useState(true)
  const unidad = parseFloat(manual) > 0 ? parseFloat(manual) : ind[clave]
  const v = parseFloat(valor)
  const resultado = unidad && !isNaN(v) ? (aPesos ? v * unidad : v / unidad) : null

  return (
    <div className="space-y-5">
      <AvisoIndicadores datos={ind} que={`la ${sigla}`} />
      {ind[clave] && (
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-center">
          <p className="text-sm text-gray-600">Valor de la {sigla} {ind.fecha ? `al ${new Date(ind.fecha).toLocaleDateString('es-CL')}` : 'hoy'}</p>
          <p className="text-3xl font-bold text-blue-700">{formatNumber(ind[clave], 2)} pesos</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{aPesos ? `Cantidad en ${sigla}` : 'Cantidad en pesos chilenos'}</label>
          <div className="flex gap-2">
            <NumberInput value={valor} onChange={setValor} min="0" step="any" suffix={aPesos ? sigla : 'CLP'} />
            <button type="button" onClick={() => setAPesos((x) => !x)} className={`${secondaryButtonClass} py-2.5`} aria-label="Invertir conversión">⇄</button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Valor de la {sigla} personalizado (opcional)</label>
          <NumberInput value={manual} onChange={setManual} min="0" step="0.01" placeholder="Para otra fecha" />
        </div>
      </div>
      {resultado !== null && (
        <ResultBox label="Equivale a" value={aPesos ? clp(resultado) : `${formatNumber(resultado, 4)} ${sigla}`}>
          {extra && <p className="text-sm text-gray-700">{extra(unidad)}</p>}
        </ResultBox>
      )}
      {unidad && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200">
            <thead className="bg-gray-50 text-gray-600">
              <tr><th className="text-left px-3 py-2">{nombre}</th><th className="text-right px-3 py-2">Pesos chilenos</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tabla.map((n) => (
                <tr key={n}><td className="px-3 py-1.5">{formatNumber(n, 2)} {sigla}</td><td className="px-3 py-1.5 text-right font-medium">{clp(n * unidad)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-gray-500">Fuente: mindicador.cl, con datos del Banco Central de Chile y del SII.</p>
    </div>
  )
}
