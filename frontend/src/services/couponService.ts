import type { PromoCode } from '../pages/admin/adminpromotions/AdminPromotions'
import type { CouponResponse, CouponRequest } from '../generated'
import { CouponsService } from '../generated'

export type ApiCoupon = CouponResponse
export type ApiCouponRequest = CouponRequest

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

export async function fetchCoupons(): Promise<ApiCoupon[]> {
  return CouponsService.getCoupons()
}

export async function createCoupon(body: ApiCouponRequest): Promise<ApiCoupon> {
  return CouponsService.createCoupon({ requestBody: body })
}

export async function updateCoupon(id: number, body: ApiCouponRequest): Promise<ApiCoupon> {
  return CouponsService.updateCoupon({ couponId: id, requestBody: body })
}

export async function deleteCoupon(id: number): Promise<void> {
  await CouponsService.deleteCoupon({ couponId: id })
}
