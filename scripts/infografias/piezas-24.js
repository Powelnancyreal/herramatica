// Infografías del lote 24 (herramientas 231 a 240).
const { rect, circle } = require('../illustrations/kit')
const { tema, W, M, es } = require('./piezas-4').temas

const mono = 'Consolas, monospace'
const ars = (n) => '$' + n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' })

// ─────────────────────────────────────────────────────────── 231 Tallas de anillo (pastel dorado, círculos)
function anillos() {
  const T = tema('pastel', { accent: '#A16207', soft: '#FEF3C7', bg: '#FFFDF7', ink: '#422006', line: '#FDE68A' })
  const letras = ['F', 'G', 'H', 'I', 'J½', 'K½', 'L½', 'M½', 'N½', 'O½', 'P½', 'Q½', 'R½']
  const tallas = [5, 6, 7, 8, 9].map((us) => {
    const d = 11.63 + 0.8128 * us
    const c = d * Math.PI
    return { us, d, c, es: c - 40, uk: letras[Math.round((us - 3) * 2)] }
  })
  let s = T.tx(M, 186, 'Diámetro interior a escala 4:1', { size: 18, weight: 700 })
  let x = M
  tallas.forEach((t) => {
    const r = t.d * 2
    s += circle(x + r, 260, r, { fill: 'none', stroke: T.accent, sw: 6 })
    s += T.tx(x + r, 266, String(t.us), { size: 22, weight: 700, anchor: 'middle' })
    s += T.tx(x + r, 260 + r + 26, `${es(t.d, 1)} mm`, { size: 14, anchor: 'middle', fill: T.muted })
    x += 2 * r + 22
  })
  const ty = 360
  const cols = [M, M + 150, M + 290, M + 440, M + 590]
  ;['EE. UU./México', 'Diámetro', 'Europa', 'España', 'Reino Unido'].forEach((c, i) => { s += T.tx(cols[i], ty, c, { size: 14, weight: 700, fill: T.muted }) })
  tallas.forEach((t, i) => {
    const y = ty + 14 + i * 44
    s += rect(M - 8, y, W - 2 * M + 16, 38, { rx: 8, fill: i % 2 ? '#FFFFFF' : T.soft })
    ;[String(t.us), `${es(t.d, 2)} mm`, es(t.c, 1), es(t.es, 1), t.uk].forEach((v, k) => { s += T.tx(cols[k], y + 26, v, { size: 17, weight: k === 0 ? 700 : 400, fill: k === 0 ? T.accent : T.ink }) })
  })
  const n = T.nota(ty + 14 + 5 * 44 + 16, 'La talla europea es el contorno del dedo en mm y la española, ese contorno menos 40. México usa la misma escala que EE. UU.')
  return T.lienzo({ alto: Math.round(ty + 14 + 5 * 44 + 16 + n.h + 60), slug: 'tallas-de-anillo', titulo: 'Equivalencias de tallas de anillo', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 232 Finiquito México (banda verde, renuncia vs despido)
function finiquitoMx() {
  const T = tema('banda', { accent: '#15803D', soft: '#F0FDF4' })
  let s = T.tx(M, 188, 'Salario diario $500 · del 1 mar 2023 al 31 oct 2026', { size: 18, weight: 700 })
  const filas = [['Aguinaldo proporcional', '12.49 días', 6246.58, 6246.58], ['Vacaciones no disfrutadas', '12.03 días', 6016.44, 6016.44], ['Prima vacacional (25 %)', '', 1504.11, 1504.11], ['Prima de antigüedad', '12 días × 3.67 años', 0, 22043.84], ['Indemnización de 3 meses', '90 días de SDI', 0, 47404.11]]
  const cx = [M, M + 300, M + 470, W - M]
  ;['Concepto', '', 'Renuncia', 'Despido injustificado'].forEach((c, i) => { s += T.tx(cx[i], 226, c, { size: 14, weight: 700, fill: '#6B7280', anchor: i === 3 ? 'end' : 'start' }) })
  const mx = (n) => (n ? '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—')
  filas.forEach(([a, b, r, d], i) => {
    const y = 240 + i * 54
    s += rect(M - 8, y, W - 2 * M + 16, 46, { rx: 8, fill: i % 2 ? '#FFFFFF' : T.soft })
    s += T.tx(cx[0], y + 22, a, { size: 15, weight: 700 })
    if (b) s += T.tx(cx[0], y + 39, b, { size: 12, fill: '#6B7280' })
    s += T.tx(cx[2], y + 29, mx(r), { size: 16 })
    s += T.tx(cx[3], y + 29, mx(d), { size: 16, anchor: 'end', weight: i > 2 ? 700 : 400, fill: i > 2 ? T.accent : '#111827' })
  })
  const ty = 240 + 5 * 54 + 10
  s += `<line x1="${M}" y1="${ty}" x2="${W - M}" y2="${ty}" stroke="#111827" stroke-width="2"/>`
  s += T.tx(cx[0], ty + 34, 'Total', { size: 20, weight: 700 })
  s += T.tx(cx[2], ty + 34, '$13,767.12', { size: 20, weight: 700 })
  s += T.tx(cx[3], ty + 34, '$83,215.07', { size: 20, weight: 700, anchor: 'end', fill: T.accent })
  const n = T.nota(ty + 70, 'Con renuncia, la prima de antigüedad solo procede con 15 años o más. La indemnización se calcula con el salario diario integrado.')
  return T.lienzo({ alto: Math.round(ty + 70 + n.h + 64), slug: 'calculadora-finiquito-mexico', titulo: 'Finiquito por renuncia frente a despido', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 233 4x1000 (oscuro, cuenta exenta)
function gmf() {
  const T = tema('oscuro', { accent: '#FACC15', bg: '#0E1015', soft: '#1A1D25', line: '#2B303C' })
  let s = T.tx(M, 186, 'Transferencia de $ 25.000.000 desde la cuenta marcada como exenta', { size: 17, weight: 700 })
  const ww = W - 2 * M
  const exento = 18330900
  const wE = (exento / 25000000) * ww
  s += rect(M, 208, wE - 3, 64, { rx: 8, fill: '#34D399' }) + T.tx(M + 16, 238, 'exento: 350 UVT', { size: 16, weight: 700, fill: '#052E16' }) + T.tx(M + 16, 260, '$ 18.330.900', { size: 15, fill: '#052E16' })
  s += rect(M + wE, 208, ww - wE, 64, { rx: 8, fill: T.accent }) + T.tx(M + wE + 12, 238, 'gravado', { size: 16, weight: 700, fill: '#1C1917' }) + T.tx(M + wE + 12, 260, '$ 6.669.100', { size: 15, fill: '#1C1917' })
  s += T.tx(M, 310, '6.669.100 × 4 ÷ 1.000 =', { size: 20, family: mono }) + T.tx(W - M, 310, '$ 26.676', { size: 26, weight: 700, anchor: 'end', fill: T.accent })
  const ty = 360
  const casos = [['Retiro de $ 1.000.000 sin exención', '$ 4.000'], ['Retiro de $ 5.000.000 sin exención', '$ 20.000'], ['Retiros de hasta $ 18.330.900 al mes en la cuenta exenta', '$ 0'], ['Transferencias entre cuentas del mismo titular en el mismo banco', '$ 0']]
  casos.forEach(([a, b], i) => {
    const y = ty + i * 56
    s += rect(M, y, ww, 48, { rx: 10, fill: T.soft })
    s += T.tx(M + 16, y + 30, a, { size: 15 })
    s += T.tx(W - M - 16, y + 30, b, { size: 18, weight: 700, anchor: 'end', fill: b === '$ 0' ? '#34D399' : T.accent })
  })
  const n = T.nota(ty + 4 * 56 + 14, 'Solo una cuenta por persona puede estar marcada como exenta. UVT de 2026: $ 52.374.')
  return T.lienzo({ alto: Math.round(ty + 4 * 56 + 14 + n.h + 60), slug: 'calculadora-4x1000', titulo: 'Cuánto se paga de 4x1000 y cuándo no', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 234 Notas Colombia (cuaderno, cortes)
function notasCo() {
  const T = tema('cuaderno', { accent: '#1D4ED8' })
  const cortes = [['Primer corte', '30 %', '3,2', 0.96], ['Segundo corte', '30 %', '2,8', 0.84], ['Tercer corte', '40 %', '¿?', null]]
  let s = T.tx(M, 190, 'Escala de 0 a 5 · se aprueba con 3,0', { size: 22, weight: 700, family: T.titulo, fill: T.accent })
  const cw = (W - 2 * M - 24) / 3
  cortes.forEach(([a, p, n, v], i) => {
    const x = M + i * (cw + 12)
    s += rect(x, 214, cw, 150, { rx: 14, fill: '#FFFFFF', stroke: i === 2 ? '#F87171' : '#93C5FD', sw: 2 })
    s += T.tx(x + cw / 2, 248, a, { size: 18, weight: 700, anchor: 'middle', family: T.titulo })
    s += T.tx(x + cw / 2, 272, p, { size: 15, anchor: 'middle', fill: T.muted })
    s += T.tx(x + cw / 2, 322, n, { size: 38, weight: 700, anchor: 'middle', family: T.titulo, fill: i === 2 ? '#DC2626' : T.accent })
    if (v !== null) s += T.tx(x + cw / 2, 350, `aporta ${es(v, 2)}`, { size: 14, anchor: 'middle', fill: T.muted })
  })
  const ey = 396
  s += T.tx(M, ey, '¿Cuánto necesito en el tercer corte?', { size: 20, weight: 700, family: T.titulo })
  const pasos = ['Para que el 2,95 redondee a 3,0: 2,95 − 0,96 − 0,84 = 1,15', '1,15 ÷ 0,40 = 2,875 → necesitas al menos 2,9', 'Con 2,9: 0,96 + 0,84 + 1,16 = 2,96 → nota final 3,0 ✓']
  pasos.forEach((p, i) => { s += T.tx(M, ey + 36 + i * 32, `${i + 1}. ${p}`, { size: 17, family: T.titulo }) })
  const n = T.nota(ey + 36 + 3 * 32 + 10, 'La nota final se redondea a un decimal: 2,95 sube a 3,0. Algunas universidades no redondean: revisa tu reglamento.')
  return T.lienzo({ alto: Math.round(ey + 36 + 3 * 32 + 10 + n.h + 60), slug: 'calculadora-de-notas', titulo: 'Cuánto necesitas para pasar la materia', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 235 Empleados de comercio (papel, recibo)
function comercio() {
  const T = tema('papel', { accent: '#1E40AF', soft: '#DBEAFE', bg: '#FFFFFF', line: '#E5E7EB' })
  let s = T.tx(M, 188, 'Vendedor B, jornada completa, 5 años de antigüedad', { size: 18, weight: 700, family: T.titulo })
  s += T.tx(M, 212, 'Escala de septiembre de 2026 (CCT 130/75)', { size: 14, fill: T.muted })
  const hab = [['Básico', 1226349], ['Antigüedad (1 % por año)', 61317.45], ['Presentismo (1/12)', 107305.54], ['Suma no remunerativa', 120000]]
  const des = [['Jubilación 11 %', 153446.92], ['PAMI 3 %', 41849.16], ['Obra social 3 %', 45449.16], ['FAECyS 0,5 %', 7574.86]]
  const cw = (W - 2 * M - 16) / 2
  const bloque = (x, tit, filas, col, tot, totTxt) => {
    let o = rect(x, 232, cw, 260, { rx: 14, fill: '#F9FAFB', stroke: T.line, sw: 1.5 }) + T.tx(x + 16, 264, tit, { size: 17, weight: 700, fill: col })
    filas.forEach(([a, v], i) => { o += T.tx(x + 16, 300 + i * 36, a, { size: 14 }) + T.tx(x + cw - 16, 300 + i * 36, ars(v), { size: 14, anchor: 'end', family: mono }) })
    o += `<line x1="${x + 16}" y1="${300 + 4 * 36 - 14}" x2="${x + cw - 16}" y2="${300 + 4 * 36 - 14}" stroke="${T.line}" stroke-width="1.5"/>`
    o += T.tx(x + 16, 300 + 4 * 36 + 14, totTxt, { size: 15, weight: 700 }) + T.tx(x + cw - 16, 300 + 4 * 36 + 14, ars(tot), { size: 15, weight: 700, anchor: 'end', fill: col, family: mono })
    return o
  }
  s += bloque(M, 'Haberes', hab, T.accent, 1514971.99, 'Bruto')
  s += bloque(M + cw + 16, 'Descuentos', des, '#B91C1C', 248320.1, 'Total')
  const ny = 520
  s += rect(M, ny, W - 2 * M, 84, { rx: 14, fill: T.soft })
  s += T.tx(M + 20, ny + 36, 'Neto a cobrar', { size: 18, weight: 700 })
  s += T.tx(W - M - 20, ny + 54, ars(1266651.89), { size: 30, weight: 700, anchor: 'end', fill: T.accent, family: mono })
  s += T.tx(M + 20, ny + 64, 'sin cuota sindical', { size: 13, fill: T.muted })
  const n = T.nota(ny + 116, 'La suma no remunerativa solo paga obra social y FAECyS. Los básicos cambian con cada paritaria: la calculadora permite editarlos.')
  return T.lienzo({ alto: Math.round(ny + 116 + n.h + 60), slug: 'calculadora-empleados-de-comercio', titulo: 'Recibo de un empleado de comercio', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 236 SUNARP (plano, derechos)
function sunarp() {
  const T = tema('plano', { accent: '#FCA5A5', font: 'Segoe UI, Arial, sans-serif' })
  let s = T.tx(M, 186, 'Compra de un departamento de S/ 300,000', { size: 19, weight: 700, fill: '#FFFFFF' })
  const cw = (W - 2 * M - 20) / 2
  const caja = (x, tit, f, v, sub) => rect(x, 206, cw, 170, { rx: 14, fill: T.soft, stroke: T.line, sw: 2 }) + T.tx(x + 18, 242, tit, { size: 18, weight: 700, fill: T.accent }) + T.tx(x + 18, 276, f, { size: 15, family: mono, fill: '#FFFFFF' }) + T.tx(x + 18, 326, v, { size: 30, weight: 700, fill: '#FFFFFF' }) + T.tx(x + 18, 356, sub, { size: 13, fill: T.muted })
  s += caja(M, 'Derecho de calificación', '0.81 % × UIT (S/ 5,500)', 'S/ 44.55', 'fijo por cada acto')
  s += caja(M + cw + 20, 'Derecho de inscripción', '3 por mil × S/ 300,000', 'S/ 900.00', 'según el valor del acto')
  s += T.tx(M, 420, 'Total referencial', { size: 18, weight: 700, fill: '#FFFFFF' }) + T.tx(W - M, 420, 'S/ 944.55', { size: 28, weight: 700, anchor: 'end', fill: T.accent })
  const ty = 470
  s += T.tx(M, ty, 'Tasa de inscripción por tipo de acto', { size: 17, weight: 700, fill: '#FFFFFF' })
  const actos = [['Compraventa de inmueble', '3 por mil del precio'], ['Hipoteca', '1.5 por mil del monto'], ['Constitución de empresa', '3 por mil del capital']]
  actos.forEach(([a, b], i) => {
    const y = ty + 18 + i * 50
    s += rect(M, y, W - 2 * M, 42, { rx: 8, fill: T.soft, stroke: T.line, sw: 1.5 })
    s += T.tx(M + 14, y + 28, a, { size: 16, fill: '#FFFFFF' })
    s += T.tx(W - M - 14, y + 28, b, { size: 15, weight: 700, anchor: 'end', fill: T.accent })
  })
  const n = T.nota(ty + 18 + 3 * 50 + 14, 'Valores referenciales: el registrador hace la liquidación final. No incluyen los honorarios de la notaría.')
  return T.lienzo({ alto: Math.round(ty + 18 + 3 * 50 + 14 + n.h + 56), slug: 'calculadora-registral', titulo: 'Cuánto cuesta inscribir una propiedad en SUNARP', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 237 UPAO (banda azul marino, evaluaciones)
function upao() {
  const T = tema('banda', { accent: '#1E3A8A', soft: '#EFF6FF' })
  const ev = [['EP1', 'Evaluación de proceso 1', 20, 12], ['EVP', 'Evaluación parcial', 30, 9], ['EP2', 'Evaluación de proceso 2', 20, 11], ['EVF', 'Evaluación final', 30, null]]
  let s = T.tx(M, 188, 'Escala de 0 a 20 · se aprueba con 11 (10,5 redondea a 11)', { size: 18, weight: 700 })
  const ww = W - 2 * M
  let x = M
  ev.forEach(([c, n, p, nota]) => {
    const w = (p / 100) * ww
    s += rect(x, 210, w - 4, 120, { rx: 12, fill: nota === null ? '#FEF3C7' : T.soft, stroke: nota === null ? '#D97706' : '#BFDBFE', sw: 2 })
    s += T.tx(x + (w - 4) / 2, 240, `${c} · ${p} %`, { size: 16, weight: 700, anchor: 'middle', fill: T.accent })
    s += T.tx(x + (w - 4) / 2, 296, nota === null ? '¿?' : String(nota), { size: 36, weight: 700, anchor: 'middle', fill: nota === null ? '#B45309' : '#111827' })
    s += T.tx(x + (w - 4) / 2, 320, n, { size: 11, anchor: 'middle', fill: '#6B7280' })
    x += w
  })
  const ey = 370
  const pasos = [['Lo que ya llevas', '12 × 0,2 + 9 × 0,3 + 11 × 0,2 = 7,3'], ['Lo que falta para 10,5', '10,5 − 7,3 = 3,2'], ['Nota necesaria en el final', '3,2 ÷ 0,3 = 10,67 → al menos 11']]
  pasos.forEach(([a, b], i) => {
    const y = ey + i * 62
    s += rect(M, y, ww, 52, { rx: 10, fill: i === 2 ? '#DBEAFE' : '#F9FAFB', stroke: '#E5E7EB', sw: 1.5 })
    s += T.tx(M + 16, y + 32, a, { size: 16, weight: 700 })
    s += T.tx(W - M - 16, y + 32, b, { size: 17, anchor: 'end', family: mono, fill: i === 2 ? T.accent : '#111827' })
  })
  const n = T.nota(ey + 3 * 62 + 14, 'Pesos de la plantilla habitual de la UPAO; confirma los de tu curso en el sílabo.')
  return T.lienzo({ alto: Math.round(ey + 3 * 62 + 14 + n.h + 64), slug: 'calculadora-upao', titulo: 'Qué nota necesitas en el final de la UPAO', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 238 Libras a newtons (terminal, fuerza)
function newtons() {
  const T = tema('terminal', { accent: '#F472B6' })
  let s = T.tx(M, 184, '$ 1 lbf → N', { size: 20, fill: '#34D399' })
  s += T.tx(M, 224, '1 lbf = 0,45359237 kg × 9,80665 m/s² = 4,448 N', { size: 19 })
  const tabla = [['1 lbf', '4,448 N'], ['10 lbf', '44,48 N'], ['100 lbf', '444,8 N'], ['224,8 lbf', '1 kN'], ['1 N', '0,2248 lbf']]
  tabla.forEach(([a, b], i) => {
    const y = 254 + i * 50
    s += rect(M, y, W - 2 * M, 42, { rx: 8, fill: T.soft })
    s += T.tx(M + 16, y + 28, a, { size: 18, weight: 700, fill: T.accent })
    s += T.tx(W - M - 16, y + 28, b, { size: 18, weight: 700, anchor: 'end' })
  })
  const ty = 254 + 5 * 50 + 30
  s += T.tx(M, ty, '# lb (masa) no es lo mismo que lbf (fuerza)', { size: 17, fill: '#34D399' })
  const cw = (W - 2 * M - 16) / 2
  ;[['lb', 'cuánta materia hay', 'se mide en una báscula', '1 lb = 0,4536 kg'], ['lbf', 'con cuánta fuerza empuja o tira', 'peso de 1 lb en la gravedad estándar', '1 lbf = 4,448 N']].forEach(([a, b, c, d], i) => {
    const x = M + i * (cw + 16)
    s += rect(x, ty + 18, cw, 130, { rx: 10, fill: T.soft, stroke: T.line, sw: 1.5 })
    s += T.tx(x + 16, ty + 54, a, { size: 26, weight: 700, fill: T.accent })
    s += T.tx(x + 16, ty + 84, b, { size: 15 })
    s += T.tx(x + 16, ty + 106, c, { size: 13, fill: T.muted })
    s += T.tx(x + 16, ty + 132, d, { size: 15, weight: 700 })
  })
  const n = T.nota(ty + 178, '// en las especificaciones de un torque o una cuerda, «lb» suele significar lbf: conviértelo a newtons con 4,448.')
  return T.lienzo({ alto: Math.round(ty + 178 + n.h + 60), slug: 'convertidor-libras-a-newtons', titulo: 'De libras fuerza a newtons', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 239 SUTEBA (pastel celeste, recibo docente)
function suteba() {
  const T = tema('pastel', { accent: '#0369A1', soft: '#E0F2FE', bg: '#F7FCFF', ink: '#082F49', line: '#BAE6FD' })
  let s = T.tx(M, 186, 'Maestro/a de grado, jornada simple, 10 años de antigüedad', { size: 18, weight: 700 })
  s += T.tx(M, 210, 'Referencias de agosto de 2026', { size: 14, fill: T.muted })
  const filas = [['Básico (índice 1,1 × $349.693)', 384662.3, ''], ['Antigüedad (54 % del básico)', 207717.64, ''], ['Código 438', 278750, ''], ['Código 455', 141881, ''], ['Compensación provincial (sin descuentos)', 30709, ''], ['IPS (16 %)', -162081.75, 'd'], ['IOMA (4,8 %)', -48624.53, 'd']]
  filas.forEach(([a, v, t], i) => {
    const y = 228 + i * 46
    s += rect(M, y, W - 2 * M, 40, { rx: 8, fill: t ? '#FEF2F2' : i % 2 ? '#FFFFFF' : T.soft })
    s += T.tx(M + 14, y + 27, a, { size: 15 })
    s += T.tx(W - M - 14, y + 27, (v < 0 ? '− ' : '') + ars(Math.abs(v)), { size: 16, weight: 700, anchor: 'end', fill: t ? '#B91C1C' : T.ink, family: mono })
  })
  const ty = 228 + 7 * 46 + 12
  s += rect(M, ty, W - 2 * M, 70, { rx: 14, fill: T.accent })
  s += T.tx(M + 20, ty + 44, 'Neto aproximado', { size: 19, weight: 700, fill: '#FFFFFF' }) + T.tx(W - M - 20, ty + 46, ars(833013.67), { size: 28, weight: 700, anchor: 'end', fill: '#FFFFFF', family: mono })
  const ay = ty + 104
  s += T.tx(M, ay, 'Bonificación por antigüedad', { size: 17, weight: 700 })
  const ant = [['0', '21 %'], ['5', '33 %'], ['10', '54 %'], ['15', '74 %'], ['20', '105 %'], ['24+', '125 %']]
  const aw = (W - 2 * M - 50) / 6
  ant.forEach(([a, b], i) => {
    const x = M + i * (aw + 10)
    s += rect(x, ay + 14, aw, 64, { rx: 10, fill: T.soft })
    s += T.tx(x + aw / 2, ay + 38, `${a} años`, { size: 13, anchor: 'middle', fill: T.muted })
    s += T.tx(x + aw / 2, ay + 64, b, { size: 19, weight: 700, anchor: 'middle', fill: T.accent })
  })
  return T.lienzo({ alto: ay + 78 + 66, slug: 'calculadora-suteba', titulo: 'Cómo se arma el sueldo docente bonaerense', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 240 Liga 1 (oscuro verde césped, desempate)
function liga1() {
  const T = tema('oscuro', { accent: '#4ADE80', bg: '#06140C', soft: '#0D2416', line: '#1A3D27' })
  const filas = [['1', 'Deportivo Garcilaso', 22, '+12', 18], ['2', 'Universitario', 20, '+3', 19], ['3', 'Sporting Cristal', 19, '+10', 20], ['4', 'Alianza Atlético', 19, '+3', 20], ['5', 'Sport Huancayo', 19, '+3', 16]]
  let s = T.tx(M, 184, 'Torneo Clausura 2026 tras la fecha 10 de 17', { size: 18, weight: 700 })
  const cx = [M + 10, M + 60, M + 470, M + 570, W - M - 10]
  ;['#', 'Equipo', 'Pts', 'DG', 'GF'].forEach((c, i) => { s += T.tx(cx[i], 222, c, { size: 14, weight: 700, fill: T.muted, anchor: i >= 2 ? 'end' : 'start' }) })
  filas.forEach((f, i) => {
    const y = 234 + i * 50
    const empate = i >= 2
    s += rect(M, y, W - 2 * M, 42, { rx: 8, fill: empate ? '#123A22' : T.soft, stroke: empate ? T.accent : T.line, sw: empate ? 1.5 : 1 })
    f.forEach((v, k) => { s += T.tx(cx[k], y + 28, String(v), { size: 17, weight: k === 2 ? 700 : 400, anchor: k >= 2 ? 'end' : 'start', fill: k === 3 && empate ? T.accent : k === 4 && i >= 3 ? '#FDE047' : T.ink }) })
  })
  const ty = 234 + 5 * 50 + 26
  s += T.tx(M, ty, 'Tres equipos con 19 puntos: así se ordenan', { size: 17, weight: 700 })
  const reglas = [['1.º', 'Puntos', 'empatados a 19'], ['2.º', 'Diferencia de goles', 'Cristal (+10) queda tercero'], ['3.º', 'Goles a favor', 'Alianza Atlético (20) supera a Huancayo (16)']]
  reglas.forEach(([a, b, c], i) => {
    const y = ty + 18 + i * 52
    s += circle(M + 20, y + 20, 18, { fill: T.accent }) + T.tx(M + 20, y + 26, a, { size: 13, weight: 700, anchor: 'middle', fill: '#06140C' })
    s += T.tx(M + 52, y + 18, b, { size: 16, weight: 700 })
    s += T.tx(M + 52, y + 38, c, { size: 14, fill: T.muted })
  })
  const n = T.nota(ty + 18 + 3 * 52 + 30, 'Datos al 30 de septiembre de 2026. UTC tiene 5 puntos descontados por sanción: por eso su total es negativo.')
  return T.lienzo({ alto: Math.round(ty + 18 + 3 * 52 + 30 + n.h + 60), slug: 'simulador-liga-1', titulo: 'Cómo se desempata en la Liga 1', cuerpo: s + n.svg })
}

const pieza = (archivo, alt, fn) => ({ archivo, alt, dibujar: fn })

module.exports = [
  pieza('equivalencias-tallas-anillo', 'Tallas de anillo de la 5 a la 9 con su diámetro interior y equivalencias en Europa, España y Reino Unido', anillos),
  pieza('finiquito-renuncia-vs-despido-mexico', 'Comparación de finiquito por renuncia y por despido injustificado en México con el mismo salario y antigüedad', finiquitoMx),
  pieza('calculo-4x1000-cuenta-exenta', 'Cálculo del 4x1000 en Colombia con la parte exenta de 350 UVT y ejemplos de retiros', gmf),
  pieza('nota-necesaria-tres-cortes', 'Cálculo de la nota que se necesita en el tercer corte para aprobar con 3,0 en Colombia', notasCo),
  pieza('recibo-empleado-comercio-2026', 'Recibo de sueldo de un vendedor B de comercio con haberes, descuentos y neto', comercio),
  pieza('derechos-registrales-sunarp', 'Derechos de calificación e inscripción de SUNARP para la compra de un departamento', sunarp),
  pieza('nota-final-upao-ejemplo', 'Evaluaciones de la UPAO con sus pesos y cálculo de la nota necesaria en el examen final', upao),
  pieza('libras-fuerza-a-newtons', 'Equivalencias de libras fuerza a newtons y diferencia entre libra masa y libra fuerza', newtons),
  pieza('sueldo-docente-provincia-buenos-aires', 'Recibo de sueldo de un maestro de grado bonaerense con antigüedad, códigos, IPS e IOMA', suteba),
  pieza('desempate-tabla-liga-1', 'Tabla del Clausura 2026 de la Liga 1 y criterios de desempate con tres equipos igualados en puntos', liga1),
]
