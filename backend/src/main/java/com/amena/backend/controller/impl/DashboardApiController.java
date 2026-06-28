package com.amena.backend.controller.impl;

import com.amena.backend.api.DashboardApi;
import com.amena.backend.dto.DashboardStatsResponse;
import com.amena.backend.repository.ProduitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class DashboardApiController implements DashboardApi {

    private final ProduitRepository produitRepository;

    private final com.amena.backend.repository.CommandeRepository commandeRepository;

    @Override
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();
        
        // Mocked or partially real data for dashboard to replace the frontend StoreContext loading everything
        stats.setTotalSales(5600.0); 
        stats.setOrdersToday(12);
        stats.setNewClients(24);
        
        // Products with stock <= 5 or inactive
        long inactiveProducts = produitRepository.count() - produitRepository.findByIsActiveTrue().size();
        stats.setLowStockCount((int) inactiveProducts);

        return ResponseEntity.ok(stats);
    }


}
