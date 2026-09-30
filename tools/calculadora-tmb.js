'use client'

import { useMemo, useState } from 'react'
import { NIVELES_ACTIVIDAD, tmbHarrisBenedict, tmbKatchMcArdle, tmbMifflin } from '@/lib/calc/salud'
import { Field, formatNumber, inputClass, MedicalDisclaimer, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

export default function CalculadoraTMB() {
  const [sexo, setSexo] = useState('mujer')
  const [edad, setEdad] = useState('')
  const [peso, setPeso] = useState('')
  const [altura, setAltura] = useState('')
  const [grasa, setGrasa] = useState('')

  const r = useMemo(() => {
    const p = { sexo, peso: parseFloat(peso), altura: parseFloat(altura), edad: parseFloat(edad) }
    if (!(p.peso > 20 && p.peso < 400) || !(p.altura > 100 && p.altura < 250) || !(p.edad >= 15 && p.edad < 110)) return null
    const g = parseFloat(grasa)
    return {
      mifflin: tmbMifflin(p),
      harris: tmbHarrisBenedict(p),
      katch: g > 2 && g < 70 ? tmbKatchMcArdle({ peso: p.peso, grasaPct: g }) : null,
    }
  }, [sexo, edad, peso, altura, grasa])

  return (
    <div className="space-y-5">
      <MedicalDisclaimer />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Sexo biológico">
          <select value={sexo} onChange={(e) => setSexo(e.target.value)} className={inputClass}>
            <option value="mujer">Mujer</option>
            <option value="hombre">Hombre</option>
          </select>
        </Field>
        <Field label="Edad">
          <NumberInput value={edad} onChange={setEdad} min="15" suffix="años" placeholder="Ej: 30" />
        </Field>
        <Field label="Peso">
          <NumberInput value={peso} onChange={setPeso} min="0" suffix="kg" placeholder="Ej: 65" />
        </Field>
        <Field label="Estatura">
          <NumberInput value={altura} onChange={setAltura} min="0" suffix="cm" placeholder="Ej: 165" />
        </Field>
        <Field label="% de grasa corporal (opcional)" hint="Si lo conoces, activa la fórmula Katch-McArdle, la más precisa.">
          <NumberInput value={grasa} onChange={setGrasa} min="0" max="70" suffix="%" />
        </Field>
      </div>

      {r && (
        <ResultBox label="Tu metabolismo basal (Mifflin-St Jeor)" value={`${formatNumber(r.mifflin, 0)} kcal/día`}>
          <Rows>
            <Row label="Mifflin-St Jeor (recomendada)" value={`${formatNumber(r.mifflin, 0)} kcal`} bold highlight />
            <Row label="Harris-Benedict revisada" value={`${formatNumber(r.harris, 0)} kcal`} />
            {r.katch && <Row label="Katch-McArdle (con % de grasa)" value={`${formatNumber(r.katch, 0)} kcal`} bold />}
          </Rows>
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Gasto calórico total según tu actividad (TMB × factor)</p>
            <Rows>
              {NIVELES_ACTIVIDAD.map((n) => (
                <Row key={n.id} label={`${n.label} · ×${n.factor}`} value={`${formatNumber(r.mifflin * n.factor, 0)} kcal`} />
              ))}
            </Rows>
          </div>
        </ResultBox>
      )}
    </div>
  )
}
