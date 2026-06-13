import type { PromoCode } from '../pages/admin/adminpromotions/AdminPromotions'

export type ApiCoupon = {
  id: number
  code: string
  description?: string
  discountType: string
  discountValue: number
  minimumOrderAmount?: number
  maximumDiscount?: number
  usageLimit?: number
  usedCount?: number
  startsAt?: string
  expiresAt?: string
  isActive?: boolean
  createdAt?: string
}

export type ApiCouponRequest = {
  code: string
  description?: string
  discountType: string
  discountValue: number
  minimumOrderAmount?: number
  maximumDiscount?: number
  usageLimit?: number
  startsAt?: string
  expiresAt?: string
  isActive?: boolean
}

const API_BASE = import.meta.env.VITE_API_URL ?? ''

export function toUiPromoCode(api: ApiCoupon): PromoCode {
  return {
    id: String(api.id),
    code: api.code,
    discount: api.discountValue,
    expiresAt: api.expiresAt ? api.expiresAt.slice(0, 10) : '',
    usageLimit: api.usageLimit ?? 0,
    usedCount: api.usedCount ?? 0,
    status: api.isActive ? 'Actif' : 'Inactif',
  }
}

export function toApiCouponRequest(promo: PromoCode): ApiCouponRequest {
  return {
    code: promo.code,
    discountType: 'percentage',
    discountValue: promo.discount,
    usageLimit: promo.usageLimit,
    expiresAt: promo.expiresAt ? `${promo.expiresAt}T00:00:00Z` : undefined,
    isActive: promo.status === 'Actif',
  }
}

async function parseError(res: Response): Promise<never> {
  const message = await res.text().catch(() => res.statusText)
  throw new Error(message || `Erreur API (${res.status})`)
}

export async function fetchCoupons(): Promise<ApiCoupon[]> {
  const res = await fetch(`${API_BASE}/api/coupons`)
  if (!res.ok) await parseError(res)
  return res.json()
}

export async function createCoupon(body: ApiCouponRequest): Promise<ApiCoupon> {
  const res = await fetch(`${API_BASE}/api/coupons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) await parseError(res)
  return res.json()
}

export async function updateCoupon(id: number, body: ApiCouponRequest): Promise<ApiCoupon> {
  const res = await fetch(`${API_BASE}/api/coupons/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) await parseError(res)
  return res.json()
}

export async function deleteCoupon(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/coupons/${id}`, { method: 'DELETE' })
  if (!res.ok) await parseError(res)
}
