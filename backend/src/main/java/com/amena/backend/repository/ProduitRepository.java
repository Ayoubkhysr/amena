package com.amena.backend.repository;

import com.amena.backend.entity.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Long> {

    Optional<Produit> findBySku(String sku);

    Optional<Produit> findBySlug(String slug);

    List<Produit> findByCategoryId(Long categoryId);

    List<Produit> findByIsActiveTrue();
}
