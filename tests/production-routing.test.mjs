import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:net'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import path from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const normalize = (html) => html
  .replace(/<script\b(?![^>]*type=["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<link\b[^>]*rel=["'](?:preload|modulepreload|stylesheet)["'][^>]*>/gi, '')
  .replace(/<!--[^]*?-->/g, '')

test('actual production start preserves Marathi rewrites, English routes, redirects, Studio and fallback HTML', {
  skip: process.env.RUN_PRODUCTION_HTTP !== '1', timeout: 120000,
}, async (t) => {
  assert(existsSync(path.join(root, '.next/BUILD_ID')), 'Run the production build first')
  const socket = createServer()
  await new Promise((resolve, reject) => { socket.once('error', reject); socket.listen(0, '127.0.0.1', resolve) })
  const port = socket.address().port
  await new Promise((resolve) => socket.close(resolve))
  // Use the real package start command. A forced 127.0.0.1 bind mismatches
  // NextURL's localhost normalization and turns local rewrites into external requests.
  const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', String(port)], { cwd: root, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
  let output = ''
  server.stdout.on('data', (data) => { output += data })
  server.stderr.on('data', (data) => { output += data })
  t.after(async () => {
    if (server.exitCode === null) {
      const exited = new Promise((resolve) => server.once('exit', resolve))
      server.kill()
      await exited
    }
  })
  const base = `http://localhost:${port}`
  let ready = false
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null) throw new Error('Production server exited before readiness')
    if (output.includes('Ready')) { ready = true; break }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  assert(ready, 'Production server must start')
  const evidence = { command: 'next start --port <isolated-port>', port, routes: [], images: [] }
  const baselineDir = process.env.CMS_HTTP_BASELINE_DIR ? path.resolve(process.env.CMS_HTTP_BASELINE_DIR) : path.join(root, '.next/cache/phase5-audit')
  const paths = existsSync(baselineDir) ? readdirSync(baselineDir).filter((file) => file.startsWith('after_') && file.endsWith('.html')).map((file) => ({ file, route: file.slice(5, -5).replaceAll('_', '/') })) : []
  const fallbackPaths = ['/', '/about', '/team', '/contact', '/procedures', '/procedures/ivf', '/en', '/en/about', '/en/team', '/en/contact', '/en/procedures', '/en/procedures/ivf']
  const pages = paths.length ? paths : fallbackPaths.map((route) => ({ route, file: null }))
  const images = new Set()
  try {
    for (const { route, file } of pages) {
      const response = await fetch(base + route, { redirect: 'manual', signal: AbortSignal.timeout(15000) })
      const html = await response.text()
      const row = { route, status: response.status, location: response.headers.get('location'), baseline: file, baselineEqual: file ? normalize(html) === normalize(readFileSync(path.join(baselineDir, file), 'utf8')) : null }
      evidence.routes.push(row)
      assert.equal(row.status, 200, `${route} must render without a self-redirect`)
      assert.equal(row.location, null)
      assert.match(html, route === '/en' || route.startsWith('/en/') ? /<html[^>]*lang="en"/ : /<html[^>]*lang="mr"/)
      assert.match(html, /rel="canonical"/)
      if (file) assert.equal(row.baselineEqual, true, `${route} changed from saved HTML/metadata/JSON-LD baseline`)
      for (const match of html.matchAll(/<img\b[^>]*src="([^"]+)"/g)) if (match[1].startsWith('/')) images.add(match[1].replaceAll('&amp;', '&'))
    }
    for (const [route, status, location] of [
      ['/mr', 307, '/'], ['/mr/about', 307, '/about'],
      ['/educate-ivf/male-fertility-explained', 308, '/educate-ivf/male-fertility'],
      ['/en/educate-ivf/male-fertility-explained', 308, '/en/educate-ivf/male-fertility'],
      ['/educate-ivf/understanding-pcos', 308, '/educate-ivf/pcos'],
      ['/en/educate-ivf/understanding-pcos', 308, '/en/educate-ivf/pcos'],
      ['/ivfmaster-studio', 200, null], ['/ivfmaster-studio/structure/procedure', 200, null],
      ['/procedures/nonexistent-cms-check', 404, null], ['/en/procedures/nonexistent-cms-check', 404, null],
    ]) {
      const response = await fetch(base + route, { redirect: 'manual', signal: AbortSignal.timeout(15000) })
      const destination = response.headers.get('location')
      evidence.routes.push({ route, status: response.status, location: destination })
      assert.equal(response.status, status, route)
      assert.equal(destination, location, route)
      if (destination) {
        assert.notEqual(destination, route, 'A redirect must not target itself')
        const final = await fetch(new URL(destination, base), { redirect: 'manual' })
        assert.equal(final.status, 200, `${route} must finish after one redirect`)
      }
    }
    for (const image of images) {
      const response = await fetch(base + image, { signal: AbortSignal.timeout(15000) })
      evidence.images.push({ image, status: response.status, contentType: response.headers.get('content-type') })
      assert.equal(response.status, 200, image)
      assert.match(response.headers.get('content-type') ?? '', /^image\//)
    }
  } finally {
    if (process.env.CMS_HTTP_EVIDENCE_DIR) {
      mkdirSync(process.env.CMS_HTTP_EVIDENCE_DIR, { recursive: true })
      writeFileSync(path.join(process.env.CMS_HTTP_EVIDENCE_DIR, 'production-http.json'), JSON.stringify(evidence, null, 2))
    }
  }
})
