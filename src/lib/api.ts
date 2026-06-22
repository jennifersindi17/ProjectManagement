import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const API_BASE = '/api'

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const res = await fetch(API_BASE + url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })
  if (!res.ok) throw new Error(res.statusText)
  return res.json()
}

// Default: retry 1x, no retry on 401/403
const defaultQueryOpts = {
  retry: (failureCount: number, error: unknown) => {
    if (error instanceof Error && error.message === 'Unauthorized') return false
    return failureCount < 1
  },
  retryDelay: 1000,
}

// ============ DASHBOARD ============

const mockDashboard = {
  kpi: {
    projects: { total: 4, active: 4, completed: 0, delayed: 1 },
    tasks: { total: 8, open: 1, inProgress: 2, completed: 2, overdue: 2 },
    teamSize: 9,
  },
  recentProjects: [
    { id: '1', code: 'PRJ-2026-0001', name: 'ERP Implementation - PT ABC', status: 'DEVELOPMENT', health: 'GREEN', progress: 65, projectManager: { name: 'Budi Santoso' } },
    { id: '2', code: 'PRJ-2026-0002', name: 'Digital Transformation - PT XYZ', status: 'SIT', health: 'YELLOW', progress: 80, projectManager: { name: 'Siti Rahayu' } },
    { id: '3', code: 'PRJ-2026-0003', name: 'E-Commerce Platform - CV Maju Jaya', status: 'UAT', health: 'GREEN', progress: 90, projectManager: { name: 'Ahmad Wijaya' } },
    { id: '4', code: 'PRJ-2026-0004', name: 'PMO Setup - FIFGROUP', status: 'PLANNING', health: 'RED', progress: 15, projectManager: { name: 'Dewi Lestari' } },
  ],
  recentTasks: [
    { id: '1', taskId: 'PRJ-2026-0001-T001', name: 'Setup Database Schema', status: 'IN_PROGRESS', priority: 'HIGH', assignee: { name: 'Budi Santoso' }, project: { name: 'ERP Implementation' } },
    { id: '2', taskId: 'PRJ-2026-0003-T001', name: 'UI Design Review', status: 'REVIEW', priority: 'MEDIUM', assignee: { name: 'Siti Rahayu' }, project: { name: 'E-Commerce' } },
    { id: '3', taskId: 'PRJ-2026-0002-T001', name: 'API Integration Testing', status: 'TESTING', priority: 'CRITICAL', assignee: { name: 'Ahmad Wijaya' }, project: { name: 'Digital Transformation' } },
    { id: '4', taskId: 'PRJ-2026-0001-T002', name: 'User Training Material', status: 'TO_DO', priority: 'LOW', assignee: { name: 'Dewi Lestari' }, project: { name: 'ERP Implementation' } },
  ],
  notifications: [
    { id: '1', title: 'Task Overdue', message: 'API Integration Testing is overdue', isRead: false, createdAt: new Date().toISOString() },
    { id: '2', title: 'New Assignment', message: 'You have been assigned to UAT Testing', isRead: false, createdAt: new Date().toISOString() },
    { id: '3', title: 'Approval Request', message: 'Timesheet for Week 25 needs approval', isRead: true, createdAt: new Date().toISOString() },
  ],
}

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => fetcher<DashboardData>('/dashboard'),
    placeholderData: mockDashboard as DashboardData,
    ...defaultQueryOpts,
  })
}

export interface DashboardData {
  kpi: {
    projects: { total: number; active: number; completed: number; delayed: number }
    tasks: { total: number; open: number; inProgress: number; completed: number; overdue: number }
    teamSize: number
  }
  recentProjects: { id: string; code: string; name: string; status: string; health: string; progress: number; projectManager: { name: string } }[]
  recentTasks: { id: string; taskId: string; name: string; status: string; priority: string; assignee: { name: string } | null; project: { name: string } }[]
  notifications: { id: string; title: string; message: string; isRead: boolean; createdAt: string }[]
}

// ============ PROJECTS ============

const mockProjects: Project[] = [
  { id: '1', code: 'PRJ-2026-0001', name: 'ERP Implementation - PT ABC', clientName: 'PT ABC', projectType: 'ERP_IMPLEMENTATION', contractValue: 250000000, budget: 250000000, startDate: '2026-01-15', endDate: '2026-07-15', status: 'DEVELOPMENT', health: 'GREEN', progress: 65, projectManager: { name: 'Budi Santoso' }, _count: { tasks: 3, members: 4 } },
  { id: '2', code: 'PRJ-2026-0002', name: 'Digital Transformation - PT XYZ', clientName: 'PT XYZ', projectType: 'DIGITAL_TRANSFORMATION', contractValue: 500000000, budget: 480000000, startDate: '2026-02-01', endDate: '2026-08-30', status: 'SIT', health: 'YELLOW', progress: 80, projectManager: { name: 'Siti Rahayu' }, _count: { tasks: 2, members: 5 } },
  { id: '3', code: 'PRJ-2026-0003', name: 'E-Commerce Platform', clientName: 'CV Maju Jaya', projectType: 'SOFTWARE_DEVELOPMENT', contractValue: 150000000, budget: 150000000, startDate: '2026-03-01', endDate: '2026-06-30', status: 'UAT', health: 'GREEN', progress: 90, projectManager: { name: 'Ahmad Wijaya' }, _count: { tasks: 2, members: 3 } },
  { id: '4', code: 'PRJ-2026-0004', name: 'PMO Setup - FIFGROUP', clientName: 'FIFGROUP', projectType: 'PMO', contractValue: 100000000, budget: 100000000, startDate: '2026-06-01', endDate: '2026-09-30', status: 'PLANNING', health: 'RED', progress: 15, projectManager: { name: 'Dewi Lestari' }, _count: { tasks: 1, members: 2 } },
]

export function useProjects(params?: { status?: string; search?: string }) {
  const qs = new URLSearchParams()
  if (params?.status) qs.set('status', params.status)
  if (params?.search) qs.set('search', params.search)
  const url = `/projects${qs.toString() ? '?' + qs.toString() : ''}`
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => fetcher<Project[]>(url),
    placeholderData: mockProjects,
    ...defaultQueryOpts,
  })
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Project>) => fetcher<Project>('/projects', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  })
}

export interface Project {
  id: string
  code: string
  name: string
  description?: string | null
  clientName: string
  projectType: string
  contractValue: number
  budget: number
  startDate: string
  endDate: string
  status: string
  health: string
  progress: number
  projectManager?: { name: string }
  _count?: { tasks: number; members: number }
}

// ============ TASKS ============

const mockTasks: (Task & { assignee?: { name: string } | null; project: { name: string } })[] = [
  { id: '1', taskId: 'PRJ-2026-0001-T001', name: 'Setup Database Schema', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '2026-06-25', progress: 50, assignee: { name: 'Budi Santoso' }, project: { name: 'ERP Implementation' } },
  { id: '2', taskId: 'PRJ-2026-0003-T001', name: 'UI Design Review', status: 'REVIEW', priority: 'MEDIUM', dueDate: '2026-06-23', progress: 75, assignee: { name: 'Siti Rahayu' }, project: { name: 'E-Commerce' } },
  { id: '3', taskId: 'PRJ-2026-0002-T001', name: 'API Integration Testing', status: 'TESTING', priority: 'CRITICAL', dueDate: '2026-06-22', progress: 90, assignee: { name: 'Ahmad Wijaya' }, project: { name: 'Digital Transformation' } },
  { id: '4', taskId: 'PRJ-2026-0001-T002', name: 'User Training Material', status: 'TO_DO', priority: 'LOW', dueDate: '2026-06-28', progress: 0, assignee: { name: 'Dewi Lestari' }, project: { name: 'ERP Implementation' } },
  { id: '5', taskId: 'PRJ-2026-0004-T001', name: 'PMO Framework Documentation', status: 'BACKLOG', priority: 'HIGH', dueDate: '2026-07-05', progress: 0, assignee: { name: 'Rina Susanti' }, project: { name: 'PMO Setup' } },
  { id: '6', taskId: 'PRJ-2026-0002-T002', name: 'Data Migration Script', status: 'IN_PROGRESS', priority: 'HIGH', dueDate: '2026-06-20', progress: 60, assignee: { name: 'Agus Pratama' }, project: { name: 'Digital Transformation' } },
  { id: '7', taskId: 'PRJ-2026-0003-T002', name: 'Payment Gateway Integration', status: 'DONE', priority: 'CRITICAL', dueDate: '2026-06-15', progress: 100, assignee: { name: 'Agus Pratama' }, project: { name: 'E-Commerce' } },
  { id: '8', taskId: 'PRJ-2026-0001-T003', name: 'Inventory Module Config', status: 'DONE', priority: 'MEDIUM', dueDate: '2026-06-18', progress: 100, assignee: { name: 'Siti Rahayu' }, project: { name: 'ERP Implementation' } },
]

export function useTasks(params?: { status?: string; priority?: string; projectId?: string; search?: string }) {
  const qs = new URLSearchParams()
  if (params?.status) qs.set('status', params.status)
  if (params?.priority) qs.set('priority', params.priority)
  if (params?.projectId) qs.set('projectId', params.projectId)
  if (params?.search) qs.set('search', params.search)
  const url = `/tasks${qs.toString() ? '?' + qs.toString() : ''}`
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: () => fetcher<Task[]>(url),
    placeholderData: mockTasks,
    ...defaultQueryOpts,
  })
}

export interface Task {
  id: string
  taskId: string
  name: string
  description?: string | null
  status: string
  priority: string
  startDate?: string | null
  dueDate?: string | null
  progress: number
  assignee?: { name: string } | null
  reporter?: { name: string }
  project?: { name: string }
}

// ============ USERS ============

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => fetcher<User[]>('/users'),
    ...defaultQueryOpts,
  })
}

export interface User {
  id: string
  email: string
  name: string
  role: string
  phone?: string | null
  department?: string | null
  isActive: boolean
  capacity: number
}
