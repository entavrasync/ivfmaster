import createNextIntlPlugin from 'next-intl/plugin';

// Points next-intl at our server-side request config.
// This wires getTranslations() / getMessages() in Server Components.
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

// Speeches moved from /news and /events. Marathi is the unprefixed default locale,
// so /mr/... goes straight to the canonical unprefixed address.
const speechRedirects = [['/news', '/speeches/medical-professionals'], ['/events', '/speeches/patients']].flatMap(([from, to]) =>
  ['', '/en', '/mr'].flatMap(prefix => {
    const target = (prefix === '/en' ? '/en' : '') + to
    return [
      { source: `${prefix}${from}`, destination: target, permanent: true },
      { source: `${prefix}${from}/:slug`, destination: `${target}/:slug`, permanent: true },
    ]
  }))

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { globalNotFound: true },
  async redirects() { return speechRedirects },
  images: {
    unoptimized: true,
  },
  devIndicators: false,
};

export default withNextIntl(nextConfig);
