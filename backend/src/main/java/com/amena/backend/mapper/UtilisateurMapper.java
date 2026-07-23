package com.amena.backend.mapper;

import com.amena.backend.dto.CreateUserRequest;
import com.amena.backend.dto.UpdateUserRequest;
import com.amena.backend.dto.UserResponse;
import com.amena.backend.entity.Utilisateur;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@Mapper(componentModel = "spring", unmappedTargetPolicy = org.mapstruct.ReportingPolicy.ERROR)
public interface UtilisateurMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "isAdmin", ignore = true)
    @Mapping(target = "phone", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Utilisateur toEntity(CreateUserRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "isAdmin", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(UpdateUserRequest request, @MappingTarget Utilisateur utilisateur);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    UserResponse toResponse(Utilisateur utilisateur);

    default OffsetDateTime map(LocalDateTime value) {
        return value != null ? OffsetDateTime.of(value, ZoneOffset.UTC) : null;
    }
}
