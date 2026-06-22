import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const projectId = searchParams.get('projectId')

    const where: Record<string, unknown> = {}
    if (userId) where.userId = userId
    if (projectId) where.projectId = projectId

    const timesheets = await prisma.timesheet.findMany({
      where,
      include: {
        project: { select: { name: true } },
        user: { select: { name: true } },
        task: { select: { name: true } },
      },
      orderBy: { date: 'desc' },
    })
    return NextResponse.json(timesheets)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
