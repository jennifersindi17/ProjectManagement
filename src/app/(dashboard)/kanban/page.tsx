'use client'

import { useState } from 'react'
import { Search, Filter, Plus, MessageSquare, Paperclip } from 'lucide-react'
import { cn, formatDate, getPriorityIcon } from '@/lib/utils'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

const columns = [
  { id: 'BACKLOG', title: 'Backlog', color: 'bg-gray-400' },
  { id: 'TO_DO', title: 'To Do', color: 'bg-blue-400' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-yellow-400' },
  { id: 'REVIEW', title: 'Review', color: 'bg-purple-400' },
  { id: 'TESTING', title: 'Testing', color: 'bg-orange-400' },
  { id: 'DONE', title: 'Done', color: 'bg-green-400' },
]

const kanbanTasks = [
  { id: 1, name: 'Setup CI/CD Pipeline', assignee: 'Budi Santoso', priority: 'HIGH', project: 'ERP Implementation', comments: 2, attachments: 1, dueDate: '2026-06-28', status: 'BACKLOG' },
  { id: 2, name: 'Database Migration Script', assignee: 'Ahmad Wijaya', priority: 'CRITICAL', project: 'Digital Transformation', comments: 5, attachments: 3, dueDate: '2026-06-25', status: 'BACKLOG' },
  { id: 3, name: 'User Registration Module', assignee: 'Siti Rahayu', priority: 'HIGH', project: 'E-Commerce', comments: 3, attachments: 0, dueDate: '2026-06-26', status: 'TO_DO' },
  { id: 4, name: 'Payment Gateway Integration', assignee: 'Agus Pratama', priority: 'CRITICAL', project: 'E-Commerce', comments: 8, attachments: 2, dueDate: '2026-06-24', status: 'TO_DO' },
  { id: 5, name: 'Inventory Module Config', assignee: 'Dewi Lestari', priority: 'MEDIUM', project: 'ERP Implementation', comments: 1, attachments: 1, dueDate: '2026-06-23', status: 'IN_PROGRESS' },
  { id: 6, name: 'API Documentation', assignee: 'Rina Susanti', priority: 'LOW', project: 'Digital Transformation', comments: 0, attachments: 0, dueDate: '2026-06-27', status: 'IN_PROGRESS' },
  { id: 7, name: 'UI Design Review', assignee: 'Siti Rahayu', priority: 'MEDIUM', project: 'E-Commerce', comments: 4, attachments: 2, dueDate: '2026-06-22', status: 'REVIEW' },
  { id: 8, name: 'Security Audit Report', assignee: 'Ahmad Wijaya', priority: 'HIGH', project: 'ERP Implementation', comments: 6, attachments: 1, dueDate: '2026-06-21', status: 'REVIEW' },
  { id: 9, name: 'Performance Testing', assignee: 'Budi Santoso', priority: 'HIGH', project: 'Digital Transformation', comments: 3, attachments: 0, dueDate: '2026-06-20', status: 'TESTING' },
  { id: 10, name: 'UAT Test Cases', assignee: 'Dewi Lestari', priority: 'MEDIUM', project: 'E-Commerce', comments: 2, attachments: 4, dueDate: '2026-06-19', status: 'TESTING' },
  { id: 11, name: 'Login Module', assignee: 'Agus Pratama', priority: 'HIGH', project: 'ERP Implementation', comments: 7, attachments: 2, dueDate: '2026-06-15', status: 'DONE' },
  { id: 12, name: 'Dashboard Wireframe', assignee: 'Rina Susanti', priority: 'LOW', project: 'Digital Transformation', comments: 1, attachments: 1, dueDate: '2026-06-14', status: 'DONE' },
]

export default function KanbanPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [groupBy, setGroupBy] = useState('none')

  const filtered = kanbanTasks.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.assignee.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} isMobileOpen={mobileMenuOpen} onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-x-auto p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Kanban Board</h1>
              <p className="text-muted-foreground">Drag and drop tasks between columns</p>
            </div>
            <div className="flex items-center gap-2">
              <select className="input w-40" value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
                <option value="none">No Grouping</option>
                <option value="assignee">Group by Assignee</option>
                <option value="project">Group by Project</option>
              </select>
              <button className="btn-primary"><Plus className="w-4 h-4" /> Add Task</button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 flex-1 max-w-sm">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Search tasks..." className="bg-transparent border-none outline-none text-sm flex-1" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>

          {/* Kanban Columns */}
          <div className="flex gap-4 min-w-max pb-4">
            {columns.map((col) => {
              const colTasks = filtered.filter(t => t.status === col.id)
              return (
                <div key={col.id} className="w-72 flex-shrink-0">
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className={cn('w-3 h-3 rounded-full', col.color)} />
                    <h3 className="font-semibold text-sm">{col.title}</h3>
                    <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">{colTasks.length}</span>
                  </div>
                  <div className="space-y-2 min-h-[200px] bg-muted/30 rounded-lg p-2">
                    {colTasks.map((task) => (
                      <div key={task.id} className="card p-3 cursor-grab active:cursor-grabbing card-hover bg-card">
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-sm">{getPriorityIcon(task.priority)}</span>
                          <h4 className="text-sm font-medium flex-1">{task.name}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{task.project}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-[10px] font-medium text-primary">{task.assignee.split(' ').map(n => n[0]).join('')}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{task.assignee.split(' ')[0]}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {task.comments > 0 && <span className="flex items-center gap-0.5"><MessageSquare className="w-3 h-3" />{task.comments}</span>}
                            {task.attachments > 0 && <span className="flex items-center gap-0.5"><Paperclip className="w-3 h-3" />{task.attachments}</span>}
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-border">
                          <span className="text-xs text-muted-foreground">Due: {formatDate(task.dueDate)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </main>
      </div>
    </div>
  )
}
