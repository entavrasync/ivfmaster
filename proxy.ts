import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Intercepts every non-static request.
// For default locale (en): rewrites /about → /en/about internally (URL stays clean).
// For other locales: /hi/about is passed through as-is.
// Also reads Accept-Language header on first visit to set the initial locale cookie.
export default createMiddleware(routing);

// Match application routes while leaving Next.js internals and every public
// file (including Search Console verification HTML) untouched.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\..*).*)',
  ],
};
