'use client'

import { useState } from 'react'

export type PublicationImageValue = { src: string; alt: string; position?: string; width?: number; height?: number }

export function PublicationImage({ images, priority = false, className = '', sizes }: { images: PublicationImageValue[]; priority?: boolean; className?: string; sizes?: string }) {
  const [failed, setFailed] = useState<string[]>([])
  const image = images.find(value => !failed.includes(value.src))
  return <div className={`overflow-hidden bg-lavender ${className}`}>
    {image ? <img src={image.src} alt={image.alt} width={image.width ?? 1200} height={image.height ?? 675}
      srcSet={image.src.startsWith('https://cdn.sanity.io/') ? [480, 800, 1200, 1600].map(width => { const url = new URL(image.src); url.searchParams.set('w', String(width)); return `${url.href} ${width}w` }).join(', ') : undefined}
      sizes={sizes ?? (priority ? '(min-width: 1024px) 60vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw')}
      loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async"
      className="h-full w-full object-cover" style={{ objectPosition: image.position }}
      onError={() => setFailed(previous => [...previous, image.src])}
      onLoad={event => {
        // YouTube returns a tiny default image for missing videos, sometimes with HTTP 200.
        if (image.src.startsWith('https://i.ytimg.com/') && event.currentTarget.naturalWidth <= 120) setFailed(previous => [...previous, image.src])
      }} /> : <div className="relative flex h-full min-h-32 items-center justify-center overflow-hidden bg-[#edf1f6] text-[#879cba]" aria-hidden="true"><svg viewBox="0 0 160 100" fill="none" className="w-36 max-w-[45%]" stroke="currentColor" strokeWidth="1"><path d="M80 83C24 60 33 12 69 27C105 42 113 66 80 83Z" /><path d="M80 83C136 60 127 12 91 27C55 42 47 66 80 83Z" /><circle cx="80" cy="42" r="35" opacity=".3" /></svg></div>}
  </div>
}
