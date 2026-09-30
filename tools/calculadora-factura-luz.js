'use client'

import { useState } from 'react'
import { IMPUESTO_ELECTRICO } from '@/lib/calc/espana'
import { eur } from '@/components/calc-ui-eur'
import { buttonClass, ErrorText, Field, formatNumber, Note, NumberInput, ResultBox, Row, Rows, Tabs } from '@/components/calc-ui'

const MODOS = [
  { id: 'unico', label: 'Precio único' },
  { id: 'periodos', label: 'Por periodos (2.0TD)' },
]

export default function CalculadoraFacturaLuz() {
  const [modo, setModo] = useState('unico')
  const [dias, setDias] = useState('30')
  const [potencia, setPotencia] = useState('4.6')
  const [precioPotencia, setPrecioPotencia] = useState('0.10')
  const [kwh, setKwh] = useState('')
  const [precioKwh, setPrecioKwh] = useState('0.14')
  const [periodos, setPeriodos] = useState({ p1: '', p2: '', p3: '', c1: '0.19', c2: '0.13', c3: '0.09' })
  const [contador, setContador] = useState('0.81')
  const [bono, setBono] = useState('0')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const d = parseFloat(dias)
    const p = parseFloat(potencia)
    const pp = parseFloat(precioPotencia)
    if (!(d > 0 && p > 0 && pp >= 0)) return setError('Revisa los días de facturación, la potencia contratada y su precio.')
    let energia
    let consumo
    if (modo === 'unico') {
      consumo = parseFloat(kwh)
      if (!(consumo >= 0) || kwh === '') return setError('Escribe los kWh consumidos en el periodo.')
      energia = consumo * (parseFloat(precioKwh) || 0)
    } else {
      const k = ['p1', 'p2', 'p3'].map((x) => parseFloat(periodos[x]) || 0)
      const c = ['c1', 'c2', 'c3'].map((x) => parseFloat(periodos[x]) || 0)
      consumo = k[0] + k[1] + k[2]
      if (!consumo) return setError('Escribe el consumo de al menos un periodo.')
      energia = k.reduce((s, x, i) => s + x * c[i], 0)
    }
    setError('')
    const terminoPotencia = p * d * pp
    const descuentoBono = ((terminoPotencia + energia) * parseFloat(bono)) / 100
    const baseImpuesto = terminoPotencia + energia - descuentoBono
    const impuesto = baseImpuesto * IMPUESTO_ELECTRICO
    const alquiler = ((parseFloat(contador) || 0) * d) / 30
    const baseIva = baseImpuesto + impuesto + alquiler
    const iva = baseIva * 0.21
    setResult({ terminoPotencia, energia, descuentoBono, impuesto, alquiler, iva, total: baseIva + iva, consumo, d })
  }

  const r = result
  return (
    <div className="space-y-5">
      <Tabs tabs={MODOS} value={modo} onChange={setModo} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Días de facturación"><NumberInput value={dias} onChange={setDias} min="1" max="90" /></Field>
        <Field label="Potencia contratada"><NumberInput value={potencia} onChange={setPotencia} min="0" step="0.1" suffix="kW" /></Field>
        <Field label="Precio de la potencia" hint="Si tu tarifa tiene dos precios (punta y valle), súmalos."><NumberInput value={precioPotencia} onChange={setPrecioPotencia} min="0" step="0.001" suffix="€/kW·día" /></Field>
        {modo === 'unico' ? (
          <>
            <Field label="Consumo del periodo"><NumberInput value={kwh} onChange={setKwh} min="0" suffix="kWh" placeholder="Ej: 250" /></Field>
            <Field label="Precio de la energía"><NumberInput value={precioKwh} onChange={setPrecioKwh} min="0" step="0.001" suffix="€/kWh" /></Field>
          </>
        ) : (
          [['p1', 'c1', 'Punta (P1)'], ['p2', 'c2', 'Llano (P2)'], ['p3', 'c3', 'Valle (P3)']].map(([k, c, label]) => (
            <Field key={k} label={`${label}: kWh y €/kWh`}>
              <div className="flex gap-2">
                <NumberInput value={periodos[k]} onChange={(v) => setPeriodos((x) => ({ ...x, [k]: v }))} min="0" placeholder="kWh" />
                <NumberInput value={periodos[c]} onChange={(v) => setPeriodos((x) => ({ ...x, [c]: v }))} min="0" step="0.001" placeholder="€/kWh" />
              </div>
            </Field>
          ))
        )}
        <Field label="Alquiler del contador"><NumberInput value={contador} onChange={setContador} min="0" step="0.01" suffix="€/mes" /></Field>
        <Field label="Bono social">
          <select value={bono} onChange={(e) => setBono(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white">
            <option value="0">No tengo bono social</option>
            <option value="35">Consumidor vulnerable (35%)</option>
            <option value="50">Vulnerable severo (50%)</option>
          </select>
        </Field>
      </div>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular factura de la luz</button>

      {r && (
        <ResultBox label="Total estimado de la factura" value={eur(r.total)}>
          <Rows>
            <Row label="Término de potencia" value={eur(r.terminoPotencia)} />
            <Row label={`Término de energía (${formatNumber(r.consumo, 0)} kWh)`} value={eur(r.energia)} />
            {r.descuentoBono > 0 && <Row label="Descuento bono social" value={`−${eur(r.descuentoBono)}`} />}
            <Row label="Impuesto especial sobre la electricidad (5.11%)" value={eur(r.impuesto)} />
            <Row label="Alquiler del contador" value={eur(r.alquiler)} />
            <Row label="IVA (21%)" value={eur(r.iva)} />
            <Row label="Precio medio por kWh (todo incluido)" value={`${formatNumber(r.total / Math.max(1, r.consumo), 3)} €/kWh`} bold highlight />
          </Rows>
          <Note>
            Los precios por defecto son solo un ejemplo: copia los de tu contrato o de tu última factura. En la tarifa regulada
            (PVPC) el precio de la energía cambia cada hora. El bono social tiene límites de consumo anual con descuento; aquí se
            aplica a todo el consumo como simplificación.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
