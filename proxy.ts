import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import type { NextRequest } from 'next/server';

// Intercepts every non-static request.
// For the default locale (mr): rewrites /about → /mr/about internally (URL stays clean).
// For other locales: /hi/about and /en/about are passed through as-is.
// Locale auto-detection is disabled in routing, so the root always serves Marathi.
const localize = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname.replace(/^\/(en|mr)(?=\/|$)/, '').replace(/\/$/, '') || '/';
  const pageExists = ['/', '/about', '/team', '/contact', '/procedures', '/educate-ivf', '/news', '/events'].includes(path)
    || /^\/(procedures|educate-ivf|team|news|events)\/[^/]+$/.test(path);
  // A menu entry cannot create a page. Unknown route shapes need no CMS lookup.
  // Always overwrite this header so a caller cannot select the lightweight layout.
  request.headers.set('x-ivf-missing-route', pageExists ? 'false' : 'true');
  return localize(request);
}

// Match application routes while leaving Studio, Next.js internals and every public
// file (including Search Console verification HTML) untouched.
export const config = {
  matcher: [
    '/((?!_next/|api(?:/|$)|ivfmaster-studio(?:/|$)|favicon\\.ico|.*\\..*).*)',
  ],
};
