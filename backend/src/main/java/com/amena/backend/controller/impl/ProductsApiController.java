package com.amena.backend.controller.impl;

import com.amena.backend.api.ProductsApi;
import com.amena.backend.dto.ProductPage;
import com.amena.backend.dto.ProductRequest;
import com.amena.backend.dto.ProductResponse;
import com.amena.backend.service.ProduitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ProductsApiController implements ProductsApi {

    private final ProduitService produitService;

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
}
