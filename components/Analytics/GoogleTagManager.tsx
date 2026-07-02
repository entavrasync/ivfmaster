import { GoogleTagManager as NextGoogleTagManager } from '@next/third-parties/google'

import { siteConfig } from '@/config/site'

export function GoogleTagManager() {
  if (!siteConfig.analytics.gtmId) return null

  return <NextGoogleTagManager gtmId={siteConfig.analytics.gtmId} />
}
