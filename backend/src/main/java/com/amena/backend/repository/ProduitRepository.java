package com.amena.backend.repository;

import com.amena.backend.entity.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Long>, JpaSpecificationExecutor<Produit> {

    Optional<Produit> findBySku(String sku);

    Optional<Produit> findBySlug(String slug);

    List<Produit> findByCategoryId(Long categoryId);
    long countByCategoryId(Long categoryId);

    List<Produit> findByIsActiveTrue();

    Page<Produit> findAll(Pageable pageable);
}
