'use client'

import { useState } from 'react'
import {
  FolderKanban, ListTodo, Users, AlertTriangle, TrendingUp,
  Clock, CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight, Zap
} from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

// Mock data for dashboard
const kpiData = {
  projects: { total: 24, active: 12, completed: 8, delayed: 3, atRisk: 1 },
  tasks: { total: 156, open: 45, inProgress: 38, completed: 62, overdue: 11 },
  resources: { utilization: 78, available: 8, busy: 22 },
}

const recentProjects = [
  { id: 1, name: 'ERP Implementation - PT ABC', client: 'PT ABC', status: 'DEVELOPMENT', health: 'GREEN', progress: 65, budget: 250000000, spent: 162500000 },
  { id: 2, name: 'Digital Transformation - PT XYZ', client: 'PT XYZ', status: 'SIT', health: 'YELLOW', progress: 80, budget: 500000000, spent: 420000000 },
  { id: 3, name: 'Software House - Aplikasi E-Commerce', client: 'CV Maju Jaya', status: 'UAT', health: 'GREEN', progress: 90, budget: 150000000, spent: 120000000 },
  { id: 4, name: 'PMO Setup - FIFGROUP', client: 'FIFGROUP', status: 'PLANNING', health: 'RED', progress: 15, budget: 100000000, spent: 25000000 },
]

const recentTasks = [
  { id: 1, name: 'Setup Database Schema', project: 'ERP Implementation', assignee: 'Budi Santoso', priority: 'HIGH', status: 'IN_PROGRESS', dueDate: '2026-06-25' },
  { id: 2, name: 'UI Design Review', project: 'E-Commerce', assignee: 'Siti Rahayu', priority: 'MEDIUM', status: 'REVIEW', dueDate: '2026-06-23' },
  { id: 3, name: 'API Integration Testing', project: 'Digital Transformation', assignee: 'Ahmad Wijaya', priority: 'CRITICAL', status: 'TESTING', dueDate: '2026-06-22' },
  { id: 4, name: 'User Training Material', project: 'ERP Implementation', assignee: 'Dewi Lestari', priority: 'LOW', status: 'TO_DO', dueDate: '2026-06-28' },
]

const projectProgressData = [
  { month: 'Jan', planned: 20, actual: 18 },
  { month: 'Feb', planned: 35, actual: 32 },
  { month: 'Mar', planned: 50, actual: 48 },
  { month: 'Apr', planned: 65, actual: 60 },
  { month: 'May', planned: 80, actual: 75 },
  { month: 'Jun', planned: 95, actual: 88 },
]

const taskCompletionData = [
  { name: 'Completed', value: 62, color: '#10b981' },
  { name: 'In Progress', value: 38, color: '#f59e0b' },
  { name: 'Open', value: 45, color: '#6b7280' },
  { name: 'Overdue', value: 11, color: '#ef4444' },
]

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileMenuOpen}
        onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here&apos;s your project overview.</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <KPICard
              title="Total Projects"
              value={kpiData.projects.total}
              subtitle={`${kpiData.projects.active} active`}
              icon={FolderKanban}
              color="blue"
              trend={+12}
            />
            <KPICard
              title="Total Tasks"
              value={kpiData.tasks.total}
              subtitle={`${kpiData.tasks.inProgress} in progress`}
              icon={ListTodo}
              color="purple"
              trend={+8}
            />
            <KPICard
              title="Team Utilization"
              value={`${kpiData.resources.utilization}%`}
              subtitle={`${kpiData.resources.busy} busy / ${kpiData.resources.available} available`}
              icon={Users}
              color="green"
              trend={-3}
            />
            <KPICard
              title="Overdue Tasks"
              value={kpiData.tasks.overdue}
              subtitle="Needs attention"
              icon={AlertTriangle}
              color="red"
              trend={+2}
              trendBad
            />
          </div>

          {/* Secondary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <MiniCard label="Active Projects" value={kpiData.projects.active} icon={Zap} color="blue" />
            <MiniCard label="Completed Projects" value={kpiData.projects.completed} icon={CheckCircle2} color="green" />
            <MiniCard label="Delayed Projects" value={kpiData.projects.delayed} icon={Clock} color="yellow" />
            <MiniCard label="At Risk Projects" value={kpiData.projects.atRisk} icon={XCircle} color="red" />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            {/* Project Progress Chart */}
            <div className="card p-5">
              <h3 className="font-semibold mb-4">Project Progress (6 Months)</h3>
              <div className="space-y-3">
                {projectProgressData.map((d) => (
                  <div key={d.month} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-8">{d.month}</span>
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded-full overflow-hidden relative">
                        <div
                          className="absolute inset-y-0 left-0 bg-primary/30 rounded-full"
                          style={{ width: `${d.planned}%` }}
                        />
                        <div
                          className="absolute inset-y-0 left-0 bg-primary rounded-full"
                          style={{ width: `${d.actual}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-medium w-10 text-right">{d.actual}%</span>
                  </div>
                ))}
                <div className="flex items-center gap-4 mt-2 pt-2 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-primary/30" />
                    <span className="text-xs text-muted-foreground">Planned</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-primary" />
                    <span className="text-xs text-muted-foreground">Actual</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Completion Chart */}
            <div className="card p-5">
              <h3 className="font-semibold mb-4">Task Completion</h3>
              <div className="flex items-center justify-center">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {taskCompletionData.reduce<{ elements: JSX.Element[]; offset: number }>((acc, item, i) => {
                      const total = taskCompletionData.reduce((s, d) => s + d.value, 0)
                      const pct = (item.value / total) * 100
                      acc.elements.push(
                        <circle
                          key={i}
                          cx="50" cy="50" r="40"
                          fill="none"
                          stroke={item.color}
                          strokeWidth="12"
                          strokeDasharray={`${pct * 2.51} ${251 - pct * 2.51}`}
                          strokeDashoffset={-acc.offset * 2.51}
                          className="transition-all duration-500"
                        />
                      )
                      acc.offset += pct
                      return acc
                    }, { elements: [], offset: 0 }).elements}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{kpiData.tasks.total}</span>
                    <span className="text-xs text-muted-foreground">Total Tasks</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {taskCompletionData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-muted-foreground">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tables Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Recent Projects */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Recent Projects</h3>
                <a href="/dashboard/projects" className="text-sm text-primary hover:underline">View All</a>
              </div>
              <div className="space-y-3">
                {recentProjects.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                    <div className={cn(
                      'w-2 h-10 rounded-full',
                      p.health === 'GREEN' && 'bg-green-500',
                      p.health === 'YELLOW' && 'bg-yellow-500',
                      p.health === 'RED' && 'bg-red-500'
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.client} · {p.status}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-medium">{p.progress}%</p>
                      <div className="w-16 h-1.5 bg-muted rounded-full mt-1">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${p.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Tasks */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Recent Tasks</h3>
                <a href="/dashboard/tasks" text-sm className="text-sm text-primary hover:underline">View All</a>
              </div>
              <div className="space-y-3">
                {recentTasks.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      t.priority === 'CRITICAL' && 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
                      t.priority === 'HIGH' && 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
                      t.priority === 'MEDIUM' && 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
                      t.priority === 'LOW' && 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    )}>
                      <span className="text-xs font-bold">{t.priority[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.project} · {t.assignee}</p>
                    </div>
                    <span className={cn('badge', t.status === 'IN_PROGRESS' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
                      t.status === 'REVIEW' && 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
                      t.status === 'TESTING' && 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
                      t.status === 'TO_DO' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    )}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function KPICard({ title, value, subtitle, icon: Icon, color, trend, trendBad }: {
  title: string
  value: string | number
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  trend?: number
  trendBad?: boolean
}) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  }

  return (
    <div className="card p-5 card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', colorMap[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-3">
          {trendBad ? (
            <ArrowUpRight className="w-3.5 h-3.5 text-red-500" />
          ) : trend >= 0 ? (
            <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
          )}
          <span className={cn('text-xs font-medium', (trendBad ? trend >= 0 : trend >= 0) ? 'text-green-500' : 'text-red-500')}>
            {Math.abs(trend)}% from last month
          </span>
        </div>
      )}
    </div>
  )
}

function MiniCard({ label, value, icon: Icon, color }: {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: string
}) {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    red: 'text-red-500',
  }

  return (
    <div className="card p-4 flex items-center gap-3">
      <Icon className={cn('w-5 h-5', colorMap[color])} />
      <div>
        <p className="text-lg font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}
