'use client'

import { useEffect, useMemo, useState } from 'react'
import { inputClass, ResultBox, Row, Rows, Tabs } from '@/components/calc-ui'

const MODOS = [
  { id: 'a24', label: '12 h → 24 h' },
  { id: 'a12', label: '24 h → 12 h' },
]
const HASTA_29 = [
  'cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce',
  'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro',
  'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve',
]
const DECENAS = { 3: 'treinta', 4: 'cuarenta', 5: 'cincuenta' }

function numeroEnLetras(n) {
  if (n < 30) return HASTA_29[n]
  const u = n % 10
  return u ? `${DECENAS[Math.floor(n / 10)]} y ${HASTA_29[u]}` : DECENAS[Math.floor(n / 10)]
}

// Lectura militar: 14:30 → «catorce treinta horas»; 08:05 → «cero ocho cero cinco horas».
function lecturaMilitar(h, m) {
  const par = (n) => (n < 10 ? `cero ${HASTA_29[n]}` : numeroEnLetras(n))
  return `${par(h)} ${par(m)} horas`
}

function periodo(h) {
  if (h < 6) return 'de la madrugada'
  if (h < 12) return 'de la mañana'
  if (h < 19) return 'de la tarde'
  return 'de la noche'
}

export default function HoraMilitar() {
  const [modo, setModo] = useState('a24')
  const [h12, setH12] = useState('2')
  const [min12, setMin12] = useState('30')
  const [ampm, setAmpm] = useState('pm')
  const [t24, setT24] = useState('14:30')
  const [ahora, setAhora] = useState(null)

  useEffect(() => {
    const tick = () => setAhora(new Date())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const r = useMemo(() => {
    let h
    let m
    if (modo === 'a24') {
      const hh = parseInt(h12, 10)
      m = parseInt(min12, 10) || 0
      if (!(hh >= 1 && hh <= 12) || m < 0 || m > 59) return null
      h = ampm === 'am' ? hh % 12 : (hh % 12) + 12
    } else {
      const match = t24.trim().match(/^(\d{1,2}):?(\d{2})$/)
      if (!match) return null
      h = Number(match[1])
      m = Number(match[2])
      if (h > 23 || m > 59) return null
    }
    const h12r = h % 12 || 12
    return {
      t24: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
      militar: `${String(h).padStart(2, '0')}${String(m).padStart(2, '0')}`,
      t12: `${h12r}:${String(m).padStart(2, '0')} ${h < 12 ? 'a. m.' : 'p. m.'}`,
      lectura: lecturaMilitar(h, m),
      coloquial: `${h12r === 1 ? 'la una' : `las ${HASTA_29[h12r]}`}${m ? ` y ${numeroEnLetras(m)}` : ' en punto'} ${periodo(h)}`,
    }
  }, [modo, h12, min12, ampm, t24])

  return (
    <div className="space-y-5">
      {ahora && (
        <p className="text-center text-sm text-gray-600">
          Ahora son las <strong className="font-mono text-gray-900 text-base">{ahora.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false })}</strong> ({ahora.toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit', hour12: true })})
        </p>
      )}
      <Tabs tabs={MODOS} value={modo} onChange={setModo} />
      {modo === 'a24' ? (
        <div className="flex gap-2 items-center">
          <input type="number" value={h12} onChange={(e) => setH12(e.target.value)} min="1" max="12" className={`${inputClass} w-24 text-center text-xl`} aria-label="Hora" />
          <span className="text-2xl font-bold">:</span>
          <input type="number" value={min12} onChange={(e) => setMin12(e.target.value)} min="0" max="59" className={`${inputClass} w-24 text-center text-xl`} aria-label="Minutos" />
          <select value={ampm} onChange={(e) => setAmpm(e.target.value)} className={`${inputClass} w-28 text-lg`} aria-label="a. m. o p. m.">
            <option value="am">a. m.</option>
            <option value="pm">p. m.</option>
          </select>
        </div>
      ) : (
        <input value={t24} onChange={(e) => setT24(e.target.value)} className={`${inputClass} max-w-[12rem] text-center text-xl font-mono`} placeholder="14:30 o 1430" aria-label="Hora en formato 24 horas" />
      )}
      {r ? (
        <ResultBox label={modo === 'a24' ? 'En formato de 24 horas' : 'En formato de 12 horas'} value={modo === 'a24' ? r.t24 : r.t12}>
          <Rows>
            <Row label="Formato 24 horas" value={r.t24} />
            <Row label="Hora militar (sin dos puntos)" value={`${r.militar} h`} />
            <Row label="Formato 12 horas" value={r.t12} />
            <Row label="Se lee (militar)" value={r.lectura} />
            <Row label="Se dice (coloquial)" value={r.coloquial} />
          </Rows>
        </ResultBox>
      ) : (
        <p className="text-sm text-red-600">Escribe una hora válida.</p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-3 py-2">12 horas</th>
              <th className="text-left px-3 py-2">24 horas</th>
              <th className="text-left px-3 py-2">12 horas</th>
              <th className="text-left px-3 py-2">24 horas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Array.from({ length: 12 }, (_, i) => (
              <tr key={i}>
                <td className="px-3 py-1">{i === 0 ? 12 : i}:00 a. m.</td>
                <td className="px-3 py-1 font-mono font-semibold">{String(i).padStart(2, '0')}:00</td>
                <td className="px-3 py-1">{i === 0 ? 12 : i}:00 p. m.</td>
                <td className="px-3 py-1 font-mono font-semibold">{i + 12}:00</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
