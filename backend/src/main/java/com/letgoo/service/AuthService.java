package com.letgoo.service;

import com.letgoo.dto.AuthRequest;
import com.letgoo.dto.UserDto;
import com.letgoo.exception.ResourceNotFoundException;
import com.letgoo.model.User;
import com.letgoo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;

    public UserDto login(AuthRequest request) {
        String username = request.getUsername().trim().toLowerCase();
        String password = request.getPassword().trim();

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(password)) {
                return UserDto.fromEntity(user);
            }
        }

        // Fallback check for initial accounts if DB was not yet seeded
        if (("xu4ns0n".equals(username) || "maihuong".equals(username)) && "123".equals(password)) {
            User newUser = username.equals("xu4ns0n") ? User.builder()
                    .username("xu4ns0n")
                    .password("123")
                    .name("Xuân Sơn")
                    .gender("male")
                    .role("Captain")
                    .avatarText("S")
                    .avatarBg("from-amber-400 to-[#FF6B4A]")
                    .build() : User.builder()
                    .username("maihuong")
                    .password("123")
                    .name("Mai Hương")
                    .gender("female")
                    .role("Co-Pilot")
                    .avatarText("H")
                    .avatarBg("from-rose-400 to-[#FF6B4A]")
                    .build();

            userRepository.save(newUser);
            return UserDto.fromEntity(newUser);
        }

        throw new IllegalArgumentException("Tài khoản hoặc mật khẩu không chính xác.");
    }

    public UserDto getUserByUsername(String username) {
        User user = userRepository.findByUsername(username.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng: " + username));
        return UserDto.fromEntity(user);
    }
}
