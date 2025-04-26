package com.studybuddy.backend.controller;

import com.studybuddy.backend.model.Skill;
import com.studybuddy.backend.service.SkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService skillService;

    @Autowired
    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    // Create a new skill
    @PostMapping
    public ResponseEntity<Skill> createSkill(@RequestBody Skill skill) {
        Skill createdSkill = skillService.createSkill(skill);
        return new ResponseEntity<>(createdSkill, HttpStatus.CREATED);
    }

    // Get all skills
    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills() {
        List<Skill> skills = skillService.getAllSkills();
        return new ResponseEntity<>(skills, HttpStatus.OK);
    }

    // Get skill by ID
    @GetMapping("/{id}")
    public ResponseEntity<Skill> getSkillById(@PathVariable String id) {
        Optional<Skill> skill = skillService.getSkillById(id);
        return skill.map(s -> new ResponseEntity<>(s, HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Get skills by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Skill>> getSkillsByCategory(@PathVariable String category) {
        List<Skill> skills = skillService.getSkillsByCategory(category);
        return new ResponseEntity<>(skills, HttpStatus.OK);
    }

    // Update skill
    @PutMapping("/{id}")
    public ResponseEntity<Skill> updateSkill(@PathVariable String id, @RequestBody Skill skillDetails) {
        Skill updatedSkill = skillService.updateSkill(id, skillDetails);
        return updatedSkill != null 
               ? new ResponseEntity<>(updatedSkill, HttpStatus.OK)
               : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Delete skill by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable String id) {
        boolean isDeleted = skillService.deleteSkill(id);
        return isDeleted ? new ResponseEntity<>(HttpStatus.NO_CONTENT)
                         : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}