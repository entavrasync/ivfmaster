/** Only platform URLs are accepted; no arbitrary server-side URL fetching. */
export type PublicationMediaSource = { provider: 'youtube' | 'instagram'; id: string; url: string }

export function parsePublicationMedia(input: unknown): PublicationMediaSource | null {
  if (typeof input !== 'string') return null
  try {
    const url = new URL(input.trim())
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return null
    const host = url.hostname.toLowerCase(), parts = url.pathname.split('/').filter(Boolean)
    let id: string | null = null
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(host)) {
      if (parts.length === 1 && parts[0] === 'watch') id = url.searchParams.get('v')
      else if (parts.length === 2 && ['embed', 'shorts', 'live'].includes(parts[0])) id = parts[1]
    } else if (host === 'youtu.be' && parts.length === 1) id = parts[0]
    if (id && /^[A-Za-z0-9_-]{11}$/.test(id)) return { provider: 'youtube', id, url: `https://www.youtube.com/watch?v=${id}` }
    if (['instagram.com', 'www.instagram.com'].includes(host) && parts.length === 2 && ['p', 'reel', 'tv'].includes(parts[0]) && /^[A-Za-z0-9_-]{5,64}$/.test(parts[1])) {
      return { provider: 'instagram', id: parts[1], url: `https://www.instagram.com/${parts[0]}/${parts[1]}/` }
    }
  } catch { return null }
  return null
}

export const youtubeThumbnail = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
