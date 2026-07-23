package com.amena.backend.mapper;

import com.amena.backend.dto.ProductRequest;
import com.amena.backend.dto.ProductResponse;
import com.amena.backend.entity.Categorie;
import com.amena.backend.entity.Produit;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.math.BigDecimal;
import java.util.Set;

@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.ERROR)
public interface ProduitMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "subCategories", ignore = true)
    @Mapping(target = "subcategory", ignore = true)
    Produit toEntity(ProductRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "subCategories", ignore = true)
    void updateEntity(ProductRequest request, @MappingTarget Produit produit);

    @Mapping(target = "subcategoryIds", ignore = true)
    @Mapping(target = "imageUrl", ignore = true)
    ProductResponse toResponse(Produit produit);

    default BigDecimal map(Double value) {
        return value != null ? BigDecimal.valueOf(value) : null;
    }

    default Double map(BigDecimal value) {
        return value != null ? value.doubleValue() : null;
    }

    @AfterMapping
    default void mapSubcategoryIds(Produit produit, @MappingTarget ProductResponse response) {
        Set<Categorie> subCategories = produit.getSubCategories();
        if (subCategories != null && !subCategories.isEmpty()) {
            response.setSubcategoryIds(subCategories.stream().map(Categorie::getId).toList());
        }
    }
}
