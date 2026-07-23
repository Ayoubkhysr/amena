package com.amena.backend.service;

import com.amena.backend.dto.ConfigRequest;
import com.amena.backend.dto.ConfigResponse;
import com.amena.backend.entity.SiteConfig;
import com.amena.backend.repository.SiteConfigRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SiteConfigService {

    private final SiteConfigRepository configRepository;

    public ConfigResponse getConfigById(String id) {
        return configRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Config not found"));
    }

    public ConfigResponse updateConfig(String id, ConfigRequest request) {
        SiteConfig config = configRepository.findById(id).orElseGet(() -> {
            SiteConfig newConfig = new SiteConfig();
            newConfig.setId(id);
            return newConfig;
        });
        
        config.setValue(request.getValue());
        SiteConfig saved = configRepository.save(config);
        
        return toResponse(saved);
    }

    private ConfigResponse toResponse(SiteConfig config) {
        ConfigResponse response = new ConfigResponse();
        response.setId(config.getId());
        response.setValue(config.getValue());
        return response;
    }
}
