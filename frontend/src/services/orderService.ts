import type { Order, OrderItem, OrderStatus } from '../pages/admin/admincommandes/AdminCommandes'

export type ApiOrder = {
  id: number
  orderNumber: string
  clientName: string
  userId?: number
  totalAmount: number
  shippingAmount?: number
  status: string
  createdAt: string
  address: string
  items: ApiOrderItem[]
}

export type ApiOrderItem = {
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export type OrderPage = {
  content: ApiOrder[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
}

const API_BASE = import.meta.env.VITE_API_URL ?? ''

const STATUS_TO_UI: Record<string, OrderStatus> = {
  pending: 'En attente',
  processing: 'Préparée',
  shipped: 'Préparée',
  delivered: 'Livrée',
  cancelled: 'Retournée',
  refunded: 'Retournée',
}

const STATUS_TO_API: Record<OrderStatus, string> = {
  'En attente': 'pending',
  'Préparée': 'processing',
  'Livrée': 'delivered',
  'Retournée': 'refunded',
}

export function toUiOrder(api: ApiOrder): Order {
  return {
    id: api.id,
    client: api.clientName,
    total: api.totalAmount,
    statut: STATUS_TO_UI[api.status] ?? 'En attente',
    date: formatDate(api.createdAt),
    address: api.address || '—',
    items: api.items.map(toUiOrderItem),
  }
}

function toUiOrderItem(item: ApiOrderItem): OrderItem {
  return {
    name: item.productName,
    qty: item.quantity,
    price: item.unitPrice,
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

export async function fetchOrdersPage(
  page = 0,
  size = 20,
  search?: string,
  status?: string,
  sortBy = 'createdAt',
  sortOrder = 'desc'
): Promise<OrderPage> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortOrder,
  })
  if (search) params.append('search', search)
  if (status) params.append('status', status)

  const res = await fetch(`${API_BASE}/api/orders?${params.toString()}`)
  if (!res.ok) await parseError(res)
  return res.json()
}

export async function fetchOrders(): Promise<ApiOrder[]> {
  const page = await fetchOrdersPage(0, 1000, undefined, undefined, 'createdAt', 'desc')
  return page.content
}

export async function updateOrderStatus(orderId: number, statut: OrderStatus): Promise<ApiOrder> {
  const res = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: STATUS_TO_API[statut] }),
  })
  if (!res.ok) await parseError(res)
  return res.json()
}
