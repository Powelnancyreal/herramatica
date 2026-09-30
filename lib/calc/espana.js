// Cálculos de España. Valores verificados para 2026.

// ── Prestación contributiva por desempleo (LGSS arts. 269-270, reforma del RDL 2/2024) ──
export const IPREM_MENSUAL_2026 = 600

export function duracionParo(diasCotizados) {
  if (diasCotizados < 360) return 0
  const tramos = [[2160, 720], [1980, 660], [1800, 600], [1620, 540], [1440, 480], [1260, 420], [1080, 360], [900, 300], [720, 240], [540, 180], [360, 120]]
  return tramos.find(([d]) => diasCotizados >= d)[1]
}

export function calcularParo({ baseMensual, diasCotizados, hijos = 0, iprem = IPREM_MENSUAL_2026 }) {
  const brMensual = baseMensual // base reguladora: promedio de las bases de los últimos 180 días
  const ipremConPagas = iprem * (7 / 6)
  const minimo = (hijos > 0 ? 1.07 : 0.8) * ipremConPagas
  const maximo = (hijos === 0 ? 1.75 : hijos === 1 ? 2 : 2.25) * ipremConPagas
  const limitar = (x) => Math.min(maximo, Math.max(minimo, x))
  const dias = duracionParo(diasCotizados)
  // 70% los primeros 180 días, 60% del día 181 al 360 y 50% desde el día 361.
  const tramos = [
    { desde: 1, hasta: Math.min(180, dias), pct: 70 },
    { desde: 181, hasta: Math.min(360, dias), pct: 60 },
    { desde: 361, hasta: dias, pct: 50 },
  ]
    .filter((t) => t.hasta >= t.desde)
    .map((t) => ({ ...t, meses: (t.hasta - t.desde + 1) / 30, mensual: limitar((brMensual * t.pct) / 100) }))
  const total = tramos.reduce((s, t) => s + t.mensual * t.meses, 0)
  return { dias, tramos, minimo, maximo, total }
}

// ── Cuota de autónomos 2026: bases congeladas respecto a 2025 (RDL 16/2025) ──
export const TIPO_AUTONOMOS_2026 = 31.5
export const TRAMOS_AUTONOMOS = [
  { hasta: 670, baseMin: 653.59, baseMax: 718.94, tabla: 'Reducida 1' },
  { hasta: 900, baseMin: 718.95, baseMax: 900, tabla: 'Reducida 2' },
  { hasta: 1166.7, baseMin: 849.67, baseMax: 1166.7, tabla: 'Reducida 3' },
  { hasta: 1300, baseMin: 950.98, baseMax: 1300, tabla: 'General 1' },
  { hasta: 1500, baseMin: 960.78, baseMax: 1500, tabla: 'General 2' },
  { hasta: 1700, baseMin: 960.78, baseMax: 1700, tabla: 'General 3' },
  { hasta: 1850, baseMin: 1143.79, baseMax: 1850, tabla: 'General 4' },
  { hasta: 2030, baseMin: 1209.15, baseMax: 2030, tabla: 'General 5' },
  { hasta: 2330, baseMin: 1274.51, baseMax: 2330, tabla: 'General 6' },
  { hasta: 2760, baseMin: 1356.21, baseMax: 2760, tabla: 'General 7' },
  { hasta: 3190, baseMin: 1437.91, baseMax: 3190, tabla: 'General 8' },
  { hasta: 3620, baseMin: 1519.61, baseMax: 3620, tabla: 'General 9' },
  { hasta: 4050, baseMin: 1601.31, baseMax: 4050, tabla: 'General 10' },
  { hasta: 6000, baseMin: 1732.03, baseMax: 5101.2, tabla: 'General 11' },
  { hasta: Infinity, baseMin: 1928.1, baseMax: 5101.2, tabla: 'General 12' },
]

export function tramoAutonomo(rendimientoMensual) {
  const i = TRAMOS_AUTONOMOS.findIndex((t) => rendimientoMensual <= t.hasta)
  return { indice: i, ...TRAMOS_AUTONOMOS[i] }
}

// ── Plusvalía municipal (TRLRHL art. 107, coeficientes máximos del RDL 8/2023, vigentes en 2026) ──
export const COEFICIENTES_PLUSVALIA = [0.15, 0.15, 0.14, 0.15, 0.16, 0.18, 0.19, 0.2, 0.19, 0.15, 0.12, 0.1, 0.09, 0.09, 0.09, 0.09, 0.1, 0.13, 0.17, 0.23, 0.4]
export const etiquetaCoeficiente = (i) => (i === 0 ? 'Menos de 1 año' : i === 20 ? '20 años o más' : `${i} ${i === 1 ? 'año' : 'años'}`)

export function calcularPlusvalia({ catastralSuelo, catastralTotal, anios, coeficiente, tipo, precioCompra, precioVenta }) {
  const objetiva = catastralSuelo * coeficiente
  const ganancia = precioVenta - precioCompra
  const proporcionSuelo = catastralTotal > 0 ? catastralSuelo / catastralTotal : 0
  const real = ganancia > 0 ? ganancia * proporcionSuelo : 0
  const cuotaObjetiva = (objetiva * tipo) / 100
  const cuotaReal = (real * tipo) / 100
  return { objetiva, real, cuotaObjetiva, cuotaReal, ganancia, proporcionSuelo, noSujeta: ganancia <= 0, anios }
}

// ── Nota de acceso a la universidad (PAU/EBAU) ──
export function notaAcceso({ bachillerato, faseGeneral, especificas = [] }) {
  const acceso = 0.6 * bachillerato + 0.4 * faseGeneral
  const aptas = especificas.filter((e) => e.nota >= 5).map((e) => ({ ...e, puntos: e.nota * e.ponderacion }))
  const mejores = aptas.sort((a, b) => b.puntos - a.puntos).slice(0, 2)
  const admision = acceso + mejores.reduce((s, e) => s + e.puntos, 0)
  return { acceso, admision, mejores, aprobada: acceso >= 5 && faseGeneral >= 4 }
}

// ── Factura de la luz: impuesto eléctrico 5.11269632% (tipo general) e IVA 21% ──
export const IMPUESTO_ELECTRICO = 0.0511269632

// ── Edad de jubilación ordinaria (LGSS art. 205 y disposición transitoria 7.ª) ──
export const CALENDARIO_JUBILACION = {
  2024: { carrera: [38, 0], edad: [66, 6] },
  2025: { carrera: [38, 3], edad: [66, 8] },
  2026: { carrera: [38, 3], edad: [66, 10] },
  2027: { carrera: [38, 6], edad: [67, 0] },
}

export function edadOrdinaria(anio, mesesCotizados) {
  const c = CALENDARIO_JUBILACION[Math.min(2027, Math.max(2024, anio))]
  const umbral = c.carrera[0] * 12 + c.carrera[1]
  return mesesCotizados >= umbral ? { anios: 65, meses: 0, larga: true } : { anios: c.edad[0], meses: c.edad[1], larga: false, umbral }
}

// ── Impuesto sobre sucesiones: normativa estatal (Ley 29/1987) ──
export const ESCALA_SUCESIONES = [
  [0, 0, 7.65], [7993.46, 611.5, 8.5], [15980.91, 1290.43, 9.35], [23968.36, 2037.26, 10.2], [31955.81, 2851.98, 11.05],
  [39943.26, 3734.59, 11.9], [47930.72, 4685.1, 12.75], [55918.17, 5703.5, 13.6], [63905.62, 6789.79, 14.45], [71893.07, 7943.98, 15.3],
  [79880.52, 9166.06, 16.15], [119757.67, 15606.22, 18.7], [159634.83, 23063.25, 21.25], [239389.13, 40011.04, 25.5], [398777.54, 80655.08, 29.75],
  [797555.08, 199291.4, 34],
]
export const COEF_MULTIPLICADOR = [
  { hasta: 402678.11, grupos: [1, 1.5882, 2] },
  { hasta: 2007380.43, grupos: [1.05, 1.6676, 2.1] },
  { hasta: 4020770.98, grupos: [1.1, 1.7471, 2.2] },
  { hasta: Infinity, grupos: [1.2, 1.9059, 2.4] },
]

export function cuotaEscalaSucesiones(base) {
  if (base <= 0) return 0
  const t = [...ESCALA_SUCESIONES].reverse().find(([desde]) => base > desde)
  return t[1] + ((base - t[0]) * t[2]) / 100
}

export function reduccionParentesco(grupo, edad) {
  if (grupo === 'I') return Math.min(47858.59, 15956.87 + Math.max(0, 21 - edad) * 3990.72)
  if (grupo === 'II') return 15956.87
  if (grupo === 'III') return 7993.46
  return 0
}

export function calcularSucesiones({ herencia, grupo, edad = 30, patrimonio = 0, bonificacion = 0, reduccionVivienda = 0 }) {
  const reduccion = reduccionParentesco(grupo, edad)
  const base = Math.max(0, herencia - reduccion - reduccionVivienda)
  const cuotaIntegra = cuotaEscalaSucesiones(base)
  const fila = COEF_MULTIPLICADOR.find((c) => patrimonio <= c.hasta)
  const coef = fila.grupos[grupo === 'I' || grupo === 'II' ? 0 : grupo === 'III' ? 1 : 2]
  const cuotaTributaria = cuotaIntegra * coef
  const bonif = (cuotaTributaria * bonificacion) / 100
  return { reduccion, base, cuotaIntegra, coef, cuotaTributaria, bonif, aPagar: cuotaTributaria - bonif, tipoEfectivo: herencia > 0 ? ((cuotaTributaria - bonif) / herencia) * 100 : 0 }
}
