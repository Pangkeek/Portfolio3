import { NextRequest, NextResponse } from 'next/server'
import {
  ADMIN_COOKIE_NAME,
  checkRateLimit,
  clearRateLimit,
  createAdminSessionToken,
  isAdminPasswordConfigured,
  isAdminWriteAllowed,
  isAuthenticatedRequest,
  recordFailedAttempt,
  verifyAdminPassword,
} from '@/lib/auth'

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return req.headers.get('x-real-ip') || 'local'
}

export async function GET() {
  if (!isAdminWriteAllowed()) {
    return NextResponse.json(
      {
        authenticated: false,
        enabled: false,
        reason: 'Admin is disabled in production unless ADMIN_ALLOW_PRODUCTION=true is set.',
      },
      { status: 200 }
    )
  }

  if (!isAdminPasswordConfigured()) {
    return NextResponse.json(
      {
        authenticated: false,
        enabled: false,
        reason: 'ADMIN_PASSWORD (min 6 chars) is not configured in .env.local.',
      },
      { status: 200 }
    )
  }

  const authenticated = await isAuthenticatedRequest()
  return NextResponse.json({ authenticated, enabled: true })
}

export async function POST(req: NextRequest) {
  if (!isAdminWriteAllowed()) {
    return NextResponse.json(
      { error: 'Admin access is disabled in production environment.' },
      { status: 403 }
    )
  }

  if (!isAdminPasswordConfigured()) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD is not configured in .env.local.' },
      { status: 503 }
    )
  }

  const ip = getClientIp(req)
  const rateLimit = checkRateLimit(ip)
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: `Too many failed login attempts. Try again in ${rateLimit.retryAfterSec}s.`,
      },
      { status: 429 }
    )
  }

  try {
    const body = await req.json()
    const password = typeof body?.password === 'string' ? body.password : ''

    if (!verifyAdminPassword(password)) {
      recordFailedAttempt(ip)
      return NextResponse.json({ error: 'Invalid admin password.' }, { status: 401 })
    }

    clearRateLimit(ip)
    const token = createAdminSessionToken()
    const response = NextResponse.json({ authenticated: true })

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 12 * 60 * 60,
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false })
  response.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
  return response
}
