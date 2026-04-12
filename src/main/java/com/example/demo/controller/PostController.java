package com.example.demo.controller;

import com.example.demo.dto.PostCreateRequest;
import com.example.demo.dto.PostDto;
import com.example.demo.service.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @GetMapping
    public ResponseEntity<List<PostDto>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @PostMapping
    public ResponseEntity<PostDto> createPost(@Valid @RequestBody PostCreateRequest postRequest, Authentication authentication) {
        PostDto response = postService.createPost(postRequest, authentication);
        return ResponseEntity.ok(response);
    }
}
