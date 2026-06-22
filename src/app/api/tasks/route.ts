import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyToken } from '@/lib/auth'

function getUser(req: NextRequest) {
  const h = req.headers.get('authorization')
  if (!h?.startsWith('Bearer ')) return null
  return verifyToken(h.substring(7))
}

// ============ TASKS ============

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const projectId = searchParams.get('projectId')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = {}
    if (status && status !== 'ALL') where.status = status
    if (priority && priority !== 'ALL') where.priority = priority
    if (projectId) where.projectId = projectId
    if (search) where.name = { contains: search, mode: 'insensitive' as const }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignee: { select: { name: true } },
        reporter: { select: { name: true } },
        project: { select: { name: true } },
      },
      orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }],
    })

    return NextResponse.json(tasks)
  } catch (e) {
    console.error('Tasks error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const data = await req.json()
    const project = await prisma.project.findUnique({ where: { id: data.projectId } })
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

    const count = await prisma.task.count({ where: { projectId: data.projectId } })
    const taskId = `${project.code}-T${String(count + 1).padStart(3, '0')}`

    const task = await prisma.task.create({
      data: {
        taskId,
        name: data.name,
        description: data.description,
        projectId: data.projectId,
        assigneeId: data.assigneeId,
        reporterId: user.userId,
        priority: data.priority || 'MEDIUM',
        status: 'BACKLOG',
        startDate: data.startDate ? new Date(data.startDate) : null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        estimatedHours: data.estimatedHours,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (e) {
    console.error('Create task error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
