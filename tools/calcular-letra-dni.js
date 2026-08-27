'use client'

import { useState } from 'react'

// ─────────────────────────────────────────────────────────────────
// Algoritmo oficial del dígito de control del DNI/NIE español (módulo 23)
// ─────────────────────────────────────────────────────────────────

const TABLA_LETRAS = 'TRWAGMYFPDXBNJZSQVHLCKE'
const PREFIJOS_NIE = { X: '0', Y: '1', Z: '2' }

export function calcularLetra(numero) {
  return TABLA_LETRAS[numero % 23]
}

// Convierte el número de DNI (string de 8 dígitos) o NIE (X/Y/Z + 7 dígitos) a un entero para el módulo 23
export function numeroParaCalculo(tipo, digitos) {
  if (tipo === 'dni') return parseInt(digitos, 10)
  const prefijo = PREFIJOS_NIE[digitos[0].toUpperCase()]
  return parseInt(prefijo + digitos.slice(1), 10)
}

export function letraParaDNI(digitos8) {
  return calcularLetra(numeroParaCalculo('dni', digitos8))
}

export function letraParaNIE(letraInicial, digitos7) {
  return calcularLetra(numeroParaCalculo('nie', letraInicial + digitos7))
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white font-mono uppercase'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

const TABS = [
  { id: 'calcular', label: 'Calcular letra' },
  { id: 'validar', label: 'Validar DNI/NIE' },
]

export default function CalcularLetraDNI() {
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
  const [tipo, setTipo] = useState('dni')
  const [valor, setValor] = useState('')
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState('')

  function handleChange(v) {
    setValor(v.toUpperCase())
    setResultado(null)
    setError('')
  }

  function calcular() {
    const v = valor.trim()
    if (tipo === 'dni') {
      if (!/^\d{1,8}$/.test(v)) return setError('Introduce hasta 8 dígitos numéricos (sin la letra).')
      const digitos = v.padStart(8, '0')
      setResultado({ documento: `${digitos}`, letra: letraParaDNI(digitos) })
    } else {
      if (!/^[XYZ]\d{1,7}$/.test(v)) return setError('Introduce X, Y o Z seguido de hasta 7 dígitos (sin la letra final).')
      const letraInicial = v[0]
      const digitos = v.slice(1).padStart(7, '0')
      setResultado({ documento: `${letraInicial}${digitos}`, letra: letraParaNIE(letraInicial, digitos) })
    }
    setError('')
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <button
          onClick={() => { setTipo('dni'); setValor(''); setResultado(null); setError('') }}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tipo === 'dni' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400' : 'bg-gray-100 text-gray-500'}`}
        >
          DNI
        </button>
        <button
          onClick={() => { setTipo('nie'); setValor(''); setResultado(null); setError('') }}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tipo === 'nie' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400' : 'bg-gray-100 text-gray-500'}`}
        >
          NIE
        </button>
      </div>

      <div>
        <label className={labelClass}>{tipo === 'dni' ? 'Número de DNI (8 dígitos, sin letra)' : 'NIE (X/Y/Z + hasta 7 dígitos, sin letra)'}</label>
        <input
          type="text"
          value={valor}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && calcular()}
          placeholder={tipo === 'dni' ? 'Ej: 12345678' : 'Ej: X1234567'}
          maxLength={tipo === 'dni' ? 8 : 8}
          className={inputClass}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={calcular}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Calcular letra
      </button>

      {resultado && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            {tipo === 'dni' ? 'DNI completo' : 'NIE completo'}
          </p>
          <p className="text-4xl font-bold text-blue-700 font-mono tracking-widest">
            {resultado.documento}
            <span className="text-green-600">{resultado.letra}</span>
          </p>
        </div>
      )}
    </div>
  )
}

function ValidarTab() {
  const [valor, setValor] = useState('')
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState('')

  function handleChange(v) {
    setValor(v.toUpperCase().replace(/[^0-9A-Z]/g, ''))
    setResultado(null)
    setError('')
  }

  function validar() {
    const v = valor.trim()
    let esDNI = /^\d{8}[A-Z]$/.test(v)
    let esNIE = /^[XYZ]\d{7}[A-Z]$/.test(v)

    if (!esDNI && !esNIE) {
      return setError('Introduce un DNI (8 dígitos + letra) o un NIE (X/Y/Z + 7 dígitos + letra) completo.')
    }
    setError('')

    let letraCorrecta
    let digitos
    if (esDNI) {
      digitos = v.slice(0, 8)
      letraCorrecta = letraParaDNI(digitos)
    } else {
      digitos = v.slice(0, 8)
      letraCorrecta = letraParaNIE(v[0], v.slice(1, 8))
    }
    const letraIntroducida = v[8]

    setResultado({
      tipo: esDNI ? 'DNI' : 'NIE',
      digitos,
      letraIntroducida,
      letraCorrecta,
      esValido: letraIntroducida === letraCorrecta,
    })
  }

  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>DNI o NIE completo (con letra)</label>
        <input
          type="text"
          value={valor}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && validar()}
          placeholder="Ej: 12345678Z o X1234567L"
          maxLength={9}
          className={inputClass}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={validar}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Validar
      </button>

      {resultado && (
        <div className={`rounded-xl border-2 p-5 text-center ${resultado.esValido ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <p className="text-4xl font-bold mb-2">{resultado.esValido ? '✅' : '❌'}</p>
          <p className={`text-lg font-semibold ${resultado.esValido ? 'text-green-700' : 'text-red-700'}`}>
            {resultado.esValido ? `${resultado.tipo} válido` : `${resultado.tipo} no válido`}
          </p>
          {!resultado.esValido && (
            <p className="text-sm text-gray-600 mt-2">
              La letra correcta para {resultado.digitos} es <strong>{resultado.letraCorrecta}</strong>, no {resultado.letraIntroducida}.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
