'use client'

import { useState } from 'react'

// --- RFC algorithm ---

const ARTICLES = new Set(['DE', 'DEL', 'LA', 'LAS', 'LOS', 'Y', 'MC', 'MAC', 'VAN', 'VON'])
const VOWELS = new Set(['A', 'E', 'I', 'O', 'U'])

function normalize(str) {
  return str
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[^A-Z]/g, '')           // letters only
}

function getFirstInternalVowel(str) {
  for (let i = 1; i < str.length; i++) {
    if (VOWELS.has(str[i])) return str[i]
  }
  return 'X'
}

function getFirstRelevantName(nombreStr) {
  const parts = nombreStr.trim().split(/\s+/)
  for (const part of parts) {
    const n = normalize(part)
    if (n && !ARTICLES.has(n)) return n
  }
  return normalize(parts[0]) || 'X'
}

function buildRFC(nombre, apPaterno, apMaterno, fechaNac) {
  const pat = normalize(apPaterno)
  const mat = apMaterno?.trim() ? normalize(apMaterno) : ''
  const nom = getFirstRelevantName(nombre)

  const c1 = pat[0] || 'X'
  const c2 = getFirstInternalVowel(pat)
  const c3 = mat ? mat[0] : 'X'
  const c4 = nom[0] || 'X'

  const [year, month, day] = fechaNac.split('-')
  const fecha = year.slice(2) + month + day

  return `${c1}${c2}${c3}${c4}${fecha}`
}

// --- Component ---

const FIELDS = {
  nombre:     { label: 'Nombre(s)',         placeholder: 'Ej: Juan Carlos', required: true },
  apPaterno:  { label: 'Apellido paterno',  placeholder: 'Ej: López',       required: true },
  apMaterno:  { label: 'Apellido materno',  placeholder: 'Ej: García',      required: false, optional: true },
  fechaNac:   { label: 'Fecha de nacimiento', type: 'date',                  required: true },
}

export default function CalculadoraRFC() {
  const [form, setForm] = useState({ nombre: '', apPaterno: '', apMaterno: '', fechaNac: '' })
  const [rfc, setRfc] = useState('')
  const [errors, setErrors] = useState({})
  const [copied, setCopied] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  function validate() {
    const e = {}
    if (!form.nombre.trim())    e.nombre    = 'Introduce tu nombre o nombres.'
    if (!form.apPaterno.trim()) e.apPaterno = 'El apellido paterno es obligatorio.'
    if (!form.fechaNac)         e.fechaNac  = 'Selecciona tu fecha de nacimiento.'
    return e
  }

  function handleCalculate() {
    const e = validate()
    if (Object.keys(e).length) {
      setErrors(e)
      setRfc('')
      return
    }
    setErrors({})
    setRfc(buildRFC(form.nombre, form.apPaterno, form.apMaterno, form.fechaNac))
    setCopied(false)
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(rfc)
    } catch {
      const el = document.createElement('textarea')
      el.value = rfc
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* 2-column grid on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Nombre(s)
          </label>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            placeholder="Ej: Juan Carlos"
            className={`w-full border rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
              errors.nombre ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.nombre && <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>}
        </div>

        {/* Apellido paterno */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Apellido paterno
          </label>
          <input
            type="text"
            value={form.apPaterno}
            onChange={(e) => handleChange('apPaterno', e.target.value)}
            placeholder="Ej: López"
            className={`w-full border rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
              errors.apPaterno ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.apPaterno && <p className="mt-1 text-xs text-red-600">{errors.apPaterno}</p>}
        </div>

        {/* Apellido materno */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Apellido materno{' '}
            <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <input
            type="text"
            value={form.apMaterno}
            onChange={(e) => handleChange('apMaterno', e.target.value)}
            placeholder="Ej: García"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
          <p className="mt-1 text-xs text-gray-400">Si no tienes, se usará X automáticamente.</p>
        </div>

        {/* Fecha de nacimiento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Fecha de nacimiento
          </label>
          <input
            type="date"
            value={form.fechaNac}
            max={today}
            onChange={(e) => handleChange('fechaNac', e.target.value)}
            className={`w-full border rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
              errors.fechaNac ? 'border-red-400' : 'border-gray-300'
            }`}
          />
          {errors.fechaNac && <p className="mt-1 text-xs text-red-600">{errors.fechaNac}</p>}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleCalculate}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Calcular RFC
      </button>

      {/* Result */}
      {rfc && (
        <div className="space-y-3 pt-1">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="text-sm font-medium text-blue-600 mb-2">RFC generado (clave base)</p>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-[0.2em] font-mono">
              {rfc}
            </p>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              * Clave base sin homoclave. El RFC oficial con homoclave solo lo emite el SAT.
            </p>
          </div>

          <button
            onClick={handleCopy}
            className={`w-full font-semibold py-3 px-6 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              copied
                ? 'bg-green-500 text-white focus:ring-green-400'
                : 'bg-gray-900 hover:bg-gray-800 text-white focus:ring-gray-700'
            }`}
          >
            {copied ? '¡RFC copiado!' : 'Copiar RFC'}
          </button>
        </div>
      )}
    </div>
  )
}
