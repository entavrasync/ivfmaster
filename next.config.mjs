import createNextIntlPlugin from 'next-intl/plugin';

// Points next-intl at our server-side request config.
// This wires getTranslations() / getMessages() in Server Components.
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  devIndicators: false,
};

export default withNextIntl(nextConfig);
