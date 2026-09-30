'use client'

import UnitConverter from '@/components/UnitConverter'

const G_POR_OZ = 28.349523125

const VARIANTES = [
  {
    id: 'peso',
    label: 'Onza de peso (avoirdupois, oz)',
    ida: (oz) => oz * G_POR_OZ,
    vuelta: (g) => g / G_POR_OZ,
    nota: '1 onza = 28.349523125 g exactos. Es la onza de alimentos, cartas y paquetería.',
  },
  {
    id: 'troy',
    label: 'Onza troy (oro, plata y metales preciosos)',
    ida: (oz) => oz * 31.1034768,
    vuelta: (g) => g / 31.1034768,
    nota: '1 onza troy = 31.1034768 g. Se usa para cotizar oro, plata y monedas de inversión.',
  },
  {
    id: 'fl',
    label: 'Onza líquida de EE. UU. (fl oz, a mililitros)',
    ida: (oz) => oz * 29.5735295625,
    vuelta: (ml) => ml / 29.5735295625,
    hacia: { nombre: 'Mililitros', simbolo: 'ml' },
    nota: '1 onza líquida estadounidense = 29.5735 ml. Mide volumen, no peso; en agua equivale casi a 29.57 g.',
  },
]

export default function OnzasAGramos() {
  return (
    <UnitConverter
      desde={{ nombre: 'Onzas', simbolo: 'oz' }}
      hacia={{ nombre: 'Gramos', simbolo: 'g' }}
      variantes={VARIANTES}
      tabla={[0.5, 1, 2, 4, 6, 8, 12, 16, 32]}
      decimales={2}
      inicial="8"
    />
  )
}
