package com.amena.backend.repository;

import com.amena.backend.entity.Categorie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategorieRepository extends JpaRepository<Categorie, Long> {

    Optional<Categorie> findBySlug(String slug);

    Optional<Categorie> findByName(String name);

    List<Categorie> findByIsActiveTrueOrderBySortOrderAscNameAsc();
}
