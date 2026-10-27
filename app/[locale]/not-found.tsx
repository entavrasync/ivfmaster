import { headers } from 'next/headers'
import { NotFoundPage } from '@/components/shared/NotFoundPage'

export default async function NotFound() {
  // getLocale() loads the request's CMS-backed translations; 404 copy needs none.
  const locale = (await headers()).get('x-next-intl-locale') === 'en' ? 'en' : 'mr'
  return <NotFoundPage locale={locale} />
}
