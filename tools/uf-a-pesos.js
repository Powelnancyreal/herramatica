'use client'

import IndicadorChile from '@/components/IndicadorChile'
import { clp } from '@/components/calc-ui-eur'

export default function UfAPesos() {
  return (
    <IndicadorChile
      clave="uf"
      sigla="UF"
      nombre="Unidades de fomento"
      tabla={[0.5, 1, 2, 5, 10, 20, 50, 100, 1000, 3000]}
      extra={(uf) => `Un arriendo de 15 UF equivale hoy a ${clp(15 * uf)} y un crédito de 3,000 UF a ${clp(3000 * uf)}.`}
    />
  )
}
