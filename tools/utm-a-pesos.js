'use client'

import IndicadorChile from '@/components/IndicadorChile'
import { clp } from '@/components/calc-ui-eur'

export default function UtmAPesos() {
  return (
    <IndicadorChile
      clave="utm"
      sigla="UTM"
      nombre="Unidades tributarias mensuales"
      tabla={[0.5, 1, 2, 3, 5, 10, 13.5, 30, 50, 100]}
      extra={(utm) => `Una UTA (unidad tributaria anual) equivale a 12 UTM: ${clp(12 * utm)}. El sueldo exento de impuesto único llega hasta 13.5 UTM: ${clp(13.5 * utm)}.`}
    />
  )
}
