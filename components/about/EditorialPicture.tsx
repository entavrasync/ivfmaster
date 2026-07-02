import Image from 'next/image'

import type { EditorialImage } from '@/lib/content/about'
import { cn } from '@/lib/utils'

interface EditorialPictureProps {
  image: EditorialImage
  className?: string
  imageClassName?: string
  priority?: boolean
  sizes: string
}

export function EditorialPicture({
  image,
  className,
  imageClassName,
  priority = false,
  sizes,
}: EditorialPictureProps) {
  return (
    <picture className={cn('block overflow-hidden', className)}>
      <source media="(max-width: 767px)" srcSet={image.mobile.src} />
      <Image
        src={image.desktop}
        alt={image.alt}
        className={cn('h-full w-full object-cover', imageClassName)}
        sizes={sizes}
        priority={priority}
      />
    </picture>
  )
}
