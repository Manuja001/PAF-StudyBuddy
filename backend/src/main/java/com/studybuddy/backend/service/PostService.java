package com.studybuddy.backend.service;

import com.studybuddy.backend.model.Post;
import com.studybuddy.backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Optional<Post> getPostById(String id) {
        return postRepository.findById(id);
    }

    public Post createPost(Post post, String userId) {
        post.setemail(userId);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        return postRepository.save(post);
    }

    public Post updatePost(String id, Post post) {
        Optional<Post> existingPost = postRepository.findById(id);
        if (existingPost.isPresent()) {
            Post updatedPost = existingPost.get();
            updatedPost.setTitle(post.getTitle());
            updatedPost.setContent(post.getContent());
            updatedPost.setSkillLevel(post.getSkillLevel());
            updatedPost.setCategory(post.getCategory());
            updatedPost.setUpdatedAt(LocalDateTime.now());
            return postRepository.save(updatedPost);
        }
        return null;
    }

    public void deletePost(String id) {
        postRepository.deleteById(id);
    }
}
