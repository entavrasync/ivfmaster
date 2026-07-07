import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google'

import { siteConfig } from '@/config/site'

export function GoogleAnalytics() {
  if (!siteConfig.analytics.gaMeasurementId) return null

  return <NextGoogleAnalytics gaId={siteConfig.analytics.gaMeasurementId} />
}
