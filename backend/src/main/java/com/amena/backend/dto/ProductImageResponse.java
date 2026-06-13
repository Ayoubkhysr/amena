package com.amena.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageResponse {

    private Long id;
    private Long productId;
    private String imageUrl;
    private String altText;
    private Integer sortOrder;
    private Boolean isPrimary;
    private OffsetDateTime createdAt;
}
