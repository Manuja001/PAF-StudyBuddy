package com.studybuddy.backend.service;

import com.studybuddy.backend.model.StudyPlan;
import com.studybuddy.backend.repository.StudyPlanRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import jakarta.transaction.Transactional;

import java.util.List;

@Service
public class StudyPlanService {
    private static final Logger logger = LoggerFactory.getLogger(StudyPlanService.class);

    @Autowired
    private StudyPlanRepository studyPlanRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public StudyPlan createStudyPlan(StudyPlan studyPlan, MultipartFile image) {
        if (image != null && !image.isEmpty()) {
            String imageUrl = fileStorageService.storeFile(image);
            studyPlan.setImageUrl(imageUrl);
        }
        return studyPlanRepository.save(studyPlan);
    }

    public List<StudyPlan> getAllStudyPlans() {
        return studyPlanRepository.findAll();
    }

    public StudyPlan getStudyPlanById(Long id) {
        return studyPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Study plan not found with id: " + id));
    }

    @Transactional
    public void deleteStudyPlan(Long id) {
        logger.debug("Attempting to delete study plan with ID: {}", id);
        
        try {
            if (!studyPlanRepository.existsById(id)) {
                logger.error("Study plan with ID {} not found", id);
                throw new RuntimeException("Study plan not found with id: " + id);
            }
            
            StudyPlan plan = studyPlanRepository.findById(id).get();
            
            // Delete the study plan
            studyPlanRepository.deleteById(id);
            logger.info("Study plan with ID {} deleted successfully", id);
            
        } catch (Exception e) {
            logger.error("Error deleting study plan with ID {}: {}", id, e.getMessage());
            throw new RuntimeException("Failed to delete study plan: " + e.getMessage());
        }
    }
} 