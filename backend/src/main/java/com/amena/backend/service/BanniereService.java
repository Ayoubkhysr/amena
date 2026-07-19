package com.amena.backend.service;

import com.amena.backend.dto.BanniereRequest;
import com.amena.backend.dto.BanniereResponse;
import com.amena.backend.entity.Banniere;
import com.amena.backend.repository.BanniereRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.ZoneOffset;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BanniereService {

    private final BanniereRepository banniereRepository;

    @Transactional(readOnly = true)
    public List<BanniereResponse> getBannieres() {
        return banniereRepository.findAllByOrderByPositionAscIdDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public BanniereResponse getBanniereById(Long id) {
        return banniereRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Banniere not found"));
    }

    @Transactional
    public BanniereResponse createBanniere(BanniereRequest request) {
        Banniere banniere = Banniere.builder()
                .title(request.getTitle())
                .imageUrl(request.getImageUrl())
                .targetUrl(request.getTargetUrl())
                .position(request.getPosition() != null ? request.getPosition() : 1)
                .status(request.getStatus().getValue())
                .build();

        return toResponse(banniereRepository.save(banniere));
    }

    @Transactional
    public BanniereResponse updateBanniere(Long id, BanniereRequest request) {
        Banniere banniere = banniereRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Banniere not found"));

        banniere.setTitle(request.getTitle());
        banniere.setImageUrl(request.getImageUrl());
        banniere.setTargetUrl(request.getTargetUrl());
        banniere.setPosition(request.getPosition() != null ? request.getPosition() : 1);
        banniere.setStatus(request.getStatus().getValue());

        return toResponse(banniereRepository.save(banniere));
    }

    @Transactional
    public void deleteBanniere(Long id) {
        if (!banniereRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Banniere not found");
        }
        banniereRepository.deleteById(id);
    }

    private BanniereResponse toResponse(Banniere banniere) {
        BanniereResponse response = new BanniereResponse();
        response.setId(banniere.getId());
        response.setTitle(banniere.getTitle());
        response.setImageUrl(banniere.getImageUrl());
        response.setTargetUrl(banniere.getTargetUrl());
        response.setPosition(banniere.getPosition());
        response.setStatus(BanniereResponse.StatusEnum.fromValue(banniere.getStatus()));
        if (banniere.getCreatedAt() != null) {
            response.setCreatedAt(banniere.getCreatedAt());
        }
        if (banniere.getUpdatedAt() != null) {
            response.setUpdatedAt(banniere.getUpdatedAt());
        }
        return response;
    }
}
