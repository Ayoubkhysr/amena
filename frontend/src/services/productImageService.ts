const API_BASE = import.meta.env.VITE_API_URL ?? ''

export type ApiProductImage = {
  id: number
  productId: number
  imageUrl: string
  altText?: string
  sortOrder?: number
  isPrimary?: boolean
  createdAt?: string
}

async function parseError(res: Response): Promise<never> {
  const message = await res.text().catch(() => res.statusText)
  throw new Error(message || `Erreur API (${res.status})`)
}

export async function uploadProductImage(
  productId: number,
  file: File,
  primary = true
): Promise<ApiProductImage> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('primary', String(primary))

  const res = await fetch(`${API_BASE}/api/products/${productId}/images/upload`, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) await parseError(res)
  return res.json()
}

export async function deleteProductImage(productId: number, imageId: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/products/${productId}/images/${imageId}`, {
    method: 'DELETE',
  })
  if (!res.ok) await parseError(res)
}
