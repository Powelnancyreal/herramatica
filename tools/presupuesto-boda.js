'use client'

import { useMemo, useState } from 'react'
import { Field, formatNumber, Note, NumberInput } from '@/components/calc-ui'

// Reparto orientativo del presupuesto de una boda (porcentajes habituales de planificadores).
const PARTIDAS = [
  ['Banquete y bebidas', 40],
  ['Lugar de la celebración', 12],
  ['Fotografía y video', 10],
  ['Vestido, traje y belleza', 8],
  ['Música y entretenimiento', 7],
  ['Flores y decoración', 7],
  ['Anillos', 4],
  ['Ceremonia y trámites', 3],
  ['Invitaciones y recuerdos', 3],
  ['Transporte', 2],
  ['Imprevistos', 4],
]

export default function PresupuestoBoda() {
  const [total, setTotal] = useState('')
  const [invitados, setInvitados] = useState('100')
  const [pcts, setPcts] = useState(PARTIDAS.map((p) => String(p[1])))

  const r = useMemo(() => {
    const t = parseFloat(total) || 0
    const inv = parseInt(invitados, 10) || 0
    const suma = pcts.reduce((s, p) => s + (parseFloat(p) || 0), 0)
    const filas = PARTIDAS.map(([n], i) => ({ n, pct: parseFloat(pcts[i]) || 0, monto: (t * (parseFloat(pcts[i]) || 0)) / 100 }))
    return { t, inv, suma, filas, porInvitado: inv ? t / inv : 0, banquetePorInvitado: inv ? filas[0].monto / inv : 0 }
  }, [total, invitados, pcts])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Presupuesto total de la boda"><NumberInput value={total} onChange={setTotal} prefix="$" min="0" placeholder="Ej: 250000" /></Field>
        <Field label="Número de invitados"><NumberInput value={invitados} onChange={setInvitados} min="0" step="1" /></Field>
      </div>

      {r.t > 0 && (
        <div className="rounded-xl border-2 border-pink-200 bg-pink-50 p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-500">Costo por invitado</p><p className="text-2xl font-bold text-pink-700">${formatNumber(r.porInvitado, 0)}</p></div>
            <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-500">Banquete por persona</p><p className="text-2xl font-bold text-pink-700">${formatNumber(r.banquetePorInvitado, 0)}</p></div>
          </div>
          <div className="bg-white rounded-lg divide-y divide-gray-100 text-sm">
            {r.filas.map((f, i) => (
              <div key={f.n} className="flex items-center gap-2 px-3 py-2">
                <span className="flex-1 text-gray-700">{f.n}</span>
                <input type="number" value={pcts[i]} onChange={(e) => setPcts((p) => p.map((x, j) => (j === i ? e.target.value : x)))} className="w-16 border border-gray-300 rounded px-2 py-1 text-right" aria-label={`Porcentaje para ${f.n}`} />
                <span className="w-4 text-gray-500">%</span>
                <span className="w-28 text-right font-semibold">${formatNumber(f.monto, 0)}</span>
              </div>
            ))}
          </div>
          {Math.abs(r.suma - 100) > 0.01 && <p className="text-sm text-amber-700">Los porcentajes suman {formatNumber(r.suma, 1)}%: ajústalos para que sumen 100%.</p>}
          <Note>Porcentajes orientativos; cámbialos según tus prioridades. El banquete depende directamente del número de invitados: reducir la lista es la forma más eficaz de bajar el costo total.</Note>
        </div>
      )}
    </div>
  )
}
