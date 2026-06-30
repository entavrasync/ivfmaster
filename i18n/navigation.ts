import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Locale-aware wrappers for Next.js navigation primitives.
// Use these everywhere instead of next/link and next/navigation.
//
// Link   → automatically prepends /hi or /mr for non-default locales
// useRouter → router.push('/about') navigates to /hi/about when locale is hi
// usePathname → returns the path WITHOUT the locale prefix (e.g. '/about')
// redirect → server-side redirect with locale awareness
export const {
  Link,
  redirect,
  usePathname,
  useRouter,
  getPathname,
} = createNavigation(routing);
