package com.amena.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "bannieres")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Banniere {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "image_url", length = 1024)
    private String imageUrl;

    @Column(name = "target_url", length = 1024)
    private String targetUrl;

    @Column(nullable = false)
    @Builder.Default
    private Integer position = 1;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "Actif";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
