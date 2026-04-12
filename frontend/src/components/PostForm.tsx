import React, { useState } from 'react';
import { apiClient } from '../api/apiClient';

type PostFormProps = {
  onPostCreated: () => void;
};

export const PostForm: React.FC<PostFormProps> = ({ onPostCreated }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;
    
    try {
      const res = await apiClient.post('/api/posts', { title: newTitle, content: newContent });
      if (res.ok) {
        setNewTitle('');
        setNewContent('');
        onPostCreated();
      } else {
        alert('Failed to post');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="auth-form" style={{ maxWidth: '100%', marginBottom: '2rem' }}>
      <h3>Create a New Post</h3>
      <form onSubmit={handlePost}>
        <input placeholder="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} required />
        <textarea placeholder="Write something awesome..." value={newContent} onChange={e => setNewContent(e.target.value)} required />
        <button>Post Now</button>
      </form>
    </div>
  );
};
