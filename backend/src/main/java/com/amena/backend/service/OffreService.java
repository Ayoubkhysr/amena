package com.amena.backend.service;

import com.amena.backend.dto.OffreRequest;
import com.amena.backend.dto.OffreResponse;
import com.amena.backend.entity.Offre;
import com.amena.backend.mapper.OffreMapper;
import com.amena.backend.repository.CategorieRepository;
import com.amena.backend.repository.OffreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OffreService {

    private final OffreRepository offreRepository;
    private final CategorieRepository categorieRepository;
    private final OffreMapper offreMapper;

    @Transactional(readOnly = true)
    public List<OffreResponse> getOffres() {
        return offreRepository.findAll().stream()
                .map(this::toResponseWithCategoryName)
                .toList();
    }

    @Transactional(readOnly = true)
    public OffreResponse getOffreById(Long id) {
        return offreRepository.findById(id)
                .map(this::toResponseWithCategoryName)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Offer not found"));
    }

    @Transactional
    public OffreResponse createOffre(OffreRequest request) {
        validateCategoryExists(request.getCategoryId());
        Offre offre = offreMapper.toEntity(request);
        Offre saved = offreRepository.save(offre);
        return toResponseWithCategoryName(saved);
    }

    @Transactional
    public OffreResponse updateOffre(Long id, OffreRequest request) {
        Offre offre = offreRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Offer not found"));

        validateCategoryExists(request.getCategoryId());
        offreMapper.updateEntity(request, offre);

        Offre updated = offreRepository.save(offre);
        return toResponseWithCategoryName(updated);
    }

    @Transactional
    public void deleteOffre(Long id) {
        if (!offreRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Offer not found");
        }
        offreRepository.deleteById(id);
    }

    private void validateCategoryExists(Long categoryId) {
        if (categoryId != null && !categorieRepository.existsById(categoryId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category not found: " + categoryId);
        }
    }

    private OffreResponse toResponseWithCategoryName(Offre offre) {
        OffreResponse response = offreMapper.toResponse(offre);
        if (offre.getCategoryId() == null) {
            response.setCategoryName("Autre");
        } else {
            response.setCategoryName(categorieRepository.findById(offre.getCategoryId())
                    .map(cat -> cat.getName())
                    .orElse("Autre"));
        }
        return response;
    }
}
