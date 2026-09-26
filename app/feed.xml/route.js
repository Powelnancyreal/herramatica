import toolsData from '@/data/tools.json'
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '@/lib/seo'

export const dynamic = 'force-static'

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function GET() {
  const buildDate = new Date().toUTCString()
  const feedUrl = `${SITE_URL}/feed.xml`

  const items = toolsData
    .map((tool) => {
      const url = `${SITE_URL}/${tool.slug}`
      return `    <item>
      <title>${escapeXml(tool.name)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(tool.metaDescription)}</description>
      <category>${escapeXml(tool.category)}</category>
      <pubDate>${buildDate}</pubDate>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${SITE_NAME} | Herramientas Online Gratuitas en Español`)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>es</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/favicon.webp</url>
      <title>${escapeXml(SITE_NAME)}</title>
      <link>${SITE_URL}</link>
    </image>
${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
