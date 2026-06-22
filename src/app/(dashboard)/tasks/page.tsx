'use client'

import { useState } from 'react'
import { Plus, Search, Filter, MessageSquare, Paperclip, Calendar } from 'lucide-react'
import { cn, formatDate, getStatusColor, getPriorityIcon } from '@/lib/utils'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

const tasks = [
  { id: 1, taskId: 'PRJ-2026-0001-T001', name: 'Setup Database Schema', project: 'ERP Implementation - PT ABC', assignee: 'Budi Santoso', reporter: 'Siti Rahayu', priority: 'HIGH', status: 'IN_PROGRESS', startDate: '2026-06-20', dueDate: '2026-06-25', comments: 3, attachments: 2 },
  { id: 2, taskId: 'PRJ-2026-0003-T001', name: 'UI Design Review - Checkout Flow', project: 'E-Commerce Platform', assignee: 'Siti Rahayu', reporter: 'Ahmad Wijaya', priority: 'MEDIUM', status: 'REVIEW', startDate: '2026-06-18', dueDate: '2026-06-23', comments: 5, attachments: 1 },
  { id: 3, taskId: 'PRJ-2026-0002-T001', name: 'API Integration Testing', project: 'Digital Transformation', assignee: 'Ahmad Wijaya', reporter: 'Dewi Lestari', priority: 'CRITICAL', status: 'TESTING', startDate: '2026-06-15', dueDate: '2026-06-22', comments: 8, attachments: 4 },
  { id: 4, taskId: 'PRJ-2026-0001-T002', name: 'User Training Material', project: 'ERP Implementation - PT ABC', assignee: 'Dewi Lestari', reporter: 'Budi Santoso', priority: 'LOW', status: 'TO_DO', startDate: '2026-06-25', dueDate: '2026-06-28', comments: 0, attachments: 0 },
  { id: 5, taskId: 'PRJ-2026-0004-T001', name: 'PMO Framework Documentation', project: 'PMO Setup - FIFGROUP', assignee: 'Rina Susanti', reporter: 'Dewi Lestari', priority: 'HIGH', status: 'BACKLOG', startDate: '2026-06-20', dueDate: '2026-07-05', comments: 1, attachments: 0 },
  { id: 6, taskId: 'PRJ-2026-0002-T002', name: 'Data Migration Script', project: 'Digital Transformation', assignee: 'Budi Santoso', reporter: 'Siti Rahayu', priority: 'HIGH', status: 'IN_PROGRESS', startDate: '2026-06-10', dueDate: '2026-06-20', comments: 12, attachments: 3 },
  { id: 7, taskId: 'PRJ-2026-0003-T002', name: 'Payment Gateway Integration', project: 'E-Commerce Platform', assignee: 'Agus Pratama', reporter: 'Ahmad Wijaya', priority: 'CRITICAL', status: 'DONE', startDate: '2026-06-01', dueDate: '2026-06-15', comments: 6, attachments: 2 },
  { id: 8, taskId: 'PRJ-2026-0001-T003', name: 'Inventory Module Config', project: 'ERP Implementation - PT ABC', assignee: 'Siti Rahayu', reporter: 'Budi Santoso', priority: 'MEDIUM', status: 'DONE', startDate: '2026-06-05', dueDate: '2026-06-18', comments: 4, attachments: 1 },
]

export default function TasksPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterPriority, setFilterPriority] = useState('ALL')

  const filtered = tasks.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.project.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = filterStatus === 'ALL' || t.status === filterStatus
    const matchPriority = filterPriority === 'ALL' || t.priority === filterPriority
    return matchSearch && matchStatus && matchPriority
  })

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} isMobileOpen={mobileMenuOpen} onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Tasks</h1>
              <p className="text-muted-foreground">Manage all tasks across projects</p>
            </div>
            <button className="btn-primary"><Plus className="w-4 h-4" /> New Task</button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 flex-1">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Search tasks..." className="bg-transparent border-none outline-none text-sm flex-1" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <select className="input w-full sm:w-40" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="ALL">All Status</option>
              <option value="BACKLOG">Backlog</option>
              <option value="TO_DO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="REVIEW">Review</option>
              <option value="TESTING">Testing</option>
              <option value="DONE">Done</option>
            </select>
            <select className="input w-full sm:w-40" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
              <option value="ALL">All Priority</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          {/* Task List */}
          <div className="space-y-2">
            {filtered.map((task) => (
              <div key={task.id} className="card p-4 card-hover cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <span className="text-lg">{getPriorityIcon(task.priority)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground font-mono">{task.taskId}</span>
                          <span className={cn('badge', getStatusColor(task.status))}>{task.status.replace('_', ' ')}</span>
                        </div>
                        <h3 className="font-medium text-sm">{task.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{task.project}</p>
                      </div>
                      <button className="p-1 rounded hover:bg-accent flex-shrink-0"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Assignee: <span className="text-foreground">{task.assignee}</span></span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Due: {formatDate(task.dueDate)}</span>
                      {task.comments > 0 && <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{task.comments}</span>}
                      {task.attachments > 0 && <span className="flex items-center gap-1"><Paperclip className="w-3 h-3" />{task.attachments}</span>}
                    </div>
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
