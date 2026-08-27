'use client'

import { useState } from 'react'

// ─────────────────────────────────────────────────────────────────
// Algoritmo CURP (RENAPO / SEGOB, "Instructivo Normativo para la
// Asignación de la Clave Única de Registro de Población")
// ─────────────────────────────────────────────────────────────────

const ARTICLES = new Set(['DE', 'DEL', 'LA', 'LAS', 'LOS', 'Y', 'MC', 'MAC', 'VAN', 'VON'])
const VOWELS = new Set(['A', 'E', 'I', 'O', 'U'])
const NOMBRES_A_OMITIR = new Set(['MARIA', 'JOSE'])

// Catálogo de combinaciones que la CURP sustituye automáticamente
// (la 2ª letra se cambia por X) para evitar formar palabras ofensivas.
const PALABRAS_INCONVENIENTES = new Set([
  'BACA', 'BUEI', 'BUEY', 'CACA', 'CACO', 'CAGA', 'CAGO', 'CAKA', 'CAKO', 'COGE', 'COJA', 'COJE',
  'COJI', 'COJO', 'COLA', 'CULO', 'FETO', 'GETA', 'GUEY', 'JOTO', 'KACA', 'KACO', 'KAGA', 'KAGO',
  'KAKA', 'KOGE', 'KOJO', 'KULO', 'LILO', 'LOCA', 'LOCO', 'LOKA', 'LOKO', 'MAME', 'MAMO', 'MEAR',
  'MEAS', 'MEON', 'MIAR', 'MION', 'MOCO', 'MOKO', 'MULA', 'MULO', 'NACA', 'NACO', 'PEDA', 'PEDO',
  'PENE', 'PIPI', 'PITO', 'POPO', 'PUTA', 'PUTO', 'QULO', 'RATA', 'RUIN', 'SENO', 'TETA', 'VACA',
  'VAGA', 'VAGO', 'VAKA', 'VUEI', 'VUEY', 'WUEY',
])

export const ESTADOS = [
  { code: 'AS', name: 'Aguascalientes' },
  { code: 'BC', name: 'Baja California' },
  { code: 'BS', name: 'Baja California Sur' },
  { code: 'CC', name: 'Campeche' },
  { code: 'CL', name: 'Coahuila' },
  { code: 'CM', name: 'Colima' },
  { code: 'CS', name: 'Chiapas' },
  { code: 'CH', name: 'Chihuahua' },
  { code: 'DF', name: 'Ciudad de México' },
  { code: 'DG', name: 'Durango' },
  { code: 'GT', name: 'Guanajuato' },
  { code: 'GR', name: 'Guerrero' },
  { code: 'HG', name: 'Hidalgo' },
  { code: 'JC', name: 'Jalisco' },
  { code: 'MC', name: 'México (Estado de México)' },
  { code: 'MN', name: 'Michoacán' },
  { code: 'MS', name: 'Morelos' },
  { code: 'NT', name: 'Nayarit' },
  { code: 'NL', name: 'Nuevo León' },
  { code: 'OC', name: 'Oaxaca' },
  { code: 'PL', name: 'Puebla' },
  { code: 'QT', name: 'Querétaro' },
  { code: 'QR', name: 'Quintana Roo' },
  { code: 'SP', name: 'San Luis Potosí' },
  { code: 'SL', name: 'Sinaloa' },
  { code: 'SR', name: 'Sonora' },
  { code: 'TC', name: 'Tabasco' },
  { code: 'TS', name: 'Tamaulipas' },
  { code: 'TL', name: 'Tlaxcala' },
  { code: 'VZ', name: 'Veracruz' },
  { code: 'YN', name: 'Yucatán' },
  { code: 'ZS', name: 'Zacatecas' },
  { code: 'NE', name: 'Nacido en el extranjero' },
]

// Alfabeto usado por el algoritmo del dígito verificador (posición 24 = Ñ)
const DICCIONARIO = '0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'

function normalize(str) {
  return str
    .trim()
    .toUpperCase()
    .replace(/[ÁÀÄÂ]/g, 'A')
    .replace(/[ÉÈËÊ]/g, 'E')
    .replace(/[ÍÌÏÎ]/g, 'I')
    .replace(/[ÓÒÖÔ]/g, 'O')
    .replace(/[ÚÙÜÛ]/g, 'U')
    .replace(/[^A-ZÑ]/g, '')
}

function getFirstRelevantWord(str) {
  const parts = str.trim().split(/\s+/)
  for (const part of parts) {
    const n = normalize(part)
    if (n && !ARTICLES.has(n)) return n
  }
  return normalize(parts[0] || '')
}

function getNombreParaClave(nombreStr) {
  const parts = nombreStr
    .trim()
    .split(/\s+/)
    .map(normalize)
    .filter(Boolean)
  if (parts.length > 1 && NOMBRES_A_OMITIR.has(parts[0])) return parts[1]
  return parts[0] || ''
}

function getFirstInternalVowel(str) {
  for (let i = 1; i < str.length; i++) {
    if (VOWELS.has(str[i])) return str[i]
  }
  return 'X'
}

function getFirstInternalConsonant(str) {
  for (let i = 1; i < str.length; i++) {
    if (!VOWELS.has(str[i])) return str[i]
  }
  return 'X'
}

function aplicarFiltroInconveniente(cuatroLetras) {
  if (PALABRAS_INCONVENIENTES.has(cuatroLetras)) {
    return cuatroLetras[0] + 'X' + cuatroLetras.slice(2)
  }
  return cuatroLetras
}

function valorCaracter(c) {
  const idx = DICCIONARIO.indexOf(c)
  return idx === -1 ? 0 : idx
}

export function calcularDigitoVerificador(primeros17) {
  let suma = 0
  for (let i = 0; i < 17; i++) {
    suma += valorCaracter(primeros17[i] || '0') * (18 - i)
  }
  const residuo = suma % 10
  return String((10 - residuo) % 10)
}

export function calcularCURP({ nombre, apPaterno, apMaterno, fechaNac, sexo, estado }) {
  const pat = getFirstRelevantWord(apPaterno)
  const mat = apMaterno?.trim() ? getFirstRelevantWord(apMaterno) : ''
  const nom = getNombreParaClave(nombre)

  let letras4 = (pat[0] || 'X') + getFirstInternalVowel(pat) + (mat ? mat[0] : 'X') + (nom[0] || 'X')
  letras4 = aplicarFiltroInconveniente(letras4)

  const [year, month, day] = fechaNac.split('-')
  const fecha = year.slice(2) + month + day

  const c14 = getFirstInternalConsonant(pat)
  const c15 = mat ? getFirstInternalConsonant(mat) : 'X'
  const c16 = getFirstInternalConsonant(nom)

  const diferenciador = parseInt(year, 10) >= 2000 ? 'A' : '0'

  const primeros17 = `${letras4}${fecha}${sexo}${estado}${c14}${c15}${c16}${diferenciador}`
  return primeros17 + calcularDigitoVerificador(primeros17)
}

// ─────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalcularCURP() {
  const [form, setForm] = useState({ nombre: '', apPaterno: '', apMaterno: '', fechaNac: '', sexo: 'H', estado: 'DF' })
  const [curp, setCurp] = useState('')
  const [errors, setErrors] = useState({})
  const [copied, setCopied] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  function validate() {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'Introduce tu nombre o nombres.'
    if (!form.apPaterno.trim()) e.apPaterno = 'El apellido paterno es obligatorio.'
    if (!form.fechaNac) e.fechaNac = 'Selecciona tu fecha de nacimiento.'
    else if (form.fechaNac > today) e.fechaNac = 'La fecha de nacimiento no puede ser en el futuro.'
    return e
  }

  function handleCalcular() {
    const e = validate()
    if (Object.keys(e).length) {
      setErrors(e)
      setCurp('')
      return
    }
    setErrors({})
    setCurp(calcularCURP(form))
    setCopied(false)
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(curp)
    } catch {
      const el = document.createElement('textarea')
      el.value = curp
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nombre(s)</label>
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            placeholder="Ej: María Fernanda"
            className={`${inputClass} ${errors.nombre ? 'border-red-400' : ''}`}
          />
          {errors.nombre && <p className="mt-1 text-xs text-red-600">{errors.nombre}</p>}
        </div>

        <div>
          <label className={labelClass}>Apellido paterno</label>
          <input
            type="text"
            value={form.apPaterno}
            onChange={(e) => handleChange('apPaterno', e.target.value)}
            placeholder="Ej: López"
            className={`${inputClass} ${errors.apPaterno ? 'border-red-400' : ''}`}
          />
          {errors.apPaterno && <p className="mt-1 text-xs text-red-600">{errors.apPaterno}</p>}
        </div>

        <div>
          <label className={labelClass}>
            Apellido materno <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <input
            type="text"
            value={form.apMaterno}
            onChange={(e) => handleChange('apMaterno', e.target.value)}
            placeholder="Ej: García"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Fecha de nacimiento</label>
          <input
            type="date"
            value={form.fechaNac}
            max={today}
            onChange={(e) => handleChange('fechaNac', e.target.value)}
            className={`${inputClass} ${errors.fechaNac ? 'border-red-400' : ''}`}
          />
          {errors.fechaNac && <p className="mt-1 text-xs text-red-600">{errors.fechaNac}</p>}
        </div>

        <div>
          <label className={labelClass}>Sexo</label>
          <select value={form.sexo} onChange={(e) => handleChange('sexo', e.target.value)} className={inputClass}>
            <option value="H">Hombre</option>
            <option value="M">Mujer</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Estado de nacimiento</label>
          <select value={form.estado} onChange={(e) => handleChange('estado', e.target.value)} className={inputClass}>
            {ESTADOS.map((e) => (
              <option key={e.code} value={e.code}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={handleCalcular}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Calcular CURP
      </button>

      {curp && (
        <div className="space-y-3 pt-1">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="text-sm font-medium text-blue-600 mb-2">Tu CURP calculada</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-[0.15em] font-mono break-all">{curp}</p>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">
              * La posición 17 usa el valor asignado por defecto (0 antes del año 2000, A a partir de 2000). En un
              pequeño porcentaje de casos con nombre, apellidos, sexo, fecha y estado idénticos a otra persona, RENAPO
              asigna un valor distinto para evitar duplicados. Verifica siempre tu CURP oficial en{' '}
              <span className="font-medium">renapo.gob.mx</span>.
            </p>
          </div>

          <button
            onClick={handleCopy}
            className={`w-full font-semibold py-3 px-6 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              copied ? 'bg-green-500 text-white focus:ring-green-400' : 'bg-gray-900 hover:bg-gray-800 text-white focus:ring-gray-700'
            }`}
          >
            {copied ? '¡CURP copiada!' : 'Copiar CURP'}
          </button>
        </div>
      )}
    </div>
  )
}
