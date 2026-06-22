'use client'

import { useState } from 'react'
import { Plus, Clock, Calendar, CheckCircle2, XCircle } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

const timesheetData = [
  { id: 1, date: '2026-06-20', project: 'ERP Implementation', task: 'Database Schema', activity: 'Design and setup', hours: 8, status: 'APPROVED', notes: 'Completed initial schema' },
  { id: 2, date: '2026-06-20', project: 'Digital Transformation', task: 'API Integration', activity: 'Development', hours: 6, status: 'SUBMITTED', notes: 'Working on REST endpoints' },
  { id: 3, date: '2026-06-21', project: 'E-Commerce', task: 'UI Design', activity: 'Review', hours: 4, status: 'DRAFT', notes: 'Review checkout flow' },
  { id: 4, date: '2026-06-21', project: 'ERP Implementation', task: 'Testing', activity: 'Unit Testing', hours: 3, status: 'REJECTED', notes: 'Need more test cases' },
  { id: 5, date: '2026-06-22', project: 'PMO Setup', task: 'Documentation', activity: 'Framework docs', hours: 5, status: 'APPROVED', notes: '' },
]

export default function TimesheetPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const totalHours = timesheetData.reduce((sum, t) => sum + t.hours, 0)
  const approvedHours = timesheetData.filter(t => t.status === 'APPROVED').reduce((sum, t) => sum + t.hours, 0)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} isMobileOpen={mobileMenuOpen} onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Timesheet</h1>
              <p className="text-muted-foreground">Track your work hours</p>
            </div>
            <button className="btn-primary"><Plus className="w-4 h-4" /> Add Entry</button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="card p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1"><Clock className="w-4 h-4" /><span className="text-sm">Total Hours</span></div>
              <p className="text-2xl font-bold">{totalHours}h</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1"><CheckCircle2 className="w-4 h-4" /><span className="text-sm">Approved</span></div>
              <p className="text-2xl font-bold text-green-500">{approvedHours}h</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1"><Calendar className="w-4 h-4" /><span className="text-sm">Utilization</span></div>
              <p className="text-2xl font-bold">{Math.round((totalHours / 40) * 100)}%</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1"><XCircle className="w-4 h-4" /><span className="text-sm">Pending</span></div>
              <p className="text-2xl font-bold text-yellow-500">{timesheetData.filter(t => t.status === 'SUBMITTED').length}</p>
            </div>
          </div>

          {/* Timesheet Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-3 text-sm font-semibold">Date</th>
                    <th className="text-left p-3 text-sm font-semibold">Project</th>
                    <th className="text-left p-3 text-sm font-semibold">Task</th>
                    <th className="text-left p-3 text-sm font-semibold">Activity</th>
                    <th className="text-center p-3 text-sm font-semibold">Hours</th>
                    <th className="text-left p-3 text-sm font-semibold">Status</th>
                    <th className="text-left p-3 text-sm font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {timesheetData.map((entry) => (
                    <tr key={entry.id} className="border-b border-border last:border-b-0 hover:bg-accent/30">
                      <td className="p-3 text-sm">{formatDate(entry.date)}</td>
                      <td className="p-3 text-sm font-medium">{entry.project}</td>
                      <td className="p-3 text-sm">{entry.task}</td>
                      <td className="p-3 text-sm">{entry.activity}</td>
                      <td className="p-3 text-sm text-center font-medium">{entry.hours}h</td>
                      <td className="p-3">
                        <span className={cn('badge',
                          entry.status === 'APPROVED' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
                          entry.status === 'SUBMITTED' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
                          entry.status === 'DRAFT' && 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
                          entry.status === 'REJECTED' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        )}>{entry.status}</span>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground truncate max-w-[200px]">{entry.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
