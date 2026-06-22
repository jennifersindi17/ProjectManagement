'use client'

import { useState } from 'react'
import { Plus, Search, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

const issues = [
  { id: 1, issueNumber: 'ISS-2026-0001', project: 'ERP Implementation', title: 'Database connection timeout under load', severity: 'CRITICAL', impact: 'High - affects all users', owner: 'Budi Santoso', status: 'OPEN', resolution: null },
  { id: 2, issueNumber: 'ISS-2026-0002', project: 'E-Commerce', title: 'Payment gateway returns 500 error', severity: 'CRITICAL', impact: 'Critical - no checkout possible', owner: 'Agus Pratama', status: 'INVESTIGATION', resolution: null },
  { id: 3, issueNumber: 'ISS-2026-0003', project: 'Digital Transformation', title: 'Report export shows wrong date format', severity: 'MINOR', impact: 'Low - cosmetic issue', owner: 'Siti Rahayu', status: 'FIXED', resolution: 'Fixed date formatter in v2.3.1' },
  { id: 4, issueNumber: 'ISS-2026-0004', project: 'ERP Implementation', title: 'User session expires too quickly', severity: 'MAJOR', impact: 'Medium - user experience', owner: 'Dewi Lestari', status: 'OPEN', resolution: null },
  { id: 5, issueNumber: 'ISS-2026-0005', project: 'PMO Setup', title: 'Dashboard loading slowly', severity: 'MINOR', impact: 'Low - performance', owner: 'Rina Susanti', status: 'CLOSED', resolution: 'Optimized API queries' },
]

export default function IssuesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} isMobileOpen={mobileMenuOpen} onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Issue Management</h1>
              <p className="text-muted-foreground">Track and resolve project issues</p>
            </div>
            <button className="btn-primary"><Plus className="w-4 h-4" /> New Issue</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="card p-4"><p className="text-sm text-muted-foreground">Open</p><p className="text-2xl font-bold text-red-500">{issues.filter(i => i.status === 'OPEN').length}</p></div>
            <div className="card p-4"><p className="text-sm text-muted-foreground">Investigation</p><p className="text-2xl font-bold text-yellow-500">{issues.filter(i => i.status === 'INVESTIGATION').length}</p></div>
            <div className="card p-4"><p className="text-sm text-muted-foreground">Fixed</p><p className="text-2xl font-bold text-blue-500">{issues.filter(i => i.status === 'FIXED').length}</p></div>
            <div className="card p-4"><p className="text-sm text-muted-foreground">Closed</p><p className="text-2xl font-bold text-green-500">{issues.filter(i => i.status === 'CLOSED').length}</p></div>
          </div>

          <div className="space-y-2">
            {issues.map((issue) => (
              <div key={issue.id} className="card p-4 card-hover cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                    issue.severity === 'CRITICAL' && 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
                    issue.severity === 'MAJOR' && 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
                    issue.severity === 'MINOR' && 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                  )}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground font-mono">{issue.issueNumber}</span>
                      <span className={cn('badge',
                        issue.status === 'OPEN' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
                        issue.status === 'INVESTIGATION' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
                        issue.status === 'FIXED' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
                        issue.status === 'CLOSED' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      )}>{issue.status}</span>
                      <span className={cn('badge',
                        issue.severity === 'CRITICAL' && 'bg-red-100 text-red-700',
                        issue.severity === 'MAJOR' && 'bg-orange-100 text-orange-700',
                        issue.severity === 'MINOR' && 'bg-yellow-100 text-yellow-700'
                      )}>{issue.severity}</span>
                    </div>
                    <h3 className="font-medium text-sm">{issue.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{issue.project} · Owner: {issue.owner}</p>
                    {issue.resolution && <p className="text-xs text-green-600 mt-1">Resolution: {issue.resolution}</p>}
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
