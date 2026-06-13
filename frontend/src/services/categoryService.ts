import type { Category } from '../context/StoreContext'

export type ApiCategory = {
  id: number
  name: string
  slug: string
  description?: string
  parentId?: number
  imageUrl?: string
  isActive?: boolean
  sortOrder?: number
  createdAt?: string
}

export type ApiCategoryRequest = {
  name: string
  slug?: string
  description?: string
  parentId?: number
  imageUrl?: string
  isActive?: boolean
  sortOrder?: number
}

const API_BASE = import.meta.env.VITE_API_URL ?? ''

export function toUiCategory(api: ApiCategory): Category {
  return {
    id: String(api.id),
    name: api.name,
    slug: api.slug,
  }
}

async function parseError(res: Response): Promise<never> {
  const message = await res.text().catch(() => res.statusText)
  throw new Error(message || `Erreur API (${res.status})`)
}

export async function fetchCategories(): Promise<ApiCategory[]> {
  const res = await fetch(`${API_BASE}/api/categories`)
  if (!res.ok) await parseError(res)
  return res.json()
}

export async function createCategory(body: ApiCategoryRequest): Promise<ApiCategory> {
  const res = await fetch(`${API_BASE}/api/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) await parseError(res)
  return res.json()
}

export async function updateCategory(id: number, body: ApiCategoryRequest): Promise<ApiCategory> {
  const res = await fetch(`${API_BASE}/api/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) await parseError(res)
  return res.json()
}

export async function deleteCategory(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/categories/${id}`, { method: 'DELETE' })
  if (!res.ok) await parseError(res)
}

export function findCategoryByName(categories: Category[], name: string): Category | undefined {
  return categories.find((category) => category.name === name)
}

export function getCategoryNames(categories: Category[]): string[] {
  return categories.map((category) => category.name)
}
