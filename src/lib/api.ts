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

// ============ DASHBOARD ============
export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => fetcher<DashboardData>('/dashboard'),
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
export function useProjects(params?: { status?: string; search?: string }) {
  const qs = new URLSearchParams()
  if (params?.status) qs.set('status', params.status)
  if (params?.search) qs.set('search', params.search)
  const url = `/projects${qs.toString() ? '?' + qs.toString() : ''}`
  return useQuery({ queryKey: ['projects', params], queryFn: () => fetcher<Project[]>(url) })
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
export function useTasks(params?: { status?: string; priority?: string; projectId?: string; search?: string }) {
  const qs = new URLSearchParams()
  if (params?.status) qs.set('status', params.status)
  if (params?.priority) qs.set('priority', params.priority)
  if (params?.projectId) qs.set('projectId', params.projectId)
  if (params?.search) qs.set('search', params.search)
  const url = `/tasks${qs.toString() ? '?' + qs.toString() : ''}`
  return useQuery({ queryKey: ['tasks', params], queryFn: () => fetcher<Task[]>(url) })
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
  reporter: { name: string }
  project: { name: string }
}

// ============ USERS ============
export function useUsers() {
  return useQuery({ queryKey: ['users'], queryFn: () => fetcher<User[]>('/users') })
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
