package com.letgoo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanAssignRequest {
    @NotBlank(message = "placeId is required")
    private String placeId;

    @NotBlank(message = "dayName is required")
    private String dayName;
}
