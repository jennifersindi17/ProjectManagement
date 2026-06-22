'use client'

import { useState } from 'react'
import { Plus, FileText } from 'lucide-react'
import { cn, formatDate, formatCurrency } from '@/lib/utils'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

const changeRequests = [
  { id: 1, crNumber: 'CR-2026-001', project: 'ERP Implementation', requestDate: '2026-06-18', description: 'Add new reporting module for finance department', impactAnalysis: 'Requires 2 additional developers for 3 weeks', additionalCost: 50000000, additionalDays: 21, approvalStatus: 'REVIEW' },
  { id: 2, crNumber: 'CR-2026-002', project: 'Digital Transformation', requestDate: '2026-06-15', description: 'Change database from MySQL to PostgreSQL', impactAnalysis: 'All data needs migration, testing required', additionalCost: 100000000, additionalDays: 14, approvalStatus: 'APPROVED' },
  { id: 3, crNumber: 'CR-2026-003', project: 'E-Commerce', requestDate: '2026-06-10', description: 'Add multi-language support', impactAnalysis: 'UI changes, content translation needed', additionalCost: 30000000, additionalDays: 10, approvalStatus: 'DRAFT' },
  { id: 4, crNumber: 'CR-2026-004', project: 'PMO Setup', requestDate: '2026-06-20', description: 'Include additional PMO tools', impactAnalysis: 'License cost increase, training needed', additionalCost: 75000000, additionalDays: 7, approvalStatus: 'DEVELOPMENT' },
]

export default function ChangeRequestsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} isMobileOpen={mobileMenuOpen} onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Change Requests</h1>
              <p className="text-muted-foreground">Manage project change requests</p>
            </div>
            <button className="btn-primary"><Plus className="w-4 h-4" /> New CR</button>
          </div>

          {/* Workflow Legend */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {['DRAFT', 'REVIEW', 'APPROVED', 'DEVELOPMENT', 'CLOSED'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span className={cn('badge',
                  step === 'DRAFT' && 'bg-gray-100 text-gray-700',
                  step === 'REVIEW' && 'bg-blue-100 text-blue-700',
                  step === 'APPROVED' && 'bg-green-100 text-green-700',
                  step === 'DEVELOPMENT' && 'bg-purple-100 text-purple-700',
                  step === 'CLOSED' && 'bg-gray-100 text-gray-700'
                )}>{step}</span>
                {i < 4 && <span className="text-muted-foreground">→</span>}
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {changeRequests.map((cr) => (
              <div key={cr.id} className="card p-5 card-hover cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground font-mono">{cr.crNumber}</span>
                      <span className={cn('badge',
                        cr.approvalStatus === 'DRAFT' && 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
                        cr.approvalStatus === 'REVIEW' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
                        cr.approvalStatus === 'APPROVED' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
                        cr.approvalStatus === 'DEVELOPMENT' && 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
                      )}>{cr.approvalStatus}</span>
                    </div>
                    <h3 className="font-semibold">{cr.description}</h3>
                    <p className="text-sm text-muted-foreground">{cr.project} · Requested: {formatDate(cr.requestDate)}</p>
                  </div>
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Impact Analysis</p>
                    <p className="text-xs">{cr.impactAnalysis}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Additional Cost</p>
                    <p className="font-medium text-sm">{formatCurrency(cr.additionalCost)}</p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Additional Timeline</p>
                    <p className="font-medium text-sm">{cr.additionalDays} days</p>
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
