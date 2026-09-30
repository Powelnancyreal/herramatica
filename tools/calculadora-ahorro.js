'use client'

import { useState } from 'react'
import {
  buttonClass,
  ErrorText,
  Field,
  formatMXN,
  Note,
  NumberInput,
  ResultBox,
  Row,
  Rows,
  Tabs,
} from '@/components/calc-ui'

// Aportación al final de cada mes, interés compuesto mensual (tasa anual ÷ 12).
function mesesParaMeta({ meta, actual, aporte, tasaAnual }) {
  const i = tasaAnual / 100 / 12
  let saldo = actual
  let meses = 0
  while (saldo < meta && meses < 1200) {
    saldo = saldo * (1 + i) + aporte
    meses++
  }
  return saldo >= meta ? { meses, saldo } : null
}

function aporteNecesario({ meta, actual, meses, tasaAnual }) {
  const i = tasaAnual / 100 / 12
  const crecimiento = Math.pow(1 + i, meses)
  const faltante = meta - actual * crecimiento
  if (faltante <= 0) return 0
  return i === 0 ? faltante / meses : (faltante * i) / (crecimiento - 1)
}

function textoMeses(m) {
  const anios = Math.floor(m / 12)
  const resto = m % 12
  return [anios && `${anios} año${anios === 1 ? '' : 's'}`, resto && `${resto} mes${resto === 1 ? '' : 'es'}`].filter(Boolean).join(' y ') || '0 meses'
}

export default function CalculadoraAhorro() {
  const [modo, setModo] = useState('tiempo')
  const [meta, setMeta] = useState('')
  const [actual, setActual] = useState('0')
  const [aporte, setAporte] = useState('')
  const [meses, setMeses] = useState('12')
  const [tasa, setTasa] = useState('0')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const M = parseFloat(meta)
    const A = parseFloat(actual) || 0
    const t = parseFloat(tasa) || 0
    if (!(M > 0)) return setError('Introduce tu meta de ahorro.')
    if (A >= M) return setError('¡Ya alcanzaste tu meta! Tu ahorro actual es mayor o igual a la meta.')
    if (t < 0) return setError('La tasa de rendimiento no puede ser negativa.')

    if (modo === 'tiempo') {
      const ap = parseFloat(aporte)
      if (!(ap > 0) && t === 0) return setError('Introduce cuánto ahorrarás cada mes.')
      const r = mesesParaMeta({ meta: M, actual: A, aporte: ap || 0, tasaAnual: t })
      if (!r) return setError('Con esa aportación tardarías más de 100 años. Prueba con una aportación mayor.')
      const aportado = A + (ap || 0) * r.meses
      setError('')
      return setResult({ modo, meses: r.meses, saldo: r.saldo, aportado, intereses: r.saldo - aportado })
    }

    const n = parseInt(meses, 10)
    if (!(n > 0)) return setError('Introduce en cuántos meses quieres lograr tu meta.')
    const ap = aporteNecesario({ meta: M, actual: A, meses: n, tasaAnual: t })
    const aportado = A + ap * n
    setError('')
    setResult({ modo, aporte: ap, meses: n, saldo: M, aportado, intereses: M - aportado })
  }

  return (
    <div className="space-y-5">
      <Tabs
        tabs={[
          { id: 'tiempo', label: '¿Cuánto tardaré?' },
          { id: 'aporte', label: '¿Cuánto debo ahorrar al mes?' },
        ]}
        value={modo}
        onChange={setModo}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Meta de ahorro">
          <NumberInput value={meta} onChange={setMeta} prefix="$" min="0" placeholder="Ej: 50000" />
        </Field>
        <Field label="Ahorro actual">
          <NumberInput value={actual} onChange={setActual} prefix="$" min="0" />
        </Field>
        {modo === 'tiempo' ? (
          <Field label="Aportación mensual">
            <NumberInput value={aporte} onChange={setAporte} prefix="$" min="0" placeholder="Ej: 2500" />
          </Field>
        ) : (
          <Field label="Plazo para lograrlo">
            <NumberInput value={meses} onChange={setMeses} min="1" step="1" suffix="meses" />
          </Field>
        )}
        <Field label="Rendimiento anual (opcional)" hint="Déjalo en 0 si ahorras sin invertir.">
          <NumberInput value={tasa} onChange={setTasa} min="0" suffix="%" />
        </Field>
      </div>

      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular</button>

      {result && (
        <ResultBox
          label={result.modo === 'tiempo' ? 'Alcanzarás tu meta en' : 'Debes ahorrar cada mes'}
          value={result.modo === 'tiempo' ? textoMeses(result.meses) : formatMXN(result.aporte)}
        >
          <Rows>
            <Row label="Plazo" value={`${result.meses} meses (${textoMeses(result.meses)})`} />
            <Row label="Total que aportas de tu bolsillo" value={formatMXN(result.aportado)} />
            <Row label="Rendimientos generados" value={formatMXN(result.intereses)} />
            <Row label="Saldo final" value={formatMXN(result.saldo)} bold highlight />
          </Rows>
          <Note>
            Supone una aportación al final de cada mes y rendimiento compuesto mensual. Los rendimientos reales pueden
            variar y, según el instrumento, pueden estar sujetos a impuestos.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
