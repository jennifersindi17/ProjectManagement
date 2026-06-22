import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const risks = await prisma.risk.findMany({
      include: { project: { select: { name: true } }, owner: { select: { name: true } } },
      orderBy: { riskScore: 'desc' },
    })
    return NextResponse.json(risks)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
