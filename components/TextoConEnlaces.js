import Link from 'next/link'
import toolsData from '@/data/tools.json'
import articulos from '@/data/blog.json'

const RUTAS = new Set([
  ...toolsData.map((t) => `/${t.slug}`),
  ...articulos.map((a) => `/blog/${a.slug}`),
  '/blog', '/calculadoras', '/convertidores', '/generadores', '/juegos', '/texto',
])
const ENLACE = /\[([^\]]+)\]\((\/[a-z0-9/-]*)\)/g

// Convierte los enlaces internos escritos como [texto](/ruta) en <Link>. El resto del texto se muestra tal cual.
// Una ruta que no existe detiene la compilación para que nunca se publique un enlace roto.
export default function TextoConEnlaces({ texto, origen }) {
  const partes = []
  let ultimo = 0
  for (const m of texto.matchAll(ENLACE)) {
    const [completo, anclaje, ruta] = m
    if (!RUTAS.has(ruta)) throw new Error(`[${origen}] Enlace interno roto: ${ruta}`)
    partes.push(texto.slice(ultimo, m.index))
    partes.push(<Link key={m.index} href={ruta} className="text-blue-600 font-medium underline decoration-blue-200 underline-offset-2 hover:decoration-blue-600">{anclaje}</Link>)
    ultimo = m.index + completo.length
  }
  partes.push(texto.slice(ultimo))
  return partes
}
