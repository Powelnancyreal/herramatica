// Utilidades de imagen para el navegador (Canvas). Nada se sube a ningún servidor.

export function cargarImagen(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    // Los SVG sin dimensiones declaradas reportan 0 px: se usa 512 como tamaño de referencia.
    img.onload = () => resolve({ img, url, ancho: img.naturalWidth || 512, alto: img.naturalHeight || 512 })
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer la imagen.'))
    }
    img.src = url
  })
}

export function canvasABlob(canvas, tipo, calidad) {
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Tu navegador no pudo generar ese formato.'))), tipo, calidad))
}

// modo: 'estirar' | 'ajustar' (cabe completa con relleno) | 'recortar' (cubre y recorta el sobrante)
export function dibujarRedimensionada(img, ancho, alto, modo = 'estirar', fondo = '#ffffff') {
  const canvas = document.createElement('canvas')
  canvas.width = ancho
  canvas.height = alto
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingQuality = 'high'
  const w = img.naturalWidth || ancho
  const h = img.naturalHeight || alto
  // Un fondo sólido evita que las zonas transparentes salgan negras en JPG.
  if (fondo !== 'transparente') {
    ctx.fillStyle = fondo
    ctx.fillRect(0, 0, ancho, alto)
  }
  if (modo === 'estirar') {
    ctx.drawImage(img, 0, 0, ancho, alto)
    return canvas
  }
  const escala = modo === 'ajustar' ? Math.min(ancho / w, alto / h) : Math.max(ancho / w, alto / h)
  const dw = w * escala
  const dh = h * escala
  ctx.drawImage(img, (ancho - dw) / 2, (alto - dh) / 2, dw, dh)
  return canvas
}

export function descargarBlob(blob, nombre) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = nombre
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}

export function nombreSinExtension(nombre) {
  return nombre.replace(/\.[^.]+$/, '')
}

export function tamanoLegible(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

// Construye un archivo .ico con varias imágenes PNG embebidas (formato admitido desde Windows Vista).
export async function crearIco(pngs) {
  const buffers = await Promise.all(pngs.map((p) => p.blob.arrayBuffer()))
  const cabecera = 6 + 16 * pngs.length
  const total = cabecera + buffers.reduce((s, b) => s + b.byteLength, 0)
  const out = new Uint8Array(total)
  const dv = new DataView(out.buffer)
  dv.setUint16(0, 0, true)
  dv.setUint16(2, 1, true)
  dv.setUint16(4, pngs.length, true)
  let offset = cabecera
  pngs.forEach((p, i) => {
    const e = 6 + 16 * i
    out[e] = p.tamano >= 256 ? 0 : p.tamano
    out[e + 1] = p.tamano >= 256 ? 0 : p.tamano
    dv.setUint16(e + 4, 1, true)
    dv.setUint16(e + 6, 32, true)
    dv.setUint32(e + 8, buffers[i].byteLength, true)
    dv.setUint32(e + 12, offset, true)
    out.set(new Uint8Array(buffers[i]), offset)
    offset += buffers[i].byteLength
  })
  return new Blob([out], { type: 'image/x-icon' })
}
