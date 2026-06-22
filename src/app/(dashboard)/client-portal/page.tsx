'use client'

import { useState } from 'react'
import { Eye, FileText, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

const clientProjects = [
  { id: 1, name: 'ERP Implementation - PT ABC', progress: 65, status: 'DEVELOPMENT', health: 'GREEN', milestones: [
    { name: 'Requirements Analysis', date: '2026-02-15', status: 'Completed' },
    { name: 'Design Phase', date: '2026-03-30', status: 'Completed' },
    { name: 'Development Phase', date: '2026-05-31', status: 'In Progress' },
    { name: 'SIT', date: '2026-06-30', status: 'Upcoming' },
    { name: 'UAT', date: '2026-07-15', status: 'Upcoming' },
    { name: 'Go Live', date: '2026-07-30', status: 'Upcoming' },
  ]},
]

export default function ClientPortalPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} isMobileOpen={mobileMenuOpen} onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Client Portal</h1>
            <p className="text-muted-foreground">View your project progress and updates</p>
          </div>

          {clientProjects.map((project) => (
            <div key={project.id} className="space-y-6">
              {/* Project Overview */}
              <div className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">{project.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn('badge', project.health === 'GREEN' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-700')}>{project.health}</span>
                      <span className="badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{project.status}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{project.progress}%</p>
                    <p className="text-xs text-muted-foreground">Complete</p>
                  </div>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${project.progress}%` }} />
                </div>
              </div>

              {/* Milestones */}
              <div className="card p-6">
                <h3 className="font-semibold mb-4">Milestones</h3>
                <div className="space-y-3">
                  {project.milestones.map((ms, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                        ms.status === 'Completed' && 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
                        ms.status === 'In Progress' && 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
                        ms.status === 'Upcoming' && 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                      )}>
                        {ms.status === 'Completed' ? <CheckCircle2 className="w-4 h-4" /> : ms.status === 'In Progress' ? <Clock className="w-4 h-4" /> : <span className="text-xs">{i + 1}</span>}
                      </div>
                      <div className="flex-1">
                        <p className={cn('text-sm font-medium', ms.status === 'Completed' && 'line-through text-muted-foreground')}>{ms.name}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(ms.date)}</p>
                      </div>
                      <span className={cn('badge text-xs',
                        ms.status === 'Completed' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
                        ms.status === 'In Progress' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
                        ms.status === 'Upcoming' && 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      )}>{ms.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center dark:bg-blue-900/30"><FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div>
                  <div><p className="text-lg font-bold">12</p><p className="text-xs text-muted-foreground">Documents</p></div>
                </div>
                <div className="card p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center dark:bg-red-900/30"><AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" /></div>
                  <div><p className="text-lg font-bold">2</p><p className="text-xs text-muted-foreground">Open Issues</p></div>
                </div>
                <div className="card p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center dark:bg-green-900/30"><CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" /></div>
                  <div><p className="text-lg font-bold">85%</p><p className="text-xs text-muted-foreground">UAT Progress</p></div>
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  )
}
