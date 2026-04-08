package com.example.demo.controller;

import com.example.demo.model.Post;
import com.example.demo.model.User;
import com.example.demo.repository.PostRepository;
import com.example.demo.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.HashMap;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Map<String, Object>> getAllPosts() {
        return postRepository.findAll().stream().map(p -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("title", p.getTitle());
            map.put("content", p.getContent());
            map.put("author", p.getAuthor().getUsername());
            return map;
        }).collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> createPost(@Valid @RequestBody Post postRequest, Authentication authentication) {
        User author = userRepository.findByUsername(authentication.getName())
            .orElseThrow(() -> new RuntimeException("Error: User is not found."));
            
        Post post = new Post();
        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        post.setAuthor(author);

        Post savedPost = postRepository.save(post);
        Map<String, Object> response = new HashMap<>();
        response.put("id", savedPost.getId());
        response.put("title", savedPost.getTitle());
        response.put("content", savedPost.getContent());
        response.put("author", author.getUsername());

        return ResponseEntity.ok(response);
    }
}
