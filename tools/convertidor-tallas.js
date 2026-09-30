'use client'

import { useMemo, useState } from 'react'
import { Field, inputClass, NumberInput, Tabs } from '@/components/calc-ui'

// Tablas de referencia habituales de marcas deportivas. MX corresponde a la longitud del pie en cm.
const ZAPATOS = {
  hombre: [
    [24.5, 6.5, 5.5, 39], [25, 7, 6, 40], [25.5, 7.5, 6.5, 40.5], [26, 8, 7, 41], [26.5, 8.5, 7.5, 42], [27, 9, 8, 42.5],
    [27.5, 9.5, 8.5, 43], [28, 10, 9, 44], [28.5, 10.5, 9.5, 44.5], [29, 11, 10, 45], [29.5, 11.5, 10.5, 45.5], [30, 12, 11, 46], [31, 13, 12, 47.5],
  ],
  mujer: [
    [22, 5, 2.5, 35.5], [22.5, 5.5, 3, 36], [23, 6, 3.5, 36.5], [23.5, 6.5, 4, 37.5], [24, 7, 4.5, 38], [24.5, 7.5, 5, 38.5],
    [25, 8, 5.5, 39], [25.5, 8.5, 6, 40], [26, 9, 6.5, 40.5], [26.5, 9.5, 7, 41], [27, 10, 7.5, 42], [28, 11, 8.5, 43],
  ],
}
const SISTEMAS = ['MX (cm)', 'EE. UU.', 'Reino Unido', 'Europa']

const ROPA = {
  mujer: [
    { letra: 'XS', eu: 34, us: '0-2', pecho: '78-82' },
    { letra: 'S', eu: 36, us: '4-6', pecho: '82-87' },
    { letra: 'M', eu: 38, us: '8-10', pecho: '87-93' },
    { letra: 'L', eu: 40, us: '12-14', pecho: '93-99' },
    { letra: 'XL', eu: 42, us: '16', pecho: '99-105' },
    { letra: 'XXL', eu: 44, us: '18', pecho: '105-111' },
  ],
  hombre: [
    { letra: 'XS', eu: 44, us: '34', pecho: '84-88' },
    { letra: 'S', eu: 46, us: '36', pecho: '88-94' },
    { letra: 'M', eu: 48, us: '38-40', pecho: '94-100' },
    { letra: 'L', eu: 50, us: '42', pecho: '100-106' },
    { letra: 'XL', eu: 52, us: '44-46', pecho: '106-112' },
    { letra: 'XXL', eu: 54, us: '48', pecho: '112-118' },
  ],
}

export default function ConvertidorTallas() {
  const [tipo, setTipo] = useState('zapatos')
  const [genero, setGenero] = useState('hombre')
  const [sistema, setSistema] = useState(0)
  const [talla, setTalla] = useState('')
  const [pie, setPie] = useState('')

  const filaZapato = useMemo(() => {
    const tabla = ZAPATOS[genero]
    const cm = parseFloat(pie)
    if (cm > 0) return tabla.reduce((mejor, f) => (f[0] >= cm && (!mejor || f[0] < mejor[0]) ? f : mejor), null) || tabla[tabla.length - 1]
    const t = parseFloat(talla)
    if (isNaN(t)) return null
    return tabla.reduce((mejor, f) => (Math.abs(f[sistema] - t) < Math.abs(mejor[sistema] - t) ? f : mejor), tabla[0])
  }, [genero, sistema, talla, pie])

  return (
    <div className="space-y-5">
      <Tabs
        tabs={[
          { id: 'zapatos', label: 'Zapatos' },
          { id: 'ropa', label: 'Ropa' },
        ]}
        value={tipo}
        onChange={setTipo}
      />
      <Tabs
        tabs={[
          { id: 'hombre', label: 'Hombre' },
          { id: 'mujer', label: 'Mujer' },
        ]}
        value={genero}
        onChange={setGenero}
      />

      {tipo === 'zapatos' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Tengo la talla en">
              <select value={sistema} onChange={(e) => setSistema(Number(e.target.value))} className={inputClass}>
                {SISTEMAS.map((s, i) => (
                  <option key={s} value={i}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Talla">
              <NumberInput value={talla} onChange={(v) => { setTalla(v); setPie('') }} step="0.5" placeholder="Ej: 27" />
            </Field>
            <Field label="…o mide tu pie" hint="Del talón a la punta del dedo más largo.">
              <NumberInput value={pie} onChange={(v) => { setPie(v); setTalla('') }} step="0.1" suffix="cm" />
            </Field>
          </div>
          {filaZapato && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SISTEMAS.map((s, i) => (
                <div key={s} className="rounded-xl border-2 border-blue-200 bg-blue-50 p-3 text-center">
                  <p className="text-3xl font-bold text-blue-700">{filaZapato[i]}</p>
                  <p className="text-xs text-gray-600">{s}</p>
                </div>
              ))}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200">
              <thead className="bg-gray-50 text-gray-600">
                <tr>{SISTEMAS.map((s) => <th key={s} className="text-left px-3 py-2">{s}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ZAPATOS[genero].map((f) => (
                  <tr key={f[0]} className={filaZapato === f ? 'bg-blue-50 font-semibold' : ''}>
                    {f.map((v, i) => <td key={i} className="px-3 py-1.5">{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-3 py-2">Letra (MX/Latam)</th>
                <th className="text-left px-3 py-2">Europa</th>
                <th className="text-left px-3 py-2">EE. UU.</th>
                <th className="text-left px-3 py-2">Contorno de pecho (cm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ROPA[genero].map((f) => (
                <tr key={f.letra}>
                  <td className="px-3 py-1.5 font-semibold">{f.letra}</td>
                  <td className="px-3 py-1.5">{f.eu}</td>
                  <td className="px-3 py-1.5">{f.us}</td>
                  <td className="px-3 py-1.5">{f.pecho}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-gray-500">
        Equivalencias de referencia: cada marca tiene su propia horma, así que revisa siempre su guía de tallas. Para zapatos,
        medir el pie en centímetros es la forma más fiable de acertar.
      </p>
    </div>
  )
}
