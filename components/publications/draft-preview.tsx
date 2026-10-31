'use client'
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { VisualEditing } from 'next-sanity/visual-editing'

export function DraftPreview() {
  const router = useRouter()
  const refresh = useCallback(async () => { router.refresh() }, [router])
  return <VisualEditing refresh={refresh} />
}
