'use client'

import { useState } from 'react'
import { Users, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

const resources = [
  { id: 1, name: 'Budi Santoso', role: 'Project Manager', capacity: 40, assignedHours: 38, projects: ['ERP Implementation', 'Digital Transformation'], utilization: 95, status: 'overload' },
  { id: 2, name: 'Siti Rahayu', role: 'Business Analyst', capacity: 40, assignedHours: 36, projects: ['ERP Implementation', 'E-Commerce'], utilization: 90, status: 'busy' },
  { id: 3, name: 'Ahmad Wijaya', role: 'Senior Developer', capacity: 40, assignedHours: 40, projects: ['Digital Transformation', 'E-Commerce'], utilization: 100, status: 'overload' },
  { id: 4, name: 'Dewi Lestari', role: 'QA Lead', capacity: 40, assignedHours: 32, projects: ['ERP Implementation', 'PMO Setup'], utilization: 80, status: 'busy' },
  { id: 5, name: 'Agus Pratama', role: 'Developer', capacity: 40, assignedHours: 20, projects: ['E-Commerce'], utilization: 50, status: 'available' },
  { id: 6, name: 'Rina Susanti', role: 'Developer', capacity: 40, assignedHours: 12, projects: ['PMO Setup'], utilization: 30, status: 'available' },
  { id: 7, name: 'Eko Prasetyo', role: 'DevOps Engineer', capacity: 40, assignedHours: 35, projects: ['Digital Transformation'], utilization: 88, status: 'busy' },
  { id: 8, name: 'Maya Anggraini', role: 'UI/UX Designer', capacity: 40, assignedHours: 28, projects: ['E-Commerce', 'ERP Implementation'], utilization: 70, status: 'normal' },
]

export default function ResourcesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const avgUtilization = Math.round(resources.reduce((sum, r) => sum + r.utilization, 0) / resources.length)
  const overloadCount = resources.filter(r => r.status === 'overload').length

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} isMobileOpen={mobileMenuOpen} onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Resource Management</h1>
            <p className="text-muted-foreground">Team allocation and utilization</p>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="card p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1"><Users className="w-4 h-4" /><span className="text-sm">Total Resources</span></div>
              <p className="text-2xl font-bold">{resources.length}</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1"><span className="text-sm">Avg Utilization</span></div>
              <p className="text-2xl font-bold">{avgUtilization}%</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1"><AlertTriangle className="w-4 h-4 text-red-500" /><span className="text-sm">Overloaded</span></div>
              <p className="text-2xl font-bold text-red-500">{overloadCount}</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1"><CheckCircle2 className="w-4 h-4 text-green-500" /><span className="text-sm">Available</span></div>
              <p className="text-2xl font-bold text-green-500">{resources.filter(r => r.status === 'available').length}</p>
            </div>
          </div>

          {/* Resource Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {resources.map((r) => (
              <div key={r.id} className={cn('card p-5 card-hover', r.status === 'overload' && 'border-red-500/50')}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{r.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{r.name}</h3>
                      <p className="text-xs text-muted-foreground">{r.role}</p>
                    </div>
                  </div>
                  {r.status === 'overload' && (
                    <span className="badge bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Overload
                    </span>
                  )}
                </div>

                {/* Utilization Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Utilization</span>
                    <span className={cn('font-medium', r.utilization >= 90 ? 'text-red-500' : r.utilization >= 70 ? 'text-yellow-500' : 'text-green-500')}>{r.utilization}%</span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full transition-all', r.utilization >= 90 ? 'bg-red-500' : r.utilization >= 70 ? 'bg-yellow-500' : 'bg-green-500')} style={{ width: `${r.utilization}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{r.assignedHours}h / {r.capacity}h assigned</span>
                  <span>{r.capacity - r.assignedHours}h available</span>
                </div>

                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Projects:</p>
                  <div className="flex flex-wrap gap-1">
                    {r.projects.map((p) => (
                      <span key={p} className="badge bg-muted text-xs">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
