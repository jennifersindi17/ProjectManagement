'use client'

import { useState } from 'react'
import { Save, User, Shield, Bell, Palette, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

const roles = [
  { name: 'Super Admin', permissions: ['All permissions'], color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
  { name: 'Director', permissions: ['View all', 'Approve CR', 'View reports'], color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  { name: 'PMO', permissions: ['Manage projects', 'View reports', 'Manage resources'], color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  { name: 'Project Manager', permissions: ['Manage assigned projects', 'Manage tasks', 'View reports'], color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  { name: 'Team Lead', permissions: ['Manage tasks', 'View projects', 'Submit timesheet'], color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
  { name: 'Developer', permissions: ['View tasks', 'Update task status', 'Submit timesheet'], color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300' },
  { name: 'QA', permissions: ['View tasks', 'Update issues', 'Submit timesheet'], color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
  { name: 'Client', permissions: ['View own project', 'View documents', 'View issues'], color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
]

export default function SettingsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} isMobileOpen={mobileMenuOpen} onMobileToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account and application settings</p>
          </div>

          <div className="flex gap-1 mb-6 bg-muted rounded-lg p-1 w-fit">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'users', label: 'Users & Roles', icon: Shield },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'appearance', label: 'Appearance', icon: Palette },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2', activeTab === tab.id ? 'bg-background shadow-sm' : 'hover:bg-background/50')}>
                <tab.icon className="w-4 h-4" />{tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'profile' && (
            <div className="card p-6 max-w-2xl">
              <h3 className="font-semibold mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-sm font-medium mb-1 block">Full Name</label><input className="input w-full" defaultValue="Admin User" /></div>
                  <div><label className="text-sm font-medium mb-1 block">Email</label><input className="input w-full" defaultValue="admin@projectflow.com" /></div>
                  <div><label className="text-sm font-medium mb-1 block">Phone</label><input className="input w-full" defaultValue="+62 812 3456 7890" /></div>
                  <div><label className="text-sm font-medium mb-1 block">Department</label><input className="input w-full" defaultValue="IT" /></div>
                </div>
                <div><label className="text-sm font-medium mb-1 block">Role</label><input className="input w-full" defaultValue="Super Admin" disabled /></div>
                <button className="btn-primary"><Save className="w-4 h-4" /> Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="font-semibold mb-4">Role Based Access Control (RBAC)</h3>
                <div className="space-y-3">
                  {roles.map((role) => (
                    <div key={role.name} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/30">
                      <div className="flex items-center gap-3">
                        <span className={cn('badge', role.color)}>{role.name}</span>
                        <span className="text-sm text-muted-foreground">{role.permissions.join(', ')}</span>
                      </div>
                      <button className="btn-ghost text-xs">Edit</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card p-6 max-w-2xl">
              <h3 className="font-semibold mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: 'Task Due Tomorrow', desc: 'Get notified when tasks are due tomorrow', checked: true },
                  { label: 'Task Overdue', desc: 'Get notified when tasks become overdue', checked: true },
                  { label: 'New Assignment', desc: 'Get notified when assigned to a new task', checked: true },
                  { label: 'Approval Request', desc: 'Get notified for pending approvals', checked: true },
                  { label: 'Project Delay', desc: 'Get notified when projects are delayed', checked: false },
                  { label: 'Meeting Reminder', desc: 'Get notified before meetings', checked: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="card p-6 max-w-2xl">
              <h3 className="font-semibold mb-4">Appearance</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Theme</label>
                  <div className="flex gap-3">
                    <button className="flex-1 p-4 rounded-lg border-2 border-primary bg-white text-gray-900 text-sm font-medium">☀️ Light</button>
                    <button className="flex-1 p-4 rounded-lg border-2 border-border bg-gray-900 text-white text-sm font-medium">🌙 Dark</button>
                    <button className="flex-1 p-4 rounded-lg border-2 border-border bg-gradient-to-r from-white to-gray-900 text-sm font-medium">💻 System</button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Language</label>
                  <select className="input w-full">
                    <option>English</option>
                    <option>Bahasa Indonesia</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
