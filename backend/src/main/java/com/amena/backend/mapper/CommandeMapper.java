package com.amena.backend.mapper;

import com.amena.backend.dto.CreateOrderRequest;
import com.amena.backend.dto.OrderItemResponse;
import com.amena.backend.dto.OrderResponse;
import com.amena.backend.entity.Commande;
import com.amena.backend.entity.LigneCommande;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.math.BigDecimal;

@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.ERROR)
public interface CommandeMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "orderNumber", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "subtotal", source = "subtotal")
    @Mapping(target = "totalAmount", source = "totalAmount")
    @Mapping(target = "shippingAmount", source = "shippingAmount")
    @Mapping(target = "discountAmount", source = "discountAmount")
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "taxAmount", ignore = true)
    @Mapping(target = "currency", ignore = true)
    @Mapping(target = "shippingAddressId", ignore = true)
    @Mapping(target = "billingAddressId", ignore = true)
    @Mapping(target = "notes", source = "clientInfo")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "lignes", ignore = true)
    Commande toEntity(CreateOrderRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "clientName", ignore = true)
    @Mapping(target = "clientPhone", ignore = true)
    @Mapping(target = "address", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "orderNumber", ignore = true)
    @Mapping(target = "userId", ignore = true)
    OrderResponse toResponse(Commande commande);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "commande", ignore = true)
    @Mapping(target = "sku", ignore = true)
    @Mapping(target = "totalPrice", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    LigneCommande toLigneEntity(com.amena.backend.dto.CreateOrderItemRequest request);

    @Mapping(target = "productName", ignore = true)
    OrderItemResponse toLigneResponse(LigneCommande ligne);

    default BigDecimal map(Double value) {
        return value != null ? BigDecimal.valueOf(value) : null;
    }

    default Double map(BigDecimal value) {
        return value != null ? value.doubleValue() : null;
    }
}
