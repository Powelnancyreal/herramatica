'use client'

import { useEffect, useState } from 'react'

const SETS = {
  mayusculas: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  minusculas: 'abcdefghijklmnopqrstuvwxyz',
  numeros: '0123456789',
  simbolos: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}
const AMBIGUOS = 'Il1O0oB8'

function generarContrasena(longitud, opciones) {
  let charset = ''
  if (opciones.mayusculas) charset += SETS.mayusculas
  if (opciones.minusculas) charset += SETS.minusculas
  if (opciones.numeros) charset += SETS.numeros
  if (opciones.simbolos) charset += SETS.simbolos
  if (!charset) return ''

  if (opciones.excluirAmbiguos) {
    charset = [...charset].filter((c) => !AMBIGUOS.includes(c)).join('')
  }
  if (!charset) return ''

  const valores = new Uint32Array(longitud)
  crypto.getRandomValues(valores)
  let resultado = ''
  for (let i = 0; i < longitud; i++) {
    resultado += charset[valores[i] % charset.length]
  }
  return resultado
}

function evaluarFuerza(longitud, opciones) {
  let tamañoCharset = 0
  if (opciones.mayusculas) tamañoCharset += 26
  if (opciones.minusculas) tamañoCharset += 26
  if (opciones.numeros) tamañoCharset += 10
  if (opciones.simbolos) tamañoCharset += SETS.simbolos.length
  if (tamañoCharset === 0) return { entropia: 0, nivel: 'Ninguna', color: 'bg-gray-300' }

  const entropia = longitud * Math.log2(tamañoCharset)
  if (entropia < 40) return { entropia, nivel: 'Débil', color: 'bg-red-500' }
  if (entropia < 60) return { entropia, nivel: 'Media', color: 'bg-amber-500' }
  if (entropia < 80) return { entropia, nivel: 'Fuerte', color: 'bg-green-500' }
  return { entropia, nivel: 'Muy fuerte', color: 'bg-green-600' }
}

export default function GeneradorContrasenas() {
  const [longitud, setLongitud] = useState(16)
  const [opciones, setOpciones] = useState({
    mayusculas: true,
    minusculas: true,
    numeros: true,
    simbolos: true,
    excluirAmbiguos: false,
  })
  const [password, setPassword] = useState('')
  const [historial, setHistorial] = useState([])
  const [copiado, setCopiado] = useState(false)

  function regenerar(nuevaLongitud = longitud, nuevasOpciones = opciones) {
    const p = generarContrasena(nuevaLongitud, nuevasOpciones)
    setPassword(p)
    setCopiado(false)
    if (p) setHistorial((h) => [p, ...h].slice(0, 5))
  }

  useEffect(() => {
    regenerar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function toggleOpcion(key) {
    const nuevas = { ...opciones, [key]: !opciones[key] }
    const algunaSeleccionada = ['mayusculas', 'minusculas', 'numeros', 'simbolos'].some((k) => (k === key ? nuevas[k] : opciones[k]))
    if (!algunaSeleccionada) return
    setOpciones(nuevas)
    regenerar(longitud, nuevas)
  }

  function cambiarLongitud(valor) {
    setLongitud(valor)
    regenerar(valor, opciones)
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(password)
    } catch {
      const el = document.createElement('textarea')
      el.value = password
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const fuerza = evaluarFuerza(longitud, opciones)

  return (
    <div className="space-y-5">
      {/* Password display */}
      <div className="bg-gray-900 rounded-xl px-4 py-5 flex items-center justify-between gap-3">
        <p className="text-white text-lg sm:text-2xl font-mono break-all">{password || 'Selecciona al menos un tipo de carácter'}</p>
        <button
          onClick={() => regenerar()}
          className="flex-shrink-0 text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
          title="Generar otra"
        >
          🔄
        </button>
      </div>

      {/* Strength meter */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Fortaleza: {fuerza.nivel}</span>
          <span>{Math.round(fuerza.entropia)} bits de entropía</span>
        </div>
        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
          <div className={`h-full rounded-full transition-all ${fuerza.color}`} style={{ width: `${Math.min((fuerza.entropia / 100) * 100, 100)}%` }} />
        </div>
      </div>

      <button
        onClick={copiar}
        disabled={!password}
        className={`w-full font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
          copiado ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {copiado ? '¡Contraseña copiada!' : 'Copiar contraseña'}
      </button>

      {/* Length */}
      <div>
        <div className="flex justify-between text-sm mb-1.5">
          <label className="font-medium text-gray-700">Longitud</label>
          <span className="font-semibold text-gray-900">{longitud} caracteres</span>
        </div>
        <input
          type="range"
          min="4"
          max="64"
          value={longitud}
          onChange={(e) => cambiarLongitud(parseInt(e.target.value, 10))}
          className="w-full accent-blue-600"
        />
      </div>

      {/* Options */}
      <div className="space-y-2">
        {[
          { key: 'mayusculas', label: 'Mayúsculas (A-Z)' },
          { key: 'minusculas', label: 'Minúsculas (a-z)' },
          { key: 'numeros', label: 'Números (0-9)' },
          { key: 'simbolos', label: 'Símbolos (!@#$...)' },
          { key: 'excluirAmbiguos', label: 'Excluir caracteres ambiguos (l, 1, I, O, 0...)' },
        ].map((opt) => (
          <label key={opt.key} className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={opciones[opt.key]}
              onChange={() => toggleOpcion(opt.key)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            {opt.label}
          </label>
        ))}
      </div>

      {/* History */}
      {historial.length > 1 && (
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Generadas recientemente</h3>
          <div className="space-y-1">
            {historial.slice(1).map((p, i) => (
              <button
                key={i}
                onClick={() => {
                  setPassword(p)
                  setCopiado(false)
                }}
                className="w-full text-left px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 font-mono text-xs text-gray-600 truncate transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
