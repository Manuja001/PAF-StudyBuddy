package com.studybuddy.backend.repository;

import com.studybuddy.backend.model.Skill;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRepository extends MongoRepository<Skill, String> {

    // Custom query to find skills by category
    List<Skill> findByCategory(String category);

    // Custom query to find skills by userId (optional based on your app's structure)
    List<Skill> findByUserId(String userId);
}