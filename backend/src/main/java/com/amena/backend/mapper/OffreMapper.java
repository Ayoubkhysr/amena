package com.amena.backend.mapper;

import com.amena.backend.dto.OffreRequest;
import com.amena.backend.dto.OffreResponse;
import com.amena.backend.entity.Offre;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.math.BigDecimal;

@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.ERROR)
public interface OffreMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Offre toEntity(OffreRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateEntity(OffreRequest request, @MappingTarget Offre offre);

    @Mapping(target = "categoryName", ignore = true)
    OffreResponse toResponse(Offre offre);

    default BigDecimal map(Double value) {
        return value != null ? BigDecimal.valueOf(value) : null;
    }

    default Double map(BigDecimal value) {
        return value != null ? value.doubleValue() : null;
    }
}
