'use client'

import { useState } from 'react'
import { Plus, Calendar, Clock, Users, FileText, Download, Mail } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

const meetings = [
  { id: 1, title: 'Sprint Planning - ERP Implementation', date: '2026-06-23', startTime: '09:00', endTime: '11:00', participants: ['Budi Santoso', 'Siti Rahayu', 'Ahmad Wijaya'], agenda: 'Sprint 13 planning, task assignment', hasMOM: true },
  { id: 2, title: 'UAT Review - E-Commerce', date: '2026-06-22', startTime: '14:00', endTime: '15:30', participants: ['Ahmad Wijaya', 'Dewi Lestari', 'Agus Pratama'], agenda: 'UAT test results review', hasMOM: true },
  { id: 3, title: 'Stakeholder Update - Digital Transformation', date: '2026-06-24', startTime: '10:00', endTime: '11:00', participants: ['Budi Santoso', 'Siti Rahayu'], agenda: 'Monthly progress update', hasMOM: false },
  { id: 4, title: 'Risk Review - PMO Setup', date: '2026-06-25', startTime: '13:00', endTime: '14:00', participants: ['Dewi Lestari', 'Rina Susanti'], agenda: 'Risk register review', hasMOM: false },
]

const momData = [
  { id: 1, type: 'DISCUSSION', content: 'Need to accelerate development for ERP Module 2', pic: '-', dueDate: null },
  { id: 2, type: 'DECISION', content: 'Approved additional 2 weeks timeline for UAT phase', pic: '-', dueDate: null },
  { id: 3, type: 'ACTION_ITEM', content: 'Prepare test data for UAT', pic: 'Dewi Lestari', dueDate: '2026-06-25' },
  { id: 4, type: 'ACTION_ITEM', content: 'Update project risk register', pic: 'Budi Santoso', dueDate: '2026-06-26' },
]

export default function MeetingsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('meetings')

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} isMobileOpen={mobileMenuOpen} onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Meetings & MOM</h1>
              <p className="text-muted-foreground">Schedule meetings and document minutes</p>
            </div>
            <button className="btn-primary"><Plus className="w-4 h-4" /> New Meeting</button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-muted rounded-lg p-1 w-fit">
            <button onClick={() => setActiveTab('meetings')} className={cn('px-4 py-2 rounded-md text-sm font-medium transition-colors', activeTab === 'meetings' ? 'bg-background shadow-sm' : 'hover:bg-background/50')}>Meetings</button>
            <button onClick={() => setActiveTab('mom')} className={cn('px-4 py-2 rounded-md text-sm font-medium transition-colors', activeTab === 'mom' ? 'bg-background shadow-sm' : 'hover:bg-background/50')}>Minutes of Meeting</button>
          </div>

          {activeTab === 'meetings' ? (
            <div className="space-y-3">
              {meetings.map((m) => (
                <div key={m.id} className="card p-5 card-hover cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{m.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{m.agenda}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(m.date)}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{m.startTime} - {m.endTime}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{m.participants.length} participants</span>
                        {m.hasMOM && <span className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">MOM Available</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="btn-ghost p-2" title="Export PDF"><Download className="w-4 h-4" /></button>
                      <button className="btn-ghost p-2" title="Share via Email"><Mail className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {momData.map((item) => (
                <div key={item.id} className="card p-4">
                  <div className="flex items-start gap-3">
                    <span className={cn('badge flex-shrink-0',
                      item.type === 'DISCUSSION' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
                      item.type === 'DECISION' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
                      item.type === 'ACTION_ITEM' && 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                    )}>{item.type.replace('_', ' ')}</span>
                    <div className="flex-1">
                      <p className="text-sm">{item.content}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {item.pic !== '-' && <span>PIC: <span className="text-foreground">{item.pic}</span></span>}
                        {item.dueDate && <span>Due: {formatDate(item.dueDate)}</span>}
                      </div>
                    </div>
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
