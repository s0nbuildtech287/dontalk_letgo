package com.letgoo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "week_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeekPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String dayName; // "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"

    @Column(nullable = false)
    private String placeId;

    @Builder.Default
    private Integer orderIndex = 0;
}
