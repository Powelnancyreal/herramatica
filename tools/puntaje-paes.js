'use client'

import { useMemo, useState } from 'react'
import { formatNumber, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

const FACTORES = [
  { id: 'nem', label: 'NEM (notas de enseñanza media)', pond: '20' },
  { id: 'ranking', label: 'Ranking de notas', pond: '20' },
  { id: 'lectora', label: 'Competencia Lectora', pond: '10' },
  { id: 'm1', label: 'Competencia Matemática 1 (M1)', pond: '35' },
  { id: 'm2', label: 'Competencia Matemática 2 (M2)', pond: '0' },
  { id: 'electiva', label: 'Ciencias o Historia', pond: '15' },
]

// Conversión aproximada del promedio de enseñanza media a puntaje NEM (escala 100-1.000).
const nemAproximado = (prom) => Math.min(1000, Math.max(100, 100 + (prom - 4) * 300))

export default function PuntajePaes() {
  const [puntajes, setPuntajes] = useState({})
  const [ponds, setPonds] = useState(Object.fromEntries(FACTORES.map((f) => [f.id, f.pond])))
  const [promedio, setPromedio] = useState('')
  const [corte, setCorte] = useState('')

  const r = useMemo(() => {
    const suma = FACTORES.reduce((s, f) => s + (parseFloat(ponds[f.id]) || 0), 0)
    const filas = FACTORES.map((f) => {
      const p = parseFloat(puntajes[f.id]) || 0
      const w = parseFloat(ponds[f.id]) || 0
      return { ...f, p, w, aporte: (p * w) / 100 }
    }).filter((f) => f.w > 0)
    return { suma, filas, total: filas.reduce((s, f) => s + f.aporte, 0), completos: filas.every((f) => f.p >= 100) }
  }, [puntajes, ponds])

  const prom = parseFloat(promedio)
  const c = parseFloat(corte)
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-gray-200 p-3 flex flex-wrap items-end gap-3">
        <div className="w-40">
          <label className="block text-xs font-medium text-gray-600 mb-1">Promedio de notas (1.0 a 7.0)</label>
          <NumberInput value={promedio} onChange={setPromedio} min="4" max="7" step="0.01" placeholder="Ej: 6.1" />
        </div>
        {prom >= 4 && prom <= 7 && (
          <button type="button" onClick={() => setPuntajes((p) => ({ ...p, nem: String(Math.round(nemAproximado(prom))), ranking: p.ranking || String(Math.round(nemAproximado(prom))) }))} className="text-sm text-blue-600 font-medium">
            Usar NEM aproximado: {Math.round(nemAproximado(prom))} puntos
          </button>
        )}
      </div>
      <div className="space-y-2">
        <div className="hidden sm:grid grid-cols-12 gap-2 text-xs font-medium text-gray-500"><span className="col-span-6">Factor</span><span className="col-span-3">Puntaje (100-1.000)</span><span className="col-span-3">Ponderación %</span></div>
        {FACTORES.map((f) => (
          <div key={f.id} className="grid grid-cols-12 gap-2 items-center">
            <span className="col-span-12 sm:col-span-6 text-sm text-gray-700">{f.label}</span>
            <div className="col-span-6 sm:col-span-3"><NumberInput value={puntajes[f.id] || ''} onChange={(v) => setPuntajes((p) => ({ ...p, [f.id]: v }))} min="100" max="1000" placeholder="Puntaje" /></div>
            <div className="col-span-6 sm:col-span-3"><NumberInput value={ponds[f.id]} onChange={(v) => setPonds((p) => ({ ...p, [f.id]: v }))} min="0" max="100" suffix="%" /></div>
          </div>
        ))}
      </div>
      <div className="max-w-xs">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Puntaje de corte de la carrera (opcional)</label>
        <NumberInput value={corte} onChange={setCorte} min="100" max="1000" step="0.01" />
      </div>

      {r.suma !== 100 ? (
        <p className="text-sm text-amber-700">Las ponderaciones suman {formatNumber(r.suma, 1)}%; deben sumar 100%. Copia las de la carrera a la que postulas.</p>
      ) : (
        <ResultBox label="Puntaje ponderado de postulación" value={formatNumber(r.total, 2)}>
          <Rows>
            {r.filas.map((f) => (
              <Row key={f.id} label={`${f.label}: ${formatNumber(f.p, 0)} × ${f.w}%`} value={formatNumber(f.aporte, 2)} />
            ))}
            {!isNaN(c) && <Row label={`Puntaje de corte ${formatNumber(c, 2)}`} value={r.total >= c ? `✓ Lo superas por ${formatNumber(r.total - c, 2)}` : `✗ Te faltan ${formatNumber(c - r.total, 2)}`} highlight />}
          </Rows>
          {!r.completos && <Note>Hay factores con ponderación pero sin puntaje: complétalos para un resultado real.</Note>}
          <Note>Desde la Admisión 2023 todos los factores usan la escala de 100 a 1.000. El NEM aproximado es una conversión lineal; el puntaje oficial depende de la tabla del DEMRE para tu tipo de enseñanza. Las ponderaciones y los requisitos cambian cada año: revísalos en la oferta académica oficial.</Note>
        </ResultBox>
      )}
    </div>
  )
}
