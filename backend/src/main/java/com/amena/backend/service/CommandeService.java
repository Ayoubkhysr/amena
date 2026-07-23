package com.amena.backend.service;

import com.amena.backend.dto.CreateOrderRequest;
import com.amena.backend.dto.OrderItemResponse;
import com.amena.backend.dto.OrderPage;
import com.amena.backend.dto.OrderResponse;
import com.amena.backend.dto.OrderStatusUpdateRequest;
import com.amena.backend.entity.Adresse;
import com.amena.backend.entity.Commande;
import com.amena.backend.entity.LigneCommande;
import com.amena.backend.entity.Utilisateur;
import com.amena.backend.mapper.CommandeMapper;
import com.amena.backend.repository.AdresseRepository;
import com.amena.backend.repository.CommandeRepository;
import com.amena.backend.repository.CouponRepository;
import com.amena.backend.repository.UtilisateurRepository;
import jakarta.persistence.criteria.JoinType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Set;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Service
@RequiredArgsConstructor
public class CommandeService {

    private static final Set<String> ALLOWED_STATUSES = Set.of(
            "pending", "processing", "shipped", "delivered", "cancelled", "refunded");

    private final CommandeRepository commandeRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final AdresseRepository adresseRepository;
    private final CouponRepository couponRepository;
    private final CommandeMapper commandeMapper;

    @Transactional(readOnly = true)
    public OrderPage getOrders(Integer page, Integer size, String search, String status, String sortBy,
                               String sortOrder) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortOrder), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Commande> spec = Specification.where(null);
        spec = spec.and((root, query, cb) -> {
            if (Long.class != query.getResultType()) {
                root.fetch("lignes", JoinType.LEFT);
            }
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
                        cb.like(cb.lower(root.get("id").as(String.class)), searchLower));
            });
        }

        Page<Commande> commandePage = commandeRepository.findAll(spec, pageable);

        OrderPage orderPage = new OrderPage();
        orderPage.setContent(commandePage.getContent().stream().map(this::toEnrichedResponse).toList());
        orderPage.setTotalElements(commandePage.getTotalElements());
        orderPage.setTotalPages(commandePage.getTotalPages());
        orderPage.setSize(commandePage.getSize());
        orderPage.setNumber(commandePage.getNumber());
        orderPage.setFirst(commandePage.isFirst());
        orderPage.setLast(commandePage.isLast());
        orderPage.setEmpty(commandePage.isEmpty());
        return orderPage;
    }

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        Commande commande = commandeMapper.toEntity(request);
        commande.setOrderNumber(java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        commande.setStatus("pending");

        List<LigneCommande> lignes = request.getItems().stream().map(itemReq -> {
            LigneCommande ligne = commandeMapper.toLigneEntity(itemReq);
            ligne.setCommande(commande);
            if (ligne.getProductName() == null) {
                ligne.setProductName("Produit Inconnu");
            }
            ligne.setTotalPrice(BigDecimal.valueOf(itemReq.getUnitPrice() * itemReq.getQuantity()));
            return ligne;
        }).toList();

        commande.setLignes(lignes);
        Commande saved = commandeRepository.save(commande);

        if (request.getCouponCode() != null && !request.getCouponCode().isEmpty()) {
            couponRepository.findByCode(request.getCouponCode()).ifPresent(coupon -> {
                coupon.setUsedCount((coupon.getUsedCount() == null ? 0 : coupon.getUsedCount()) + 1);
                couponRepository.save(coupon);
            });
        }

        return toEnrichedResponse(saved);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        return commandeRepository.findByIdWithLignes(id)
                .map(this::toEnrichedResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long id, OrderStatusUpdateRequest request) {
        String status = request.getStatus();
        if (status == null || !ALLOWED_STATUSES.contains(status)) {
            throw new ResponseStatusException(BAD_REQUEST, "Invalid status: " + status);
        }

        Commande commande = commandeRepository.findByIdWithLignes(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        commande.setStatus(status);
        Commande updated = commandeRepository.save(commande);
        return toEnrichedResponse(updated);
    }

    @Transactional
    public void deleteOrder(Long id) {
        if (!commandeRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found");
        }
        commandeRepository.deleteById(id);
    }

    private OrderResponse toEnrichedResponse(Commande commande) {
        OrderResponse response = commandeMapper.toResponse(commande);
        response.setClientName(resolveClientName(commande.getUserId(), commande.getNotes()));
        response.setClientPhone(resolveClientPhone(commande.getUserId(), commande.getNotes()));
        response.setAddress(resolveAddress(commande.getShippingAddressId(), commande.getNotes()));
        if (commande.getCreatedAt() != null) {
            response.setCreatedAt(OffsetDateTime.of(commande.getCreatedAt(), ZoneOffset.UTC));
        }
        response.setItems(commande.getLignes().stream().map(this::toOrderItemResponse).toList());
        return response;
    }

    private OrderItemResponse toOrderItemResponse(LigneCommande ligne) {
        return commandeMapper.toLigneResponse(ligne);
    }

    private String resolveClientName(Long userId, String notes) {
        if (userId == null) {
            if (notes != null && notes.contains("Client: ")) {
                String[] lines = notes.split("\n");
                for (String line : lines) {
                    if (line.startsWith("Client: ")) {
                        return line.substring("Client: ".length()).trim();
                    }
                }
            }
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

    private String resolveClientPhone(Long userId, String notes) {
        if (userId == null) {
            if (notes != null && notes.contains("Tel: ")) {
                String[] lines = notes.split("\n");
                for (String line : lines) {
                    if (line.startsWith("Tel: ")) {
                        return line.substring("Tel: ".length()).trim();
                    }
                }
            }
            return "\u2014";
        }
        return utilisateurRepository.findById(userId)
                .map(Utilisateur::getPhone)
                .orElse("\u2014");
    }

    private String resolveAddress(Long addressId, String notes) {
        if (addressId == null) {
            if (notes != null && notes.contains("Adresse: ")) {
                String[] lines = notes.split("\n");
                for (String line : lines) {
                    if (line.startsWith("Adresse: ")) {
                        return line.substring("Adresse: ".length()).trim();
                    }
                }
            }
            return "\u2014";
        }
        return adresseRepository.findById(addressId)
                .map(this::formatAddress)
                .orElse("\u2014");
    }

    private String formatAddress(Adresse adresse) {
        return String.format("%s, %s %s", adresse.getStreetAddress(), adresse.getCity(), adresse.getPostalCode());
    }
}
