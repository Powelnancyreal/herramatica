'use client'

import { useMemo, useState } from 'react'

function ipANumero(ip) {
  const partes = ip.split('.').map(Number)
  if (partes.length !== 4 || partes.some((p) => isNaN(p) || p < 0 || p > 255)) return null
  return (partes.reduce((acc, o) => (acc << 8) + o, 0)) >>> 0
}
function numeroAIp(n) {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.')
}

export function calcularSubred(ip, prefijo) {
  const ipNum = ipANumero(ip)
  if (ipNum === null || prefijo < 0 || prefijo > 32) return null
  const mascaraNum = prefijo === 0 ? 0 : (0xffffffff << (32 - prefijo)) >>> 0
  const redNum = (ipNum & mascaraNum) >>> 0
  const broadcastNum = (redNum | (~mascaraNum >>> 0)) >>> 0
  const totalHosts = Math.pow(2, 32 - prefijo)
  const hostsUtiles = prefijo >= 31 ? 0 : totalHosts - 2
  return {
    red: numeroAIp(redNum),
    broadcast: numeroAIp(broadcastNum),
    mascara: numeroAIp(mascaraNum),
    primerHost: prefijo >= 31 ? numeroAIp(redNum) : numeroAIp(redNum + 1),
    ultimoHost: prefijo >= 31 ? numeroAIp(broadcastNum) : numeroAIp(broadcastNum - 1),
    totalHosts,
    hostsUtiles,
    cidr: `${numeroAIp(redNum)}/${prefijo}`,
  }
}

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white font-mono'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

export default function CalculadoraIp() {
  const [ip, setIp] = useState('192.168.1.10')
  const [prefijo, setPrefijo] = useState('24')

  const resultado = useMemo(() => calcularSubred(ip.trim(), parseInt(prefijo, 10)), [ip, prefijo])

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Dirección IP</label>
          <input type="text" value={ip} onChange={(e) => setIp(e.target.value)} placeholder="Ej: 192.168.1.10" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Máscara (prefijo CIDR)</label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">/</span>
            <input type="number" inputMode="numeric" min="0" max="32" value={prefijo} onChange={(e) => setPrefijo(e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>

      {resultado ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            ['Dirección de red', resultado.red],
            ['Máscara de subred', resultado.mascara],
            ['Dirección de broadcast', resultado.broadcast],
            ['Notación CIDR', resultado.cidr],
            ['Primer host utilizable', resultado.primerHost],
            ['Último host utilizable', resultado.ultimoHost],
            ['Total de direcciones', resultado.totalHosts.toLocaleString('es')],
            ['Hosts utilizables', resultado.hostsUtiles.toLocaleString('es')],
          ].map(([label, valor]) => (
            <div key={label} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-500">{label}</p>
              <p className="font-mono font-semibold text-gray-900">{valor}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-red-600">Introduce una dirección IP válida (formato IPv4, ej: 192.168.1.10) y un prefijo entre 0 y 32.</p>
      )}
    </div>
  )
}
