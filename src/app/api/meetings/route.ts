import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const meetings = await prisma.meeting.findMany({
      include: {
        project: { select: { name: true } },
        host: { select: { name: true } },
        participants: { include: { user: { select: { name: true } } } },
        minutes: true,
      },
      orderBy: { date: 'desc' },
    })
    return NextResponse.json(meetings)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
