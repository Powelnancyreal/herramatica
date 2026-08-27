'use client'

import { useState } from 'react'

// ─────────────────────────────────────────────────────────────────
// Dígito verificador del CUIL/CUIT argentino (AFIP) — módulo 11.
// ─────────────────────────────────────────────────────────────────

const PESOS_CUIL = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]

// prefijo + dni (8 dígitos, con ceros a la izquierda si hace falta)
function calcularDVCUIL(prefijo, dniPadded) {
  const base10 = `${prefijo}${dniPadded}`
  const digitos = base10.split('').map(Number)
  let suma = 0
  for (let i = 0; i < 10; i++) suma += digitos[i] * PESOS_CUIL[i]
  let dv = 11 - (suma % 11)
  if (dv === 11) dv = 0
  return dv
}

export function calcularCUIL(dni, sexo) {
  const dniPadded = dni.padStart(8, '0')
  const prefijosPorSexo = { M: '20', F: '27', J: '30' }
  let prefijo = prefijosPorSexo[sexo]
  let dv = calcularDVCUIL(prefijo, dniPadded)
  if (dv === 10) {
    // Caso especial: si con el prefijo por sexo el DV da 10, se reintenta con el prefijo 23
    prefijo = '23'
    dv = calcularDVCUIL(prefijo, dniPadded)
  }
  return { cuil: `${prefijo}-${dniPadded}-${dv}`, prefijo, dniPadded, dv }
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white font-mono'

const TABS = [
  { id: 'calcular', label: 'Calcular CUIL' },
  { id: 'validar', label: 'Validar CUIL/CUIT' },
]

export default function CalcularCUIL() {
  const [tab, setTab] = useState('calcular')
  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${tab === t.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'calcular' ? <CalcularTab /> : <ValidarTab />}
    </div>
  )
}

function CalcularTab() {
  const [dni, setDni] = useState('')
  const [sexo, setSexo] = useState('M')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    if (!/^\d{7,8}$/.test(dni)) return setError('Introduce un DNI válido (7 u 8 dígitos, sin puntos).')
    setError('')
    setResult(calcularCUIL(dni, sexo))
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">DNI (sin puntos)</label>
          <input
            type="text"
            value={dni}
            onChange={(e) => { setDni(e.target.value.replace(/\D/g, '').slice(0, 8)); setResult(null); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && calcular()}
            placeholder="Ej: 30123456"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Sexo registrado / tipo</label>
          <select value={sexo} onChange={(e) => setSexo(e.target.value)} className={inputClass}>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="J">Persona jurídica</option>
          </select>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button onClick={calcular} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
        Calcular CUIL
      </button>
      {result && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">CUIL</p>
          <p className="text-4xl font-bold text-blue-700 font-mono tracking-wider">{result.cuil}</p>
        </div>
      )}
    </div>
  )
}

function ValidarTab() {
  const [cuil, setCuil] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function validar() {
    const limpio = cuil.replace(/[^\d]/g, '')
    if (!/^\d{11}$/.test(limpio)) return setError('Introduce un CUIL/CUIT completo de 11 dígitos (con o sin guiones).')
    setError('')
    const prefijo = limpio.slice(0, 2)
    const dniPadded = limpio.slice(2, 10)
    const dvIntroducido = Number(limpio.slice(10, 11))
    const dvCorrecto = calcularDVCUIL(prefijo, dniPadded)
    setResult({ esValido: dvIntroducido === dvCorrecto, dvCorrecto, prefijo, dniPadded })
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">CUIL/CUIT completo</label>
        <input
          type="text"
          value={cuil}
          onChange={(e) => { setCuil(e.target.value.replace(/[^\d-]/g, '')); setResult(null); setError('') }}
          onKeyDown={(e) => e.key === 'Enter' && validar()}
          placeholder="Ej: 20-30123456-3"
          className={inputClass}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button onClick={validar} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
        Validar
      </button>
      {result && (
        <div className={`rounded-xl border-2 p-5 text-center ${result.esValido ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <p className="text-4xl mb-2">{result.esValido ? '✅' : '❌'}</p>
          <p className={`text-lg font-semibold ${result.esValido ? 'text-green-700' : 'text-red-700'}`}>
            {result.esValido ? 'CUIL/CUIT válido' : 'CUIL/CUIT no válido'}
          </p>
          {!result.esValido && <p className="text-sm text-gray-600 mt-2">El dígito verificador correcto es <strong>{result.dvCorrecto}</strong>.</p>}
        </div>
      )}
    </div>
  )
}
