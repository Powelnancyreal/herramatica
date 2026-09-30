'use client'

import { useState } from 'react'
import UnitConverter from '@/components/UnitConverter'
import { formatNumber, NumberInput } from '@/components/calc-ui'

const M_POR_PIE = 0.3048

const VARIANTES = [
  {
    id: 'pie',
    label: 'Pie internacional',
    ida: (p) => p * M_POR_PIE,
    vuelta: (m) => m / M_POR_PIE,
    nota: '1 pie = 0.3048 m exactos = 12 pulgadas. Para convertir de cabeza: pies × 0.3 da una buena aproximación.',
  },
]

export default function PiesAMetros() {
  const [pies, setPies] = useState('5')
  const [pulgadas, setPulgadas] = useState('9')
  const total = (parseFloat(pies) || 0) * M_POR_PIE + (parseFloat(pulgadas) || 0) * 0.0254
  return (
    <UnitConverter
      desde={{ nombre: 'Pies', simbolo: 'ft' }}
      hacia={{ nombre: 'Metros', simbolo: 'm' }}
      variantes={VARIANTES}
      tabla={[1, 3, 5, 6, 10, 20, 33, 100, 1000, 30000]}
      inicial="10"
      extra={(res, invertido, entrada) => {
        if (!invertido) return `${formatNumber(res * 100, 1)} cm`
        const totalPulg = entrada / 0.0254
        return `${Math.floor(totalPulg / 12)} pies y ${formatNumber(totalPulg % 12, 1)} pulgadas`
      }}
    >
      <div className="rounded-xl border border-gray-200 p-4 space-y-3">
        <p className="font-semibold text-gray-900 text-sm">Estatura en pies y pulgadas a metros</p>
        <div className="grid grid-cols-2 gap-3 max-w-sm">
          <NumberInput value={pies} onChange={setPies} min="0" suffix="ft" />
          <NumberInput value={pulgadas} onChange={setPulgadas} min="0" max="11.99" step="0.5" suffix="in" />
        </div>
        <p className="text-sm">
          {pies || 0}′ {pulgadas || 0}″ = <strong>{formatNumber(total, 2)} m</strong> ({formatNumber(total * 100, 1)} cm)
        </p>
      </div>
    </UnitConverter>
  )
}
