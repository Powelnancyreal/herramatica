'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Quita acentos y mayúsculas para que «calculo» encuentre «Cálculo» e «imc» encuentre «IMC».
const normalizar = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// herramientas: [{ slug, nombre, descripcion, icono }] preparadas en el servidor (sin FAQs ni contenido largo).
export default function BuscadorHerramientas({ herramientas }) {
  const router = useRouter()
  const [consulta, setConsulta] = useState('')
  const indice = useMemo(
    () => herramientas.map((h) => ({ ...h, n: normalizar(h.nombre), d: normalizar(h.descripcion) })),
    [herramientas]
  )

  const palabras = normalizar(consulta).split(/\s+/).filter(Boolean)
  const resultados = palabras.length
    ? indice
        .filter((h) => palabras.every((p) => h.n.includes(p) || h.d.includes(p)))
        // Primero las que coinciden en el nombre, luego las que solo coinciden en la descripción.
        .sort((a, b) => palabras.filter((p) => b.n.includes(p)).length - palabras.filter((p) => a.n.includes(p)).length)
    : []

  return (
    <div className="relative max-w-xl mx-auto my-6 text-left">
      <label htmlFor="buscar-herramienta" className="sr-only">Buscar herramienta</label>
      <input
        id="buscar-herramienta"
        type="search"
        autoComplete="off"
        value={consulta}
        placeholder="Buscar herramienta... (ej: porcentaje, IMC, QR)"
        className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none text-gray-700 text-base"
        onChange={(e) => setConsulta(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && resultados[0]) router.push(`/${resultados[0].slug}`)
          if (e.key === 'Escape') setConsulta('')
        }}
        aria-controls="resultados-busqueda"
      />
      <span className="absolute right-4 top-3.5 text-gray-400 text-xl pointer-events-none" aria-hidden="true">🔍</span>

      {palabras.length > 0 && (
        <div id="resultados-busqueda" role="region" aria-live="polite" className="absolute z-20 left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
          {resultados.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500">No encontramos herramientas para «{consulta}».</p>
          ) : (
            <>
              <p className="px-4 pt-3 pb-1 text-xs text-gray-500">
                {resultados.length} herramienta{resultados.length !== 1 ? 's' : ''}
              </p>
              <ul>
                {resultados.map((h) => (
                  <li key={h.slug}>
                    <Link href={`/${h.slug}`} className="flex gap-3 px-4 py-2.5 hover:bg-purple-50 focus:bg-purple-50 focus:outline-none">
                      <span className="text-lg" aria-hidden="true">{h.icono}</span>
                      <span className="min-w-0">
                        <span className="block font-semibold text-gray-900">{h.nombre}</span>
                        <span className="block text-sm text-gray-500 truncate">{h.descripcion}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}
