package com.studybuddy.backend.repository;

import com.studybuddy.backend.model.Post;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {
    // Custom query methods can be defined here if needed

    Optional<Post> findByTitle(String title);

    Optional<Post> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByTitle(String title);

}
