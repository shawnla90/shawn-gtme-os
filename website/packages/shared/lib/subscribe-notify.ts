/**
 * Notification layer for newsletter signups.
 * Sends Telegram message + appends to Google Sheet.
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || ''
const GOOGLE_SHEET_WEBHOOK = process.env.GOOGLE_SHEET_WEBHOOK || ''

export async function notifySignup(email: string, site: string): Promise<void> {
  await Promise.allSettled([
    sendTelegram(email, site),
    appendToSheet(email, site),
  ])
}

async function sendTelegram(email: string, site: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return
  try {
    const text = `📧 New signup!\n\n${email}\nSite: ${site}\nTime: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}`
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'HTML',
      }),
    })
  } catch {
    // Non-fatal
  }
}

async function appendToSheet(email: string, site: string): Promise<void> {
  if (!GOOGLE_SHEET_WEBHOOK) return
  try {
    await fetch(GOOGLE_SHEET_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        site,
        timestamp: new Date().toISOString(),
        source: 'scroll-signup',
      }),
    })
  } catch {
    // Non-fatal
  }
}
