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
