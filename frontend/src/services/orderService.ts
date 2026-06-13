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

export async function fetchOrders(): Promise<ApiOrder[]> {
  const res = await fetch(`${API_BASE}/api/orders`)
  if (!res.ok) await parseError(res)
  return res.json()
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
