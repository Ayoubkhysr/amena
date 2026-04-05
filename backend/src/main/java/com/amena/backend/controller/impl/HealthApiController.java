package com.amena.backend.controller.impl;

import com.amena.backend.api.HealthApi;
import com.amena.backend.dto.HealthResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Implementation of the Health API generated from OpenAPI spec.
 */
@RestController
public class HealthApiController implements HealthApi {

    @Override
    public ResponseEntity<HealthResponse> getHealth() {
        HealthResponse response = new HealthResponse();
        response.setService("amena-backend");
        return ResponseEntity.ok(response);
    }
}