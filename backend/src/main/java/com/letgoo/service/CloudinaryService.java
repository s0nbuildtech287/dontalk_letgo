package com.letgoo.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.letgoo.dto.UploadResponse;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
public class CloudinaryService {

    @Value("${cloudinary.cloud-name:}")
    private String cloudName;

    @Value("${cloudinary.api-key:}")
    private String apiKey;

    @Value("${cloudinary.api-secret:}")
    private String apiSecret;

    private Cloudinary cloudinary;

    @PostConstruct
    public void init() {
        if (cloudName != null && !cloudName.trim().isEmpty()
                && apiKey != null && !apiKey.trim().isEmpty()
                && apiSecret != null && !apiSecret.trim().isEmpty()) {
            this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", cloudName.trim(),
                    "api_key", apiKey.trim(),
                    "api_secret", apiSecret.trim(),
                    "secure", true
            ));
            log.info("Cloudinary Service initialized successfully for cloud: {}", cloudName);
        } else {
            log.warn("Cloudinary credentials not fully configured. Media uploads will use local storage fallback.");
        }
    }

    public UploadResponse uploadImage(MultipartFile file, String folder) throws IOException {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            originalFilename = "letgoo_img_" + UUID.randomUUID() + ".jpg";
        }

        if (cloudinary != null) {
            try {
                String targetFolder = (folder != null && !folder.trim().isEmpty()) ? folder.trim() : "letgoo";
                Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                        "folder", targetFolder,
                        "resource_type", "image"
                ));

                String publicId = (String) uploadResult.get("public_id");
                String secureUrl = (String) uploadResult.get("secure_url");
                Number bytes = (Number) uploadResult.get("bytes");

                log.info("Uploaded image to Cloudinary: publicId={}, url={}", publicId, secureUrl);

                return UploadResponse.builder()
                        .fileId(publicId)
                        .fileName(originalFilename)
                        .directUrl(secureUrl)
                        .webViewUrl(secureUrl)
                        .fileSize(bytes != null ? bytes.longValue() : file.getSize())
                        .build();

            } catch (Exception e) {
                log.error("Cloudinary upload failed ({}), falling back to local storage...", e.getMessage());
                return saveToLocalUploads(file, originalFilename);
            }
        } else {
            return saveToLocalUploads(file, originalFilename);
        }
    }

    private UploadResponse saveToLocalUploads(MultipartFile file, String originalFilename) throws IOException {
        Path uploadDir = Paths.get("uploads").toAbsolutePath().normalize();
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }
        String safeName = UUID.randomUUID() + "_" + originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_");
        Path targetPath = uploadDir.resolve(safeName);
        file.transferTo(targetPath);

        String localUrl = "http://localhost:8080/uploads/" + safeName;
        log.info("Saved image to local server at: {}", targetPath);

        return UploadResponse.builder()
                .fileId("local-" + safeName)
                .fileName(originalFilename)
                .directUrl(localUrl)
                .webViewUrl(localUrl)
                .fileSize(file.getSize())
                .build();
    }
}
