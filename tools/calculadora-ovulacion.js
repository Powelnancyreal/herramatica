'use client'

import { useMemo, useState } from 'react'
import { calcularCiclos } from '@/lib/calc/salud'
import { formatoLargo } from '@/lib/calc/fechas'
import { Field, inputClass, MedicalDisclaimer, NumberInput } from '@/components/calc-ui'

function corta(d) {
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', timeZone: 'UTC' })
}

export default function CalculadoraOvulacion() {
  const [ultimaRegla, setUltimaRegla] = useState('')
  const [duracion, setDuracion] = useState('28')
  const [lutea, setLutea] = useState('14')

  const ciclos = useMemo(() => {
    const d = parseInt(duracion, 10)
    const l = parseInt(lutea, 10)
    if (!ultimaRegla || !(d >= 21 && d <= 45) || !(l >= 10 && l <= 16) || l >= d) return null
    return calcularCiclos({ ultimaRegla, duracionCiclo: d, faseLutea: l, ciclos: 3 })
  }, [ultimaRegla, duracion, lutea])

  return (
    <div className="space-y-5">
      <MedicalDisclaimer />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Primer día de tu última regla">
          <input type="date" value={ultimaRegla} onChange={(e) => setUltimaRegla(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Duración de tu ciclo" hint="Entre 21 y 45 días. El promedio es 28.">
          <NumberInput value={duracion} onChange={setDuracion} min="21" max="45" suffix="días" />
        </Field>
        <Field label="Fase lútea (opcional)" hint="Suele durar 14 días; entre 10 y 16.">
          <NumberInput value={lutea} onChange={setLutea} min="10" max="16" suffix="días" />
        </Field>
      </div>

      {ciclos && (
        <div className="space-y-3">
          <div className="rounded-xl border-2 border-pink-200 bg-pink-50 p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Tu próxima ovulación estimada</p>
            <p className="text-3xl font-bold text-pink-700 capitalize">{formatoLargo(ciclos[0].ovulacion)}</p>
            <p className="text-sm text-gray-700 mt-2">
              Días fértiles: del <strong>{corta(ciclos[0].fertilInicio)}</strong> al <strong>{corta(ciclos[0].fertilFin)}</strong> ·
              Próxima regla: <strong>{corta(ciclos[0].siguienteRegla)}</strong>
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-3 py-2">Ciclo</th>
                  <th className="text-left px-3 py-2">Días fértiles</th>
                  <th className="text-left px-3 py-2">Ovulación</th>
                  <th className="text-left px-3 py-2">Regla esperada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ciclos.map((c, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2">{i + 1}</td>
                    <td className="px-3 py-2">{corta(c.fertilInicio)} – {corta(c.fertilFin)}</td>
                    <td className="px-3 py-2 font-semibold text-pink-700">{corta(c.ovulacion)}</td>
                    <td className="px-3 py-2">{corta(c.siguienteRegla)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-600">
            Estimación para ciclos regulares. No sirve como método anticonceptivo: el estrés, la enfermedad o los cambios
            hormonales pueden adelantar o retrasar la ovulación.
          </p>
        </div>
      )}
    </div>
  )
}
