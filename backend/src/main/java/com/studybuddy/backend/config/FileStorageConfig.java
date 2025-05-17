package com.studybuddy.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class FileStorageConfig implements WebMvcConfigurer {
    private static final Logger logger = LoggerFactory.getLogger(FileStorageConfig.class);

    @Value("${file.upload-dir}")
    private String uploadDir;

    private Path uploadPath;

    @PostConstruct
    public void init() {
        try {
            // Convert to absolute path
            uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            logger.info("Initializing upload directory at: {}", uploadPath);

            if (!Files.exists(uploadPath)) {
                logger.info("Creating upload directory: {}", uploadPath);
                Files.createDirectories(uploadPath);
            }

            // Ensure the directory is readable and writable
            File dir = uploadPath.toFile();
            dir.setReadable(true, false);
            dir.setWritable(true, false);
            
            logger.info("Upload directory initialized successfully. Read: {}, Write: {}", 
                dir.canRead(), dir.canWrite());
        } catch (Exception e) {
            logger.error("Could not create upload directory: {}", uploadPath, e);
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadLocation = "file:" + uploadPath.toString() + File.separator;
        logger.info("Configuring resource handler: /uploads/** -> {}", uploadLocation);
        
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadLocation)
                .setCachePeriod(3600);
    }
} 