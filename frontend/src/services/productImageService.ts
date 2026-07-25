import { ProductsService } from '../generated'
import type { ProductImageResponse } from '../generated'

export type ApiProductImage = ProductImageResponse

export async function uploadProductImage(
  productId: number,
  file: File,
  primary = true
): Promise<ApiProductImage> {
  return ProductsService.uploadProductImage({
    productId,
    formData: {
      file: file as unknown as Blob,
      primary,
    },
  })
}

export async function deleteProductImage(productId: number, imageId: number): Promise<void> {
  await ProductsService.deleteProductImage({ productId, imageId })
}
