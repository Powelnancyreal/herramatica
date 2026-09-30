'use client'

import { useMemo, useState } from 'react'
import { calcularAgua } from '@/lib/calc/salud'
import { Field, formatNumber, inputClass, MedicalDisclaimer, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

export default function CalculadoraAguaDiaria() {
  const [peso, setPeso] = useState('')
  const [minutos, setMinutos] = useState('0')
  const [calor, setCalor] = useState(false)
  const [condicion, setCondicion] = useState('ninguna')

  const r = useMemo(() => {
    const p = parseFloat(peso)
    if (!(p > 20 && p < 400)) return null
    return calcularAgua({ peso: p, minutosEjercicio: parseFloat(minutos) || 0, calor, condicion })
  }, [peso, minutos, calor, condicion])

  return (
    <div className="space-y-5">
      <MedicalDisclaimer />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Peso">
          <NumberInput value={peso} onChange={setPeso} suffix="kg" placeholder="Ej: 70" />
        </Field>
        <Field label="Ejercicio al día">
          <NumberInput value={minutos} onChange={setMinutos} min="0" suffix="min" />
        </Field>
        <Field label="Situación especial">
          <select value={condicion} onChange={(e) => setCondicion(e.target.value)} className={inputClass}>
            <option value="ninguna">Ninguna</option>
            <option value="embarazo">Embarazo</option>
            <option value="lactancia">Lactancia</option>
          </select>
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={calor} onChange={(e) => setCalor(e.target.checked)} />
        Hace calor o vivo en un clima cálido o húmedo
      </label>

      {r && (
        <ResultBox label="Agua recomendada al día" value={`${formatNumber(r.totalMl / 1000, 1)} litros`}>
          <div className="flex flex-wrap gap-1" aria-label={`${Math.round(r.vasos)} vasos de 250 ml`}>
            {Array.from({ length: Math.min(Math.round(r.vasos), 24) }).map((_, i) => (
              <span key={i} className="text-2xl" aria-hidden="true">🥛</span>
            ))}
          </div>
          <Rows>
            <Row label="Base (35 ml por kg de peso)" value={`${formatNumber(r.base, 0)} ml`} />
            {r.ejercicio > 0 && <Row label="Por ejercicio" value={`+${formatNumber(r.ejercicio, 0)} ml`} />}
            {r.clima > 0 && <Row label="Por calor" value={`+${formatNumber(r.clima, 0)} ml`} />}
            {r.extra > 0 && <Row label={condicion === 'embarazo' ? 'Por embarazo' : 'Por lactancia'} value={`+${formatNumber(r.extra, 0)} ml`} />}
            <Row label="Total" value={`${formatNumber(r.totalMl, 0)} ml ≈ ${formatNumber(r.vasos, 0)} vasos de 250 ml`} bold highlight />
          </Rows>
          <p className="text-xs text-gray-600">
            Incluye todo lo que bebes (agua, infusiones, leche). Cerca del 20% del agua diaria llega con los alimentos. Si
            tienes enfermedad renal o cardiaca, sigue la indicación de tu médico: puede recomendarte beber menos.
          </p>
        </ResultBox>
      )}
    </div>
  )
}
