import { notFound } from 'next/navigation'
import toolsData from '@/data/tools.json'
import categoriesData from '@/data/categories.json'
import fechas from '@/data/fechas.json'
import ToolLayout from '@/components/ToolLayout'
import ToolRenderer from '@/components/ToolRenderer'
import { generateToolMetadata } from '@/lib/seo'
import { generateFaqSchema, generateToolPageSchema, generateWebAppSchema } from '@/lib/schema'

export async function generateStaticParams() {
  return toolsData.map((tool) => ({ slug: tool.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const tool = toolsData.find((t) => t.slug === slug)
  if (!tool) return {}
  return generateToolMetadata(tool)
}

const Schema = ({ data }) => (data ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} /> : null)

export default async function ToolPage({ params }) {
  const { slug } = await params
  const tool = toolsData.find((t) => t.slug === slug)
  if (!tool) notFound()

  const categoria = categoriesData.find((c) => c.slug === tool.category)
  const fecha = fechas.herramientas[tool.slug] || {}

  return (
    <>
      <Schema data={generateToolPageSchema(tool, { creado: fecha.creado, actualizado: fecha.actualizado, categoria })} />
      <Schema data={generateWebAppSchema(tool)} />
      <Schema data={generateFaqSchema(tool.faqs)} />
      <ToolLayout tool={tool} categoria={categoria}>
        <ToolRenderer slug={slug} />
      </ToolLayout>
    </>
  )
}
