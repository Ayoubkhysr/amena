package com.amena.backend.controller;

import com.amena.backend.api.OrdersApi;
import com.amena.backend.dto.CreateOrderRequest;
import com.amena.backend.dto.OrderPage;
import com.amena.backend.dto.OrderResponse;
import com.amena.backend.dto.OrderStatusUpdateRequest;
import com.amena.backend.service.CommandeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class OrdersApiController implements OrdersApi {

    private final CommandeService commandeService;

    @Override
    public ResponseEntity<OrderPage> getOrders(Integer page, Integer size, String search, String status,
                                                      String sortBy, String sortOrder) {
        return ResponseEntity.ok(commandeService.getOrders(page, size, search, status, sortBy, sortOrder));
    }

    @Override
    public ResponseEntity<OrderResponse> createOrder(CreateOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(commandeService.createOrder(request));
    }

    @Override
    public ResponseEntity<OrderResponse> getOrderById(Long orderId) {
        return ResponseEntity.ok(commandeService.getOrderById(orderId));
    }

    @Override
    public ResponseEntity<OrderResponse> updateOrderStatus(Long orderId, OrderStatusUpdateRequest request) {
        return ResponseEntity.ok(commandeService.updateOrderStatus(orderId, request));
    }

    @Override
    public ResponseEntity<Void> deleteOrder(Long orderId) {
        commandeService.deleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }
}
