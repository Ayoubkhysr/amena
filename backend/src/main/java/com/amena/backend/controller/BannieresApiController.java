package com.amena.backend.controller;

import com.amena.backend.api.BannieresApi;
import com.amena.backend.dto.BanniereRequest;
import com.amena.backend.dto.BanniereResponse;
import com.amena.backend.dto.UploadBanniereImage200Response;
import com.amena.backend.service.BanniereService;
import com.amena.backend.service.SiteImageStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BannieresApiController implements BannieresApi {

    private final BanniereService banniereService;
    private final SiteImageStorageService siteImageStorageService;

    @Override
    public ResponseEntity<BanniereResponse> createBanniere(BanniereRequest banniereRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(banniereService.createBanniere(banniereRequest));
    }

    @Override
    public ResponseEntity<Void> deleteBanniere(Long banniereId) {
        banniereService.deleteBanniere(banniereId);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<BanniereResponse> getBanniereById(Long banniereId) {
        return ResponseEntity.ok(banniereService.getBanniereById(banniereId));
    }

    @Override
    public ResponseEntity<List<BanniereResponse>> getBannieres() {
        return ResponseEntity.ok(banniereService.getBannieres());
    }

    @Override
    public ResponseEntity<BanniereResponse> updateBanniere(Long banniereId, BanniereRequest banniereRequest) {
        return ResponseEntity.ok(banniereService.updateBanniere(banniereId, banniereRequest));
    }

    @Override
    public ResponseEntity<UploadBanniereImage200Response> uploadBanniereImage(MultipartFile file) {
        String url = siteImageStorageService.store(file);
        UploadBanniereImage200Response response = new UploadBanniereImage200Response();
        response.setImageUrl(url);
        return ResponseEntity.ok(response);
    }
}
