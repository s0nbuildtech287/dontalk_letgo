package com.letgoo.controller;

import com.letgoo.dto.ApiResponse;
import com.letgoo.dto.PlanAssignRequest;
import com.letgoo.service.PlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
@Tag(name = "Week Plans", description = "Endpoints for managing weekly scheduled trips")
public class PlanController {

    private final PlanService planService;

    @GetMapping
    @Operation(summary = "Get full week plans grouped by day")
    public ResponseEntity<ApiResponse<Map<String, List<String>>>> getWeekPlans() {
        Map<String, List<String>> plans = planService.getWeekPlans();
        return ResponseEntity.ok(ApiResponse.ok(plans));
    }

    @PostMapping("/assign")
    @Operation(summary = "Assign a place to a specific day of the week")
    public ResponseEntity<ApiResponse<Map<String, List<String>>>> assignToDay(
            @Valid @RequestBody PlanAssignRequest request
    ) {
        Map<String, List<String>> updated = planService.assignToDay(request.getPlaceId(), request.getDayName());
        return ResponseEntity.ok(ApiResponse.ok("Đã thêm vào lịch tuần!", updated));
    }

    @PostMapping("/remove")
    @Operation(summary = "Remove a place from a specific day of the week")
    public ResponseEntity<ApiResponse<Map<String, List<String>>>> removeFromDay(
            @Valid @RequestBody PlanAssignRequest request
    ) {
        Map<String, List<String>> updated = planService.removeFromDay(request.getPlaceId(), request.getDayName());
        return ResponseEntity.ok(ApiResponse.ok("Đã bỏ khỏi lịch tuần!", updated));
    }
}
