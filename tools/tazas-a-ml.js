'use client'

import { useState } from 'react'
import UnitConverter from '@/components/UnitConverter'
import { formatNumber, NumberInput } from '@/components/calc-ui'

const VARIANTES = [
  { id: 'us', label: 'Taza estadounidense (236.6 ml)', ml: 236.5882365, nota: 'Taza de EE. UU. = 236.588 ml. Es la de la mayoría de recetas en inglés y de las tazas medidoras que se venden en México.' },
  { id: 'metrica', label: 'Taza métrica (250 ml)', ml: 250, nota: 'Taza métrica = 250 ml. Se usa en recetas de Australia, Canadá y muchas recetas en español.' },
  { id: 'legal', label: 'Taza legal de EE. UU. (240 ml, etiquetas nutricionales)', ml: 240, nota: 'La FDA usa 240 ml por taza en las etiquetas de información nutricional.' },
  { id: 'uk', label: 'Taza imperial británica (284 ml)', ml: 284.130625, nota: 'Taza imperial = 284.13 ml (media pinta). Aparece en recetas británicas antiguas.' },
].map((v) => ({ ...v, ida: (t) => t * v.ml, vuelta: (ml) => ml / v.ml }))

// Gramos aproximados por taza estadounidense (ingrediente sin compactar, cernido cuando aplica).
const INGREDIENTES = [
  ['Agua o leche', 237], ['Harina de trigo', 125], ['Azúcar blanca', 200], ['Azúcar morena (compactada)', 220],
  ['Azúcar glas', 120], ['Mantequilla', 227], ['Aceite', 218], ['Arroz crudo', 185], ['Avena en hojuelas', 90],
  ['Cacao en polvo', 85], ['Miel', 340], ['Queso rallado', 100],
]

export default function TazasAMl() {
  const [tazas, setTazas] = useState('1')
  const t = parseFloat(tazas) || 0
  return (
    <UnitConverter
      desde={{ nombre: 'Tazas', simbolo: 'tazas' }}
      hacia={{ nombre: 'Mililitros', simbolo: 'ml' }}
      variantes={VARIANTES}
      tabla={[0.25, 1 / 3, 0.5, 2 / 3, 0.75, 1, 1.5, 2, 3, 4]}
      decimales={1}
      extra={(res, invertido) => (invertido ? '' : `${formatNumber(res / 14.7868, 1)} cucharadas · ${formatNumber(res / 4.92892, 1)} cucharaditas`)}
    >
      <div className="rounded-xl border border-gray-200 p-4 space-y-3">
        <p className="font-semibold text-gray-900 text-sm">¿Cuántos gramos pesa una taza? (taza de EE. UU.)</p>
        <div className="max-w-[12rem]">
          <NumberInput value={tazas} onChange={setTazas} min="0" step="0.25" suffix="tazas" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
          {INGREDIENTES.map(([n, g]) => (
            <div key={n} className="flex justify-between border-b border-gray-100 py-1">
              <span className="text-gray-600">{n}</span>
              <span className="font-medium">{formatNumber(g * t, 0)} g</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500">Valores promedio: el peso real cambia según la marca, la humedad y si el ingrediente se compacta.</p>
      </div>
    </UnitConverter>
  )
}
