import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'
import { SPEECH_PATHS } from '@/lib/speeches-availability'

export async function POST(request: Request) {
  const origin = new URL(request.url).origin
  if (request.headers.get('origin') !== origin) return new Response('Invalid origin', { status: 403 })
  ;(await draftMode()).disable()
  return NextResponse.redirect(new URL(`/en${SPEECH_PATHS.news}`, origin), 303)
}
