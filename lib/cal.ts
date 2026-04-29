import crypto from 'crypto'

export function verifyCalWebhook(body: string, signature: string): boolean {
  const secret = process.env.CAL_WEBHOOK_SECRET
  if (!secret) throw new Error('CAL_WEBHOOK_SECRET env var is required')
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex')
  if (expected.length !== signature.length) return false
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}
