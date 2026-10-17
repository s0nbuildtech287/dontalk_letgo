package com.letgoo.controller;

import com.letgoo.dto.ApiResponse;
import com.letgoo.dto.UploadResponse;
import com.letgoo.service.GoogleDriveService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
@Tag(name = "Upload", description = "Endpoints for uploading media directly to Google Drive")
public class UploadController {

    private final GoogleDriveService googleDriveService;

    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload image file directly to Google Drive via Service Account")
    public ResponseEntity<ApiResponse<UploadResponse>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folderId", required = false) String folderId
    ) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Vui lòng chọn file ảnh để tải lên"));
        }

        UploadResponse response = googleDriveService.uploadImage(file, folderId);
        return ResponseEntity.ok(ApiResponse.ok("Tải ảnh lên Google Drive thành công!", response));
    }
}
