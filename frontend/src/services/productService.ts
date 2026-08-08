import type { Category, Product } from '../context/StoreContext'
import type { ProductResponse, ProductRequest, ProductPage as ProductPageType } from '../generated'
import { ProductsService } from '../generated'

export type ApiProduct = ProductResponse
export type ApiProductRequest = ProductRequest
export type ProductPage = ProductPageType

const API_BASE = import.meta.env.VITE_API_URL ?? ''

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
  const category = categories.find((item) => item.name.trim() === name.trim())
  return category ? Number(category.id) : undefined
}

export function categoryIdToName(categoryId: number | undefined, categories: Category[]): string {
  if (!categoryId) return 'Autre'
  return categories.find((item) => Number(item.id) === categoryId)?.name ?? 'Autre'
}

export function toUiProduct(api: ApiProduct, categories: Category[]): Product {
  const isActive = api.isActive !== false
  const categoryObj = categories.find((item) => Number(item.id) === api.categoryId)
  const categoryName = categoryObj?.name ?? 'Autre'

  let mainCategory = categoryName
  let legacySubcategory: string | undefined = undefined

  if (categoryObj?.parentId) {
    const parentCategory = categories.find((item) => item.id === categoryObj.parentId)
    if (parentCategory) {
      mainCategory = parentCategory.name
      legacySubcategory = categoryName
    }
  }

  const subcategoryNames = (api.subcategoryIds ?? [])
    .map((id) => categories.find((item) => Number(item.id) === id)?.name)
    .filter((name): name is string => Boolean(name))

  const subcategories = subcategoryNames.length > 0
    ? subcategoryNames
    : legacySubcategory
      ? [legacySubcategory]
      : undefined

  return {
    id: String(api.id),
    sku: api.sku,
    slug: api.slug,
    name: api.name,
    category: mainCategory,
    subcategories,
    price: api.price,
    compareAtPrice: api.compareAtPrice,
    stock: api.stock ?? 0,
    status: isActive ? 'Actif' : 'Inactif',
    description: api.description ?? '',
    imageUrl: resolveImageUrl(api.imageUrl),
    createdAt: api.createdAt,
  }
}

export function toApiRequest(
  product: Partial<Product>,
  categories: Category[],
  existing?: Pick<Product, 'sku' | 'slug'>
): ApiProductRequest {
  const name = product.name?.trim() ?? ''
  const slug = existing?.slug || slugify(name) || `produit-${Date.now()}`
  const sku = product.sku?.trim() || existing?.sku || slug.toUpperCase().replace(/-/g, '_').slice(0, 50) || `SKU-${Date.now()}`

  const categoryId = product.category ? categoryNameToId(product.category, categories) : undefined
  
  const subcategoryIds = (product.subcategories ?? [])
    .map((subName) => {
      let found = categories.find((item) => item.name.trim() === subName.trim() && Number(item.parentId) === categoryId)
      if (!found) {
        found = categories.find((item) => item.name.trim() === subName.trim())
      }
      return found ? Number(found.id) : undefined
    })
    .filter((id): id is number => id !== undefined)

  return {
    sku,
    name,
    slug,
    description: product.description?.trim() || undefined,
    price: product.price ?? 0,
    compareAtPrice: product.compareAtPrice,
    categoryId,
    subcategoryIds,
    isActive: product.status !== 'Inactif',
    stock: product.stock ?? 0,
    isFeatured: false,
  }
}

export async function fetchProductsPage(
  page = 0,
  size = 20,
  search?: string,
  categoryId?: number,
  subcategoryId?: number,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  maxStock?: number,
  isActive?: boolean
): Promise<ProductPage> {
  return ProductsService.getProducts({
    page,
    size,
    search,
    categoryId,
    subcategoryId,
    isActive,
    sortBy,
    sortOrder,
    maxStock,
  })
}

export async function fetchProductById(id: number | string): Promise<ApiProduct> {
  return ProductsService.getProductById({ productId: Number(id) })
}

export async function createProduct(body: ApiProductRequest): Promise<ApiProduct> {
  return ProductsService.createProduct({ requestBody: body })
}

export async function updateProduct(id: number, body: ApiProductRequest): Promise<ApiProduct> {
  return ProductsService.updateProduct({ productId: id, requestBody: body })
}

export async function deleteProduct(id: number): Promise<void> {
  await ProductsService.deleteProduct({ productId: id })
}

export async function fetchBestSellers(limit = 4): Promise<ApiProduct[]> {
  return ProductsService.getBestSellers({ limit })
}
