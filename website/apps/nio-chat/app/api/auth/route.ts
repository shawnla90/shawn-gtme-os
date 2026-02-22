import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const token = process.env.NIO_CHAT_TOKEN
  if (!token) {
    return NextResponse.json({ ok: true })
  }

  let body: { password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  if (body.password === token) {
    return NextResponse.json({ ok: true, token })
  }

  return NextResponse.json({ ok: false, error: 'Wrong password' }, { status: 401 })
}
