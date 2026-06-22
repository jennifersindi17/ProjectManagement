'use client'

import { useState } from 'react'
import { Plus, Search, MoreVertical, Calendar, Users, DollarSign } from 'lucide-react'
import { cn, formatCurrency, formatDate, getHealthColor, getStatusColor } from '@/lib/utils'
import { useProjects, type Project } from '@/lib/api'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default function ProjectsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')

  const { data: projects, isLoading } = useProjects({
    status: filterStatus,
    search: searchQuery || undefined,
  })

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} isMobileOpen={mobileMenuOpen} onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Projects</h1>
              <p className="text-muted-foreground">Manage all your projects</p>
            </div>
            <button className="btn-primary">
              <Plus className="w-4 h-4" /> New Project
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 flex-1">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Search projects..." className="bg-transparent border-none outline-none text-sm flex-1" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <select className="input w-full sm:w-48" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="ALL">All Status</option>
              <option value="PLANNING">Planning</option>
              <option value="ANALYSIS">Analysis</option>
              <option value="DEVELOPMENT">Development</option>
              <option value="SIT">SIT</option>
              <option value="UAT">UAT</option>
              <option value="GO_LIVE">Go Live</option>
              <option value="SUPPORT">Support</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {(projects || []).map((project: Project & { projectManager?: { name: string }; _count?: { tasks: number; members: number } }) => (
                <div key={project.id as string} className="card p-5 card-hover cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground font-mono">{project.code as string}</span>
                        <span className={cn('badge', getHealthColor(project.health as string))}>
                          {project.health as string}
                        </span>
                      </div>
                      <h3 className="font-semibold truncate">{project.name as string}</h3>
                      <p className="text-sm text-muted-foreground">{project.clientName as string}</p>
                    </div>
                    <button className="p-1 rounded hover:bg-accent"><MoreVertical className="w-4 h-4" /></button>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn('badge', getStatusColor(project.status as string))}>{String(project.status).replace('_', ' ')}</span>
                    <span className="badge bg-muted">{String(project.projectType).replace('_', ' ')}</span>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress as number}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{formatCurrency(Number(project.contractValue))}</div>
                    <div className="flex items-center gap-1"><Users className="w-3 h-3" />{(project._count as Record<string, number>)?.members || 0} members</div>
                    <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(project.endDate as string)}</div>
                    <div className="truncate">PM: {(project.projectManager as Record<string, string>)?.name || '-'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
