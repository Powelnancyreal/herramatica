// Formateadores de moneda para las herramientas de otros países.
const cache = {}

export function formatMoneda(n, moneda = 'EUR', decimales = 2) {
  const clave = `${moneda}-${decimales}`
  if (!cache[clave]) {
    const locale = { EUR: 'es-ES', CLP: 'es-CL', COP: 'es-CO', PEN: 'es-PE', USD: 'es-EC', UYU: 'es-UY', ARS: 'es-AR' }[moneda] || 'es'
    cache[clave] = new Intl.NumberFormat(locale, { style: 'currency', currency: moneda, minimumFractionDigits: decimales, maximumFractionDigits: decimales })
  }
  return cache[clave].format(isFinite(n) ? n : 0)
}

export const eur = (n) => formatMoneda(n, 'EUR')
export const clp = (n) => formatMoneda(n, 'CLP', 0)
export const cop = (n) => formatMoneda(n, 'COP', 0)
export const pen = (n) => formatMoneda(n, 'PEN')
export const usd = (n) => formatMoneda(n, 'USD')
export const uyu = (n) => formatMoneda(n, 'UYU', 0)
export const ars = (n) => formatMoneda(n, 'ARS')
