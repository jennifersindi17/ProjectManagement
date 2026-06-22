'use client'

import { useState } from 'react'
import { Upload, Download, Eye, FileText, FolderOpen } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

const documents = [
  { id: 1, name: 'ERP Implementation Contract.pdf', category: 'CONTRACT', version: '1.0', size: '2.4 MB', project: 'ERP Implementation', uploadedBy: 'Budi Santoso', date: '2026-01-10', status: 'Approved' },
  { id: 2, name: 'Business Requirements Document.docx', category: 'BRD', version: '2.1', size: '1.8 MB', project: 'ERP Implementation', uploadedBy: 'Siti Rahayu', date: '2026-02-15', status: 'Approved' },
  { id: 3, name: 'Functional Spec - Inventory Module.pdf', category: 'FSD', version: '1.3', size: '3.2 MB', project: 'ERP Implementation', uploadedBy: 'Ahmad Wijaya', date: '2026-03-20', status: 'Review' },
  { id: 4, name: 'SIT Test Cases.xlsx', category: 'SIT', version: '1.0', size: '850 KB', project: 'E-Commerce', uploadedBy: 'Dewi Lestari', date: '2026-06-10', status: 'Draft' },
  { id: 5, name: 'UAT Sign-off Template.docx', category: 'UAT', version: '1.0', size: '120 KB', project: 'Digital Transformation', uploadedBy: 'Siti Rahayu', date: '2026-06-15', status: 'Approved' },
  { id: 6, name: 'Sprint 12 MOM.pdf', category: 'MOM', version: '1.0', size: '450 KB', project: 'ERP Implementation', uploadedBy: 'Budi Santoso', date: '2026-06-18', status: 'Approved' },
  { id: 7, name: 'ERP User Manual v2.pdf', category: 'TRAINING_MATERIAL', version: '2.0', size: '5.1 MB', project: 'ERP Implementation', uploadedBy: 'Dewi Lestari', date: '2026-06-01', status: 'Approved' },
]

const categories = ['ALL', 'CONTRACT', 'BRD', 'FSD', 'SIT', 'UAT', 'MOM', 'TRAINING_MATERIAL', 'OTHER']

export default function DocumentsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [filterCategory, setFilterCategory] = useState('ALL')

  const filtered = documents.filter(d => filterCategory === 'ALL' || d.category === filterCategory)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} isMobileOpen={mobileMenuOpen} onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">Document Management</h1>
              <p className="text-muted-foreground">Upload, manage, and version control documents</p>
            </div>
            <button className="btn-primary"><Upload className="w-4 h-4" /> Upload Document</button>
          </div>

          <div className="flex gap-2 mb-6 flex-wrap">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setFilterCategory(cat)} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors', filterCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80')}>
                {cat === 'ALL' ? 'All' : cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-3 text-sm font-semibold">Name</th>
                    <th className="text-left p-3 text-sm font-semibold">Category</th>
                    <th className="text-left p-3 text-sm font-semibold">Project</th>
                    <th className="text-left p-3 text-sm font-semibold">Version</th>
                    <th className="text-left p-3 text-sm font-semibold">Size</th>
                    <th className="text-left p-3 text-sm font-semibold">Status</th>
                    <th className="text-left p-3 text-sm font-semibold">Date</th>
                    <th className="text-center p-3 text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((doc) => (
                    <tr key={doc.id} className="border-b border-border last:border-b-0 hover:bg-accent/30">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm truncate max-w-[200px]">{doc.name}</span>
                        </div>
                      </td>
                      <td className="p-3"><span className="badge bg-muted text-xs">{doc.category.replace('_', ' ')}</span></td>
                      <td className="p-3 text-sm">{doc.project}</td>
                      <td className="p-3 text-sm font-mono text-xs">v{doc.version}</td>
                      <td className="p-3 text-sm text-muted-foreground">{doc.size}</td>
                      <td className="p-3">
                        <span className={cn('badge',
                          doc.status === 'Approved' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
                          doc.status === 'Review' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
                          doc.status === 'Draft' && 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        )}>{doc.status}</span>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">{formatDate(doc.date)}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1.5 rounded hover:bg-accent" title="Preview"><Eye className="w-4 h-4" /></button>
                          <button className="p-1.5 rounded hover:bg-accent" title="Download"><Download className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
