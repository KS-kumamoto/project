import React, { useState, useEffect } from 'react';

type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
};

export default function App() {
  const [user, setUser] = useState<string | null>(null);
  const [isLoginView, setIsLoginView] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    fetchPosts();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, { credentials: 'include' });
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
      const res = await fetch(`${API_URL}/api/posts`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.username);
        setUsername('');
        setPassword('');
      } else {
        alert('Login failed');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        alert('Registered successfully. Please login.');
        setIsLoginView(true);
      } else {
        alert('Registration failed');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    await fetch(`${API_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    setUser(null);
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;
    try {
      const res = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title: newTitle, content: newContent })
      });
      if (res.ok) {
        setNewTitle('');
        setNewContent('');
        fetchPosts();
      } else {
        alert('Failed to post');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="nav">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
          <h2 style={{ margin: 0, color: '#ec407a' }}>✨ Web App Demo</h2>
          <a href="/data_flow.html" target="_blank" rel="noopener noreferrer" style={{ color: '#ec407a', textDecoration: 'underline', fontSize: '20px' }}>📄 Data Flow Docs</a>
        </div>
        {user ? (
          <div>
            <span style={{ marginRight: '1rem', fontWeight: 'bold' }}>Hi, {user}!</span>
            <button onClick={handleLogout} style={{ background: '#9e9e9e' }}>Logout</button>
          </div>
        ) : (
          <div>Not logged in</div>
        )}
      </div>

      <div className="container">
        {!user && (
          <div className="auth-form">
            <h2>{isLoginView ? 'Login 🎉' : 'Register 🚀'}</h2>
            <form onSubmit={isLoginView ? handleLogin : handleRegister}>
              <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
              <button>{isLoginView ? 'Login' : 'Signup'}</button>
            </form>
            <p style={{ marginTop: '1rem', cursor: 'pointer', color: '#ec407a', textDecoration: 'underline' }}
              onClick={() => setIsLoginView(!isLoginView)}>
              {isLoginView ? 'Need an account? Register' : 'Have an account? Login'}
            </p>
          </div>
        )}

        {user && (
          <div className="auth-form" style={{ maxWidth: '100%', marginBottom: '2rem' }}>
            <h3>Create a New Post</h3>
            <form onSubmit={handlePost}>
              <input placeholder="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} required />
              <textarea placeholder="Write something awesome..." value={newContent} onChange={e => setNewContent(e.target.value)} required />
              <button>Post Now</button>
            </form>
          </div>
        )}

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
      </div>
    </div>
  );
}
