package com.studybuddy.backend.repository;

import com.studybuddy.backend.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PostRepository extends MongoRepository<Post, String> {
} 