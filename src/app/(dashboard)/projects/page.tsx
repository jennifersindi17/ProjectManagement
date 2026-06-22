'use client'

import { useState } from 'react'
import { Plus, Search, X, Edit2, FolderKanban } from 'lucide-react'
import { cn, formatCurrency, formatDate, getHealthColor, getStatusColor } from '@/lib/utils'
import { useProjects } from '@/lib/api'
import type { Project } from '@/lib/api'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

const PROJECT_TYPES = ['ERP_IMPLEMENTATION', 'SOFTWARE_DEVELOPMENT', 'IT_CONSULTING', 'DIGITAL_TRANSFORMATION', 'PMO', 'MAINTENANCE']
const STATUSES = ['PLANNING', 'ANALYSIS', 'DEVELOPMENT', 'SIT', 'UAT', 'GO_LIVE', 'SUPPORT', 'CLOSED']
const HEALTHS = ['GREEN', 'YELLOW', 'RED']

const emptyForm = {
  name: '', clientName: '', projectType: 'SOFTWARE_DEVELOPMENT',
  contractValue: '', budget: '', startDate: '', endDate: '',
  status: 'PLANNING', health: 'GREEN',
}

export default function ProjectsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterHealth, setFilterHealth] = useState('ALL')
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const { data: projects, isLoading } = useProjects({
    status: filterStatus,
    search: searchQuery || undefined,
  })

  const allProjects: Project[] = Array.isArray(projects) ? projects : []

  const filtered = allProjects.filter((p) => {
    if (filterHealth !== 'ALL' && p.health !== filterHealth) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return p.name.toLowerCase().includes(q) || p.clientName.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)
    }
    return true
  })

  const openNewForm = () => {
    setFormData(emptyForm)
    setEditingProject(null)
    setFormErrors({})
    setShowForm(true)
  }

  const openEditForm = (project: Project) => {
    setFormData({
      name: project.name,
      clientName: project.clientName,
      projectType: project.projectType,
      contractValue: String(project.contractValue),
      budget: String(project.budget),
      startDate: project.startDate ? project.startDate.substring(0, 10) : '',
      endDate: project.endDate ? project.endDate.substring(0, 10) : '',
      status: project.status,
      health: project.health,
    })
    setEditingProject(project)
    setFormErrors({})
    setShowForm(true)
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.name.trim()) errors.name = 'Project name is required'
    if (!formData.clientName.trim()) errors.clientName = 'Client name is required'
    if (!formData.contractValue || Number(formData.contractValue) <= 0) errors.contractValue = 'Contract value must be greater than 0'
    if (!formData.budget || Number(formData.budget) <= 0) errors.budget = 'Budget must be greater than 0'
    if (!formData.startDate) errors.startDate = 'Start date is required'
    if (!formData.endDate) errors.endDate = 'End date is required'
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      errors.endDate = 'End date must be after start date'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return
    setShowForm(false)
    setEditingProject(null)
    setFormData(emptyForm)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} isMobileOpen={mobileMenuOpen} onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-card rounded-xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-semibold">{editingProject ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-accent transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-5 space-y-4">
              {/* Row 1: Name + Client */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Project Name <span className="text-red-500">*</span></label>
                  <input className="input w-full" placeholder="e.g. ERP Implementation - PT ABC" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Client Name <span className="text-red-500">*</span></label>
                  <input className="input w-full" placeholder="e.g. PT ABC" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} />
                  {formErrors.clientName && <p className="text-xs text-red-500 mt-1">{formErrors.clientName}</p>}
                </div>
              </div>

              {/* Row 2: Type + Status + Health */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Project Type</label>
                  <select className="input w-full" value={formData.projectType} onChange={e => setFormData({...formData, projectType: e.target.value})}>
                    {PROJECT_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Status</label>
                  <select className="input w-full" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Project Health</label>
                  <select className="input w-full" value={formData.health} onChange={e => setFormData({...formData, health: e.target.value})}>
                    {HEALTHS.map(h => (
                      <option key={h} value={h}>
                        {h === 'GREEN' ? '🟢 Green' : h === 'YELLOW' ? '🟡 Yellow' : '🔴 Red'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Contract Value + Budget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Contract Value (Rp) <span className="text-red-500">*</span></label>
                  <input type="number" className="input w-full" placeholder="250000000" value={formData.contractValue} onChange={e => setFormData({...formData, contractValue: e.target.value})} />
                  {formErrors.contractValue && <p className="text-xs text-red-500 mt-1">{formErrors.contractValue}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Budget (Rp) <span className="text-red-500">*</span></label>
                  <input type="number" className="input w-full" placeholder="250000000" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
                  {formErrors.budget && <p className="text-xs text-red-500 mt-1">{formErrors.budget}</p>}
                </div>
              </div>

              {/* Row 4: Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Start Date <span className="text-red-500">*</span></label>
                  <input type="date" className="input w-full" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                  {formErrors.startDate && <p className="text-xs text-red-500 mt-1">{formErrors.startDate}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">End Date <span className="text-red-500">*</span></label>
                  <input type="date" className="input w-full" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                  {formErrors.endDate && <p className="text-xs text-red-500 mt-1">{formErrors.endDate}</p>}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-5 border-t border-border">
              <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSubmit} className="btn-primary">{editingProject ? 'Save Changes' : 'Create Project'}</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Project Master</h1>
              <p className="text-muted-foreground">Manage all your projects — {allProjects.length} total</p>
            </div>
            <button className="btn-primary" onClick={openNewForm}>
              <Plus className="w-4 h-4" /> New Project
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input type="text" placeholder="Search by name, client, or code..." className="bg-transparent border-none outline-none text-sm flex-1" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="p-0.5 rounded hover:bg-background"><X className="w-3 h-3" /></button>}
            </div>
            <select className="input w-full sm:w-44" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="ALL">All Status</option>
              {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
            <select className="input w-full sm:w-44" value={filterHealth} onChange={(e) => setFilterHealth(e.target.value)}>
              <option value="ALL">All Health</option>
              {HEALTHS.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <FolderKanban className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg font-medium mb-1">No projects found</p>
              <p className="text-sm mb-4">Try adjusting your filters or create a new project</p>
              <button className="btn-primary" onClick={openNewForm}><Plus className="w-4 h-4" /> New Project</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((project) => (
                <div key={project.id} className="card p-5 card-hover cursor-pointer group" onClick={() => openEditForm(project)}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground font-mono">{project.code}</span>
                        <span className={cn('badge', getHealthColor(project.health))}>{project.health}</span>
                      </div>
                      <h3 className="font-semibold truncate">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">{project.clientName}</p>
                    </div>
                    <button className="p-1.5 rounded-lg hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); openEditForm(project) }}>
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className={cn('badge', getStatusColor(project.status))}>{project.status.replace(/_/g, ' ')}</span>
                    <span className="badge bg-muted">{project.projectType.replace(/_/g, ' ')}</span>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-3 border-t border-border">
                    <div className="flex items-center gap-1"><span className="font-medium">Value:</span> {formatCurrency(project.contractValue)}</div>
                    <div className="flex items-center gap-1"><span className="font-medium">Budget:</span> {formatCurrency(project.budget)}</div>
                    <div className="flex items-center gap-1"><span className="font-medium">Due:</span> {formatDate(project.endDate)}</div>
                    <div className="truncate"><span className="font-medium">PM:</span> {project.projectManager?.name || '-'}</div>
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
