'use client'

import UnitConverter from '@/components/UnitConverter'
import { formatNumber } from '@/components/calc-ui'

const VARIANTES = [
  {
    id: 'terrestre',
    label: 'Milla terrestre (internacional)',
    ida: (mi) => mi * 1.609344,
    vuelta: (km) => km / 1.609344,
    nota: '1 milla = 1.609344 km exactos. Truco: multiplica por 1.6, o usa la serie de Fibonacci (5 mi ≈ 8 km).',
  },
  {
    id: 'nautica',
    label: 'Milla náutica (navegación y aviación)',
    ida: (mn) => mn * 1.852,
    vuelta: (km) => km / 1.852,
    nota: '1 milla náutica = 1.852 km exactos. Un nudo es una milla náutica por hora.',
  },
]

export default function MillasAKilometros() {
  return (
    <UnitConverter
      desde={{ nombre: 'Millas', simbolo: 'mi' }}
      hacia={{ nombre: 'Kilómetros', simbolo: 'km' }}
      variantes={VARIANTES}
      tabla={[1, 3.1, 5, 10, 13.1, 26.2, 50, 65, 100, 500]}
      inicial="10"
      extra={(res, invertido) => (invertido ? '' : `${formatNumber(res * 1000, 0)} metros · a 100 km/h tardarías ${formatNumber((res / 100) * 60, 0)} minutos`)}
    />
  )
}
