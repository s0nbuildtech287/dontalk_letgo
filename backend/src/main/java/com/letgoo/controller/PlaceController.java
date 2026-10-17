package com.letgoo.controller;

import com.letgoo.dto.ApiResponse;
import com.letgoo.dto.PlaceDto;
import com.letgoo.service.PlaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/places")
@RequiredArgsConstructor
@Tag(name = "Places", description = "Endpoints for managing destinations, wishlist and status")
public class PlaceController {

    private final PlaceService placeService;

    @GetMapping
    @Operation(summary = "Get all places")
    public ResponseEntity<ApiResponse<List<PlaceDto>>> getAllPlaces() {
        List<PlaceDto> places = placeService.getAllPlaces();
        return ResponseEntity.ok(ApiResponse.ok(places));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get place by id")
    public ResponseEntity<ApiResponse<PlaceDto>> getPlaceById(@PathVariable String id) {
        PlaceDto place = placeService.getPlaceById(id);
        return ResponseEntity.ok(ApiResponse.ok(place));
    }

    @PostMapping
    @Operation(summary = "Create a new place")
    public ResponseEntity<ApiResponse<PlaceDto>> createPlace(@RequestBody PlaceDto dto) {
        PlaceDto created = placeService.createPlace(dto);
        return ResponseEntity.ok(ApiResponse.ok("Đã thêm địa điểm thành công!", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update place details")
    public ResponseEntity<ApiResponse<PlaceDto>> updatePlace(
            @PathVariable String id,
            @RequestBody PlaceDto dto
    ) {
        PlaceDto updated = placeService.updatePlace(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Đã cập nhật địa điểm!", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete place by id")
    public ResponseEntity<ApiResponse<Void>> deletePlace(@PathVariable String id) {
        placeService.deletePlace(id);
        return ResponseEntity.ok(ApiResponse.ok("Đã xóa địa điểm!", null));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Change status (want, scheduled, visited)")
    public ResponseEntity<ApiResponse<PlaceDto>> changeStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> statusBody
    ) {
        String newStatus = statusBody.get("status");
        String scheduledDate = statusBody.get("scheduledDate");
        String scheduledDayName = statusBody.get("scheduledDayName");

        PlaceDto updated = placeService.changeStatus(id, newStatus, scheduledDate, scheduledDayName);
        return ResponseEntity.ok(ApiResponse.ok("Đã cập nhật trạng thái!", updated));
    }

    @PostMapping("/{id}/vote")
    @Operation(summary = "Increment place vote count")
    public ResponseEntity<ApiResponse<PlaceDto>> toggleVote(@PathVariable String id) {
        PlaceDto updated = placeService.toggleVote(id);
        return ResponseEntity.ok(ApiResponse.ok("Đã bình chọn địa điểm!", updated));
    }
}
