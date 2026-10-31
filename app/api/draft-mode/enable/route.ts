import { defineEnableDraftMode } from 'next-sanity/draft-mode'
import { client } from '@/sanity/lib/client'

export async function GET(request: Request) {
  const token = process.env.SANITY_API_READ_TOKEN
  if (!token) return new Response('Website preview is unavailable. Ask the site administrator to configure the server-only Sanity read token. Publishing and public pages still work.', { status: 503, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } })
  try {
    return await defineEnableDraftMode({ client: client.withConfig({ token, useCdn: false }) }).GET(request)
  } catch {
    return new Response('Could not verify this preview. Open Website preview from Studio and try again.', { status: 503, headers: { 'Cache-Control': 'no-store' } })
  }
}
