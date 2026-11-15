// Hold switch: set to false to hide Speeches routes, menus and sitemap entries again.
export const SPEECHES_ENABLED = true

/** Public base paths for the two speech types (Sanity types stay `news` and `event`). */
export const SPEECH_PATHS = { news: '/speeches/medical-professionals', event: '/speeches/patients' } as const
export type SpeechKind = keyof typeof SPEECH_PATHS

// Paths used before the rename. Published menus may still reference them, and old links redirect.
const LEGACY_SPEECH_BASES: Record<string, string> = { '/news': SPEECH_PATHS.news, '/events': SPEECH_PATHS.event }

/** Maps a pre-rename `/news` or `/events` path (with optional slug) to its current address. */
export function currentSpeechPath(path: string): string {
  const match = /^(\/news|\/events)(\/[a-z0-9]+(?:-[a-z0-9]+)*)?$/.exec(path)
  return match ? LEGACY_SPEECH_BASES[match[1]] + (match[2] ?? '') : path
}

export function isSpeechesUnavailable(path: string): boolean {
  return !SPEECHES_ENABLED && /^\/(?:(?:en|mr)\/)?speeches\/(?:medical-professionals|patients)(?:\/|[?#]|$)/.test(path)
}
