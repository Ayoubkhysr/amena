package com.amena.backend.controller.impl;

import com.amena.backend.api.OffresApi;
import com.amena.backend.dto.OffreRequest;
import com.amena.backend.dto.OffreResponse;
import com.amena.backend.entity.Offre;
import com.amena.backend.repository.CategorieRepository;
import com.amena.backend.repository.OffreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class OffresApiController implements OffresApi {

    private final OffreRepository offreRepository;
    private final CategorieRepository categorieRepository;

    @Override
    public ResponseEntity<List<OffreResponse>> getOffres() {
        List<OffreResponse> offres = offreRepository.findAll().stream()
                .map(this::toOffreResponse)
                .toList();
        return ResponseEntity.ok(offres);
    }

    @Override
    public ResponseEntity<OffreResponse> createOffre(OffreRequest offreRequest) {
        validateCategoryExists(offreRequest.getCategoryId());

        Offre saved = offreRepository.save(toOffre(offreRequest));
        return ResponseEntity.status(HttpStatus.CREATED).body(toOffreResponse(saved));
    }

    @Override
    public ResponseEntity<OffreResponse> getOffreById(Long offreId) {
        return offreRepository.findById(offreId)
                .map(offre -> ResponseEntity.ok(toOffreResponse(offre)))
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<OffreResponse> updateOffre(Long offreId, OffreRequest offreRequest) {
        Offre offre = offreRepository.findById(offreId).orElse(null);
        if (offre == null) {
            return ResponseEntity.notFound().build();
        }

        validateCategoryExists(offreRequest.getCategoryId());
        applyRequest(offre, offreRequest);

        Offre updated = offreRepository.save(offre);
        return ResponseEntity.ok(toOffreResponse(updated));
    }

    @Override
    public ResponseEntity<Void> deleteOffre(Long offreId) {
        if (!offreRepository.existsById(offreId)) {
            return ResponseEntity.notFound().build();
        }
        offreRepository.deleteById(offreId);
        return ResponseEntity.noContent().build();
    }

    private void validateCategoryExists(Long categoryId) {
        if (categoryId != null && !categorieRepository.existsById(categoryId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category not found: " + categoryId);
        }
    }

    private Offre toOffre(OffreRequest request) {
        return applyRequest(Offre.builder().build(), request);
    }

    private Offre applyRequest(Offre offre, OffreRequest request) {
        offre.setLabel(request.getLabel());
        offre.setCategoryId(request.getCategoryId());
        offre.setDiscountPercentage(toBigDecimal(request.getDiscountPercentage()));
        offre.setStartsAt(request.getStartsAt());
        offre.setEndsAt(request.getEndsAt());
        if (request.getIsActive() != null) {
            offre.setIsActive(request.getIsActive());
        }
        return offre;
    }

    private OffreResponse toOffreResponse(Offre offre) {
        OffreResponse response = new OffreResponse();
        response.setId(offre.getId());
        response.setLabel(offre.getLabel());
        response.setCategoryId(offre.getCategoryId());
        response.setCategoryName(resolveCategoryName(offre.getCategoryId()));
        response.setDiscountPercentage(toDouble(offre.getDiscountPercentage()));
        response.setStartsAt(offre.getStartsAt());
        response.setEndsAt(offre.getEndsAt());
        response.setIsActive(offre.getIsActive());
        response.setCreatedAt(offre.getCreatedAt());
        return response;
    }

    private String resolveCategoryName(Long categoryId) {
        if (categoryId == null) {
            return "Autre";
        }
        return categorieRepository.findById(categoryId)
                .map(cat -> cat.getName())
                .orElse("Autre");
    }

    private BigDecimal toBigDecimal(Double value) {
        return value != null ? BigDecimal.valueOf(value) : null;
    }

    private Double toDouble(BigDecimal value) {
        return value != null ? value.doubleValue() : null;
    }
}
