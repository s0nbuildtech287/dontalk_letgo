package com.letgoo.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "journal_entries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JournalEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String placeId;

    private String placeTitle;

    private LocalDate visitedDate;

    @Builder.Default
    private Double rating = 5.0;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(columnDefinition = "TEXT")
    private String photoUrls; // JSON or comma-separated URLs

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
