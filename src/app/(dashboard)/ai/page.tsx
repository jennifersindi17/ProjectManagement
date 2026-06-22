'use client'

import { useState } from 'react'
import { Send, Bot, Sparkles, FileText, BarChart3, Shield, Clock, Users, AlertTriangle, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

const aiFeatures = [
  { icon: FileText, title: 'Generate Project Charter', description: 'Create a comprehensive project charter document', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  { icon: BarChart3, title: 'Generate WBS', description: 'Create Work Breakdown Structure for your project', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  { icon: Clock, title: 'Generate Project Timeline', description: 'AI-powered project timeline estimation', color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  { icon: Shield, title: 'Generate Risk Register', description: 'Identify and document potential project risks', color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
  { icon: AlertTriangle, title: 'Change Request Analysis', description: 'Analyze impact of change requests', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
  { icon: FileText, title: 'Generate Meeting Minutes', description: 'Summarize meeting discussions into MOM', color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400' },
  { icon: BarChart3, title: 'Weekly Status Report', description: 'Generate weekly project status report', color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' },
  { icon: Lightbulb, title: 'Summarize Activities', description: 'Summarize project activities and progress', color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { icon: Clock, title: 'Predict Project Delay', description: 'AI prediction of potential project delays', color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' },
  { icon: Users, title: 'Estimate Man Days', description: 'Estimate required man-days for project tasks', color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400' },
]

const chatMessages = [
  { role: 'user', content: 'Generate a project charter for ERP Implementation at PT ABC' },
  { role: 'assistant', content: 'I've generated a project charter for ERP Implementation at PT ABC. Here's a summary:

**Project Title:** ERP Implementation - PT ABC
**Project Manager:** Budi Santoso
**Start Date:** January 15, 2026
**End Date:** July 15, 2026

**Objectives:**
1. Implement Odoo ERP system covering all business modules
2. Migrate existing data from legacy systems
3. Train end-users on the new system
4. Achieve Go-Live by July 2026

**Scope:**
- Finance & Accounting Module
- Inventory Management
- Sales & Procurement
- Human Resources
- Manufacturing (Phase 2)

**Budget:** Rp 250,000,000
**Team Size:** 8 members' },
]

export default function AIAssistantPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState(chatMessages)

  const handleSend = () => {
    if (!chatInput.trim()) return
    setMessages([...messages, { role: 'user', content: chatInput }, { role: 'assistant', content: 'I'm processing your request... This is a demo response. In production, this would connect to OpenAI API to generate intelligent responses based on your project data.' }])
    setChatInput('')
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} isMobileOpen={mobileMenuOpen} onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-hidden flex flex-col p-4 lg:p-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold flex items-center gap-2"><Bot className="w-6 h-6 text-primary" /> AI Project Assistant</h1>
            <p className="text-muted-foreground">Your intelligent project management companion</p>
          </div>

          <div className="flex-1 flex gap-6 min-h-0">
            <div className="w-80 flex-shrink-0 overflow-y-auto hidden lg:block">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> AI Features</h3>
              <div className="space-y-2">
                {aiFeatures.map((feature, i) => (
                  <div key={i} className="card p-3 card-hover cursor-pointer">
                    <div className="flex items-start gap-2">
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', feature.color)}>
                        <feature.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{feature.title}</h4>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col card min-h-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}>
                    <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                      msg.role === 'assistant' ? 'bg-primary/10' : 'bg-muted'
                    )}>
                      {msg.role === 'assistant' ? <Bot className="w-4 h-4 text-primary" /> : <span className="text-xs font-medium">U</span>}
                    </div>
                    <div className={cn('max-w-[70%] rounded-xl p-3 text-sm',
                      msg.role === 'assistant' ? 'bg-muted' : 'bg-primary text-primary-foreground'
                    )}>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <input type="text" placeholder="Ask AI anything about your projects..." className="input flex-1" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
                  <button onClick={handleSend} className="btn-primary px-4"><Send className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
