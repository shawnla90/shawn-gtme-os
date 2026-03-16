/**
 * Shared newsletter subscribe client — calls the site's /api/subscribe route.
 * The API route captures the email server-side before forwarding to Substack,
 * so we never lose a signup even if Substack is down or blocked.
 */

export interface SubscribeResult {
  ok: boolean
  message: string
}

export async function subscribeEmail(email: string): Promise<SubscribeResult> {
  try {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    if (!res.ok) {
      return { ok: false, message: data.error || 'Signup failed' }
    }
    return { ok: true, message: data.message || 'Subscribed' }
  } catch {
    return { ok: false, message: 'Network error' }
  }
}
