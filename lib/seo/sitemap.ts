import type { MetadataRoute } from 'next'

import { routing } from '../../i18n/routing.ts'
import { siteConfig } from '../../config/site.ts'
import { ARTICLES } from '../articles.ts'
import { doctors } from '../content/team.ts'
import { PROCEDURES } from '../procedures.ts'
import {
  buildAbsoluteUrl,
  buildLocalizedPath,
  getLocalizedAlternates,
  normalizePath,
} from './routes.ts'

export type SitemapChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]['changeFrequency']
>

const sitemapRouteProfiles = {
  home: { priority: 1, changeFrequency: 'weekly' },
  primaryMarketing: { priority: 0.85, changeFrequency: 'monthly' },
  contact: { priority: 0.9, changeFrequency: 'monthly' },
  treatmentIndex: { priority: 0.9, changeFrequency: 'monthly' },
  treatment: { priority: 0.88, changeFrequency: 'monthly' },
  educationIndex: { priority: 0.75, changeFrequency: 'weekly' },
  educationArticle: { priority: 0.7, changeFrequency: 'monthly' },
  teamIndex: { priority: 0.85, changeFrequency: 'monthly' },
  doctor: { priority: 0.85, changeFrequency: 'monthly' },
  policy: { priority: 0.25, changeFrequency: 'yearly' },
} as const satisfies Record<
  string,
  { readonly priority: number; readonly changeFrequency: SitemapChangeFrequency }
>

export type SitemapRouteKind = keyof typeof sitemapRouteProfiles

export type SitemapRoute = {
  readonly path: string
  readonly kind: SitemapRouteKind
  readonly priority: number
  readonly changeFrequency: SitemapChangeFrequency
  readonly lastModified: Date
}

const siteContentReviewedAt = toUtcDate(siteConfig.seo.contentReviewedAt)

const staticSitemapRoutes: readonly SitemapRoute[] = [
  createSitemapRoute('/', 'home'),
  createSitemapRoute('/about', 'primaryMarketing'),
  createSitemapRoute('/contact', 'contact'),
  createSitemapRoute('/procedures', 'treatmentIndex'),
  createSitemapRoute('/educate-ivf', 'educationIndex'),
  createSitemapRoute('/team', 'teamIndex'),
]

function toUtcDate(value: string | Date): Date {
  if (value instanceof Date) return new Date(value.getTime())

  const normalizedValue = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T00:00:00.000Z`
    : value
  const date = new Date(normalizedValue)

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid sitemap lastModified date: ${value}`)
  }

  return date
}

function readDateProperty(
  source: unknown,
  property: 'updatedAt' | 'lastModified' | 'date'
): string | undefined {
  if (!source || typeof source !== 'object') return undefined

  const value = (source as Record<string, unknown>)[property]

  return typeof value === 'string' ? value : undefined
}

function getContentDate(source: unknown, fallback = siteContentReviewedAt): Date {
  return toUtcDate(
    readDateProperty(source, 'updatedAt') ??
      readDateProperty(source, 'lastModified') ??
      readDateProperty(source, 'date') ??
      fallback
  )
}

function createSitemapRoute(
  path: string,
  kind: SitemapRouteKind,
  lastModified: Date | string = siteContentReviewedAt
): SitemapRoute {
  const profile = sitemapRouteProfiles[kind]

  return {
    path: normalizePath(path),
    kind,
    priority: profile.priority,
    changeFrequency: profile.changeFrequency,
    lastModified: toUtcDate(lastModified),
  }
}

async function getTreatmentRoutes(): Promise<readonly SitemapRoute[]> {
  return PROCEDURES.map((procedure) =>
    createSitemapRoute(
      `/procedures/${procedure.slug}`,
      'treatment',
      getContentDate(procedure)
    )
  )
}

async function getEducationRoutes(): Promise<readonly SitemapRoute[]> {
  return ARTICLES.map((article) =>
    createSitemapRoute(
      `/educate-ivf/${article.slug}`,
      'educationArticle',
      getContentDate(article)
    )
  )
}

async function getDoctorRoutes(): Promise<readonly SitemapRoute[]> {
  return doctors.map((doctor) =>
    createSitemapRoute(`/team/${doctor.slug}`, 'doctor', getContentDate(doctor))
  )
}

function dedupeSitemapRoutes(routes: readonly SitemapRoute[]): readonly SitemapRoute[] {
  const routesByPath = new Map<string, SitemapRoute>()

  for (const route of routes) {
    if (!routesByPath.has(route.path)) {
      routesByPath.set(route.path, route)
    }
  }

  return Array.from(routesByPath.values())
}

export async function getCanonicalSitemapRoutes(): Promise<readonly SitemapRoute[]> {
  const [treatmentRoutes, educationRoutes, doctorRoutes] = await Promise.all([
    getTreatmentRoutes(),
    getEducationRoutes(),
    getDoctorRoutes(),
  ])

  return dedupeSitemapRoutes([
    ...staticSitemapRoutes,
    ...treatmentRoutes,
    ...educationRoutes,
    ...doctorRoutes,
  ])
}

export async function getLocalizedSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const routes = await getCanonicalSitemapRoutes()

  return routes.flatMap((route) =>
    routing.locales.map((locale) => ({
      url: buildAbsoluteUrl(buildLocalizedPath(locale, route.path)),
      lastModified: route.lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: getLocalizedAlternates(route.path),
      },
    }))
  )
}

export async function getLocalizedSitemapPaths(): Promise<readonly string[]> {
  const routes = await getCanonicalSitemapRoutes()

  return routes.flatMap((route) =>
    routing.locales.map((locale) => buildLocalizedPath(locale, route.path))
  )
}
