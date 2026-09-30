'use client'

import { useState } from 'react'
import { planDeudas } from '@/lib/calc/finanzas'
import { buttonClass, ErrorText, formatMXN, formatNumber, inputClass, Note, NumberInput, secondaryButtonClass } from '@/components/calc-ui'

const vacia = () => ({ id: Math.random().toString(36).slice(2), nombre: '', saldo: '', tasa: '', minimo: '' })

function meses(n) {
  const a = Math.floor(n / 12)
  const m = n % 12
  return [a ? `${a} ${a === 1 ? 'año' : 'años'}` : '', m ? `${m} ${m === 1 ? 'mes' : 'meses'}` : ''].filter(Boolean).join(' y ') || '0 meses'
}

export default function PlanPagoDeudas() {
  const [deudas, setDeudas] = useState([
    { ...vacia(), nombre: 'Tarjeta de crédito' },
    { ...vacia(), nombre: 'Préstamo personal' },
  ])
  const [presupuesto, setPresupuesto] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const cambiar = (id, campo, valor) => setDeudas((d) => d.map((x) => (x.id === id ? { ...x, [campo]: valor } : x)))

  function calcular() {
    const lista = deudas
      .map((d) => ({ nombre: d.nombre || 'Deuda', saldo: parseFloat(d.saldo), tasa: parseFloat(d.tasa) || 0, minimo: parseFloat(d.minimo) || 0 }))
      .filter((d) => d.saldo > 0)
    const p = parseFloat(presupuesto)
    if (lista.length === 0) return setError('Añade al menos una deuda con su saldo.')
    if (!(p > 0)) return setError('Escribe cuánto puedes pagar en total cada mes.')
    setError('')
    const avalancha = planDeudas({ deudas: lista, presupuesto: p, metodo: 'avalancha' })
    const bolaNieve = planDeudas({ deudas: lista, presupuesto: p, metodo: 'bolaNieve' })
    const minimos = planDeudas({ deudas: lista, presupuesto: lista.reduce((s, d) => s + d.minimo, 0), metodo: 'avalancha' })
    if (avalancha.error) return setError(avalancha.error)
    setResult({ avalancha, bolaNieve, minimos, total: lista.reduce((s, d) => s + d.saldo, 0) })
  }

  const r = result

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="hidden sm:grid grid-cols-12 gap-2 text-xs font-medium text-gray-500">
          <span className="col-span-4">Deuda</span>
          <span className="col-span-3">Saldo</span>
          <span className="col-span-2">Tasa anual</span>
          <span className="col-span-2">Pago mínimo</span>
        </div>
        {deudas.map((d) => (
          <div key={d.id} className="grid grid-cols-12 gap-2 items-center">
            <input value={d.nombre} onChange={(e) => cambiar(d.id, 'nombre', e.target.value)} className={`${inputClass} col-span-12 sm:col-span-4`} placeholder="Nombre" />
            <div className="col-span-4 sm:col-span-3"><NumberInput value={d.saldo} onChange={(v) => cambiar(d.id, 'saldo', v)} prefix="$" min="0" placeholder="Saldo" /></div>
            <div className="col-span-4 sm:col-span-2"><NumberInput value={d.tasa} onChange={(v) => cambiar(d.id, 'tasa', v)} min="0" suffix="%" placeholder="Tasa" /></div>
            <div className="col-span-3 sm:col-span-2"><NumberInput value={d.minimo} onChange={(v) => cambiar(d.id, 'minimo', v)} prefix="$" min="0" placeholder="Mín." /></div>
            <button type="button" onClick={() => setDeudas((x) => x.filter((y) => y.id !== d.id))} className="col-span-1 text-red-600" aria-label="Eliminar deuda">✕</button>
          </div>
        ))}
        <button type="button" onClick={() => setDeudas((d) => [...d, vacia()])} className={secondaryButtonClass}>+ Añadir deuda</button>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">¿Cuánto puedes pagar en total cada mes?</label>
        <NumberInput value={presupuesto} onChange={setPresupuesto} prefix="$" min="0" placeholder="Ej: 5000" />
      </div>
      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Crear mi plan para pagar deudas</button>

      {r && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ['Método avalancha', 'Primero la de mayor tasa', r.avalancha],
              ['Método bola de nieve', 'Primero la de menor saldo', r.bolaNieve],
            ].map(([titulo, sub, p]) => (
              <div key={titulo} className={`rounded-xl border-2 p-4 space-y-2 ${p.intereses <= Math.min(r.avalancha.intereses, r.bolaNieve.intereses) + 0.5 ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
                <p className="font-bold text-gray-900">{titulo}</p>
                <p className="text-xs text-gray-500">{sub}</p>
                <p className="text-sm">Libre de deudas en <strong>{meses(p.meses)}</strong></p>
                <p className="text-sm">Intereses totales: <strong>{formatMXN(p.intereses)}</strong></p>
                <ol className="text-sm text-gray-700 list-decimal list-inside">
                  {p.liquidadas.map((l) => (
                    <li key={l.idx}>{l.nombre}: mes {l.mes}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
          <Note>
            {r.minimos.error
              ? 'Pagando solo los mínimos, tus deudas no se terminarían de pagar nunca: los intereses superan los abonos.'
              : `Pagando solo los mínimos tardarías ${meses(r.minimos.meses)} y pagarías ${formatMXN(r.minimos.intereses)} de intereses. Con tu plan ahorras ${formatMXN(r.minimos.intereses - Math.min(r.avalancha.intereses, r.bolaNieve.intereses))}.`}{' '}
            Supone tasas fijas, sin nuevos cargos, y que cada deuda liquidada libera su pago mínimo para la siguiente. Deuda total:
            {' '}{formatMXN(r.total)}; diferencia entre métodos: {formatMXN(Math.abs(r.avalancha.intereses - r.bolaNieve.intereses))} ({formatNumber(Math.abs(r.avalancha.meses - r.bolaNieve.meses), 0)} meses).
          </Note>
        </div>
      )}
    </div>
  )
}
