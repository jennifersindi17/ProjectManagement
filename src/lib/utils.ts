import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatDate(date: Date | string, format: string = 'dd-MMM-yyyy'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const day = String(d.getDate()).padStart(2, '0')
  const month = months[d.getMonth()]
  const year = d.getFullYear()

  if (format === 'dd-MMM-yyyy') return `${day}-${month}-${year}`
  if (format === 'yyyy-MM-dd') return `${year}-${String(d.getMonth() + 1).padStart(2, '0')}-${day}`
  return d.toLocaleDateString('id-ID')
}

export function generateProjectCode(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
  return `PRJ-${year}-${random}`
}

export function generateTaskCode(projectCode: string): string {
  const random = Math.floor(Math.random() * 999).toString().padStart(3, '0')
  return `${projectCode}-T${random}`
}

export function generateIssueNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
  return `ISS-${year}-${random}`
}

export function generateCRNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 999).toString().padStart(3, '0')
  return `CR-${year}-${random}`
}

export function generateRiskId(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 999).toString().padStart(3, '0')
  return `RSK-${year}-${random}`
}

export function getHealthColor(health: string): string {
  switch (health) {
    case 'GREEN': return 'text-green-500 bg-green-500/10'
    case 'YELLOW': return 'text-yellow-500 bg-yellow-500/10'
    case 'RED': return 'text-red-500 bg-red-500/10'
    default: return 'text-gray-500 bg-gray-500/10'
  }
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'PLANNING': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'ANALYSIS': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    'DEVELOPMENT': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    'SIT': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    'UAT': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    'GO_LIVE': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    'SUPPORT': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
    'CLOSED': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    'BACKLOG': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    'TO_DO': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    'IN_PROGRESS': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    'REVIEW': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    'TESTING': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    'DONE': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    'CRITICAL': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    'HIGH': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    'MEDIUM': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    'LOW': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    'OPEN': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    'INVESTIGATION': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    'FIXED': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    'DRAFT': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    'SUBMITTED': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    'APPROVED': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    'REJECTED': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  }
  return colors[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
}

export function getPriorityIcon(priority: string): string {
  switch (priority) {
    case 'CRITICAL': return '🔴'
    case 'HIGH': return '🟠'
    case 'MEDIUM': return '🟡'
    case 'LOW': return '🟢'
    default: return '⚪'
  }
}

export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

export function isOverdue(dueDate: Date | string): boolean {
  const d = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
  return d < new Date()
}

export function getDaysRemaining(dueDate: Date | string): number {
  const d = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
  const now = new Date()
  const diff = d.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}
