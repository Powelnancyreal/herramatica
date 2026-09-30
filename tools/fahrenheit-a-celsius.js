'use client'

import UnitConverter from '@/components/UnitConverter'

const VARIANTES = [
  {
    id: 'fc',
    label: 'Fahrenheit a Celsius',
    ida: (f) => ((f - 32) * 5) / 9,
    vuelta: (c) => (c * 9) / 5 + 32,
    nota: 'Fórmula: °C = (°F − 32) × 5/9. Truco mental: resta 30 y divide entre 2 (aproximado).',
  },
]

function referencia(c) {
  if (c <= 0) return 'Punto de congelación del agua o menos.'
  if (c < 35) return 'Temperatura ambiente o de clima.'
  if (c < 37.5) return 'Temperatura corporal normal (entre 36 y 37.4 °C).'
  if (c < 42) return 'Rango de fiebre en una persona (38 °C o más).'
  if (c < 100) return 'Agua caliente, sin llegar a hervir.'
  if (c < 150) return 'Agua hirviendo (100 °C a nivel del mar) o calor bajo de horno.'
  return 'Temperatura de horneado o cocina.'
}

export default function FahrenheitACelsius() {
  return (
    <UnitConverter
      desde={{ nombre: 'Fahrenheit', simbolo: '°F' }}
      hacia={{ nombre: 'Celsius', simbolo: '°C' }}
      variantes={VARIANTES}
      tabla={[-40, 0, 32, 50, 68, 86, 98.6, 100, 212, 350, 400]}
      decimales={2}
      inicial="100"
      extra={(res, invertido, entrada) => referencia(invertido ? entrada : res)}
    />
  )
}
