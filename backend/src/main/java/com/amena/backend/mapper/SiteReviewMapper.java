package com.amena.backend.mapper;

import com.amena.backend.dto.SiteReviewRequest;
import com.amena.backend.dto.SiteReviewResponse;
import com.amena.backend.entity.SiteReview;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@Mapper(componentModel = "spring")
public interface SiteReviewMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    SiteReview toEntity(SiteReviewRequest request);
    
    SiteReviewResponse toDto(SiteReview entity);

    default OffsetDateTime map(LocalDateTime value) {
        if (value == null) {
            return null;
        }
        return value.atOffset(ZoneOffset.UTC);
    }
}
