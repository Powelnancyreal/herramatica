'use client'

import { useMemo, useState } from 'react'
import { Field, formatNumber, inputClass, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

// Talla de EE. UU. y México ↔ diámetro interior en mm (escala estándar: 0.8128 mm por talla).
const diametroDesdeUS = (s) => 11.63 + 0.8128 * s
const usDesdeDiametro = (d) => (d - 11.63) / 0.8128
const LETRAS_UK = ['F', 'G', 'H', 'I', 'J½', 'K½', 'L½', 'M½', 'N½', 'O½', 'P½', 'Q½', 'R½', 'S½', 'T½', 'U½', 'V½', 'W½', 'Y', 'Z', 'Z+1']
const uk = (us) => {
  const i = Math.round((us - 3) * 2)
  return i >= 0 && i < LETRAS_UK.length ? LETRAS_UK[i] : '—'
}

const ENTRADAS = [
  { id: 'us', label: 'Talla de EE. UU. / México', paso: '0.25' },
  { id: 'eu', label: 'Talla europea (circunferencia en mm)', paso: '0.5' },
  { id: 'es', label: 'Talla española', paso: '0.5' },
  { id: 'diametro', label: 'Diámetro interior (mm)', paso: '0.1' },
  { id: 'circunferencia', label: 'Contorno del dedo (mm)', paso: '0.5' },
]

export default function TallasDeAnillo() {
  const [tipo, setTipo] = useState('us')
  const [valor, setValor] = useState('7')

  const r = useMemo(() => {
    const v = parseFloat(valor)
    if (!(v > 0)) return null
    let d
    if (tipo === 'us') d = diametroDesdeUS(v)
    else if (tipo === 'diametro') d = v
    else if (tipo === 'es') d = (v + 40) / Math.PI
    else d = v / Math.PI
    const circ = d * Math.PI
    const us = usDesdeDiametro(d)
    return { d, circ, us, eu: circ, es: circ - 40 }
  }, [tipo, valor])

  const tabla = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Conozco mi">
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className={inputClass}>
            {ENTRADAS.map((e) => (
              <option key={e.id} value={e.id}>{e.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Valor"><NumberInput value={valor} onChange={setValor} min="0" step={ENTRADAS.find((e) => e.id === tipo).paso} /></Field>
      </div>

      {r && (
        <ResultBox label="Talla de EE. UU. y México" value={r.us >= 0 ? formatNumber(Math.round(r.us * 4) / 4, 2) : '—'}>
          <Rows>
            <Row label="Diámetro interior" value={`${formatNumber(r.d, 2)} mm`} />
            <Row label="Circunferencia interior" value={`${formatNumber(r.circ, 1)} mm`} />
            <Row label="Talla europea (ISO 8653)" value={formatNumber(Math.round(r.eu * 2) / 2, 1)} bold />
            <Row label="Talla española" value={formatNumber(Math.round(r.es * 2) / 2, 1)} bold />
            <Row label="Talla del Reino Unido (aprox.)" value={uk(Math.round(r.us * 2) / 2)} />
          </Rows>
        </ResultBox>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200">
          <thead className="bg-gray-50 text-gray-600">
            <tr><th className="px-3 py-2 text-left">EE. UU. / México</th><th className="px-3 py-2 text-right">Diámetro (mm)</th><th className="px-3 py-2 text-right">Europa</th><th className="px-3 py-2 text-right">España</th><th className="px-3 py-2 text-right">Reino Unido</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tabla.map((s) => {
              const d = diametroDesdeUS(s)
              return (
                <tr key={s}>
                  <td className="px-3 py-1.5 font-semibold">{s}</td>
                  <td className="px-3 py-1.5 text-right">{formatNumber(d, 1)}</td>
                  <td className="px-3 py-1.5 text-right">{formatNumber(Math.round(d * Math.PI * 2) / 2, 1)}</td>
                  <td className="px-3 py-1.5 text-right">{formatNumber(Math.round((d * Math.PI - 40) * 2) / 2, 1)}</td>
                  <td className="px-3 py-1.5 text-right">{uk(s)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500">Las equivalencias pueden variar ligeramente entre joyerías. Si estás entre dos tallas, elige la mayor, sobre todo en anillos anchos.</p>
    </div>
  )
}
