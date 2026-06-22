'use client'

import { useState } from 'react'
import { Bell, Check, Trash2, AlertTriangle, Clock, UserPlus, CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

const notifications = [
  { id: 1, type: 'TASK_OVERDUE', title: 'Task Overdue', message: 'ERP Module Development is 2 days overdue', time: '5 minutes ago', read: false, icon: AlertTriangle, color: 'text-red-500 bg-red-100 dark:bg-red-900/30' },
  { id: 2, type: 'NEW_ASSIGNMENT', title: 'New Assignment', message: 'You have been assigned to UAT Testing task', time: '1 hour ago', read: false, icon: UserPlus, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
  { id: 3, type: 'APPROVAL_REQUEST', title: 'Approval Request', message: 'Timesheet for Week 25 needs your approval', time: '2 hours ago', read: false, icon: CheckCircle2, color: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30' },
  { id: 4, type: 'MEETING_REMINDER', title: 'Meeting Reminder', message: 'Sprint Review meeting starts in 30 minutes', time: '30 minutes ago', read: true, icon: Clock, color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30' },
  { id: 5, type: 'PROJECT_DELAY', title: 'Project Delay', message: 'Digital Transformation project is delayed by 3 days', time: '3 hours ago', read: true, icon: XCircle, color: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30' },
  { id: 6, type: 'TASK_DUE', title: 'Task Due Tomorrow', message: 'Database Schema task is due tomorrow', time: '5 hours ago', read: true, icon: Clock, color: 'text-cyan-500 bg-cyan-100 dark:bg-cyan-900/30' },
]

export default function NotificationsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [filter, setFilter] = useState('all')

  const filtered = notifications.filter(n => filter === 'all' || (filter === 'unread' && !n.read))

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} isMobileOpen={mobileMenuOpen} onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">Stay updated with project activities</p>
            </div>
            <button className="btn-ghost text-sm">Mark All as Read</button>
          </div>

          <div className="flex gap-1 mb-6 bg-muted rounded-lg p-1 w-fit">
            <button onClick={() => setFilter('all')} className={cn('px-4 py-2 rounded-md text-sm font-medium transition-colors', filter === 'all' ? 'bg-background shadow-sm' : 'hover:bg-background/50')}>All</button>
            <button onClick={() => setFilter('unread')} className={cn('px-4 py-2 rounded-md text-sm font-medium transition-colors', filter === 'unread' ? 'bg-background shadow-sm' : 'hover:bg-background/50')}>Unread ({notifications.filter(n => !n.read).length})</button>
          </div>

          <div className="space-y-2">
            {filtered.map((n) => (
              <div key={n.id} className={cn('card p-4 card-hover cursor-pointer', !n.read && 'border-l-4 border-l-primary')}>
                <div className="flex items-start gap-3">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', n.color)}>
                    <n.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm">{n.title}</h3>
                      {!n.read && <span className="w-2 h-2 bg-primary rounded-full" />}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!n.read && <button className="p-1.5 rounded hover:bg-accent" title="Mark as Read"><Check className="w-4 h-4" /></button>}
                    <button className="p-1.5 rounded hover:bg-accent" title="Delete"><Trash2 className="w-4 h-4" /></button>
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
