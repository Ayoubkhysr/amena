package com.amena.backend.controller.impl;

import com.amena.backend.api.CategoriesApi;
import com.amena.backend.dto.CategoryRequest;
import com.amena.backend.dto.CategoryResponse;
import com.amena.backend.service.CategorieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CategoriesApiController implements CategoriesApi {

    private final CategorieService categorieService;

    @Override
    public ResponseEntity<List<CategoryResponse>> getCategories() {
        return ResponseEntity.ok(categorieService.getCategories());
    }

    @Override
    public ResponseEntity<CategoryResponse> createCategory(CategoryRequest categoryRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categorieService.createCategory(categoryRequest));
    }

    @Override
    public ResponseEntity<CategoryResponse> getCategoryById(Long categoryId) {
        return ResponseEntity.ok(categorieService.getCategoryById(categoryId));
    }

    @Override
    public ResponseEntity<CategoryResponse> updateCategory(Long categoryId, CategoryRequest categoryRequest) {
        return ResponseEntity.ok(categorieService.updateCategory(categoryId, categoryRequest));
    }

    @Override
    public ResponseEntity<Void> deleteCategory(Long categoryId) {
        categorieService.deleteCategory(categoryId);
        return ResponseEntity.noContent().build();
    }
}
