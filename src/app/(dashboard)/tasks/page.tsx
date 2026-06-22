'use client'

import { useState } from 'react'
import { Plus, Search, Calendar } from 'lucide-react'
import { cn, formatDate, getStatusColor, getPriorityIcon } from '@/lib/utils'
import { useTasks } from '@/lib/api'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default function TasksPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterPriority, setFilterPriority] = useState('ALL')

  const { data: tasks, isLoading } = useTasks({
    status: filterStatus,
    priority: filterPriority,
    search: searchQuery || undefined,
  })

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} isMobileOpen={mobileMenuOpen} onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  const taskList = (tasks || []) as Array<{
    id: string; taskId: string; name: string; description?: string | null;
    status: string; priority: string; startDate?: string | null; dueDate?: string | null;
    progress: number; assignee?: { name: string } | null; reporter?: { name: string };
    project: { name: string };
  }>

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

          <div className="space-y-2">
            {taskList.map((task) => (
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
                        <p className="text-xs text-muted-foreground mt-0.5">{task.project.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Assignee: <span className="text-foreground">{task.assignee?.name || 'Unassigned'}</span></span>
                      {task.dueDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Due: {formatDate(task.dueDate)}</span>}
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
