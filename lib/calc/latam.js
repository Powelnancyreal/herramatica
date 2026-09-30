// Cálculos laborales y tributarios de Chile, Colombia, Perú, Ecuador, Uruguay y Argentina.
// Valores de referencia verificados para 2026; las herramientas permiten editarlos.

// ═══════════════ CHILE ═══════════════
export const CHILE = {
  imm: 553553, // ingreso mínimo mensual desde mayo de 2026
  topeAfpUF: 90, // tope imponible AFP, salud y accidentes 2026
  topeCesantiaUF: 135.2, // tope imponible seguro de cesantía desde febrero de 2026
  afps: [
    { nombre: 'Uno', comision: 0.46 },
    { nombre: 'Modelo', comision: 0.58 },
    { nombre: 'PlanVital', comision: 1.16 },
    { nombre: 'Habitat', comision: 1.27 },
    { nombre: 'Capital', comision: 1.44 },
    { nombre: 'Cuprum', comision: 1.44 },
    { nombre: 'Provida', comision: 1.45 },
  ],
}

// Impuesto único de segunda categoría (art. 43 LIR): factor y cantidad a rebajar en UTM.
export const TRAMOS_IUSC = [
  [13.5, 0, 0], [30, 0.04, 0.54], [50, 0.08, 1.74], [70, 0.135, 4.49], [90, 0.23, 11.14], [120, 0.304, 17.8], [310, 0.35, 23.32], [Infinity, 0.4, 38.82],
]

export function impuestoUnico(baseCLP, utm) {
  const enUTM = baseCLP / utm
  const [, factor, rebaja] = TRAMOS_IUSC.find(([hasta]) => enUTM <= hasta)
  return { impuesto: Math.max(0, (enUTM * factor - rebaja) * utm), factor, enUTM }
}

export function sueldoLiquidoChile({ imponible, noImponible = 0, uf, utm, comisionAfp, salud = 'fonasa', planIsapreUF = 0, indefinido = true }) {
  const topeAfp = CHILE.topeAfpUF * uf
  const baseAfp = Math.min(imponible, topeAfp)
  const afp = baseAfp * (0.1 + comisionAfp / 100)
  const salud7 = baseAfp * 0.07
  const saludMonto = salud === 'isapre' ? Math.max(salud7, planIsapreUF * uf) : salud7
  const cesantia = indefinido ? Math.min(imponible, CHILE.topeCesantiaUF * uf) * 0.006 : 0
  // Solo el 7% legal de salud rebaja la base del impuesto; el adicional de Isapre no.
  const baseTributable = Math.max(0, imponible - afp - salud7 - cesantia)
  const iu = impuestoUnico(baseTributable, utm)
  const descuentos = afp + saludMonto + cesantia + iu.impuesto
  return { afp, salud: saludMonto, cesantia, baseTributable, ...iu, descuentos, liquido: imponible + noImponible - descuentos, topado: imponible > topeAfp }
}

export function gratificacionChile({ sueldoMensual, imm = CHILE.imm }) {
  const topeMensual = (4.75 * imm) / 12
  const veinticinco = sueldoMensual * 0.25
  return { mensual: Math.min(veinticinco, topeMensual), topeMensual, veinticinco, topeAnual: 4.75 * imm, topado: veinticinco > topeMensual }
}

export function finiquitoChile({ sueldo, anios, meses, uf, causal, vacacionesPendientes = 0, recargoPct = 0, avisoDado = false }) {
  const tope = 90 * uf
  const base = Math.min(sueldo, tope)
  // Años de servicio: fracción superior a 6 meses cuenta como año; máximo 11 años (art. 163).
  const aniosIndemn = Math.min(11, anios + (meses > 6 ? 1 : 0))
  const conIndemnizacion = causal === 'necesidades' || causal === 'desahucio' || causal === 'injustificado'
  const indemnizacion = conIndemnizacion && anios >= 1 ? base * aniosIndemn : 0
  const aviso = conIndemnizacion && !avisoDado ? base : 0
  const recargo = causal === 'injustificado' ? (indemnizacion * recargoPct) / 100 : 0
  // Feriado proporcional: 1.25 días hábiles por mes desde el último aniversario, pagados en días corridos (≈ × 7/5).
  const habilesProporcionales = meses * 1.25
  const diasCorridos = (habilesProporcionales + vacacionesPendientes) * 1.4
  const feriado = (sueldo / 30) * diasCorridos
  return { base, aniosIndemn, indemnizacion, aviso, recargo, feriado, diasCorridos, habilesProporcionales, total: indemnizacion + aviso + recargo + feriado }
}

// ═══════════════ COLOMBIA ═══════════════
export const COLOMBIA = { smmlv: 1750905, auxilio: 249095, uvt: 52374 }

export const tieneAuxilio = (salario, smmlv = COLOMBIA.smmlv) => salario <= 2 * smmlv

// Art. 383 ET: tabla de retención para rentas de trabajo (en UVT mensuales).
export const TABLA_383 = [
  [95, 0, 0, 0], [150, 0.19, 95, 0], [360, 0.28, 150, 10], [640, 0.33, 360, 69], [945, 0.35, 640, 162], [2300, 0.37, 945, 268], [Infinity, 0.39, 2300, 770],
]

export function retencionFuente({ ingreso, uvt = COLOMBIA.uvt, dependiente = false, prepagada = 0, interesesVivienda = 0, voluntarias = 0, smmlv = COLOMBIA.smmlv }) {
  const pension = ingreso * 0.04
  const salud = ingreso * 0.04
  // Fondo de solidaridad pensional: 1% desde 4 SMMLV, subiendo hasta 2% desde 16 SMMLV.
  const veces = ingreso / smmlv
  const fspPct = veces < 4 ? 0 : veces < 16 ? 1 : veces < 17 ? 1.2 : veces < 18 ? 1.4 : veces < 19 ? 1.6 : veces < 20 ? 1.8 : 2
  const fsp = (ingreso * fspPct) / 100
  const incr = pension + salud + fsp
  const neto = ingreso - incr
  const dedDependiente = dependiente ? Math.min(ingreso * 0.1, 32 * uvt) : 0
  const deducciones = dedDependiente + Math.min(prepagada, 16 * uvt) + Math.min(interesesVivienda, 100 * uvt)
  const exentaVoluntaria = Math.min(voluntarias, ingreso * 0.3)
  const baseExenta25 = Math.max(0, neto - deducciones - exentaVoluntaria)
  const exenta25 = Math.min(baseExenta25 * 0.25, (790 / 12) * uvt)
  // Límite global: deducciones + rentas exentas ≤ 40% del ingreso neto y ≤ 1,340 UVT al año.
  const limite = Math.min(neto * 0.4, (1340 / 12) * uvt)
  const beneficios = Math.min(deducciones + exentaVoluntaria + exenta25, limite)
  const base = Math.max(0, neto - beneficios)
  const baseUVT = base / uvt
  const [, tarifa, desde, suma] = TABLA_383.find(([hasta]) => baseUVT <= hasta)
  const retUVT = (baseUVT - desde) * tarifa + suma
  const retencion = baseUVT <= 95 ? 0 : Math.round((retUVT * uvt) / 1000) * 1000
  return { pension, salud, fsp, fspPct, incr, deducciones, exentaVoluntaria, exenta25, limite, beneficios, base, baseUVT, tarifa, retencion }
}

// ═══════════════ PERÚ ═══════════════
export const PERU = { uit: 5500 }
export const UIT_HISTORICA = [
  [2026, 5500], [2025, 5350], [2024, 5150], [2023, 4950], [2022, 4600], [2021, 4400], [2020, 4300], [2019, 4200], [2018, 4150], [2017, 4050],
]
export const TRAMOS_QUINTA = [[5, 8], [20, 14], [35, 17], [45, 20], [Infinity, 30]]

export function rentaQuinta({ remuneracion, meses = 12, gratificaciones = 2, bonificacion9 = true, otros = 0, deduccionAdicional = 0, uit = PERU.uit }) {
  const grati = remuneracion * gratificaciones
  const bono = bonificacion9 ? grati * 0.09 : 0
  const bruta = remuneracion * meses + grati + bono + otros
  const siete = 7 * uit
  const adicional = Math.min(deduccionAdicional, 3 * uit)
  const neta = Math.max(0, bruta - siete - adicional)
  let restante = neta
  let desde = 0
  let impuesto = 0
  const detalle = []
  for (const [hasta, tasa] of TRAMOS_QUINTA) {
    const tope = hasta * uit
    const tramo = Math.max(0, Math.min(restante, tope - desde))
    if (tramo > 0) detalle.push({ tasa, monto: tramo, impuesto: (tramo * tasa) / 100 })
    impuesto += (tramo * tasa) / 100
    restante -= tramo
    desde = tope
    if (restante <= 0) break
  }
  return { bruta, siete, adicional, neta, impuesto, detalle, mensual: impuesto / 12, tasaEfectiva: bruta > 0 ? (impuesto / bruta) * 100 : 0 }
}

// ONP (Ley 32123): mínima S/ 600 con 20 años; proporcional S/ 300 (10 a 14 años) y S/ 400 (15 a 19); máxima S/ 1,000.
export function pensionONP({ remuneracion, anios }) {
  if (anios < 10) return { pension: 0, regla: 'Menos de 10 años: sin pensión' }
  if (anios < 15) return { pension: 300, regla: 'Pensión proporcional (10 a 14 años)' }
  if (anios < 20) return { pension: 400, regla: 'Pensión proporcional (15 a 19 años)' }
  const estimada = remuneracion * Math.min(1, 0.3 + 0.02 * (anios - 20))
  return { pension: Math.min(1000, Math.max(600, estimada)), regla: 'Pensión de jubilación (20 años o más)' }
}

export function saldoAFP({ remuneracion, anios, rentabilidad, saldoInicial = 0 }) {
  const i = Math.pow(1 + rentabilidad / 100, 1 / 12) - 1
  let s = saldoInicial
  for (let m = 0; m < anios * 12; m++) s = s * (1 + i) + remuneracion * 0.1
  return s
}

// ═══════════════ ECUADOR ═══════════════
export const ECUADOR = { sbu: 482, canasta: 821.8, aporteIess: 9.45 }
export const TABLA_IR_ECUADOR_2026 = [
  [0, 12208, 0, 0], [12208, 15549, 0, 5], [15549, 20188, 167, 10], [20188, 26700, 631, 12], [26700, 35136, 1412, 15],
  [35136, 46575, 2678, 20], [46575, 62005, 4965, 25], [62005, 82679, 8823, 30], [82679, 109956, 15025, 35], [109956, Infinity, 24572, 37],
]
export const CANASTAS_POR_CARGAS = [7, 9, 11, 14, 17, 20]

export function impuestoRentaEcuador({ ingresosAnuales, gastosPersonales = 0, cargas = 0, aporteIess = true }) {
  const aporte = aporteIess ? (ingresosAnuales * ECUADOR.aporteIess) / 100 : 0
  const base = Math.max(0, ingresosAnuales - aporte)
  const fila = TABLA_IR_ECUADOR_2026.find(([desde, hasta]) => base > desde && base <= hasta) || TABLA_IR_ECUADOR_2026[0]
  const causado = fila[2] + ((base - fila[0]) * fila[3]) / 100
  const canastas = CANASTAS_POR_CARGAS[Math.min(5, cargas)]
  const topeGastos = canastas * ECUADOR.canasta
  const rebaja = Math.min(causado, 0.18 * Math.min(gastosPersonales, topeGastos))
  const aPagar = Math.max(0, causado - rebaja)
  return { aporte, base, fila, causado, canastas, topeGastos, rebaja, aPagar, mensual: aPagar / 12 }
}

// ═══════════════ URUGUAY ═══════════════
export const URUGUAY = { bpc: 6864 }
export const FRANJAS_IRPF_UY = [[7, 0], [10, 10], [15, 15], [30, 24], [50, 25], [75, 27], [115, 31], [Infinity, 36]]

export function irpfUruguay({ nominal, bpc = URUGUAY.bpc, hijos = 0, hijosDiscapacidad = 0, fonasaPct = 4.5, fondoSolidaridad = 0 }) {
  // Si el nominal supera 10 BPC, la base se incrementa un 6% para anticipar el IRPF del aguinaldo y el salario vacacional.
  const base = nominal > 10 * bpc ? nominal * 1.06 : nominal
  let impuesto = 0
  let desde = 0
  const detalle = []
  for (const [hasta, tasa] of FRANJAS_IRPF_UY) {
    const tope = hasta * bpc
    const tramo = Math.max(0, Math.min(base, tope) - desde)
    if (tramo > 0 && tasa > 0) detalle.push({ tasa, monto: tramo, impuesto: (tramo * tasa) / 100 })
    impuesto += (tramo * tasa) / 100
    desde = tope
    if (base <= tope) break
  }
  const aportes = nominal * 0.15 + (nominal * fonasaPct) / 100 + nominal * 0.001
  const deducHijos = (hijos * 20 * bpc) / 12 + (hijosDiscapacidad * 40 * bpc) / 12
  const deducciones = aportes + deducHijos + fondoSolidaridad
  const tasaDeduccion = nominal <= 15 * bpc ? 14 : 8
  const credito = (deducciones * tasaDeduccion) / 100
  const irpf = Math.max(0, impuesto - credito)
  return { base, impuesto, detalle, aportes, deducHijos, deducciones, tasaDeduccion, credito, irpf, liquido: nominal - nominal * 0.15 - (nominal * fonasaPct) / 100 - nominal * 0.001 - irpf }
}

// ═══════════════ ARGENTINA ═══════════════
// Monotributo: escalas vigentes desde el 1 de agosto de 2026 (ARCA).
export const MONOTRIBUTO = [
  { cat: 'A', ingresos: 12009410.45, superficie: 30, energia: 3330, alquileres: 2792886.15, servicios: 49527.18, bienes: 49527.18, sipa: 18246.86, obraSocial: 25694.55 },
  { cat: 'B', ingresos: 17595182.74, superficie: 45, energia: 5000, alquileres: 2792886.15, servicios: 56379.08, bienes: 56379.08, sipa: 20071.55, obraSocial: 25694.55 },
  { cat: 'C', ingresos: 24670494.31, superficie: 60, energia: 6700, alquileres: 3816944.41, servicios: 66020.12, bienes: 64530.58, sipa: 22078.71, obraSocial: 25694.55 },
  { cat: 'D', ingresos: 30628651.43, superficie: 85, energia: 10000, alquileres: 3816944.41, servicios: 84612.93, bienes: 82564.81, sipa: 24286.58, obraSocial: 30535.56 },
  { cat: 'E', ingresos: 36028231.33, superficie: 110, energia: 13000, alquileres: 4841002.66, servicios: 119811.45, bienes: 108267.51, sipa: 26715.24, obraSocial: 37238.48 },
  { cat: 'F', ingresos: 45151659.41, superficie: 150, energia: 16500, alquileres: 4841002.66, servicios: 150784.21, bienes: 129930.65, sipa: 29386.76, obraSocial: 42824.25 },
  { cat: 'G', ingresos: 53995798.87, superficie: 200, energia: 20000, alquileres: 5771964.69, servicios: 230312.94, bienes: 158815.05, sipa: 41141.46, obraSocial: 46175.72 },
  { cat: 'H', ingresos: 81924660.37, superficie: 200, energia: 20000, alquileres: 8378658.45, servicios: 522706.68, bienes: 317895.01, sipa: 57598.04, obraSocial: 55485.33 },
  { cat: 'I', ingresos: 91699761.9, superficie: 200, energia: 20000, alquileres: 8378658.45, servicios: 963747.86, bienes: 474992.78, sipa: 80637.26, obraSocial: 68518.81 },
  { cat: 'J', ingresos: 105012519.2, superficie: 200, energia: 20000, alquileres: 8378658.45, servicios: 1167299.76, bienes: 580793.69, sipa: 112892.16, obraSocial: 76897.46 },
  { cat: 'K', ingresos: 126610838.75, superficie: 200, energia: 20000, alquileres: 8378658.45, servicios: 1614446.04, bienes: 702103.24, sipa: 158049.02, obraSocial: 87882.82 },
]
export const PRECIO_UNITARIO_MAXIMO = 716840.77

export function categoriaMonotributo({ ingresos, superficie = 0, energia = 0, alquileres = 0 }) {
  const i = MONOTRIBUTO.findIndex((c) => ingresos <= c.ingresos && superficie <= c.superficie && energia <= c.energia && alquileres <= c.alquileres)
  return i === -1 ? null : MONOTRIBUTO[i]
}

// Preaviso (LCT arts. 231-233) e integración del mes de despido.
export function preavisoArgentina({ sueldo, antiguedadMeses, fechaDespido, periodoPrueba = false, otorgado = false }) {
  const meses = periodoPrueba ? 0.5 : antiguedadMeses <= 60 ? 1 : 2
  const sustitutiva = otorgado ? 0 : sueldo * meses
  let integracion = 0
  let diasIntegracion = 0
  if (!otorgado && !periodoPrueba && fechaDespido) {
    const d = new Date(fechaDespido + 'T00:00:00Z')
    const diasMes = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate()
    diasIntegracion = diasMes - d.getUTCDate()
    integracion = (sueldo / diasMes) * diasIntegracion
  }
  const sac = (sustitutiva + integracion) / 12
  return { meses, sustitutiva, integracion, diasIntegracion, sac, total: sustitutiva + integracion + sac }
}
