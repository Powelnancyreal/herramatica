import fs from 'fs'
import path from 'path'
import { Marked } from 'marked'
import articulos from '@/data/blog.json'
import toolsData from '@/data/tools.json'
import { getToolOgImage } from '@/lib/toolImage'

// Artículos del blog: los metadatos y las FAQs viven en data/blog.json y el cuerpo en content/blog/{slug}.md.
// Todo se procesa al compilar; el navegador recibe HTML ya hecho, sin JavaScript del blog.

export const CLUSTERS = {
  rfc: { nombre: 'RFC y trámites del SAT', descripcion: 'Cómo obtener, entender y usar tu RFC.' },
  aguinaldo: { nombre: 'Aguinaldo', descripcion: 'Cálculo, impuestos y fechas del aguinaldo en México.' },
  vacaciones: { nombre: 'Vacaciones y prima vacacional', descripcion: 'Días que te tocan por ley y cuánto te deben pagar.' },
  salario: { nombre: 'Salario y prestaciones', descripcion: 'Salario diario integrado, cuotas y otros conceptos de tu nómina.' },
  finiquito: { nombre: 'Finiquito y liquidación', descripcion: 'Qué te corresponde al terminar una relación laboral.' },
}

const SITE_URL = 'https://herramatica.com'
const PALABRAS_POR_MINUTO = 200
const slugsHerramientas = new Set(toolsData.map((t) => t.slug))
const slugsArticulos = new Set(articulos.map((a) => a.slug))

export const idDeTitulo = (texto) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

// Un enlace interno roto rompe la compilación en vez de llegar a producción.
function comprobarEnlace(href, slug) {
  if (!href.startsWith('/')) return
  if (href.endsWith('/') && href !== '/') throw new Error(`[blog/${slug}] Enlace con barra final: ${href}`)
  const ruta = href.split('#')[0]
  const blog = ruta.match(/^\/blog\/([a-z0-9-]+)$/)
  if (ruta === '/' || ruta === '/blog') return
  if (blog ? slugsArticulos.has(blog[1]) : slugsHerramientas.has(ruta.slice(1)) || ['/calculadoras', '/convertidores', '/generadores', '/juegos', '/texto'].includes(ruta)) return
  throw new Error(`[blog/${slug}] Enlace interno roto: ${href}`)
}

function renderizar(markdown, slug) {
  const indice = []
  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth }) {
        const html = this.parser.parseInline(tokens)
        if (depth === 1) throw new Error(`[blog/${slug}] El cuerpo no lleva H1: el título ya es el H1 de la página.`)
        const id = idDeTitulo(html)
        if (depth === 2) indice.push({ id, texto: html.replace(/<[^>]+>/g, '') })
        return `<h${depth} id="${id}">${html}</h${depth}>\n`
      },
      link({ href, title, tokens }) {
        comprobarEnlace(href, slug)
        const texto = this.parser.parseInline(tokens)
        const externo = /^https?:\/\//.test(href)
        return `<a href="${href}"${title ? ` title="${title}"` : ''}${externo ? ' target="_blank" rel="noopener"' : ''}>${texto}</a>`
      },
      table(token) {
        // Las tablas se envuelven para desplazarse en horizontal en el móvil sin romper la página.
        const celda = (c, tag) => `<${tag}${c.align ? ` style="text-align:${c.align}"` : ''}>${this.parser.parseInline(c.tokens)}</${tag}>`
        const cabecera = `<tr>${token.header.map((c) => celda(c, 'th')).join('')}</tr>`
        const filas = token.rows.map((fila) => `<tr>${fila.map((c) => celda(c, 'td')).join('')}</tr>`).join('')
        return `<div class="tabla"><table><thead>${cabecera}</thead><tbody>${filas}</tbody></table></div>\n`
      },
    },
  })
  const html = marked.parse(markdown)
  return { html, indice }
}

function cargar(meta) {
  const archivo = path.join(process.cwd(), 'content', 'blog', `${meta.slug}.md`)
  const markdown = fs.readFileSync(archivo, 'utf8')
  const { html, indice } = renderizar(markdown, meta.slug)
  const texto = html.replace(/<[^>]+>/g, ' ')
  const palabras = texto.split(/\s+/).filter(Boolean).length + (meta.faqs || []).reduce((n, f) => n + `${f.question} ${f.answer}`.split(/\s+/).length, 0)
  if (meta.herramienta) comprobarEnlace(meta.herramienta.href, meta.slug)
  // Imagen para redes: la de la herramienta que acompaña al artículo.
  const herramienta = meta.herramienta && toolsData.find((t) => `/${t.slug}` === meta.herramienta.href)
  const og = herramienta && getToolOgImage(herramienta)
  return {
    ...meta,
    url: `${SITE_URL}/blog/${meta.slug}`,
    html,
    indice: meta.faqs?.length ? [...indice, { id: 'preguntas-frecuentes', texto: 'Preguntas frecuentes' }] : indice,
    palabras,
    minutos: Math.max(1, Math.round(palabras / PALABRAS_POR_MINUTO)),
    imagen: og ? { url: `${SITE_URL}${og.src}`, width: 1200, height: 630 } : null,
  }
}

const porFecha = (a, b) => b.publicado.localeCompare(a.publicado) || a.titulo.localeCompare(b.titulo, 'es')

export function todosLosArticulos() {
  return [...articulos].sort(porFecha)
}

export function getArticulo(slug) {
  const meta = articulos.find((a) => a.slug === slug)
  return meta ? cargar(meta) : null
}

export function articulosRelacionados(articulo, max = 3) {
  return todosLosArticulos()
    .filter((a) => a.slug !== articulo.slug && a.cluster === articulo.cluster)
    .slice(0, max)
}

export function articulosPorCluster() {
  const lista = todosLosArticulos()
  return Object.entries(CLUSTERS)
    .map(([id, c]) => ({ id, ...c, articulos: lista.filter((a) => a.cluster === id) }))
    .filter((c) => c.articulos.length)
}

export const fechaLarga = (iso) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
