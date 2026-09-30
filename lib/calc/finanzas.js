// Cálculos financieros puros (sin dependencias del navegador) para poder probarlos con Node.

export const FRECUENCIAS = [
  { id: 'mensual', label: 'Mensual', porAnio: 12 },
  { id: 'quincenal', label: 'Quincenal', porAnio: 24 },
  { id: 'semanal', label: 'Semanal', porAnio: 52 },
  { id: 'bimestral', label: 'Bimestral', porAnio: 6 },
  { id: 'trimestral', label: 'Trimestral', porAnio: 4 },
  { id: 'anual', label: 'Anual', porAnio: 1 },
]

// Tabla de amortización. sistema: 'frances' (cuota fija), 'aleman' (capital fijo), 'americano' (solo intereses y capital al final).
// ivaInteres: porcentaje de IVA sobre los intereses (en México, 16% en créditos de consumo como el automotriz).
export function tablaAmortizacion({ monto, tasaAnual, pagos, porAnio, sistema = 'frances', ivaInteres = 0, abonoExtra = 0 }) {
  const i = tasaAnual / 100 / porAnio
  const iva = ivaInteres / 100
  const filas = []
  let saldo = monto
  const cuotaFija = sistema === 'frances' ? (i === 0 ? monto / pagos : (monto * i) / (1 - Math.pow(1 + i, -pagos))) : 0
  const capitalFijo = monto / pagos
  for (let n = 1; n <= pagos && saldo > 0.005; n++) {
    const interes = saldo * i
    let capital
    if (sistema === 'frances') capital = cuotaFija - interes
    else if (sistema === 'aleman') capital = capitalFijo
    else capital = n === pagos ? saldo : 0
    capital = Math.min(saldo, capital + (n < pagos ? abonoExtra : 0))
    const ivaPago = interes * iva
    saldo = Math.max(0, saldo - capital)
    filas.push({ n, pago: capital + interes + ivaPago, capital, interes, iva: ivaPago, saldo })
  }
  const total = filas.reduce(
    (t, f) => ({ pagado: t.pagado + f.pago, intereses: t.intereses + f.interes, iva: t.iva + f.iva }),
    { pagado: 0, intereses: 0, iva: 0 }
  )
  return { filas, ...total, primerPago: filas[0]?.pago || 0 }
}

// Interés simple: I = C · r · t. Devuelve la variable que falte (una debe ser null).
export function interesSimple({ capital, tasaAnual, anios, interes }) {
  const r = tasaAnual === null ? null : tasaAnual / 100
  if (interes === null) {
    const I = capital * r * anios
    return { capital, tasaAnual, anios, interes: I, montoFinal: capital + I }
  }
  if (capital === null) {
    const C = interes / (r * anios)
    return { capital: C, tasaAnual, anios, interes, montoFinal: C + interes }
  }
  if (tasaAnual === null) {
    const t = (interes / (capital * anios)) * 100
    return { capital, tasaAnual: t, anios, interes, montoFinal: capital + interes }
  }
  const t = interes / (capital * r)
  return { capital, tasaAnual, anios: t, interes, montoFinal: capital + interes }
}

// CETES: valor nominal de $10, se compran a descuento. Precio = VN / (1 + tasa · plazo / 360).
export function calcularCetes({ monto, tasaAnual, plazo, reinversiones = 1, retencionAnual = 0 }) {
  const VN = 10
  let capital = monto
  let interesBruto = 0
  let retencion = 0
  const periodos = []
  for (let k = 0; k < reinversiones; k++) {
    const precio = VN / (1 + (tasaAnual / 100) * (plazo / 360))
    const titulos = Math.floor(capital / precio)
    const invertido = titulos * precio
    const remanente = capital - invertido
    const ganancia = titulos * (VN - precio)
    // Retención de ISR sobre el capital invertido, proporcional a los días (tasa anual fijada en la LIF).
    const isr = invertido * (retencionAnual / 100) * (plazo / 365)
    interesBruto += ganancia
    retencion += isr
    capital = invertido + ganancia - isr + remanente
    periodos.push({ k: k + 1, precio, titulos, invertido, ganancia, isr, saldo: capital })
  }
  const dias = plazo * reinversiones
  const neto = capital - monto
  return { periodos, interesBruto, retencion, neto, montoFinal: capital, dias, rendimientoAnualNeto: (neto / monto) * (360 / dias) * 100 }
}

// Plan para pagar deudas: 'avalancha' (mayor tasa primero) o 'bolaNieve' (menor saldo primero).
export function planDeudas({ deudas, presupuesto, metodo }) {
  const lista = deudas.map((d, idx) => ({ ...d, idx, saldo: d.saldo }))
  const minimos = lista.reduce((s, d) => s + d.minimo, 0)
  if (presupuesto < minimos) return { error: 'El pago mensual total debe cubrir al menos la suma de los pagos mínimos.' }
  const orden = () =>
    lista
      .filter((d) => d.saldo > 0.005)
      .sort((a, b) => (metodo === 'avalancha' ? b.tasa - a.tasa || a.saldo - b.saldo : a.saldo - b.saldo || b.tasa - a.tasa))
  let mes = 0
  let intereses = 0
  const liquidadas = []
  while (lista.some((d) => d.saldo > 0.005)) {
    mes++
    if (mes > 600) return { error: 'Con ese pago, las deudas no se liquidan en 50 años: los intereses crecen más rápido que tus abonos.' }
    for (const d of lista) {
      if (d.saldo <= 0.005) continue
      const int = d.saldo * (d.tasa / 100 / 12)
      d.saldo += int
      intereses += int
    }
    let disponible = presupuesto
    for (const d of lista) {
      if (d.saldo <= 0.005) continue
      const p = Math.min(d.minimo, d.saldo)
      d.saldo -= p
      disponible -= p
    }
    for (const d of orden()) {
      if (disponible <= 0) break
      const p = Math.min(disponible, d.saldo)
      d.saldo -= p
      disponible -= p
    }
    for (const d of lista) {
      if (d.saldo <= 0.005 && !liquidadas.some((l) => l.idx === d.idx)) {
        d.saldo = 0
        liquidadas.push({ idx: d.idx, nombre: d.nombre, mes })
      }
    }
  }
  return { meses: mes, intereses, liquidadas }
}
