package com.amena.backend.mapper;

import com.amena.backend.dto.CouponRequest;
import com.amena.backend.dto.CouponResponse;
import com.amena.backend.entity.Coupon;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.math.BigDecimal;

@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.ERROR)
public interface CouponMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "usedCount", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Coupon toEntity(CouponRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "usedCount", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateEntity(CouponRequest request, @MappingTarget Coupon coupon);

    CouponResponse toResponse(Coupon coupon);

    default BigDecimal map(Double value) {
        return value != null ? BigDecimal.valueOf(value) : null;
    }

    default Double map(BigDecimal value) {
        return value != null ? value.doubleValue() : null;
    }
}
