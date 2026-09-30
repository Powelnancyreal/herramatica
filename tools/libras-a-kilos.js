'use client'

import UnitConverter from '@/components/UnitConverter'
import { formatNumber } from '@/components/calc-ui'

const KG_POR_LB = 0.45359237

const VARIANTES = [
  {
    id: 'lb',
    label: 'Libra internacional (avoirdupois)',
    ida: (lb) => lb * KG_POR_LB,
    vuelta: (kg) => kg / KG_POR_LB,
    nota: '1 libra = 0.45359237 kg exactos (acuerdo internacional de 1959). Fórmula rápida: kg ≈ lb × 0.4536.',
  },
]

export default function LibrasAKilos() {
  return (
    <UnitConverter
      desde={{ nombre: 'Libras', simbolo: 'lb' }}
      hacia={{ nombre: 'Kilogramos', simbolo: 'kg' }}
      variantes={VARIANTES}
      tabla={[1, 5, 10, 50, 100, 120, 150, 180, 200, 250]}
      inicial="150"
      extra={(res, invertido, entrada) =>
        invertido ? `${formatNumber(Math.floor(res), 0)} lb y ${formatNumber((res % 1) * 16, 1)} oz` : `${formatNumber(res * 1000, 0)} gramos · ${formatNumber(entrada * 16, 0)} onzas`
      }
    />
  )
}
