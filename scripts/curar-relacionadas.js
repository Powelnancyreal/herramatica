// Reescribe relatedTools en data/tools.json para que cada herramienta enlace como máximo a 8 herramientas
// del mismo tema. Uso: node scripts/curar-relacionadas.js [--dry-run]
// Al añadir herramientas nuevas, asígnales temas (y país si aplica) en TEMAS y vuelve a ejecutarlo.

const fs = require('fs')
const path = require('path')

const MAX = 8
const MIN = 4

// slug: [temas por orden de importancia, país opcional como 'MX', 'ES', ...]
const TEMAS = {
  'texto-invisible': ['redes', 'texto'],
  'calculadora-edad': ['fechas'],
  'calcular-rfc': ['identidad', 'MX'],
  'calcular-imc': ['salud', 'peso'],
  'calculadora-alicia': ['mates', 'escuela'],
  'generador-qr': ['codigos', 'imagen'],
  'calculadora-horas': ['tiempo', 'fechas'],
  'calculadora-cientifica': ['mates'],
  'calculadora-finiquito': ['laboral', 'despido', 'ES'],
  'calculadora-isr': ['impuestos', 'laboral', 'MX'],
  'calcular-aguinaldo': ['laboral', 'MX'],
  'calculadora-dias': ['fechas'],
  'calcular-iva': ['comercio', 'impuestos'],
  'calculo-mental': ['juegos', 'mates', 'escuela'],
  'calcular-curp': ['identidad', 'MX'],
  'calculadora-porcentaje': ['comercio', 'mates'],
  'convertidor-moneda': ['moneda'],
  'generador-contrasenas': ['seguridad', 'dev'],
  'contador-palabras': ['texto'],
  'calculadora-propinas': ['comercio', 'gastos'],
  'calculadora-prestamo': ['credito', 'finanzas'],
  'convertidor-unidades': ['unidades'],
  'generador-nombres': ['nombres'],
  'convertidor-imagenes': ['imagen'],
  'imagenes-a-pdf': ['imagen'],
  'convertidor-numeros-a-letras': ['texto', 'mates'],
  'convertidor-fracciones': ['mates', 'escuela'],
  'convertidor-mayusculas-minusculas': ['texto'],
  'convertidor-binario': ['dev', 'mates'],
  'calculadora-irpf': ['impuestos', 'laboral', 'ES'],
  'calcular-hipoteca': ['credito', 'vivienda', 'ES'],
  'calcular-letra-dni': ['identidad', 'ES'],
  'calculo-pension-jubilacion': ['pension', 'ES'],
  'calculadora-apiretal': ['salud', 'bebe'],
  'calculadora-del-amor': ['juegos', 'azar'],
  'calcular-nit': ['identidad', 'CO'],
  'calcular-cuil': ['identidad', 'AR'],
  'calcular-rut': ['identidad', 'CL'],
  'calcular-area-circulo': ['geometria', 'mates'],
  'calcular-hexadecimal-a-decimal': ['dev', 'mates'],
  'calcular-velocidad-distancia-tiempo': ['movimiento', 'mates'],
  'calcular-gasolina': ['movimiento', 'gastos'],
  'calcular-volumen-cilindro': ['geometria', 'mates'],
  'calcular-ritmo': ['movimiento', 'deporte'],
  'cronometro-online': ['tiempo', 'deporte'],
  'palabras-al-reves': ['texto'],
  'celsius-a-fahrenheit': ['unidades', 'temperatura'],
  'bar-a-psi': ['unidades'],
  'medidas-de-cocina': ['cocina', 'unidades'],
  'tipografia-para-instagram': ['redes', 'texto'],
  'cm-a-pulgadas': ['unidades', 'longitud'],
  'arroba-a-kilos': ['unidades', 'peso-u'],
  'calculadora-tiempo-lectura': ['texto'],
  'calcular-indemnizacion-despido': ['laboral', 'despido', 'AR'],
  'calcular-sac-argentina': ['laboral', 'AR'],
  'calculadora-alquiler-argentina': ['vivienda', 'AR'],
  'calculadora-plazo-fijo': ['inversion', 'finanzas', 'AR'],
  'calculadora-interes-compuesto': ['inversion', 'finanzas'],
  'calculadora-sueldo-neto-argentina': ['laboral', 'impuestos', 'AR'],
  'calculadora-area': ['geometria', 'mates'],
  'calculadora-volumen': ['geometria', 'mates'],
  'calculadora-calculos-combinados': ['mates', 'escuela'],
  'calculadora-resistencias': ['electronica', 'dev'],
  'calculadora-calorias': ['salud', 'peso'],
  'calculadora-embarazo': ['salud', 'bebe'],
  'calculadora-peso-ideal': ['salud', 'peso'],
  'calculadora-ciclos-sueno': ['salud', 'tiempo'],
  'calculadora-de-escalas': ['unidades', 'geometria'],
  'sopa-de-letras': ['juegos', 'palabras'],
  'generador-de-letras-grandes': ['texto', 'redes'],
  'generador-codigo-de-barras': ['codigos', 'imagen'],
  'generador-de-crucigramas': ['juegos', 'palabras'],
  'generador-de-nombres-para-free-fire': ['nombres', 'redes'],
  'generador-de-link-de-whatsapp': ['redes', 'marketing'],
  'calculadora-engagement-instagram': ['redes', 'marketing'],
  'calculador-de-horarios': ['tiempo', 'escuela'],
  'hexadecimal-a-texto': ['dev', 'texto'],
  'ruleta-aleatoria-online': ['azar', 'juegos'],
  'calculadora-promedio-ponderado': ['escuela', 'mates'],
  'calculadora-cts-peru': ['laboral', 'PE'],
  'calcular-gratificacion-peru': ['laboral', 'PE'],
  'calculadora-de-igv': ['comercio', 'impuestos', 'PE'],
  'calcular-detraccion': ['impuestos', 'comercio', 'PE'],
  'calculadora-de-matrices': ['mates', 'algebra'],
  'calculadora-de-ecuaciones': ['mates', 'algebra'],
  'calculadora-precios-influencers-tiktok': ['redes', 'marketing'],
  'calculadora-ip': ['dev', 'redes-ip'],
  'calculadora-regla-de-tres': ['mates', 'comercio'],
  'calculadora-de-pendiente': ['mates', 'algebra'],
  'calculadora-derivadas-integrales': ['mates', 'algebra'],
  'calculadora-ldl': ['salud', 'clinica'],
  'calculadora-pafi': ['salud', 'clinica'],
  'indice-de-barthel': ['salud', 'clinica'],
  'calculadora-liquidacion-laboral-colombia': ['laboral', 'despido', 'CO'],
  'calculadora-seguridad-social-colombia': ['laboral', 'pension', 'CO'],
  'calculadora-cdt': ['inversion', 'finanzas', 'CO'],
  'calcular-prima-vacacional': ['laboral', 'vacaciones', 'MX'],
  'calcular-vacaciones': ['laboral', 'vacaciones', 'MX'],
  'calcular-ptu': ['laboral', 'MX'],
  'calcular-salario-diario-integrado': ['laboral', 'MX'],
  'calculadora-cat': ['credito', 'finanzas', 'MX'],
  'calculadora-nomina': ['laboral', 'impuestos', 'MX'],
  'calcular-descuento': ['comercio', 'gastos'],
  'calculadora-ahorro': ['finanzas', 'gastos'],
  'calculadora-roi': ['inversion', 'comercio'],
  'calculadora-nota-necesaria': ['escuela'],
  'calculadora-dias-habiles': ['fechas', 'laboral'],
  'calcular-fecha-futura': ['fechas'],
  'validador-iban': ['identidad', 'finanzas'],
  'calculadora-ovulacion': ['salud', 'bebe'],
  'calculadora-tmb': ['salud', 'peso'],
  'calculadora-grasa-corporal': ['salud', 'peso'],
  'calculadora-agua-diaria': ['salud'],
  'formateador-json': ['dev'],
  'codificador-base64': ['dev'],
  'generador-uuid': ['dev'],
  'probador-regex': ['dev', 'texto'],
  'generador-hash': ['dev', 'seguridad'],
  'generador-lorem-ipsum': ['texto', 'dev'],
  'validador-email': ['dev', 'texto'],
  'contador-caracteres': ['texto'],
  'sorteo-online': ['azar'],
  'generador-numeros-aleatorios': ['azar'],
  'cara-o-cruz': ['azar', 'juegos'],
  'temporizador-online': ['tiempo'],
  'conversor-criptomonedas': ['moneda', 'inversion'],
  'conversor-zona-horaria': ['tiempo', 'fechas'],
  'kilos-a-libras': ['unidades', 'peso-u'],
  'convertidor-tallas': ['tallas', 'unidades'],
  'calcular-subsidio-empleo': ['laboral', 'impuestos', 'MX'],
  'calcular-cuota-imss': ['laboral', 'pension', 'MX'],
  'salarios-minimos-2026': ['laboral', 'MX'],
  'pension-imss-modalidad-40': ['pension', 'MX'],
  'semanas-cotizadas-imss': ['pension', 'MX'],
  'calcular-horas-extras': ['laboral', 'MX'],
  'comparador-afore': ['pension', 'inversion', 'MX'],
  'calcular-isr-aguinaldo': ['impuestos', 'laboral', 'MX'],
  'dolar-a-peso-mexicano': ['moneda', 'MX'],
  'tabla-de-amortizacion': ['credito', 'finanzas'],
  'calculadora-cetes': ['inversion', 'finanzas', 'MX'],
  'simulador-credito-automotriz': ['credito', 'finanzas'],
  'calculadora-interes-simple': ['inversion', 'credito', 'finanzas'],
  'presupuesto-mensual': ['gastos', 'finanzas'],
  'plan-pago-deudas': ['credito', 'gastos', 'finanzas'],
  'calculadora-comision-ventas': ['comercio'],
  'comparador-precios': ['comercio', 'gastos'],
  'libras-a-kilos': ['unidades', 'peso-u'],
  'fahrenheit-a-celsius': ['unidades', 'temperatura'],
  'onzas-a-gramos': ['unidades', 'cocina', 'peso-u'],
  'tazas-a-ml': ['cocina', 'unidades'],
  'millas-a-kilometros': ['unidades', 'longitud'],
  'pies-a-metros': ['unidades', 'longitud'],
  'litros-a-galones': ['unidades'],
  'validar-curp': ['identidad', 'MX'],
  'dividir-cuenta': ['gastos', 'comercio'],
  'hora-militar': ['tiempo'],
  'calculadora-promedio': ['escuela', 'mates'],
  'calculadora-fracciones': ['mates', 'escuela'],
  'calculadora-mcd-mcm': ['mates', 'escuela'],
  'calculadora-pitagoras': ['geometria', 'mates'],
  'calculadora-factorial': ['mates', 'algebra'],
  'calculadora-desviacion-estandar': ['mates', 'estadistica'],
  'tablas-de-multiplicar': ['escuela', 'mates'],
  'edad-de-mi-perro': ['fechas', 'mascotas'],
  'decodificador-jwt': ['dev', 'seguridad'],
  'conversor-csv-json': ['dev'],
  'codificador-url': ['dev'],
  'minificador-codigo': ['dev'],
  'generador-datos-prueba': ['dev'],
  'generador-paleta-colores': ['color', 'imagen'],
  'selector-de-color': ['color', 'imagen'],
  'conversor-hex-rgb': ['color', 'dev'],
  'imagen-a-base64': ['imagen', 'dev'],
  'generador-nombres-bebe': ['nombres', 'bebe'],
  'generador-apodos': ['nombres', 'redes'],
  'generador-nombres-empresa': ['nombres', 'marketing'],
  'piedra-papel-tijera': ['juegos', 'azar'],
  'generador-equipos': ['azar', 'juegos'],
  'tombola-online': ['azar', 'juegos'],
  'verdad-o-reto': ['juegos', 'fiesta'],
  'ideas-para-historias': ['escritura', 'texto'],
  'generador-hashtags': ['redes', 'marketing'],
  'generador-bio-instagram': ['redes', 'marketing'],
  'generador-firma-email': ['marketing', 'redes'],
  'generador-esloganes': ['marketing', 'escritura'],
  'generador-utm': ['marketing', 'dev'],
  'markdown-a-html': ['dev', 'texto'],
  'calcular-paro': ['laboral', 'despido', 'ES'],
  'cuota-autonomo': ['impuestos', 'laboral', 'ES'],
  'calcular-plusvalia': ['vivienda', 'impuestos', 'ES'],
  'nota-de-corte': ['escuela', 'ES'],
  'calculadora-factura-luz': ['gastos', 'vivienda', 'ecologia', 'ES'],
  'jubilacion-espana': ['pension', 'ES'],
  'impuesto-sucesiones': ['vivienda', 'impuestos', 'ES'],
  'cuanto-cuesta-reformar': ['vivienda', 'gastos', 'ES'],
  'huella-de-carbono': ['ecologia', 'movimiento'],
  'dolar-blue': ['moneda', 'AR'],
  'monotributo': ['impuestos', 'laboral', 'AR'],
  'calculadora-inflacion': ['finanzas', 'gastos', 'AR'],
  'preaviso-laboral': ['laboral', 'despido', 'AR'],
  'sueldo-liquido-chile': ['laboral', 'impuestos', 'CL'],
  'finiquito-chile': ['laboral', 'despido', 'CL'],
  'uf-a-pesos': ['moneda', 'CL'],
  'utm-a-pesos': ['moneda', 'impuestos', 'CL'],
  'dividendo-hipotecario': ['credito', 'vivienda', 'CL'],
  'gratificacion-chile': ['laboral', 'CL'],
  'cotizacion-afp': ['pension', 'laboral', 'CL'],
  'puntaje-paes': ['escuela', 'CL'],
  'prima-de-servicios': ['laboral', 'CO'],
  'calcular-cesantias': ['laboral', 'CO'],
  'intereses-cesantias': ['laboral', 'CO'],
  'retencion-en-la-fuente': ['impuestos', 'laboral', 'CO'],
  'vacaciones-colombia': ['laboral', 'vacaciones', 'CO'],
  'renta-quinta-categoria': ['impuestos', 'laboral', 'PE'],
  'uit-a-soles': ['moneda', 'impuestos', 'PE'],
  'vacaciones-peru': ['laboral', 'vacaciones', 'PE'],
  'afp-vs-onp': ['pension', 'PE'],
  'decimo-tercer-sueldo': ['laboral', 'EC'],
  'decimo-cuarto-sueldo': ['laboral', 'EC'],
  'fondos-de-reserva': ['laboral', 'pension', 'EC'],
  'impuesto-renta-ecuador': ['impuestos', 'laboral', 'EC'],
  'aguinaldo-uruguay': ['laboral', 'UY'],
  'irpf-uruguay': ['impuestos', 'laboral', 'UY'],
  'amigo-invisible': ['azar', 'fiesta'],
  'dias-para-navidad': ['fechas', 'fiesta'],
  'presupuesto-boda': ['gastos', 'fiesta'],
  'comprimir-imagen': ['imagen'],
  'redimensionar-imagen': ['imagen'],
  'generador-favicon': ['imagen', 'dev'],
  'generador-excusas': ['escritura', 'juegos'],
  'tallas-de-anillo': ['tallas', 'unidades'],
}

// Listas fijadas a mano: se respetan tal cual.
const FIJAS = {
  'calculadora-porcentaje': ['calcular-iva', 'calcular-descuento', 'calculadora-propinas', 'calculadora-roi', 'calculadora-comision-ventas', 'dividir-cuenta', 'calculadora-prestamo', 'calculadora-nota-necesaria'],
}

const PAISES = new Set(['MX', 'ES', 'AR', 'CO', 'PE', 'CL', 'EC', 'UY'])
const info = (slug) => {
  const t = TEMAS[slug]
  return { temas: t.filter((x) => !PAISES.has(x)), pais: t.find((x) => PAISES.has(x)) || null }
}

// Afinidad entre dos herramientas: tema principal compartido pesa más que uno secundario;
// el mismo país suma, y un país distinto en temas locales (laboral, impuestos...) resta.
function afinidad(a, b, { relajada = false } = {}) {
  const A = info(a)
  const B = info(b)
  let s = 0
  A.temas.forEach((t, i) => {
    const j = B.temas.indexOf(t)
    if (j !== -1) s += (i === 0 ? 4 : 2) + (j === 0 ? 2 : 0)
  })
  const mismoPais = A.pais && A.pais === B.pais
  // Dentro de un mismo país, nómina, impuestos y pensiones forman un solo bloque aunque no compartan tema.
  if (s === 0) return mismoPais && BLOQUE_PAIS.has(A.temas[0]) && BLOQUE_PAIS.has(B.temas[0]) ? 4 : 0
  if (A.pais && B.pais) s += mismoPais ? 4 : !relajada && SOLO_SU_PAIS.has(A.temas[0]) ? -6 : -1
  else if (A.pais || B.pais) s -= 1
  return s
}
const BLOQUE_PAIS = new Set(['laboral', 'impuestos', 'pension', 'despido', 'vacaciones', 'moneda'])
// Temas cuya ley cambia por país: una herramienta de otro país casi nunca le sirve al mismo usuario.
const SOLO_SU_PAIS = new Set(['laboral', 'impuestos', 'pension', 'despido', 'vacaciones'])

function main() {
  const dryRun = process.argv.includes('--dry-run')
  const file = path.join(__dirname, '..', 'data', 'tools.json')
  const tools = JSON.parse(fs.readFileSync(file, 'utf8'))
  const faltan = tools.filter((t) => !TEMAS[t.slug]).map((t) => t.slug)
  if (faltan.length) throw new Error(`Faltan temas para: ${faltan.join(', ')}`)

  const UMBRAL = 4
  let cambios = 0
  for (const t of tools) {
    const antes = t.relatedTools || []
    let nueva
    if (FIJAS[t.slug]) {
      nueva = FIJAS[t.slug]
    } else {
      const posicion = new Map(antes.map((s, i) => [s, i]))
      // Candidatas: todas las herramientas afines; las que ya estaban elegidas a mano ganan en empate.
      nueva = tools
        .filter((o) => o.slug !== t.slug)
        .map((o) => ({ slug: o.slug, base: afinidad(t.slug, o.slug) }))
        .filter((o) => o.base >= UMBRAL)
        .map((o) => ({ ...o, s: o.base + (posicion.has(o.slug) ? 1.5 : 0) }))
        .sort((x, y) => y.s - x.s || (posicion.get(x.slug) ?? 99) - (posicion.get(y.slug) ?? 99))
        .slice(0, MAX)
        .map((o) => o.slug)
      if (nueva.length < MIN) {
        // Tema muy pequeño (p. ej. un país con dos herramientas): completa con las más cercanas, ya sin castigar
        // otro país, y prefiriendo las que ya estaban elegidas a mano.
        const extra = tools
          .filter((o) => o.slug !== t.slug && !nueva.includes(o.slug))
          .map((o) => ({ slug: o.slug, s: afinidad(t.slug, o.slug, { relajada: true }) }))
          .filter((o) => o.s > 0)
          .map((o) => ({ ...o, s: o.s + (posicion.has(o.slug) ? 1.5 : 0) }))
          .sort((x, y) => y.s - x.s)
        nueva = nueva.concat(extra.slice(0, MIN - nueva.length).map((o) => o.slug))
      }
    }
    if (JSON.stringify(nueva) !== JSON.stringify(antes)) cambios++
    t.relatedTools = nueva
  }

  const dist = {}
  tools.forEach((t) => { dist[t.relatedTools.length] = (dist[t.relatedTools.length] || 0) + 1 })
  console.log(`${cambios} herramientas cambiadas. Relacionadas por herramienta:`, dist)
  if (!dryRun) fs.writeFileSync(file, JSON.stringify(tools, null, 2) + '\n')
}

module.exports = { TEMAS, afinidad }
if (require.main === module) main()
