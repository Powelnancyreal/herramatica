'use client'

import { useMemo, useState } from 'react'

const ITEMS = [
  {
    id: 'comer',
    label: 'Comer',
    opciones: [
      { valor: 0, texto: 'Incapaz' },
      { valor: 5, texto: 'Necesita ayuda para cortar, extender mantequilla, etc.' },
      { valor: 10, texto: 'Independiente' },
    ],
  },
  {
    id: 'banarse',
    label: 'Lavarse / Bañarse',
    opciones: [
      { valor: 0, texto: 'Dependiente' },
      { valor: 5, texto: 'Independiente (incluye entrar y salir de la ducha)' },
    ],
  },
  {
    id: 'vestirse',
    label: 'Vestirse',
    opciones: [
      { valor: 0, texto: 'Dependiente' },
      { valor: 5, texto: 'Necesita ayuda, pero hace al menos la mitad de la tarea' },
      { valor: 10, texto: 'Independiente' },
    ],
  },
  {
    id: 'arreglarse',
    label: 'Arreglarse (aseo personal)',
    opciones: [
      { valor: 0, texto: 'Dependiente' },
      { valor: 5, texto: 'Independiente (lavarse cara/manos, peinarse, afeitarse)' },
    ],
  },
  {
    id: 'deposicion',
    label: 'Deposición (control de heces)',
    opciones: [
      { valor: 0, texto: 'Incontinente' },
      { valor: 5, texto: 'Accidente ocasional' },
      { valor: 10, texto: 'Continente' },
    ],
  },
  {
    id: 'miccion',
    label: 'Micción (control de orina)',
    opciones: [
      { valor: 0, texto: 'Incontinente' },
      { valor: 5, texto: 'Accidente ocasional' },
      { valor: 10, texto: 'Continente' },
    ],
  },
  {
    id: 'retrete',
    label: 'Uso del retrete',
    opciones: [
      { valor: 0, texto: 'Dependiente' },
      { valor: 5, texto: 'Necesita alguna ayuda' },
      { valor: 10, texto: 'Independiente' },
    ],
  },
  {
    id: 'traslado',
    label: 'Traslado (cama-sillón)',
    opciones: [
      { valor: 0, texto: 'Incapaz, sin equilibrio' },
      { valor: 5, texto: 'Gran ayuda (una o dos personas)' },
      { valor: 10, texto: 'Ayuda mínima (verbal o física)' },
      { valor: 15, texto: 'Independiente' },
    ],
  },
  {
    id: 'deambular',
    label: 'Deambulación',
    opciones: [
      { valor: 0, texto: 'Inmóvil' },
      { valor: 5, texto: 'Independiente en silla de ruedas' },
      { valor: 10, texto: 'Camina con ayuda de una persona' },
      { valor: 15, texto: 'Independiente (puede usar bastón)' },
    ],
  },
  {
    id: 'escaleras',
    label: 'Subir y bajar escaleras',
    opciones: [
      { valor: 0, texto: 'Incapaz' },
      { valor: 5, texto: 'Necesita ayuda' },
      { valor: 10, texto: 'Independiente' },
    ],
  },
]

function interpretar(total) {
  if (total === 100) return { label: 'Independiente', color: 'text-green-700 bg-green-50 border-green-200' }
  if (total >= 91) return { label: 'Dependencia leve', color: 'text-lime-700 bg-lime-50 border-lime-200' }
  if (total >= 61) return { label: 'Dependencia moderada', color: 'text-amber-700 bg-amber-50 border-amber-200' }
  if (total >= 21) return { label: 'Dependencia severa', color: 'text-orange-700 bg-orange-50 border-orange-200' }
  return { label: 'Dependencia total', color: 'text-red-700 bg-red-50 border-red-200' }
}

export default function IndiceDeBarthel() {
  const [respuestas, setRespuestas] = useState({})

  const total = useMemo(() => Object.values(respuestas).reduce((acc, v) => acc + v, 0), [respuestas])
  const completado = Object.keys(respuestas).length === ITEMS.length

  return (
    <div className="space-y-5">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
        ⚕️ <strong>Aviso médico:</strong> Esta herramienta es solo para fines educativos e informativos. Consulta
        siempre con un profesional de la salud antes de tomar decisiones médicas.
      </div>
      <div className="space-y-4">
        {ITEMS.map((item) => (
          <div key={item.id}>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">{item.label}</label>
            <div className="space-y-1.5">
              {item.opciones.map((op) => (
                <label key={op.valor} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name={item.id}
                    checked={respuestas[item.id] === op.valor}
                    onChange={() => setRespuestas((prev) => ({ ...prev, [item.id]: op.valor }))}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>
                    {op.texto} <span className="text-gray-400">({op.valor} pts)</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center sticky bottom-4">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Puntuación total</p>
        <p className="text-4xl font-bold text-blue-700">{total} / 100</p>
        {completado && (
          <span className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full border ${interpretar(total).color}`}>
            {interpretar(total).label}
          </span>
        )}
        {!completado && <p className="text-xs text-gray-500 mt-2">Responde los {ITEMS.length} ítems para ver la interpretación</p>}
      </div>

      <p className="text-xs text-gray-500">
        ⚠️ El Índice de Barthel evalúa la independencia en actividades básicas de la vida diaria. Los puntos de
        corte para interpretar el resultado pueden variar ligeramente según la fuente o el contexto clínico. Esta
        herramienta es educativa y no reemplaza una evaluación funcional realizada por un profesional de la salud.
      </p>
    </div>
  )
}
