package com.amena.backend.controller;

import com.amena.backend.api.OffresApi;
import com.amena.backend.dto.OffreRequest;
import com.amena.backend.dto.OffreResponse;
import com.amena.backend.service.OffreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class OffresController implements OffresApi {

    private final OffreService offreService;

    @Override
    public ResponseEntity<List<OffreResponse>> getOffres() {
        return ResponseEntity.ok(offreService.getOffres());
    }

    @Override
    public ResponseEntity<OffreResponse> createOffre(OffreRequest offreRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(offreService.createOffre(offreRequest));
    }

    @Override
    public ResponseEntity<OffreResponse> getOffreById(Long offreId) {
        return ResponseEntity.ok(offreService.getOffreById(offreId));
    }

    @Override
    public ResponseEntity<OffreResponse> updateOffre(Long offreId, OffreRequest offreRequest) {
        return ResponseEntity.ok(offreService.updateOffre(offreId, offreRequest));
    }

    @Override
    public ResponseEntity<Void> deleteOffre(Long offreId) {
        offreService.deleteOffre(offreId);
        return ResponseEntity.noContent().build();
    }
}
