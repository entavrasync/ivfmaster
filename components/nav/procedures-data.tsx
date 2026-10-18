import { useSiteContent } from '@/components/providers/SiteContentContext'

/* ─── Shared procedure menu data — consumed by desktop dropdown + mobile accordion */

export type Procedure = {
  readonly id:          string
  readonly label:       string
  readonly description: string
  readonly href:        string
}

/** Menu copy for the website's own procedures; also the fallback when the CMS is unavailable. */
export const PROCEDURES: ReadonlyArray<Procedure> = [
  {
    id:          'ivf',
    label:       'IVF',
    description: 'The complete journey, explained gently, step by step.',
    href:        '/procedures/ivf',
  },
  {
    id:          'iui',
    label:       'IUI',
    description: 'A simpler first step for the right couples.',
    href:        '/procedures/iui',
  },
  {
    id:          'icsi',
    label:       'ICSI',
    description: 'A precise helping hand when sperm needs support.',
    href:        '/procedures/icsi',
  },
  {
    id:          'embryo-freezing',
    label:       'Embryo freezing',
    description: 'Preserving your best embryos, safely, for the future.',
    href:        '/procedures/embryo-freezing',
  },
]

/** The live menu: every published procedure, including ones added in the CMS. */
export function useNavProcedures(): ReadonlyArray<Procedure> {
  return useSiteContent().procedures ?? PROCEDURES
}
