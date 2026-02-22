export function validateToken(request: Request): boolean {
  const token = process.env.NIO_CHAT_TOKEN
  if (!token) return true // no auth in dev mode

  const authHeader = request.headers.get('Authorization')
  if (!authHeader) return false

  const bearer = authHeader.replace('Bearer ', '')
  return bearer === token
}
