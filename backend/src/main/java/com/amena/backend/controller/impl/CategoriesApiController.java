package com.amena.backend.controller.impl;

import com.amena.backend.api.CategoriesApi;
import com.amena.backend.dto.CategoryRequest;
import com.amena.backend.dto.CategoryResponse;
import com.amena.backend.entity.Categorie;
import com.amena.backend.repository.CategorieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;

@RestController
@RequiredArgsConstructor
public class CategoriesApiController implements CategoriesApi {

    private final CategorieRepository categorieRepository;

    @Override
    public ResponseEntity<List<CategoryResponse>> getCategories() {
        List<CategoryResponse> categories = categorieRepository.findAll().stream()
                .map(this::toCategoryResponse)
                .toList();
        return ResponseEntity.ok(categories);
    }

    @Override
    public ResponseEntity<CategoryResponse> createCategory(CategoryRequest categoryRequest) {
        String slug = resolveSlug(categoryRequest.getName(), categoryRequest.getSlug(), null);
        validateUniqueNameAndSlug(categoryRequest.getName(), slug, null);

        Categorie saved = categorieRepository.save(toCategorie(categoryRequest, slug));
        return ResponseEntity.status(HttpStatus.CREATED).body(toCategoryResponse(saved));
    }

    @Override
    public ResponseEntity<CategoryResponse> getCategoryById(Long categoryId) {
        return categorieRepository.findById(categoryId)
                .map(categorie -> ResponseEntity.ok(toCategoryResponse(categorie)))
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<CategoryResponse> updateCategory(Long categoryId, CategoryRequest categoryRequest) {
        Categorie categorie = categorieRepository.findById(categoryId).orElse(null);
        if (categorie == null) {
            return ResponseEntity.notFound().build();
        }

        String slug = resolveSlug(categoryRequest.getName(), categoryRequest.getSlug(), categorie.getSlug());
        validateUniqueNameAndSlug(categoryRequest.getName(), slug, categoryId);
        applyRequest(categorie, categoryRequest, slug);

        Categorie updated = categorieRepository.save(categorie);
        return ResponseEntity.ok(toCategoryResponse(updated));
    }

    @Override
    public ResponseEntity<Void> deleteCategory(Long categoryId) {
        if (!categorieRepository.existsById(categoryId)) {
            return ResponseEntity.notFound().build();
        }
        categorieRepository.deleteById(categoryId);
        return ResponseEntity.noContent().build();
    }

    private void validateUniqueNameAndSlug(String name, String slug, Long excludeId) {
        categorieRepository.findByName(name).ifPresent(existing -> {
            if (excludeId == null || !existing.getId().equals(excludeId)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Category name already exists: " + name);
            }
        });
        categorieRepository.findBySlug(slug).ifPresent(existing -> {
            if (excludeId == null || !existing.getId().equals(excludeId)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Category slug already exists: " + slug);
            }
        });
    }

    private String resolveSlug(String name, String requestedSlug, String existingSlug) {
        if (requestedSlug != null && !requestedSlug.isBlank()) {
            return slugify(requestedSlug);
        }
        if (existingSlug != null && !existingSlug.isBlank()) {
            return existingSlug;
        }
        return slugify(name);
    }

    private String slugify(String text) {
        if (text == null || text.isBlank()) {
            return "categorie-" + System.currentTimeMillis();
        }
        String normalized = Normalizer.normalize(text, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-+|-+$", "");
        return normalized.isBlank() ? "categorie-" + System.currentTimeMillis() : normalized;
    }

    private Categorie toCategorie(CategoryRequest request, String slug) {
        return applyRequest(Categorie.builder().build(), request, slug);
    }

    private Categorie applyRequest(Categorie categorie, CategoryRequest request, String slug) {
        categorie.setName(request.getName());
        categorie.setSlug(slug);
        categorie.setDescription(request.getDescription());
        categorie.setParentId(request.getParentId());
        categorie.setImageUrl(request.getImageUrl());
        if (request.getIsActive() != null) {
            categorie.setIsActive(request.getIsActive());
        }
        if (request.getSortOrder() != null) {
            categorie.setSortOrder(request.getSortOrder());
        }
        return categorie;
    }

    private CategoryResponse toCategoryResponse(Categorie categorie) {
        CategoryResponse response = new CategoryResponse();
        response.setId(categorie.getId());
        response.setName(categorie.getName());
        response.setSlug(categorie.getSlug());
        response.setDescription(categorie.getDescription());
        response.setParentId(categorie.getParentId());
        response.setImageUrl(categorie.getImageUrl());
        response.setIsActive(categorie.getIsActive());
        response.setSortOrder(categorie.getSortOrder());
        response.setCreatedAt(categorie.getCreatedAt());
        return response;
    }
}
