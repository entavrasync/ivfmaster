'use client'
import { useEffect, useRef, useState } from 'react'
import { Play, ExternalLink } from 'lucide-react'
import { PublicationImage, type PublicationImageValue } from './publication-image'
import { publicationLabels } from './copy'
import type { PublicationMediaSource } from '@/sanity/lib/publication-media'

declare global { interface Window { instgrm?: { Embeds: { process: () => void } } } }
let instagramScript: Promise<void> | undefined
function loadInstagramScript() {
  if (window.instgrm) return Promise.resolve()
  if (!instagramScript) instagramScript = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://www.instagram.com/embed.js'; script.async = true
    script.onload = () => resolve(); script.onerror = () => { instagramScript = undefined; script.remove(); reject(new Error('Instagram unavailable')) }
    document.head.appendChild(script)
  })
  return instagramScript
}

export function MediaPreview({ source, images, locale }: { source: PublicationMediaSource; images: PublicationImageValue[]; locale: 'en' | 'mr' }) {
  const [playing, setPlaying] = useState(false), [unavailable, setUnavailable] = useState(false)
  const [loading, setLoading] = useState(false)
  const embed = useRef<HTMLDivElement>(null), container = useRef<HTMLDivElement>(null)
  const t = publicationLabels[locale]
  useEffect(() => {
    if (!playing || source.provider !== 'instagram') return
    let disposed = false
    const observer = new MutationObserver(() => {
      const frame = embed.current?.querySelector('iframe')
      if (frame) { frame.title = 'Instagram'; frame.style.maxWidth = '100%'; frame.style.margin = '0' }
    })
    if (embed.current) observer.observe(embed.current, { childList: true, subtree: true })
    const timer = setTimeout(() => { if (!embed.current?.querySelector('iframe')) { setPlaying(false); setUnavailable(true) } }, 12000)
    loadInstagramScript().then(() => { if (!disposed) window.instgrm?.Embeds.process() }).catch(() => { if (!disposed) { setPlaying(false); setUnavailable(true) } })
    return () => { disposed = true; clearTimeout(timer); observer.disconnect() }
  }, [playing, source.provider])
  return <div ref={container} className="my-6 overflow-hidden rounded-xl border border-[#dfe4ec] bg-white">
    {playing && source.provider === 'instagram' ? <div ref={embed} className="min-h-80"><blockquote className="instagram-media" data-instgrm-permalink={source.url} data-instgrm-version="14"><a href={source.url}>{t.openSource} Instagram</a></blockquote></div>
      : playing && source.provider === 'youtube' ? <iframe className="aspect-video min-h-52 w-full" title={t.play}
      src={`https://www.youtube-nocookie.com/embed/${source.id}?autoplay=1`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" onError={() => { setPlaying(false); setUnavailable(true) }} />
      : <button type="button" className="relative block w-full focus-visible:outline-4 focus-visible:outline-navy"
        disabled={loading} aria-busy={loading} onClick={async () => {
          if (source.provider === 'youtube') setPlaying(true)
          else {
            if ((container.current?.clientWidth ?? 0) < 326) { setUnavailable(true); return }
            setLoading(true); setUnavailable(false)
            try {
              const response = await fetch(`/api/media/instagram?url=${encodeURIComponent(source.url)}`, { signal: AbortSignal.timeout(6000) })
              const result: unknown = await response.json()
              if (response.ok && result && typeof result === 'object' && 'available' in result && result.available === true) setPlaying(true)
              else setUnavailable(true)
            } catch { setUnavailable(true) }
            finally { setLoading(false) }
          }
        }} aria-label={source.provider === 'youtube' ? t.play : t.loadInstagram}>
        <PublicationImage images={images} className="aspect-video" />
        <span className="absolute inset-0 flex items-center justify-center"><span className="flex h-16 w-16 items-center justify-center rounded-full bg-ivory/95 text-navy shadow-lg">{source.provider === 'youtube' ? <Play fill="currentColor" size={24} /> : <ExternalLink size={24} />}</span></span>
      </button>}
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm text-ink/75">
      <span>{source.provider === 'youtube' ? 'YouTube' : 'Instagram'}</span>
      <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 underline underline-offset-4">{t.openSource} {source.provider === 'youtube' ? 'YouTube' : 'Instagram'} <ExternalLink size={14} /></a>
      {unavailable && <p role="status" className="w-full">{t.unavailable}</p>}
    </div>
  </div>
}
