import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { isAdminWriteAllowed, isAuthenticatedRequest } from '@/lib/auth'
import { getPortfolioData, PortfolioData, savePortfolioData } from '@/lib/portfolio'

export async function GET() {
  try {
    const data = await getPortfolioData()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to read portfolio data:', error)
    return NextResponse.json({ error: 'Failed to load portfolio data.' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!isAdminWriteAllowed()) {
    return NextResponse.json(
      { error: 'Admin write operations are disabled in production.' },
      { status: 403 }
    )
  }

  const authenticated = await isAuthenticatedRequest()
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 })
  }

  try {
    const body = (await req.json()) as PortfolioData
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid portfolio payload.' }, { status: 400 })
    }

    const updated = await savePortfolioData(body)
    revalidatePath('/')
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Failed to save portfolio data:', error)
    return NextResponse.json({ error: 'Failed to save portfolio data.' }, { status: 500 })
  }
}
