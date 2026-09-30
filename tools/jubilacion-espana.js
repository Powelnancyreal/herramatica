'use client'

import { useState } from 'react'
import { edadOrdinaria } from '@/lib/calc/espana'
import { buttonClass, ErrorText, Field, Note, NumberInput, ResultBox, Row, Rows } from '@/components/calc-ui'

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const fecha = (d) => `${d.getUTCDate()} de ${MESES[d.getUTCMonth()]} de ${d.getUTCFullYear()}`
const sumarMeses = (d, m) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + m, d.getUTCDate()))
const edadTexto = (m) => `${Math.floor(m / 12)} años${m % 12 ? ` y ${m % 12} meses` : ''}`

// Busca el primer mes en que la edad alcanzada es igual o mayor a la ordinaria de ese año,
// considerando los meses cotizados que se habrán acumulado hasta entonces si sigues trabajando.
function calcular({ nacimiento, mesesHoy, sigueCotizando }) {
  const hoy = new Date()
  const hoyUTC = Date.UTC(hoy.getFullYear(), hoy.getMonth(), 1)
  for (let edadMeses = 60 * 12; edadMeses <= 70 * 12; edadMeses++) {
    const f = sumarMeses(nacimiento, edadMeses)
    const mesesHasta = Math.max(0, Math.round((f.getTime() - hoyUTC) / (30.44 * 86400000)))
    const cotizados = mesesHoy + (sigueCotizando ? mesesHasta : 0)
    const o = edadOrdinaria(f.getUTCFullYear(), cotizados)
    if (edadMeses >= o.anios * 12 + o.meses) return { f, edadMeses, o, cotizados }
  }
  return null
}

export default function JubilacionEspana() {
  const [nac, setNac] = useState('')
  const [anios, setAnios] = useState('')
  const [meses, setMeses] = useState('0')
  const [sigue, setSigue] = useState(true)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  function enviar() {
    if (!nac) return setError('Introduce tu fecha de nacimiento.')
    const a = parseFloat(anios)
    if (!(a >= 0)) return setError('Introduce los años cotizados hasta hoy (aparecen en tu informe de vida laboral).')
    setError('')
    const n = new Date(nac + 'T00:00:00Z')
    const mesesHoy = Math.round(a * 12 + (parseFloat(meses) || 0))
    const r = calcular({ nacimiento: n, mesesHoy, sigueCotizando: sigue })
    if (!r) return setError('No se pudo calcular con esos datos.')
    const edadOrd = r.o.anios * 12 + r.o.meses
    const voluntaria = sumarMeses(n, edadOrd - 24)
    const involuntaria = sumarMeses(n, edadOrd - 48)
    setResult({ ...r, edadOrd, voluntaria, involuntaria, requisitoVol: r.cotizados >= 35 * 12, requisitoInv: r.cotizados >= 33 * 12, llegaMinimo: r.cotizados >= 15 * 12 })
  }

  const r = result
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Fecha de nacimiento"><input type="date" value={nac} onChange={(e) => setNac(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2.5" /></Field>
        <Field label="Años cotizados hasta hoy"><NumberInput value={anios} onChange={setAnios} min="0" max="50" step="1" placeholder="Ej: 30" /></Field>
        <Field label="Meses adicionales"><NumberInput value={meses} onChange={setMeses} min="0" max="11" step="1" /></Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={sigue} onChange={(e) => setSigue(e.target.checked)} /> Seguiré cotizando hasta jubilarme
      </label>
      <ErrorText>{error}</ErrorText>
      <button onClick={enviar} className={buttonClass}>¿Cuándo me puedo jubilar?</button>

      {r && (
        <ResultBox label="Jubilación ordinaria" value={fecha(r.f)}>
          <Rows>
            <Row label="Edad ordinaria que te corresponde" value={edadTexto(r.edadOrd)} bold />
            <Row label="Cotización acumulada en esa fecha" value={edadTexto(r.cotizados).replace('años', 'años cotizados')} />
            <Row label="Anticipada voluntaria (hasta 2 años antes)" value={r.requisitoVol ? fecha(r.voluntaria) : 'Requiere 35 años cotizados'} />
            <Row label="Anticipada involuntaria (hasta 4 años antes)" value={r.requisitoInv ? fecha(r.involuntaria) : 'Requiere 33 años cotizados'} />
          </Rows>
          {!r.llegaMinimo && <Note>Con menos de 15 años cotizados no tendrás derecho a pensión contributiva de jubilación; revisa la pensión no contributiva.</Note>}
          <Note>
            Calendario de la Ley 27/2011: en 2026 la edad ordinaria es de 65 años con 38 años y 3 meses cotizados, o de 66 años y
            10 meses con menos; desde 2027 serán 65 años con 38 años y 6 meses, o 67 años. La jubilación anticipada aplica
            coeficientes reductores a la pensión, y retrasarla suma un 4% por año completo.
          </Note>
        </ResultBox>
      )}
    </div>
  )
}
