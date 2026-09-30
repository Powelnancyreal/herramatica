'use client'

import PrestacionColombia from '@/components/PrestacionColombia'
import { cop } from '@/components/calc-ui-eur'

function periodoActual() {
  const hoy = new Date()
  const y = hoy.getFullYear()
  return hoy.getMonth() < 6 ? [`${y}-01-01`, `${y}-06-30`] : [`${y}-07-01`, `${y}-12-30`]
}

export default function PrimaDeServicios() {
  return (
    <PrestacionColombia
      titulo="Prima de servicios del semestre"
      boton="Calcular prima de servicios"
      periodoPorDefecto={periodoActual}
      calcular={({ base, dias }) => ({
        valor: (base * dias) / 360,
        filas: [['Fórmula', `${cop(base)} × ${dias} ÷ 360`]],
      })}
      nota="Art. 306 del Código Sustantivo del Trabajo: 30 días de salario por año, pagados en dos cuotas de 15 días, a más tardar el 30 de junio y el 20 de diciembre. Se calcula por semestre y es proporcional al tiempo trabajado."
    />
  )
}
