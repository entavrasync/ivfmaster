import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Intercepts every non-static request.
// For the default locale (mr): rewrites /about → /mr/about internally (URL stays clean).
// For other locales: /hi/about and /en/about are passed through as-is.
// Locale auto-detection is disabled in routing, so the root always serves Marathi.
export default createMiddleware(routing);

// Match application routes while leaving Next.js internals and every public
// file (including Search Console verification HTML) untouched.
export const config = {
  matcher: [
    '/((?!_next/|favicon\\.ico|.*\\..*).*)',
  ],
};
