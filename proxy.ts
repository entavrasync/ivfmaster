import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Intercepts every non-static request.
// For default locale (en): rewrites /about → /en/about internally (URL stays clean).
// For other locales: /hi/about is passed through as-is.
// Also reads Accept-Language header on first visit to set the initial locale cookie.
export default createMiddleware(routing);

export const config = {
  // Match every path except Next.js internals and static assets.
  // Without this, the middleware would run on /_next/static/... requests too.
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json)$).*)',
  ],
};
