'use client'

import { useState } from 'react'
import { categoriaMonotributo, MONOTRIBUTO, PRECIO_UNITARIO_MAXIMO } from '@/lib/calc/latam'
import { ars } from '@/components/calc-ui-eur'
import { buttonClass, ErrorText, Field, inputClass, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

export default function Monotributo() {
  const [actividad, setActividad] = useState('servicios')
  const [ingresos, setIngresos] = useState('')
  const [superficie, setSuperficie] = useState('')
  const [energia, setEnergia] = useState('')
  const [alquileres, setAlquileres] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const i = parseFloat(ingresos)
    if (!(i >= 0) || ingresos === '') return setError('Ingresá tus ingresos brutos de los últimos 12 meses.')
    setError('')
    const c = categoriaMonotributo({ ingresos: i, superficie: parseFloat(superficie) || 0, energia: parseFloat(energia) || 0, alquileres: parseFloat(alquileres) || 0 })
    const porIngresos = MONOTRIBUTO.find((x) => i <= x.ingresos)
    setResult({ c, porIngresos, i })
  }

  const r = result
  const cuota = r?.c ? r.c[actividad] : 0
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Actividad">
          <select value={actividad} onChange={(e) => setActividad(e.target.value)} className={inputClass}>
            <option value="servicios">Locaciones y prestaciones de servicios</option>
            <option value="bienes">Venta de cosas muebles</option>
          </select>
        </Field>
        <Field label="Ingresos brutos de los últimos 12 meses"><NumberInput value={ingresos} onChange={setIngresos} prefix="$" min="0" placeholder="Ej: 20000000" /></Field>
        <Field label="Superficie afectada (opcional)"><NumberInput value={superficie} onChange={setSuperficie} min="0" suffix="m²" /></Field>
        <Field label="Energía eléctrica consumida al año (opcional)"><NumberInput value={energia} onChange={setEnergia} min="0" suffix="kW" /></Field>
        <Field label="Alquileres devengados al año (opcional)"><NumberInput value={alquileres} onChange={setAlquileres} prefix="$" min="0" /></Field>
      </div>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular mi categoría</button>

      {r && (
        r.c ? (
          <ResultBox label={`Categoría ${r.c.cat} · cuota mensual`} value={ars(cuota)}>
            <Rows>
              <Row label="Impuesto integrado" value={ars(cuota - r.c.sipa - r.c.obraSocial)} />
              <Row label="Aporte jubilatorio (SIPA)" value={ars(r.c.sipa)} />
              <Row label="Obra social" value={ars(r.c.obraSocial)} />
              <Row label="Tope de ingresos de la categoría" value={ars(r.c.ingresos)} bold />
              {r.porIngresos && r.porIngresos.cat !== r.c.cat && <Row label="Categoría solo por ingresos" value={`${r.porIngresos.cat} (subís por superficie, energía o alquileres)`} />}
            </Rows>
            <Note>Escala vigente desde el 1 de agosto de 2026 (ARCA). Los topes se actualizan en febrero y agosto por inflación. Quienes venden bienes no pueden superar un precio unitario de {ars(PRECIO_UNITARIO_MAXIMO)}. Los aportes de SIPA y obra social no se pagan en algunos casos (jubilados, relación de dependencia, etc.).</Note>
          </ResultBox>
        ) : (
          <ResultBox label="Resultado" value="Excluido del Monotributo">
            <Note>Tus parámetros superan los de la categoría K ({ars(MONOTRIBUTO[10].ingresos)} de ingresos anuales). Deberías pasar al Régimen General (IVA y Ganancias).</Note>
          </ResultBox>
        )
      )}

      <details className="text-sm">
        <summary className="cursor-pointer font-medium text-blue-600">Ver tabla de categorías (agosto 2026)</summary>
        <div className="overflow-x-auto mt-2">
          <table className="w-full border border-gray-200">
            <thead className="bg-gray-50 text-gray-600">
              <tr><th className="px-2 py-2 text-left">Cat.</th><th className="px-2 py-2 text-right">Ingresos anuales</th><th className="px-2 py-2 text-right">Servicios</th><th className="px-2 py-2 text-right">Bienes</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MONOTRIBUTO.map((c) => (
                <tr key={c.cat}><td className="px-2 py-1.5 font-semibold">{c.cat}</td><td className="px-2 py-1.5 text-right">{ars(c.ingresos)}</td><td className="px-2 py-1.5 text-right">{ars(c.servicios)}</td><td className="px-2 py-1.5 text-right">{ars(c.bienes)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}
