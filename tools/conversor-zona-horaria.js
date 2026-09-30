'use client'

import { useEffect, useMemo, useState } from 'react'
import { etiquetaDesfase, formatearEnZona, horaLocalAUTC, ZONAS_DESTACADAS } from '@/lib/calc/zonas'
import { Field, inputClass, secondaryButtonClass } from '@/components/calc-ui'

function ahoraLocal(tz) {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date())
    .reduce((a, x) => ({ ...a, [x.type]: x.value }), {})
  return { fecha: `${p.year}-${p.month}-${p.day}`, hora: `${p.hour}:${p.minute}` }
}

function nombreZona(tz) {
  return ZONAS_DESTACADAS.find((z) => z.tz === tz)?.nombre || tz.split('/').pop().replace(/_/g, ' ')
}

export default function ConversorZonaHoraria() {
  const [todas, setTodas] = useState(ZONAS_DESTACADAS.map((z) => z.tz))
  const [origen, setOrigen] = useState('America/Mexico_City')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [destinos, setDestinos] = useState(['Europe/Madrid', 'America/Bogota', 'America/Argentina/Buenos_Aires', 'America/New_York'])
  const [nuevo, setNuevo] = useState('')

  useEffect(() => {
    const local = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (typeof Intl.supportedValuesOf === 'function') {
      const lista = Intl.supportedValuesOf('timeZone')
      setTodas([...new Set([...ZONAS_DESTACADAS.map((z) => z.tz), ...lista])])
    }
    if (local) setOrigen(local)
    const a = ahoraLocal(local || 'America/Mexico_City')
    setFecha(a.fecha)
    setHora(a.hora)
  }, [])

  const r = useMemo(() => {
    if (!fecha || !hora) return null
    const [y, m, d] = fecha.split('-').map(Number)
    const [hh, mm] = hora.split(':').map(Number)
    return horaLocalAUTC({ y, m, d, h: hh, min: mm }, origen)
  }, [fecha, hora, origen])

  function agregar(tz) {
    if (tz && !destinos.includes(tz)) setDestinos((d) => [...d, tz])
    setNuevo('')
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Zona horaria de origen">
          <select value={origen} onChange={(e) => setOrigen(e.target.value)} className={inputClass}>
            {todas.map((tz) => (
              <option key={tz} value={tz}>{nombreZona(tz)} {tz !== nombreZona(tz) ? `(${tz})` : ''}</option>
            ))}
          </select>
        </Field>
        <Field label="Fecha">
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Hora">
          <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} className={inputClass} />
        </Field>
      </div>
      <button
        type="button"
        className={secondaryButtonClass}
        onClick={() => {
          const a = ahoraLocal(origen)
          setFecha(a.fecha)
          setHora(a.hora)
        }}
      >
        Usar la hora actual
      </button>

      {r && !r.existe && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
          Esa hora no existe en {nombreZona(origen)} porque ese día los relojes se adelantan por el horario de verano. Se muestra la hora equivalente.
        </p>
      )}

      {r && (
        <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
          {[origen, ...destinos.filter((d) => d !== origen)].map((tz, i) => (
            <div key={tz} className={`flex items-center justify-between gap-3 px-4 py-3 ${i === 0 ? 'bg-blue-50' : 'bg-white'}`}>
              <div>
                <p className="font-semibold text-gray-900">{nombreZona(tz)} {i === 0 && <span className="text-xs text-blue-600">(origen)</span>}</p>
                <p className="text-xs text-gray-500">{etiquetaDesfase(r.ts, tz)}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-lg font-bold text-gray-800 capitalize text-right">{formatearEnZona(r.ts, tz)}</p>
                {i > 0 && (
                  <button type="button" aria-label={`Quitar ${nombreZona(tz)}`} onClick={() => setDestinos((d) => d.filter((x) => x !== tz))} className="text-gray-400 hover:text-red-600">
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <select value={nuevo} onChange={(e) => agregar(e.target.value)} className={inputClass}>
          <option value="">+ Añadir otra ciudad o zona horaria…</option>
          {todas.filter((tz) => !destinos.includes(tz)).map((tz) => (
            <option key={tz} value={tz}>{nombreZona(tz)} {tz !== nombreZona(tz) ? `(${tz})` : ''}</option>
          ))}
        </select>
      </div>
      <p className="text-xs text-gray-500">Usa la base de datos de zonas horarias de tu navegador, que incluye los cambios de horario de verano de cada país.</p>
    </div>
  )
}
