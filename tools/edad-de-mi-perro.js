'use client'

import { useMemo, useState } from 'react'
import { edadPerroLogaritmica, edadPerroPorTamano, TAMANOS_PERRO } from '@/lib/calc/mates'
import { Field, formatNumber, inputClass, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

function etapa(humana) {
  if (humana < 13) return 'Cachorro 🐶'
  if (humana < 20) return 'Adolescente'
  if (humana < 45) return 'Adulto joven'
  if (humana < 62) return 'Adulto maduro'
  return 'Senior 🦴'
}

export default function EdadDeMiPerro() {
  const [anios, setAnios] = useState('3')
  const [meses, setMeses] = useState('0')
  const [tamano, setTamano] = useState('mediano')

  const r = useMemo(() => {
    const edad = (parseFloat(anios) || 0) + (parseFloat(meses) || 0) / 12
    if (!(edad > 0) || edad > 30) return null
    const porTamano = edadPerroPorTamano(edad, tamano)
    const log = edad >= 1 ? edadPerroLogaritmica(edad) : null
    return { edad, porTamano, log, mito: edad * 7 }
  }, [anios, meses, tamano])

  const t = TAMANOS_PERRO.find((x) => x.id === tamano)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Años de tu perro">
          <NumberInput value={anios} onChange={setAnios} min="0" max="30" step="1" />
        </Field>
        <Field label="Meses adicionales">
          <NumberInput value={meses} onChange={setMeses} min="0" max="11" step="1" />
        </Field>
        <Field label="Tamaño adulto">
          <select value={tamano} onChange={(e) => setTamano(e.target.value)} className={inputClass}>
            {TAMANOS_PERRO.map((x) => (
              <option key={x.id} value={x.id}>{x.label}</option>
            ))}
          </select>
        </Field>
      </div>

      {r && (
        <ResultBox label="Tu perro tiene el equivalente a" value={`${formatNumber(r.porTamano, 0)} años humanos`}>
          <Rows>
            <Row label="Etapa de vida" value={etapa(r.porTamano)} bold />
            <Row label="Método por tamaño (tablas veterinarias)" value={`${formatNumber(r.porTamano, 1)} años`} />
            <Row label="Fórmula epigenética (16 · ln(edad) + 31)" value={r.log !== null ? `${formatNumber(r.log, 1)} años` : 'Solo aplica desde 1 año'} />
            <Row label="Regla antigua de «× 7» (inexacta)" value={`${formatNumber(r.mito, 1)} años`} />
            <Row label={`Esperanza de vida típica (${t.label.split(' (')[0].toLowerCase()})`} value={t.esperanza} />
          </Rows>
          <Note>
            Los perros maduran muy rápido: según las tablas veterinarias, al año equivalen a unos 15 años humanos (la fórmula
            epigenética, basada en cambios del ADN, da todavía más). Después, los perros grandes envejecen más deprisa que los
            pequeños. Son estimaciones; tu veterinario puede valorar la edad biológica real.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
