import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import nextTestingServer from 'next/experimental/testing/server.js'

const { unstable_doesMiddlewareMatch } = nextTestingServer
const proxySource = readFileSync(new URL('../proxy.ts', import.meta.url), 'utf8')
const matcherSource = proxySource.match(/matcher:\s*\[\s*'([^']+)'/i)?.[1]

assert.ok(matcherSource, 'proxy.ts must export a static matcher array')

const config = {
  matcher: [JSON.parse('"' + matcherSource + '"') as string],
}

test('does not localize public files with extensions', () => {
  assert.equal(
    unstable_doesMiddlewareMatch({
      config,
      nextConfig: {},
      url: '/google80a692f4c482ca25.html',
    }),
    false,
  )
})

test('does not intercept Next.js internal routes', () => {
  assert.equal(
    unstable_doesMiddlewareMatch({
      config,
      nextConfig: {},
      url: '/_next/webpack-hmr',
    }),
    false,
  )
})

test('continues to localize application routes', () => {
  assert.equal(
    unstable_doesMiddlewareMatch({
      config,
      nextConfig: {},
      url: '/contact',
    }),
    true,
  )
})

test('leaves the Studio root and nested routes outside localization', () => {
  for (const url of [
    '/ivfmaster-studio',
    '/ivfmaster-studio/',
    '/ivfmaster-studio/structure',
    '/ivfmaster-studio/structure/example',
  ]) {
    assert.equal(
      unstable_doesMiddlewareMatch({ config, nextConfig: {}, url }),
      false,
      url,
    )
  }
})

test('draft-mode and media API routes bypass public localization', () => {
  for (const url of ['/api/draft-mode/enable', '/api/draft-mode/disable', '/api/media/instagram']) assert.equal(unstable_doesMiddlewareMatch({ config, nextConfig: {}, url }), false)
})

test('preserves both locales and similarly named public routes', () => {
  for (const url of ['/', '/contact', '/en', '/en/contact', '/ivfmaster-studio-example']) {
    assert.equal(
      unstable_doesMiddlewareMatch({ config, nextConfig: {}, url }),
      true,
      url,
    )
  }
})

const ts = (await import('typescript')).default
const compiled = ts.transpileModule(proxySource, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
const proxyModule = { exports: {} }
new Function('require', 'module', 'exports', compiled)((id: string) => {
  if (id === 'next-intl/middleware') return { default: () => (request: { headers: Headers }) => request.headers }
  if (id === './i18n/routing') return { routing: {} }
  throw new Error('Unexpected dependency: ' + id)
}, proxyModule, proxyModule.exports)
const invoke = (path: string) => Reflect.get(proxyModule.exports, 'default')({ nextUrl: new URL('http://localhost:3002' + path), headers: new Headers({ 'x-ivf-missing-route': 'true' }) })

test('unknown menu URLs skip CMS layout work, while new CMS content routes remain eligible', () => {
  for (const path of ['/shop', '/en/shop', '/unknown/deeper']) {
    assert.equal(invoke(path).get('x-ivf-missing-route'), 'true', path)
  }
  for (const path of ['/', '/en', '/about', '/en/contact', '/procedures/new-cms-procedure', '/en/educate-ivf/new-cms-article', '/team/gorakh-mandrupkar', '/news', '/en/news/new-story', '/events', '/en/events/new-event']) {
    assert.equal(invoke(path).get('x-ivf-missing-route'), 'false', path)
  }
})
