'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CLAVE_CONSENTIMIENTO } from '@/lib/consentimiento'

// Guarda la elección sobre las cookies de analítica y la comunica a Google Analytics (Consent Mode).
// El valor por defecto lo fija el script de app/layout.js: denegado en el Espacio Económico Europeo,
// Reino Unido y Suiza hasta que el visitante acepte; permitido en el resto, con opción de rechazar aquí.
const EVENTO = 'herramatica:configurar-cookies'

function leer() {
  try {
    return localStorage.getItem(CLAVE_CONSENTIMIENTO)
  } catch {
    return 'no-disponible'
  }
}

function guardar(valor) {
  try {
    localStorage.setItem(CLAVE_CONSENTIMIENTO, valor)
  } catch {
    // Sin almacenamiento (modo privado estricto): la elección vale solo para esta visita.
  }
  window.gtag?.('consent', 'update', { analytics_storage: valor === 'aceptadas' ? 'granted' : 'denied' })
}

export default function ConsentimientoCookies() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!leer()) setVisible(true)
    const abrir = () => setVisible(true)
    window.addEventListener(EVENTO, abrir)
    return () => window.removeEventListener(EVENTO, abrir)
  }, [])

  if (!visible) return null

  const elegir = (valor) => {
    guardar(valor)
    setVisible(false)
  }

  return (
    <div role="region" aria-label="Preferencias de cookies" className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4">
      <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-xl sm:flex sm:items-center sm:gap-5">
        <p className="text-sm text-gray-700 leading-relaxed">
          Usamos cookies de Google Analytics para saber qué herramientas se usan y mejorarlas. No usamos cookies de publicidad y lo que
          escribes en las herramientas no sale de tu dispositivo.{' '}
          <Link href="/cookies" className="text-blue-600 underline underline-offset-2">Más información</Link>
        </p>
        <div className="mt-3 sm:mt-0 flex shrink-0 gap-2">
          <button type="button" onClick={() => elegir('rechazadas')} className="flex-1 sm:flex-none rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Rechazar
          </button>
          <button type="button" onClick={() => elegir('aceptadas')} className="flex-1 sm:flex-none rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}

// Enlace o botón para volver a abrir el aviso desde el pie de página o la política de cookies.
export function BotonConfigurarCookies({ className, children = 'Configurar cookies' }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(EVENTO))} className={className}>
      {children}
    </button>
  )
}
