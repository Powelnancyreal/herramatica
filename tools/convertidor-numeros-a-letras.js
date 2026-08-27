'use client'

import { useState } from 'react'

const UNIDADES = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve']
const ESPECIALES_10_19 = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve']
const VEINTI = { 1: 'veintiuno', 2: 'veintidós', 3: 'veintitrés', 4: 'veinticuatro', 5: 'veinticinco', 6: 'veintiséis', 7: 'veintisiete', 8: 'veintiocho', 9: 'veintinueve' }
const DECENAS = { 3: 'treinta', 4: 'cuarenta', 5: 'cincuenta', 6: 'sesenta', 7: 'setenta', 8: 'ochenta', 9: 'noventa' }
const CENTENAS = { 1: 'ciento', 2: 'doscientos', 3: 'trescientos', 4: 'cuatrocientos', 5: 'quinientos', 6: 'seiscientos', 7: 'setecientos', 8: 'ochocientos', 9: 'novecientos' }

function convertirDecenas(n) {
  if (n < 10) return UNIDADES[n]
  if (n < 20) return ESPECIALES_10_19[n - 10]
  if (n === 20) return 'veinte'
  const d = Math.floor(n / 10)
  const u = n % 10
  if (d === 2) return u === 0 ? 'veinte' : VEINTI[u]
  const base = DECENAS[d]
  return u === 0 ? base : `${base} y ${UNIDADES[u]}`
}

function convertirGrupo(n) {
  if (n === 0) return ''
  if (n === 100) return 'cien'
  const c = Math.floor(n / 100)
  const resto = n % 100
  const partes = []
  if (c > 0) partes.push(CENTENAS[c])
  if (resto > 0) partes.push(convertirDecenas(resto))
  return partes.join(' ')
}

// Apocope: "uno" -> "un" / "veintiuno" -> "veintiún" cuando precede a "mil" o "millones"
function apocopeUno(texto) {
  if (texto.endsWith('veintiuno')) return texto.slice(0, -'veintiuno'.length) + 'veintiún'
  if (texto === 'uno') return 'un'
  if (texto.endsWith(' uno')) return texto.slice(0, -3) + 'un'
  return texto
}

export function convertirEnteroALetras(n) {
  if (n === 0) return 'cero'
  if (n < 0) return 'menos ' + convertirEnteroALetras(-n)

  const millonesGrupo = Math.floor(n / 1000000)
  const milesGrupo = Math.floor((n % 1000000) / 1000)
  const unidadesGrupo = n % 1000

  const partes = []
  if (millonesGrupo > 0) {
    if (millonesGrupo === 1) partes.push('un millón')
    else partes.push(`${apocopeUno(convertirGrupo(millonesGrupo))} millones`)
  }
  if (milesGrupo > 0) {
    if (milesGrupo === 1) partes.push('mil')
    else partes.push(`${apocopeUno(convertirGrupo(milesGrupo))} mil`)
  }
  if (unidadesGrupo > 0 || partes.length === 0) {
    partes.push(convertirGrupo(unidadesGrupo))
  }
  return partes.join(' ')
}

export function convertirNumero(valor, modoMoneda) {
  const negativo = valor < 0
  const absoluto = Math.abs(valor)
  const parteEntera = Math.floor(absoluto)
  const centavos = Math.round((absoluto - parteEntera) * 100)

  let texto = convertirEnteroALetras(parteEntera)
  texto = texto.charAt(0).toUpperCase() + texto.slice(1)
  if (negativo) texto = 'Menos ' + texto.toLowerCase().replace(/^menos /, '')

  if (modoMoneda) {
    const centavosStr = String(centavos).padStart(2, '0')
    return `${texto} PESOS ${centavosStr}/100 M.N.`
  }
  if (centavos > 0) {
    return `${texto} punto ${convertirEnteroALetras(centavos)}`
  }
  return texto
}

const LIMITE = 999999999

export default function ConvertidorNumerosALetras() {
  const [numero, setNumero] = useState('')
  const [modoMoneda, setModoMoneda] = useState(false)
  const [error, setError] = useState('')
  const [resultado, setResultado] = useState('')
  const [copiado, setCopiado] = useState(false)

  function handleConvertir() {
    const valor = parseFloat(numero)
    if (numero === '' || isNaN(valor)) return setError('Introduce un número válido.')
    if (Math.abs(valor) > LIMITE) return setError(`Esta herramienta admite números hasta ${LIMITE.toLocaleString('es')}.`)
    setError('')
    setResultado(convertirNumero(valor, modoMoneda))
    setCopiado(false)
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(resultado)
    } catch {
      /* noop */
    }
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Número</label>
        <input
          type="number"
          inputMode="decimal"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleConvertir()}
          placeholder="Ej: 1234.56"
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={modoMoneda} onChange={(e) => setModoMoneda(e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
        Formato de cheque (PESOS XX/100 M.N.)
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleConvertir}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Convertir a letras
      </button>

      {resultado && (
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="text-sm font-medium text-blue-600 mb-2">En letras</p>
            <p className="text-xl font-semibold text-gray-900 capitalize leading-relaxed">{resultado}</p>
          </div>
          <button
            onClick={copiar}
            className={`w-full font-semibold py-3 px-6 rounded-lg transition-all ${
              copiado ? 'bg-green-500 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'
            }`}
          >
            {copiado ? '¡Copiado!' : 'Copiar'}
          </button>
        </div>
      )}
    </div>
  )
}
