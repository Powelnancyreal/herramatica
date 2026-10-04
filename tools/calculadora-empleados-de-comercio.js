'use client'

import { useState } from 'react'
import { calcularSueldoComercio, COMERCIO_CATEGORIAS, COMERCIO_SUMA_NO_REMUNERATIVA, COMERCIO_VIGENCIA } from '@/lib/calc/latam'
import { buttonClass, ErrorText, Field, inputClass, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

const ars = (n) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 }).format(n)

export default function CalculadoraEmpleadosDeComercio() {
  const [categoria, setCategoria] = useState('Administrativo A')
  const [basico, setBasico] = useState(String(COMERCIO_CATEGORIAS.find((c) => c.nombre === 'Administrativo A').basico))
  const [anios, setAnios] = useState('0')
  const [horas, setHoras] = useState('48')
  const [presentismo, setPresentismo] = useState(true)
  const [snr, setSnr] = useState(String(COMERCIO_SUMA_NO_REMUNERATIVA))
  const [adicionalesSnr, setAdicionalesSnr] = useState(false)
  const [afiliado, setAfiliado] = useState(false)
  const [cuota, setCuota] = useState('2')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function elegirCategoria(nombre) {
    setCategoria(nombre)
    const c = COMERCIO_CATEGORIAS.find((x) => x.nombre === nombre)
    if (c) setBasico(String(c.basico))
  }

  function calcular() {
    const b = parseFloat(basico)
    const a = parseFloat(anios || '0')
    const h = parseFloat(horas)
    const s = parseFloat(snr || '0')
    const cs = parseFloat(cuota || '0')
    if (!(b > 0)) return setError('Escribe el sueldo básico de tu categoría.')
    if (!(a >= 0) || !(s >= 0)) return setError('La antigüedad y la suma no remunerativa no pueden ser negativas.')
    if (!(h > 0 && h <= 48)) return setError('Las horas semanales deben estar entre 1 y 48 (jornada completa).')
    if (afiliado && !(cs >= 0)) return setError('Revisa el porcentaje de la cuota sindical.')
    setError('')
    setResult(calcularSueldoComercio({ basico: b, anios: a, horasSemanales: h, presentismo, sumaNoRem: s, adicionalesSobreNoRem: adicionalesSnr, cuotaSindical: afiliado ? cs : 0 }))
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Categoría" id="ec-categoria">
          <select id="ec-categoria" value={categoria} onChange={(e) => elegirCategoria(e.target.value)} className={inputClass}>
            {COMERCIO_CATEGORIAS.map((c) => <option key={c.nombre} value={c.nombre}>{c.nombre}</option>)}
          </select>
        </Field>
        <Field label="Sueldo básico (jornada completa)" id="ec-basico" hint={`Escala vigente desde ${COMERCIO_VIGENCIA}. Puedes cambiarlo si hay una escala nueva.`}>
          <NumberInput id="ec-basico" value={basico} onChange={setBasico} prefix="$" min="0" />
        </Field>
        <Field label="Años de antigüedad" id="ec-anios" hint="Suma el 1% del básico por cada año.">
          <NumberInput id="ec-anios" value={anios} onChange={setAnios} min="0" step="1" suffix="años" />
        </Field>
        <Field label="Horas semanales" id="ec-horas" hint="48 es jornada completa; menos horas, sueldo proporcional.">
          <NumberInput id="ec-horas" value={horas} onChange={setHoras} min="1" max="48" suffix="h" />
        </Field>
        <Field label="Suma no remunerativa mensual" id="ec-snr" hint="Suma fija acordada en paritarias; no tiene aportes jubilatorios.">
          <NumberInput id="ec-snr" value={snr} onChange={setSnr} prefix="$" min="0" />
        </Field>
        {afiliado && (
          <Field label="Cuota sindical" id="ec-cuota">
            <NumberInput id="ec-cuota" value={cuota} onChange={setCuota} min="0" step="0.5" suffix="%" />
          </Field>
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-700">
        <label className="flex items-start gap-2">
          <input type="checkbox" checked={presentismo} onChange={(e) => setPresentismo(e.target.checked)} className="mt-1" />
          Cobro presentismo (8,33%; se pierde con más de una falta injustificada en el mes)
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" checked={adicionalesSnr} onChange={(e) => setAdicionalesSnr(e.target.checked)} className="mt-1" />
          Aplicar antigüedad y presentismo también a la suma no remunerativa (según cómo liquide tu empleador)
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" checked={afiliado} onChange={(e) => setAfiliado(e.target.checked)} className="mt-1" />
          Estoy afiliado al sindicato (descuenta la cuota sindical)
        </label>
      </div>

      <ErrorText>{error}</ErrorText>
      <button onClick={calcular} className={buttonClass}>Calcular sueldo</button>

      <div aria-live="polite">
        {result && (
          <ResultBox label="Sueldo neto estimado (de bolsillo)" value={ars(result.neto)}>
            <Rows>
              <Row label={`Básico${result.proporcion < 1 ? ` (${horas} h de 48)` : ''}`} value={ars(result.basicoJornada)} />
              {result.antiguedad > 0 && <Row label={`Antigüedad (${anios} × 1%)`} value={ars(result.antiguedad)} />}
              {result.presentismoRem > 0 && <Row label="Presentismo (8,33%)" value={ars(result.presentismoRem)} />}
              <Row label="Total remunerativo" value={ars(result.remunerativo)} bold />
              <Row label="Suma no remunerativa" value={ars(result.snrBase)} />
              {result.snrAntiguedad + result.snrPresentismo > 0 && <Row label="Antigüedad y presentismo sobre la suma no remunerativa" value={ars(result.snrAntiguedad + result.snrPresentismo)} />}
              <Row label="Sueldo bruto" value={ars(result.bruto)} bold />
              {result.descuentos.map((d) => <Row key={d.concepto} label={d.concepto} value={ars(-d.monto)} />)}
              <Row label="Sueldo neto" value={ars(result.neto)} bold highlight />
            </Rows>
            <Note>
              Estimación con la escala del CCT 130/75 vigente desde {COMERCIO_VIGENCIA}. No incluye horas extra, feriados trabajados,
              adicionales por zona ni el impuesto a las Ganancias. Las sumas no remunerativas cambian con cada acuerdo paritario:
              compará con tu recibo de sueldo.
            </Note>
          </ResultBox>
        )}
      </div>
    </div>
  )
}
