'use client'

import { useState } from 'react'
import { Plus, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

const risks = [
  { id: 1, riskId: 'RSK-2026-001', project: 'ERP Implementation', description: 'Key developer may leave the project', probability: 3, impact: 5, riskScore: 15, mitigationPlan: 'Cross-train team members, document all work', owner: 'Budi Santoso', status: 'Open' },
  { id: 2, riskId: 'RSK-2026-002', project: 'Digital Transformation', description: 'Client requirements keep changing', probability: 4, impact: 4, riskScore: 16, mitigationPlan: 'Implement change request process, weekly alignment', owner: 'Siti Rahayu', status: 'Open' },
  { id: 3, riskId: 'RSK-2026-003', project: 'E-Commerce', description: 'Third-party API deprecation', probability: 2, impact: 5, riskScore: 10, mitigationPlan: 'Identify alternative providers, build abstraction layer', owner: 'Ahmad Wijaya', status: 'Mitigated' },
  { id: 4, riskId: 'RSK-2026-004', project: 'PMO Setup', description: 'Budget overrun due to scope creep', probability: 3, impact: 4, riskScore: 12, mitigationPlan: 'Strict scope control, regular budget review', owner: 'Dewi Lestari', status: 'Open' },
]

export default function RisksPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const getRiskColor = (score: number) => {
    if (score >= 15) return 'bg-red-500'
    if (score >= 10) return 'bg-orange-500'
    if (score >= 5) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} isMobileOpen={mobileMenuOpen} onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Risk Management</h1>
              <p className="text-muted-foreground">Risk register and mitigation plans</p>
            </div>
            <button className="btn-primary"><Plus className="w-4 h-4" /> New Risk</button>
          </div>

          {/* Risk Matrix */}
          <div className="card p-5 mb-6">
            <h3 className="font-semibold mb-4">Risk Matrix</h3>
            <div className="grid grid-cols-6 gap-1 text-xs">
              <div />
              {[1, 2, 3, 4, 5].map(impact => (
                <div key={impact} className="text-center font-medium text-muted-foreground py-1">Impact {impact}</div>
              ))}
              {[5, 4, 3, 2, 1].map(prob => (
                <div key={prob} className="contents">
                  <div className="flex items-center justify-end pr-2 font-medium text-muted-foreground">Prob {prob}</div>
                  {[1, 2, 3, 4, 5].map(impact => {
                    const score = prob * impact
                    const count = risks.filter(r => r.probability === prob && r.impact === impact).length
                    return (
                      <div key={impact} className={cn('h-10 rounded flex items-center justify-center text-white font-bold text-xs', getRiskColor(score))}>
                        {count > 0 ? count : ''}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Risk List */}
          <div className="space-y-2">
            {risks.map((risk) => (
              <div key={risk.id} className="card p-4 card-hover cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-sm', getRiskColor(risk.riskScore))}>
                    {risk.riskScore}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground font-mono">{risk.riskId}</span>
                      <span className={cn('badge', risk.status === 'Open' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300')}>{risk.status}</span>
                    </div>
                    <h3 className="font-medium text-sm">{risk.description}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{risk.project} · Owner: {risk.owner}</p>
                    <p className="text-xs text-muted-foreground mt-1">Mitigation: {risk.mitigationPlan}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Probability: {risk.probability}/5</span>
                      <span>Impact: {risk.impact}/5</span>
                      <span className="font-medium">Score: {risk.riskScore}</span>
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
