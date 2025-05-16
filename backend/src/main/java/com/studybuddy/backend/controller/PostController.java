package com.studybuddy.backend.controller;

import com.studybuddy.backend.model.Post;
import com.studybuddy.backend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return new ResponseEntity<>(postService.getAllPosts(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        return postService.getPostById(id)
                .map(post -> new ResponseEntity<>(post, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post, Authentication authentication) {
        String userId = authentication.getName();
        Post savedPost = postService.createPost(post, userId);
        return new ResponseEntity<>(savedPost, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable String id, @RequestBody Post post) {
        Post updated = postService.updatePost(id, post);
        return updated != null
                ? new ResponseEntity<>(updated, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deletePost(@PathVariable String id) {
        postService.deletePost(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Post> toggleLike(@PathVariable String id, Authentication authentication) {
        String userId = authentication.getName();
        Post updatedPost = postService.toggleLike(id, userId);
        return updatedPost != null
                ? new ResponseEntity<>(updatedPost, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/{id}/like-count")
    public ResponseEntity<Integer> getLikeCount(@PathVariable String id) {
        int count = postService.getLikeCount(id);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/{id}/has-liked")
    public ResponseEntity<Boolean> hasUserLiked(@PathVariable String id, Authentication authentication) {
        String userId = authentication.getName();
        boolean hasLiked = postService.hasUserLiked(id, userId);
        return new ResponseEntity<>(hasLiked, HttpStatus.OK);
    }
}
