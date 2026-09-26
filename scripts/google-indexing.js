// Usage: node scripts/google-indexing.js [--dry-run] [--limit=N]
// Credentials: scripts/service-account.json, or the path in GOOGLE_APPLICATION_CREDENTIALS

const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const SITE_URL = 'https://herramatica.com'
const DAILY_QUOTA = 200
const DELAY_MS = 1000
const SCOPE = 'https://www.googleapis.com/auth/indexing'
const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const PUBLISH_URL = 'https://indexing.googleapis.com/v3/urlNotifications:publish'
const RESULTS_PATH = path.join(__dirname, 'indexing-results.json')

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const limitArg = args.find((a) => a.startsWith('--limit='))
const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : DAILY_QUOTA

function loadCredentials() {
  const credPath =
    process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, 'service-account.json')
  if (!fs.existsSync(credPath)) {
    throw new Error(
      `Credentials not found at ${credPath}. Set GOOGLE_APPLICATION_CREDENTIALS or place the key at scripts/service-account.json.`
    )
  }
  const creds = JSON.parse(fs.readFileSync(credPath, 'utf8'))
  if (!creds.client_email || !creds.private_key) {
    throw new Error(`${credPath} is not a service account key (missing client_email/private_key).`)
  }
  return creds
}

function base64url(input) {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

async function getAccessToken(creds) {
  const now = Math.floor(Date.now() / 1000)
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claims = base64url(
    JSON.stringify({ iss: creds.client_email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 })
  )
  const signature = crypto
    .createSign('RSA-SHA256')
    .update(`${header}.${claims}`)
    .sign(creds.private_key, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${header}.${claims}.${signature}`,
    }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Auth failed (${res.status}): ${data.error_description || data.error}`)
  return data.access_token
}

async function publishUrl(token, url) {
  const res = await fetch(PUBLISH_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, type: 'URL_UPDATED' }),
  })
  const data = await res.json().catch(() => ({}))
  return { status: res.status, ok: res.ok, error: data.error?.message }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function main() {
  const tools = require('../data/tools.json')
  const urls = tools.map((t) => `${SITE_URL}/${t.slug}`).slice(0, limit)
  console.log(`${urls.length} URLs to submit${dryRun ? ' (dry run, nothing will be sent)' : ''}\n`)

  if (dryRun) {
    urls.forEach((u) => console.log('  ', u))
    return
  }

  const token = await getAccessToken(loadCredentials())
  const results = []

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    const result = await publishUrl(token, url)
    results.push({ url, submittedAt: new Date().toISOString(), ...result })

    const prefix = `[${i + 1}/${urls.length}]`
    if (result.ok) {
      console.log(`${prefix} OK   ${url}`)
    } else {
      console.log(`${prefix} FAIL ${url} — ${result.status} ${result.error || ''}`)
    }

    if (result.status === 429) {
      console.log('\nDaily quota exhausted — stopping. Run again tomorrow for the rest.')
      break
    }
    if (result.status === 403) {
      console.log('\nPermission denied — is the service account an Owner in Search Console? Stopping.')
      break
    }
    if (i < urls.length - 1) await sleep(DELAY_MS)
  }

  const ok = results.filter((r) => r.ok).length
  fs.writeFileSync(
    RESULTS_PATH,
    JSON.stringify({ runAt: new Date().toISOString(), succeeded: ok, failed: results.length - ok, results }, null, 2) + '\n'
  )
  console.log(`\nDone: ${ok} succeeded, ${results.length - ok} failed. Results saved to ${RESULTS_PATH}`)
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exitCode = 1
})
