import crypto from 'crypto'
import { cookies } from 'next/headers'

export const ADMIN_COOKIE_NAME = 'portfolio_admin_token'
const SESSION_TTL_MS = 12 * 60 * 60 * 1000 // 12 hours
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

interface RateLimitEntry {
  failures: number
  firstFailureAt: number
}

const loginAttempts = new Map<string, RateLimitEntry>()

export function isAdminWriteAllowed(): boolean {
  return (
    process.env.NODE_ENV === 'development' ||
    process.env.ADMIN_ALLOW_PRODUCTION === 'true'
  )
}

export function isAdminPasswordConfigured(): boolean {
  const password = process.env.ADMIN_PASSWORD
  return Boolean(password && password.trim().length >= 6)
}

function getSigningSecret(): string {
  const password = process.env.ADMIN_PASSWORD || ''
  const extraSecret = process.env.ADMIN_SECRET || 'portfolio-admin-hmac-v1'
  return `${password}:${extraSecret}`
}

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSec?: number } {
  const now = Date.now()
  const entry = loginAttempts.get(ip)
  if (!entry) {
    return { allowed: true }
  }
  if (now - entry.firstFailureAt > WINDOW_MS) {
    loginAttempts.delete(ip)
    return { allowed: true }
  }
  if (entry.failures >= MAX_ATTEMPTS) {
    const retryAfterSec = Math.ceil((WINDOW_MS - (now - entry.firstFailureAt)) / 1000)
    return { allowed: false, retryAfterSec }
  }
  return { allowed: true }
}

export function recordFailedAttempt(ip: string): void {
  const now = Date.now()
  const entry = loginAttempts.get(ip)
  if (!entry || now - entry.firstFailureAt > WINDOW_MS) {
    loginAttempts.set(ip, { failures: 1, firstFailureAt: now })
  } else {
    entry.failures += 1
  }
}

export function clearRateLimit(ip: string): void {
  loginAttempts.delete(ip)
}

export function verifyAdminPassword(candidate: string): boolean {
  if (!isAdminPasswordConfigured()) {
    return false
  }
  const expected = process.env.ADMIN_PASSWORD!
  const hashA = crypto.createHash('sha256').update(candidate).digest()
  const hashB = crypto.createHash('sha256').update(expected).digest()
  return crypto.timingSafeEqual(hashA, hashB)
}

export function createAdminSessionToken(): string {
  const expiresAt = Date.now() + SESSION_TTL_MS
  const nonce = crypto.randomBytes(16).toString('hex')
  const payload = `${expiresAt}.${nonce}`
  const signature = crypto
    .createHmac('sha256', getSigningSecret())
    .update(payload)
    .digest('hex')
  return `${payload}.${signature}`
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token || !isAdminPasswordConfigured()) {
    return false
  }
  const parts = token.split('.')
  if (parts.length !== 3) {
    return false
  }
  const [expiresAtStr, nonce, signature] = parts
  const expiresAt = Number(expiresAtStr)
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
    return false
  }
  const payload = `${expiresAtStr}.${nonce}`
  const expectedSig = crypto
    .createHmac('sha256', getSigningSecret())
    .update(payload)
    .digest('hex')

  const sigBuf = Buffer.from(signature, 'utf-8')
  const expectedBuf = Buffer.from(expectedSig, 'utf-8')
  if (sigBuf.length !== expectedBuf.length) {
    return false
  }
  return crypto.timingSafeEqual(sigBuf, expectedBuf)
}

export async function isAuthenticatedRequest(): Promise<boolean> {
  if (!isAdminWriteAllowed() || !isAdminPasswordConfigured()) {
    return false
  }
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  return verifyAdminSessionToken(token)
}
