import type { Category } from '../context/StoreContext'
import type { CategoryResponse, CategoryRequest } from '../generated'
import { CategoriesService } from '../generated'

export type ApiCategory = CategoryResponse
export type ApiCategoryRequest = CategoryRequest

export function toUiCategory(api: ApiCategory): Category {
  return {
    id: String(api.id),
    name: api.name,
    slug: api.slug,
    productCount: api.productCount ?? 0,
    parentId: api.parentId ? String(api.parentId) : undefined,
  }
}

export async function fetchCategories(): Promise<ApiCategory[]> {
  return CategoriesService.getCategories()
}

export async function createCategory(body: ApiCategoryRequest): Promise<ApiCategory> {
  return CategoriesService.createCategory({ requestBody: body })
}

export async function updateCategory(id: number, body: ApiCategoryRequest): Promise<ApiCategory> {
  return CategoriesService.updateCategory({ categoryId: id, requestBody: body })
}

export async function deleteCategory(id: number): Promise<void> {
  await CategoriesService.deleteCategory({ categoryId: id })
}

export function findCategoryByName(categories: Category[], name: string): Category | undefined {
  return categories.find((category) => category.name === name)
}

export function getCategoryNames(categories: Category[]): string[] {
  return categories.map((category) => category.name)
}
