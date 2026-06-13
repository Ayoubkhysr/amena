package com.amena.backend.repository;

import com.amena.backend.entity.ImageProduit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImageProduitRepository extends JpaRepository<ImageProduit, Long> {

    List<ImageProduit> findByProductIdOrderBySortOrderAscIdAsc(Long productId);

    Optional<ImageProduit> findByProductIdAndIsPrimaryTrue(Long productId);

    Optional<ImageProduit> findFirstByProductIdOrderBySortOrderAscIdAsc(Long productId);

    @Modifying
    @Query("UPDATE ImageProduit i SET i.isPrimary = false WHERE i.productId = :productId")
    void clearPrimaryForProduct(Long productId);

    void deleteByProductId(Long productId);
}
