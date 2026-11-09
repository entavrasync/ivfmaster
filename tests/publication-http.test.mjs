import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

test('built speech routes render actual CMS projections, metadata, legacy redirects and preserved Articles', { skip: process.env.RUN_PUBLICATION_HTTP !== '1', timeout: 120000 }, async t => {
  const cwd = fileURLToPath(new URL('../', import.meta.url)), socket = createServer()
  await new Promise((resolve, reject) => { socket.once('error', reject); socket.listen(0, resolve) })
  const port = socket.address().port
  await new Promise(resolve => socket.close(resolve))
  const server = spawn(process.execPath, ['--import', './tests/publication-runtime-fixture.mjs', 'node_modules/next/dist/bin/next', 'start', '--port', String(port)], { cwd, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
  let output = ''
  server.stdout.on('data', chunk => { output += chunk }); server.stderr.on('data', chunk => { output += chunk })
  t.after(async () => { if (server.exitCode === null) { const exit = new Promise(resolve => server.once('exit', resolve)); server.kill(); await exit } })
  const base = `http://localhost:${port}`
  for (let i = 0; !output.includes('Ready') && i < 100; i++) await new Promise(resolve => setTimeout(resolve, 100))
  assert(output.includes('Ready'), output)
  const get = async path => {
    const response = await fetch(base + path), html = await response.text()
    assert.equal(response.status, 200, path)
    return html
  }
  const first = await get('/en/speeches/medical-professionals'), second = await get('/en/speeches/medical-professionals?page=2')
  assert.match(first, /<button[^>]*aria-label="Speeches"/)
  assert(!first.includes('href="/en/news-events"'), 'Dropdown-only headers must not render a parent link')
  assert.equal((first.match(/<article\b/g) ?? []).length, 14, 'All stories are loaded for progressive disclosure')
  assert.equal((first.match(/<div(?=[^>]*data-publication-item=)[^>]*hidden=""/g) ?? []).length, 9, 'Only five stories are initially visible, including featured stories')
  assert.match(first, />Load more</)
  assert.equal((second.match(/<article\b/g) ?? []).length, 14, 'Legacy page URLs still render the complete list')
  assert.match(second, /noindex, follow/)
  assert.match(first, /https:\/\/www.ivfmaster.in\/en\/speeches\/medical-professionals/)
  assert.match(await get('/en/speeches/medical-professionals?category=not-a-category'), /No results in this category/)
  assert.match(first, /<button[^>]*id="publication-category"[^>]*role="combobox"/)
  const detail = await get('/en/speeches/medical-professionals/institutional-learning-0')
  assert.match(detail, /NewsArticle/); assert.match(detail, /datePublished/); assert.match(detail, /dateModified/)
  assert.match(detail, /https:\/\/i.ytimg.com\/vi\/M7lc1UVf-VE\/hqdefault.jpg/)
  assert.match(detail, /Load Instagram post/)
  const edited = await get('/en/speeches/medical-professionals'), fallback = await get('/en/speeches/patients')
  assert.match(edited, /<h1[^>]*>Clinical lectures<\/h1>/)
  assert.match(edited, /Lectures for clinicians\./)
  assert.match(edited, /<title>Clinical lecture archive/)
  assert.match(edited, /name="keywords" content="IVF lectures"/)
  assert.match(edited, /name="robots" content="noindex/)
  assert.match(fallback, /<h1[^>]*>Speeches for Patients<\/h1>/)
  const patient = await get('/en/speeches/patients')
  assert.match(patient, /first patient speech/); assert.match(patient, /third patient speech/)
  assert(!patient.includes('future patient speech'), 'Future-dated patient speeches stay hidden')
  assert(!/Upcoming speeches|Past speeches|Register for this speech/.test(patient), 'Patient listing has no event views or registration')
  assert(patient.includes('href="/en/speeches/patients/fertility-conversation-first"'))
  const patientDetail = await get('/en/speeches/patients/fertility-conversation-first')
  assert.match(patientDetail, /NewsArticle/); assert.match(patientDetail, /datePublished/); assert(!patientDetail.includes('"Event"'))
  assert(patientDetail.includes('https://i.ytimg.com/vi/M7lc1UVf-VE/hqdefault.jpg'))
  assert.equal((await fetch(base + '/en/speeches/patients/fertility-conversation-future')).status, 404)
  assert(first.includes('href="/en/speeches/medical-professionals"'), 'The legacy /news menu path is normalised')
  for (const path of ['/speeches/medical-professionals', '/speeches/patients', '/speeches/medical-professionals/institutional-learning-0', '/speeches/patients/fertility-conversation-second', '/educate-ivf', '/en/educate-ivf/pcos']) await get(path)
  for (const [from, to] of [['/news', '/speeches/medical-professionals'], ['/en/events', '/en/speeches/patients'], ['/mr/news/institutional-learning-0', '/speeches/medical-professionals/institutional-learning-0'], ['/events/fertility-conversation-first?category=x', '/speeches/patients/fertility-conversation-first?category=x']]) {
    const moved = await fetch(base + from, { redirect: 'manual' })
    assert.equal(moved.status, 308, from); assert.equal(new URL(moved.headers.get('location'), base).pathname + new URL(moved.headers.get('location'), base).search, to, from)
  }
  const missing = await fetch(base + '/en/speeches/medical-professionals/not-a-real-story')
  const missingHtml = await missing.text()
  assert.equal(missing.status, 404)
  assert.match(missingHtml, /noindex/)
  const preview = await fetch(base + '/api/draft-mode/enable', { redirect: 'manual' })
  assert([401, 503].includes(preview.status), 'Unauthenticated previews must be rejected')
  assert.equal((await fetch(base + '/api/media/instagram?url=https://localhost/private')).status, 400)
  assert.equal((await fetch(base + '/api/draft-mode/disable', { method: 'POST', headers: { Origin: 'https://example.com' } })).status, 403)
})
