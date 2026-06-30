import { cn } from '@/lib/utils'

type ContainerSize = 'default' | 'wide' | 'full'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  /**
   * default — max 1296px, the standard content column used everywhere
   * wide    — max 1480px, for imagery or panels that need more room
   * full    — no max-width, for true full-bleed sections (inner content
   *           should still use a nested <Container default> for alignment)
   */
  size?: ContainerSize
  as?: React.ElementType
}

const maxWidths: Record<ContainerSize, string> = {
  default: 'max-w-[var(--container-max)]',
  wide: 'max-w-[1480px]',
  full: 'max-w-none',
}

/**
 * Global layout container. Wraps every section, nav, and footer so the
 * entire site shares one consistent gutter.
 *
 * Gutter tokens live in globals.css :root — change there to shift margins site-wide:
 *   --gutter-mobile   20px
 *   --gutter-tablet   32px
 *   --gutter-desktop  48px
 */
export function Container({
  children,
  className,
  size = 'default',
  as: Tag = 'div',
}: Readonly<ContainerProps>) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full',
        'px-[var(--gutter-mobile)] sm:px-[var(--gutter-tablet)] lg:px-[var(--gutter-desktop)]',
        maxWidths[size],
        className,
      )}
    >
      {children}
    </Tag>
  )
}
