'use client'

import { useMemo, useState } from 'react'
import { Field, formatMXN, formatNumber, NumberInput, ResultBox, Row, Rows, Tabs } from '@/components/calc-ui'

const RAPIDOS = [10, 15, 20, 25, 30, 40, 50, 70]

export default function CalcularDescuento() {
  const [modo, setModo] = useState('precio')
  const [precio, setPrecio] = useState('')
  const [descuento, setDescuento] = useState('20')
  const [descuento2, setDescuento2] = useState('')
  const [precioFinal, setPrecioFinal] = useState('')

  const r = useMemo(() => {
    const p = parseFloat(precio)
    const d1 = parseFloat(descuento)
    const d2 = parseFloat(descuento2) || 0
    const pf = parseFloat(precioFinal)
    if (modo === 'precio') {
      if (!(p > 0) || !(d1 >= 0) || d1 > 100 || d2 < 0 || d2 > 100) return null
      const tras1 = p * (1 - d1 / 100)
      const final = tras1 * (1 - d2 / 100)
      return { original: p, final, ahorro: p - final, efectivo: ((p - final) / p) * 100, tras1, conSegundo: d2 > 0 }
    }
    if (modo === 'original') {
      if (!(pf > 0) || !(d1 >= 0) || d1 >= 100) return null
      const original = pf / (1 - d1 / 100)
      return { original, final: pf, ahorro: original - pf, efectivo: d1 }
    }
    if (!(p > 0) || !(pf >= 0) || pf > p) return null
    return { original: p, final: pf, ahorro: p - pf, efectivo: ((p - pf) / p) * 100 }
  }, [modo, precio, descuento, descuento2, precioFinal])

  return (
    <div className="space-y-5">
      <Tabs
        tabs={[
          { id: 'precio', label: 'Precio con descuento' },
          { id: 'original', label: 'Precio original' },
          { id: 'porcentaje', label: '¿Qué % me descontaron?' },
        ]}
        value={modo}
        onChange={setModo}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {modo !== 'original' && (
          <Field label="Precio original">
            <NumberInput value={precio} onChange={setPrecio} prefix="$" min="0" placeholder="Ej: 1299" />
          </Field>
        )}
        {modo !== 'precio' && (
          <Field label="Precio final pagado">
            <NumberInput value={precioFinal} onChange={setPrecioFinal} prefix="$" min="0" placeholder="Ej: 909.30" />
          </Field>
        )}
        {modo !== 'porcentaje' && (
          <Field label="Porcentaje de descuento">
            <NumberInput value={descuento} onChange={setDescuento} min="0" max="100" suffix="%" />
          </Field>
        )}
        {modo === 'precio' && (
          <Field label="Descuento adicional (opcional)" hint="Se aplica sobre el precio ya rebajado.">
            <NumberInput value={descuento2} onChange={setDescuento2} min="0" max="100" suffix="%" placeholder="Ej: 10" />
          </Field>
        )}
      </div>

      {modo !== 'porcentaje' && (
        <div className="flex flex-wrap gap-2">
          {RAPIDOS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDescuento(String(d))}
              className={`px-3 py-1.5 rounded-full text-sm border ${
                String(d) === descuento ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {d}%
            </button>
          ))}
        </div>
      )}

      {r && (
        <ResultBox
          label={modo === 'porcentaje' ? 'Descuento aplicado' : modo === 'original' ? 'Precio original' : 'Precio final'}
          value={modo === 'porcentaje' ? `${formatNumber(r.efectivo)}%` : formatMXN(modo === 'original' ? r.original : r.final)}
        >
          <Rows>
            <Row label="Precio original" value={formatMXN(r.original)} />
            {r.conSegundo && <Row label={`Tras el primer ${descuento}%`} value={formatMXN(r.tras1)} />}
            <Row label="Te ahorras" value={formatMXN(r.ahorro)} bold />
            <Row label="Descuento total efectivo" value={`${formatNumber(r.efectivo)}%`} />
            <Row label="Precio final" value={formatMXN(r.final)} bold highlight />
          </Rows>
          {r.conSegundo && (
            <p className="text-xs text-gray-600">
              {descuento}% + {descuento2}% no es {formatNumber(parseFloat(descuento) + parseFloat(descuento2))}%: el segundo
              descuento se calcula sobre el precio ya rebajado, así que el descuento real es {formatNumber(r.efectivo)}%.
            </p>
          )}
        </ResultBox>
      )}
    </div>
  )
}
