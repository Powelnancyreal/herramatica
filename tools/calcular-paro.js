'use client'

import { useState } from 'react'
import { calcularParo, IPREM_MENSUAL_2026 } from '@/lib/calc/espana'
import { eur } from '@/components/calc-ui-eur'
import { buttonClass, ErrorText, Field, formatNumber, inputClass, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

export default function CalcularParo() {
  const [base, setBase] = useState('')
  const [modoCot, setModoCot] = useState('anios')
  const [cotizado, setCotizado] = useState('')
  const [hijos, setHijos] = useState('0')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const b = parseFloat(base)
    const c = parseFloat(cotizado)
    if (!(b > 0)) return setError('Introduce tu base de cotización mensual (aparece en tus nóminas como «base de desempleo» o «base AT y EP»).')
    if (!(c > 0)) return setError('Introduce el tiempo cotizado en los últimos 6 años.')
    setError('')
    const dias = modoCot === 'anios' ? Math.round(c * 365) : Math.round(c)
    setResult(calcularParo({ baseMensual: b, diasCotizados: Math.min(dias, 2190), hijos: parseInt(hijos, 10) }))
  }

  const r = result
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Base de cotización mensual media (últimos 180 días)" hint="Incluye la parte proporcional de pagas extra.">
          <NumberInput value={base} onChange={setBase} suffix="€" min="0" placeholder="Ej: 1900" />
        </Field>
        <Field label="Cotizado en los últimos 6 años">
          <div className="flex gap-2">
            <NumberInput value={cotizado} onChange={setCotizado} min="0" step="any" placeholder={modoCot === 'anios' ? 'Ej: 4' : 'Ej: 1460'} />
            <select value={modoCot} onChange={(e) => setModoCot(e.target.value)} className={`${inputClass} max-w-[7rem]`}>
              <option value="anios">Años</option>
              <option value="dias">Días</option>
            </select>
          </div>
        </Field>
        <Field label="Hijos a cargo (menores de 26)">
          <select value={hijos} onChange={(e) => setHijos(e.target.value)} className={inputClass}>
            <option value="0">Ninguno</option>
            <option value="1">1 hijo</option>
            <option value="2">2 o más hijos</option>
          </select>
        </Field>
      </div>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular mi paro</button>

      {r && (
        r.dias === 0 ? (
          <ResultBox label="Prestación contributiva" value="Sin derecho">
            <Note>Se necesitan al menos 360 días cotizados en los últimos 6 años. Con menos tiempo puedes tener derecho al subsidio por desempleo; consúltalo en el SEPE.</Note>
          </ResultBox>
        ) : (
          <ResultBox label="Cobrarás los primeros 6 meses" value={`${eur(r.tramos[0].mensual)}/mes`}>
            <Rows>
              <Row label="Duración de la prestación" value={`${r.dias} días (${formatNumber(r.dias / 30, 0)} meses)`} bold />
              {r.tramos.map((t) => (
                <Row key={t.desde} label={`Días ${t.desde} a ${t.hasta} (${t.pct}% de la base)`} value={`${eur(t.mensual)}/mes`} />
              ))}
              <Row label="Cuantía mínima / máxima aplicable" value={`${eur(r.minimo)} / ${eur(r.maximo)}`} />
              <Row label="Total bruto de toda la prestación" value={eur(r.total)} bold highlight />
            </Rows>
            <Note>
              Importes brutos. El SEPE descuenta tu parte de la cotización a la Seguridad Social (alrededor del 4.85%) y, si
              corresponde, la retención de IRPF. Límites calculados con el IPREM de 2026 ({eur(IPREM_MENSUAL_2026)} al mes) y los
              porcentajes vigentes desde noviembre de 2024: 70%, 60% y 50%.
            </Note>
          </ResultBox>
        )
      )}
    </div>
  )
}
