package com.amena.backend.service;

import com.amena.backend.dto.CouponRequest;
import com.amena.backend.dto.CouponResponse;
import com.amena.backend.entity.Coupon;
import com.amena.backend.mapper.CouponMapper;
import com.amena.backend.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;
    private final CouponMapper couponMapper;

    @Transactional(readOnly = true)
    public List<CouponResponse> getCoupons() {
        return couponRepository.findAll().stream()
                .map(couponMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CouponResponse getCouponById(Long id) {
        return couponRepository.findById(id)
                .map(couponMapper::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Coupon not found"));
    }

    @Transactional
    public CouponResponse createCoupon(CouponRequest request) {
        validateUniqueCode(request.getCode(), null);
        Coupon coupon = couponMapper.toEntity(request);
        Coupon saved = couponRepository.save(coupon);
        return couponMapper.toResponse(saved);
    }

    @Transactional
    public CouponResponse updateCoupon(Long id, CouponRequest request) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Coupon not found"));

        validateUniqueCode(request.getCode(), id);
        couponMapper.updateEntity(request, coupon);

        Coupon updated = couponRepository.save(coupon);
        return couponMapper.toResponse(updated);
    }

    @Transactional
    public void deleteCoupon(Long id) {
        if (!couponRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Coupon not found");
        }
        couponRepository.deleteById(id);
    }

    private void validateUniqueCode(String code, Long excludeId) {
        couponRepository.findByCode(code).ifPresent(existing -> {
            if (excludeId == null || !existing.getId().equals(excludeId)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Coupon code already exists: " + code);
            }
        });
    }
}
