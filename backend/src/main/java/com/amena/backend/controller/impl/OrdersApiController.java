package com.amena.backend.controller.impl;

import com.amena.backend.api.OrdersApi;
import com.amena.backend.dto.OrderItemResponse;
import com.amena.backend.dto.OrderPage;
import com.amena.backend.dto.OrderResponse;
import com.amena.backend.dto.OrderStatusUpdateRequest;
import com.amena.backend.entity.Adresse;
import com.amena.backend.entity.Commande;
import com.amena.backend.entity.LigneCommande;
import com.amena.backend.entity.Utilisateur;
import com.amena.backend.repository.AdresseRepository;
import com.amena.backend.repository.CommandeRepository;
import com.amena.backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import jakarta.persistence.criteria.JoinType;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@RestController
@RequiredArgsConstructor
public class OrdersApiController implements OrdersApi {

    private static final Set<String> ALLOWED_STATUSES = Set.of(
            "pending", "processing", "shipped", "delivered", "cancelled", "refunded");

    private final CommandeRepository commandeRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final AdresseRepository adresseRepository;

    public ResponseEntity<OrderPage> getOrders(Integer page, Integer size, String search, String status, String sortBy,
            String sortOrder) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortOrder), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Commande> spec = Specification.where(null);

        // Always fetch lines to avoid N+1 issues when serializing
        spec = spec.and((root, query, cb) -> {
            if (Long.class != query.getResultType()) {
                root.fetch("lignes", JoinType.LEFT);
            }
            // Add distinct to avoid duplicate rows from join fetch
            query.distinct(true);
            return null;
        });

        if (status != null && !status.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }

        if (search != null && !search.isEmpty()) {
            spec = spec.and((root, query, cb) -> {
                String searchLower = "%" + search.toLowerCase() + "%";
                return cb.or(
                        cb.like(cb.lower(root.get("orderNumber")), searchLower),
                        // Basic search on orderNumber for now, as joining with User to search by
                        // name/email
                        // requires more complex specification. To keep it simple, we just search
                        // orderNumber
                        cb.like(cb.lower(root.get("id").as(String.class)), searchLower));
            });
        }

        Page<Commande> commandePage = commandeRepository.findAll(spec, pageable);

        OrderPage orderPage = new OrderPage();
        orderPage.setContent(commandePage.getContent().stream().map(this::toOrderResponse).toList());
        orderPage.setTotalElements(commandePage.getTotalElements());
        orderPage.setTotalPages(commandePage.getTotalPages());
        orderPage.setSize(commandePage.getSize());
        orderPage.setNumber(commandePage.getNumber());
        orderPage.setFirst(commandePage.isFirst());
        orderPage.setLast(commandePage.isLast());
        orderPage.setEmpty(commandePage.isEmpty());

        return ResponseEntity.ok(orderPage);
    }

    @Override
    public ResponseEntity<OrderResponse> getOrderById(Long orderId) {
        return commandeRepository.findByIdWithLignes(orderId)
                .map(commande -> ResponseEntity.ok(toOrderResponse(commande)))
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<OrderResponse> updateOrderStatus(Long orderId, OrderStatusUpdateRequest request) {
        String status = request.getStatus();
        if (status == null || !ALLOWED_STATUSES.contains(status)) {
            throw new ResponseStatusException(BAD_REQUEST, "Invalid status: " + status);
        }

        Commande commande = commandeRepository.findByIdWithLignes(orderId).orElse(null);
        if (commande == null) {
            return ResponseEntity.notFound().build();
        }

        commande.setStatus(status);
        Commande updated = commandeRepository.save(commande);
        return ResponseEntity.ok(toOrderResponse(updated));
    }

    private OrderResponse toOrderResponse(Commande commande) {
        OrderResponse response = new OrderResponse();
        response.setId(commande.getId());
        response.setOrderNumber(commande.getOrderNumber());
        response.setUserId(commande.getUserId());
        response.setClientName(resolveClientName(commande.getUserId()));
        response.setTotalAmount(toDouble(commande.getTotalAmount()));
        response.setShippingAmount(toDouble(commande.getShippingAmount()));
        response.setStatus(commande.getStatus());
        response.setCreatedAt(commande.getCreatedAt() != null ? java.time.OffsetDateTime.of(commande.getCreatedAt(), java.time.ZoneOffset.UTC) : null);
        response.setAddress(resolveAddress(commande.getShippingAddressId()));
        response.setItems(commande.getLignes().stream().map(this::toOrderItemResponse).toList());
        return response;
    }

    private OrderItemResponse toOrderItemResponse(LigneCommande ligne) {
        OrderItemResponse item = new OrderItemResponse();
        item.setProductName(ligne.getProductName());
        item.setQuantity(ligne.getQuantity());
        item.setUnitPrice(toDouble(ligne.getUnitPrice()));
        item.setTotalPrice(toDouble(ligne.getTotalPrice()));
        return item;
    }

    private String resolveClientName(Long userId) {
        if (userId == null) {
            return "Client invité";
        }
        return utilisateurRepository.findById(userId)
                .map(this::formatClientName)
                .orElse("Client #" + userId);
    }

    private String formatClientName(Utilisateur utilisateur) {
        String firstName = utilisateur.getFirstName() != null ? utilisateur.getFirstName() : "";
        String lastName = utilisateur.getLastName() != null ? utilisateur.getLastName() : "";
        String fullName = (firstName + " " + lastName).trim();
        return fullName.isBlank() ? utilisateur.getEmail() : fullName;
    }

    private String resolveAddress(Long addressId) {
        if (addressId == null) {
            return "—";
        }
        return adresseRepository.findById(addressId)
                .map(this::formatAddress)
                .orElse("—");
    }

    private String formatAddress(Adresse adresse) {
        return String.format("%s, %s %s", adresse.getStreetAddress(), adresse.getCity(), adresse.getPostalCode());
    }

    private Double toDouble(BigDecimal value) {
        return value != null ? value.doubleValue() : null;
    }
}
