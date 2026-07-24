package com.amena.backend.controller;

import com.amena.backend.api.UsersApi;
import com.amena.backend.dto.CreateUserRequest;
import com.amena.backend.dto.UpdateUserRequest;
import com.amena.backend.dto.UserPage;
import com.amena.backend.dto.UserResponse;
import com.amena.backend.service.UtilisateurService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UsersApiController implements UsersApi {

    private final UtilisateurService utilisateurService;

    @Override
    public ResponseEntity<UserPage> getUsers(Integer page, Integer size, String search, String role,
                                                    String sortBy, String sortOrder) {
        return ResponseEntity.ok(utilisateurService.getUsers(page, size, search, role, sortBy, sortOrder));
    }

    @Override
    public ResponseEntity<UserResponse> getUserById(Long userId) {
        return ResponseEntity.ok(utilisateurService.getUserById(userId));
    }

    @Override
    public ResponseEntity<UserResponse> createUser(CreateUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(utilisateurService.createUser(request));
    }

    @Override
    public ResponseEntity<UserResponse> updateUser(Long userId, UpdateUserRequest request) {
        return ResponseEntity.ok(utilisateurService.updateUser(userId, request));
    }

    @Override
    public ResponseEntity<Void> deleteUser(Long userId) {
        utilisateurService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}
