'use client'

import { useState } from 'react'
import { tasaCEAVPatronal } from '@/lib/calc/mexico-laboral'
import { buttonClass, ErrorText, Field, formatMXN, formatNumber, inputClass, Note, NumberInput, ResultBox } from '@/components/calc-ui'

const INICIALES = [
  { nombre: 'AFORE A', rendimiento: '6.5' },
  { nombre: 'AFORE B', rendimiento: '5.5' },
  { nombre: 'AFORE C', rendimiento: '4.5' },
]

// Proyección mensual con aportaciones constantes en pesos de hoy y rendimiento real neto anual.
function proyectar({ saldo, aportacion, rendimiento, anios }) {
  const i = Math.pow(1 + rendimiento / 100, 1 / 12) - 1
  let s = saldo
  for (let m = 0; m < anios * 12; m++) s = s * (1 + i) + aportacion
  return s
}

export default function ComparadorAfore() {
  const [saldo, setSaldo] = useState('')
  const [salario, setSalario] = useState('')
  const [edad, setEdad] = useState('')
  const [edadRetiro, setEdadRetiro] = useState('65')
  const [voluntaria, setVoluntaria] = useState('0')
  const [afores, setAfores] = useState(INICIALES)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const cambiar = (idx, campo, valor) => setAfores((a) => a.map((x, i) => (i === idx ? { ...x, [campo]: valor } : x)))

  function calcular() {
    const s0 = parseFloat(saldo) || 0
    const sal = parseFloat(salario)
    const e = parseInt(edad, 10)
    const er = parseInt(edadRetiro, 10)
    if (!(sal > 0)) return setError('Introduce tu salario mensual.')
    if (!(e >= 18 && er > e && er <= 75)) return setError('Revisa tu edad actual y la edad de retiro.')
    const lista = afores.filter((a) => a.nombre.trim() && !isNaN(parseFloat(a.rendimiento)))
    if (lista.length < 2) return setError('Compara al menos dos AFORE con su rendimiento.')
    setError('')
    const sbc = sal / 30.4
    const tasa = 0.02 + tasaCEAVPatronal(sbc).tasa + 0.01125
    const aportacion = sal * tasa + (parseFloat(voluntaria) || 0)
    const anios = er - e
    const filas = lista
      .map((a) => ({ ...a, saldoFinal: proyectar({ saldo: s0, aportacion, rendimiento: parseFloat(a.rendimiento), anios }) }))
      .sort((x, y) => y.saldoFinal - x.saldoFinal)
    setResult({ filas, aportacion, tasa, anios })
  }

  const r = result

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Saldo actual en tu AFORE" hint="Lo ves en tu estado de cuenta o en la app AFORE Móvil.">
          <NumberInput value={saldo} onChange={setSaldo} prefix="$" min="0" placeholder="Ej: 150000" />
        </Field>
        <Field label="Salario mensual bruto">
          <NumberInput value={salario} onChange={setSalario} prefix="$" min="0" placeholder="Ej: 20000" />
        </Field>
        <Field label="Edad actual">
          <NumberInput value={edad} onChange={setEdad} min="18" max="74" step="1" placeholder="Ej: 35" />
        </Field>
        <Field label="Edad de retiro">
          <NumberInput value={edadRetiro} onChange={setEdadRetiro} min="60" max="75" step="1" />
        </Field>
        <Field label="Ahorro voluntario mensual (opcional)">
          <NumberInput value={voluntaria} onChange={setVoluntaria} prefix="$" min="0" />
        </Field>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">AFORE a comparar y su rendimiento neto anual (IRN)</p>
        {afores.map((a, i) => (
          <div key={i} className="flex gap-2">
            <input value={a.nombre} onChange={(e) => cambiar(i, 'nombre', e.target.value)} className={inputClass} placeholder="Nombre de la AFORE" />
            <div className="w-40 flex-shrink-0">
              <NumberInput value={a.rendimiento} onChange={(v) => cambiar(i, 'rendimiento', v)} step="0.1" suffix="%" />
            </div>
            {afores.length > 2 && (
              <button type="button" onClick={() => setAfores((x) => x.filter((_, j) => j !== i))} className="text-red-600 px-2" aria-label="Quitar AFORE">
                ✕
              </button>
            )}
          </div>
        ))}
        {afores.length < 10 && (
          <button type="button" onClick={() => setAfores((x) => [...x, { nombre: '', rendimiento: '' }])} className="text-sm text-blue-600 font-medium">
            + Añadir AFORE
          </button>
        )}
        <p className="text-xs text-gray-500">
          Los valores iniciales son de ejemplo. Escribe el Indicador de Rendimiento Neto de tu SIEFORE generacional, publicado por
          la CONSAR. Usa rendimientos reales (descontando inflación) para ver el resultado en pesos de hoy.
        </p>
      </div>

      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Comparar AFORE</button>

      {r && (
        <ResultBox label={`Saldo estimado al retiro con ${r.filas[0].nombre}`} value={formatMXN(r.filas[0].saldoFinal)}>
          <div className="bg-white rounded-lg border border-blue-100 divide-y divide-gray-100 text-sm">
            {r.filas.map((f, i) => (
              <div key={f.nombre + i} className="px-4 py-2.5 space-y-1">
                <div className="flex justify-between gap-3">
                  <span className="font-medium text-gray-900">{i + 1}. {f.nombre} · {formatNumber(parseFloat(f.rendimiento), 2)}%</span>
                  <span className="font-semibold">{formatMXN(f.saldoFinal)}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded">
                  <div className="h-2 bg-blue-500 rounded" style={{ width: `${(f.saldoFinal / r.filas[0].saldoFinal) * 100}%` }} />
                </div>
                {i > 0 && <p className="text-xs text-red-600">{formatMXN(r.filas[0].saldoFinal - f.saldoFinal)} menos que la primera</p>}
              </div>
            ))}
          </div>
          <Note>
            Aportación obligatoria estimada: {formatMXN(r.aportacion)} al mes ({formatNumber(r.tasa * 100, 3)}% del salario:
            retiro 2%, cesantía y vejez patronal 2026 y cuota obrera 1.125%, más tu ahorro voluntario) durante {r.anios} años. No
            incluye la cuota social del gobierno ni los aumentos de la reforma en años posteriores. Rendimientos pasados no
            garantizan rendimientos futuros.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
