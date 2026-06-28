package com.amena.backend.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConfigurationProperties(prefix = "amena.storage")
@Getter
@Setter
public class StorageProperties {

    private String uploadDir = "uploads";
    private String publicBasePath = "/uploads";
    private long maxFileSizeBytes = 5 * 1024 * 1024;
    private List<String> allowedContentTypes = List.of("image/jpeg", "image/png", "image/webp", "image/gif");
}
