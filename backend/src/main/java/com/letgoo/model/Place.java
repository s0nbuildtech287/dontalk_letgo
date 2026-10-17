package com.letgoo.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "places")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Place {

    @Id
    @Column(nullable = false, unique = true)
    private String id;

    @Column(nullable = false)
    private String title;

    private String location;

    private String category; // an, uong, choi, dulich

    private String categoryLabel;

    private String priceRange; // $, $$, $$$

    private String priceText;

    @Column(nullable = false)
    @Builder.Default
    private String status = "want"; // want, scheduled, visited

    @Builder.Default
    private Integer savedDaysAgo = 0;

    @Builder.Default
    private Double rating = 4.5;

    @Column(columnDefinition = "TEXT")
    private String reviewNote;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    private String driveFileId;

    private Double lat;

    private Double lng;

    @Builder.Default
    private Integer votes = 1;

    @Column(columnDefinition = "TEXT")
    private String sourceLink;

    @Column(columnDefinition = "TEXT")
    private String tags; // Comma-separated strings: "Món nước, Đặc sản Hà Nội"

    @Builder.Default
    private Boolean suggestedWeek = false;

    private String scheduledDate;

    private String scheduledDayName;

    private String visitedDate;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
