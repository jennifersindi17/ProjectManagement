'use client'

import { useState } from 'react'
import { Download, FileText, BarChart2, Users, DollarSign, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

const reportCategories = [
  { id: 'project', title: 'Project Reports', icon: BarChart2, reports: [
    { name: 'Project Progress Report', description: 'Overall project progress across all active projects', lastRun: '2026-06-20' },
    { name: 'Milestone Report', description: 'Milestone completion status and upcoming deadlines', lastRun: '2026-06-18' },
    { name: 'Delay Report', description: 'Projects and tasks that are behind schedule', lastRun: '2026-06-19' },
  ]},
  { id: 'resource', title: 'Resource Reports', icon: Users, reports: [
    { name: 'Resource Utilization', description: 'Team utilization rates and availability', lastRun: '2026-06-20' },
    { name: 'Workload Analysis', description: 'Individual workload distribution and balance', lastRun: '2026-06-17' },
  ]},
  { id: 'financial', title: 'Financial Reports', icon: DollarSign, reports: [
    { name: 'Budget vs Actual', description: 'Compare planned budget against actual spending', lastRun: '2026-06-20' },
    { name: 'Revenue vs Cost', description: 'Revenue generated against project costs', lastRun: '2026-06-15' },
  ]},
]

export default function ReportsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} isMobileOpen={mobileMenuOpen} onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-muted-foreground">Generate and export project reports</p>
          </div>

          {reportCategories.map((cat) => (
            <div key={cat.id} className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <cat.icon className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">{cat.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {cat.reports.map((report, i) => (
                  <div key={i} className="card p-5 card-hover">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-sm">{report.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{report.description}</p>
                      </div>
                      <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Last: {report.lastRun}
                      </span>
                      <div className="flex items-center gap-1">
                        <button className="btn-ghost text-xs px-2 py-1">Excel</button>
                        <button className="btn-ghost text-xs px-2 py-1">PDF</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  )
}
