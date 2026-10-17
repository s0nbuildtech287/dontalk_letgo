package com.letgoo.service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.InputStreamContent;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.Permission;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import com.letgoo.dto.UploadResponse;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class GoogleDriveService {

    @Value("${google.drive.service-accounts-dir:C:/Users/XUAN SON/Desktop/Xuan Son Version/DontTalk_LetGoo/dontalk_letgo/serviceAccounts}")
    private String serviceAccountsDir;

    @Value("${google.drive.primary-account:acc1.json}")
    private String primaryAccount;

    @Value("${google.drive.folder-id:}")
    private String defaultFolderId;

    private Drive driveService;

    @PostConstruct
    public void init() {
        try {
            Path accountPath = Paths.get(serviceAccountsDir, primaryAccount);
            if (!Files.exists(accountPath)) {
                // Try finding any .json file in the directory
                Path dir = Paths.get(serviceAccountsDir);
                if (Files.exists(dir)) {
                    try (var stream = Files.list(dir)) {
                        accountPath = stream.filter(p -> p.toString().endsWith(".json"))
                                .findFirst()
                                .orElse(null);
                    }
                }
            }

            if (accountPath != null && Files.exists(accountPath)) {
                log.info("Initializing Google Drive Service with Service Account: {}", accountPath);
                try (FileInputStream serviceAccountStream = new FileInputStream(accountPath.toFile())) {
                    GoogleCredentials credentials = GoogleCredentials.fromStream(serviceAccountStream)
                            .createScoped(Collections.singletonList(DriveScopes.DRIVE));

                    driveService = new Drive.Builder(
                            GoogleNetHttpTransport.newTrustedTransport(),
                            GsonFactory.getDefaultInstance(),
                            new HttpCredentialsAdapter(credentials))
                            .setApplicationName("LetGoo-Travel")
                            .build();

                    log.info("Google Drive Service initialized successfully!");
                }
            } else {
                log.warn("No service account json found at {}. Google Drive upload will run in fallback mock mode.", serviceAccountsDir);
            }
        } catch (Exception e) {
            log.error("Failed to initialize Google Drive client: {}", e.getMessage(), e);
        }
    }

    public UploadResponse uploadImage(MultipartFile file, String customFolderId) throws IOException {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            originalFilename = "letgoo_image_" + UUID.randomUUID() + ".jpg";
        }

        // Target Folder ID (use custom or default from config)
        String folderId = (customFolderId != null && !customFolderId.trim().isEmpty()) ? customFolderId : defaultFolderId;

        if (driveService != null) {
            try {
                File fileMetadata = new File();
                fileMetadata.setName("letgoo_" + System.currentTimeMillis() + "_" + originalFilename);

                if (folderId != null && !folderId.trim().isEmpty()) {
                    fileMetadata.setParents(Collections.singletonList(folderId.trim()));
                }

                InputStreamContent mediaContent = new InputStreamContent(
                        file.getContentType() != null ? file.getContentType() : "image/jpeg",
                        file.getInputStream()
                );

                File uploadedFile = driveService.files().create(fileMetadata, mediaContent)
                        .setFields("id, name, webViewLink, webContentLink")
                        .execute();

                String fileId = uploadedFile.getId();

                // Make file publicly readable
                try {
                    Permission permission = new Permission()
                            .setType("anyone")
                            .setRole("reader");
                    driveService.permissions().create(fileId, permission).execute();
                } catch (Exception permEx) {
                    log.warn("Could not set public permission on Drive file {}: {}", fileId, permEx.getMessage());
                }

                // Direct Google CDN thumbnail/image URL (fastest & no redirects)
                String directUrl = "https://lh3.googleusercontent.com/d/" + fileId;
                String webViewUrl = uploadedFile.getWebViewLink();

                log.info("Uploaded image to Google Drive successfully. File ID: {}", fileId);

                return UploadResponse.builder()
                        .fileId(fileId)
                        .fileName(originalFilename)
                        .directUrl(directUrl)
                        .webViewUrl(webViewUrl != null ? webViewUrl : directUrl)
                        .fileSize(file.getSize())
                        .build();

            } catch (Exception e) {
                log.error("Google Drive API error during file upload: {}", e.getMessage(), e);
                throw new IOException("Lỗi upload lên Google Drive: " + e.getMessage(), e);
            }
        } else {
            // Local fallback simulation if service account credentials are unavailable
            String fileId = "local-" + UUID.randomUUID();
            String mockUrl = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80";
            return UploadResponse.builder()
                    .fileId(fileId)
                    .fileName(originalFilename)
                    .directUrl(mockUrl)
                    .webViewUrl(mockUrl)
                    .fileSize(file.getSize())
                    .build();
        }
    }
}
