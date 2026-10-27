import type { ImageValue, ValidationContext } from 'sanity'
import { apiVersion } from '../project'
import { resolveSiteImage } from './site-content-mapping'

/** Use the website's image contract before an upload can silently fall back. */
export async function validateWebsiteImage(value: ImageValue | undefined, context: ValidationContext) {
  if (!value?.asset?._ref) return true // Native assetRequired identifies the missing upload.
  if (!/^image-[A-Za-z0-9]+-\d+x\d+-(jpg|png|webp|avif)$/.test(value.asset._ref)) {
    return { message: 'Choose a JPEG, PNG, WebP or AVIF image.', paths: [['asset']] }
  }
  try {
    const asset = await context.getClient({ apiVersion }).fetch<{
      _id: string; url: string; metadata?: { dimensions?: { width: number; height: number }; lqip?: string }
    } | null>('*[_id == $id && _type == "sanity.imageAsset"][0]{_id,url,metadata{dimensions,lqip}}', { id: value.asset._ref })
    if (!asset || !resolveSiteImage({ ...value, assetId: asset._id, url: asset.url, dimensions: asset.metadata?.dimensions, lqip: asset.metadata?.lqip, alt: 'Image validation' })) {
      return { message: 'This image or its crop cannot be displayed. Select an available image and reset its crop/hotspot.', paths: [['asset']] }
    }
    return true
  } catch {
    return { message: 'Could not verify this image. Check your connection and select it again.', paths: [['asset']] }
  }
}
