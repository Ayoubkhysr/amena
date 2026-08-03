package com.amena.backend.service;

import com.amena.backend.dto.ProductPage;
import com.amena.backend.dto.ProductRequest;
import com.amena.backend.dto.ProductResponse;
import com.amena.backend.entity.Categorie;
import com.amena.backend.entity.Produit;
import com.amena.backend.mapper.ProduitMapper;
import com.amena.backend.repository.CategorieRepository;
import com.amena.backend.repository.ProduitRepository;
import jakarta.persistence.criteria.Join;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class ProduitService {

    private final ProduitRepository produitRepository;
    private final CategorieRepository categorieRepository;
    private final ProduitMapper produitMapper;
    private final ProductImageService productImageService;

    @Transactional(readOnly = true)
    public ProductPage getProducts(Integer page, Integer size, String search, Long categoryId, Long subcategoryId,
                                   Boolean isActive, String sortBy, String sortOrder, Integer maxStock) {
        Sort.Direction direction = "asc".equalsIgnoreCase(sortOrder) ? Sort.Direction.ASC : Sort.Direction.DESC;
        PageRequest pageable = PageRequest.of(page, size, Sort.by(direction, sortBy != null ? sortBy : "createdAt"));

        Specification<Produit> spec = Specification.where(null);
        if (search != null && !search.trim().isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("name")), "%" + search.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("sku")), "%" + search.toLowerCase() + "%")
            ));
        }
        if (categoryId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("categoryId"), categoryId));
        }
        if (subcategoryId != null) {
            spec = spec.and((root, query, cb) -> {
                Join<Produit, Categorie> subcats = root.join("subCategories");
                return cb.equal(subcats.get("id"), subcategoryId);
            });
        }
        if (isActive != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("isActive"), isActive));
        }
        if (maxStock != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("stock"), maxStock));
        }

        Page<Produit> productPageEntity = produitRepository.findAll(spec, pageable);

        ProductPage responsePage = new ProductPage();
        responsePage.setContent(productPageEntity.getContent().stream().map(this::toResponseWithImage).toList());
        responsePage.setNumber(productPageEntity.getNumber());
        responsePage.setSize(productPageEntity.getSize());
        responsePage.setTotalElements(productPageEntity.getTotalElements());
        responsePage.setTotalPages(productPageEntity.getTotalPages());
        responsePage.setFirst(productPageEntity.isFirst());
        responsePage.setLast(productPageEntity.isLast());
        responsePage.setEmpty(productPageEntity.isEmpty());
        return responsePage;
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        return produitRepository.findById(id)
                .map(this::toResponseWithImage)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    @Transactional(readOnly = true)
    public java.util.List<ProductResponse> getBestSellers(Integer limit) {
        PageRequest pageable = PageRequest.of(0, limit != null ? limit : 4);
        return produitRepository.findBestSellers(pageable).getContent().stream()
                .map(this::toResponseWithImage)
                .toList();
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        validateUniqueSkuAndSlug(request.getSku(), request.getSlug(), null);
        Produit produit = produitMapper.toEntity(request);
        applySubCategories(produit, request.getSubcategoryIds());
        Produit saved = produitRepository.save(produit);
        return toResponseWithImage(saved);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        validateUniqueSkuAndSlug(request.getSku(), request.getSlug(), id);
        produitMapper.updateEntity(request, produit);
        applySubCategories(produit, request.getSubcategoryIds());
        Produit updated = produitRepository.save(produit);
        return toResponseWithImage(updated);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!produitRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
        }
        
        if (produitRepository.isProductInOrders(id)) {
            // Cannot hard delete, so we soft delete
            produitRepository.findById(id).ifPresent(p -> {
                p.setIsActive(false);
                produitRepository.save(p);
            });
        } else {
            // Hard delete
            try {
                productImageService.deleteAllForProduct(id);
                produitRepository.deleteById(id);
            } catch (DataIntegrityViolationException e) {
                // Fallback for other constraints (like foreign keys in tables not mapped by JPA yet)
                produitRepository.findById(id).ifPresent(p -> {
                    p.setIsActive(false);
                    produitRepository.save(p);
                });
            }
        }
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

    private void applySubCategories(Produit produit, java.util.List<Long> subcategoryIds) {
        if (subcategoryIds != null && !subcategoryIds.isEmpty()) {
            produit.setSubCategories(new HashSet<>(categorieRepository.findAllById(subcategoryIds)));
        } else {
            produit.setSubCategories(new HashSet<>());
        }
    }

    private ProductResponse toResponseWithImage(Produit produit) {
        ProductResponse response = produitMapper.toResponse(produit);
        response.setImageUrl(productImageService.resolvePrimaryImageUrl(produit.getId()));
        return response;
    }
}
