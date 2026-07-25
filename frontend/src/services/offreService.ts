import type { Offre } from '../pages/admin/adminpromotions/AdminPromotions'
import type { Category } from '../context/StoreContext'
import type { OffreResponse, OffreRequest } from '../generated'
import { OffresService } from '../generated'

export type ApiOffre = OffreResponse
export type ApiOffreRequest = OffreRequest

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

export async function fetchOffres(): Promise<ApiOffre[]> {
  return OffresService.getOffres()
}

export async function createOffre(body: ApiOffreRequest): Promise<ApiOffre> {
  return OffresService.createOffre({ requestBody: body })
}

export async function updateOffre(id: number, body: ApiOffreRequest): Promise<ApiOffre> {
  return OffresService.updateOffre({ offreId: id, requestBody: body })
}

export async function deleteOffre(id: number): Promise<void> {
  await OffresService.deleteOffre({ offreId: id })
}
