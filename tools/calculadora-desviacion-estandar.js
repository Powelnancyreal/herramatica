'use client'

import { useMemo, useState } from 'react'
import { estadisticas, parseNumeros } from '@/lib/calc/mates'
import { formatNumber, inputClass, Note, ResultBox, Row, Rows, Tabs } from '@/components/calc-ui'

const TIPOS = [
  { id: 'muestra', label: 'Muestra (n − 1)' },
  { id: 'poblacion', label: 'Población (N)' },
]

export default function CalculadoraDesviacionEstandar() {
  const [texto, setTexto] = useState('2, 4, 4, 4, 5, 5, 7, 9')
  const [tipo, setTipo] = useState('muestra')

  const { numeros, invalidos } = useMemo(() => parseNumeros(texto), [texto])
  const e = useMemo(() => estadisticas(numeros), [numeros])
  const esMuestra = tipo === 'muestra'
  const desv = e ? (esMuestra ? e.desvMuestra : e.desvPob) : null
  const varianza = e ? (esMuestra ? e.varMuestra : e.varPob) : null

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Datos</label>
        <textarea value={texto} onChange={(ev) => setTexto(ev.target.value)} rows={4} className={inputClass} placeholder="Separa los datos con comas, espacios o saltos de línea" />
        {invalidos.length > 0 && <p className="text-sm text-amber-700 mt-1">Se ignoraron: {invalidos.slice(0, 5).join(', ')}</p>}
      </div>
      <Tabs tabs={TIPOS} value={tipo} onChange={setTipo} />

      {e && esMuestra && e.n < 2 && <p className="text-sm text-red-600">Para la desviación de una muestra se necesitan al menos 2 datos.</p>}
      {e && desv !== null && (
        <ResultBox label={`Desviación estándar ${esMuestra ? 'muestral (s)' : 'poblacional (σ)'}`} value={formatNumber(desv, 6)}>
          <Rows>
            <Row label="Número de datos" value={e.n} />
            <Row label="Media (x̄)" value={formatNumber(e.media, 6)} />
            <Row label="Suma de cuadrados Σ(x − x̄)²" value={formatNumber(e.sumaCuadrados, 6)} />
            <Row label={`Varianza ${esMuestra ? '(s²)' : '(σ²)'}`} value={formatNumber(varianza, 6)} bold />
            <Row label="Desviación de la otra fórmula" value={formatNumber(esMuestra ? e.desvPob : e.desvMuestra ?? 0, 6)} />
            <Row label="Coeficiente de variación" value={e.media !== 0 ? `${formatNumber((desv / Math.abs(e.media)) * 100, 2)}%` : '—'} />
            <Row label="Rango típico (x̄ ± 1 desviación)" value={`${formatNumber(e.media - desv, 4)} a ${formatNumber(e.media + desv, 4)}`} />
          </Rows>
          {e.n <= 30 && (
            <div className="overflow-x-auto bg-white rounded-lg border border-blue-100">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-3 py-2">x</th>
                    <th className="text-right px-3 py-2">x − x̄</th>
                    <th className="text-right px-3 py-2">(x − x̄)²</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {numeros.map((x, i) => (
                    <tr key={i}>
                      <td className="px-3 py-1">{formatNumber(x, 4)}</td>
                      <td className="px-3 py-1 text-right">{formatNumber(x - e.media, 4)}</td>
                      <td className="px-3 py-1 text-right">{formatNumber((x - e.media) ** 2, 4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Note>
            {esMuestra
              ? `s = √(Σ(x − x̄)² ÷ (n − 1)) = √(${formatNumber(e.sumaCuadrados, 4)} ÷ ${e.n - 1}) = ${formatNumber(desv, 6)}. Usa la muestral cuando tus datos son solo una parte del grupo que quieres describir.`
              : `σ = √(Σ(x − μ)² ÷ N) = √(${formatNumber(e.sumaCuadrados, 4)} ÷ ${e.n}) = ${formatNumber(desv, 6)}. Usa la poblacional cuando tienes los datos de todo el grupo.`}
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
