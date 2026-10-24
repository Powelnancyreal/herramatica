// Infografías del lote 10 (herramientas 91 a 100).
const { rect, circle } = require('../illustrations/kit')
const { tema, W, M, es } = require('./piezas-4').temas

// ─────────────────────────────────────────────────────────── 91 LDL (banda verde azulado)
function ldl() {
  const T = tema('banda', { accent: '#0F766E', soft: '#F0FDFA' })
  let s = rect(M, 180, W - 2 * M, 96, { rx: 16, fill: T.soft })
  s += T.tx(W / 2, 220, 'LDL = colesterol total − HDL − triglicéridos ÷ 5', { size: 22, weight: 700, anchor: 'middle', fill: T.accent })
  s += T.tx(W / 2, 256, '200 − 50 − 150 ÷ 5 = 200 − 50 − 30 = 120 mg/dL', { size: 19, anchor: 'middle' })
  const tramos = [['Menos de 100', 'Óptimo', '#10B981'], ['100 a 129', 'Casi óptimo', '#84CC16'], ['130 a 159', 'Límite alto', '#FACC15'], ['160 a 189', 'Alto', '#F97316'], ['190 o más', 'Muy alto', '#DC2626']]
  const tw = (W - 2 * M) / 5
  tramos.forEach(([r, n, c], i) => {
    s += rect(M + i * tw, 320, tw, 52, { rx: 0, fill: c })
    s += T.tx(M + i * tw + tw / 2, 352, n, { size: 16, weight: 700, anchor: 'middle', fill: i === 2 ? '#422006' : '#FFFFFF' })
    s += T.tx(M + i * tw + tw / 2, 394, r, { size: 15, anchor: 'middle', fill: T.muted })
  })
  const mx = M + tw + tw * (20 / 30)
  s += `<path d="M${mx - 10},306 L${mx + 10},306 L${mx},318 Z" fill="${T.ink}"/>` + T.tx(mx, 298, '120', { size: 16, weight: 700, anchor: 'middle' })
  s += T.tx(M, 414, 'mg/dL, clasificación del NCEP ATP III para adultos', { size: 14, fill: T.muted })
  const ay = 450
  s += rect(M, ay, W - 2 * M, 84, { rx: 14, fill: '#FEF3C7' })
  s += T.tx(M + 20, ay + 34, 'Triglicéridos por encima de 400 mg/dL', { size: 19, weight: 700, fill: '#92400E' })
  s += T.tx(M + 20, ay + 64, 'La fórmula deja de ser fiable: hace falta medir el LDL directamente.', { size: 16, fill: '#92400E' })
  const n = T.nota(ay + 124, 'Tu objetivo de LDL depende de tu riesgo cardiovascular: en personas con diabetes o con un infarto previo suele ser mucho más bajo. Lo fija tu médico.')
  return T.lienzo({ alto: Math.round(ay + 124 + n.h + 64), slug: 'calculadora-ldl', titulo: 'Cómo se calcula el colesterol LDL y qué valor es normal', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 92 PaFi (oscuro, clínico)
function pafi() {
  const T = tema('oscuro', { accent: '#38BDF8', bg: '#0B1220', soft: '#14213D', line: '#22325A' })
  let s = T.tx(M, 190, 'PaFi = PaO₂ ÷ FiO₂', { size: 30, weight: 700, fill: T.accent })
  s += T.tx(M, 230, 'PaO₂ de 80 mmHg con FiO₂ del 40 %:   80 ÷ 0,40 = 200', { size: 20 })
  const tramos = [['> 400', 'Normal', '#22C55E'], ['301 – 400', 'Leve', '#A3E635'], ['201 – 300', 'Moderada', '#FACC15'], ['101 – 200', 'Severa', '#F97316'], ['≤ 100', 'Muy severa', '#EF4444']]
  tramos.forEach(([r, n, c], i) => {
    const y = 270 + i * 58
    s += rect(M, y, W - 2 * M, 50, { rx: 10, fill: T.soft })
    s += rect(M, y, 12, 50, { rx: 4, fill: c })
    s += T.tx(M + 30, y + 32, r, { size: 21, weight: 700, fill: c })
    s += T.tx(W - M - 18, y + 32, `Alteración ${n.toLowerCase()}`.replace('Alteración normal', 'Oxigenación normal'), { size: 18, anchor: 'end' })
  })
  s += T.tx(W - M - 18, 270 + 3 * 58 - 6, '← 200', { size: 15, anchor: 'end', fill: T.accent })
  const fy = 270 + 5 * 58 + 24
  const cw = (W - 2 * M - 16) / 2
  s += rect(M, fy, cw, 84, { rx: 14, fill: T.soft }) + T.tx(M + 18, fy + 34, 'Aire ambiente', { size: 16, fill: T.muted }) + T.tx(M + 18, fy + 66, 'FiO₂ = 0,21', { size: 22, weight: 700 })
  s += rect(M + cw + 16, fy, cw, 84, { rx: 14, fill: T.soft }) + T.tx(M + cw + 34, fy + 34, 'Escribe la FiO₂', { size: 16, fill: T.muted }) + T.tx(M + cw + 34, fy + 66, 'en decimal o en %', { size: 22, weight: 700 })
  const n = T.nota(fy + 124, 'Herramienta de apoyo para profesionales sanitarios. El diagnóstico de SDRA requiere además la clínica, la imagen y el contexto del paciente.')
  return T.lienzo({ alto: Math.round(fy + 124 + n.h + 60), slug: 'calculadora-pafi', titulo: 'Índice PaFi: fórmula e interpretación', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 93 Barthel (papel, lista de actividades)
function barthel() {
  const T = tema('papel', { accent: '#0E7490', soft: '#CFFAFE' })
  const act = [['Comer', 10], ['Lavarse o bañarse', 5], ['Vestirse', 10], ['Arreglarse', 5], ['Deposición', 10], ['Micción', 10], ['Uso del retrete', 10], ['Traslado cama-sillón', 15], ['Deambulación', 15], ['Subir escaleras', 10]]
  const cw = (W - 2 * M - 16) / 2
  let s = ''
  act.forEach(([n, p], i) => {
    const x = M + (i % 2) * (cw + 16)
    const y = 180 + Math.floor(i / 2) * 50
    s += rect(x, y, cw, 42, { rx: 10, fill: '#FFFDF8', stroke: T.line, sw: 1.5 })
    s += T.tx(x + 14, y + 28, n, { size: 18, family: T.titulo })
    s += T.tx(x + cw - 14, y + 28, `${p}`, { size: 20, weight: 700, anchor: 'end', fill: T.accent })
  })
  s += T.tx(W - M, 180 + 5 * 50 + 22, 'Total máximo: 100 puntos', { size: 18, weight: 700, anchor: 'end' })
  const ty = 180 + 5 * 50 + 60
  const cortes = [['100', 'Independiente', '#059669'], ['91 – 99', 'Dependencia leve', '#65A30D'], ['61 – 90', 'Dependencia moderada', '#D97706'], ['21 – 60', 'Dependencia severa', '#EA580C'], ['0 – 20', 'Dependencia total', '#DC2626']]
  cortes.forEach(([r, n, c], i) => {
    const y = ty + i * 46
    s += rect(M, y, 110, 38, { rx: 10, fill: c })
    s += T.tx(M + 55, y + 26, r, { size: 17, weight: 700, anchor: 'middle', fill: '#FFF' })
    s += T.tx(M + 128, y + 26, n, { size: 19, family: T.titulo })
  })
  const n = T.nota(ty + 5 * 46 + 16, 'Puntos de corte habituales; algunos servicios usan otros. Lo importante es comparar la misma persona a lo largo del tiempo.')
  return T.lienzo({ alto: Math.round(ty + 5 * 46 + 16 + n.h + 64), slug: 'indice-de-barthel', titulo: 'Las 10 actividades del Índice de Barthel y su puntuación', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 94 Liquidación Colombia (banda amarilla)
function liquidacionCo() {
  const T = tema('banda', { accent: '#A16207', soft: '#FEFCE8' })
  let s = T.tx(M, 180, 'Salario $2.000.000 + auxilio de transporte $249.095 · un año completo', { size: 17, fill: T.muted })
  const conceptos = [
    ['Cesantías', '(salario + auxilio) × días ÷ 360', '$2.249.095', '#CA8A04'],
    ['Intereses sobre cesantías', 'cesantías × días × 12 % ÷ 360', '$269.891', '#EAB308'],
    ['Prima de servicios', '(salario + auxilio) × días ÷ 360, en dos pagos', '$2.249.095', '#2563EB'],
    ['Vacaciones (si no las tomaste)', 'salario × días ÷ 720, sin auxilio', '$1.000.000', '#DC2626'],
  ]
  conceptos.forEach(([t, f, v, c], i) => {
    const y = 206 + i * 90
    s += rect(M, y, W - 2 * M, 78, { rx: 14, fill: '#FFFFFF', stroke: T.line, sw: 2 })
    s += rect(M, y, 12, 78, { rx: 4, fill: c })
    s += T.tx(M + 28, y + 32, t, { size: 20, weight: 700 })
    s += T.tx(M + 28, y + 58, f, { size: 15, fill: T.muted })
    s += T.tx(W - M - 18, y + 48, v, { size: 24, weight: 700, anchor: 'end', fill: c === '#EAB308' ? '#A16207' : c })
  })
  const ty = 206 + 4 * 90 + 6
  s += rect(M, ty, W - 2 * M, 66, { rx: 14, fill: T.accent })
  s += T.tx(M + 20, ty + 42, 'Total aproximado', { size: 20, fill: '#FEF9C3' })
  s += T.tx(W - M - 20, ty + 44, '$5.768.081', { size: 30, weight: 700, anchor: 'end', fill: '#FFFFFF' })
  const n = T.nota(ty + 106, 'Si te despidieron sin justa causa, además puede corresponderte una indemnización. El auxilio de transporte solo aplica si ganas hasta 2 salarios mínimos (SMMLV 2026: $1.750.905).')
  return T.lienzo({ alto: Math.round(ty + 106 + n.h + 64), slug: 'calculadora-liquidacion-laboral-colombia', titulo: 'Qué incluye una liquidación laboral en Colombia', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 95 Seguridad social Colombia (pastel)
function seguridadSocialCo() {
  const T = tema('pastel', { accent: '#1D4ED8', soft: '#DBEAFE', bg: '#F7FAFF', ink: '#172554', line: '#DBEAFE' })
  const cw = (W - 2 * M - 20) / 2
  const col = (x, titulo, base, filas, total, nota) => {
    let o = rect(x, 180, cw, 440, { rx: 20, fill: '#FFFFFF', stroke: T.line, sw: 2 })
    o += T.tx(x + 22, 220, titulo, { size: 22, weight: 700, fill: T.accent })
    o += T.tx(x + 22, 252, base, { size: 16, fill: T.muted })
    filas.forEach(([a, b, c], i) => {
      const y = 290 + i * 74
      o += T.tx(x + 22, y, a, { size: 18, weight: 700 })
      o += T.tx(x + 22, y + 26, b, { size: 15, fill: T.muted })
      o += T.tx(x + cw - 22, y + 14, c, { size: 22, weight: 700, anchor: 'end' })
    })
    o += rect(x + 16, 500, cw - 32, 108, { rx: 14, fill: T.soft })
    o += T.tx(x + 32, 532, 'Total al mes', { size: 15, fill: T.muted })
    o += T.tx(x + 32, 564, total, { size: 26, weight: 700, fill: T.accent })
    o += T.tx(x + 32, 594, nota, { size: 14, fill: T.muted })
    return o
  }
  let s = col(M, 'Empleado', 'Salario de $3.000.000', [['Salud', '4 % del salario', '$120.000'], ['Pensión', '4 % del salario', '$120.000']], '$240.000', 'el resto lo paga la empresa')
  s += col(M + cw + 20, 'Independiente', 'Honorarios de $5 millones · IBC de $2 millones', [['Salud', '12,5 % del IBC', '$250.000'], ['Pensión', '16 % del IBC', '$320.000']], '$570.000', 'más ARL si aplica')
  const n = T.nota(650, 'El IBC del independiente es el 40 % de sus ingresos y nunca menor a un salario mínimo. Los ingresos altos pagan además el Fondo de Solidaridad Pensional.')
  return T.lienzo({ alto: Math.round(650 + n.h + 64), slug: 'calculadora-seguridad-social-colombia', titulo: 'Cuánto se paga de salud y pensión en Colombia', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 96 CDT (pizarra)
function cdt() {
  const T = tema('pizarra')
  let s = T.tx(M, 190, 'monto × (1 + TEA)^(días ÷ 365) − monto', { size: 26, family: T.titulo, fill: T.accent })
  s += T.tx(M, 250, '$10.000.000 al 10 % TEA a 180 días', { size: 22 })
  const pasos = [['Rendimiento bruto', '$481.244'], ['Retención en la fuente (4 %)', '− $19.250'], ['Rendimiento neto aproximado', '$461.994']]
  pasos.forEach(([a, b], i) => {
    const y = 290 + i * 62
    s += rect(M, y, W - 2 * M, 52, { rx: 10, fill: i === 2 ? '#3E6151' : T.soft, stroke: T.line, sw: 2 })
    s += T.tx(M + 18, y + 34, a, { size: 20, family: T.titulo })
    s += T.tx(W - M - 18, y + 34, b, { size: 24, weight: 700, anchor: 'end', fill: i === 2 ? T.accent : T.ink })
  })
  const ty = 290 + 3 * 62 + 36
  s += T.tx(M, ty, 'Mismo dinero, distintos plazos (10 % TEA)', { size: 20, fill: T.accent, family: T.titulo })
  const plazos = [['90 días', '$237.795'], ['180 días', '$481.244'], ['360 días', '$985.648']]
  const cw = (W - 2 * M - 24) / 3
  plazos.forEach(([a, b], i) => {
    const x = M + i * (cw + 12)
    s += rect(x, ty + 20, cw, 90, { rx: 14, fill: T.soft, stroke: T.line, sw: 2 })
    s += T.tx(x + cw / 2, ty + 54, a, { size: 18, anchor: 'middle', fill: T.muted })
    s += T.tx(x + cw / 2, ty + 90, b, { size: 26, anchor: 'middle', weight: 700, family: T.titulo })
  })
  const n = T.nota(ty + 150, 'La calculadora muestra el rendimiento bruto. La retención en la fuente se descuenta al vencer y luego se tiene en cuenta en tu declaración de renta.')
  return T.lienzo({ alto: Math.round(ty + 150 + n.h + 60), slug: 'calculadora-cdt', titulo: 'Cuánto rinde un CDT en Colombia', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 97 Prima vacacional (cuaderno)
function primaVacacional() {
  const T = tema('cuaderno', { accent: '#7C3AED' })
  let s = T.tx(M, 190, 'salario diario × días de vacaciones × 25 %', { size: 26, family: T.titulo })
  const pasos = [['Salario diario', '$500.00'], ['Días de vacaciones (1.er año)', '12'], ['Salario de las vacaciones', '$500 × 12 = $6,000.00'], ['Prima vacacional (25 %)', '$6,000 × 25 % = $1,500.00']]
  pasos.forEach(([a, b], i) => {
    const y = 220 + i * 62
    s += rect(M, y, W - 2 * M, 52, { rx: 12, fill: i === 3 ? '#EDE9FE' : '#FFFFFF', stroke: i === 3 ? T.accent : '#93C5FD', sw: 2 })
    s += T.tx(M + 18, y + 34, a, { size: 19 })
    s += T.tx(W - M - 18, y + 35, b, { size: 22, weight: 700, anchor: 'end', fill: i === 3 ? T.accent : T.ink, family: T.titulo })
  })
  const ey = 220 + 4 * 62 + 24
  s += rect(M, ey, W - 2 * M, 110, { rx: 16, fill: T.soft, stroke: '#93C5FD', sw: 2 })
  s += T.tx(M + 20, ey + 36, '¿Paga ISR?', { size: 20, weight: 700, fill: T.accent })
  s += T.tx(M + 20, ey + 68, 'Exenta hasta 15 UMA al año: 15 × $117.31 = $1,759.65', { size: 19 })
  s += T.tx(M + 20, ey + 94, 'En este ejemplo, los $1,500 están exentos.', { size: 17, fill: T.muted })
  const n = T.nota(ey + 150, 'El 25 % es el mínimo de la Ley Federal del Trabajo (art. 80). Muchas empresas pagan más; revisa tu contrato.')
  return T.lienzo({ alto: Math.round(ey + 150 + n.h + 56), slug: 'calcular-prima-vacacional', titulo: 'Cómo se calcula la prima vacacional en México', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 98 Vacaciones México (banda verde)
function vacacionesMx() {
  const T = tema('banda', { accent: '#15803D', soft: '#F0FDF4' })
  const filas = [['1 año', 12], ['2 años', 14], ['3 años', 16], ['4 años', 18], ['5 años', 20], ['6 a 10', 22], ['11 a 15', 24], ['16 a 20', 26], ['21 a 25', 28], ['26 a 30', 30], ['31 a 35', 32]]
  const x0 = M + 110
  const ancho = W - M - x0 - 50
  let s = ''
  filas.forEach(([a, d], i) => {
    const y = 180 + i * 42
    s += T.tx(M, y + 24, a, { size: 17, weight: i < 5 ? 700 : 400 })
    s += rect(x0, y + 6, (d / 32) * ancho, 28, { rx: 8, fill: i < 5 ? T.accent : '#86EFAC' })
    s += T.tx(x0 + (d / 32) * ancho + 10, y + 27, `${d} días`, { size: 17, weight: 700 })
  })
  const n = T.nota(180 + filas.length * 42 + 20, 'Tabla del artículo 76 de la Ley Federal del Trabajo, vigente desde 2023. Se aplica a todos los trabajadores, aunque hayan entrado antes de la reforma. Al menos 12 días deben ser seguidos si el trabajador lo pide.')
  return T.lienzo({ alto: Math.round(180 + filas.length * 42 + 20 + n.h + 64), slug: 'calcular-vacaciones', titulo: 'Días de vacaciones por antigüedad en México', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 99 PTU (papel)
function ptu() {
  const T = tema('papel', { accent: '#1D4ED8', soft: '#DBEAFE' })
  let s = T.tx(M, 186, 'Utilidad fiscal de la empresa', { size: 22, weight: 700, family: T.titulo })
  s += rect(M, 204, W - 2 * M, 50, { rx: 10, fill: '#E7E5E4' })
  s += rect(M, 204, (W - 2 * M) * 0.1, 50, { rx: 10, fill: T.accent })
  s += T.tx(M + 12, 236, '10 %', { size: 18, weight: 700, fill: '#FFF' })
  s += T.tx(M + (W - 2 * M) * 0.1 + 14, 236, 'para repartir entre los trabajadores', { size: 18 })
  const cw = (W - 2 * M - 16) / 2
  const caja = (x, t, d) => rect(x, 290, cw, 112, { rx: 16, fill: T.soft }) + T.tx(x + 20, 330, t, { size: 21, weight: 700, fill: T.accent, family: T.titulo }) + T.parrafo(x + 20, 362, d, { size: 16, max: 34 }).svg
  s += caja(M, '50 % por días', 'Se reparte según los días que trabajó cada persona en el año.')
  s += caja(M + cw + 16, '50 % por salario', 'Se reparte en proporción al salario de cada trabajador.')
  const ty = 440
  s += rect(M, ty, W - 2 * M, 100, { rx: 16, fill: '#FFFDF8', stroke: T.line, sw: 2 })
  s += T.tx(M + 20, ty + 36, 'Tope desde 2021', { size: 20, weight: 700, family: T.titulo })
  s += T.tx(M + 20, ty + 70, 'El mayor entre 3 meses de salario o el promedio de lo recibido en los 3 últimos años.', { size: 16 })
  const fy = ty + 136
  const fechas = [['Empresas (personas morales)', 'a más tardar el 30 de mayo'], ['Personas físicas con actividad empresarial', 'a más tardar el 29 de junio']]
  fechas.forEach(([a, b], i) => {
    s += T.tx(M, fy + i * 40, a, { size: 18, family: T.titulo })
    s += T.tx(W - M, fy + i * 40, b, { size: 18, weight: 700, anchor: 'end', fill: T.accent })
  })
  const n = T.nota(fy + 2 * 40 + 10, 'Los trabajadores eventuales necesitan al menos 60 días trabajados en el año. No reciben PTU los directores, administradores y gerentes generales.')
  return T.lienzo({ alto: Math.round(fy + 2 * 40 + 10 + n.h + 64), slug: 'calcular-ptu', titulo: 'Cómo se reparte la PTU entre los trabajadores', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 100 SDI (terminal)
function sdi() {
  const T = tema('terminal', { accent: '#FBBF24' })
  let s = T.tx(M, 182, '# factor de integración mínimo 2026', { size: 17, fill: T.muted })
  s += T.tx(M, 222, 'factor = (365 + aguinaldo + vacaciones × prima) ÷ 365', { size: 20, fill: '#34D399' })
  s += T.tx(M, 262, '       = (365 + 15 + 12 × 0.25) ÷ 365', { size: 20 })
  s += T.tx(M, 302, '       = 383 ÷ 365 = 1.0493', { size: 22, weight: 700, fill: T.accent })
  const ty = 350
  s += T.tx(M, ty, '# ejemplo: salario diario de $500', { size: 17, fill: T.muted })
  const filas = [['salario_diario', '500.00'], ['factor', '× 1.0493'], ['SDI', '= 524.66']]
  filas.forEach(([a, b], i) => {
    const y = ty + 22 + i * 54
    s += rect(M, y, W - 2 * M, 46, { rx: 8, fill: T.soft })
    s += T.tx(M + 16, y + 30, a, { size: 20, fill: '#93C5FD' })
    s += T.tx(W - M - 16, y + 31, b, { size: 22, weight: 700, anchor: 'end', fill: i === 2 ? T.accent : T.ink })
  })
  const uy = ty + 22 + 3 * 54 + 30
  s += T.tx(M, uy, '# se usa para', { size: 17, fill: T.muted })
  const usos = ['cuotas del IMSS e Infonavit', 'indemnizaciones por despido', 'pensión de Ley 73 y Ley 97']
  usos.forEach((u, i) => { s += T.tx(M, uy + 34 + i * 32, `- ${u}`, { size: 19 }) })
  const n = T.nota(uy + 34 + 3 * 32 + 10, '// tope de cotización ante el IMSS: 25 UMA diarias. Prestaciones superiores a la ley suben el factor.')
  return T.lienzo({ alto: Math.round(uy + 34 + 3 * 32 + 10 + n.h + 60), slug: 'calcular-salario-diario-integrado', titulo: 'Cómo se calcula el salario diario integrado (SDI)', cuerpo: s + n.svg })
}

const pieza = (archivo, alt, fn) => ({ archivo, alt, dibujar: fn })

module.exports = [
  pieza('calculo-colesterol-ldl-friedewald', 'Cálculo del colesterol LDL con la fórmula de Friedewald y rangos de LDL óptimo, límite y alto', ldl),
  pieza('indice-pafi-formula-rangos', 'Fórmula del índice PaFi y rangos de alteración de la oxigenación', pafi),
  pieza('actividades-indice-barthel', 'Las diez actividades del Índice de Barthel con su puntuación y los grados de dependencia', barthel),
  pieza('conceptos-liquidacion-laboral-colombia', 'Conceptos de la liquidación laboral en Colombia: cesantías, intereses, prima y vacaciones', liquidacionCo),
  pieza('aportes-salud-pension-colombia', 'Aportes de salud y pensión en Colombia para empleados e independientes', seguridadSocialCo),
  pieza('rendimiento-cdt-colombia', 'Rendimiento de un CDT de 10 millones de pesos al 10 por ciento según el plazo', cdt),
  pieza('calculo-prima-vacacional-mexico', 'Cálculo de la prima vacacional del 25 por ciento con un ejemplo y la exención de ISR', primaVacacional),
  pieza('tabla-vacaciones-antiguedad-lft', 'Tabla de días de vacaciones por años de antigüedad según la Ley Federal del Trabajo', vacacionesMx),
  pieza('reparto-ptu-trabajadores', 'Cómo se reparte la PTU: 10 por ciento de la utilidad, mitad por días y mitad por salario', ptu),
  pieza('factor-integracion-sdi-2026', 'Cálculo del factor de integración y del salario diario integrado mínimo en 2026', sdi),
]
