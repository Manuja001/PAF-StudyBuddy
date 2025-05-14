package com.studybuddy.backend.controller;

import com.studybuddy.backend.model.StudyPlan;
import com.studybuddy.backend.service.StudyPlanService;
import com.studybuddy.backend.service.FileStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/study-plans")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class StudyPlanController {
    private static final Logger logger = LoggerFactory.getLogger(StudyPlanController.class);

    @Autowired
    private StudyPlanService studyPlanService;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping
    public ResponseEntity<?> createStudyPlan(
            @RequestParam("studyPlan") String studyPlanJson,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            logger.info("Received study plan creation request with JSON: {}", studyPlanJson);
            if (image != null) {
                logger.info("Image received: name={}, size={}, contentType={}", 
                    image.getOriginalFilename(), image.getSize(), image.getContentType());
            }

            StudyPlan studyPlan = objectMapper.readValue(studyPlanJson, StudyPlan.class);
            StudyPlan createdPlan = studyPlanService.createStudyPlan(studyPlan, image);
            
            logger.info("Created study plan with ID: {}, imageUrl: {}", 
                createdPlan.getId(), createdPlan.getImageUrl());
            
            return ResponseEntity.ok(createdPlan);
        } catch (Exception e) {
            logger.error("Error creating study plan", e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to create study plan: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllStudyPlans() {
        try {
            List<StudyPlan> plans = studyPlanService.getAllStudyPlans();
            logger.info("Returning {} study plans", plans.size());
            return ResponseEntity.ok(plans);
        } catch (Exception e) {
            logger.error("Error fetching study plans", e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to fetch study plans: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStudyPlanById(@PathVariable Long id) {
        try {
            StudyPlan plan = studyPlanService.getStudyPlanById(id);
            logger.info("Retrieved study plan: id={}, imageUrl={}", id, plan.getImageUrl());
            return ResponseEntity.ok(plan);
        } catch (Exception e) {
            logger.error("Error fetching study plan with id: {}", id, e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to fetch study plan: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudyPlan(@PathVariable Long id) {
        try {
            logger.info("Received delete request for study plan with ID: {}", id);
            
            // Check if the study plan exists
            StudyPlan plan = studyPlanService.getStudyPlanById(id);
            if (plan == null) {
                logger.error("Study plan with ID {} not found", id);
                Map<String, String> response = new HashMap<>();
                response.put("error", "Study plan not found");
                return ResponseEntity.notFound().build();
            }
            
            logger.info("Deleting study plan with ID: {}", id);
            studyPlanService.deleteStudyPlan(id);
            
            logger.info("Study plan with ID {} deleted successfully", id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Study plan deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error deleting study plan with id: {}. Error: {}", id, e.getMessage(), e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to delete study plan: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/files/{fileName:.+}")
    public ResponseEntity<?> getFile(@PathVariable String fileName) {
        try {
            logger.info("Attempting to retrieve file: {}", fileName);
            Path filePath = fileStorageService.getFilePath(fileName);
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                String contentType = "image/jpeg";
                if (fileName.toLowerCase().endsWith(".png")) {
                    contentType = "image/png";
                } else if (fileName.toLowerCase().endsWith(".gif")) {
                    contentType = "image/gif";
                }
                
                logger.info("File found: {}, contentType: {}", fileName, contentType);
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                logger.warn("File not found: {}", fileName);
                Map<String, String> response = new HashMap<>();
                response.put("error", "File not found: " + fileName);
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException ex) {
            logger.error("Error retrieving file: {}", fileName, ex);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error retrieving file: " + ex.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
} 