import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { resolveDataRoot } from '@shawnos/shared/lib'

const AVATAR_DIR = path.join(resolveDataRoot(), 'progression', 'avatars')

const MIME: Record<string, string> = {
  '.gif': 'image/gif',
  '.png': 'image/png',
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const resolved = await params
  const pathSegments = resolved.path ?? []
  const filename = pathSegments.join('/')
  if (!filename || filename.includes('..')) {
    return new NextResponse('Bad request', { status: 400 })
  }

  const ext = path.extname(filename)
  if (!MIME[ext]) {
    return new NextResponse('Unsupported type', { status: 400 })
  }

  const filePath = path.join(AVATAR_DIR, filename)
  if (!fs.existsSync(filePath)) {
    return new NextResponse('Not found', { status: 404 })
  }

  const buf = fs.readFileSync(filePath)
  return new NextResponse(buf, {
    headers: { 'Content-Type': MIME[ext], 'Cache-Control': 'public, max-age=3600' },
  })
}
