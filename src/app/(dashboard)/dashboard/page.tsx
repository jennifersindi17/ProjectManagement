'use client'

import { useDashboard } from '@/lib/api'
import { cn, formatCurrency } from '@/lib/utils'
import {
  FolderKanban, ListTodo, Users, AlertTriangle, TrendingUp,
  Clock, CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight, Zap
} from 'lucide-react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useState } from 'react'

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { data, isLoading } = useDashboard()

  if (isLoading || !data) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} isMobileOpen={mobileMenuOpen} onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  const { kpi, recentProjects, recentTasks } = data

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} isMobileOpen={mobileMenuOpen} onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here&apos;s your project overview.</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <KPICard title="Total Projects" value={kpi.projects.total} subtitle={`${kpi.projects.active} active`} icon={FolderKanban} color="blue" trend={+12} />
            <KPICard title="Total Tasks" value={kpi.tasks.total} subtitle={`${kpi.tasks.inProgress} in progress`} icon={ListTodo} color="purple" trend={+8} />
            <KPICard title="Team Size" value={kpi.teamSize} subtitle="Active members" icon={Users} color="green" />
            <KPICard title="Overdue Tasks" value={kpi.tasks.overdue} subtitle="Needs attention" icon={AlertTriangle} color="red" trend={+2} trendBad />
          </div>

          {/* Secondary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <MiniCard label="Active Projects" value={kpi.projects.active} icon={Zap} color="blue" />
            <MiniCard label="Completed Projects" value={kpi.projects.completed} icon={CheckCircle2} color="green" />
            <MiniCard label="Delayed Projects" value={kpi.projects.delayed} icon={Clock} color="yellow" />
            <MiniCard label="Overdue Tasks" value={kpi.tasks.overdue} icon={XCircle} color="red" />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            <div className="card p-5">
              <h3 className="font-semibold mb-4">Project Progress</h3>
              <div className="space-y-3">
                {recentProjects.map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className={cn('w-2 h-2 rounded-full flex-shrink-0',
                      p.health === 'GREEN' ? 'bg-green-500' : p.health === 'YELLOW' ? 'bg-yellow-500' : 'bg-red-500'
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-xs font-medium w-8 text-right">{p.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-semibold mb-4">Task Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-green-500">{kpi.tasks.completed}</p>
                  <p className="text-xs text-muted-foreground mt-1">Completed</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-yellow-500">{kpi.tasks.inProgress}</p>
                  <p className="text-xs text-muted-foreground mt-1">In Progress</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-blue-500">{kpi.tasks.open}</p>
                  <p className="text-xs text-muted-foreground mt-1">Open</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-red-500">{kpi.tasks.overdue}</p>
                  <p className="text-xs text-muted-foreground mt-1">Overdue</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="card p-5">
              <h3 className="font-semibold mb-4">Recent Projects</h3>
              <div className="space-y-2">
                {recentProjects.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer">
                    <div className={cn('w-2 h-8 rounded-full',
                      p.health === 'GREEN' ? 'bg-green-500' : p.health === 'YELLOW' ? 'bg-yellow-500' : 'bg-red-500'
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.status} · PM: {p.projectManager?.name}</p>
                    </div>
                    <span className="text-sm font-medium">{p.progress}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-semibold mb-4">Recent Tasks</h3>
              <div className="space-y-2">
                {recentTasks.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer">
                    <div className={cn('w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold',
                      t.priority === 'CRITICAL' && 'bg-red-100 text-red-600 dark:bg-red-900/30',
                      t.priority === 'HIGH' && 'bg-orange-100 text-orange-600 dark:bg-orange-900/30',
                      t.priority === 'MEDIUM' && 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30',
                      t.priority === 'LOW' && 'bg-green-100 text-green-600 dark:bg-green-900/30'
                    )}>{t.priority[0]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.project?.name} · {t.assignee?.name || 'Unassigned'}</p>
                    </div>
                    <span className={cn('badge text-xs',
                      t.status === 'IN_PROGRESS' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
                      t.status === 'DONE' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
                      t.status === 'BACKLOG' && 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
                      t.status === 'REVIEW' && 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                    )}>{t.status.replace('_', ' ')}</span>
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
  title: string; value: string | number; subtitle: string;
  icon: React.ComponentType<{ className?: string }>; color: string; trend?: number; trendBad?: boolean
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
          {trendBad ? <ArrowUpRight className="w-3.5 h-3.5 text-red-500" /> : trend >= 0 ? <ArrowUpRight className="w-3.5 h-3.5 text-green-500" /> : <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />}
          <span className={cn('text-xs font-medium', (trendBad ? trend >= 0 : trend >= 0) ? 'text-green-500' : 'text-red-500')}>
            {Math.abs(trend)}% from last month
          </span>
        </div>
      )}
    </div>
  )
}

function MiniCard({ label, value, icon: Icon, color }: {
  label: string; value: number; icon: React.ComponentType<{ className?: string }>; color: string
}) {
  const colorMap: Record<string, string> = { blue: 'text-blue-500', green: 'text-green-500', yellow: 'text-yellow-500', red: 'text-red-500' }
  return (
    <div className="card p-4 flex items-center gap-3">
      <Icon className={cn('w-5 h-5', colorMap[color])} />
      <div><p className="text-lg font-bold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div>
    </div>
  )
}
