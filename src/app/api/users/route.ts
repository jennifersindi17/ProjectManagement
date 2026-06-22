import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyToken } from '@/lib/auth'

function getUser(req: NextRequest) {
  const h = req.headers.get('authorization')
  if (!h?.startsWith('Bearer ')) return null
  return verifyToken(h.substring(7))
}

export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, phone: true, department: true, isActive: true, capacity: true },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(users)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
