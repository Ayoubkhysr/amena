package com.amena.backend.controller.impl;

import com.amena.backend.api.CouponsApi;
import com.amena.backend.dto.CouponRequest;
import com.amena.backend.dto.CouponResponse;
import com.amena.backend.entity.Coupon;
import com.amena.backend.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class CouponsApiController implements CouponsApi {

    private final CouponRepository couponRepository;

    @Override
    public ResponseEntity<List<CouponResponse>> getCoupons() {
        List<CouponResponse> coupons = couponRepository.findAll().stream()
                .map(this::toCouponResponse)
                .toList();
        return ResponseEntity.ok(coupons);
    }

    @Override
    public ResponseEntity<CouponResponse> createCoupon(CouponRequest couponRequest) {
        validateUniqueCode(couponRequest.getCode(), null);

        Coupon saved = couponRepository.save(toCoupon(couponRequest));
        return ResponseEntity.status(HttpStatus.CREATED).body(toCouponResponse(saved));
    }

    @Override
    public ResponseEntity<CouponResponse> getCouponById(Long couponId) {
        return couponRepository.findById(couponId)
                .map(coupon -> ResponseEntity.ok(toCouponResponse(coupon)))
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<CouponResponse> updateCoupon(Long couponId, CouponRequest couponRequest) {
        Coupon coupon = couponRepository.findById(couponId).orElse(null);
        if (coupon == null) {
            return ResponseEntity.notFound().build();
        }

        validateUniqueCode(couponRequest.getCode(), couponId);
        applyRequest(coupon, couponRequest);

        Coupon updated = couponRepository.save(coupon);
        return ResponseEntity.ok(toCouponResponse(updated));
    }

    @Override
    public ResponseEntity<Void> deleteCoupon(Long couponId) {
        if (!couponRepository.existsById(couponId)) {
            return ResponseEntity.notFound().build();
        }
        couponRepository.deleteById(couponId);
        return ResponseEntity.noContent().build();
    }

    private void validateUniqueCode(String code, Long excludeId) {
        couponRepository.findByCode(code).ifPresent(existing -> {
            if (excludeId == null || !existing.getId().equals(excludeId)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Coupon code already exists: " + code);
            }
        });
    }

    private Coupon toCoupon(CouponRequest request) {
        return applyRequest(Coupon.builder().build(), request);
    }

    private Coupon applyRequest(Coupon coupon, CouponRequest request) {
        coupon.setCode(request.getCode());
        coupon.setDescription(request.getDescription());
        coupon.setDiscountType(request.getDiscountType());
        coupon.setDiscountValue(toBigDecimal(request.getDiscountValue()));
        coupon.setMinimumOrderAmount(toBigDecimal(request.getMinimumOrderAmount()));
        coupon.setMaximumDiscount(toBigDecimal(request.getMaximumDiscount()));
        coupon.setUsageLimit(request.getUsageLimit());
        coupon.setStartsAt(request.getStartsAt());
        coupon.setExpiresAt(request.getExpiresAt());
        if (request.getIsActive() != null) {
            coupon.setIsActive(request.getIsActive());
        }
        return coupon;
    }

    private CouponResponse toCouponResponse(Coupon coupon) {
        CouponResponse response = new CouponResponse();
        response.setId(coupon.getId());
        response.setCode(coupon.getCode());
        response.setDescription(coupon.getDescription());
        response.setDiscountType(coupon.getDiscountType());
        response.setDiscountValue(toDouble(coupon.getDiscountValue()));
        response.setMinimumOrderAmount(toDouble(coupon.getMinimumOrderAmount()));
        response.setMaximumDiscount(toDouble(coupon.getMaximumDiscount()));
        response.setUsageLimit(coupon.getUsageLimit());
        response.setUsedCount(coupon.getUsedCount());
        response.setStartsAt(coupon.getStartsAt());
        response.setExpiresAt(coupon.getExpiresAt());
        response.setIsActive(coupon.getIsActive());
        response.setCreatedAt(coupon.getCreatedAt());
        return response;
    }

    private BigDecimal toBigDecimal(Double value) {
        return value != null ? BigDecimal.valueOf(value) : null;
    }

    private Double toDouble(BigDecimal value) {
        return value != null ? value.doubleValue() : null;
    }
}
