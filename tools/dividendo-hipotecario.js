'use client'

import { useState } from 'react'
import { AvisoIndicadores, useIndicadoresChile } from '@/components/useIndicadoresChile'
import { clp } from '@/components/calc-ui-eur'
import { buttonClass, ErrorText, Field, formatNumber, inputClass, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

export default function DividendoHipotecario() {
  const ind = useIndicadoresChile()
  const [valor, setValor] = useState('')
  const [pie, setPie] = useState('20')
  const [tasa, setTasa] = useState('')
  const [anios, setAnios] = useState('25')
  const [desgravamen, setDesgravamen] = useState('0.0035')
  const [incendio, setIncendio] = useState('0.3')
  const [renta, setRenta] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const v = parseFloat(valor)
    const t = parseFloat(tasa)
    const n = parseInt(anios, 10) * 12
    const p = parseFloat(pie)
    if (!(v > 0)) return setError('Ingresa el valor de la propiedad en UF.')
    if (!(t > 0 && t < 20)) return setError('Ingresa la tasa de interés anual del crédito (por ejemplo, 4.5).')
    if (!(p >= 0 && p < 100)) return setError('El pie debe estar entre 0% y 99%.')
    setError('')
    const credito = v * (1 - p / 100)
    const i = t / 100 / 12
    const cuota = (credito * i) / (1 - Math.pow(1 + i, -n))
    const segDesg = credito * ((parseFloat(desgravamen) || 0) / 100)
    const segInc = parseFloat(incendio) || 0
    const dividendoUF = cuota + segDesg + segInc
    const uf = ind.uf
    const rentaMin = uf ? (dividendoUF * uf) / 0.25 : null
    setResult({ credito, cuota, segDesg, segInc, dividendoUF, uf, total: cuota * n, intereses: cuota * n - credito, rentaMin, n })
  }

  const r = result
  const rentaUsuario = parseFloat(renta)
  return (
    <div className="space-y-5">
      <AvisoIndicadores datos={ind} que="la UF" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Valor de la propiedad"><NumberInput value={valor} onChange={setValor} min="0" suffix="UF" placeholder="Ej: 3500" /></Field>
        <Field label="Pie" hint="Los bancos suelen financiar hasta el 80% o 90%."><NumberInput value={pie} onChange={setPie} min="0" max="99" suffix="%" /></Field>
        <Field label="Tasa de interés anual"><NumberInput value={tasa} onChange={setTasa} min="0" step="0.01" suffix="%" placeholder="Ej: 4.5" /></Field>
        <Field label="Plazo">
          <select value={anios} onChange={(e) => setAnios(e.target.value)} className={inputClass}>
            {[8, 10, 12, 15, 20, 25, 30].map((a) => (
              <option key={a} value={a}>{a} años</option>
            ))}
          </select>
        </Field>
        <Field label="Seguro de desgravamen mensual (% del crédito)"><NumberInput value={desgravamen} onChange={setDesgravamen} min="0" step="0.0001" suffix="%" /></Field>
        <Field label="Seguro de incendio y sismo mensual"><NumberInput value={incendio} onChange={setIncendio} min="0" step="0.01" suffix="UF" /></Field>
        <Field label="Tu renta líquida mensual (opcional)"><NumberInput value={renta} onChange={setRenta} prefix="$" min="0" /></Field>
      </div>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular dividendo</button>

      {r && (
        <ResultBox label="Dividendo mensual" value={r.uf ? clp(r.dividendoUF * r.uf) : `${formatNumber(r.dividendoUF, 2)} UF`}>
          <Rows>
            <Row label="Monto del crédito" value={`${formatNumber(r.credito, 2)} UF`} bold />
            <Row label="Cuota (capital + intereses)" value={`${formatNumber(r.cuota, 3)} UF`} />
            <Row label="Seguro de desgravamen" value={`${formatNumber(r.segDesg, 3)} UF`} />
            <Row label="Seguro de incendio y sismo" value={`${formatNumber(r.segInc, 3)} UF`} />
            <Row label="Dividendo total" value={`${formatNumber(r.dividendoUF, 3)} UF`} bold />
            <Row label={`Total pagado en ${r.n / 12} años (sin seguros)`} value={`${formatNumber(r.total, 0)} UF`} />
            <Row label="Intereses totales" value={`${formatNumber(r.intereses, 0)} UF`} />
            {r.rentaMin && <Row label="Renta líquida mínima sugerida (dividendo ≤ 25%)" value={clp(r.rentaMin)} highlight />}
          </Rows>
          {r.rentaMin && rentaUsuario > 0 && (
            <p className={`text-sm font-medium ${rentaUsuario >= r.rentaMin ? 'text-green-700' : 'text-red-700'}`}>
              {rentaUsuario >= r.rentaMin ? 'Tu renta alcanza para este dividendo según el criterio habitual de los bancos.' : 'El dividendo superaría el 25% de tu renta: el banco podría pedir un pie mayor o un codeudor.'}
            </p>
          )}
          <Note>El dividendo en UF es fijo, pero en pesos sube cada mes con la inflación. Compara siempre el CAE (carga anual equivalente) entre bancos. Las tasas de los seguros son de referencia; usa las de tu cotización.</Note>
        </ResultBox>
      )}
    </div>
  )
}
