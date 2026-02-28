import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  const mcPassword = process.env.MC_PASSWORD
  if (!mcPassword) {
    return NextResponse.json({ error: 'Auth not configured' }, { status: 500 })
  }

  if (password !== mcPassword) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })

  // Set auth cookie — httpOnly, secure in production, 30-day expiry
  response.cookies.set('mc-auth', mcPassword, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })

  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete('mc-auth')
  return response
}
