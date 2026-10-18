import { existsSync } from 'node:fs'
import { registerHooks } from 'node:module'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)
// Node does not implement Next's aliases or static image imports. Mock only that
// bundler boundary; HTTP tests below exercise the real production assets.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith('@/')) return nextResolve(new URL(specifier.slice(2), root).href, context)
    try { return nextResolve(specifier, context) }
    catch (error) {
      if (!specifier.startsWith('.') || !context.parentURL?.startsWith(root.href) || context.parentURL.includes('/node_modules/')) throw error
      for (const suffix of ['.ts', '/index.ts']) {
        const url = new URL(specifier + suffix, context.parentURL)
        if (existsSync(url)) return nextResolve(url.href, context)
      }
      throw error
    }
  },
  load(url, context, nextLoad) {
    if (url.startsWith(root.href) && /\.(png|jpe?g|webp|avif)$/.test(url)) {
      if (!existsSync(fileURLToPath(url))) throw new Error('Missing static image fixture')
      return { format: 'module', shortCircuit: true, source: `export default ${JSON.stringify({ src: '/' + url.slice(root.href.length), width: 1, height: 1 })}` }
    }
    return nextLoad(url, context)
  },
})
