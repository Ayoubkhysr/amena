package com.amena.backend.repository;

import com.amena.backend.entity.SiteReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SiteReviewRepository extends JpaRepository<SiteReview, Long> {
}
