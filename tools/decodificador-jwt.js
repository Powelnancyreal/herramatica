'use client'

import { useEffect, useMemo, useState } from 'react'
import { decodificarJWT, verificarHMAC } from '@/lib/calc/datos'
import { CopyButton, inputClass } from '@/components/calc-ui'

const EJEMPLO =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1hcsOtYSBMw7NwZXoiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjcyMjU2MDAsImV4cCI6MTc5ODc2MTYwMH0.mntREIYuXrGNvpdbRUzC9v2UBtby-cpLefaALfjf3fs'
// La firma del ejemplo se generó con la clave «secreto-de-ejemplo».

const FECHAS = { exp: 'Expira', iat: 'Emitido', nbf: 'Válido desde', auth_time: 'Autenticado' }
const NOMBRES = { iss: 'Emisor', sub: 'Sujeto', aud: 'Audiencia', jti: 'ID del token', alg: 'Algoritmo', typ: 'Tipo', kid: 'ID de la clave' }

function Bloque({ titulo, color, datos }) {
  const json = JSON.stringify(datos, null, 2)
  return (
    <div className={`rounded-xl border-2 ${color} overflow-hidden`}>
      <div className="flex justify-between items-center px-3 py-2 bg-white/60">
        <p className="font-semibold text-sm text-gray-900">{titulo}</p>
        <CopyButton text={json} />
      </div>
      <pre className="text-xs sm:text-sm p-3 overflow-x-auto bg-white">{json}</pre>
    </div>
  )
}

export default function DecodificadorJWT() {
  const [token, setToken] = useState(EJEMPLO)
  const [secreto, setSecreto] = useState('')
  const [firmaOk, setFirmaOk] = useState(null)
  const [ahora, setAhora] = useState(null)

  useEffect(() => setAhora(Date.now() / 1000), [token])

  const r = useMemo(() => {
    if (!token.trim()) return null
    try {
      return decodificarJWT(token)
    } catch (e) {
      return { error: e.message }
    }
  }, [token])

  useEffect(() => {
    let vigente = true
    setFirmaOk(null)
    if (!r?.header || !secreto) return
    verificarHMAC(r.partes, r.header.alg, secreto)
      .then((ok) => vigente && setFirmaOk(ok))
      .catch(() => vigente && setFirmaOk(false))
    return () => {
      vigente = false
    }
  }, [r, secreto])

  const esHMAC = r?.header && /^HS(256|384|512)$/.test(r.header.alg)

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Token JWT</label>
        <textarea value={token} onChange={(e) => setToken(e.target.value)} rows={5} className={`${inputClass} font-mono text-xs break-all`} spellCheck={false} placeholder="Pega aquí tu token (eyJ...)" />
        <p className="text-xs text-gray-500 mt-1">El token se decodifica en tu navegador: no se envía a ningún servidor.</p>
      </div>

      {r?.error && <p className="text-sm text-red-600">{r.error}</p>}
      {r?.header && (
        <>
          <p className="font-mono text-xs break-all bg-gray-50 rounded-lg p-3 border border-gray-200">
            <span className="text-red-600">{r.partes[0]}</span>.<span className="text-purple-600">{r.partes[1]}</span>.<span className="text-sky-600">{r.partes[2]}</span>
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Bloque titulo="Encabezado (header)" color="border-red-200" datos={r.header} />
            <Bloque titulo="Contenido (payload)" color="border-purple-200" datos={r.payload} />
          </div>

          <div className="rounded-xl border border-gray-200 divide-y divide-gray-100 text-sm">
            {Object.entries({ ...r.header, ...r.payload })
              .filter(([k]) => FECHAS[k] || NOMBRES[k])
              .map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 px-4 py-2">
                  <span className="text-gray-600">{FECHAS[k] || NOMBRES[k]} <code className="text-xs text-gray-400">{k}</code></span>
                  <span className="text-right text-gray-900 break-all">
                    {FECHAS[k] && typeof v === 'number' ? (
                      <>
                        {new Date(v * 1000).toLocaleString('es-MX')}
                        {k === 'exp' && ahora && (
                          <span className={`ml-2 font-semibold ${v < ahora ? 'text-red-600' : 'text-green-700'}`}>{v < ahora ? '· Expirado' : '· Vigente'}</span>
                        )}
                      </>
                    ) : (
                      String(Array.isArray(v) ? v.join(', ') : v)
                    )}
                  </span>
                </div>
              ))}
          </div>

          <div className="rounded-xl border border-sky-200 p-4 space-y-2">
            <p className="font-semibold text-sm text-gray-900">Verificar la firma</p>
            {esHMAC ? (
              <>
                <input value={secreto} onChange={(e) => setSecreto(e.target.value)} className={`${inputClass} font-mono`} placeholder={`Clave secreta ${r.header.alg}`} />
                {token === EJEMPLO && <p className="text-xs text-gray-500">Prueba con la clave del ejemplo: secreto-de-ejemplo</p>}
                {firmaOk !== null && (
                  <p className={`text-sm font-semibold ${firmaOk ? 'text-green-700' : 'text-red-600'}`}>
                    {firmaOk ? '✓ Firma válida: el token no ha sido modificado.' : '✗ Firma no válida con esa clave.'}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-600">
                El algoritmo {r.header.alg || 'desconocido'} usa una clave pública; esta herramienta verifica firmas HMAC (HS256, HS384 y HS512).
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
