'use client'

import { useState } from 'react'

// ─────────────────────────────────────────────────────────────────
// Dígito de verificación del NIT colombiano (Orden Administrativa
// 4 de 1989, DIAN) — algoritmo del módulo 11 con pesos primos.
// ─────────────────────────────────────────────────────────────────

const PESOS_NIT = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71]

export function calcularDVNIT(numeroBase) {
  const digitos = numeroBase.split('').reverse().map(Number)
  let suma = 0
  for (let i = 0; i < digitos.length; i++) {
    suma += digitos[i] * PESOS_NIT[i]
  }
  const resto = suma % 11
  return resto <= 1 ? resto : 11 - resto
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white font-mono'

const TABS = [
  { id: 'calcular', label: 'Calcular DV' },
  { id: 'validar', label: 'Validar NIT' },
]

export default function CalcularNIT() {
  const [tab, setTab] = useState('calcular')

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              tab === t.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
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
    const limpio = numero.replace(/\D/g, '')
    if (!/^\d{5,15}$/.test(limpio)) return setError('Introduce el NIT sin el dígito de verificación (entre 5 y 15 dígitos).')
    setError('')
    setResult({ numero: limpio, dv: calcularDVNIT(limpio) })
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">NIT (sin dígito de verificación)</label>
        <input
          type="text"
          value={numero}
          onChange={(e) => { setNumero(e.target.value.replace(/\D/g, '')); setResult(null); setError('') }}
          onKeyDown={(e) => e.key === 'Enter' && calcular()}
          placeholder="Ej: 900123456"
          maxLength={15}
          className={inputClass}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button onClick={calcular} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
        Calcular dígito de verificación
      </button>
      {result && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">NIT completo</p>
          <p className="text-4xl font-bold text-blue-700 font-mono">
            {result.numero}-<span className="text-green-600">{result.dv}</span>
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
    const limpio = numero.replace(/\D/g, '')
    if (!/^\d{5,15}$/.test(limpio)) return setError('Introduce el NIT sin el dígito de verificación.')
    if (!/^\d$/.test(dvIntroducido)) return setError('Introduce el dígito de verificación (un solo número).')
    setError('')
    const dvCorrecto = calcularDVNIT(limpio)
    setResult({ esValido: Number(dvIntroducido) === dvCorrecto, dvCorrecto })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">NIT (sin dígito de verificación)</label>
          <input
            type="text"
            value={numero}
            onChange={(e) => { setNumero(e.target.value.replace(/\D/g, '')); setResult(null); setError('') }}
            placeholder="Ej: 900123456"
            maxLength={15}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">DV</label>
          <input
            type="text"
            value={dvIntroducido}
            onChange={(e) => { setDvIntroducido(e.target.value.replace(/\D/g, '').slice(0, 1)); setResult(null); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && validar()}
            placeholder="4"
            maxLength={1}
            className={`${inputClass} sm:w-20 text-center`}
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
            {result.esValido ? 'NIT válido' : 'NIT no válido'}
          </p>
          {!result.esValido && <p className="text-sm text-gray-600 mt-2">El dígito de verificación correcto es <strong>{result.dvCorrecto}</strong>.</p>}
        </div>
      )}
    </div>
  )
}
