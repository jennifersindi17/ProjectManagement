import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const issues = await prisma.issue.findMany({
      include: { project: { select: { name: true } }, owner: { select: { name: true } } },
      orderBy: [{ severity: 'asc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json(issues)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
