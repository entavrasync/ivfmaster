import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

// Called once per request on the server. Returns the locale and its messages.
// next-intl reads the path prefix (or cookie) to determine requestLocale.
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Fall back to default locale if the segment is missing or invalid.
  if (!locale || !(routing.locales as ReadonlyArray<string>).includes(locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    // Dynamic import keeps each locale's JSON out of the shared bundle.
    messages: (await import(`../messages/${locale}.json`)).default,
    // Ensures date/time formatting matches IST throughout the app.
    timeZone: 'Asia/Kolkata',
    formats: {
      dateTime: {
        short: { day: 'numeric' as const, month: 'short' as const, year: 'numeric' as const },
      },
      number: {
        // Useful for displaying large stat numbers like "4,800"
        compact: { notation: 'compact' as const, maximumFractionDigits: 1 },
      },
    },
  };
});
