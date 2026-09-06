'use client'

import { useMemo, useState } from 'react'

const NIVELES_ACTIVIDAD = [
  { id: 'sedentario', label: 'Sedentario (poco o ningún ejercicio)', factor: 1.2 },
  { id: 'ligero', label: 'Ligero (ejercicio 1-3 días/semana)', factor: 1.375 },
  { id: 'moderado', label: 'Moderado (ejercicio 3-5 días/semana)', factor: 1.55 },
  { id: 'activo', label: 'Activo (ejercicio 6-7 días/semana)', factor: 1.725 },
  { id: 'muy_activo', label: 'Muy activo (ejercicio intenso o trabajo físico)', factor: 1.9 },
]

const OBJETIVOS = [
  { id: 'mantener', label: 'Mantener peso', ajuste: 0 },
  { id: 'bajar', label: 'Bajar de peso (déficit del 20%)', ajuste: -0.2 },
  { id: 'subir', label: 'Subir de peso (superávit del 15%)', ajuste: 0.15 },
]

function calcularBMR({ sexo, peso, altura, edad }) {
  const base = 10 * peso + 6.25 * altura - 5 * edad
  return sexo === 'hombre' ? base + 5 : base - 161
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalculadoraCalorias() {
  const [sexo, setSexo] = useState('hombre')
  const [peso, setPeso] = useState('')
  const [altura, setAltura] = useState('')
  const [edad, setEdad] = useState('')
  const [actividad, setActividad] = useState('sedentario')
  const [objetivo, setObjetivo] = useState('mantener')

  const resultado = useMemo(() => {
    const p = parseFloat(peso)
    const a = parseFloat(altura)
    const e = parseInt(edad, 10)
    if (isNaN(p) || isNaN(a) || isNaN(e) || p <= 0 || a <= 0 || e <= 0) return null

    const bmr = calcularBMR({ sexo, peso: p, altura: a, edad: e })
    const factorActividad = NIVELES_ACTIVIDAD.find((n) => n.id === actividad).factor
    const tdee = bmr * factorActividad
    const ajuste = OBJETIVOS.find((o) => o.id === objetivo).ajuste
    const caloriasObjetivo = tdee * (1 + ajuste)

    const proteinaG = (caloriasObjetivo * 0.3) / 4
    const carbohidratosG = (caloriasObjetivo * 0.4) / 4
    const grasaG = (caloriasObjetivo * 0.3) / 9

    return { bmr, tdee, caloriasObjetivo, proteinaG, carbohidratosG, grasaG }
  }, [sexo, peso, altura, edad, actividad, objetivo])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Sexo</label>
          <select value={sexo} onChange={(e) => setSexo(e.target.value)} className={inputClass}>
            <option value="hombre">Hombre</option>
            <option value="mujer">Mujer</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Edad (años)</label>
          <input type="number" inputMode="numeric" min="0" value={edad} onChange={(e) => setEdad(e.target.value)} placeholder="Ej: 30" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Peso (kg)</label>
          <input type="number" inputMode="decimal" min="0" value={peso} onChange={(e) => setPeso(e.target.value)} placeholder="Ej: 75" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Altura (cm)</label>
          <input type="number" inputMode="decimal" min="0" value={altura} onChange={(e) => setAltura(e.target.value)} placeholder="Ej: 175" className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Nivel de actividad física</label>
          <select value={actividad} onChange={(e) => setActividad(e.target.value)} className={inputClass}>
            {NIVELES_ACTIVIDAD.map((n) => (
              <option key={n.id} value={n.id}>
                {n.label}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Objetivo</label>
          <select value={objetivo} onChange={(e) => setObjetivo(e.target.value)} className={inputClass}>
            {OBJETIVOS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {resultado && (
        <div className="space-y-3">
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Calorías diarias recomendadas</p>
            <p className="text-4xl font-bold text-blue-700">{Math.round(resultado.caloriasObjetivo).toLocaleString('es')} kcal</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-center">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-500">Metabolismo basal (BMR)</p>
              <p className="font-semibold text-gray-900">{Math.round(resultado.bmr).toLocaleString('es')} kcal</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-500">Gasto total (TDEE)</p>
              <p className="font-semibold text-gray-900">{Math.round(resultado.tdee).toLocaleString('es')} kcal</p>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Distribución de macronutrientes sugerida</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                <p className="text-xs text-gray-600">Proteína (30%)</p>
                <p className="font-bold text-green-700">{Math.round(resultado.proteinaG)} g</p>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                <p className="text-xs text-gray-600">Carbohidratos (40%)</p>
                <p className="font-bold text-amber-700">{Math.round(resultado.carbohidratosG)} g</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                <p className="text-xs text-gray-600">Grasas (30%)</p>
                <p className="font-bold text-blue-700">{Math.round(resultado.grasaG)} g</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500">
        ⚠️ Estimación basada en la fórmula de Mifflin-St Jeor, la más precisa entre las fórmulas estándar de uso
        general. No reemplaza la evaluación de un nutricionista, especialmente si tienes condiciones de salud
        particulares.
      </p>
    </div>
  )
}
