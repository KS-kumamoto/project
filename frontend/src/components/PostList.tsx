import React from 'react';
import { Post } from '../types';

type PostListProps = {
  posts: Post[];
};

export const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <div>
      <h2>Recent Posts 📝</h2>
      {posts.length === 0 ? <p>No posts yet. Be the first!</p> : posts.map(post => (
        <div key={post.id} className="post-card">
          <h3 style={{ marginTop: 0, color: '#d81b60' }}>{post.title}</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
          <small style={{ color: '#9e9e9e' }}>— Posted by <strong>{post.author}</strong></small>
        </div>
      ))}
    </div>
  );
};
