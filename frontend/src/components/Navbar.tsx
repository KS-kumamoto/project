import React from 'react';

type NavbarProps = {
  user: string | null;
  onLogout: () => void;
};

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <div className="nav">
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
        <h2 style={{ margin: 0, color: '#ec407a' }}>✨ Web App Demo</h2>
      </div>
      {user ? (
        <div>
          <span style={{ marginRight: '1rem', fontWeight: 'bold' }}>Hi, {user}!</span>
          <button onClick={onLogout} style={{ background: '#9e9e9e' }}>Logout</button>
        </div>
      ) : (
        <div>Not logged in</div>
      )}
    </div>
  );
};
