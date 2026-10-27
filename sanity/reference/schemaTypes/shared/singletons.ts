/**
 * Documents that must exist exactly once.
 *
 * Sanity has no built-in singleton concept: a document type is a type, and by
 * default an editor can create as many as they like. A second `siteSettings`
 * would be invisible in the Studio list yet catastrophic in the app, because
 * every query fetches by `_id` and would silently keep reading the old one.
 *
 * So a singleton is enforced in three places, and all three read this list:
 *
 *   1. `sanity/structure.ts` — the Studio shows one editable document, opened
 *      by its fixed id. There is no "create new" affordance to reach for.
 *   2. `sanity.config.ts` — the duplicate / delete / create actions are removed
 *      for these types, closing the routes around the structure.
 *   3. GROQ — every query targets the fixed `_id`, so even if a stray document
 *      were created by the API it could never reach the site.
 *
 * The id and the type name are deliberately identical. It costs nothing and it
 * makes `*[_id == "siteSettings"]` self-explanatory in the Vision plugin.
 */

export interface SingletonDefinition {
  /** The document's fixed `_id`, and the value every GROQ query filters on. */
  readonly id: string
  /** The schema type name. */
  readonly type: string
  /** How the document is listed in the Studio sidebar. */
  readonly title: string
}

export const SINGLETONS = [
  { id: 'educationPage', type: 'educationPage', title: 'IVF education page' },
  {
    id: 'siteSettings',
    type: 'siteSettings',
    title: 'Site settings',
  },
  {
    id: 'navigation',
    type: 'navigation',
    title: 'Navigation',
  },
  {
    id: 'footer',
    type: 'footer',
    title: 'Footer',
  },
  {
    id: 'homePage',
    type: 'homePage',
    title: 'Home page',
  },
  {
    id: 'proceduresPage',
    type: 'proceduresPage',
    title: 'Procedures page',
  },
  {
    id: 'teamPage',
    type: 'teamPage',
    title: 'Team page',
  },
  {
    id: 'aboutPage',
    type: 'aboutPage',
    title: 'About page',
  },
  { id: 'teamValues', type: 'teamValues', title: 'Team Values' },
  {
    id: 'contactPage',
    type: 'contactPage',
    title: 'Contact page',
  },
] as const satisfies readonly SingletonDefinition[]

export const SINGLETON_TYPES: ReadonlySet<string> = new Set(
  SINGLETONS.map((singleton) => singleton.type),
)
