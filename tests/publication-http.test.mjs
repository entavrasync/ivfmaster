import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

test('built publication routes render actual CMS projections, lifecycle CTAs, metadata and preserved Articles', { skip: process.env.RUN_PUBLICATION_HTTP !== '1', timeout: 120000 }, async t => {
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
  const first = await get('/en/news'), second = await get('/en/news?page=2')
  assert.match(first, /<button[^>]*aria-label="News &amp; Events"/)
  assert(!first.includes('href="/en/news-events"'), 'Dropdown-only headers must not render a parent link')
  assert.equal((first.match(/<article\b/g) ?? []).length, 14, 'All stories are loaded for progressive disclosure')
  assert.equal((first.match(/<div(?=[^>]*data-publication-item=)[^>]*hidden=""/g) ?? []).length, 9, 'Only five stories are initially visible, including featured stories')
  assert.match(first, />Load more</)
  assert.equal((second.match(/<article\b/g) ?? []).length, 14, 'Legacy page URLs still render the complete list')
  assert.match(second, /noindex, follow/)
  assert.match(first, /https:\/\/www.ivfmaster.in\/en\/news/)
  assert.match(await get('/en/news?category=not-a-category'), /No results in this category/)
  assert.match(first, /<button[^>]*id="publication-category"[^>]*role="combobox"/)
  const detail = await get('/en/news/institutional-learning-0')
  assert.match(detail, /NewsArticle/); assert.match(detail, /datePublished/); assert.match(detail, /dateModified/)
  assert.match(detail, /https:\/\/i.ytimg.com\/vi\/M7lc1UVf-VE\/hqdefault.jpg/)
  assert.match(detail, /Load Instagram post/)
  const upcoming = await get('/en/events'), past = await get('/en/events?view=past')
  assert.match(upcoming, /scheduled fertility conversation/); assert.match(upcoming, /postponed fertility conversation/)
  assert(!past.includes('scheduled fertility conversation')); assert.match(past, /held fertility conversation/)
  for (const status of ['scheduled', 'held', 'cancelled', 'postponed']) {
    const html = await get(`/en/events/fertility-conversation-${status}`)
    const registration = html.includes('>Register for this event')
    assert.equal(registration, status === 'scheduled', status)
    if (status === 'held') assert.match(html, /From the event/)
    if (status === 'held') assert.match(html, /href="\/en\/events\?view=past"/)
    if (status === 'cancelled') { assert.match(html, /EventCancelled/); assert.match(html, /This event has been cancelled. Registration is closed/); }
    if (status === 'postponed') { assert.match(html, /New date to be announced/); assert.match(html, /previousStartDate/) }
  }
  for (const path of ['/news', '/events', '/news/institutional-learning-0', '/events/fertility-conversation-held', '/educate-ivf', '/en/educate-ivf/pcos']) await get(path)
  const missing = await fetch(base + '/en/news/not-a-real-story')
  const missingHtml = await missing.text()
  assert.equal(missing.status, 404)
  assert.match(missingHtml, /noindex/)
  const preview = await fetch(base + '/api/draft-mode/enable', { redirect: 'manual' })
  assert([401, 503].includes(preview.status), 'Unauthenticated previews must be rejected')
  assert.equal((await fetch(base + '/api/media/instagram?url=https://localhost/private')).status, 400)
  assert.equal((await fetch(base + '/api/draft-mode/disable', { method: 'POST', headers: { Origin: 'https://example.com' } })).status, 403)
})
