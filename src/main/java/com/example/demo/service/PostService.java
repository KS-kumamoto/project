package com.example.demo.service;

import com.example.demo.dto.PostCreateRequest;
import com.example.demo.dto.PostDto;
import com.example.demo.exception.UserNotFoundException;
import com.example.demo.model.Post;
import com.example.demo.model.User;
import com.example.demo.repository.PostRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public List<PostDto> getAllPosts() {
        return postRepository.findAll().stream().map(p -> new PostDto(
                p.getId(),
                p.getTitle(),
                p.getContent(),
                p.getAuthor().getUsername()
        )).collect(Collectors.toList());
    }

    public PostDto createPost(PostCreateRequest postRequest, Authentication authentication) {
        User author = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new UserNotFoundException("Error: User is not found."));

        Post post = new Post();
        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        post.setAuthor(author);

        Post savedPost = postRepository.save(post);

        return new PostDto(
                savedPost.getId(),
                savedPost.getTitle(),
                savedPost.getContent(),
                author.getUsername()
        );
    }
}
