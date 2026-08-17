package com.amena.backend.controller;

import com.amena.backend.api.SiteReviewsApi;
import com.amena.backend.dto.SiteReviewRequest;
import com.amena.backend.dto.SiteReviewResponse;
import com.amena.backend.service.SiteReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SiteReviewController implements SiteReviewsApi {

    private final SiteReviewService siteReviewService;

    @Override
    public ResponseEntity<SiteReviewResponse> createSiteReview(SiteReviewRequest siteReviewRequest) {
        return new ResponseEntity<>(siteReviewService.createSiteReview(siteReviewRequest), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<Void> deleteSiteReview(Long id) {
        siteReviewService.deleteSiteReview(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Override
    public ResponseEntity<List<SiteReviewResponse>> getSiteReviews() {
        return ResponseEntity.ok(siteReviewService.getAllSiteReviews());
    }
}
