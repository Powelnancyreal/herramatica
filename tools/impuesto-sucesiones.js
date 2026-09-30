'use client'

import { useState } from 'react'
import { calcularSucesiones } from '@/lib/calc/espana'
import { eur } from '@/components/calc-ui-eur'
import { buttonClass, ErrorText, Field, formatNumber, inputClass, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

// Bonificaciones de referencia para cónyuges, descendientes y ascendientes (grupos I y II).
// Cada comunidad añade requisitos y reducciones propias: el resultado es orientativo.
const COMUNIDADES = [
  { id: 'estatal', label: 'Sin bonificación (normativa estatal)', bonif: 0 },
  { id: 'madrid', label: 'Comunidad de Madrid (99%)', bonif: 99 },
  { id: 'andalucia', label: 'Andalucía (99%)', bonif: 99 },
  { id: 'murcia', label: 'Región de Murcia (99%)', bonif: 99 },
  { id: 'valencia', label: 'Comunitat Valenciana (99%)', bonif: 99 },
  { id: 'cyl', label: 'Castilla y León (99%)', bonif: 99 },
  { id: 'extremadura', label: 'Extremadura (99%)', bonif: 99 },
  { id: 'rioja', label: 'La Rioja (99%)', bonif: 99 },
  { id: 'canarias', label: 'Canarias (99.9%)', bonif: 99.9 },
  { id: 'cantabria', label: 'Cantabria (100%)', bonif: 100 },
  { id: 'baleares', label: 'Illes Balears (100%)', bonif: 100 },
  { id: 'otra', label: 'Otra comunidad (escribo la bonificación)', bonif: null },
]

export default function ImpuestoSucesiones() {
  const [herencia, setHerencia] = useState('')
  const [grupo, setGrupo] = useState('II')
  const [edad, setEdad] = useState('')
  const [patrimonio, setPatrimonio] = useState('')
  const [comunidad, setComunidad] = useState('estatal')
  const [bonifManual, setBonifManual] = useState('')
  const [vivienda, setVivienda] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const h = parseFloat(herencia)
    if (!(h > 0)) return setError('Introduce el valor de lo que heredas, ya descontadas deudas y gastos deducibles.')
    if (grupo === 'I' && !(parseFloat(edad) >= 0)) return setError('Para el grupo I indica la edad del heredero.')
    setError('')
    const c = COMUNIDADES.find((x) => x.id === comunidad)
    const aplicaBonif = grupo === 'I' || grupo === 'II'
    const bonif = aplicaBonif ? (c.bonif === null ? parseFloat(bonifManual) || 0 : c.bonif) : 0
    setResult({ ...calcularSucesiones({ herencia: h, grupo, edad: parseFloat(edad) || 30, patrimonio: parseFloat(patrimonio) || 0, bonificacion: bonif, reduccionVivienda: parseFloat(vivienda) || 0 }), bonifPct: bonif, aplicaBonif })
  }

  const r = result
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Valor neto de tu parte de la herencia"><NumberInput value={herencia} onChange={setHerencia} suffix="€" min="0" placeholder="Ej: 300000" /></Field>
        <Field label="Parentesco con el fallecido">
          <select value={grupo} onChange={(e) => setGrupo(e.target.value)} className={inputClass}>
            <option value="I">Grupo I: hijo o descendiente menor de 21 años</option>
            <option value="II">Grupo II: cónyuge, hijo de 21 o más, padres o abuelos</option>
            <option value="III">Grupo III: hermanos, sobrinos, tíos, suegros</option>
            <option value="IV">Grupo IV: primos y no familiares</option>
          </select>
        </Field>
        {grupo === 'I' && <Field label="Edad del heredero"><NumberInput value={edad} onChange={setEdad} min="0" max="20" step="1" /></Field>}
        <Field label="Tu patrimonio previo (opcional)" hint="Afecta al coeficiente multiplicador."><NumberInput value={patrimonio} onChange={setPatrimonio} suffix="€" min="0" placeholder="0" /></Field>
        <Field label="Reducción por vivienda habitual u otras (opcional)"><NumberInput value={vivienda} onChange={setVivienda} suffix="€" min="0" placeholder="0" /></Field>
        <Field label="Comunidad autónoma">
          <select value={comunidad} onChange={(e) => setComunidad(e.target.value)} className={inputClass}>
            {COMUNIDADES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </Field>
        {comunidad === 'otra' && <Field label="Bonificación de tu comunidad"><NumberInput value={bonifManual} onChange={setBonifManual} min="0" max="100" suffix="%" /></Field>}
      </div>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular impuesto de sucesiones</button>

      {r && (
        <ResultBox label="Impuesto de sucesiones estimado" value={eur(r.aPagar)}>
          <Rows>
            <Row label="Reducción por parentesco (estatal)" value={`−${eur(r.reduccion)}`} />
            <Row label="Base liquidable" value={eur(r.base)} />
            <Row label="Cuota íntegra (escala estatal, 7.65% a 34%)" value={eur(r.cuotaIntegra)} />
            <Row label="Coeficiente multiplicador" value={formatNumber(r.coef, 4)} />
            <Row label="Cuota tributaria" value={eur(r.cuotaTributaria)} bold />
            {r.bonif > 0 && <Row label={`Bonificación autonómica (${r.bonifPct}%)`} value={`−${eur(r.bonif)}`} />}
            <Row label="Tipo efectivo sobre lo heredado" value={`${formatNumber(r.tipoEfectivo, 2)}%`} highlight />
          </Rows>
          <Note>
            Cálculo con la escala y las reducciones de la Ley 29/1987. Las comunidades autónomas pueden tener escalas,
            reducciones y requisitos propios (y el País Vasco y Navarra, un régimen foral distinto), así que el importe real
            puede variar: úsalo como orientación y confírmalo con la oficina tributaria de tu comunidad. El plazo para
            presentar el impuesto es de 6 meses desde el fallecimiento.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
