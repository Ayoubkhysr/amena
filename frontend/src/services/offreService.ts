import type { Offre } from '../pages/admin/adminpromotions/AdminPromotions'
import type { Category } from '../context/StoreContext'

export type ApiOffre = {
  id: number
  label: string
  categoryId?: number
  categoryName?: string
  discountPercentage: number
  startsAt?: string
  endsAt?: string
  isActive?: boolean
  createdAt?: string
}

export type ApiOffreRequest = {
  label: string
  categoryId?: number
  discountPercentage: number
  startsAt?: string
  endsAt?: string
  isActive?: boolean
}

const API_BASE = import.meta.env.VITE_API_URL ?? ''

export function toUiOffre(api: ApiOffre): Offre {
  return {
    id: String(api.id),
    label: api.label,
    category: api.categoryName ?? 'Autre',
    discount: api.discountPercentage,
    startsAt: api.startsAt ? api.startsAt.slice(0, 10) : '',
    endsAt: api.endsAt ? api.endsAt.slice(0, 10) : '',
    status: api.isActive ? 'Actif' : 'Inactif',
  }
}

export function toApiOffreRequest(offre: Offre, categories: Category[]): ApiOffreRequest {
  const category = categories.find((c) => c.name === offre.category)
  return {
    label: offre.label,
    categoryId: category ? Number(category.id) : undefined,
    discountPercentage: offre.discount,
    startsAt: offre.startsAt ? `${offre.startsAt}T00:00:00Z` : undefined,
    endsAt: offre.endsAt ? `${offre.endsAt}T00:00:00Z` : undefined,
    isActive: offre.status === 'Actif',
  }
}

async function parseError(res: Response): Promise<never> {
  const message = await res.text().catch(() => res.statusText)
  throw new Error(message || `Erreur API (${res.status})`)
}

export async function fetchOffres(): Promise<ApiOffre[]> {
  const res = await fetch(`${API_BASE}/api/offres`)
  if (!res.ok) await parseError(res)
  return res.json()
}

export async function createOffre(body: ApiOffreRequest): Promise<ApiOffre> {
  const res = await fetch(`${API_BASE}/api/offres`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) await parseError(res)
  return res.json()
}

export async function updateOffre(id: number, body: ApiOffreRequest): Promise<ApiOffre> {
  const res = await fetch(`${API_BASE}/api/offres/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) await parseError(res)
  return res.json()
}

export async function deleteOffre(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/offres/${id}`, { method: 'DELETE' })
  if (!res.ok) await parseError(res)
}
