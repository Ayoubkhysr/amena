package com.amena.backend.repository;

import com.amena.backend.entity.Offre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OffreRepository extends JpaRepository<Offre, Long> {

    List<Offre> findByCategoryId(Long categoryId);

    List<Offre> findByIsActiveTrue();
}
