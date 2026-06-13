package com.amena.backend.controller.impl;

import com.amena.backend.api.ProductsApi;
import com.amena.backend.dto.ProductRequest;
import com.amena.backend.dto.ProductResponse;
import com.amena.backend.entity.Produit;
import com.amena.backend.repository.ProduitRepository;
import com.amena.backend.service.ProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductsApiController implements ProductsApi {

    private final ProduitRepository produitRepository;
    private final ProductImageService productImageService;

    @Override
    public ResponseEntity<List<ProductResponse>> getProducts() {
        List<ProductResponse> products = produitRepository.findAll().stream()
                .map(this::toProductResponse)
                .toList();
        return ResponseEntity.ok(products);
    }

    @Override
    public ResponseEntity<ProductResponse> createProduct(ProductRequest productRequest) {
        validateUniqueSkuAndSlug(productRequest.getSku(), productRequest.getSlug(), null);

        Produit saved = produitRepository.save(toProduit(productRequest));
        return ResponseEntity.status(HttpStatus.CREATED).body(toProductResponse(saved));
    }

    @Override
    public ResponseEntity<ProductResponse> getProductById(Long productId) {
        return produitRepository.findById(productId)
                .map(produit -> ResponseEntity.ok(toProductResponse(produit)))
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<ProductResponse> updateProduct(Long productId, ProductRequest productRequest) {
        Produit produit = produitRepository.findById(productId)
                .orElse(null);
        if (produit == null) {
            return ResponseEntity.notFound().build();
        }

        validateUniqueSkuAndSlug(productRequest.getSku(), productRequest.getSlug(), productId);
        applyRequest(produit, productRequest);

        Produit updated = produitRepository.save(produit);
        return ResponseEntity.ok(toProductResponse(updated));
    }

    @Override
    public ResponseEntity<Void> deleteProduct(Long productId) {
        if (!produitRepository.existsById(productId)) {
            return ResponseEntity.notFound().build();
        }
        productImageService.deleteAllForProduct(productId);
        produitRepository.deleteById(productId);
        return ResponseEntity.noContent().build();
    }

    private void validateUniqueSkuAndSlug(String sku, String slug, Long excludeId) {
        produitRepository.findBySku(sku).ifPresent(existing -> {
            if (excludeId == null || !existing.getId().equals(excludeId)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "SKU already exists: " + sku);
            }
        });
        produitRepository.findBySlug(slug).ifPresent(existing -> {
            if (excludeId == null || !existing.getId().equals(excludeId)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Slug already exists: " + slug);
            }
        });
    }

    private Produit toProduit(ProductRequest request) {
        return applyRequest(Produit.builder().build(), request);
    }

    private Produit applyRequest(Produit produit, ProductRequest request) {
        produit.setSku(request.getSku());
        produit.setName(request.getName());
        produit.setSlug(request.getSlug());
        produit.setDescription(request.getDescription());
        produit.setPrice(toBigDecimal(request.getPrice()));
        produit.setCompareAtPrice(toBigDecimal(request.getCompareAtPrice()));
        produit.setCostPrice(toBigDecimal(request.getCostPrice()));
        produit.setCategoryId(request.getCategoryId());
        produit.setBrand(request.getBrand());
        produit.setWeight(toBigDecimal(request.getWeight()));
        if (request.getIsActive() != null) {
            produit.setIsActive(request.getIsActive());
        }
        if (request.getIsFeatured() != null) {
            produit.setIsFeatured(request.getIsFeatured());
        }
        produit.setMetaTitle(request.getMetaTitle());
        produit.setMetaDescription(request.getMetaDescription());
        return produit;
    }

    private ProductResponse toProductResponse(Produit produit) {
        ProductResponse response = new ProductResponse();
        response.setId(produit.getId());
        response.setSku(produit.getSku());
        response.setName(produit.getName());
        response.setSlug(produit.getSlug());
        response.setDescription(produit.getDescription());
        response.setPrice(toDouble(produit.getPrice()));
        response.setCompareAtPrice(toDouble(produit.getCompareAtPrice()));
        response.setCostPrice(toDouble(produit.getCostPrice()));
        response.setCategoryId(produit.getCategoryId());
        response.setBrand(produit.getBrand());
        response.setWeight(toDouble(produit.getWeight()));
        response.setIsActive(produit.getIsActive());
        response.setIsFeatured(produit.getIsFeatured());
        response.setMetaTitle(produit.getMetaTitle());
        response.setMetaDescription(produit.getMetaDescription());
        response.setImageUrl(productImageService.resolvePrimaryImageUrl(produit.getId()));
        response.setCreatedAt(produit.getCreatedAt());
        response.setUpdatedAt(produit.getUpdatedAt());
        return response;
    }

    private BigDecimal toBigDecimal(Double value) {
        return value != null ? BigDecimal.valueOf(value) : null;
    }

    private Double toDouble(BigDecimal value) {
        return value != null ? value.doubleValue() : null;
    }
}
