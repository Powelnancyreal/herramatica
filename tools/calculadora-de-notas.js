'use client'

import CalculadoraNotas from '@/components/CalculadoraNotas'

// Escala colombiana de 0.0 a 5.0: se aprueba con 3.0. Muchas universidades redondean la definitiva a una cifra
// decimal (2.95 → 3.0); el reglamento de cada institución manda.
const ESCALA = { minimo: 0, maximo: 5, aprobatoria: 3, umbral: 2.95, decimales: 1, paso: '0.1' }
const PLANTILLA = [
  { nombre: 'Primer corte', peso: 30 },
  { nombre: 'Segundo corte', peso: 30 },
  { nombre: 'Tercer corte', peso: 40 },
]

export default function CalculadoraDeNotas() {
  return (
    <CalculadoraNotas
      escala={ESCALA}
      plantilla={PLANTILLA}
      etiquetaFila="Corte"
      notaPlantilla="Plantilla de tres cortes (30%, 30% y 40%); ajústala a los porcentajes de tu materia o añade parciales, quices y talleres."
      notaRedondeo="Escala de 0.0 a 5.0 con nota aprobatoria de 3.0. La definitiva se redondea a una cifra decimal (2.95 → 3.0, 2.94 → 2.9), como hacen muchas universidades; revisa el reglamento estudiantil de la tuya."
    />
  )
}
