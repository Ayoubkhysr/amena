import type { Order, OrderItem, OrderStatus } from '../pages/admin/admincommandes/AdminCommandes'
import type { OrderResponse, OrderItemResponse, OrderPage as OrderPageType, CreateOrderRequest as CreateOrderRequestType, CreateOrderItemRequest } from '../generated'
import { OrdersService } from '../generated'

export type ApiOrder = OrderResponse
export type ApiOrderItem = OrderItemResponse
export type OrderPage = OrderPageType

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
  const items = api.items.map(toUiOrderItem)
  const subtotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0)
  const calculatedShipping = subtotal > 150 ? 0 : 8
  const total = subtotal + calculatedShipping

  return {
    id: api.id,
    client: api.clientName,
    clientPhone: api.clientPhone,
    total: total,
    shippingAmount: calculatedShipping,
    statut: STATUS_TO_UI[api.status] ?? 'En attente',
    date: formatDate(api.createdAt),
    address: api.address || '—',
    items: items,
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

export async function fetchOrdersPage(
  page = 0,
  size = 20,
  search?: string,
  status?: string,
  sortBy = 'createdAt',
  sortOrder = 'desc'
): Promise<OrderPage> {
  return OrdersService.getOrders({
    page,
    size,
    search,
    status,
    sortBy,
    sortOrder,
  })
}

export async function fetchOrders(): Promise<ApiOrder[]> {
  const page = await fetchOrdersPage(0, 1000)
  return page.content ?? []
}

export async function updateOrderStatus(orderId: number, statut: OrderStatus): Promise<ApiOrder> {
  return OrdersService.updateOrderStatus({
    orderId,
    requestBody: { status: STATUS_TO_API[statut] },
  })
}

export { CreateOrderItemRequest, CreateOrderRequestType as CreateOrderRequest }

export async function createOrder(req: CreateOrderRequestType): Promise<ApiOrder> {
  return OrdersService.createOrder({ requestBody: req })
}

export async function deleteOrderApi(orderId: number): Promise<void> {
  await OrdersService.deleteOrder({ orderId })
}
