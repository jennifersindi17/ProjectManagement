'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, FolderKanban, ListTodo, Columns3, BarChart3,
  Clock, Users, Calendar, AlertTriangle, Shield, FileText,
  FolderOpen, Bell, BarChart2, Settings, User, LogOut,
  ChevronLeft, ChevronRight, Moon, Sun, Bot, Building2, Menu, X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  isMobileOpen: boolean
  onMobileToggle: () => void
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: FolderKanban, label: 'Projects', href: '/dashboard/projects' },
  { icon: ListTodo, label: 'Tasks', href: '/dashboard/tasks' },
  { icon: Columns3, label: 'Kanban', href: '/dashboard/kanban' },
  { icon: BarChart3, label: 'Gantt', href: '/dashboard/gantt' },
  { icon: Clock, label: 'Timesheet', href: '/dashboard/timesheet' },
  { icon: Users, label: 'Resources', href: '/dashboard/resources' },
  { icon: Calendar, label: 'Meetings', href: '/dashboard/meetings' },
  { icon: AlertTriangle, label: 'Issues', href: '/dashboard/issues' },
  { icon: Shield, label: 'Risks', href: '/dashboard/risks' },
  { icon: FileText, label: 'Change Requests', href: '/dashboard/change-requests' },
  { icon: FolderOpen, label: 'Documents', href: '/dashboard/documents' },
  { icon: Building2, label: 'Client Portal', href: '/dashboard/client-portal' },
  { icon: Bell, label: 'Notifications', href: '/dashboard/notifications' },
  { icon: BarChart2, label: 'Reports', href: '/dashboard/reports' },
  { icon: Bot, label: 'AI Assistant', href: '/dashboard/ai' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
]

export default function Sidebar({ isCollapsed, onToggle, isMobileOpen, onMobileToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileToggle}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen bg-card border-r border-border flex flex-col transition-all duration-300',
          isCollapsed ? 'w-[68px]' : 'w-[260px]',
          'lg:relative lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border flex-shrink-0">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FolderKanban className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">ProjectFlow</span>
            </Link>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
              <FolderKanban className="w-5 h-5 text-primary-foreground" />
            </div>
          )}
          <button
            onClick={onMobileToggle}
            className="lg:hidden p-1 rounded hover:bg-accent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'sidebar-link',
                  isActive && 'active',
                  isCollapsed && 'justify-center px-2'
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Collapse toggle (desktop) */}
        <div className="hidden lg:flex items-center justify-center p-3 border-t border-border">
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User section */}
        <div className="border-t border-border p-3 flex-shrink-0">
          <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-primary" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin User</p>
                <p className="text-xs text-muted-foreground truncate">admin@projectflow.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
