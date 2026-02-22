// ShawnOS Chat - (c) 2026 Shawn Tenam - See /LICENSE

import { createHmac } from 'crypto'

const SESSION_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

function getSecret(): string {
  return process.env.NIO_CHAT_TOKEN || ''
}

export function createSessionToken(): string {
  const secret = getSecret()
  if (!secret) return ''

  const expiresAt = Date.now() + SESSION_TTL_MS
  const signature = createHmac('sha256', secret)
    .update(String(expiresAt))
    .digest('hex')

  return `${expiresAt}.${signature}`
}

export function validateSessionToken(token: string): boolean {
  const secret = getSecret()
  if (!secret) return true

  const parts = token.split('.')
  if (parts.length !== 2) return false

  const [expiresAtStr, signature] = parts
  const expiresAt = parseInt(expiresAtStr, 10)

  if (isNaN(expiresAt) || Date.now() > expiresAt) return false

  const expected = createHmac('sha256', secret)
    .update(expiresAtStr)
    .digest('hex')

  return signature === expected
}

export function validateToken(request: Request): boolean {
  const token = process.env.NIO_CHAT_TOKEN
  if (!token) return true // no auth in dev mode

  const authHeader = request.headers.get('Authorization')
  if (!authHeader) return false

  const bearer = authHeader.replace('Bearer ', '')

  // Check session token first (new format: expiresAt.hmac)
  if (bearer.includes('.')) {
    return validateSessionToken(bearer)
  }

  // Backward compat: raw token
  return bearer === token
}
