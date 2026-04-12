import { useState, useEffect } from 'react';
import { apiClient } from './api/apiClient';
import { Post } from './types';
import { Navbar } from './components/Navbar';
import { AuthForm } from './components/AuthForm';
import { PostForm } from './components/PostForm';
import { PostList } from './components/PostList';

export default function App() {
  const [user, setUser] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await apiClient.get('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.username);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await apiClient.get('/api/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    await apiClient.post('/api/auth/logout', {});
    setUser(null);
  };

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />

      <div className="container">
        {!user && <AuthForm onAuthSuccess={setUser} />}
        {user && <PostForm onPostCreated={fetchPosts} />}
        <PostList posts={posts} />
      </div>
    </div>
  );
}
