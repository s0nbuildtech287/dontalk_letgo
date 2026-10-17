package com.letgoo.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UploadResponse {
    private String fileId;
    private String fileName;
    private String directUrl;
    private String webViewUrl;
    private long fileSize;
}
