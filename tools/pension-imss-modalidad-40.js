'use client'

import { useState } from 'react'
import { simularModalidad40, TASA_MODALIDAD_40_2026, TOPE_SBC_DIARIO } from '@/lib/calc/mexico-laboral'
import { buttonClass, ErrorText, Field, formatMXN, formatNumber, inputClass, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

export default function PensionIMSSModalidad40() {
  const [semanas, setSemanas] = useState('')
  const [promedio, setPromedio] = useState('')
  const [sbc40, setSbc40] = useState(TOPE_SBC_DIARIO.toFixed(2))
  const [meses, setMeses] = useState('60')
  const [edad, setEdad] = useState('65')
  const [conyuge, setConyuge] = useState(true)
  const [hijos, setHijos] = useState('0')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const s = parseInt(semanas, 10)
    const p = parseFloat(promedio)
    const m40 = parseFloat(sbc40)
    const m = parseInt(meses, 10)
    if (!(s >= 0)) return setError('Introduce tus semanas cotizadas actuales (aparecen en tu reporte del IMSS).')
    if (!(p > 0)) return setError('Introduce tu salario diario promedio de las últimas 250 semanas.')
    if (!(m40 > 0)) return setError('Introduce el salario diario con el que cotizarías en Modalidad 40.')
    if (!(m >= 1 && m <= 120)) return setError('Los meses en Modalidad 40 deben estar entre 1 y 120.')
    setError('')
    setResult({
      meses: m,
      semanasActuales: s,
      ...simularModalidad40({
        semanasActuales: s,
        salarioPromedioActual: p,
        salarioM40: m40,
        meses: m,
        edad: parseInt(edad, 10),
        conyuge,
        hijos: Math.max(0, parseInt(hijos, 10) || 0),
      }),
    })
  }

  const r = result

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Semanas cotizadas actuales">
          <NumberInput value={semanas} onChange={setSemanas} min="0" step="1" placeholder="Ej: 1100" />
        </Field>
        <Field label="Salario diario promedio actual (últimas 250 semanas)">
          <NumberInput value={promedio} onChange={setPromedio} prefix="$" min="0" placeholder="Ej: 450" />
        </Field>
        <Field label="Salario diario en Modalidad 40" hint={`Máximo 25 UMA: ${formatMXN(TOPE_SBC_DIARIO)} diarios.`}>
          <NumberInput value={sbc40} onChange={setSbc40} prefix="$" min="0" />
        </Field>
        <Field label="Meses que cotizarás en Modalidad 40" hint="Con 60 meses (260 semanas) reemplazas todo el promedio.">
          <NumberInput value={meses} onChange={setMeses} min="1" max="120" step="1" />
        </Field>
        <Field label="Edad al pensionarte">
          <select value={edad} onChange={(e) => setEdad(e.target.value)} className={inputClass}>
            {[60, 61, 62, 63, 64, 65].map((e) => (
              <option key={e} value={e}>{e} años {e < 65 ? '(cesantía)' : '(vejez)'}</option>
            ))}
          </select>
        </Field>
        <Field label="Hijos menores de 16 (o estudiantes hasta 25)">
          <NumberInput value={hijos} onChange={setHijos} min="0" step="1" />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={conyuge} onChange={(e) => setConyuge(e.target.checked)} /> Tengo esposa(o) o concubina(o)
      </label>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Simular pensión con Modalidad 40</button>

      {r && (
        <ResultBox label="Pensión mensual estimada con Modalidad 40" value={r.con.error ? 'Sin derecho' : formatMXN(r.con.pensionMensual)}>
          <Rows>
            <Row label="Pensión sin Modalidad 40" value={r.sin.error ? 'Menos de 500 semanas' : formatMXN(r.sin.pensionMensual)} />
            <Row label="Aumento mensual de la pensión" value={formatMXN(r.ganancia)} bold />
            <Row label="Pago mensual a Modalidad 40" value={formatMXN(r.pagoMensual)} />
            <Row label={`Inversión total (${r.meses} meses)`} value={formatMXN(r.inversion)} />
            <Row label="Recuperas la inversión en" value={r.recuperacionMeses ? `${formatNumber(r.recuperacionMeses, 1)} meses de pensión` : '—'} />
            <Row label="Semanas totales al pensionarte" value={formatNumber(r.semanasActuales + r.semanas40, 0)} />
            <Row label="Nuevo salario promedio (250 semanas)" value={formatMXN(r.nuevoPromedio)} />
            {!r.con.error && (
              <>
                <Row label="Veces salario mínimo del promedio" value={formatNumber(r.con.veces, 2)} />
                <Row label="Cuantía básica + incrementos" value={`${formatNumber(r.con.basica, 2)}% + ${formatNumber(r.con.incremento, 3)}% × ${r.con.aniosIncremento} años`} />
                <Row label="Asignaciones familiares o ayuda asistencial" value={`${r.con.pctAsignaciones}%`} />
                <Row label="Factor de edad" value={`${r.con.factorEdad * 100}%`} />
              </>
            )}
          </Rows>
          {r.con.error && <Note>{r.con.error}</Note>}
          {r.con.pensionMinimaAplicada && <Note>El cálculo quedó por debajo del salario mínimo, así que se aplica la pensión mínima garantizada.</Note>}
          <Note>
            Estimación para quienes empezaron a cotizar antes del 1 de julio de 1997 (Ley 73). Cuota de Modalidad 40 en 2026:
            {' '}{formatNumber(TASA_MODALIDAD_40_2026 * 100, 3)}% del salario registrado, que sube cada año hasta 2030. Incluye el
            incremento del 11% y la pensión mínima de un salario mínimo. Confirma tu caso con el IMSS antes de invertir.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
