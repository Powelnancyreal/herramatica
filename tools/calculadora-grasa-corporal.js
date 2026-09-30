'use client'

import { useMemo, useState } from 'react'
import { categoriaGrasa, grasaDeurenberg, grasaMarinaEEUU } from '@/lib/calc/salud'
import { Field, formatNumber, inputClass, MedicalDisclaimer, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

export default function CalculadoraGrasaCorporal() {
  const [sexo, setSexo] = useState('hombre')
  const [edad, setEdad] = useState('')
  const [peso, setPeso] = useState('')
  const [altura, setAltura] = useState('')
  const [cuello, setCuello] = useState('')
  const [cintura, setCintura] = useState('')
  const [cadera, setCadera] = useState('')

  const r = useMemo(() => {
    const a = parseFloat(altura)
    const p = parseFloat(peso)
    const e = parseFloat(edad)
    if (!(a > 100 && a < 250)) return null
    const marina = grasaMarinaEEUU({
      sexo,
      altura: a,
      cuello: parseFloat(cuello),
      cintura: parseFloat(cintura),
      cadera: parseFloat(cadera),
    })
    const deurenberg = p > 20 && e >= 18 ? grasaDeurenberg({ sexo, peso: p, altura: a, edad: e }) : null
    const principal = marina !== null && isFinite(marina) && marina > 0 ? marina : deurenberg
    if (principal === null || !isFinite(principal)) return null
    return {
      marina: marina !== null && isFinite(marina) && marina > 0 ? marina : null,
      deurenberg,
      principal,
      categoria: categoriaGrasa(sexo, principal),
      masaGrasa: p > 0 ? (p * principal) / 100 : null,
      masaMagra: p > 0 ? p * (1 - principal / 100) : null,
    }
  }, [sexo, edad, peso, altura, cuello, cintura, cadera])

  return (
    <div className="space-y-5">
      <MedicalDisclaimer />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Sexo biológico">
          <select value={sexo} onChange={(e) => setSexo(e.target.value)} className={inputClass}>
            <option value="hombre">Hombre</option>
            <option value="mujer">Mujer</option>
          </select>
        </Field>
        <Field label="Estatura">
          <NumberInput value={altura} onChange={setAltura} suffix="cm" placeholder="Ej: 175" />
        </Field>
        <Field label="Peso (opcional)" hint="Para masa grasa y magra.">
          <NumberInput value={peso} onChange={setPeso} suffix="kg" placeholder="Ej: 78" />
        </Field>
        <Field label="Cuello" hint="Justo debajo de la nuez.">
          <NumberInput value={cuello} onChange={setCuello} suffix="cm" placeholder="Ej: 38" />
        </Field>
        <Field label="Cintura" hint={sexo === 'hombre' ? 'A la altura del ombligo.' : 'En la parte más estrecha.'}>
          <NumberInput value={cintura} onChange={setCintura} suffix="cm" placeholder="Ej: 85" />
        </Field>
        {sexo === 'mujer' ? (
          <Field label="Cadera" hint="En la parte más ancha.">
            <NumberInput value={cadera} onChange={setCadera} suffix="cm" placeholder="Ej: 98" />
          </Field>
        ) : (
          <Field label="Edad (opcional)" hint="Para la estimación por IMC.">
            <NumberInput value={edad} onChange={setEdad} suffix="años" />
          </Field>
        )}
        {sexo === 'mujer' && (
          <Field label="Edad (opcional)" hint="Para la estimación por IMC.">
            <NumberInput value={edad} onChange={setEdad} suffix="años" />
          </Field>
        )}
      </div>

      {r && (
        <ResultBox label="Porcentaje de grasa corporal" value={`${formatNumber(r.principal, 1)}%`}>
          <p className="text-lg font-semibold text-gray-800">{r.categoria}</p>
          <Rows>
            {r.marina !== null && <Row label="Método Marina de EE. UU. (medidas)" value={`${formatNumber(r.marina, 1)}%`} bold highlight />}
            {r.deurenberg !== null && <Row label="Estimación por IMC (Deurenberg)" value={`${formatNumber(r.deurenberg, 1)}%`} />}
            {r.masaGrasa !== null && <Row label="Masa grasa" value={`${formatNumber(r.masaGrasa, 1)} kg`} />}
            {r.masaMagra !== null && <Row label="Masa magra" value={`${formatNumber(r.masaMagra, 1)} kg`} />}
          </Rows>
          <p className="text-xs text-gray-600">
            Rangos del American Council on Exercise ({sexo === 'hombre' ? 'hombres' : 'mujeres'}):{' '}
            {sexo === 'hombre'
              ? 'esencial 2-5%, atleta 6-13%, forma física 14-17%, promedio 18-24%, obesidad 25% o más.'
              : 'esencial 10-13%, atleta 14-20%, forma física 21-24%, promedio 25-31%, obesidad 32% o más.'}
          </p>
        </ResultBox>
      )}
    </div>
  )
}
