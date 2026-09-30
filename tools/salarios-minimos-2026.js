'use client'

import { useMemo, useState } from 'react'
import { SALARIOS_MINIMOS, UMA_DIARIA_2026 } from '@/lib/calc/mexico-laboral'
import { Field, formatMXN, formatNumber, inputClass, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

const ACTUAL = SALARIOS_MINIMOS[0]
const ANTERIOR = SALARIOS_MINIMOS[1]

export default function SalariosMinimos2026() {
  const [zona, setZona] = useState('general')
  const [sueldo, setSueldo] = useState('')
  const [periodo, setPeriodo] = useState('mensual')

  const diario = ACTUAL[zona]
  const comparacion = useMemo(() => {
    const v = parseFloat(sueldo)
    if (!(v > 0)) return null
    const dias = { diario: 1, semanal: 7, quincenal: 15, mensual: 30.4 }[periodo]
    const sueldoDiario = v / dias
    return { sueldoDiario, veces: sueldoDiario / diario, cumple: sueldoDiario >= diario - 0.005 }
  }, [sueldo, periodo, diario])

  return (
    <div className="space-y-5">
      <Field label="Zona salarial">
        <select value={zona} onChange={(e) => setZona(e.target.value)} className={inputClass}>
          <option value="general">Resto del país (zona general)</option>
          <option value="frontera">Zona Libre de la Frontera Norte</option>
        </select>
      </Field>

      <ResultBox label={`Salario mínimo diario 2026 · ${zona === 'general' ? 'zona general' : 'frontera norte'}`} value={formatMXN(diario)}>
        <Rows>
          <Row label="Semanal (7 días)" value={formatMXN(diario * 7)} />
          <Row label="Quincenal (15 días)" value={formatMXN(diario * 15)} />
          <Row label="Mensual (30.4 días)" value={formatMXN(diario * 30.4)} bold />
          <Row label="Anual (365 días)" value={formatMXN(diario * 365)} />
          <Row label="Aumento frente a 2025" value={`${formatNumber((diario / ANTERIOR[zona] - 1) * 100, 1)}%`} />
          <Row label="UMA diaria 2026 (no es salario)" value={formatMXN(UMA_DIARIA_2026)} />
        </Rows>
      </ResultBox>

      <div className="rounded-xl border border-gray-200 p-4 space-y-3">
        <p className="font-semibold text-gray-900">¿Tu sueldo cumple con el mínimo?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <NumberInput value={sueldo} onChange={setSueldo} prefix="$" min="0" placeholder="Tu sueldo" />
          <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} className={inputClass}>
            <option value="diario">Diario</option>
            <option value="semanal">Semanal</option>
            <option value="quincenal">Quincenal</option>
            <option value="mensual">Mensual</option>
          </select>
        </div>
        {comparacion && (
          <p className={`text-sm font-medium ${comparacion.cumple ? 'text-green-700' : 'text-red-700'}`}>
            {comparacion.cumple
              ? `Sí cumple: tu sueldo diario es de ${formatMXN(comparacion.sueldoDiario)}, equivalente a ${formatNumber(comparacion.veces, 2)} salarios mínimos.`
              : `No cumple: tu sueldo diario es de ${formatMXN(comparacion.sueldoDiario)}, ${formatMXN(diario - comparacion.sueldoDiario)} por debajo del mínimo de tu zona.`}
          </p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-3 py-2">Año</th>
              <th className="text-right px-3 py-2">Zona general</th>
              <th className="text-right px-3 py-2">Frontera norte</th>
              <th className="text-right px-3 py-2">Aumento general</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {SALARIOS_MINIMOS.map((s, i) => {
              const prev = SALARIOS_MINIMOS[i + 1]
              return (
                <tr key={s.anio} className={i === 0 ? 'bg-blue-50 font-semibold' : ''}>
                  <td className="px-3 py-1.5">{s.anio}</td>
                  <td className="px-3 py-1.5 text-right">{formatMXN(s.general)}</td>
                  <td className="px-3 py-1.5 text-right">{formatMXN(s.frontera)}</td>
                  <td className="px-3 py-1.5 text-right">{prev ? `${formatNumber((s.general / prev.general - 1) * 100, 1)}%` : '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <Note>
        Cifras diarias fijadas por la CONASAMI y publicadas en el Diario Oficial de la Federación. El salario mensual se
        calcula con 30.4 días, el promedio que usan el IMSS y el SAT.
      </Note>
    </div>
  )
}
