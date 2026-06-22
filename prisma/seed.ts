import { PrismaClient, Role } from '@prisma/client'
import { hashPassword } from '@/lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await hashPassword('admin123')
  const admin = await prisma.user.upsert({
    where: { email: 'admin@projectflow.com' },
    update: {},
    create: {
      email: 'admin@projectflow.com',
      password: adminPassword,
      name: 'Admin User',
      role: Role.SUPER_ADMIN,
      phone: '+62 812 3456 7890',
      department: 'IT',
    },
  })

  // Create team members
  const members = [
    { email: 'budi@projectflow.com', name: 'Budi Santoso', role: Role.PROJECT_MANAGER },
    { email: 'siti@projectflow.com', name: 'Siti Rahayu', role: Role.TEAM_LEAD },
    { email: 'ahmad@projectflow.com', name: 'Ahmad Wijaya', role: Role.DEVELOPER },
    { email: 'dewi@projectflow.com', name: 'Dewi Lestari', role: Role.QA },
    { email: 'agus@projectflow.com', name: 'Agus Pratama', role: Role.DEVELOPER },
    { email: 'rina@projectflow.com', name: 'Rina Susanti', role: Role.DEVELOPER },
    { email: 'eko@projectflow.com', name: 'Eko Prasetyo', role: Role.DEVELOPER },
    { email: 'maya@projectflow.com', name: 'Maya Anggraini', role: Role.TEAM_LEAD },
  ]

  const createdUsers: Record<string, string> = {}
  for (const m of members) {
    const pw = await hashPassword('password123')
    const user = await prisma.user.upsert({
      where: { email: m.email },
      update: {},
      create: { ...m, password: pw },
    })
    createdUsers[m.email] = user.id
  }

  // Create projects
  const projectDefs = [
    { code: 'PRJ-2026-0001', name: 'ERP Implementation - PT ABC', clientName: 'PT ABC', projectType: 'ERP_IMPLEMENTATION', contractValue: 250000000, budget: 250000000, startDate: new Date('2026-01-15T00:00:00Z'), endDate: new Date('2026-07-15T00:00:00Z'), status: 'DEVELOPMENT', health: 'GREEN', progress: 65, pmEmail: 'budi@projectflow.com' },
    { code: 'PRJ-2026-0002', name: 'Digital Transformation - PT XYZ', clientName: 'PT XYZ', projectType: 'DIGITAL_TRANSFORMATION', contractValue: 500000000, budget: 480000000, startDate: new Date('2026-02-01T00:00:00Z'), endDate: new Date('2026-08-30T00:00:00Z'), status: 'SIT', health: 'YELLOW', progress: 80, pmEmail: 'siti@projectflow.com' },
    { code: 'PRJ-2026-0003', name: 'E-Commerce Platform - CV Maju Jaya', clientName: 'CV Maju Jaya', projectType: 'SOFTWARE_DEVELOPMENT', contractValue: 150000000, budget: 150000000, startDate: new Date('2026-03-01T00:00:00Z'), endDate: new Date('2026-06-30T00:00:00Z'), status: 'UAT', health: 'GREEN', progress: 90, pmEmail: 'ahmad@projectflow.com' },
    { code: 'PRJ-2026-0004', name: 'PMO Setup - FIFGROUP', clientName: 'FIFGROUP', projectType: 'PMO', contractValue: 100000000, budget: 100000000, startDate: new Date('2026-06-01T00:00:00Z'), endDate: new Date('2026-09-30T00:00:00Z'), status: 'PLANNING', health: 'RED', progress: 15, pmEmail: 'dewi@projectflow.com' },
  ]

  const createdProjects: Record<string, string> = {}
  for (const p of projectDefs) {
    const existing = await prisma.project.findUnique({ where: { code: p.code } })
    if (!existing) {
      const proj = await prisma.project.create({
        data: {
          code: p.code, name: p.name, clientName: p.clientName, projectType: p.projectType as never,
          contractValue: p.contractValue, budget: p.budget, startDate: p.startDate, endDate: p.endDate,
          status: p.status as never, health: p.health as never, progress: p.progress,
          projectManagerId: createdUsers[p.pmEmail],
        },
      })
      createdProjects[p.code] = proj.id
    } else {
      createdProjects[p.code] = existing.id
    }
  }

  // Create tasks
  const tasks = [
    { name: 'Setup Database Schema', projectCode: 'PRJ-2026-0001', assigneeEmail: 'budi@projectflow.com', priority: 'HIGH', status: 'IN_PROGRESS', dueDate: new Date('2026-06-25T00:00:00Z'), activity: 'Design and setup', hours: 8 },
    { name: 'UI Design Review', projectCode: 'PRJ-2026-0003', assigneeEmail: 'siti@projectflow.com', priority: 'MEDIUM', status: 'REVIEW', dueDate: new Date('2026-06-23T00:00:00Z'), activity: 'Review checkout flow', hours: 4 },
    { name: 'API Integration Testing', projectCode: 'PRJ-2026-0002', assigneeEmail: 'ahmad@projectflow.com', priority: 'CRITICAL', status: 'TESTING', dueDate: new Date('2026-06-22T00:00:00Z'), activity: 'Integration testing', hours: 6 },
    { name: 'User Training Material', projectCode: 'PRJ-2026-0001', assigneeEmail: 'dewi@projectflow.com', priority: 'LOW', status: 'TO_DO', dueDate: new Date('2026-06-28T00:00:00Z'), activity: 'Prepare training docs', hours: 3 },
    { name: 'PMO Framework Documentation', projectCode: 'PRJ-2026-0004', assigneeEmail: 'rina@projectflow.com', priority: 'HIGH', status: 'BACKLOG', dueDate: new Date('2026-07-05T00:00:00Z'), activity: 'Framework docs', hours: 5 },
    { name: 'Data Migration Script', projectCode: 'PRJ-2026-0002', assigneeEmail: 'agus@projectflow.com', priority: 'HIGH', status: 'IN_PROGRESS', dueDate: new Date('2026-06-20T00:00:00Z'), activity: 'Write migration scripts', hours: 8 },
    { name: 'Payment Gateway Integration', projectCode: 'PRJ-2026-0003', assigneeEmail: 'agus@projectflow.com', priority: 'CRITICAL', status: 'DONE', dueDate: new Date('2026-06-15T00:00:00Z'), activity: 'Integrate payment API', hours: 10 },
    { name: 'Inventory Module Config', projectCode: 'PRJ-2026-0001', assigneeEmail: 'siti@projectflow.com', priority: 'MEDIUM', status: 'DONE', dueDate: new Date('2026-06-18T00:00:00Z'), activity: 'Configure inventory', hours: 6 },
  ]

  for (const t of tasks) {
    const projectId = createdProjects[t.projectCode]
    if (!projectId) continue
    const count = await prisma.task.count({ where: { projectId } })
    const taskId = `${t.projectCode}-T${String(count + 1).padStart(3, '0')}`
    const existing = await prisma.task.findUnique({ where: { taskId } })
    if (!existing) {
      await prisma.task.create({
        data: {
          taskId, name: t.name, projectId,
          assigneeId: createdUsers[t.assigneeEmail],
          reporterId: admin.id,
          priority: t.priority as never, status: t.status as never,
          dueDate: new Date(t.dueDate),
        },
      })
    }
  }

  // Create timesheets
  const timesheets = [
    { date: new Date('2026-06-20T00:00:00Z'), projectCode: 'PRJ-2026-0001', email: 'budi@projectflow.com', activity: 'Database design', hours: 8 },
    { date: new Date('2026-06-20T00:00:00Z'), projectCode: 'PRJ-2026-0002', email: 'ahmad@projectflow.com', activity: 'API development', hours: 6 },
    { date: new Date('2026-06-21T00:00:00Z'), projectCode: 'PRJ-2026-0003', email: 'siti@projectflow.com', activity: 'UI review', hours: 4 },
    { date: new Date('2026-06-21T00:00:00Z'), projectCode: 'PRJ-2026-0001', email: 'dewi@projectflow.com', activity: 'Unit testing', hours: 3 },
    { date: new Date('2026-06-22T00:00:00Z'), projectCode: 'PRJ-2026-0004', email: 'rina@projectflow.com', activity: 'Documentation', hours: 5 },
  ]

  for (const ts of timesheets) {
    const projectId = createdProjects[ts.projectCode]
    if (!projectId) continue
    await prisma.timesheet.create({
      data: {
        date: new Date(ts.date), projectId, userId: createdUsers[ts.email],
        activity: ts.activity, hours: ts.hours, status: 'APPROVED',
      },
    })
  }

  // Create meetings
  const meetings = [
    { title: 'Sprint Planning - ERP', date: new Date('2026-06-23T00:00:00Z'), startTime: '09:00', endTime: '11:00', projectCode: 'PRJ-2026-0001', hostEmail: 'budi@projectflow.com' },
    { title: 'UAT Review - E-Commerce', date: new Date('2026-06-22T00:00:00Z'), startTime: '14:00', endTime: '15:30', projectCode: 'PRJ-2026-0003', hostEmail: 'ahmad@projectflow.com' },
    { title: 'Stakeholder Update', date: new Date('2026-06-24T00:00:00Z'), startTime: '10:00', endTime: '11:00', projectCode: 'PRJ-2026-0002', hostEmail: 'siti@projectflow.com' },
  ]

  for (const m of meetings) {
    const projectId = createdProjects[m.projectCode]
    const hostId = createdUsers[m.hostEmail]
    const existing = await prisma.meeting.findFirst({ where: { title: m.title } })
    if (!existing) {
      const meeting = await prisma.meeting.create({
        data: {
          title: m.title, date: new Date(m.date), startTime: m.startTime, endTime: m.endTime,
          projectId, hostId,
        },
      })
      // Add participants
      const participantEmails = [m.hostEmail, 'dewi@projectflow.com']
      for (const email of participantEmails) {
        const uid = createdUsers[email]
        if (uid) {
          await prisma.meetingParticipant.create({
            data: { meetingId: meeting.id, userId: uid },
          })
        }
      }
      // Add MOM
      await prisma.meetingMinute.create({
        data: { meetingId: meeting.id, type: 'ACTION_ITEM', content: 'Prepare test data for UAT', pic: 'Dewi Lestari', dueDate: new Date('2026-06-25T00:00:00Z') },
      })
    }
  }

  // Create issues
  const issues = [
    { title: 'Database connection timeout', projectCode: 'PRJ-2026-0001', severity: 'CRITICAL', status: 'OPEN', ownerEmail: 'budi@projectflow.com' },
    { title: 'Payment gateway 500 error', projectCode: 'PRJ-2026-0003', severity: 'CRITICAL', status: 'INVESTIGATION', ownerEmail: 'agus@projectflow.com' },
    { title: 'Report date format wrong', projectCode: 'PRJ-2026-0002', severity: 'MINOR', status: 'FIXED', ownerEmail: 'siti@projectflow.com', resolution: 'Fixed date formatter' },
  ]

  for (const iss of issues) {
    const projectId = createdProjects[iss.projectCode]
    if (!projectId) continue
    const count = await prisma.issue.count()
    const issueNumber = `ISS-2026-${String(count + 1).padStart(4, '0')}`
    const existing = await prisma.issue.findUnique({ where: { issueNumber } })
    if (!existing) {
      await prisma.issue.create({
        data: {
          issueNumber, projectId, title: iss.title, severity: iss.severity as never,
          status: iss.status as never, ownerId: createdUsers[iss.ownerEmail], resolution: iss.resolution,
        },
      })
    }
  }

  // Create risks
  const risks = [
    { description: 'Key developer may leave', projectCode: 'PRJ-2026-0001', probability: 3, impact: 5, ownerEmail: 'budi@projectflow.com' },
    { description: 'Requirements keep changing', projectCode: 'PRJ-2026-0002', probability: 4, impact: 4, ownerEmail: 'siti@projectflow.com' },
    { description: 'Third-party API deprecation', projectCode: 'PRJ-2026-0003', probability: 2, impact: 5, ownerEmail: 'ahmad@projectflow.com' },
  ]

  for (const r of risks) {
    const projectId = createdProjects[r.projectCode]
    if (!projectId) continue
    const count = await prisma.risk.count()
    const riskId = `RSK-2026-${String(count + 1).padStart(3, '0')}`
    const existing = await prisma.risk.findUnique({ where: { riskId } })
    if (!existing) {
      await prisma.risk.create({
        data: {
          riskId, projectId, description: r.description, probability: r.probability, impact: r.impact,
          riskScore: r.probability * r.impact, ownerId: createdUsers[r.ownerEmail],
        },
      })
    }
  }

  // Create notifications
  await prisma.notification.createMany({
    data: [
      { userId: admin.id, type: 'TASK_OVERDUE', title: 'Task Overdue', message: 'ERP Module Development is 2 days overdue' },
      { userId: admin.id, type: 'NEW_ASSIGNMENT', title: 'New Assignment', message: 'You have been assigned to UAT Testing task' },
      { userId: admin.id, type: 'APPROVAL_REQUEST', title: 'Approval Request', message: 'Timesheet for Week 25 needs approval' },
    ],
  })

  console.log('✅ Seed completed!')
  console.log('Admin: admin@projectflow.com / admin123')
  console.log('Projects: 4 | Tasks: 8 | Timesheets: 5 | Meetings: 3 | Issues: 3 | Risks: 3')
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
