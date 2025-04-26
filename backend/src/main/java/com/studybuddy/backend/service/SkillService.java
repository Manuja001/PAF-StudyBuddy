package com.studybuddy.backend.service;

import com.studybuddy.backend.model.Skill;
import com.studybuddy.backend.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    @Autowired
    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    // Create a new skill
    public Skill createSkill(Skill skill) {
        return skillRepository.save(skill);
    }

    // Get all skills
    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    // Get skill by ID
    public Optional<Skill> getSkillById(String id) {
        return skillRepository.findById(id);
    }

    // Get skills by category
    public List<Skill> getSkillsByCategory(String category) {
        return skillRepository.findByCategory(category);
    }

    // Update skill
    public Skill updateSkill(String id, Skill skillDetails) {
        if (skillRepository.existsById(id)) {
            skillDetails.setId(id);
            return skillRepository.save(skillDetails);
        } else {
            return null;
        }
    }

    // Delete skill by ID
    public boolean deleteSkill(String id) {
        if (skillRepository.existsById(id)) {
            skillRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
}
