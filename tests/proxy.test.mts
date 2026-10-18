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

test('preserves both locales and similarly named public routes', () => {
  for (const url of ['/', '/contact', '/en', '/en/contact', '/ivfmaster-studio-example']) {
    assert.equal(
      unstable_doesMiddlewareMatch({ config, nextConfig: {}, url }),
      true,
      url,
    )
  }
})
