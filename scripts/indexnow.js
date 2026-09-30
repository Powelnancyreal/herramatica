// Usage: node scripts/indexnow.js [--all | --from=N | --slugs=a,b,c] [--dry-run]
//   default    tools from data/tools.json index 96 onward (the batch added in 77572a5)
//   --all      every URL in out/sitemap.xml (run `npm run build` first)
//   --from=N   tools from data/tools.json index N onward
//   --slugs=   explicit comma-separated slugs
// IndexNow shares submissions with Bing, Yandex, Seznam, Naver and Yep.

const fs = require('fs')
const path = require('path')

const HOST = 'herramatica.com'
const SITE_URL = `https://${HOST}`
const KEY = '0f39f0ef33e2579083f8327f5ff422e7'
const KEY_LOCATION = `${SITE_URL}/${KEY}.txt`
const ENDPOINT = 'https://api.indexnow.org/indexnow'
const MAX_URLS = 10000

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const argValue = (name) => {
  const a = args.find((x) => x.startsWith(`--${name}=`))
  return a ? a.slice(name.length + 3) : null
}

function collectUrls() {
  if (args.includes('--all')) {
    const sitemapPath = path.join(__dirname, '..', 'out', 'sitemap.xml')
    if (!fs.existsSync(sitemapPath)) throw new Error('out/sitemap.xml not found. Run `npm run build` first.')
    const xml = fs.readFileSync(sitemapPath, 'utf8')
    return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => !/\.(webp|png|jpg|svg)$/.test(u))
  }
  const slugs = argValue('slugs')
  if (slugs) return slugs.split(',').map((s) => `${SITE_URL}/${s.trim()}`)
  const tools = require('../data/tools.json')
  const from = parseInt(argValue('from') ?? '96', 10)
  return tools.slice(from).map((t) => `${SITE_URL}/${t.slug}`)
}

async function main() {
  const urls = [...new Set(collectUrls())]
  if (urls.length === 0) throw new Error('No URLs to submit.')
  if (urls.length > MAX_URLS) throw new Error(`IndexNow accepts at most ${MAX_URLS} URLs per request (got ${urls.length}).`)
  const bad = urls.filter((u) => !u.startsWith(SITE_URL) || (u !== SITE_URL && u.endsWith('/')))
  if (bad.length) throw new Error(`Invalid URLs (wrong host or trailing slash):\n${bad.join('\n')}`)

  console.log(`${urls.length} URL(s) to submit:`)
  urls.forEach((u) => console.log(`  ${u}`))

  if (dryRun) {
    console.log('\nDry run: nothing submitted.')
    return
  }

  const keyRes = await fetch(KEY_LOCATION)
  const keyBody = (await keyRes.text()).trim()
  if (!keyRes.ok || keyBody !== KEY) {
    throw new Error(`Key file check failed at ${KEY_LOCATION} (HTTP ${keyRes.status}). Deploy it before submitting.`)
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls }),
  })
  const body = await res.text()
  const meaning = {
    200: 'OK, URLs submitted',
    202: 'Accepted, key validation pending',
    400: 'Bad request',
    403: 'Key not valid (key file missing or mismatched)',
    422: 'URLs do not belong to the host, or key does not match',
    429: 'Too many requests, try again later',
  }
  console.log(`\nHTTP ${res.status}: ${meaning[res.status] || res.statusText}${body ? `\n${body}` : ''}`)
  if (res.status !== 200 && res.status !== 202) process.exitCode = 1
}

main().catch((err) => {
  console.error(err.message)
  process.exitCode = 1
})
