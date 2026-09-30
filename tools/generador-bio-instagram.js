'use client'

import { useState } from 'react'
import { barajar } from '@/lib/calc/dev'
import { buttonClass, CopyButton, inputClass } from '@/components/calc-ui'

const LIMITE = 150
const EMOJIS = {
  profesional: ['💼', '📈', '🎯', '✅', '📩'],
  creativo: ['🎨', '✨', '📸', '🎬', '🌈'],
  viajero: ['✈️', '🌍', '🗺️', '🏝️', '📍'],
  fitness: ['💪', '🏋️', '🥗', '🏃', '🔥'],
  foodie: ['🍕', '🌮', '☕', '🍰', '👩‍🍳'],
  minimalista: ['·', '—', '|', '/', '○'],
}

// Negritas matemáticas Unicode (A-Z, a-z, 0-9) para resaltar el nombre.
function negritas(t) {
  return [...t]
    .map((c) => {
      const code = c.codePointAt(0)
      if (code >= 65 && code <= 90) return String.fromCodePoint(0x1d400 + code - 65)
      if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d41a + code - 97)
      if (code >= 48 && code <= 57) return String.fromCodePoint(0x1d7ce + code - 48)
      return c
    })
    .join('')
}

function crearBios({ nombre, rol, intereses, ubicacion, cta, estilo, destacar }) {
  const e = EMOJIS[estilo]
  const n = destacar && nombre ? negritas(nombre) : nombre
  const ints = intereses.split(',').map((x) => x.trim()).filter(Boolean)
  const lineaInt = ints.length ? ints.slice(0, 3).join(estilo === 'minimalista' ? ' · ' : ` ${e[4]} `) : ''
  const ubi = ubicacion ? `📍 ${ubicacion}` : ''
  const llamada = cta ? `${estilo === 'minimalista' ? '↓' : '👇'} ${cta}` : ''
  const plantillas = [
    [n && `${e[0]} ${n}`, rol, lineaInt, ubi, llamada],
    [rol && `${rol} ${e[1]}`, lineaInt && `Hablo de ${ints.slice(0, 3).join(', ')}`, ubi, llamada],
    [n, rol && `${e[2]} ${rol}`, lineaInt && `${e[3]} ${lineaInt}`, llamada],
    [n && rol ? `${n} | ${rol}` : n || rol, ints[0] && `Amante de ${ints[0]}${ints[1] ? ` y ${ints[1]}` : ''} ${e[1]}`, ubi, llamada],
    [rol && `${e[0]} ${rol}${ubicacion ? ` en ${ubicacion}` : ''}`, lineaInt, `${e[3]} Aquí comparto lo que aprendo`, llamada],
  ]
  return barajar(plantillas.map((p) => p.filter(Boolean).join('\n')).filter((b) => b.trim()))
}

export default function GeneradorBioInstagram() {
  const [datos, setDatos] = useState({ nombre: '', rol: '', intereses: '', ubicacion: '', cta: '', estilo: 'creativo', destacar: true })
  const [bios, setBios] = useState([])
  const cambiar = (k, v) => setDatos((d) => ({ ...d, [k]: v }))

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input value={datos.nombre} onChange={(e) => cambiar('nombre', e.target.value)} className={inputClass} placeholder="Nombre o marca" maxLength={30} />
        <input value={datos.rol} onChange={(e) => cambiar('rol', e.target.value)} className={inputClass} placeholder="¿A qué te dedicas? Ej: Fotógrafa de bodas" maxLength={40} />
        <input value={datos.intereses} onChange={(e) => cambiar('intereses', e.target.value)} className={inputClass} placeholder="Intereses separados por comas: café, viajes, libros" />
        <input value={datos.ubicacion} onChange={(e) => cambiar('ubicacion', e.target.value)} className={inputClass} placeholder="Ciudad (opcional)" maxLength={30} />
        <input value={datos.cta} onChange={(e) => cambiar('cta', e.target.value)} className={inputClass} placeholder="Llamada a la acción: Agenda tu sesión" maxLength={40} />
        <select value={datos.estilo} onChange={(e) => cambiar('estilo', e.target.value)} className={inputClass} aria-label="Estilo">
          {Object.keys(EMOJIS).map((k) => (
            <option key={k} value={k}>Estilo {k} {EMOJIS[k][0]}</option>
          ))}
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={datos.destacar} onChange={(e) => cambiar('destacar', e.target.checked)} /> Poner el nombre en 𝐧𝐞𝐠𝐫𝐢𝐭𝐚𝐬 (letras Unicode)
      </label>
      <button type="button" onClick={() => setBios(crearBios(datos))} disabled={!datos.nombre && !datos.rol} className={buttonClass}>Generar biografías</button>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {bios.map((b) => {
          const largo = [...b].length
          return (
            <div key={b} className="rounded-xl border border-gray-200 p-4 space-y-2">
              <p className="whitespace-pre-line text-sm text-gray-900">{b}</p>
              <div className="flex justify-between items-center">
                <span className={`text-xs ${largo > LIMITE ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>{largo}/{LIMITE} caracteres{largo > LIMITE ? ' · demasiado larga' : ''}</span>
                <CopyButton text={b} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
