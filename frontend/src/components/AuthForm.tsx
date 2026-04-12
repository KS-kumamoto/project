import React, { useState } from 'react';
import { apiClient } from '../api/apiClient';

type AuthFormProps = {
  onAuthSuccess: (username: string) => void;
};

export const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLoginView ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const res = await apiClient.post(endpoint, { username, password });
      
      if (res.ok) {
        if (isLoginView) {
          const data = await res.json();
          onAuthSuccess(data.username);
        } else {
          alert('Registered successfully. Please login.');
          setIsLoginView(true);
        }
        setUsername('');
        setPassword('');
      } else {
        const errorText = await res.text();
        alert(`${isLoginView ? 'Login' : 'Registration'} failed: ${errorText}`);
      }
    } catch (e) {
      console.error(e);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="auth-form">
      <h2>{isLoginView ? 'Login 🎉' : 'Register 🚀'}</h2>
      {!isLoginView && (
        <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem', backgroundColor: '#f9f9f9', padding: '0.5rem', borderRadius: '4px' }}>
          <strong>パスワードの制約:</strong><br />
          ・6文字以上、40文字以内<br />
          ・半角英数字・記号のみ<strong>使用可能</strong><br />
          ※日本語や絵文字等（マルチバイト文字）はシステム制約（ハッシュ化時の文字数限界によるセキュリティ低下、デバイス間での文字コード差異によるログイン不能リスク）のため<strong>使用不可</strong>とします。
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" minLength={3} maxLength={20} value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" minLength={6} maxLength={40} pattern="^[!-~]+$" title="半角英数字・記号のみ使用できます" value={password} onChange={e => setPassword(e.target.value)} required />
        <button>{isLoginView ? 'Login' : 'Signup'}</button>
      </form>
      <p style={{ marginTop: '1rem', cursor: 'pointer', color: '#ec407a', textDecoration: 'underline' }}
        onClick={() => setIsLoginView(!isLoginView)}>
        {isLoginView ? 'Need an account? Register' : 'Have an account? Login'}
      </p>
    </div>
  );
};
