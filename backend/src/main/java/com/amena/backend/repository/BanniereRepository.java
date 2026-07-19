package com.amena.backend.repository;

import com.amena.backend.entity.Banniere;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BanniereRepository extends JpaRepository<Banniere, Long> {
    List<Banniere> findAllByOrderByPositionAscIdDesc();
}
