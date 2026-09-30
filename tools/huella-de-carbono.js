'use client'

import { useState } from 'react'
import { buttonClass, Field, formatNumber, inputClass, Note, NumberInput, ResultBox } from '@/components/calc-ui'

// Factores de emisión orientativos (kg de CO2 equivalente).
const FACTORES = {
  gasolina: 2.31, // por litro
  diesel: 2.68, // por litro
  gasNatural: 0.2, // por kWh
  butano: 37, // por bombona de 12.5 kg
  vueloHora: 90, // por pasajero y hora de vuelo
  busKm: 0.1, // por pasajero y km
}
// Dietas (Scarborough et al., Climatic Change, 2014), en toneladas al año.
const DIETAS = [
  { id: 'carnivora', label: 'Mucha carne (más de 100 g al día)', t: 2.62 },
  { id: 'media', label: 'Carne moderada', t: 2.05 },
  { id: 'poca', label: 'Poca carne', t: 1.7 },
  { id: 'pescetariana', label: 'Pescetariana', t: 1.43 },
  { id: 'vegetariana', label: 'Vegetariana', t: 1.39 },
  { id: 'vegana', label: 'Vegana', t: 1.05 },
]
const CONSUMO = [
  { id: 'bajo', label: 'Bajo: compro poco y reutilizo', t: 0.6 },
  { id: 'medio', label: 'Medio', t: 1.2 },
  { id: 'alto', label: 'Alto: ropa y tecnología nuevas a menudo', t: 2.2 },
]

export default function HuellaDeCarbono() {
  const [d, setD] = useState({ personas: '2', kwh: '250', factorRed: '0.2', gas: '0', butano: '0', kmCoche: '100', consumoCoche: '6.5', combustible: 'gasolina', kmBus: '50', horasVuelo: '4', dieta: 'media', consumo: 'medio' })
  const [r, setR] = useState(null)
  const cambiar = (k, v) => setD((x) => ({ ...x, [k]: v }))
  const n = (k) => parseFloat(d[k]) || 0

  function calcular() {
    const personas = Math.max(1, n('personas'))
    const hogar = (n('kwh') * 12 * n('factorRed') + n('gas') * 12 * FACTORES.gasNatural + n('butano') * 12 * FACTORES.butano) / 1000 / personas
    const coche = (n('kmCoche') * 52 * (n('consumoCoche') / 100) * FACTORES[d.combustible]) / 1000
    const bus = (n('kmBus') * 52 * FACTORES.busKm) / 1000
    const vuelos = (n('horasVuelo') * FACTORES.vueloHora) / 1000
    const dieta = DIETAS.find((x) => x.id === d.dieta).t
    const consumo = CONSUMO.find((x) => x.id === d.consumo).t
    const partes = [
      ['🏠 Hogar (luz y calefacción)', hogar],
      ['🚗 Coche', coche],
      ['🚌 Transporte público', bus],
      ['✈️ Vuelos', vuelos],
      ['🍽️ Alimentación', dieta],
      ['🛍️ Consumo de bienes', consumo],
    ]
    setR({ partes, total: partes.reduce((s, p) => s + p[1], 0) })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Personas en tu hogar"><NumberInput value={d.personas} onChange={(v) => cambiar('personas', v)} min="1" step="1" /></Field>
        <Field label="Electricidad del hogar al mes"><NumberInput value={d.kwh} onChange={(v) => cambiar('kwh', v)} min="0" suffix="kWh" /></Field>
        <Field label="Factor de emisión de tu red eléctrica" hint="Depende del país y del año; en redes con muchas renovables es menor."><NumberInput value={d.factorRed} onChange={(v) => cambiar('factorRed', v)} min="0" step="0.01" suffix="kg/kWh" /></Field>
        <Field label="Gas natural al mes"><NumberInput value={d.gas} onChange={(v) => cambiar('gas', v)} min="0" suffix="kWh" /></Field>
        <Field label="Bombonas de butano al mes"><NumberInput value={d.butano} onChange={(v) => cambiar('butano', v)} min="0" step="0.5" /></Field>
        <Field label="Kilómetros en coche a la semana"><NumberInput value={d.kmCoche} onChange={(v) => cambiar('kmCoche', v)} min="0" suffix="km" /></Field>
        <Field label="Consumo y combustible del coche">
          <div className="flex gap-2">
            <NumberInput value={d.consumoCoche} onChange={(v) => cambiar('consumoCoche', v)} min="0" step="0.1" suffix="L/100" />
            <select value={d.combustible} onChange={(e) => cambiar('combustible', e.target.value)} className={`${inputClass} max-w-[8rem]`}>
              <option value="gasolina">Gasolina</option>
              <option value="diesel">Diésel</option>
            </select>
          </div>
        </Field>
        <Field label="Kilómetros en transporte público a la semana"><NumberInput value={d.kmBus} onChange={(v) => cambiar('kmBus', v)} min="0" suffix="km" /></Field>
        <Field label="Horas de vuelo al año"><NumberInput value={d.horasVuelo} onChange={(v) => cambiar('horasVuelo', v)} min="0" suffix="h" /></Field>
        <Field label="Tu alimentación">
          <select value={d.dieta} onChange={(e) => cambiar('dieta', e.target.value)} className={inputClass}>
            {DIETAS.map((x) => (
              <option key={x.id} value={x.id}>{x.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Tus compras">
          <select value={d.consumo} onChange={(e) => cambiar('consumo', e.target.value)} className={inputClass}>
            {CONSUMO.map((x) => (
              <option key={x.id} value={x.id}>{x.label}</option>
            ))}
          </select>
        </Field>
      </div>
      <button onClick={calcular} className={buttonClass}>Calcular mi huella de carbono</button>

      {r && (
        <ResultBox label="Tu huella de carbono estimada" value={`${formatNumber(r.total, 1)} t CO₂e/año`}>
          <div className="space-y-2">
            {r.partes.map(([n2, v]) => (
              <div key={n2} className="text-sm">
                <div className="flex justify-between"><span>{n2}</span><span className="font-medium">{formatNumber(v, 2)} t</span></div>
                <div className="h-2 bg-white rounded"><div className="h-2 bg-green-500 rounded" style={{ width: `${Math.min(100, (v / r.total) * 100)}%` }} /></div>
              </div>
            ))}
          </div>
          <Note>
            Para limitar el calentamiento a 1.5 °C, las emisiones por persona deberían bajar a unas 2 toneladas al año hacia 2050.
            Es una estimación con factores de emisión promedio: no incluye servicios públicos ni la huella de tu trabajo.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
