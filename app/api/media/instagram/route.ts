import { parsePublicationMedia } from '@/sanity/lib/publication-media'
import { z } from 'zod'

const responseSchema = z.object({ provider_name: z.literal('Instagram'), type: z.literal('rich'), html: z.string().max(100_000) })

/** Return capability only. Provider HTML and tokens never reach our HTML renderer. */
export async function GET(request: Request) {
  const source = parsePublicationMedia(new URL(request.url).searchParams.get('url'))
  if (source?.provider !== 'instagram') return Response.json({ available: false }, { status: 400 })
  const endpoint = new URL('https://graph.facebook.com/v26.0/instagram_oembed')
  endpoint.searchParams.set('url', source.url)
  endpoint.searchParams.set('omitscript', 'true')
  const token = process.env.INSTAGRAM_OEMBED_ACCESS_TOKEN
  try {
    const response = await fetch(endpoint, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      signal: AbortSignal.timeout(4000), redirect: 'error',
      next: { revalidate: 3600 },
    })
    if (!response.ok || Number(response.headers.get('content-length')) > 100_000) return Response.json({ available: false })
    const payload = responseSchema.safeParse(await response.json())
    return Response.json({ available: payload.success && payload.data.html.includes('instagram-media') }, { headers: { 'Cache-Control': 'private, max-age=300' } })
  } catch {
    return Response.json({ available: false })
  }
}
