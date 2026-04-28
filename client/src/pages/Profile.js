import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, token, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [message, setMessage] = useState('');

  if (!user) return <div style={{ padding: 20 }}>Please login first.</div>;

  const updateProfile = async () => {
    try {
      await axios.put('http://localhost:5001/api/auth/profile',
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Update failed.');
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: '0 auto' }}>
      <h2>👤 My Profile</h2>

      <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 8, marginBottom: 20 }}>
        <h3>Account Info</h3>
        <p>📧 Email: {user.email}</p>
        <p>🏅 Role: <span style={{ color: user.role === 'premium' ? '#FFD700' : '#4CAF50', fontWeight: 'bold' }}>{user.role}</span></p>
        <p>🪙 Coins: {user.coins}</p>
        <p>🔥 Streak: {user.streak} days</p>
      </div>

      <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 8, marginBottom: 20 }}>
        <h3>Update Name</h3>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          style={{ display: 'block', width: '100%', padding: 8, marginBottom: 10 }}
        />
        <button onClick={updateProfile} style={{ padding: '8px 20px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', borderRadius: 4 }}>
          Update
        </button>
        {message && <p style={{ color: 'green', marginTop: 10 }}>{message}</p>}
      </div>

      <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
        <h3>Premium Status</h3>
        {user.role === 'premium' ? (
          <p style={{ color: '#FFD700' }}>⭐ You are a Premium member!</p>
        ) : (
          <>
            <p>Upgrade to Premium to unlock:</p>
            <ul>
              <li>📊 Nutrition Dashboard</li>
              <li>⚡ BMR Calculator</li>
              <li>📝 Manual Food Logger</li>
            </ul>
            <a href="/upgrade" style={{ padding: '8px 20px', background: '#FFD700', color: 'black', textDecoration: 'none', borderRadius: 4, display: 'inline-block' }}>
              Upgrade to Premium
            </a>
          </>
        )}
      </div>

      <button onClick={logout} style={{ marginTop: 20, padding: '8px 20px', background: 'red', color: 'white', border: 'none', cursor: 'pointer', borderRadius: 4 }}>
        Logout
      </button>
    </div>
  );
}