import { notFound } from 'next/navigation'
import toolsData from '@/data/tools.json'
import ToolLayout from '@/components/ToolLayout'
import { toolComponents } from '@/tools/index'
import { generateToolMetadata } from '@/lib/seo'
import { generateFaqSchema, generateWebAppSchema } from '@/lib/schema'

export async function generateStaticParams() {
  return toolsData.map((tool) => ({ slug: tool.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const tool = toolsData.find((t) => t.slug === slug)
  if (!tool) return {}
  return generateToolMetadata(tool)
}

export default async function ToolPage({ params }) {
  const { slug } = await params
  const tool = toolsData.find((t) => t.slug === slug)
  if (!tool) notFound()

  const ToolComponent = toolComponents[slug]
  if (!ToolComponent) notFound()

  const faqSchema = generateFaqSchema(tool.faqs)
  const webAppSchema = tool.webApp ? generateWebAppSchema(tool) : null

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {webAppSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />
      )}
      <ToolLayout tool={tool}>
        <ToolComponent />
      </ToolLayout>
    </>
  )
}
