package com.amena.backend.controller;

import com.amena.backend.api.ProductsApi;
import com.amena.backend.dto.ProductImageResponse;
import com.amena.backend.dto.ProductPage;
import com.amena.backend.dto.ProductRequest;
import com.amena.backend.dto.ProductResponse;
import com.amena.backend.service.ProductImageService;
import com.amena.backend.service.ProduitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductsController implements ProductsApi {

    private final ProduitService produitService;
    private final ProductImageService productImageService;

    @Override
    public ResponseEntity<ProductPage> getProducts(Integer page, Integer size, String search, Long categoryId,
                                                           Long subcategoryId, String sortBy, String sortOrder, Integer maxStock) {
        return ResponseEntity.ok(produitService.getProducts(page, size, search, categoryId, subcategoryId, sortBy, sortOrder, maxStock));
    }

    @Override
    public ResponseEntity<ProductResponse> createProduct(ProductRequest productRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(produitService.createProduct(productRequest));
    }

    @Override
    public ResponseEntity<ProductResponse> getProductById(Long productId) {
        return ResponseEntity.ok(produitService.getProductById(productId));
    }

    @Override
    public ResponseEntity<ProductResponse> updateProduct(Long productId, ProductRequest productRequest) {
        return ResponseEntity.ok(produitService.updateProduct(productId, productRequest));
    }

    @Override
    public ResponseEntity<Void> deleteProduct(Long productId) {
        produitService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<List<ProductImageResponse>> listProductImages(Long productId) {
        return ResponseEntity.ok(productImageService.listByProduct(productId));
    }

    @Override
    public ResponseEntity<ProductImageResponse> uploadProductImage(Long productId, MultipartFile file, Boolean primary) {
        boolean isPrimary = primary == null || primary;
        ProductImageResponse response = productImageService.upload(productId, file, isPrimary);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Override
    public ResponseEntity<Void> deleteProductImage(Long productId, Long imageId) {
        productImageService.delete(productId, imageId);
        return ResponseEntity.noContent().build();
    }
}
