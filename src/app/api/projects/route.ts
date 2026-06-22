import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyToken } from '@/lib/auth'

function getUser(req: NextRequest) {
  const h = req.headers.get('authorization')
  if (!h?.startsWith('Bearer ')) return null
  return verifyToken(h.substring(7))
}

// ============ PROJECTS ============

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {}
    if (status && status !== 'ALL') where.status = status
    if (search) where.OR = [
      { name: { contains: search, mode: 'insensitive' as const } },
      { clientName: { contains: search, mode: 'insensitive' as const } },
    ]

    const projects = await prisma.project.findMany({
      where,
      include: { projectManager: { select: { name: true } }, _count: { select: { tasks: true, members: true } } },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json(projects)
  } catch (e) {
    console.error('Projects error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const data = await req.json()
    const year = new Date().getFullYear()
    const count = await prisma.project.count()
    const code = `PRJ-${year}-${String(count + 1).padStart(4, '0')}`

    const project = await prisma.project.create({
      data: {
        code,
        name: data.name,
        description: data.description,
        clientName: data.clientName,
        projectType: data.projectType || 'SOFTWARE_DEVELOPMENT',
        contractValue: data.contractValue || 0,
        budget: data.budget || 0,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        projectManagerId: data.projectManagerId || user.userId,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (e) {
    console.error('Create project error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
