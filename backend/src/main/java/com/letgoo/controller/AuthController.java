package com.letgoo.controller;

import com.letgoo.dto.ApiResponse;
import com.letgoo.dto.AuthRequest;
import com.letgoo.dto.UserDto;
import com.letgoo.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user login and profile")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Login with username and password")
    public ResponseEntity<ApiResponse<UserDto>> login(@Valid @RequestBody AuthRequest request) {
        UserDto user = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Đăng nhập thành công!", user));
    }

    @GetMapping("/me/{username}")
    @Operation(summary = "Get user profile by username")
    public ResponseEntity<ApiResponse<UserDto>> getMe(@PathVariable String username) {
        UserDto user = authService.getUserByUsername(username);
        return ResponseEntity.ok(ApiResponse.ok(user));
    }
}
