'use client'

import { useState } from 'react'
import { eur } from '@/components/calc-ui-eur'
import { buttonClass, ErrorText, Field, inputClass, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

// Rangos orientativos de precio por m² (mano de obra y materiales, sin IVA).
const TIPOS = [
  { id: 'lavado', label: 'Lavado de cara (pintura, suelos, detalles)', min: 150, max: 300 },
  { id: 'media', label: 'Reforma parcial (suelos, carpintería, electricidad)', min: 350, max: 600 },
  { id: 'integral', label: 'Reforma integral (incluye cocina y baños)', min: 600, max: 1000 },
  { id: 'premium', label: 'Integral con calidades altas', min: 1000, max: 1600 },
]
const CALIDAD = { basica: 0.9, media: 1, alta: 1.2 }

export default function CuantoCuestaReformar() {
  const [m2, setM2] = useState('')
  const [tipo, setTipo] = useState('integral')
  const [calidad, setCalidad] = useState('media')
  const [cocina, setCocina] = useState(false)
  const [banos, setBanos] = useState('0')
  const [iva, setIva] = useState('10')
  const [licencia, setLicencia] = useState('4')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const s = parseFloat(m2)
    if (!(s > 0 && s < 2000)) return setError('Introduce la superficie de la vivienda en m².')
    setError('')
    const t = TIPOS.find((x) => x.id === tipo)
    const f = CALIDAD[calidad]
    let min = s * t.min * f
    let max = s * t.max * f
    const extras = []
    if (tipo !== 'integral' && tipo !== 'premium') {
      if (cocina) extras.push(['Cocina completa', 6000 * f, 14000 * f])
      const b = parseInt(banos, 10) || 0
      if (b > 0) extras.push([`${b} ${b === 1 ? 'baño' : 'baños'}`, 4000 * b * f, 9000 * b * f])
    }
    for (const [, a, b] of extras) {
      min += a
      max += b
    }
    const lic = parseFloat(licencia) / 100
    const iv = parseFloat(iva) / 100
    const total = (x) => x * (1 + iv) + x * lic
    setResult({ t, min, max, extras, totalMin: total(min), totalMax: total(max), m2: s })
  }

  const r = result
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Superficie de la vivienda"><NumberInput value={m2} onChange={setM2} min="1" suffix="m²" placeholder="Ej: 80" /></Field>
        <Field label="Tipo de reforma">
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className={inputClass}>
            {TIPOS.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Calidad de materiales">
          <select value={calidad} onChange={(e) => setCalidad(e.target.value)} className={inputClass}>
            <option value="basica">Básica</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </Field>
        <Field label="IVA aplicable" hint="10% en reformas de vivienda particular si los materiales no superan el 40% del total.">
          <select value={iva} onChange={(e) => setIva(e.target.value)} className={inputClass}>
            <option value="10">10% (vivienda habitual, IVA reducido)</option>
            <option value="21">21% (general)</option>
          </select>
        </Field>
        <Field label="Licencia de obras e ICIO" hint="Suele rondar el 2% a 5% del presupuesto según el municipio."><NumberInput value={licencia} onChange={setLicencia} min="0" max="10" step="0.5" suffix="%" /></Field>
        {tipo !== 'integral' && tipo !== 'premium' && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={cocina} onChange={(e) => setCocina(e.target.checked)} /> Reformar también la cocina</label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              Baños a reformar:
              <select value={banos} onChange={(e) => setBanos(e.target.value)} className="border border-gray-300 rounded-lg px-2 py-1">
                {[0, 1, 2, 3].map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular presupuesto de reforma</button>

      {r && (
        <ResultBox label="Presupuesto estimado con impuestos" value={`${eur(r.totalMin)} – ${eur(r.totalMax)}`}>
          <Rows>
            <Row label={`${r.t.label} (${r.m2} m²)`} value={`${eur(r.min - r.extras.reduce((s, e) => s + e[1], 0))} – ${eur(r.max - r.extras.reduce((s, e) => s + e[2], 0))}`} />
            {r.extras.map(([n, a, b]) => (
              <Row key={n} label={n} value={`${eur(a)} – ${eur(b)}`} />
            ))}
            <Row label="Subtotal sin IVA" value={`${eur(r.min)} – ${eur(r.max)}`} bold />
            <Row label="Precio por m² con impuestos" value={`${eur(r.totalMin / r.m2)} – ${eur(r.totalMax / r.m2)}`} highlight />
          </Rows>
          <Note>Rangos orientativos del mercado español; varían mucho según la ciudad, el estado de la vivienda y los acabados. Pide al menos tres presupuestos desglosados por partidas y reserva un 10% para imprevistos.</Note>
        </ResultBox>
      )}
    </div>
  )
}
