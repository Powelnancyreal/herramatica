'use client'

import { useState } from 'react'
import { barajar, enteroAleatorio } from '@/lib/calc/dev'
import { buttonClass, CopyButton, inputClass } from '@/components/calc-ui'

const BENEFICIOS = {
  calidad: ['calidad que se nota', 'hecho con cuidado', 'lo mejor para ti', 'sin atajos'],
  rapidez: ['al instante', 'sin esperas', 'rápido y fácil', 'cuando lo necesitas'],
  precio: ['al mejor precio', 'que cabe en tu bolsillo', 'ahorra sin sacrificar', 'precio justo'],
  confianza: ['en quien confías', 'siempre contigo', 'tu tranquilidad', 'palabra cumplida'],
  tradicion: ['de toda la vida', 'con sabor a casa', 'tradición que une', 'desde el corazón'],
  innovacion: ['el futuro, hoy', 'pensado diferente', 'un paso adelante', 'nueva forma de hacerlo'],
}

const PLANTILLAS = [
  (n, p, b) => `${n}: ${b}.`,
  (n, p, b) => `${cap(p)} ${b}. ${n}.`,
  (n) => `${n}, simplemente mejor.`,
  (n, p) => `Tu ${p}, a tu manera.`,
  (n, p, b) => `Con ${n}, ${b}.`,
  (n) => `Vive la experiencia ${n}.`,
  (n, p) => `${n}. El ${p} que estabas buscando.`,
  (n, p, b) => `${cap(b)}: eso es ${n}.`,
  (n) => `Si es ${n}, es confiable.`,
  (n, p) => `Más que ${p}, ${n}.`,
  (n, p, b) => `${n} · ${cap(p)} ${b}`,
  (n) => `${n}: hecho para ti.`,
  (n, p) => `Pide ${p}, pide ${n}.`,
  (n) => `Todo empieza con ${n}.`,
]

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export default function GeneradorEsloganes() {
  const [nombre, setNombre] = useState('')
  const [producto, setProducto] = useState('')
  const [valor, setValor] = useState('calidad')
  const [lemas, setLemas] = useState([])

  function generar() {
    const n = nombre.trim() || 'Tu marca'
    const p = producto.trim().toLowerCase() || 'servicio'
    const bs = BENEFICIOS[valor]
    const set = new Set()
    for (const t of barajar(PLANTILLAS)) set.add(t(n, p, bs[enteroAleatorio(0, bs.length - 1)]))
    setLemas([...set].slice(0, 10))
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputClass} placeholder="Nombre del negocio" maxLength={30} />
        <input value={producto} onChange={(e) => setProducto(e.target.value)} className={inputClass} placeholder="¿Qué vendes? Ej: café" maxLength={30} />
        <select value={valor} onChange={(e) => setValor(e.target.value)} className={inputClass} aria-label="Valor principal">
          {Object.keys(BENEFICIOS).map((k) => (
            <option key={k} value={k}>Destacar: {k}</option>
          ))}
        </select>
      </div>
      <button type="button" onClick={generar} className={buttonClass}>📣 Generar eslóganes</button>
      {lemas.length > 0 && (
        <div className="space-y-2">
          {lemas.map((l) => (
            <div key={l} className="flex justify-between items-center gap-3 rounded-lg border border-gray-200 px-4 py-3">
              <span className="text-gray-900 font-medium">{l}</span>
              <CopyButton text={l} />
            </div>
          ))}
          <p className="text-xs text-gray-500">Un buen eslogan tiene menos de 8 palabras, se entiende al leerlo una vez y suena bien en voz alta. Genera varias veces y combina ideas.</p>
        </div>
      )}
    </div>
  )
}
