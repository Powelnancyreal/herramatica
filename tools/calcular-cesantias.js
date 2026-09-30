'use client'

import PrestacionColombia from '@/components/PrestacionColombia'
import { cop } from '@/components/calc-ui-eur'

export default function CalcularCesantias() {
  return (
    <PrestacionColombia
      titulo="Cesantías del periodo"
      boton="Calcular cesantías"
      periodoPorDefecto={() => { const y = new Date().getFullYear(); return [`${y}-01-01`, `${y}-12-30`] }}
      calcular={({ base, dias }) => {
        const cesantias = (base * dias) / 360
        const intereses = (cesantias * dias * 0.12) / 360
        return {
          valor: cesantias,
          filas: [
            ['Fórmula', `${cop(base)} × ${dias} ÷ 360`],
            ['Intereses sobre cesantías (12% anual)', cop(intereses)],
          ],
        }
      }}
      nota="Art. 249 del Código Sustantivo del Trabajo: un mes de salario por cada año trabajado, y proporcional por fracción. El empleador las consigna al fondo de cesantías a más tardar el 14 de febrero del año siguiente y paga directamente al trabajador los intereses del 12% anual antes del 31 de enero."
    />
  )
}
