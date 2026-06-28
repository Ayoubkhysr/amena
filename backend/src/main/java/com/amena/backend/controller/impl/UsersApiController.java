package com.amena.backend.controller.impl;

import com.amena.backend.api.UsersApi;
import com.amena.backend.dto.CreateUserRequest;
import com.amena.backend.dto.UpdateUserRequest;
import com.amena.backend.dto.UserPage;
import com.amena.backend.dto.UserResponse;
import com.amena.backend.entity.Utilisateur;
import com.amena.backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.time.ZoneId;

@RestController
@RequiredArgsConstructor
public class UsersApiController implements UsersApi {

    private final UtilisateurRepository utilisateurRepository;

    public ResponseEntity<UserPage> getUsers(Integer page, Integer size, String search, String role, String sortBy,
            String sortOrder) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortOrder), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Utilisateur> spec = Specification.where(null);

        if (search != null && !search.isEmpty()) {
            spec = spec.and((root, query, cb) -> {
                String searchLower = "%" + search.toLowerCase() + "%";
                return cb.or(
                        cb.like(cb.lower(root.get("firstName")), searchLower),
                        cb.like(cb.lower(root.get("lastName")), searchLower),
                        cb.like(cb.lower(root.get("email")), searchLower));
            });
        }

        if (role != null && !role.isEmpty()) {
            boolean isAdmin = "Actif".equalsIgnoreCase(role) || "ADMIN".equalsIgnoreCase(role);
            // We map role concept to active or admin if needed, but wait:
            // the frontend sends "Actif" or "Inactif" for searchStatus.
            // Let's filter by isActive.
            if ("Actif".equalsIgnoreCase(role)) {
                spec = spec.and((root, query, cb) -> cb.isTrue(root.get("isActive")));
            } else if ("Inactif".equalsIgnoreCase(role)) {
                spec = spec.and((root, query, cb) -> cb.isFalse(root.get("isActive")));
            }
        }

        Page<Utilisateur> utilisateurPage = utilisateurRepository.findAll(spec, pageable);

        UserPage userPage = new UserPage();
        userPage.setContent(utilisateurPage.getContent().stream().map(this::toUserResponse).toList());
        userPage.setTotalElements(utilisateurPage.getTotalElements());
        userPage.setTotalPages(utilisateurPage.getTotalPages());
        userPage.setSize(utilisateurPage.getSize());
        userPage.setNumber(utilisateurPage.getNumber());
        userPage.setFirst(utilisateurPage.isFirst());
        userPage.setLast(utilisateurPage.isLast());
        userPage.setEmpty(utilisateurPage.isEmpty());

        return ResponseEntity.ok(userPage);
    }

    @Override
    public ResponseEntity<UserResponse> getUserById(Long userId) {
        return utilisateurRepository.findById(userId)
                .map(this::toUserResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<UserResponse> createUser(CreateUserRequest request) {
        if (utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User with email already exists");
        }

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setEmail(request.getEmail());
        utilisateur.setFirstName(request.getFirstName());
        utilisateur.setLastName(request.getLastName());
        utilisateur.setPasswordHash(""); // Default empty or mock password
        utilisateur.setIsActive(true);
        utilisateur.setIsAdmin(false);
        // UTM removed because CreateUserRequest did not generate them correctly in openapi
        
        Utilisateur saved = utilisateurRepository.save(utilisateur);
        return ResponseEntity.status(HttpStatus.CREATED).body(toUserResponse(saved));
    }

    @Override
    public ResponseEntity<UserResponse> updateUser(Long userId, UpdateUserRequest request) {
        Utilisateur utilisateur = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (request.getFirstName() != null)
            utilisateur.setFirstName(request.getFirstName());
        if (request.getLastName() != null)
            utilisateur.setLastName(request.getLastName());

        Utilisateur updated = utilisateurRepository.save(utilisateur);
        return ResponseEntity.ok(toUserResponse(updated));
    }

    @Override
    public ResponseEntity<Void> deleteUser(Long userId) {
        if (!utilisateurRepository.existsById(userId)) {
            return ResponseEntity.notFound().build();
        }
        utilisateurRepository.deleteById(userId);
        return ResponseEntity.noContent().build();
    }

    private UserResponse toUserResponse(Utilisateur utilisateur) {
        UserResponse response = new UserResponse();
        response.setId(utilisateur.getId());
        response.setEmail(utilisateur.getEmail());
        response.setFirstName(utilisateur.getFirstName());
        response.setLastName(utilisateur.getLastName());
        if (utilisateur.getCreatedAt() != null) {
            response.setCreatedAt(
                    java.time.OffsetDateTime.of(utilisateur.getCreatedAt(), java.time.ZoneOffset.UTC));
        }
        if (utilisateur.getUpdatedAt() != null) {
            response.setUpdatedAt(utilisateur.getUpdatedAt());
        }
        return response;
    }
}
