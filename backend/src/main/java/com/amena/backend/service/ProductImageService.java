package com.amena.backend.service;

import com.amena.backend.dto.ProductImageResponse;
import com.amena.backend.entity.ImageProduit;
import com.amena.backend.repository.ImageProduitRepository;
import com.amena.backend.repository.ProduitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductImageService {

    private final ImageProduitRepository imageProduitRepository;
    private final ProduitRepository produitRepository;
    private final ProductImageStorageService storageService;

    @Transactional(readOnly = true)
    public List<ProductImageResponse> listByProduct(Long productId) {
        ensureProductExists(productId);
        return imageProduitRepository.findByProductIdOrderBySortOrderAscIdAsc(productId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public String resolvePrimaryImageUrl(Long productId) {
        if (productId == null) {
            return null;
        }
        return imageProduitRepository.findByProductIdAndIsPrimaryTrue(productId)
                .or(() -> imageProduitRepository.findFirstByProductIdOrderBySortOrderAscIdAsc(productId))
                .map(ImageProduit::getImageUrl)
                .orElse(null);
    }

    @Transactional
    public ProductImageResponse upload(Long productId, MultipartFile file, boolean primary) {
        var product = produitRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        String storedPath = storageService.store(file, productId);
        int nextSortOrder = imageProduitRepository.findByProductIdOrderBySortOrderAscIdAsc(productId).size();
        boolean makePrimary = primary || nextSortOrder == 0;

        if (makePrimary) {
            imageProduitRepository.clearPrimaryForProduct(productId);
        }

        ImageProduit image = ImageProduit.builder()
                .productId(productId)
                .imageUrl(storedPath)
                .altText(product.getName())
                .sortOrder(nextSortOrder)
                .isPrimary(makePrimary)
                .build();

        return toResponse(imageProduitRepository.save(image));
    }

    @Transactional
    public void delete(Long productId, Long imageId) {
        ensureProductExists(productId);
        ImageProduit image = imageProduitRepository.findById(imageId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found"));

        if (!image.getProductId().equals(productId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found for this product");
        }

        storageService.deleteIfManaged(image.getImageUrl());
        imageProduitRepository.delete(image);
    }

    @Transactional
    public void deleteAllForProduct(Long productId) {
        List<ImageProduit> images = imageProduitRepository.findByProductIdOrderBySortOrderAscIdAsc(productId);
        for (ImageProduit image : images) {
            storageService.deleteIfManaged(image.getImageUrl());
        }
        imageProduitRepository.deleteByProductId(productId);
    }

    private void ensureProductExists(Long productId) {
        if (!produitRepository.existsById(productId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
        }
    }

    private ProductImageResponse toResponse(ImageProduit image) {
        return ProductImageResponse.builder()
                .id(image.getId())
                .productId(image.getProductId())
                .imageUrl(image.getImageUrl())
                .altText(image.getAltText())
                .sortOrder(image.getSortOrder())
                .isPrimary(image.getIsPrimary())
                .createdAt(image.getCreatedAt())
                .build();
    }
}
