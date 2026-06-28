package com.amena.backend.repository;

import com.amena.backend.entity.Commande;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommandeRepository extends JpaRepository<Commande, Long> {

    @Query("SELECT DISTINCT c FROM Commande c LEFT JOIN FETCH c.lignes ORDER BY c.createdAt DESC")
    List<Commande> findAllWithLignes();

    @Query("SELECT c FROM Commande c LEFT JOIN FETCH c.lignes WHERE c.id = :id")
    Optional<Commande> findByIdWithLignes(Long id);

    List<Commande> findByStatusOrderByCreatedAtDesc(String status);
}
