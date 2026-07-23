package com.amena.backend.service;

import com.amena.backend.dto.CategoryRequest;
import com.amena.backend.dto.CategoryResponse;
import com.amena.backend.entity.Categorie;
import com.amena.backend.mapper.CategorieMapper;
import com.amena.backend.repository.CategorieRepository;
import com.amena.backend.repository.ProduitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class CategorieService {

    private final CategorieRepository categorieRepository;
    private final ProduitRepository produitRepository;
    private final CategorieMapper categorieMapper;

    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategories() {
        return categorieRepository.findAll().stream()
                .map(this::toResponseWithProductCount)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        return categorieRepository.findById(id)
                .map(this::toResponseWithProductCount)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        validateUniqueNameForParent(request.getName(), request.getParentId(), null);
        String slug = resolveUniqueSlug(request.getName(), request.getSlug(), null, null);

        Categorie categorie = categorieMapper.toEntity(request);
        categorie.setSlug(slug);
        Categorie saved = categorieRepository.save(categorie);
        return toResponseWithProductCount(saved);
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Categorie categorie = categorieRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        validateUniqueNameForParent(request.getName(), request.getParentId(), id);
        String slug = resolveUniqueSlug(request.getName(), request.getSlug(), categorie.getSlug(), id);
        categorieMapper.updateEntity(request, categorie);
        categorie.setSlug(slug);

        Categorie updated = categorieRepository.save(categorie);
        return toResponseWithProductCount(updated);
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categorieRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found");
        }
        categorieRepository.deleteById(id);
    }

    private void validateUniqueNameForParent(String name, Long parentId, Long excludeId) {
        categorieRepository.findByNameAndParentId(name, parentId).ifPresent(existing -> {
            if (excludeId == null || !existing.getId().equals(excludeId)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Category name already exists under this parent: " + name);
            }
        });
    }

    private String resolveUniqueSlug(String name, String requestedSlug, String existingSlug, Long excludeId) {
        String base;
        if (requestedSlug != null && !requestedSlug.isBlank()) {
            base = slugify(requestedSlug);
        } else if (existingSlug != null && !existingSlug.isBlank()) {
            base = existingSlug;
        } else {
            base = slugify(name);
        }

        String candidate = base;
        int suffix = 2;
        while (isSlugTaken(candidate, excludeId)) {
            candidate = base + "-" + suffix;
            suffix++;
        }
        return candidate;
    }

    private boolean isSlugTaken(String slug, Long excludeId) {
        return categorieRepository.findBySlug(slug)
                .filter(existing -> excludeId == null || !existing.getId().equals(excludeId))
                .isPresent();
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

    private CategoryResponse toResponseWithProductCount(Categorie categorie) {
        CategoryResponse response = categorieMapper.toResponse(categorie);
        response.setProductCount((int) produitRepository.countByCategoryId(categorie.getId()));
        return response;
    }
}
