'use client'

import { useMemo, useState } from 'react'
import { Field, formatMXN, formatNumber, Note, NumberInput, ResultBox, Row, Rows, Tabs } from '@/components/calc-ui'

export default function CalculadoraROI() {
  const [modo, setModo] = useState('roi')
  const [inversion, setInversion] = useState('')
  const [retorno, setRetorno] = useState('')
  const [anios, setAnios] = useState('')
  const [costo, setCosto] = useState('')
  const [precio, setPrecio] = useState('')
  const [margenDeseado, setMargenDeseado] = useState('30')

  const r = useMemo(() => {
    if (modo === 'roi') {
      const inv = parseFloat(inversion)
      const ret = parseFloat(retorno)
      if (!(inv > 0) || isNaN(ret)) return null
      const ganancia = ret - inv
      const roi = ganancia / inv
      const t = parseFloat(anios)
      const anualizado = t > 0 && ret > 0 ? Math.pow(ret / inv, 1 / t) - 1 : null
      return { ganancia, roi, anualizado }
    }
    if (modo === 'margen') {
      const c = parseFloat(costo)
      const p = parseFloat(precio)
      if (!(c >= 0) || !(p > 0)) return null
      return { ganancia: p - c, margen: (p - c) / p, markup: c > 0 ? (p - c) / c : null }
    }
    const c = parseFloat(costo)
    const m = parseFloat(margenDeseado)
    if (!(c > 0) || !(m >= 0) || m >= 100) return null
    const precioVenta = c / (1 - m / 100)
    return { precioVenta, ganancia: precioVenta - c, markup: (precioVenta - c) / c }
  }, [modo, inversion, retorno, anios, costo, precio, margenDeseado])

  return (
    <div className="space-y-5">
      <Tabs
        tabs={[
          { id: 'roi', label: 'ROI de una inversión' },
          { id: 'margen', label: 'Margen de ganancia' },
          { id: 'precio', label: 'Precio de venta' },
        ]}
        value={modo}
        onChange={setModo}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {modo === 'roi' && (
          <>
            <Field label="Inversión inicial">
              <NumberInput value={inversion} onChange={setInversion} prefix="$" min="0" placeholder="Ej: 10000" />
            </Field>
            <Field label="Valor final / ingresos obtenidos">
              <NumberInput value={retorno} onChange={setRetorno} prefix="$" min="0" placeholder="Ej: 13500" />
            </Field>
            <Field label="Duración (opcional)" hint="Para el ROI anualizado.">
              <NumberInput value={anios} onChange={setAnios} min="0" suffix="años" />
            </Field>
          </>
        )}
        {modo !== 'roi' && (
          <Field label="Costo del producto o servicio">
            <NumberInput value={costo} onChange={setCosto} prefix="$" min="0" placeholder="Ej: 350" />
          </Field>
        )}
        {modo === 'margen' && (
          <Field label="Precio de venta">
            <NumberInput value={precio} onChange={setPrecio} prefix="$" min="0" placeholder="Ej: 500" />
          </Field>
        )}
        {modo === 'precio' && (
          <Field label="Margen de ganancia deseado">
            <NumberInput value={margenDeseado} onChange={setMargenDeseado} min="0" max="99" suffix="%" />
          </Field>
        )}
      </div>

      {r && modo === 'roi' && (
        <ResultBox label="Retorno sobre la inversión (ROI)" value={`${formatNumber(r.roi * 100)}%`}>
          <Rows>
            <Row label={r.ganancia >= 0 ? 'Ganancia neta' : 'Pérdida neta'} value={formatMXN(r.ganancia)} bold />
            <Row label="ROI total" value={`${formatNumber(r.roi * 100)}%`} highlight />
            {r.anualizado !== null && <Row label="ROI anualizado (CAGR)" value={`${formatNumber(r.anualizado * 100)}%`} />}
          </Rows>
        </ResultBox>
      )}
      {r && modo === 'margen' && (
        <ResultBox label="Margen de ganancia" value={`${formatNumber(r.margen * 100)}%`}>
          <Rows>
            <Row label="Ganancia por unidad" value={formatMXN(r.ganancia)} bold />
            <Row label="Margen (sobre el precio de venta)" value={`${formatNumber(r.margen * 100)}%`} highlight />
            {r.markup !== null && <Row label="Markup (sobre el costo)" value={`${formatNumber(r.markup * 100)}%`} />}
          </Rows>
          <Note>El margen y el markup no son lo mismo: un markup del 100% equivale a un margen del 50%.</Note>
        </ResultBox>
      )}
      {r && modo === 'precio' && (
        <ResultBox label="Precio de venta sugerido" value={formatMXN(r.precioVenta)}>
          <Rows>
            <Row label="Ganancia por unidad" value={formatMXN(r.ganancia)} bold />
            <Row label="Margen" value={`${margenDeseado}%`} />
            <Row label="Markup equivalente sobre el costo" value={`${formatNumber(r.markup * 100)}%`} highlight />
          </Rows>
          <Note>Precio = costo ÷ (1 − margen). Si vendes con IVA, súmalo después de calcular el precio.</Note>
        </ResultBox>
      )}
    </div>
  )
}
