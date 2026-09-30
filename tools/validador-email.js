'use client'

import { useState } from 'react'
import { validarEmail } from '@/lib/calc/dev'
import { buttonClass, inputClass, Tabs } from '@/components/calc-ui'

async function consultarMX(dominio) {
  try {
    const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(dominio)}&type=MX`, {
      headers: { accept: 'application/dns-json' },
    })
    const data = await res.json()
    if (data.Status === 3) return { estado: 'inexistente' }
    const mx = (data.Answer || []).filter((a) => a.type === 15).map((a) => a.data.split(' ').pop().replace(/\.$/, ''))
    return mx.length ? { estado: 'ok', servidores: mx } : { estado: 'sin-mx' }
  } catch {
    return { estado: 'error' }
  }
}

function Resultado({ r }) {
  const color = !r.valido ? 'red' : r.mx?.estado === 'ok' && !r.desechable ? 'green' : 'amber'
  const estilos = {
    red: 'border-red-200 bg-red-50 text-red-700',
    green: 'border-green-200 bg-green-50 text-green-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
  }[color]
  return (
    <div className={`rounded-lg border-2 p-3 space-y-1 ${estilos}`}>
      <p className="font-semibold break-all">
        {r.valido ? '✓' : '✗'} {r.email}
      </p>
      {r.errores.map((e) => (
        <p key={e} className="text-sm">• {e}</p>
      ))}
      {r.sugerencia && <p className="text-sm">¿Quisiste decir <strong>{r.sugerencia}</strong>?</p>}
      {r.desechable && <p className="text-sm">Es un dominio de correo temporal o desechable.</p>}
      {r.valido && r.mx && (
        <p className="text-sm">
          {r.mx.estado === 'ok' && `El dominio recibe correo (MX: ${r.mx.servidores.slice(0, 2).join(', ')}).`}
          {r.mx.estado === 'sin-mx' && 'El dominio existe pero no tiene servidores de correo (MX): probablemente no recibe emails.'}
          {r.mx.estado === 'inexistente' && 'El dominio no existe.'}
          {r.mx.estado === 'error' && 'No se pudo consultar el DNS del dominio en este momento.'}
        </p>
      )}
    </div>
  )
}

export default function ValidadorEmail() {
  const [modo, setModo] = useState('uno')
  const [entrada, setEntrada] = useState('')
  const [resultados, setResultados] = useState([])
  const [cargando, setCargando] = useState(false)

  async function validar() {
    const lista = (modo === 'uno' ? [entrada] : entrada.split(/[\n,;]+/)).map((s) => s.trim()).filter(Boolean).slice(0, 200)
    if (!lista.length) return
    setCargando(true)
    const base = lista.map(validarEmail)
    const dominios = [...new Set(base.filter((r) => r.valido).map((r) => r.dominio))]
    const mxPorDominio = Object.fromEntries(await Promise.all(dominios.map(async (d) => [d, await consultarMX(d)])))
    setResultados(base.map((r) => ({ ...r, mx: r.valido ? mxPorDominio[r.dominio] : null })))
    setCargando(false)
  }

  const validos = resultados.filter((r) => r.valido && r.mx?.estado === 'ok').length

  return (
    <div className="space-y-4">
      <Tabs
        tabs={[
          { id: 'uno', label: 'Un correo' },
          { id: 'lista', label: 'Lista de correos' },
        ]}
        value={modo}
        onChange={(m) => {
          setModo(m)
          setResultados([])
        }}
      />
      {modo === 'uno' ? (
        <input
          type="email"
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && validar()}
          placeholder="nombre@ejemplo.com"
          className={inputClass}
        />
      ) : (
        <textarea
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          rows={6}
          placeholder={'Un correo por línea (hasta 200)\nana@gmail.com\nluis@hotmial.com'}
          className={`${inputClass} font-mono text-sm`}
        />
      )}
      <button onClick={validar} disabled={cargando} className={buttonClass}>
        {cargando ? 'Validando…' : 'Validar'}
      </button>
      {resultados.length > 1 && (
        <p className="text-sm text-gray-700">
          {validos} de {resultados.length} correos válidos con dominio que recibe correo.
        </p>
      )}
      <div className="space-y-2">
        {resultados.map((r, i) => (
          <Resultado key={`${r.email}-${i}`} r={r} />
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Comprobamos la sintaxis y si el dominio tiene servidores de correo (registro MX, consultado a Cloudflare DNS). Ninguna
        herramienta web puede confirmar que un buzón concreto exista sin enviarle un mensaje.
      </p>
    </div>
  )
}
