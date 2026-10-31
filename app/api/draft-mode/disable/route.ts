import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const origin = new URL(request.url).origin
  if (request.headers.get('origin') !== origin) return new Response('Invalid origin', { status: 403 })
  ;(await draftMode()).disable()
  return NextResponse.redirect(new URL('/en/news', origin), 303)
}
