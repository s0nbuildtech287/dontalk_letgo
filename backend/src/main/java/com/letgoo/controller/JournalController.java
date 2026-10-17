package com.letgoo.controller;

import com.letgoo.dto.ApiResponse;
import com.letgoo.model.JournalEntry;
import com.letgoo.service.JournalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/journal")
@RequiredArgsConstructor
@Tag(name = "Journal", description = "Endpoints for managing trip reviews and memory logs")
public class JournalController {

    private final JournalService journalService;

    @GetMapping
    @Operation(summary = "Get all journal entries")
    public ResponseEntity<ApiResponse<List<JournalEntry>>> getAllEntries() {
        List<JournalEntry> entries = journalService.getAllEntries();
        return ResponseEntity.ok(ApiResponse.ok(entries));
    }

    @PostMapping
    @Operation(summary = "Create a journal entry")
    public ResponseEntity<ApiResponse<JournalEntry>> createEntry(@RequestBody JournalEntry entry) {
        JournalEntry created = journalService.createEntry(entry);
        return ResponseEntity.ok(ApiResponse.ok("Đã lưu nhật ký chuyến đi!", created));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a journal entry")
    public ResponseEntity<ApiResponse<Void>> deleteEntry(@PathVariable Long id) {
        journalService.deleteEntry(id);
        return ResponseEntity.ok(ApiResponse.ok("Đã xóa nhật ký!", null));
    }
}
