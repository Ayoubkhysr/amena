package com.amena.backend.service;

import com.amena.backend.config.StorageProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductImageStorageService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(".jpg", ".jpeg", ".png", ".webp", ".gif");

    private final StorageProperties storageProperties;

    public String store(MultipartFile file, Long productId) {
        validate(file);

        String extension = resolveExtension(file);
        String filename = "product-" + productId + "-" + UUID.randomUUID() + extension;
        Path destination = resolveProductsDir().resolve(filename);

        try {
            Files.createDirectories(destination.getParent());
            file.transferTo(destination);
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store image file", ex);
        }

        return storageProperties.getPublicBasePath() + "/products/" + filename;
    }

    public void deleteIfManaged(String publicPath) {
        if (publicPath == null || publicPath.isBlank()) {
            return;
        }

        String basePath = storageProperties.getPublicBasePath();
        if (!publicPath.startsWith(basePath + "/")) {
            return;
        }

        String relativePath = publicPath.substring(basePath.length() + 1);
        Path filePath = Paths.get(storageProperties.getUploadDir()).resolve(relativePath).normalize();
        Path uploadRoot = Paths.get(storageProperties.getUploadDir()).toAbsolutePath().normalize();

        if (!filePath.toAbsolutePath().normalize().startsWith(uploadRoot)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid image path");
        }

        try {
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete image file", ex);
        }
    }

    private void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Image file is required");
        }

        if (file.getSize() > storageProperties.getMaxFileSizeBytes()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Image file exceeds maximum allowed size");
        }

        String contentType = file.getContentType();
        if (contentType == null || !storageProperties.getAllowedContentTypes().contains(contentType.toLowerCase(Locale.ROOT))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported image type: " + contentType);
        }
    }

    private String resolveExtension(MultipartFile file) {
        String originalName = file.getOriginalFilename();
        if (originalName != null && originalName.contains(".")) {
            String ext = originalName.substring(originalName.lastIndexOf('.')).toLowerCase(Locale.ROOT);
            if (ALLOWED_EXTENSIONS.contains(ext)) {
                return ext;
            }
        }

        return switch (file.getContentType()) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            default -> ".jpg";
        };
    }

    private Path resolveProductsDir() {
        return Paths.get(storageProperties.getUploadDir(), "products");
    }
}
