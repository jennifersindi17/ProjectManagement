'use client'

import { useState } from 'react'
import { ZoomIn, ZoomOut, Calendar, ChevronDown } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

const ganttData = [
  { id: 1, name: 'ERP Implementation - PT ABC', start: '2026-01-15', end: '2026-07-15', progress: 65, color: '#3b82f6', milestones: [{ name: 'Go Live', date: '2026-06-30' }] },
  { id: 2, name: 'Digital Transformation - PT XYZ', start: '2026-02-01', end: '2026-08-30', progress: 80, color: '#8b5cf6', milestones: [{ name: 'UAT Complete', date: '2026-07-15' }] },
  { id: 3, name: 'E-Commerce Platform', start: '2026-03-01', end: '2026-06-30', progress: 90, color: '#10b981', milestones: [{ name: 'Launch', date: '2026-06-25' }] },
  { id: 4, name: 'PMO Setup - FIFGROUP', start: '2026-06-01', end: '2026-09-30', progress: 15, color: '#f59e0b', milestones: [{ name: 'Framework Ready', date: '2026-07-30' }] },
  { id: 5, name: 'Manufacturing ERP', start: '2025-06-01', end: '2026-05-31', progress: 100, color: '#6b7280', milestones: [{ name: 'Closed', date: '2026-05-31' }] },
]

const zoomLevels = ['daily', 'weekly', 'monthly'] as const

export default function GanttPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [zoom, setZoom] = useState<typeof zoomLevels[number]>('monthly')

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} isMobileOpen={mobileMenuOpen} onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Gantt Chart</h1>
              <p className="text-muted-foreground">Project timeline and dependencies</p>
            </div>
            <div className="flex items-center gap-2">
              {zoomLevels.map((level) => (
                <button key={level} onClick={() => setZoom(level)} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors', zoom === level ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80')}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[900px]">
                {/* Header */}
                <div className="flex border-b border-border">
                  <div className="w-64 flex-shrink-0 p-3 border-r border-border">
                    <span className="text-sm font-semibold">Project Name</span>
                  </div>
                  <div className="flex-1 flex">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => (
                      <div key={m} className="flex-1 p-3 text-center text-xs font-medium text-muted-foreground border-r border-border last:border-r-0">
                        {m} 2026
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rows */}
                {ganttData.map((item) => (
                  <div key={item.id} className="flex border-b border-border last:border-b-0 hover:bg-accent/30">
                    <div className="w-64 flex-shrink-0 p-3 border-r border-border flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                      <span className="text-sm truncate">{item.name}</span>
                    </div>
                    <div className="flex-1 relative h-12 flex items-center">
                      {/* Grid lines */}
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="flex-1 border-r border-border h-full" />
                      ))}
                      {/* Bar */}
                      <div
                        className="absolute h-6 rounded-md flex items-center justify-center text-xs text-white font-medium shadow-sm"
                        style={{
                          backgroundColor: item.color,
                          left: `${(new Date(item.start).getMonth() / 12) * 100}%`,
                          width: `${Math.max(((new Date(item.end).getTime() - new Date(item.start).getTime()) / (365 * 24 * 60 * 60 * 1000)) * 100, 5)}%`,
                        }}
                      >
                        {item.progress}%
                      </div>
                      {/* Milestone */}
                      {item.milestones.map((ms, i) => (
                        <div
                          key={i}
                          className="absolute w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent"
                          style={{
                            borderBottomColor: item.color,
                            left: `${(new Date(ms.date).getMonth() / 12) * 100}%`,
                            top: '-2px',
                          }}
                          title={`${ms.name}: ${ms.date}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
