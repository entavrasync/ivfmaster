import { defineLocations, presentationTool } from 'sanity/presentation'
import { SPEECH_PATHS } from '../lib/speeches-availability'

const locations = (path: string) => defineLocations({
  select: { title: 'title.en', slug: 'slug.current' },
  resolve: doc => ({ locations: doc?.slug ? [
    { title: `${doc.title || 'Preview'} — English`, href: `/en${path}/${doc.slug}` },
    { title: `${doc.title || 'Preview'} — Marathi`, href: `${path}/${doc.slug}` },
  ] : [{ title: 'Enter a title and generate a web address to preview.', href: `/en${path}` }] }),
})
export const publicationPresentation = presentationTool({
  title: 'Website preview',
  previewUrl: { initial: `/en${SPEECH_PATHS.news}`, previewMode: { enable: '/api/draft-mode/enable' } },
  resolve: { locations: { news: locations(SPEECH_PATHS.news), event: locations(SPEECH_PATHS.event) } },
})
