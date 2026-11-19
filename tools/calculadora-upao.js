'use client'

import CalculadoraNotas from '@/components/CalculadoraNotas'

// Escala vigesimal de la UPAO: aprueba con 11; las fracciones de 0.5 o más se redondean al entero superior,
// así que un promedio de 10.5 ya aprueba (art. 74 y 75 del Reglamento de Estudios de Pregrado).
// Pesos del art. 70 del mismo reglamento (R.R. 3353-2016-R-UPAO); el sílabo puede subdividir EP1 y EP2.
const ESCALA = { minimo: 0, maximo: 20, aprobatoria: 11, umbral: 10.5, decimales: 0, paso: '0.5' }
const PLANTILLA = [
  { nombre: 'EP1 · Evaluación de proceso 1', peso: 25 },
  { nombre: 'EVP · Evaluación parcial', peso: 20 },
  { nombre: 'EP2 · Evaluación de proceso 2', peso: 30 },
  { nombre: 'EVF · Evaluación final', peso: 25 },
]

export default function CalculadoraUpao() {
  return (
    <CalculadoraNotas
      escala={ESCALA}
      plantilla={PLANTILLA}
      notaPlantilla="Pesos del Reglamento de Estudios de Pregrado de la UPAO; cambia los nombres y porcentajes si tu sílabo indica otros."
      notaRedondeo="Escala de 0 a 20. La nota final se redondea al entero: 0.5 o más sube (10.5 → 11, aprobado) y menos de 0.5 baja (10.4 → 10, desaprobado). Confirma los pesos en el sílabo de tu curso."
    />
  )
}
