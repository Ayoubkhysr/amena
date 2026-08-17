package com.amena.backend.service;

import com.amena.backend.dto.SiteReviewRequest;
import com.amena.backend.dto.SiteReviewResponse;
import com.amena.backend.entity.SiteReview;
import com.amena.backend.mapper.SiteReviewMapper;
import com.amena.backend.repository.SiteReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SiteReviewService {

    private final SiteReviewRepository repository;
    private final SiteReviewMapper mapper;

    @Transactional(readOnly = true)
    public List<SiteReviewResponse> getAllSiteReviews() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public SiteReviewResponse createSiteReview(SiteReviewRequest request) {
        SiteReview entity = mapper.toEntity(request);
        // By default, if date is empty or null, we might want to set it to today? 
        // The entity uses LocalDate for reviewDate. If not provided in request, we can handle it here or in mapper.
        if (entity.getReviewDate() == null) {
            entity.setReviewDate(java.time.LocalDate.now());
        }
        
        SiteReview saved = repository.save(entity);
        return mapper.toDto(saved);
    }

    @Transactional
    public void deleteSiteReview(Long id) {
        repository.deleteById(id);
    }
}
