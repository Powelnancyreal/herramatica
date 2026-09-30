'use client'

import { useMemo, useState } from 'react'
import { calcularDigitoVerificador, ESTADOS } from './calcular-curp'
import { inputClass } from '@/components/calc-ui'

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

function validar(curpBruta) {
  const curp = curpBruta.trim().toUpperCase().replace(/\s/g, '')
  const checks = []
  const add = (ok, texto) => checks.push({ ok, texto })
  add(curp.length === 18, `Longitud: ${curp.length} de 18 caracteres`)
  if (curp.length !== 18) return { curp, checks, valida: false }

  add(/^[A-ZÑ][AEIOUX][A-ZÑ]{2}$/.test(curp.slice(0, 4)), 'Posiciones 1-4: letras de apellidos y nombre (la 2.ª es vocal o X)')
  const [aa, mm, dd] = [curp.slice(4, 6), curp.slice(6, 8), curp.slice(8, 10)].map(Number)
  const diferenciador = curp[16]
  const siglo = /[A-Z]/.test(diferenciador) ? 2000 : 1900
  const anio = siglo + aa
  const fecha = new Date(Date.UTC(anio, mm - 1, dd))
  const fechaOk = /^\d{6}$/.test(curp.slice(4, 10)) && fecha.getUTCMonth() === mm - 1 && fecha.getUTCDate() === dd && fecha <= new Date()
  add(fechaOk, fechaOk ? `Fecha de nacimiento: ${dd} de ${MESES[mm - 1]} de ${anio}` : 'Posiciones 5-10: la fecha de nacimiento no existe')
  const sexo = curp[10]
  add(/[HMX]/.test(sexo), `Posición 11 (sexo): ${sexo === 'H' ? 'hombre' : sexo === 'M' ? 'mujer' : sexo === 'X' ? 'no binario' : 'valor no válido'}`)
  const estado = ESTADOS.find((e) => e.code === curp.slice(11, 13))
  add(Boolean(estado), `Posiciones 12-13 (entidad): ${estado ? estado.name : `«${curp.slice(11, 13)}» no es una clave de entidad`}`)
  add(/^[B-DF-HJ-NP-TV-ZÑ]{3}$/.test(curp.slice(13, 16)), 'Posiciones 14-16: consonantes internas de apellidos y nombre')
  add(/[0-9A-Z]/.test(diferenciador), `Posición 17 (homoclave): «${diferenciador}», ${/\d/.test(diferenciador) ? 'nacido antes de 2000' : 'nacido desde 2000'}`)
  const esperado = calcularDigitoVerificador(curp.slice(0, 17))
  add(curp[17] === esperado, curp[17] === esperado ? `Posición 18 (dígito verificador): ${curp[17]} correcto` : `Posición 18: el dígito verificador debería ser ${esperado}, no ${curp[17]}`)

  const hoy = new Date()
  let edad = hoy.getUTCFullYear() - anio
  if (hoy.getUTCMonth() + 1 < mm || (hoy.getUTCMonth() + 1 === mm && hoy.getUTCDate() < dd)) edad--
  return { curp, checks, valida: checks.every((c) => c.ok), edad: fechaOk ? edad : null }
}

export default function ValidarCURP() {
  const [curp, setCurp] = useState('')
  const r = useMemo(() => (curp.trim() ? validar(curp) : null), [curp])

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">CURP a validar</label>
        <input
          value={curp}
          onChange={(e) => setCurp(e.target.value.toUpperCase())}
          maxLength={22}
          className={`${inputClass} font-mono text-lg tracking-widest uppercase`}
          placeholder="GODE561231HDFRRN04"
          spellCheck={false}
          autoComplete="off"
        />
        <p className="text-xs text-gray-500 mt-1">La validación se hace en tu navegador; tu CURP no se envía ni se guarda.</p>
      </div>
      {r && (
        <div className={`rounded-xl border-2 p-5 space-y-3 ${r.valida ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
          <p className={`text-2xl font-bold ${r.valida ? 'text-green-700' : 'text-red-700'}`}>{r.valida ? '✓ Estructura válida' : '✗ CURP no válida'}</p>
          {r.valida && r.edad !== null && <p className="text-sm text-gray-700">Edad según la CURP: {r.edad} años.</p>}
          <ul className="space-y-1 text-sm">
            {r.checks.map((c) => (
              <li key={c.texto} className={c.ok ? 'text-gray-800' : 'text-red-700 font-medium'}>{c.ok ? '✓' : '✗'} {c.texto}</li>
            ))}
          </ul>
          <p className="text-xs text-gray-600">
            Una estructura válida no garantiza que la CURP esté registrada. Para confirmarlo, consulta el portal oficial de
            la CURP del Gobierno de México (gob.mx/curp).
          </p>
        </div>
      )}
    </div>
  )
}
