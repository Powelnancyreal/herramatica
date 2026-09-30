'use client'

import { useState } from 'react'
import { barajar, enteroAleatorio } from '@/lib/calc/dev'
import { buttonClass, CopyButton, inputClass } from '@/components/calc-ui'

const SECTORES = {
  tecnologia: { label: 'Tecnología y software', palabras: ['Código', 'Nube', 'Pixel', 'Byte', 'Nodo', 'Lógica', 'Red', 'Datos'], sufijos: ['Labs', 'Tech', 'Soft', 'Digital', 'Sistemas', 'IO'] },
  comida: { label: 'Restaurante y comida', palabras: ['Sazón', 'Fogón', 'Comal', 'Cazuela', 'Maíz', 'Canela', 'Olivo', 'Leña'], sufijos: ['Cocina', 'Bistró', 'Taller', 'Mesa', 'Antojería', 'Casa'] },
  moda: { label: 'Moda y belleza', palabras: ['Seda', 'Aura', 'Brillo', 'Encanto', 'Esencia', 'Musa', 'Lino', 'Perla'], sufijos: ['Studio', 'Boutique', 'Atelier', 'Moda', 'Style', 'Beauty'] },
  salud: { label: 'Salud y bienestar', palabras: ['Vital', 'Alma', 'Equilibrio', 'Raíz', 'Sana', 'Fénix', 'Aire', 'Loto'], sufijos: ['Salud', 'Clínica', 'Wellness', 'Centro', 'Vida', 'Care'] },
  construccion: { label: 'Construcción e inmobiliaria', palabras: ['Cimiento', 'Roca', 'Pilar', 'Muro', 'Horizonte', 'Tierra', 'Viga', 'Terraza'], sufijos: ['Constructora', 'Desarrollos', 'Inmobiliaria', 'Obras', 'Proyectos', 'Hábitat'] },
  consultoria: { label: 'Consultoría y servicios', palabras: ['Brújula', 'Puente', 'Clave', 'Enfoque', 'Visión', 'Norte', 'Ruta', 'Faro'], sufijos: ['Consultores', 'Asesores', 'Partners', 'Group', 'Estrategia', 'Solutions'] },
  educacion: { label: 'Educación', palabras: ['Saber', 'Mente', 'Semilla', 'Idea', 'Aula', 'Chispa', 'Lápiz', 'Búho'], sufijos: ['Academia', 'Instituto', 'Escuela', 'Learning', 'Centro', 'Kids'] },
  mascotas: { label: 'Mascotas', palabras: ['Huella', 'Colita', 'Bigotes', 'Patitas', 'Ladrido', 'Ronroneo', 'Hocico', 'Manada'], sufijos: ['Pet', 'Vet', 'Spa', 'Store', 'Club', 'Care'] },
}

const ADJETIVOS = ['Nova', 'Prime', 'Alto', 'Vivo', 'Claro', 'Nuevo', 'Real', 'Magno', 'Libre', 'Puro']
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

function mezclar(a, b) {
  const corteA = Math.max(2, Math.ceil(a.length * 0.6))
  const corteB = Math.floor(b.length * 0.4)
  return cap(a.slice(0, corteA).toLowerCase() + b.slice(corteB).toLowerCase())
}

function generar(claves, sectorId) {
  const s = SECTORES[sectorId]
  const kws = claves
    .split(/[,\s]+/)
    .map((x) => x.trim())
    .filter((x) => x.length > 1)
    .map(cap)
  const base = kws.length ? kws : [s.palabras[enteroAleatorio(0, s.palabras.length - 1)]]
  const pick = (l) => l[enteroAleatorio(0, l.length - 1)]
  const nombres = new Set()
  for (let i = 0; i < 60 && nombres.size < 16; i++) {
    const k = pick(base)
    const p = pick(s.palabras)
    const t = enteroAleatorio(0, 7)
    const n = [
      `${k} ${pick(s.sufijos)}`,
      mezclar(k, p),
      `${p} ${k}`,
      `${k}${pick(['ia', 'ex', 'ora', 'io', 'um', 'ly'])}`,
      `Grupo ${k}`,
      `${pick(ADJETIVOS)} ${k}`,
      `${k} & ${p}`,
      `${p}${pick(s.sufijos).toLowerCase()}`,
    ][t]
    if (n.length <= 26) nombres.add(n)
  }
  return barajar([...nombres])
}

const dominio = (n) =>
  n
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, 'y')
    .replace(/[^a-z0-9]/g, '')

export default function GeneradorNombresEmpresa() {
  const [claves, setClaves] = useState('')
  const [sector, setSector] = useState('tecnologia')
  const [nombres, setNombres] = useState([])
  const [guardados, setGuardados] = useState([])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input value={claves} onChange={(e) => setClaves(e.target.value)} className={inputClass} placeholder="Palabras clave: tu apellido, producto, ciudad…" />
        <select value={sector} onChange={(e) => setSector(e.target.value)} className={inputClass} aria-label="Sector">
          {Object.entries(SECTORES).map(([k, s]) => (
            <option key={k} value={k}>{s.label}</option>
          ))}
        </select>
      </div>
      <button type="button" onClick={() => setNombres(generar(claves, sector))} className={buttonClass}>💡 Generar nombres de empresa</button>

      {guardados.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm">
          <strong>⭐ Tu lista corta:</strong> {guardados.join(' · ')}
        </div>
      )}
      {nombres.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {nombres.map((n) => (
            <div key={n} className="rounded-lg border border-gray-200 px-3 py-2 flex justify-between items-center gap-2">
              <div>
                <p className="font-bold text-gray-900">{n}</p>
                <p className="text-xs text-gray-500">{dominio(n)}.com · {dominio(n)}.mx</p>
              </div>
              <div className="flex gap-1 items-center">
                <button type="button" onClick={() => setGuardados((g) => (g.includes(n) ? g.filter((x) => x !== n) : [...g, n]))} aria-label={`Guardar ${n}`} className="text-lg">
                  {guardados.includes(n) ? '⭐' : '☆'}
                </button>
                <CopyButton text={n} />
              </div>
            </div>
          ))}
        </div>
      )}
      {nombres.length > 0 && (
        <p className="text-xs text-gray-500">
          Antes de decidir, busca el nombre en el IMPI (México) o la OEPM (España) para ver si ya está registrado como marca, y
          comprueba si el dominio y las redes sociales están libres.
        </p>
      )}
    </div>
  )
}
