'use client'

import UnitConverter from '@/components/UnitConverter'
import { formatNumber } from '@/components/calc-ui'

// 1 lbf = 0.45359237 kg × 9.80665 m/s² (gravedad estándar), exacto por definición.
const N_POR_LBF = 0.45359237 * 9.80665

const VARIANTES = [
  {
    id: 'n',
    label: 'Libras-fuerza (lbf) a newtons (N)',
    ida: (lb) => lb * N_POR_LBF,
    vuelta: (n) => n / N_POR_LBF,
    nota: '1 lbf = 4.4482216152605 N exactos: una libra de masa (0.45359237 kg) por la gravedad estándar (9.80665 m/s²). Fórmula rápida: N ≈ lb × 4.448.',
  },
  {
    id: 'kn',
    label: 'Libras-fuerza (lbf) a kilonewtons (kN)',
    hacia: { nombre: 'Kilonewtons', simbolo: 'kN' },
    ida: (lb) => (lb * N_POR_LBF) / 1000,
    vuelta: (kn) => (kn * 1000) / N_POR_LBF,
    nota: '1 kN = 1,000 N ≈ 224.81 lbf. Es la unidad habitual para cargas de grúas, anclajes y fichas técnicas de estructuras.',
  },
]

export default function ConvertidorLibrasANewtons() {
  return (
    <UnitConverter
      desde={{ nombre: 'Libras-fuerza', simbolo: 'lbf' }}
      hacia={{ nombre: 'Newtons', simbolo: 'N' }}
      variantes={VARIANTES}
      tabla={[1, 5, 10, 20, 50, 100, 150, 200, 500, 1000]}
      decimales={4}
      inicial="10"
      extra={(res, invertido, entrada) => {
        const lbf = invertido ? res : entrada
        if (!(lbf >= 0)) return null
        return `Equivale al peso de ${formatNumber(lbf * 0.45359237, 3)} kg en la Tierra (${formatNumber(lbf * 0.45359237, 3)} kgf).`
      }}
    />
  )
}
