package com.amena.backend.service;

import com.amena.backend.dto.CreateUserRequest;
import com.amena.backend.dto.UpdateUserRequest;
import com.amena.backend.dto.UserPage;
import com.amena.backend.dto.UserResponse;
import com.amena.backend.entity.Utilisateur;
import com.amena.backend.mapper.UtilisateurMapper;
import com.amena.backend.repository.UtilisateurRepository;
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

@Service
@RequiredArgsConstructor
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;
    private final UtilisateurMapper utilisateurMapper;

    @Transactional(readOnly = true)
    public UserPage getUsers(Integer page, Integer size, String search, String role, String sortBy,
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
            if ("Actif".equalsIgnoreCase(role)) {
                spec = spec.and((root, query, cb) -> cb.isTrue(root.get("isActive")));
            } else if ("Inactif".equalsIgnoreCase(role)) {
                spec = spec.and((root, query, cb) -> cb.isFalse(root.get("isActive")));
            }
        }

        Page<Utilisateur> utilisateurPage = utilisateurRepository.findAll(spec, pageable);

        UserPage userPage = new UserPage();
        userPage.setContent(utilisateurPage.getContent().stream().map(utilisateurMapper::toResponse).toList());
        userPage.setTotalElements(utilisateurPage.getTotalElements());
        userPage.setTotalPages(utilisateurPage.getTotalPages());
        userPage.setSize(utilisateurPage.getSize());
        userPage.setNumber(utilisateurPage.getNumber());
        userPage.setFirst(utilisateurPage.isFirst());
        userPage.setLast(utilisateurPage.isLast());
        userPage.setEmpty(utilisateurPage.isEmpty());
        return userPage;
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        return utilisateurRepository.findById(id)
                .map(utilisateurMapper::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User with email already exists");
        }

        Utilisateur utilisateur = utilisateurMapper.toEntity(request);
        utilisateur.setPasswordHash("");
        utilisateur.setIsActive(true);
        utilisateur.setIsAdmin(false);

        Utilisateur saved = utilisateurRepository.save(utilisateur);
        return utilisateurMapper.toResponse(saved);
    }

    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        utilisateurMapper.updateEntity(request, utilisateur);

        Utilisateur updated = utilisateurRepository.save(utilisateur);
        return utilisateurMapper.toResponse(updated);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!utilisateurRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        utilisateurRepository.deleteById(id);
    }
}
