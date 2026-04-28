import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Upgrade() {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (user?.role === 'premium') {
    return (
      <div style={{ padding: 20, textAlign: 'center', marginTop: 100 }}>
        <h2>⭐ You are already Premium!</h2>
        <p>Enjoy all the premium features!</p>
        <a href="/" style={{ color: '#4CAF50' }}>Go Home</a>
      </div>
    );
  }

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:5001/api/stripe/create-checkout-session',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
      <h2>⭐ Upgrade to Premium</h2>
      <p style={{ color: '#666' }}>Unlock all features for just €9.99</p>

      <div style={{ padding: 30, border: '2px solid #FFD700', borderRadius: 12, marginBottom: 20 }}>
        <h3 style={{ color: '#FFD700' }}>Premium Features</h3>
        <ul style={{ textAlign: 'left', lineHeight: 2 }}>
          <li>📊 Nutrition Dashboard</li>
          <li>⚡ BMR Calculator</li>
          <li>📝 Manual Food Logger</li>
          <li>🎯 Set Dietary Goals</li>
          <li>📈 Weekly nutrition tracking</li>
        </ul>
        <h2 style={{ color: '#4CAF50' }}>€9.99 / month</h2>
        <p style={{ fontSize: 12, color: '#666' }}>Or earn free premium via daily login streaks and coins!</p>
      </div>

      <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 8, marginBottom: 20 }}>
        <h3>🪙 Free Premium Options</h3>
        <p>🔥 Login 30 days in a row → 1 week free premium</p>
        <p>🪙 Collect 200 coins → 3 days free premium</p>
        <p>Current coins: <strong>{user?.coins || 0}</strong></p>
        <p>Current streak: <strong>{user?.streak || 0} days</strong></p>
      </div>

      <button
        onClick={handleUpgrade}
        disabled={loading}
        style={{
          padding: '15px 40px',
          background: loading ? '#ccc' : '#FFD700',
          color: 'black',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          borderRadius: 8,
          fontSize: 18,
          fontWeight: 'bold'
        }}
      >
        {loading ? 'Redirecting...' : '💳 Pay with Stripe'}
      </button>
    </div>
  );
}