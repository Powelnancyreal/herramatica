'use client'

import { useState } from 'react'
import { calcularSDI, diasVacacionesPorAntiguedad, TOPE_SBC_DIARIO } from '@/lib/calc/mexico-laboral'
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

export default function CalcularSalarioDiarioIntegrado() {
  const [tipo, setTipo] = useState('mensual')
  const [salario, setSalario] = useState('')
  const [anios, setAnios] = useState('1')
  const [aguinaldo, setAguinaldo] = useState('15')
  const [prima, setPrima] = useState('25')
  const [otras, setOtras] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function calcular() {
    const s = parseFloat(salario)
    const n = parseInt(anios, 10)
    const ag = parseFloat(aguinaldo)
    const pr = parseFloat(prima)
    if (!(s > 0)) return setError('Introduce tu salario.')
    if (!(n >= 1)) return setError('Introduce tus años de antigüedad (mínimo 1).')
    if (!(ag >= 15)) return setError('El aguinaldo no puede ser menor a 15 días (art. 87 LFT).')
    if (!(pr >= 25)) return setError('La prima vacacional no puede ser menor al 25% (art. 80 LFT).')
    setError('')
    const salarioDiario = tipo === 'mensual' ? s / 30 : s
    const diasVacaciones = diasVacacionesPorAntiguedad(n)
    const r = calcularSDI({
      salarioDiario,
      diasAguinaldo: ag,
      diasVacaciones,
      porcentajePrima: pr,
      otrasPrestacionesDiarias: parseFloat(otras) || 0,
    })
    const tabla = [1, 2, 3, 4, 5, 6, 11, 16, 21].map((a) => ({
      anio: a,
      factor: calcularSDI({ salarioDiario: 1, diasAguinaldo: ag, diasVacaciones: diasVacacionesPorAntiguedad(a), porcentajePrima: pr }).factor,
    }))
    setResult({ ...r, salarioDiario, diasVacaciones, tabla })
  }

  return (
    <div className="space-y-5">
      <Tabs
        tabs={[
          { id: 'mensual', label: 'Salario mensual' },
          { id: 'diario', label: 'Salario diario' },
        ]}
        value={tipo}
        onChange={setTipo}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={tipo === 'mensual' ? 'Salario mensual' : 'Salario diario'}>
          <NumberInput value={salario} onChange={setSalario} prefix="$" min="0" />
        </Field>
        <Field label="Años de antigüedad cumplidos" hint="Determina tus días de vacaciones por ley.">
          <NumberInput value={anios} onChange={setAnios} min="1" step="1" inputMode="numeric" />
        </Field>
        <Field label="Días de aguinaldo" hint="Mínimo legal: 15.">
          <NumberInput value={aguinaldo} onChange={setAguinaldo} min="15" suffix="días" />
        </Field>
        <Field label="Prima vacacional" hint="Mínimo legal: 25%.">
          <NumberInput value={prima} onChange={setPrima} min="25" suffix="%" />
        </Field>
        <Field label="Otras prestaciones fijas por día (opcional)" hint="Ej. vales o bonos fijos que integran salario, en pesos por día.">
          <NumberInput value={otras} onChange={setOtras} prefix="$" min="0" />
        </Field>
      </div>

      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular salario diario integrado</button>

      {result && (
        <ResultBox label="Salario diario integrado (SDI)" value={formatMXN(result.sdi)}>
          <Rows>
            <Row label="Salario diario" value={formatMXN(result.salarioDiario)} />
            <Row label={`Días de vacaciones por antigüedad`} value={`${result.diasVacaciones} días`} />
            <Row label="Factor de integración" value={result.factor.toFixed(4)} bold />
            <Row label="Salario diario integrado" value={formatMXN(result.sdi)} bold highlight />
            <Row label="Salario base de cotización IMSS (con tope)" value={formatMXN(result.sbc)} />
            <Row label="SDI mensual (× 30)" value={formatMXN(result.sdi * 30)} />
          </Rows>
          {result.topado && (
            <Note>Tu SDI supera el tope de 25 UMA ({formatMXN(TOPE_SBC_DIARIO)} diarios), así que el IMSS cotiza con el tope.</Note>
          )}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Factor de integración según antigüedad (con tus prestaciones)</p>
            <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 text-xs">
              {result.tabla.map((t) => (
                <div key={t.anio} className="bg-white rounded border border-blue-100 px-1 py-1.5 text-center">
                  <div className="text-gray-500">Año {t.anio}</div>
                  <div className="font-semibold text-gray-800">{t.factor.toFixed(4)}</div>
                </div>
              ))}
            </div>
          </div>
        </ResultBox>
      )}
    </div>
  )
}
