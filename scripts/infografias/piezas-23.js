// Infografías del lote 23 (herramientas 221 a 230).
const { rect, circle } = require('../illustrations/kit')
const { tema, W, M } = require('./piezas-4').temas

const mono = 'Consolas, monospace'

// ─────────────────────────────────────────────────────────── 221 Impuesto a la renta Ecuador (papel, ejemplo)
function rentaEcuador() {
  const T = tema('papel', { accent: '#1E3A8A', soft: '#DBEAFE', bg: '#FFFFFF', line: '#E5E7EB' })
  let s = T.tx(M, 188, 'Sueldo de $2.500 al mes, sin cargas familiares', { size: 19, weight: 700, family: T.titulo })
  const pasos = [['Ingresos del año', '$30.000,00'], ['− Aporte personal al IESS (9,45 %)', '− $2.835,00'], ['= Base imponible', '$27.165,00'], ['Impuesto de la tabla: $1.412 + 15 % sobre $465', '$1.481,75'], ['− Rebaja: 18 % de $5.000 en gastos personales', '− $900,00'], ['= Impuesto a pagar en el año', '$581,75']]
  pasos.forEach(([a, b], i) => {
    const y = 210 + i * 46
    const fuerte = i === 2 || i === 5
    s += rect(M, y, W - 2 * M, 40, { rx: 8, fill: fuerte ? T.soft : '#FFFFFF', stroke: T.line, sw: 1.5 })
    s += T.tx(M + 14, y + 27, a, { size: 16, weight: fuerte ? 700 : 400 })
    s += T.tx(W - M - 14, y + 27, b, { size: 17, weight: 700, anchor: 'end', fill: fuerte ? T.accent : '#111827', family: mono })
  })
  const ty = 210 + 6 * 46 + 30
  s += T.tx(M, ty, 'Primeros tramos de la tabla de 2026', { size: 18, weight: 700, family: T.titulo })
  const tr = [['hasta $12.208', '0 %'], ['$12.208 – 15.549', '5 %'], ['$15.549 – 20.188', '10 %'], ['$20.188 – 26.700', '12 %'], ['$26.700 – 35.136', '15 %']]
  const cw = (W - 2 * M - 48) / 5
  tr.forEach(([a, b], i) => {
    const x = M + i * (cw + 12)
    s += rect(x, ty + 16, cw, 74, { rx: 12, fill: i === 4 ? T.accent : T.soft })
    s += T.tx(x + cw / 2, ty + 44, a, { size: 12, anchor: 'middle', fill: i === 4 ? '#FFFFFF' : T.muted })
    s += T.tx(x + cw / 2, ty + 76, b, { size: 22, weight: 700, anchor: 'middle', fill: i === 4 ? '#FFFFFF' : T.accent })
  })
  const n = T.nota(ty + 120, 'La rebaja por gastos personales es el 18 % de lo gastado, con un tope de 7 canastas básicas sin cargas (hasta 20 con cinco o más).')
  return T.lienzo({ alto: Math.round(ty + 120 + n.h + 60), slug: 'impuesto-renta-ecuador', titulo: 'Cómo se calcula el impuesto a la renta en Ecuador', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 222 Aguinaldo Uruguay (oscuro, semestres)
function aguinaldoUy() {
  const T = tema('oscuro', { accent: '#60A5FA', bg: '#0B1120', soft: '#162036', line: '#24324F' })
  const meses = ['Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov']
  const mw = (W - 2 * M) / 12
  let s = T.tx(M, 186, 'Dos aguinaldos al año, cada uno por un semestre', { size: 19, weight: 700 })
  meses.forEach((m, i) => {
    const c = i < 6 ? '#60A5FA' : '#F472B6'
    s += rect(M + i * mw + 2, 208, mw - 4, 64, { rx: 8, fill: c })
    s += T.tx(M + i * mw + mw / 2, 246, m, { size: 16, weight: 700, anchor: 'middle', fill: '#0B1120' })
  })
  s += T.tx(M + 3 * mw, 300, 'se cobra antes del 30 de junio', { size: 15, weight: 700, anchor: 'middle', fill: '#60A5FA' })
  s += T.tx(M + 9 * mw, 300, 'se cobra antes del 24 de diciembre', { size: 15, weight: 700, anchor: 'middle', fill: '#F472B6' })
  const fy = 340
  s += rect(M, fy, W - 2 * M, 84, { rx: 14, fill: T.soft, stroke: T.line, sw: 1.5 })
  s += T.tx(W / 2, fy + 38, 'Aguinaldo = total nominal del semestre ÷ 12', { size: 21, weight: 700, anchor: 'middle', family: mono })
  s += T.tx(W / 2, fy + 66, 'incluye horas extra, comisiones y otros pagos nominales', { size: 14, anchor: 'middle', fill: T.muted })
  const ey = fy + 114
  const ej = [['Sueldo fijo de $ 50.000', '6 × 50.000 ÷ 12', '$ 25.000'], ['Entraste en abril (3 meses)', '3 × 50.000 ÷ 12', '$ 12.500']]
  const cw = (W - 2 * M - 16) / 2
  ej.forEach(([a, b, c], i) => {
    const x = M + i * (cw + 16)
    s += rect(x, ey, cw, 110, { rx: 14, fill: T.soft })
    s += T.tx(x + 18, ey + 32, a, { size: 16, weight: 700 })
    s += T.tx(x + 18, ey + 58, b, { size: 14, fill: T.muted, family: mono })
    s += T.tx(x + 18, ey + 94, c, { size: 26, weight: 700, fill: T.accent })
  })
  return T.lienzo({ alto: ey + 110 + 70, slug: 'aguinaldo-uruguay', titulo: 'Cuándo y cuánto se cobra el aguinaldo en Uruguay', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 223 IRPF Uruguay (pizarra, franjas)
function irpfUy() {
  const T = tema('pizarra')
  const fr = [['hasta 7 BPC', '0 %', 0], ['7 a 10', '10 %', 10], ['10 a 15', '15 %', 15], ['15 a 30', '24 %', 24], ['30 a 50', '25 %', 25], ['50 a 75', '27 %', 27], ['75 a 115', '31 %', 31], ['más de 115', '36 %', 36]]
  let s = T.tx(M, 192, 'Franjas del IRPF en BPC mensuales (BPC 2026: $ 6.864)', { size: 21, family: T.titulo, fill: T.accent })
  const bw = (W - 2 * M) / fr.length
  const base = 420
  fr.forEach(([a, b, p], i) => {
    const h = 16 + (p / 36) * 170
    s += rect(M + i * bw + 4, base - h, bw - 8, h, { rx: 6, fill: i < 3 ? T.accent : T.soft, stroke: T.line, sw: 1.5 })
    s += T.tx(M + i * bw + bw / 2, base - h - 10, b, { size: 17, weight: 700, anchor: 'middle', family: T.titulo })
    s += T.tx(M + i * bw + bw / 2, base + 22, a, { size: 13, anchor: 'middle' })
  })
  const ey = base + 60
  s += T.tx(M, ey, 'Sueldo nominal de $ 80.000 (más de 10 BPC: la base sube un 6 %)', { size: 18, family: T.titulo })
  const pasos = [['Base: 80.000 × 1,06', '$ 84.800'], ['10 % de 48.048 a 68.640 + 15 % de 68.640 a 84.800', '$ 4.483'], ['− Deducciones: 14 % de aportes y FONASA', '− $ 2.195'], ['IRPF del mes', '$ 2.288']]
  pasos.forEach(([a, b], i) => {
    const y = ey + 18 + i * 46
    s += rect(M, y, W - 2 * M, 38, { rx: 8, fill: T.soft, stroke: i === 3 ? T.accent : T.line, sw: 1.5 })
    s += T.tx(M + 14, y + 26, a, { size: 15 })
    s += T.tx(W - M - 14, y + 26, b, { size: 17, weight: 700, anchor: 'end', fill: i === 3 ? T.accent : T.ink })
  })
  return T.lienzo({ alto: ey + 18 + 4 * 46 + 60, slug: 'irpf-uruguay', titulo: 'Cómo se calcula el IRPF en Uruguay', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 224 Amigo invisible (banda verde navideño, flujo)
function amigoInvisible() {
  const T = tema('banda', { accent: '#15803D', soft: '#F0FDF4' })
  const pasos = [['1', 'Escribe los participantes', 'Uno por línea; el organizador también puede jugar.'], ['2', 'Añade exclusiones', 'Parejas o personas que no deben regalarse entre sí.'], ['3', 'Sortea', 'Nadie se toca a sí mismo ni a alguien excluido.'], ['4', 'Reparte los enlaces', 'Cada persona recibe un enlace que solo muestra su resultado.']]
  let s = ''
  pasos.forEach(([n, a, b], i) => {
    const y = 186 + i * 96
    s += circle(M + 30, y + 34, 30, { fill: i % 2 ? '#B91C1C' : T.accent }) + T.tx(M + 30, y + 43, n, { size: 24, weight: 700, anchor: 'middle', fill: '#FFFFFF' })
    if (i < 3) s += `<line x1="${M + 30}" y1="${y + 64}" x2="${M + 30}" y2="${y + 96}" stroke="#D1D5DB" stroke-width="3" stroke-dasharray="4 4"/>`
    s += rect(M + 80, y, W - 2 * M - 80, 70, { rx: 12, fill: T.soft })
    s += T.tx(M + 100, y + 30, a, { size: 19, weight: 700, fill: T.accent })
    s += T.tx(M + 100, y + 54, b, { size: 15 })
  })
  const ey = 186 + 4 * 96 + 10
  s += rect(M, ey, W - 2 * M, 96, { rx: 14, fill: '#FEF2F2' })
  s += T.tx(M + 20, ey + 34, 'Ejemplo de exclusión', { size: 17, weight: 700, fill: '#B91C1C' })
  s += T.tx(M + 20, ey + 66, 'Ana - Luis   →   Ana nunca le regala a Luis ni Luis a Ana', { size: 17, family: mono })
  return T.lienzo({ alto: ey + 96 + 70, slug: 'amigo-invisible', titulo: 'Cómo organizar un amigo invisible en línea', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 225 Días para Navidad (pastel rojo, cuenta atrás)
function navidad() {
  const T = tema('pastel', { accent: '#B91C1C', soft: '#FEE2E2', bg: '#FFF8F8', ink: '#450A0A', line: '#FECACA' })
  const hitos = [['1 de octubre', 85], ['1 de noviembre', 54], ['1 de diciembre', 24], ['24 de diciembre', 1]]
  let s = T.tx(M, 186, 'Días que faltan para el 25 de diciembre desde…', { size: 19, weight: 700 })
  hitos.forEach(([a, d], i) => {
    const y = 208 + i * 70
    s += T.tx(M, y + 36, a, { size: 18, weight: 700 })
    const w = (d / 85) * (W - 2 * M - 300)
    s += rect(M + 200, y + 14, Math.max(w, 8), 34, { rx: 17, fill: i === 3 ? '#15803D' : T.accent })
    s += T.tx(M + 214 + Math.max(w, 8), y + 38, `${d} ${d === 1 ? 'día' : 'días'}`, { size: 18, weight: 700, fill: i === 3 ? '#15803D' : T.accent })
  })
  const ey = 208 + 4 * 70 + 20
  s += T.tx(M, ey, 'Otras cuentas regresivas', { size: 18, weight: 700 })
  const ev = [['🎄', 'Nochebuena', '24 dic'], ['🎆', 'Año Nuevo', '1 ene'], ['👑', 'Reyes', '6 ene'], ['❤️', 'San Valentín', '14 feb'], ['🎃', 'Halloween', '31 oct'], ['💀', 'Día de Muertos', '2 nov']]
  const cw = (W - 2 * M - 24) / 3
  ev.forEach(([e, a, b], i) => {
    const x = M + (i % 3) * (cw + 12)
    const y = ey + 18 + Math.floor(i / 3) * 76
    s += rect(x, y, cw, 64, { rx: 12, fill: T.soft })
    s += T.tx(x + 16, y + 40, e, { size: 24 })
    s += T.tx(x + 56, y + 28, a, { size: 16, weight: 700 })
    s += T.tx(x + 56, y + 50, b, { size: 14, fill: T.muted })
  })
  const n = T.nota(ey + 18 + 2 * 76 + 10, 'Las cifras de días son iguales todos los años: diciembre tiene 31 días y noviembre 30. La cuenta usa la hora de tu dispositivo.')
  return T.lienzo({ alto: Math.round(ey + 18 + 2 * 76 + 10 + n.h + 60), slug: 'dias-para-navidad', titulo: 'Cuántos días faltan para Navidad', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 226 Presupuesto de boda (cuaderno, reparto)
function boda() {
  const T = tema('cuaderno', { accent: '#9D174D' })
  const p = [['Banquete y bebidas', 40, '#BE185D'], ['Lugar', 12, '#DB2777'], ['Foto y video', 10, '#EC4899'], ['Vestido, traje y belleza', 8, '#F472B6'], ['Música', 7, '#A855F7'], ['Flores y decoración', 7, '#C084FC'], ['Anillos', 4, '#6366F1'], ['Ceremonia y trámites', 3, '#818CF8'], ['Invitaciones y recuerdos', 3, '#60A5FA'], ['Transporte', 2, '#38BDF8'], ['Imprevistos', 4, '#9CA3AF']]
  let s = T.tx(M, 190, 'Cómo se reparte un presupuesto típico', { size: 22, family: T.titulo })
  let x = M
  const ww = W - 2 * M
  p.forEach(([, v, c]) => { const w = (v / 100) * ww; s += rect(x, 210, w - 2, 50, { rx: 4, fill: c }); x += w })
  s += T.tx(M + 12, 242, '40 %', { size: 18, weight: 700, fill: '#FFFFFF' })
  const cw = (W - 2 * M - 16) / 2
  p.forEach(([a, v, c], i) => {
    const xx = M + (i % 2) * (cw + 16)
    const y = 290 + Math.floor(i / 2) * 40
    s += rect(xx, y, 16, 16, { rx: 3, fill: c })
    s += T.tx(xx + 26, y + 14, a, { size: 16, family: T.titulo })
    s += T.tx(xx + cw - 10, y + 14, `${v} %`, { size: 16, weight: 700, anchor: 'end' })
  })
  const ey = 290 + 6 * 40 + 10
  s += rect(M, ey, W - 2 * M, 100, { rx: 14, fill: '#FFFFFF', stroke: '#93C5FD', sw: 1.5 })
  s += T.tx(M + 20, ey + 36, 'Con $200,000 de presupuesto', { size: 19, weight: 700, family: T.titulo })
  s += T.tx(M + 20, ey + 70, 'banquete $80,000 · lugar $24,000 · fotos $20,000', { size: 17, family: T.titulo, fill: T.muted })
  return T.lienzo({ alto: ey + 100 + 70, slug: 'presupuesto-boda', titulo: 'En qué se va el dinero de una boda', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 227 Comprimir imagen (terminal, ajustes)
function comprimir() {
  const T = tema('terminal', { accent: '#60A5FA' })
  let s = T.tx(M, 184, '$ comprimir foto.jpg --formato webp --calidad 75 --ancho 1920', { size: 16, fill: '#34D399' })
  const ajustes = [['--formato webp', 'Recomendado: pesa menos que JPG con la misma calidad visual y admite transparencia.'], ['--formato jpg', 'Compatible con todo, incluso programas antiguos. Sin transparencia: el fondo queda blanco.'], ['--calidad 75', 'Entre 70 y 80 la diferencia apenas se ve; por debajo de 60 aparecen manchas.'], ['--ancho 1920', 'Las fotos de móvil miden 4000 px o más: reducirlas es lo que más peso ahorra.']]
  ajustes.forEach(([a, b], i) => {
    const y = 214 + i * 92
    s += rect(M, y, W - 2 * M, 80, { rx: 10, fill: T.soft })
    s += T.tx(M + 16, y + 30, a, { size: 18, weight: 700, fill: T.accent })
    const corte = b.lastIndexOf(' ', 66)
    const l1 = b.length > 66 ? b.slice(0, corte) : b
    const l2 = b.length > 66 ? b.slice(corte + 1) : ''
    s += T.tx(M + 16, y + 54, `# ${l1}`, { size: 14, fill: T.muted })
    if (l2) s += T.tx(M + 16, y + 72, `  ${l2}`, { size: 14, fill: T.muted })
  })
  const n = T.nota(214 + 4 * 92 + 16, '// al recomprimir se pierden los metadatos EXIF, incluida la ubicación GPS. Todo ocurre en tu navegador: las fotos no se suben.')
  return T.lienzo({ alto: Math.round(214 + 4 * 92 + 16 + n.h + 60), slug: 'comprimir-imagen', titulo: 'Qué hace cada ajuste al comprimir una imagen', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 228 Redimensionar (plano, proporciones)
function redimensionar() {
  const T = tema('plano', { accent: '#FDE68A', font: 'Segoe UI, Arial, sans-serif' })
  const formatos = [['Instagram cuadrada', 1080, 1080, '1:1'], ['Instagram vertical', 1080, 1350, '4:5'], ['Historia o reel', 1080, 1920, '9:16'], ['Miniatura de YouTube', 1280, 720, '16:9'], ['Facebook publicación', 1200, 630, '1,91:1'], ['Encabezado de X', 1500, 500, '3:1']]
  let s = T.tx(M, 186, 'Medidas en píxeles a la misma escala', { size: 18, weight: 700, fill: '#FFFFFF' })
  const esc = 0.11
  let x = M
  let y = 210
  let alto = 0
  formatos.forEach(([a, w, h, r], i) => {
    const pw = w * esc
    const ph = h * esc
    if (x + pw > W - M) { x = M; y += alto + 70; alto = 0 }
    s += rect(x, y, pw, ph, { rx: 4, fill: 'rgba(253,230,138,0.15)', stroke: T.accent, sw: 2 })
    s += T.tx(x + pw / 2, y + ph / 2 + 6, r, { size: 16, weight: 700, anchor: 'middle', fill: T.accent })
    s += T.tx(x, y + ph + 20, a, { size: 13, fill: '#FFFFFF' })
    s += T.tx(x, y + ph + 38, `${w} × ${h}`, { size: 13, fill: T.muted, family: mono })
    x += Math.max(pw, 150) + 26
    alto = Math.max(alto, ph)
    void i
  })
  const ty = y + alto + 80
  const n = T.nota(ty, 'Si la foto original tiene otra proporción, elige recortar para llenar el formato o ajustar con franjas; estirarla deforma la imagen.')
  return T.lienzo({ alto: Math.round(ty + n.h + 56), slug: 'redimensionar-imagen', titulo: 'Tamaños de imagen para cada red social', cuerpo: s + n.svg })
}

// ─────────────────────────────────────────────────────────── 229 Favicon (oscuro violeta, tamaños)
function favicon() {
  const T = tema('oscuro', { accent: '#A78BFA', bg: '#100B1F', soft: '#1C1533', line: '#2E2550' })
  const tam = [[16, 'pestaña'], [32, 'pestaña HD'], [48, 'Google'], [180, 'iPhone'], [192, 'Android']]
  let s = T.tx(M, 186, 'Los archivos que genera (16 a 48 px a tamaño real; 180 y 192 px al 60 %)', { size: 19, weight: 700 })
  let x = M
  tam.forEach(([real, u]) => {
    const t = real > 100 ? real * 0.6 : real
    const y = 210 + (116 - t)
    s += rect(x, y, t, t, { rx: Math.max(2, t * 0.18), fill: T.accent })
    s += T.tx(x + t / 2, y + t / 2 + 6, t >= 48 ? 'H' : '', { size: t * 0.5, weight: 700, anchor: 'middle', fill: '#100B1F' })
    s += T.tx(x + Math.max(t, 40) / 2, 360, `${real} px`, { size: 14, weight: 700, anchor: 'middle' })
    s += T.tx(x + Math.max(t, 40) / 2, 380, u, { size: 12, anchor: 'middle', fill: T.muted })
    x += Math.max(t, 40) + 34
  })
  s += T.tx(W - M, 250, '+ 512 px', { size: 18, weight: 700, anchor: 'end', fill: T.accent }) + T.tx(W - M, 272, 'pantalla de inicio y PWA', { size: 13, anchor: 'end', fill: T.muted })
  s += T.tx(W - M, 310, '+ favicon.ico', { size: 18, weight: 700, anchor: 'end', fill: T.accent }) + T.tx(W - M, 332, 'con 16, 32 y 48 px dentro', { size: 13, anchor: 'end', fill: T.muted })
  const cy = 430
  s += T.tx(M, cy, 'Pega esto dentro del <head> de tu web', { size: 17, weight: 700 })
  const cod = ['<link rel="icon" href="/favicon.ico" sizes="48x48">', '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">', '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">']
  s += rect(M, cy + 16, W - 2 * M, cod.length * 28 + 24, { rx: 10, fill: T.soft, stroke: T.line, sw: 1.5 })
  cod.forEach((c, i) => { s += T.tx(M + 14, cy + 46 + i * 28, c, { size: 13, family: mono, fill: '#C4B5FD' }) })
  return T.lienzo({ alto: cy + 16 + cod.length * 28 + 24 + 70, slug: 'generador-favicon', titulo: 'Qué tamaños de favicon necesita una web', cuerpo: s })
}

// ─────────────────────────────────────────────────────────── 230 Excusas (pizarra, creíble vs absurda)
function excusas() {
  const T = tema('pizarra')
  const casos = [['💼 Llegar tarde al trabajo', 'Se me descargó el celular y no sonó la alarma.', 'Un pato cruzó la calle con sus diez patitos y nadie se atrevió a interrumpirlos.'], ['📚 No hice la tarea', 'Guardé el archivo en la computadora de mi casa y olvidé mandármelo.', 'Mi perro se comió la tarea… y luego pidió más.']]
  let s = T.tx(M, 192, 'Cinco situaciones, dos tonos', { size: 24, family: T.titulo, fill: T.accent })
  let y = 216
  casos.forEach(([a, b, c]) => {
    s += T.tx(M, y + 24, a, { size: 20, family: T.titulo })
    const cw = (W - 2 * M - 16) / 2
    ;[['Creíble', b, '#86EFAC'], ['Absurda', c, '#FCA5A5']].forEach(([t, txt, col], k) => {
      const x = M + k * (cw + 16)
      s += rect(x, y + 40, cw, 120, { rx: 12, fill: T.soft, stroke: col, sw: 2 })
      s += T.tx(x + 16, y + 68, t, { size: 15, weight: 700, fill: col })
      const palabras = txt.split(' ')
      let linea = ''
      let ly = y + 96
      palabras.forEach((p) => {
        if ((linea + ' ' + p).length > 34) { s += T.tx(x + 16, ly, linea.trim(), { size: 16, family: T.titulo }); ly += 22; linea = '' }
        linea += ' ' + p
      })
      s += T.tx(x + 16, ly, linea.trim(), { size: 16, family: T.titulo })
    })
    y += 186
  })
  s += T.tx(M, y + 20, 'Además: cancelar una cita, no ir a una fiesta y no ir al gimnasio.', { size: 17, family: T.titulo })
  const n = T.nota(y + 50, 'Para usarlas con humor. En el trabajo y en la escuela, una explicación honesta suele funcionar mejor que la excusa perfecta.')
  return T.lienzo({ alto: Math.round(y + 50 + n.h + 60), slug: 'generador-excusas', titulo: 'Excusas creíbles y excusas absurdas', cuerpo: s + n.svg })
}

const pieza = (archivo, alt, fn) => ({ archivo, alt, dibujar: fn })

module.exports = [
  pieza('calculo-impuesto-renta-ecuador', 'Ejemplo de cálculo del impuesto a la renta en Ecuador con aporte al IESS, tabla y rebaja por gastos personales', rentaEcuador),
  pieza('semestres-aguinaldo-uruguay', 'Semestres y fechas de cobro del aguinaldo en Uruguay con fórmula y ejemplos', aguinaldoUy),
  pieza('franjas-irpf-uruguay-2026', 'Franjas del IRPF uruguayo en BPC y ejemplo con un sueldo nominal de 80.000 pesos', irpfUy),
  pieza('pasos-amigo-invisible', 'Cuatro pasos para organizar un amigo invisible en línea con exclusiones y enlaces individuales', amigoInvisible),
  pieza('cuenta-regresiva-navidad', 'Días que faltan para Navidad desde distintas fechas y otras cuentas regresivas', navidad),
  pieza('reparto-presupuesto-boda', 'Reparto típico del presupuesto de una boda por partidas en porcentaje', boda),
  pieza('ajustes-comprimir-imagen', 'Qué hace cada ajuste al comprimir una imagen: formato, calidad y ancho máximo', comprimir),
  pieza('tamanos-imagen-redes-sociales', 'Proporciones y tamaños en píxeles de imágenes para Instagram, YouTube, Facebook y X', redimensionar),
  pieza('tamanos-favicon-html', 'Tamaños de favicon de 16 a 512 píxeles y código HTML para insertarlos', favicon),
  pieza('excusas-creibles-absurdas', 'Ejemplos de excusas creíbles y absurdas para llegar tarde y para no hacer la tarea', excusas),
]
