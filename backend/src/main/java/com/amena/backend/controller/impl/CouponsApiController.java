package com.amena.backend.controller.impl;

import com.amena.backend.api.CouponsApi;
import com.amena.backend.dto.CouponRequest;
import com.amena.backend.dto.CouponResponse;
import com.amena.backend.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CouponsApiController implements CouponsApi {

    private final CouponService couponService;

    @Override
    public ResponseEntity<List<CouponResponse>> getCoupons() {
        return ResponseEntity.ok(couponService.getCoupons());
    }

    @Override
    public ResponseEntity<CouponResponse> createCoupon(CouponRequest couponRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(couponService.createCoupon(couponRequest));
    }

    @Override
    public ResponseEntity<CouponResponse> getCouponById(Long couponId) {
        return ResponseEntity.ok(couponService.getCouponById(couponId));
    }

    @Override
    public ResponseEntity<CouponResponse> updateCoupon(Long couponId, CouponRequest couponRequest) {
        return ResponseEntity.ok(couponService.updateCoupon(couponId, couponRequest));
    }

    @Override
    public ResponseEntity<Void> deleteCoupon(Long couponId) {
        couponService.deleteCoupon(couponId);
        return ResponseEntity.noContent().build();
    }
}
