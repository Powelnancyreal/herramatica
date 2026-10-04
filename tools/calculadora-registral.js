'use client'

import { useState } from 'react'
import { calcularDerechosRegistrales, PERU, SUNARP_ACTOS } from '@/lib/calc/latam'
import { buttonClass, ErrorText, Field, inputClass, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

const soles = (n) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 2 }).format(n)

export default function CalculadoraRegistral() {
  const [actoId, setActoId] = useState('compraventa')
  const acto = SUNARP_ACTOS.find((a) => a.id === actoId)
  const [valor, setValor] = useState('')
  const [calificacion, setCalificacion] = useState(String(acto.calificacionUIT))
  const [porMil, setPorMil] = useState(String(acto.inscripcionPorMil))
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function elegirActo(id) {
    setActoId(id)
    const a = SUNARP_ACTOS.find((x) => x.id === id)
    setCalificacion(String(a.calificacionUIT))
    setPorMil(String(a.inscripcionPorMil))
    setResult(null)
  }

  function calcular() {
    const v = parseFloat(valor)
    const c = parseFloat(calificacion)
    const p = parseFloat(porMil)
    if (!(v > 0)) return setError(`Escribe el ${acto.valor.toLowerCase()} en soles.`)
    if (!(c >= 0) || !(p >= 0)) return setError('Las tasas no pueden ser negativas.')
    setError('')
    setResult(calcularDerechosRegistrales({ valor: v, calificacionUIT: c, inscripcionPorMil: p }))
  }

  return (
    <div className="space-y-5">
      <Field label="Acto que vas a inscribir" id="reg-acto">
        <select id="reg-acto" value={actoId} onChange={(e) => elegirActo(e.target.value)} className={inputClass}>
          {SUNARP_ACTOS.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
        </select>
      </Field>
      <Field label={acto.valor} id="reg-valor" hint="Si el valor está en dólares, conviértelo a soles con el tipo de cambio del día.">
        <NumberInput id="reg-valor" value={valor} onChange={setValor} prefix="S/" min="0" placeholder="Ej: 250000" />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Derecho de calificación (% de la UIT)" id="reg-cal" hint={`UIT 2026: ${soles(PERU.uit)}.`}>
          <NumberInput id="reg-cal" value={calificacion} onChange={setCalificacion} min="0" step="0.01" suffix="%" />
        </Field>
        <Field label="Derecho de inscripción (por mil del valor)" id="reg-mil">
          <NumberInput id="reg-mil" value={porMil} onChange={setPorMil} min="0" step="0.1" suffix="‰" />
        </Field>
      </div>

      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular derechos registrales</button>

      <div aria-live="polite">
        {result && (
          <ResultBox label="Derechos registrales estimados" value={soles(result.total)}>
            <Rows>
              <Row label={`Derecho de calificación: ${calificacion}% × ${soles(PERU.uit)}`} value={soles(result.calificacion)} />
              <Row label={`Derecho de inscripción: ${soles(parseFloat(valor))} × ${porMil} ÷ 1000`} value={soles(result.inscripcion)} />
              <Row label="Total a pagar en SUNARP" value={soles(result.total)} bold highlight />
            </Rows>
            <Note>
              Monto <strong>referencial</strong>. Las tasas vienen del arancel de SUNARP y pueden actualizarse por resolución; el
              registrador liquida el monto exacto al calificar tu título y puede cobrar un mayor derecho. Comprueba las tasas
              vigentes en la calculadora oficial de sunarp.gob.pe antes de pagar. No incluye honorarios notariales ni impuestos
              como la alcabala.
            </Note>
          </ResultBox>
        )}
      </div>
    </div>
  )
}
