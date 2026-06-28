import { Client } from '../pages/admin/adminclients/AdminClients'

export type ApiUser = {
  id: number
  email: string
  firstName: string
  lastName: string
  createdAt: string
  updatedAt?: string
}

export type UserPage = {
  content: ApiUser[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
}

const API_BASE = import.meta.env.VITE_API_URL ?? ''

export function toUiClient(api: ApiUser): Client {
  return {
    id: api.id.toString(),
    name: `${api.firstName} ${api.lastName}`.trim() || api.email,
    email: api.email,
    phone: '—', // Phone is not in UserResponse right now, but we can default
    registrationDate: formatDate(api.createdAt),
    totalOrders: 0, // This would ideally come from the backend, but we'll mock or leave 0 for now
    totalSpent: 0,
    status: 'Actif', // Mock status as it's not strictly in UserResponse
  }
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return isoDate
  return date.toISOString().slice(0, 10)
}

async function parseError(res: Response): Promise<never> {
  const message = await res.text().catch(() => res.statusText)
  throw new Error(message || `Erreur API (${res.status})`)
}

export async function fetchUsersPage(
  page = 0,
  size = 20,
  search?: string,
  role?: string,
  sortBy = 'createdAt',
  sortOrder = 'desc'
): Promise<UserPage> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortOrder,
  })
  if (search) params.append('search', search)
  if (role) params.append('role', role)

  const res = await fetch(`${API_BASE}/api/users?${params.toString()}`)
  if (!res.ok) await parseError(res)
  return res.json()
}
