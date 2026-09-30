export const ZONAS_DESTACADAS = [
  { tz: 'America/Mexico_City', nombre: 'Ciudad de México' },
  { tz: 'America/Tijuana', nombre: 'Tijuana' },
  { tz: 'America/Cancun', nombre: 'Cancún' },
  { tz: 'America/Bogota', nombre: 'Bogotá' },
  { tz: 'America/Lima', nombre: 'Lima' },
  { tz: 'America/Caracas', nombre: 'Caracas' },
  { tz: 'America/Santiago', nombre: 'Santiago de Chile' },
  { tz: 'America/Argentina/Buenos_Aires', nombre: 'Buenos Aires' },
  { tz: 'America/Guatemala', nombre: 'Guatemala' },
  { tz: 'America/Santo_Domingo', nombre: 'Santo Domingo' },
  { tz: 'Europe/Madrid', nombre: 'Madrid' },
  { tz: 'Atlantic/Canary', nombre: 'Islas Canarias' },
  { tz: 'America/New_York', nombre: 'Nueva York' },
  { tz: 'America/Los_Angeles', nombre: 'Los Ángeles' },
  { tz: 'Europe/London', nombre: 'Londres' },
  { tz: 'Asia/Tokyo', nombre: 'Tokio' },
  { tz: 'UTC', nombre: 'UTC' },
]

function partes(ts, tz) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const p = Object.fromEntries(fmt.formatToParts(new Date(ts)).map((x) => [x.type, x.value]))
  return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour, min: +p.minute, s: +p.second }
}

// Desfase de la zona respecto a UTC en milisegundos para un instante dado.
export function desfaseMs(ts, tz) {
  const p = partes(ts, tz)
  return Date.UTC(p.y, p.m - 1, p.d, p.h, p.min, p.s) - Math.floor(ts / 1000) * 1000
}

// Convierte una hora "de reloj" en la zona tz a un instante UTC, corrigiendo cambios de horario.
export function horaLocalAUTC({ y, m, d, h, min }, tz) {
  const ingenuo = Date.UTC(y, m - 1, d, h, min)
  let ts = ingenuo - desfaseMs(ingenuo, tz)
  const ajuste = ingenuo - desfaseMs(ts, tz)
  if (ajuste !== ts) ts = ajuste
  const p = partes(ts, tz)
  const existe = p.h === h && p.min === min
  return { ts, existe }
}

export function formatearEnZona(ts, tz) {
  return new Intl.DateTimeFormat('es-MX', {
    timeZone: tz,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(ts))
}

export function etiquetaDesfase(ts, tz) {
  const min = Math.round(desfaseMs(ts, tz) / 60000)
  const signo = min >= 0 ? '+' : '−'
  const abs = Math.abs(min)
  return `UTC${signo}${Math.floor(abs / 60)}${abs % 60 ? ':' + String(abs % 60).padStart(2, '0') : ''}`
}
