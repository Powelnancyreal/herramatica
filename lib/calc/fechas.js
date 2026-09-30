// Fechas como 'YYYY-MM-DD' manejadas en UTC para evitar desfases por zona horaria u horario de verano.
const DIA_MS = 86400000

export const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
export const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

export function parseISO(str) {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d))
}

export function toISO(date) {
  return date.toISOString().slice(0, 10)
}

export function hoyISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function formatoLargo(date) {
  return `${DIAS_SEMANA[date.getUTCDay()]} ${date.getUTCDate()} de ${MESES[date.getUTCMonth()]} de ${date.getUTCFullYear()}`
}

export function sumarDias(date, n) {
  return new Date(date.getTime() + n * DIA_MS)
}

// Suma meses respetando el fin de mes: 31 de enero + 1 mes = 28/29 de febrero.
export function sumarMeses(date, n) {
  const y = date.getUTCFullYear()
  const m = date.getUTCMonth() + n
  const destinoY = y + Math.floor(m / 12)
  const destinoM = ((m % 12) + 12) % 12
  const ultimoDia = new Date(Date.UTC(destinoY, destinoM + 1, 0)).getUTCDate()
  return new Date(Date.UTC(destinoY, destinoM, Math.min(date.getUTCDate(), ultimoDia)))
}

export function diferenciaDias(a, b) {
  return Math.round((b.getTime() - a.getTime()) / DIA_MS)
}

export function diaDelAnio(date) {
  return diferenciaDias(new Date(Date.UTC(date.getUTCFullYear(), 0, 1)), date) + 1
}

export function semanaISO(date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  const dia = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dia)
  const inicio = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d - inicio) / DIA_MS + 1) / 7)
}

function enesimoLunes(y, mes, n) {
  const primero = new Date(Date.UTC(y, mes, 1))
  const offset = (8 - primero.getUTCDay()) % 7
  return new Date(Date.UTC(y, mes, 1 + offset + 7 * (n - 1)))
}

// Días de descanso obligatorio, art. 74 LFT (incluye el 1 de octubre de cada 6 años, desde 2024).
export function feriadosMexico(y) {
  const lista = [
    { fecha: new Date(Date.UTC(y, 0, 1)), nombre: 'Año Nuevo' },
    { fecha: enesimoLunes(y, 1, 1), nombre: 'Día de la Constitución (primer lunes de febrero)' },
    { fecha: enesimoLunes(y, 2, 3), nombre: 'Natalicio de Benito Juárez (tercer lunes de marzo)' },
    { fecha: new Date(Date.UTC(y, 4, 1)), nombre: 'Día del Trabajo' },
    { fecha: new Date(Date.UTC(y, 8, 16)), nombre: 'Día de la Independencia' },
    { fecha: enesimoLunes(y, 10, 3), nombre: 'Revolución Mexicana (tercer lunes de noviembre)' },
    { fecha: new Date(Date.UTC(y, 11, 25)), nombre: 'Navidad' },
  ]
  if (y >= 2024 && (y - 2024) % 6 === 0) {
    lista.push({ fecha: new Date(Date.UTC(y, 9, 1)), nombre: 'Transmisión del Poder Ejecutivo Federal' })
  }
  return lista.sort((a, b) => a.fecha - b.fecha)
}

function esHabil(date, { sabadoHabil, feriados }) {
  const dia = date.getUTCDay()
  if (dia === 0) return false
  if (dia === 6 && !sabadoHabil) return false
  return !feriados.has(toISO(date))
}

export function construirFeriados({ pais, anioInicio, anioFin, personalizados = [] }) {
  const set = new Set(personalizados)
  if (pais === 'mx') {
    for (let y = anioInicio; y <= anioFin; y++) feriadosMexico(y).forEach((f) => set.add(toISO(f.fecha)))
  }
  return set
}

// Igual que DIAS.LAB / NETWORKDAYS de Excel: cuenta ambas fechas si son hábiles.
export function contarDiasHabiles(inicio, fin, opciones) {
  const [a, b] = inicio <= fin ? [inicio, fin] : [fin, inicio]
  let habiles = 0
  let feriadosEnRango = 0
  let findes = 0
  for (let d = a; d <= b; d = sumarDias(d, 1)) {
    const dia = d.getUTCDay()
    const esFinde = dia === 0 || (dia === 6 && !opciones.sabadoHabil)
    if (esFinde) findes++
    else if (opciones.feriados.has(toISO(d))) feriadosEnRango++
    else habiles++
  }
  return { habiles, naturales: diferenciaDias(a, b) + 1, findes, feriadosEnRango }
}

// Igual que DIA.LAB / WORKDAY de Excel: no cuenta la fecha de inicio.
export function sumarDiasHabiles(inicio, n, opciones) {
  let d = inicio
  let restantes = Math.abs(n)
  const paso = n >= 0 ? 1 : -1
  while (restantes > 0) {
    d = sumarDias(d, paso)
    if (esHabil(d, opciones)) restantes--
  }
  return d
}
