'use client'

import CalculadoraNotas from '@/components/CalculadoraNotas'

// Escala vigesimal de la UPAO: aprueba con 11; las fracciones de 0.5 o más se redondean al entero superior,
// así que un promedio de 10.5 ya aprueba. Pesos de la plantilla habitual (revisar siempre el sílabo).
const ESCALA = { minimo: 0, maximo: 20, aprobatoria: 11, umbral: 10.5, decimales: 0, paso: '0.5' }
const PLANTILLA = [
  { nombre: 'EP1 · Evaluación de proceso 1', peso: 20 },
  { nombre: 'EVP · Evaluación parcial', peso: 30 },
  { nombre: 'EP2 · Evaluación de proceso 2', peso: 20 },
  { nombre: 'EVF · Evaluación final', peso: 30 },
]

export default function CalculadoraUpao() {
  return (
    <CalculadoraNotas
      escala={ESCALA}
      plantilla={PLANTILLA}
      notaPlantilla="Plantilla habitual de la UPAO; cambia los nombres y porcentajes si tu sílabo indica otros."
      notaRedondeo="Escala de 0 a 20. La nota final se redondea al entero: 0.5 o más sube (10.5 → 11, aprobado) y menos de 0.5 baja (10.4 → 10, desaprobado). Confirma los pesos en el sílabo de tu curso."
    />
  )
}
