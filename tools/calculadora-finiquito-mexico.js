'use client'

import { useEffect, useState } from 'react'
import { calcularFiniquitoMX, MOTIVOS_SALIDA, UMA_DIARIA_2026 } from '@/lib/calc/mexico-laboral'
import { buttonClass, ErrorText, Field, formatMXN, formatNumber, inputClass, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

const PERIODOS = [
  { id: 'mensual', label: 'Mensual', dias: 30 },
  { id: 'quincenal', label: 'Quincenal', dias: 15 },
  { id: 'semanal', label: 'Semanal', dias: 7 },
  { id: 'diario', label: 'Diario', dias: 1 },
]

export default function CalculadoraFiniquitoMexico() {
  const [salario, setSalario] = useState('')
  const [periodo, setPeriodo] = useState('mensual')
  const [fechaIngreso, setFechaIngreso] = useState('')
  const [fechaSalida, setFechaSalida] = useState('')
  const [motivo, setMotivo] = useState('renuncia')
  const [diasPendientes, setDiasPendientes] = useState('0')
  const [vacPendientes, setVacPendientes] = useState('0')
  const [diasAguinaldo, setDiasAguinaldo] = useState('15')
  const [prima, setPrima] = useState('25')
  const [frontera, setFrontera] = useState(false)
  const [veinteDias, setVeinteDias] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  // La fecha de hoy se pone en el cliente para que el HTML estático no quede con la fecha de compilación.
  useEffect(() => setFechaSalida(new Date().toISOString().slice(0, 10)), [])

  function calcular() {
    const s = parseFloat(salario)
    if (!(s > 0)) return setError('Escribe tu salario bruto (antes de impuestos).')
    if (!fechaIngreso || !fechaSalida) return setError('Indica tu fecha de ingreso y tu último día de trabajo.')
    if (fechaSalida < fechaIngreso) return setError('La fecha de salida no puede ser anterior a la de ingreso.')
    const nums = [diasPendientes, vacPendientes, diasAguinaldo, prima].map((v) => parseFloat(v || '0'))
    if (nums.some((n) => !(n >= 0))) return setError('Los días y porcentajes no pueden ser negativos.')
    if (nums[2] < 15) return setError('El aguinaldo mínimo por ley es de 15 días (art. 87 LFT).')
    if (nums[3] < 25) return setError('La prima vacacional mínima por ley es del 25% (art. 80 LFT).')
    setError('')
    const salarioDiario = s / PERIODOS.find((p) => p.id === periodo).dias
    setResult({
      salarioDiario,
      ...calcularFiniquitoMX({
        salarioDiario, fechaIngreso, fechaSalida, motivo,
        diasSalarioPendientes: nums[0], vacacionesPendientes: nums[1], diasAguinaldo: nums[2], porcentajePrima: nums[3],
        zonaFrontera: frontera, incluir20Dias: veinteDias,
      }),
    })
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Salario bruto" id="fq-salario">
          <NumberInput id="fq-salario" value={salario} onChange={setSalario} prefix="$" min="0" placeholder="Ej: 15000" />
        </Field>
        <Field label="Periodo del salario" id="fq-periodo">
          <select id="fq-periodo" value={periodo} onChange={(e) => setPeriodo(e.target.value)} className={inputClass}>
            {PERIODOS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </Field>
        <Field label="Fecha de ingreso" id="fq-ingreso">
          <input id="fq-ingreso" type="date" value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Último día de trabajo" id="fq-salida">
          <input id="fq-salida" type="date" value={fechaSalida} onChange={(e) => setFechaSalida(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Motivo de la salida" id="fq-motivo">
          <select id="fq-motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)} className={inputClass}>
            {MOTIVOS_SALIDA.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
        </Field>
        <Field label="Días de salario pendientes" id="fq-pendientes" hint="Días trabajados que aún no te pagan (por ejemplo, desde la última quincena).">
          <NumberInput id="fq-pendientes" value={diasPendientes} onChange={setDiasPendientes} min="0" suffix="días" />
        </Field>
        <Field label="Vacaciones de años anteriores sin disfrutar" id="fq-vac" hint="Las del año en curso se calculan solas.">
          <NumberInput id="fq-vac" value={vacPendientes} onChange={setVacPendientes} min="0" suffix="días" />
        </Field>
        <Field label="Días de aguinaldo al año" id="fq-aguinaldo" hint="Mínimo legal: 15 días.">
          <NumberInput id="fq-aguinaldo" value={diasAguinaldo} onChange={setDiasAguinaldo} min="15" suffix="días" />
        </Field>
        <Field label="Prima vacacional" id="fq-prima" hint="Mínimo legal: 25%.">
          <NumberInput id="fq-prima" value={prima} onChange={setPrima} min="25" suffix="%" />
        </Field>
      </div>

      <div className="space-y-2 text-sm text-gray-700">
        <label className="flex items-start gap-2">
          <input type="checkbox" checked={frontera} onChange={(e) => setFrontera(e.target.checked)} className="mt-1" />
          Trabajo en la Zona Libre de la Frontera Norte (cambia el tope de la prima de antigüedad)
        </label>
        {motivo === 'injustificado' && (
          <label className="flex items-start gap-2">
            <input type="checkbox" checked={veinteDias} onChange={(e) => setVeinteDias(e.target.checked)} className="mt-1" />
            Incluir 20 días por año de servicio (procede, por ejemplo, si el patrón se niega a reinstalarte)
          </label>
        )}
      </div>

      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular finiquito</button>

      <div aria-live="polite">
        {result && (
          <ResultBox label={result.liquidacion > 0 ? 'Finiquito + liquidación (bruto)' : 'Finiquito (bruto)'} value={formatMXN(result.total)}>
            <Rows>
              <Row label="Salario diario" value={formatMXN(result.salarioDiario)} />
              <Row label="Antigüedad" value={`${result.anios} año${result.anios !== 1 ? 's' : ''} (${formatNumber(result.diasServicio, 0)} días)`} />
              {result.conceptos.filter((c) => !c.liquidacion).map((c) => (
                <Row key={c.id} label={`${c.label}${c.dias !== undefined ? ` · ${formatNumber(c.dias)} días` : ''}`} value={formatMXN(c.monto)} />
              ))}
              <Row label="Finiquito" value={formatMXN(result.finiquito)} bold highlight={result.liquidacion === 0} />
              {result.conceptos.filter((c) => c.liquidacion).map((c) => (
                <Row key={c.id} label={`${c.label} · ${formatNumber(c.dias)} días`} value={formatMXN(c.monto)} />
              ))}
              {result.liquidacion > 0 && <Row label="Liquidación (indemnizaciones)" value={formatMXN(result.liquidacion)} bold />}
              {result.liquidacion > 0 && <Row label="Total a recibir (bruto)" value={formatMXN(result.total)} bold highlight />}
            </Rows>

            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-semibold text-gray-900">Cómo se calculó</p>
              <p>Aguinaldo: {diasAguinaldo} días × {formatNumber(result.diasAnio, 0)} días trabajados en el año ÷ 365.</p>
              <p>Vacaciones: días proporcionales desde tu último aniversario + {vacPendientes || 0} pendientes, pagados a tu salario diario.</p>
              {result.procedePrima ? (
                <p>Prima de antigüedad: 12 días × {formatNumber(result.aniosConFraccion)} años × {formatMXN(result.salarioPrima)} (salario topado al doble del mínimo, {formatMXN(result.salarioMinimo * 2)}).</p>
              ) : (
                <p>Prima de antigüedad: no procede por renuncia con menos de 15 años de servicio (art. 162 LFT).</p>
              )}
              {result.sdi && <p>Salario diario integrado usado en la indemnización: {formatMXN(result.sdi)}.</p>}
            </div>

            <Note>
              Montos <strong>brutos</strong>. Exentos de ISR (art. 93 LISR, UMA 2026 de {formatMXN(UMA_DIARIA_2026)}): aguinaldo hasta 30 UMA
              ({formatMXN(result.exenciones.aguinaldo)} en tu caso), prima vacacional hasta 15 UMA ({formatMXN(result.exenciones.prima)})
              {result.liquidacion > 0 && <> e indemnizaciones hasta 90 UMA por año de servicio ({formatMXN(result.exenciones.separacion)})</>}.
              El resto paga ISR. Si tu caso va a juicio o tienes prestaciones superiores a la ley, consulta a la Procuraduría Federal de la Defensa del Trabajo (Profedet).
            </Note>
          </ResultBox>
        )}
      </div>
    </div>
  )
}
