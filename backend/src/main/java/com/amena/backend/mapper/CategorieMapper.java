package com.amena.backend.mapper;

import com.amena.backend.dto.CategoryRequest;
import com.amena.backend.dto.CategoryResponse;
import com.amena.backend.entity.Categorie;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.ERROR)
public interface CategorieMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Categorie toEntity(CategoryRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateEntity(CategoryRequest request, @MappingTarget Categorie categorie);

    @Mapping(target = "productCount", ignore = true)
    CategoryResponse toResponse(Categorie categorie);
}
