'use client'

import { useState } from 'react'

// --- IMC classification table ---
const CATEGORIES = [
  {
    max: 18.5,
    label: 'Bajo peso',
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    valueColor: 'text-yellow-600',
    badge: 'bg-yellow-100 text-yellow-800',
    barColor: 'bg-yellow-400',
    msg: 'Tu peso está por debajo del rango saludable. Una dieta equilibrada y la orientación de un profesional de salud pueden ayudarte a alcanzar tu peso ideal.',
  },
  {
    max: 25,
    label: 'Peso normal',
    bg: 'bg-green-50',
    border: 'border-green-300',
    valueColor: 'text-green-600',
    badge: 'bg-green-100 text-green-800',
    barColor: 'bg-green-500',
    msg: '¡Enhorabuena! Tu peso se encuentra dentro del rango saludable según la OMS. Mantén tus hábitos de alimentación y actividad física para conservar este resultado.',
  },
  {
    max: 30,
    label: 'Sobrepeso',
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    valueColor: 'text-orange-600',
    badge: 'bg-orange-100 text-orange-800',
    barColor: 'bg-orange-400',
    msg: 'Tu IMC indica sobrepeso. Pequeños cambios en tu alimentación y aumentar la actividad física pueden marcar una gran diferencia. Considera consultar a un nutricionista.',
  },
  {
    max: Infinity,
    label: 'Obesidad',
    bg: 'bg-red-50',
    border: 'border-red-300',
    valueColor: 'text-red-600',
    badge: 'bg-red-100 text-red-800',
    barColor: 'bg-red-500',
    msg: 'Tu IMC indica obesidad. Te recomendamos consultar con un médico o nutricionista para desarrollar un plan de salud personalizado y seguro.',
  },
]

function getCategory(imc) {
  return CATEGORIES.find((c) => imc < c.max)
}

// Scale: IMC 10–40 → 0–100%
function getBarPosition(imc) {
  return Math.min(Math.max(((imc - 10) / 30) * 100, 2), 98)
}

// --- Component ---

export default function CalculadoraIMC() {
  const [peso, setPeso] = useState('')
  const [altura, setAltura] = useState('')
  const [result, setResult] = useState(null)
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    const p = parseFloat(peso)
    const a = parseFloat(altura)
    if (!peso || isNaN(p) || p <= 0 || p > 500)
      e.peso = 'Introduce un peso válido entre 1 y 500 kg.'
    if (!altura || isNaN(a) || a < 50 || a > 300)
      e.altura = 'Introduce una altura válida entre 50 y 300 cm.'
    return e
  }

  function handleCalculate() {
    const e = validate()
    if (Object.keys(e).length) {
      setErrors(e)
      setResult(null)
      return
    }
    setErrors({})
    const p = parseFloat(peso)
    const a = parseFloat(altura) / 100
    const imc = p / (a * a)
    setResult({
      imc: imc.toFixed(2),
      imcRaw: imc,
      category: getCategory(imc),
    })
  }

  function handleChange(setter, field, value) {
    setter(value)
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  return (
    <div className="space-y-5">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Peso */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Peso <span className="text-gray-400 font-normal">(kg)</span>
          </label>
          <div className="relative">
            <input
              type="number"
              inputMode="decimal"
              value={peso}
              onChange={(e) => handleChange(setPeso, 'peso', e.target.value)}
              placeholder="Ej: 70"
              min="1"
              max="500"
              step="0.1"
              className={`w-full border rounded-lg px-3 py-2.5 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
                errors.peso ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium pointer-events-none">
              kg
            </span>
          </div>
          {errors.peso && <p className="mt-1 text-xs text-red-600">{errors.peso}</p>}
        </div>

        {/* Altura */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Altura <span className="text-gray-400 font-normal">(cm)</span>
          </label>
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              value={altura}
              onChange={(e) => handleChange(setAltura, 'altura', e.target.value)}
              placeholder="Ej: 170"
              min="50"
              max="300"
              step="1"
              className={`w-full border rounded-lg px-3 py-2.5 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
                errors.altura ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium pointer-events-none">
              cm
            </span>
          </div>
          {errors.altura && <p className="mt-1 text-xs text-red-600">{errors.altura}</p>}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleCalculate}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Calcular IMC
      </button>

      {/* Result */}
      {result && (
        <div className={`rounded-xl border-2 p-5 ${result.category.bg} ${result.category.border}`}>
          {/* Header row: value + badge */}
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Tu Índice de Masa Corporal
              </p>
              <p className={`text-5xl font-bold leading-none ${result.category.valueColor}`}>
                {result.imc}
              </p>
            </div>
            <span
              className={`mt-1 text-sm font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ${result.category.badge}`}
            >
              {result.category.label}
            </span>
          </div>

          {/* Gradient scale with position marker */}
          <div className="mb-2">
            <div className="relative h-3 rounded-full overflow-visible mb-1"
              style={{ background: 'linear-gradient(to right, #facc15 0%, #22c55e 30%, #fb923c 65%, #ef4444 100%)' }}
            >
              {/* Marker */}
              <div
                className="absolute top-1/2 w-4 h-4 bg-white border-2 border-gray-800 rounded-full shadow-md"
                style={{
                  left: `${getBarPosition(result.imcRaw)}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 px-0.5">
              <span>10</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>40+</span>
            </div>
          </div>

          {/* Message */}
          <p className="text-sm text-gray-700 leading-relaxed mt-4 mb-4">
            {result.category.msg}
          </p>

          {/* Category legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-black/10">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.label}
                className={`text-center py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                  cat.label === result.category.label
                    ? `${cat.badge} ring-1 ring-current`
                    : 'bg-white/50 text-gray-400'
                }`}
              >
                {cat.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
