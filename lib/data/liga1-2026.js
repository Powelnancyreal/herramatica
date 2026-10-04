// Liga 1 de Perú 2026, Torneo Clausura: tabla tras la fecha 10 (30 de septiembre de 2026).
// UTC tiene puntos descontados por sanción (ajuste). Actualizar después de cada fecha.
export const LIGA1_ACTUALIZADA = '30 de septiembre de 2026 (fecha 10 del Clausura)'
export const LIGA1_FECHAS_TOTALES = 17

// [equipo, PG, PE, PP, GF, GC, ajuste de puntos]
export const LIGA1_CLAUSURA_2026 = [
  ['Deportivo Garcilaso', 7, 1, 2, 18, 6, 0],
  ['Universitario', 6, 2, 2, 19, 16, 0],
  ['Sporting Cristal', 6, 1, 3, 20, 10, 0],
  ['Alianza Atlético', 6, 1, 3, 20, 17, 0],
  ['Sport Huancayo', 6, 1, 3, 16, 13, 0],
  ['Juan Pablo II College', 5, 3, 2, 20, 12, 0],
  ['Melgar', 5, 3, 2, 16, 9, 0],
  ['Sport Boys', 5, 3, 2, 14, 7, 0],
  ['Cusco FC', 6, 0, 4, 19, 14, 0],
  ['Alianza Lima', 4, 4, 2, 13, 10, 0],
  ['Atlético Grau', 5, 1, 4, 14, 13, 0],
  ['FC Cajamarca', 3, 1, 6, 18, 24, 0],
  ['Comerciantes Unidos', 2, 3, 5, 17, 18, 0],
  ['Cienciano', 2, 2, 6, 12, 18, 0],
  ['Los Chankas', 2, 2, 6, 11, 24, 0],
  ['Deportivo Moquegua', 1, 4, 5, 7, 17, 0],
  ['ADT', 1, 2, 7, 7, 20, 0],
  ['UTC', 0, 2, 8, 11, 24, -5],
].map(([equipo, pg, pe, pp, gf, gc, ajuste]) => ({ equipo, pg, pe, pp, gf, gc, ajuste }))

// Tabla ordenada por puntos, diferencia de goles y goles a favor (los tres primeros criterios de las bases).
export function tablaConPartidos(base, partidos) {
  const filas = new Map(base.map((e) => [e.equipo, { ...e }]))
  for (const p of partidos) {
    const l = filas.get(p.local)
    const v = filas.get(p.visita)
    if (!l || !v) continue
    l.gf += p.gl; l.gc += p.gv; v.gf += p.gv; v.gc += p.gl
    if (p.gl > p.gv) { l.pg++; v.pp++ } else if (p.gl < p.gv) { v.pg++; l.pp++ } else { l.pe++; v.pe++ }
  }
  return [...filas.values()]
    .map((e) => ({ ...e, pj: e.pg + e.pe + e.pp, dg: e.gf - e.gc, pts: e.pg * 3 + e.pe + e.ajuste }))
    .sort((a, b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf || a.equipo.localeCompare(b.equipo, 'es'))
}
