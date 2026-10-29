import { defineLocations, presentationTool } from 'sanity/presentation'

const locations = (path: string) => defineLocations({
  select: { title: 'title.en', slug: 'slug.current' },
  resolve: doc => ({ locations: doc?.slug ? [
    { title: `${doc.title || 'Preview'} — English`, href: `/en/${path}/${doc.slug}` },
    { title: `${doc.title || 'Preview'} — Marathi`, href: `/${path}/${doc.slug}` },
  ] : [{ title: 'Enter a title and generate a web address to preview.', href: `/en/${path}` }] }),
})
export const publicationPresentation = presentationTool({
  title: 'Website preview',
  previewUrl: { initial: '/en/news', previewMode: { enable: '/api/draft-mode/enable' } },
  resolve: { locations: { news: locations('news'), event: locations('events') } },
})
