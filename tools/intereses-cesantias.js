'use client'

import PrestacionColombia from '@/components/PrestacionColombia'
import { cop } from '@/components/calc-ui-eur'
import { formatNumber } from '@/components/calc-ui'

export default function InteresesCesantias() {
  return (
    <PrestacionColombia
      titulo="Intereses sobre las cesantías"
      boton="Calcular intereses de cesantías"
      periodoPorDefecto={() => { const y = new Date().getFullYear(); return [`${y}-01-01`, `${y}-12-30`] }}
      conIntereses
      calcular={({ base, dias, cesantias: previas }) => {
        const cesantias = previas > 0 ? previas : (base * dias) / 360
        const tasa = (0.12 * dias) / 360
        return {
          valor: cesantias * tasa,
          filas: [
            ['Cesantías sobre las que se calculan', cop(cesantias)],
            ['Tasa proporcional', `12% × ${dias} ÷ 360 = ${formatNumber(tasa * 100, 2)}%`],
          ],
        }
      }}
      nota="Ley 52 de 1975: el empleador paga al trabajador el 12% anual sobre el saldo de cesantías, proporcional a los días trabajados, a más tardar el 31 de enero (o al terminar el contrato). Si no los paga a tiempo, debe pagarlos dobles como sanción."
    />
  )
}
