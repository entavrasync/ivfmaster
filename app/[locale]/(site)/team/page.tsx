import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { Footer } from '@/components/shared/Footer'
import { TeamPageContent } from '@/components/team/TeamPageContent'
import type { Locale } from '@/i18n/routing'
import { buildPageMetadata } from '@/lib/seo/metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Team' })

  return buildPageMetadata({
    locale: locale as Locale,
    path: '/team',
    title: t('metaTitle'),
    description: t('metaDescription'),
  })
}

export default function TeamPage() {
  return (
    <>
      <main className="min-h-screen bg-ivory">
        <TeamPageContent />
      </main>
      <Footer />
    </>
  )
}
