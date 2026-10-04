import { notFound } from 'next/navigation'
import ArticuloLayout from '@/components/ArticuloLayout'
import { getArticulo, articulosRelacionados, todosLosArticulos } from '@/lib/blog'
import { generateArticleSchema, generateBreadcrumbSchema, generateFaqSchema } from '@/lib/schema'
import { generateArticleMetadata } from '@/lib/seo'

export const dynamicParams = false

export async function generateStaticParams() {
  return todosLosArticulos().map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const articulo = getArticulo(slug)
  return articulo ? generateArticleMetadata(articulo) : {}
}

export default async function ArticuloPage({ params }) {
  const { slug } = await params
  const articulo = getArticulo(slug)
  if (!articulo) notFound()

  const esquemas = [
    generateArticleSchema(articulo),
    generateBreadcrumbSchema([
      { name: 'Inicio', url: 'https://herramatica.com' },
      { name: 'Blog', url: 'https://herramatica.com/blog' },
      { name: articulo.titulo, url: articulo.url },
    ]),
    generateFaqSchema(articulo.faqs),
  ].filter(Boolean)

  return (
    <>
      {esquemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <ArticuloLayout articulo={articulo} relacionados={articulosRelacionados(articulo)} />
    </>
  )
}
