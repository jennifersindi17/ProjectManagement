'use client'

import { useState } from 'react'
import { Plus, Search, Filter, MoreVertical, Calendar, Users, DollarSign } from 'lucide-react'
import { cn, formatCurrency, formatDate, getHealthColor, getStatusColor } from '@/lib/utils'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

const projects = [
  { id: 1, code: 'PRJ-2026-0001', name: 'ERP Implementation - PT ABC', client: 'PT ABC', type: 'ERP_IMPLEMENTATION', contractValue: 250000000, budget: 250000000, startDate: '2026-01-15', endDate: '2026-07-15', status: 'DEVELOPMENT', health: 'GREEN', progress: 65, pm: 'Budi Santoso', teamSize: 8 },
  { id: 2, code: 'PRJ-2026-0002', name: 'Digital Transformation - PT XYZ', client: 'PT XYZ', type: 'DIGITAL_TRANSFORMATION', contractValue: 500000000, budget: 480000000, startDate: '2026-02-01', endDate: '2026-08-30', status: 'SIT', health: 'YELLOW', progress: 80, pm: 'Siti Rahayu', teamSize: 12 },
  { id: 3, code: 'PRJ-2026-0003', name: 'E-Commerce Platform - CV Maju Jaya', client: 'CV Maju Jaya', type: 'SOFTWARE_DEVELOPMENT', contractValue: 150000000, budget: 150000000, startDate: '2026-03-01', endDate: '2026-06-30', status: 'UAT', health: 'GREEN', progress: 90, pm: 'Ahmad Wijaya', teamSize: 6 },
  { id: 4, code: 'PRJ-2026-0004', name: 'PMO Setup - FIFGROUP', client: 'FIFGROUP', type: 'PMO', contractValue: 100000000, budget: 100000000, startDate: '2026-06-01', endDate: '2026-09-30', status: 'PLANNING', health: 'RED', progress: 15, pm: 'Dewi Lestari', teamSize: 4 },
  { id: 5, code: 'PRJ-2025-0012', name: 'Manufacturing ERP - PT Industri', client: 'PT Industri', type: 'ERP_IMPLEMENTATION', contractValue: 800000000, budget: 750000000, startDate: '2025-06-01', endDate: '2026-05-31', status: 'SUPPORT', health: 'GREEN', progress: 100, pm: 'Budi Santoso', teamSize: 10 },
  { id: 6, code: 'PRJ-2025-0008', name: 'HR System - PT Teknologi', client: 'PT Teknologi', type: 'SOFTWARE_DEVELOPMENT', contractValue: 200000000, budget: 200000000, startDate: '2025-04-01', endDate: '2025-12-31', status: 'CLOSED', health: 'GREEN', progress: 100, pm: 'Siti Rahayu', teamSize: 5 },
]

export default function ProjectsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.client.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = filterStatus === 'ALL' || p.status === filterStatus
    return matchSearch && matchStatus
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

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((project) => (
              <div key={project.id} className="card p-5 card-hover cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground font-mono">{project.code}</span>
                      <span className={cn('badge', getHealthColor(project.health))}>
                        {project.health}
                      </span>
                    </div>
                    <h3 className="font-semibold truncate">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">{project.client}</p>
                  </div>
                  <button className="p-1 rounded hover:bg-accent"><MoreVertical className="w-4 h-4" /></button>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className={cn('badge', getStatusColor(project.status))}>{project.status.replace('_', ' ')}</span>
                  <span className="badge bg-muted">{project.type.replace('_', ' ')}</span>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>

                {/* Meta */}
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{formatCurrency(project.contractValue)}</div>
                  <div className="flex items-center gap-1"><Users className="w-3 h-3" />{project.teamSize} members</div>
                  <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(project.endDate)}</div>
                  <div className="truncate">PM: {project.pm}</div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
