import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyToken } from '@/lib/auth'

function getUser(req: NextRequest) {
  const h = req.headers.get('authorization')
  if (!h?.startsWith('Bearer ')) return null
  return verifyToken(h.substring(7))
}

// ============ DASHBOARD ============

export async function GET(req: NextRequest) {
  try {
    const user = getUser(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const [
      totalProjects, activeProjects, completedProjects, delayedProjects,
      totalTasks, openTasks, inProgressTasks, completedTasks, overdueTasks,
      totalUsers,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: { notIn: ['CLOSED', 'GO_LIVE'] } } }),
      prisma.project.count({ where: { status: 'CLOSED' } }),
      prisma.project.count({ where: { health: 'RED' } }),
      prisma.task.count(),
      prisma.task.count({ where: { status: 'BACKLOG' } }),
      prisma.task.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { status: 'DONE' } }),
      prisma.task.count({ where: { dueDate: { lt: new Date() }, status: { not: 'DONE' } } }),
      prisma.user.count(),
    ])

    const recentProjects = await prisma.project.findMany({
      take: 5, orderBy: { updatedAt: 'desc' },
      include: { projectManager: { select: { name: true } } },
    })

    const recentTasks = await prisma.task.findMany({
      take: 5, orderBy: { updatedAt: 'desc' },
      include: { assignee: { select: { name: true } }, project: { select: { name: true } } },
    })

    const notifications = await prisma.notification.findMany({
      where: { userId: user.userId, isRead: false },
      take: 5, orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      kpi: {
        projects: { total: totalProjects, active: activeProjects, completed: completedProjects, delayed: delayedProjects },
        tasks: { total: totalTasks, open: openTasks, inProgress: inProgressTasks, completed: completedTasks, overdue: overdueTasks },
        teamSize: totalUsers,
      },
      recentProjects,
      recentTasks,
      notifications,
    })
  } catch (e) {
    console.error('Dashboard error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
