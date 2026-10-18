import 'server-only'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '../../i18n/routing'
import { doctors } from '../../lib/team'
import { client } from './client'
import { clinicSettingsQuery, doctorsQuery } from './clinic-queries'
import { resolveClinicSettings, resolveDoctors } from './clinic-mapping'

export async function getDoctorContent(locale: Locale) {
  try {
    const input = await client.fetch<unknown>(doctorsQuery, { slugs: doctors.map((d) => d.slug) }, { cache: 'force-cache', next: { revalidate: 60, tags: ['doctors'] } })
    const result = resolveDoctors(input, locale)
    if (result.status === 'invalid' || result.status === 'ambiguous') console.error('[doctors] Invalid or ambiguous approved content; retaining existing profiles.')
    return result.doctors
  } catch {
    console.error('[doctors] CMS read failed; retaining existing profiles.')
    return []
  }
}

export async function getTeamDoctors(locale: Locale) {
  const [t, content] = await Promise.all([getTranslations({ locale, namespace: 'Team' }), getDoctorContent(locale)])
  return doctors.map((doctor, index) => {
    const prefix = `doctors.${doctor.messageKey}` as const
    const cms = content.find((record) => record.slug === doctor.slug)
    return {
      ...doctor, order: cms?.order ?? index,
      name: cms?.name ?? t(`${prefix}.name`), title: cms?.title ?? t(`${prefix}.title`),
      essence: cms?.essence ?? t(`${prefix}.essence`), intro: cms?.intro ?? t(`${prefix}.intro`),
      credentials: cms?.credentials ?? t.raw(`${prefix}.credentials`) as string[],
      biography: cms?.biography ?? t.raw(`${prefix}.biography`) as string,
      metaDescription: cms?.metaDescription ?? t(`${prefix}.metaDescription`),
      image: cms?.portrait ? { ...doctor.image, src: cms.portrait.photo.src, position: cms.portrait.position ?? doctor.image.position } : doctor.image,
      imageAlt: cms?.portrait?.alt ?? t(`${prefix}.imageAlt`),
    }
  }).sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug))
}

export async function getClinicSettings(locale: Locale) {
  try {
    const input = await client.fetch<unknown>(clinicSettingsQuery, {}, { cache: 'force-cache', next: { revalidate: 60, tags: ['clinicSettings'] } })
    const result = resolveClinicSettings(input, locale)
    if (result.status === 'invalid' || result.status === 'ambiguous') console.error('[clinicSettings] Invalid or ambiguous approved content; retaining existing clinic information.')
    return result.settings
  } catch {
    console.error('[clinicSettings] CMS read failed; retaining existing clinic information.')
    return null
  }
}
