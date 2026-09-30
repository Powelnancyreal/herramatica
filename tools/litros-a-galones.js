'use client'

import UnitConverter from '@/components/UnitConverter'
import { formatNumber } from '@/components/calc-ui'

const VARIANTES = [
  {
    id: 'us',
    label: 'Galón estadounidense (3.785 L)',
    ida: (l) => l / 3.785411784,
    vuelta: (g) => g * 3.785411784,
    nota: '1 galón de EE. UU. = 3.785411784 litros exactos. Es el de la gasolina en Estados Unidos y el de las cubetas de pintura.',
  },
  {
    id: 'uk',
    label: 'Galón imperial británico (4.546 L)',
    ida: (l) => l / 4.54609,
    vuelta: (g) => g * 4.54609,
    nota: '1 galón imperial = 4.54609 litros exactos. Se usa en Reino Unido y en algunos países del Caribe.',
  },
]

export default function LitrosAGalones() {
  return (
    <UnitConverter
      desde={{ nombre: 'Litros', simbolo: 'L' }}
      hacia={{ nombre: 'Galones', simbolo: 'gal' }}
      variantes={VARIANTES}
      tabla={[1, 3.785, 4, 5, 10, 19, 20, 40, 50, 100]}
      inicial="20"
      extra={(res, invertido, entrada) => (invertido ? `${formatNumber(res * 1000, 0)} mililitros` : `${formatNumber(entrada * 1000, 0)} ml · ${formatNumber(entrada * 33.814, 1)} onzas líquidas de EE. UU.`)}
    />
  )
}
