package com.amena.backend.controller;

import com.amena.backend.dto.ProductImageResponse;
import com.amena.backend.service.ProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/images")
@RequiredArgsConstructor
public class ProductImagesController {

    private final ProductImageService productImageService;

    @GetMapping
    public ResponseEntity<List<ProductImageResponse>> listImages(@PathVariable Long productId) {
        return ResponseEntity.ok(productImageService.listByProduct(productId));
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductImageResponse> uploadImage(
            @PathVariable Long productId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "primary", defaultValue = "true") boolean primary) {
        ProductImageResponse response = productImageService.upload(productId, file, primary);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long productId, @PathVariable Long imageId) {
        productImageService.delete(productId, imageId);
        return ResponseEntity.noContent().build();
    }
}
