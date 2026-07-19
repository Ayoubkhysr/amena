package com.amena.backend.controller.impl;

import com.amena.backend.api.ConfigApi;
import com.amena.backend.dto.ConfigRequest;
import com.amena.backend.dto.ConfigResponse;
import com.amena.backend.service.SiteConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class SiteConfigApiController implements ConfigApi {

    private final SiteConfigService configService;

    @Override
    public ResponseEntity<ConfigResponse> getConfigById(String id) {
        try {
            return ResponseEntity.ok(configService.getConfigById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    public ResponseEntity<ConfigResponse> updateConfig(String id, ConfigRequest configRequest) {
        return ResponseEntity.ok(configService.updateConfig(id, configRequest));
    }
}
