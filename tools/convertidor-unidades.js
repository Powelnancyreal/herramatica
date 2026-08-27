'use client'

import { useMemo, useState } from 'react'

// Each non-temperature category converts via a common base unit (factor = value in base unit per 1 unit).
const CATEGORIAS = {
  longitud: {
    label: 'Longitud',
    base: 'm',
    unidades: {
      mm: { label: 'Milímetros', factor: 0.001 },
      cm: { label: 'Centímetros', factor: 0.01 },
      m: { label: 'Metros', factor: 1 },
      km: { label: 'Kilómetros', factor: 1000 },
      in: { label: 'Pulgadas', factor: 0.0254 },
      ft: { label: 'Pies', factor: 0.3048 },
      yd: { label: 'Yardas', factor: 0.9144 },
      mi: { label: 'Millas', factor: 1609.344 },
    },
  },
  peso: {
    label: 'Peso / Masa',
    base: 'kg',
    unidades: {
      mg: { label: 'Miligramos', factor: 0.000001 },
      g: { label: 'Gramos', factor: 0.001 },
      kg: { label: 'Kilogramos', factor: 1 },
      ton: { label: 'Toneladas', factor: 1000 },
      lb: { label: 'Libras', factor: 0.45359237 },
      oz: { label: 'Onzas', factor: 0.028349523125 },
    },
  },
  volumen: {
    label: 'Volumen',
    base: 'l',
    unidades: {
      ml: { label: 'Mililitros', factor: 0.001 },
      l: { label: 'Litros', factor: 1 },
      m3: { label: 'Metros cúbicos', factor: 1000 },
      galUS: { label: 'Galones (US)', factor: 3.785411784 },
      qtUS: { label: 'Cuartos (US)', factor: 0.946352946 },
      tazaUS: { label: 'Tazas (US)', factor: 0.2365882365 },
    },
  },
  velocidad: {
    label: 'Velocidad',
    base: 'kmh',
    unidades: {
      kmh: { label: 'Km/h', factor: 1 },
      ms: { label: 'm/s', factor: 3.6 },
      mph: { label: 'Millas/h', factor: 1.609344 },
      nudo: { label: 'Nudos', factor: 1.852 },
    },
  },
  area: {
    label: 'Área',
    base: 'm2',
    unidades: {
      cm2: { label: 'cm²', factor: 0.0001 },
      m2: { label: 'm²', factor: 1 },
      km2: { label: 'km²', factor: 1000000 },
      hectarea: { label: 'Hectáreas', factor: 10000 },
      ft2: { label: 'Pies²', factor: 0.09290304 },
      acre: { label: 'Acres', factor: 4046.8564224 },
    },
  },
  presion: {
    label: 'Presión',
    base: 'pa',
    unidades: {
      pa: { label: 'Pascales (Pa)', factor: 1 },
      kpa: { label: 'Kilopascales (kPa)', factor: 1000 },
      bar: { label: 'Bar', factor: 100000 },
      psi: { label: 'PSI (lb/in²)', factor: 6894.757293168 },
      atm: { label: 'Atmósferas', factor: 101325 },
      kgcm2: { label: 'kg/cm²', factor: 98066.5 },
    },
  },
  potencia: {
    label: 'Potencia',
    base: 'w',
    unidades: {
      w: { label: 'Vatios (W)', factor: 1 },
      kw: { label: 'Kilovatios (kW)', factor: 1000 },
      hp: { label: 'Caballos de fuerza (HP)', factor: 745.699872 },
      cv: { label: 'Caballos de vapor (CV)', factor: 735.49875 },
      btuh: { label: 'BTU/h', factor: 0.29307107 },
    },
  },
}

function convertirEstandar(valor, categoria, desde, hasta) {
  const unidades = CATEGORIAS[categoria].unidades
  const enBase = valor * unidades[desde].factor
  return enBase / unidades[hasta].factor
}

function celsiusA(valor, unidad) {
  if (unidad === 'c') return valor
  if (unidad === 'f') return (valor * 9) / 5 + 32
  return valor + 273.15 // kelvin
}
function aCelsius(valor, unidad) {
  if (unidad === 'c') return valor
  if (unidad === 'f') return ((valor - 32) * 5) / 9
  return valor - 273.15 // kelvin
}
function convertirTemperatura(valor, desde, hasta) {
  return celsiusA(aCelsius(valor, desde), hasta)
}

const TEMP_UNIDADES = { c: 'Celsius (°C)', f: 'Fahrenheit (°F)', k: 'Kelvin (K)' }

function formatNum(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return parseFloat(n.toPrecision(10)).toLocaleString('es', { maximumFractionDigits: 6 })
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

const CATEGORIA_TABS = [
  { id: 'longitud', label: 'Longitud' },
  { id: 'peso', label: 'Peso' },
  { id: 'temperatura', label: 'Temperatura' },
  { id: 'volumen', label: 'Volumen' },
  { id: 'velocidad', label: 'Velocidad' },
  { id: 'area', label: 'Área' },
  { id: 'presion', label: 'Presión' },
  { id: 'potencia', label: 'Potencia' },
]

export default function ConvertidorUnidades() {
  const [categoria, setCategoria] = useState('longitud')
  const [valor, setValor] = useState('1')
  const [desde, setDesde] = useState('m')
  const [hasta, setHasta] = useState('km')
  const [desdeTemp, setDesdeTemp] = useState('c')
  const [hastaTemp, setHastaTemp] = useState('f')

  function cambiarCategoria(id) {
    setCategoria(id)
    if (id !== 'temperatura') {
      const keys = Object.keys(CATEGORIAS[id].unidades)
      setDesde(keys[0])
      setHasta(keys[1] || keys[0])
    }
  }

  const resultado = useMemo(() => {
    const v = parseFloat(valor)
    if (isNaN(v)) return null
    if (categoria === 'temperatura') return convertirTemperatura(v, desdeTemp, hastaTemp)
    return convertirEstandar(v, categoria, desde, hasta)
  }, [valor, categoria, desde, hasta, desdeTemp, hastaTemp])

  function swap() {
    if (categoria === 'temperatura') {
      setDesdeTemp(hastaTemp)
      setHastaTemp(desdeTemp)
    } else {
      setDesde(hasta)
      setHasta(desde)
    }
  }

  const unidadesActuales = categoria !== 'temperatura' ? CATEGORIAS[categoria].unidades : null

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {CATEGORIA_TABS.map((c) => (
          <button
            key={c.id}
            onClick={() => cambiarCategoria(c.id)}
            className={`px-3.5 py-2 rounded-lg font-semibold text-sm transition-all ${
              categoria === c.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
        <div>
          <label className={labelClass}>De</label>
          <select
            value={categoria === 'temperatura' ? desdeTemp : desde}
            onChange={(e) => (categoria === 'temperatura' ? setDesdeTemp(e.target.value) : setDesde(e.target.value))}
            className={inputClass}
          >
            {categoria === 'temperatura'
              ? Object.entries(TEMP_UNIDADES).map(([k, l]) => (
                  <option key={k} value={k}>
                    {l}
                  </option>
                ))
              : Object.entries(unidadesActuales).map(([k, u]) => (
                  <option key={k} value={k}>
                    {u.label}
                  </option>
                ))}
          </select>
        </div>

        <button
          onClick={swap}
          className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 mb-0.5"
          title="Invertir"
        >
          ⇄
        </button>

        <div>
          <label className={labelClass}>A</label>
          <select
            value={categoria === 'temperatura' ? hastaTemp : hasta}
            onChange={(e) => (categoria === 'temperatura' ? setHastaTemp(e.target.value) : setHasta(e.target.value))}
            className={inputClass}
          >
            {categoria === 'temperatura'
              ? Object.entries(TEMP_UNIDADES).map(([k, l]) => (
                  <option key={k} value={k}>
                    {l}
                  </option>
                ))
              : Object.entries(unidadesActuales).map(([k, u]) => (
                  <option key={k} value={k}>
                    {u.label}
                  </option>
                ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Valor</label>
        <input type="number" inputMode="decimal" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="1" className={inputClass} />
      </div>

      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Resultado</p>
        <p className="text-4xl font-bold text-blue-700 break-all">{formatNum(resultado)}</p>
      </div>
    </div>
  )
}
