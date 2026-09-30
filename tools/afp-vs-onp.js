'use client'

import { useState } from 'react'
import { pensionONP, saldoAFP } from '@/lib/calc/latam'
import { pen } from '@/components/calc-ui-eur'
import { buttonClass, ErrorText, Field, formatNumber, Note, NumberInput, ResultBox } from '@/components/calc-ui'

export default function AfpVsOnp() {
  const [sueldo, setSueldo] = useState('')
  const [edad, setEdad] = useState('')
  const [aniosPrevios, setAniosPrevios] = useState('0')
  const [saldo, setSaldo] = useState('')
  const [rentabilidad, setRentabilidad] = useState('4')
  const [comision, setComision] = useState('1.6')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const s = parseFloat(sueldo)
    const e = parseInt(edad, 10)
    if (!(s > 0)) return setError('Ingresa tu remuneración mensual.')
    if (!(e >= 18 && e < 65)) return setError('Ingresa tu edad actual (entre 18 y 64 años).')
    setError('')
    const aniosFuturos = 65 - e
    const totalAnios = aniosFuturos + (parseFloat(aniosPrevios) || 0)
    const onp = pensionONP({ remuneracion: s, anios: totalAnios })
    const fondo = saldoAFP({ remuneracion: s, anios: aniosFuturos, rentabilidad: parseFloat(rentabilidad) || 0, saldoInicial: parseFloat(saldo) || 0 })
    // Aproximación de la pensión AFP: el fondo repartido en 20 años de jubilación, sin rentabilidad posterior.
    const pensionAfp = fondo / (20 * 12)
    const descuentoAfp = s * (0.1 + (parseFloat(comision) || 0) / 100 + 0.0137)
    setResult({ onp, fondo, pensionAfp, descuentoAfp, descuentoOnp: s * 0.13, totalAnios, aniosFuturos })
  }

  const r = result
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Remuneración mensual"><NumberInput value={sueldo} onChange={setSueldo} prefix="S/" min="0" placeholder="Ej: 3000" /></Field>
        <Field label="Edad actual"><NumberInput value={edad} onChange={setEdad} min="18" max="64" step="1" placeholder="Ej: 30" /></Field>
        <Field label="Años que ya aportaste"><NumberInput value={aniosPrevios} onChange={setAniosPrevios} min="0" step="1" /></Field>
        <Field label="Saldo actual en tu AFP (si tienes)"><NumberInput value={saldo} onChange={setSaldo} prefix="S/" min="0" placeholder="0" /></Field>
        <Field label="Rentabilidad real anual esperada del fondo"><NumberInput value={rentabilidad} onChange={setRentabilidad} min="0" max="10" step="0.1" suffix="%" /></Field>
        <Field label="Comisión de tu AFP sobre el sueldo" hint="Prima de seguro de referencia: 1.37%."><NumberInput value={comision} onChange={setComision} min="0" max="3" step="0.01" suffix="%" /></Field>
      </div>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Comparar AFP y ONP</button>

      {r && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`rounded-xl border-2 p-4 space-y-1 ${r.pensionAfp >= r.onp.pension ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
              <p className="font-bold text-gray-900">AFP (Sistema Privado)</p>
              <p className="text-2xl font-bold text-blue-700">{pen(r.pensionAfp)}/mes</p>
              <p className="text-sm text-gray-700">Fondo estimado a los 65: {pen(r.fondo)}</p>
              <p className="text-sm text-gray-700">Descuento mensual: {pen(r.descuentoAfp)}</p>
              <p className="text-xs text-gray-500">El fondo es tuyo y se hereda si falleces.</p>
            </div>
            <div className={`rounded-xl border-2 p-4 space-y-1 ${r.onp.pension > r.pensionAfp ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
              <p className="font-bold text-gray-900">ONP (Sistema Nacional)</p>
              <p className="text-2xl font-bold text-blue-700">{pen(r.onp.pension)}/mes</p>
              <p className="text-sm text-gray-700">{r.onp.regla} · {r.totalAnios} años de aportes</p>
              <p className="text-sm text-gray-700">Descuento mensual (13%): {pen(r.descuentoOnp)}</p>
              <p className="text-xs text-gray-500">Pensión vitalicia con mínimo y máximo legal; no se hereda el fondo.</p>
            </div>
          </div>
          <ResultBox>
            <Note>
              ONP según la Ley 32123: pensión mínima de S/ 600 con 20 años de aportes, pensiones proporcionales de S/ 300 (10 a 14
              años) y S/ 400 (15 a 19 años) y máxima de S/ 1,000; la pensión con 20 o más años se estima aquí como el 30% de la
              remuneración más 2% por cada año adicional, dentro de esos límites. La pensión AFP reparte el fondo en 20 años sin
              rentabilidad posterior; una renta vitalicia real depende de tu edad, sexo y beneficiarios. Proyección en soles de hoy
              con aportes del 10% durante {r.aniosFuturos} años. Es una comparación orientativa: pide tu simulación oficial a la ONP
              y a tu AFP.
            </Note>
            <p className="text-sm text-gray-700">Diferencia estimada: {pen(Math.abs(r.pensionAfp - r.onp.pension))} al mes a favor de {r.pensionAfp >= r.onp.pension ? 'la AFP' : 'la ONP'} ({formatNumber(r.pensionAfp / Math.max(1, r.onp.pension) * 100, 0)}% de la pensión ONP).</p>
          </ResultBox>
        </>
      )}
    </div>
  )
}
