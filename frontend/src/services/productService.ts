import type { Category, Product } from '../context/StoreContext'

export type ApiProduct = {
  id: number
  sku: string
  name: string
  slug: string
  description?: string
  price: number
  compareAtPrice?: number
  costPrice?: number
  categoryId?: number
  brand?: string
  weight?: number
  isActive?: boolean
  isFeatured?: boolean
  metaTitle?: string
  metaDescription?: string
  imageUrl?: string
}

export type ApiProductRequest = {
  sku: string
  name: string
  slug: string
  description?: string
  price: number
  compareAtPrice?: number
  costPrice?: number
  categoryId?: number
  brand?: string
  weight?: number
  isActive?: boolean
  isFeatured?: boolean
  metaTitle?: string
  metaDescription?: string
}

const API_BASE = import.meta.env.VITE_API_URL ?? ''

/** Resolves a product image path from the API into a browser-loadable URL. */
export function resolveImageUrl(imageUrl?: string): string {
  if (!imageUrl?.trim()) return ''
  const normalized = imageUrl.trim().replace(/\\/g, '/')
  if (normalized.startsWith('http://') || normalized.startsWith('https://') || normalized.startsWith('data:')) {
    return normalized
  }
  if (normalized.startsWith('/')) {
    return `${API_BASE}${normalized}`
  }
  return `${API_BASE}/${normalized}`
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function categoryNameToId(name: string, categories: Category[]): number | undefined {
  const category = categories.find((item) => item.name === name)
  return category ? Number(category.id) : undefined
}

export function categoryIdToName(categoryId: number | undefined, categories: Category[]): string {
  if (!categoryId) return 'Autre'
  return categories.find((item) => Number(item.id) === categoryId)?.name ?? 'Autre'
}

export function toUiProduct(api: ApiProduct, categories: Category[]): Product {
  const isActive = api.isActive !== false
  return {
    id: String(api.id),
    sku: api.sku,
    slug: api.slug,
    name: api.name,
    category: categoryIdToName(api.categoryId, categories),
    price: api.price,
    stock: isActive ? 50 : 0,
    status: isActive ? 'Actif' : 'Inactif',
    description: api.description ?? '',
    imageUrl: resolveImageUrl(api.imageUrl),
  }
}

export function toApiRequest(
  product: Partial<Product>,
  categories: Category[],
  existing?: Pick<Product, 'sku' | 'slug'>
): ApiProductRequest {
  const name = product.name?.trim() ?? ''
  const slug = existing?.slug || slugify(name) || `produit-${Date.now()}`
  const sku = existing?.sku || slug.toUpperCase().replace(/-/g, '_').slice(0, 50) || `SKU-${Date.now()}`

  return {
    sku,
    name,
    slug,
    description: product.description?.trim() || undefined,
    price: product.price ?? 0,
    categoryId: product.category ? categoryNameToId(product.category, categories) : undefined,
    isActive: product.status !== 'Inactif',
    isFeatured: false,
  }
}

async function parseError(res: Response): Promise<never> {
  const message = await res.text().catch(() => res.statusText)
  throw new Error(message || `Erreur API (${res.status})`)
}

export type ProductPage = {
  content: ApiProduct[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
  empty: boolean
}

export async function fetchProductsPage(
  page = 0,
  size = 20,
  search?: string,
  categoryId?: number,
  sortBy = 'createdAt',
  sortOrder = 'desc'
): Promise<ProductPage> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortOrder,
  })
  if (search) params.append('search', search)
  if (categoryId) params.append('categoryId', categoryId.toString())

  const res = await fetch(`${API_BASE}/api/products?${params.toString()}`)
  if (!res.ok) await parseError(res)
  return res.json()
}

export async function createProduct(body: ApiProductRequest): Promise<ApiProduct> {
  const res = await fetch(`${API_BASE}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) await parseError(res)
  return res.json()
}

export async function updateProduct(id: number, body: ApiProductRequest): Promise<ApiProduct> {
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) await parseError(res)
  return res.json()
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/products/${id}`, { method: 'DELETE' })
  if (!res.ok) await parseError(res)
}
