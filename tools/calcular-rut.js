'use client'

import { useState } from 'react'

// ─────────────────────────────────────────────────────────────────
// Dígito verificador del RUT/RUN chileno — algoritmo del módulo 11.
// ─────────────────────────────────────────────────────────────────

const PESOS_RUT = [2, 3, 4, 5, 6, 7]

export function calcularDVRUT(numeroBase) {
  const digitos = numeroBase.split('').reverse().map(Number)
  let suma = 0
  for (let i = 0; i < digitos.length; i++) {
    suma += digitos[i] * PESOS_RUT[i % 6]
  }
  const resto = 11 - (suma % 11)
  if (resto === 11) return '0'
  if (resto === 10) return 'K'
  return String(resto)
}

function formatearRUT(numero) {
  return numero.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white font-mono'

const TABS = [
  { id: 'calcular', label: 'Calcular DV' },
  { id: 'validar', label: 'Validar RUT' },
]

export default function CalcularRUT() {
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
  const [numero, setNumero] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    if (!/^\d{6,8}$/.test(numero)) return setError('Introduce el RUT sin el dígito verificador (entre 6 y 8 dígitos).')
    setError('')
    setResult({ numero, dv: calcularDVRUT(numero) })
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">RUT (sin dígito verificador ni puntos)</label>
        <input
          type="text"
          value={numero}
          onChange={(e) => { setNumero(e.target.value.replace(/\D/g, '').slice(0, 8)); setResult(null); setError('') }}
          onKeyDown={(e) => e.key === 'Enter' && calcular()}
          placeholder="Ej: 12345678"
          className={inputClass}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button onClick={calcular} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
        Calcular dígito verificador
      </button>
      {result && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">RUT completo</p>
          <p className="text-4xl font-bold text-blue-700 font-mono">
            {formatearRUT(result.numero)}-<span className="text-green-600">{result.dv}</span>
          </p>
        </div>
      )}
    </div>
  )
}

function ValidarTab() {
  const [numero, setNumero] = useState('')
  const [dvIntroducido, setDvIntroducido] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function validar() {
    if (!/^\d{6,8}$/.test(numero)) return setError('Introduce el RUT sin el dígito verificador.')
    if (!/^[0-9kK]$/.test(dvIntroducido)) return setError('Introduce el dígito verificador (un número o K).')
    setError('')
    const dvCorrecto = calcularDVRUT(numero)
    setResult({ esValido: dvIntroducido.toUpperCase() === dvCorrecto, dvCorrecto })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">RUT (sin dígito verificador)</label>
          <input
            type="text"
            value={numero}
            onChange={(e) => { setNumero(e.target.value.replace(/\D/g, '').slice(0, 8)); setResult(null); setError('') }}
            placeholder="Ej: 12345678"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">DV</label>
          <input
            type="text"
            value={dvIntroducido}
            onChange={(e) => { setDvIntroducido(e.target.value.replace(/[^0-9kK]/g, '').slice(0, 1)); setResult(null); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && validar()}
            placeholder="5"
            maxLength={1}
            className={`${inputClass} sm:w-20 text-center uppercase`}
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button onClick={validar} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
        Validar
      </button>
      {result && (
        <div className={`rounded-xl border-2 p-5 text-center ${result.esValido ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <p className="text-4xl mb-2">{result.esValido ? '✅' : '❌'}</p>
          <p className={`text-lg font-semibold ${result.esValido ? 'text-green-700' : 'text-red-700'}`}>
            {result.esValido ? 'RUT válido' : 'RUT no válido'}
          </p>
          {!result.esValido && <p className="text-sm text-gray-600 mt-2">El dígito verificador correcto es <strong>{result.dvCorrecto}</strong>.</p>}
        </div>
      )}
    </div>
  )
}
