package com.letgoo.dto;

import com.letgoo.model.User;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private String username;
    private String name;
    private String gender;
    private String role;
    private String avatarText;
    private String avatarBg;

    public static UserDto fromEntity(User user) {
        if (user == null) return null;
        return UserDto.builder()
                .username(user.getUsername())
                .name(user.getName())
                .gender(user.getGender())
                .role(user.getRole())
                .avatarText(user.getAvatarText())
                .avatarBg(user.getAvatarBg())
                .build();
    }
}
