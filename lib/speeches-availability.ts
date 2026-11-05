// Temporary hold: set to true to restore Speeches routes, menus and sitemap entries.
export const SPEECHES_ENABLED = false

export function isSpeechesUnavailable(path: string): boolean {
  return !SPEECHES_ENABLED && /^\/(?:(?:en|mr)\/)?(?:news|events)(?:\/|[?#]|$)/.test(path)
}
